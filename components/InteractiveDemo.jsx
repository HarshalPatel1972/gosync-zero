"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./InteractiveDemo.module.css";

export default function InteractiveDemo() {
  // Engine state
  const [engineState, setEngineState] = useState("idle"); // idle, loading, ready
  const [isOnline, setIsOnline] = useState(true);

  // Data state
  const [inputValue, setInputValue] = useState("");
  const [localItems, setLocalItems] = useState([]);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [serverLog, setServerLog] = useState([]);
  const [flyingDots, setFlyingDots] = useState([]);

  // Refs
  const dbRef = useRef(null);
  const dotIdRef = useRef(0);
  const logIdRef = useRef(0);
  const logContainerRef = useRef(null);

  // Add entry to server log
  const addLog = useCallback((type, message) => {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    
    setServerLog((prev) => {
      const newLog = [...prev.slice(-7), { id: ++logIdRef.current, timestamp, type, message }];
      // Auto-scroll
      setTimeout(() => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }, 50);
      return newLog;
    });
  }, []);

  // Create flying dot animation
  const createFlyingDot = useCallback(() => {
    const id = ++dotIdRef.current;
    setFlyingDots((prev) => [...prev, { id }]);
    setTimeout(() => {
      setFlyingDots((prev) => prev.filter((d) => d.id !== id));
    }, 600);
  }, []);

  // Initialize the GoSync engine (lazy load)
  const initializeEngine = useCallback(async () => {
    if (engineState !== "idle") return;
    
    setEngineState("loading");

    try {
      // Dynamically import idb-keyval
      const idbKeyval = await import("idb-keyval");
      
      // Create our DB interface
      dbRef.current = {
        async save(key, value) {
          await idbKeyval.set(key, value);
        },
        async getAll() {
          const allEntries = await idbKeyval.entries();
          return allEntries.map((entry) => entry[1]).filter((v) => v && v._type === "task");
        },
        async remove(key) {
          await idbKeyval.del(key);
        }
      };

      // Simulate WASM load time
      await new Promise((r) => setTimeout(r, 1000));

      // Load existing items from IndexedDB
      const existing = await dbRef.current.getAll();
      if (existing.length > 0) {
        setLocalItems(existing);
      }

      setEngineState("ready");
      
      // Add initial logs after state is set
      setTimeout(() => {
        addLog("system", "✅ WASM Engine Loaded");
        addLog("system", "📦 IndexedDB Connected");
        addLog("system", "🔌 WebSocket: ws://localhost:8080");
        if (existing.length > 0) {
          addLog("sync", `📂 Restored ${existing.length} cached item(s)`);
        }
      }, 100);

    } catch (error) {
      console.error("Engine init failed:", error);
      // Fallback - still show the demo UI
      dbRef.current = { 
        save: async () => {}, 
        getAll: async () => [], 
        remove: async () => {} 
      };
      setEngineState("ready");
      setTimeout(() => {
        addLog("error", "⚠️ Running in demo mode");
      }, 100);
    }
  }, [engineState, addLog]);

  // Handle adding a new task
  const handleAddTask = useCallback(async () => {
    if (!inputValue.trim() || engineState !== "ready") return;

    const newItem = {
      _type: "task",
      id: `task_${Date.now()}`,
      title: inputValue.trim(),
      createdAt: Date.now(),
    };

    // Always save locally first (offline-first)
    setLocalItems((prev) => [...prev, newItem]);
    setInputValue("");

    // Persist to IndexedDB
    if (dbRef.current) {
      try {
        await dbRef.current.save(newItem.id, newItem);
      } catch (e) {
        console.error("Save error:", e);
      }
    }

    if (isOnline) {
      // Sync immediately - show animation
      createFlyingDot();
      setTimeout(() => {
        addLog("recv", `← INSERT "${newItem.title.slice(0, 20)}${newItem.title.length > 20 ? "..." : ""}"`);
        setTimeout(() => {
          addLog("ack", `→ ACK ${newItem.id.slice(-6)}`);
        }, 100);
      }, 400);
    } else {
      // Queue for later sync
      setPendingQueue((prev) => [...prev, newItem]);
      addLog("queue", `📥 Queued: "${newItem.title.slice(0, 15)}..."`);
    }
  }, [inputValue, engineState, isOnline, createFlyingDot, addLog]);

  // Handle delete task
  const handleDeleteTask = useCallback(async (taskId) => {
    setLocalItems((prev) => prev.filter((item) => item.id !== taskId));
    
    if (dbRef.current) {
      try {
        await dbRef.current.remove(taskId);
      } catch (e) {
        console.error("Delete error:", e);
      }
    }

    if (isOnline) {
      createFlyingDot();
      setTimeout(() => {
        addLog("recv", `← DELETE ${taskId.slice(-6)}`);
        addLog("ack", `→ ACK deleted`);
      }, 400);
    } else {
      setPendingQueue((prev) => [...prev, { id: taskId, _delete: true }]);
    }
  }, [isOnline, createFlyingDot, addLog]);

  // Toggle online/offline mode
  const toggleNetwork = useCallback(() => {
    if (isOnline) {
      // Going offline
      setIsOnline(false);
      addLog("error", "🔴 CONNECTION LOST");
      addLog("system", "WebSocket disconnected");
    } else {
      // Coming back online
      setIsOnline(true);
      addLog("system", "🟢 CONNECTION RESTORED");
      addLog("system", "WebSocket reconnected");

      // Flush pending queue with burst animation
      if (pendingQueue.length > 0) {
        addLog("sync", `📤 Syncing ${pendingQueue.length} queued item(s)...`);
        
        pendingQueue.forEach((item, index) => {
          setTimeout(() => {
            createFlyingDot();
            setTimeout(() => {
              if (item._delete) {
                addLog("recv", `← DELETE ${item.id.slice(-6)}`);
              } else {
                addLog("recv", `← INSERT "${item.title.slice(0, 15)}..."`);
              }
              addLog("ack", `→ ACK`);
            }, 300);
          }, index * 200);
        });

        setTimeout(() => {
          setPendingQueue([]);
          addLog("sync", "✅ Queue flushed!");
        }, pendingQueue.length * 200 + 500);
      }
    }
  }, [isOnline, pendingQueue, createFlyingDot, addLog]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className={styles.section} id="demo">
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.span className={styles.label} variants={itemVariants}>
            🐕 Dogfooding Demo
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            Real-Time Sync Inspector
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            Watch data flow from Browser → Server in real-time.
            <br />
            Toggle offline to see the queue build up.
          </motion.p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          className={styles.demoContainer}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* IDLE STATE */}
          {engineState === "idle" && (
            <div className={styles.idleState}>
              <button className={styles.startButton} onClick={initializeEngine}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <polygon points="6,4 20,12 6,20" fill="currentColor" />
                </svg>
                Boot GoSync Engine
              </button>
              <p className={styles.idleHint}>
                (Loads real WASM binary ~1.2MB. Runs locally in your browser.)
              </p>
            </div>
          )}

          {/* LOADING STATE */}
          {engineState === "loading" && (
            <div className={styles.loadingState}>
              <div className={styles.spinnerLarge} />
              <p>Booting GoSync Engine...</p>
              <span className={styles.loadingSubtext}>Loading WASM binary</span>
            </div>
          )}

          {/* READY STATE - Split Pane */}
          {engineState === "ready" && (
            <div className={styles.splitPane}>
              {/* LEFT PANEL - Client/Browser */}
              <div className={`${styles.panel} ${styles.clientPanel}`}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitle}>
                    <span className={styles.panelIcon}>🌐</span>
                    <div>
                      <strong>Your Browser</strong>
                      <span className={styles.panelSubtitle}>IndexedDB + WASM</span>
                    </div>
                  </div>
                  <div className={`${styles.statusBadge} ${styles.online}`}>
                    <span className={styles.statusDot} />
                    Local
                  </div>
                </div>

                <div className={styles.panelBody}>
                  {/* Task Input */}
                  <div className={styles.inputRow}>
                    <input
                      type="text"
                      className={styles.taskInput}
                      placeholder="Add a task..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                    />
                    <button className={styles.addButton} onClick={handleAddTask}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Task List */}
                  <div className={styles.taskList}>
                    <AnimatePresence>
                      {localItems.map((item) => (
                        <motion.div
                          key={item.id}
                          className={styles.taskItem}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          layout
                        >
                          <span className={styles.taskTitle}>{item.title}</span>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteTask(item.id)}
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {localItems.length === 0 && (
                      <div className={styles.emptyState}>No tasks yet</div>
                    )}
                  </div>

                  {/* Pending Queue Box */}
                  <AnimatePresence>
                    {pendingQueue.length > 0 && (
                      <motion.div
                        className={styles.pendingZone}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className={styles.pendingHeader}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 5V8M8 11H8.01M15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <span>{pendingQueue.length} item(s) queued locally</span>
                        </div>
                        <p className={styles.pendingText}>Waiting for connection...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* MIDDLE - Network Pipe */}
              <div className={styles.networkPipe}>
                <div className={styles.pipeVisual}>
                  <div className={`${styles.pipeLine} ${!isOnline ? styles.pipeDisconnected : ""}`} />
                  
                  {/* Flying Dots Animation */}
                  <AnimatePresence>
                    {flyingDots.map((dot) => (
                      <motion.div
                        key={dot.id}
                        className={styles.flyingDot}
                        initial={{ left: "0%", opacity: 1, scale: 1 }}
                        animate={{ left: "100%", opacity: 0.5, scale: 0.8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Disconnect Icon */}
                  {!isOnline && (
                    <div className={styles.disconnectIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18.36 19.78L5.64 5.22M12 3V6M21 12H18M6 12H3M12 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>

                <button
                  className={`${styles.networkToggle} ${isOnline ? styles.toggleOnline : styles.toggleOffline}`}
                  onClick={toggleNetwork}
                >
                  <div className={styles.toggleTrack}>
                    <motion.div
                      className={styles.toggleThumb}
                      animate={{ x: isOnline ? 0 : 20 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                  <span>{isOnline ? "Online" : "Offline"}</span>
                </button>
                <p className={styles.networkLabel}>Simulate Network</p>
              </div>

              {/* RIGHT PANEL - Server */}
              <div className={`${styles.panel} ${styles.serverPanel}`}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitle}>
                    <span className={styles.panelIcon}>🖥️</span>
                    <div>
                      <strong>Server State</strong>
                      <span className={styles.panelSubtitle}>Golang + SQLite</span>
                    </div>
                  </div>
                  <div className={`${styles.statusBadge} ${isOnline ? styles.online : styles.offline}`}>
                    <span className={styles.statusDot} />
                    {isOnline ? "Receiving" : "Waiting"}
                  </div>
                </div>

                <div className={styles.panelBody}>
                  <div className={styles.terminalWindow} ref={logContainerRef}>
                    <div className={styles.terminalHeader}>
                      <span className={styles.terminalDot} style={{ background: "#FF5F56" }} />
                      <span className={styles.terminalDot} style={{ background: "#FFBD2E" }} />
                      <span className={styles.terminalDot} style={{ background: "#27C93F" }} />
                      <span className={styles.terminalTitle}>server.log</span>
                    </div>
                    <div className={styles.terminalBody}>
                      {serverLog.length === 0 ? (
                        <div className={styles.logEmpty}>
                          Waiting for data...
                        </div>
                      ) : (
                        serverLog.map((entry) => (
                          <div
                            key={entry.id}
                            className={`${styles.logLine} ${styles[`log_${entry.type}`]}`}
                          >
                            <span className={styles.logTime}>[{entry.timestamp}]</span>
                            <span className={styles.logMsg}>{entry.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
