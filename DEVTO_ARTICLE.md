---
title: I Got Tired of Duplicating Business Logic, So I Compiled Go to WASM and Ran It in the Browser
published: false
description: How I built GoSync - a sync engine that runs the same Go code on your server AND in the browser via WebAssembly.
tags: ["go", "webassembly", "opensource", "showdev"]
cover_image: https://gosync-zero.vercel.app/cover-image.png
---

We have all been there.

You spend Monday writing complex form validation logic in JavaScript for your frontend. You check for email formats, negative numbers, and required fields. Then, you spend Tuesday writing the *exact same logic* in Go (or Python/Node) for your backend API.

The problem? Six months later, you update the backend rule but forget the frontend. Suddenly, your UI says "Success!" but your API throws a `400 Bad Request`. Users are confused. You are frustrated.

I got tired of this "Two-Language Drift." I wanted a way to write my business logic **once in Go** and have it run everywhere—on the server and inside the user's browser.

**So, I built GoSync.**

---

## The "Shared Brain" Architecture

The idea was simple but ambitious: *What if the browser was just another Go node?*

By compiling Go to WebAssembly (WASM), I realized I could run the **exact same structs and validation functions** on the client side.

### The Old Way (Duplication Hell):

```javascript
// Frontend (JS) - Maintained by Team A
function validateTask(task) {
  if (!task.title) throw "Title required";
  // ... more logic
}
```

```go
// Backend (Go) - Maintained by Team B
func ValidateTask(t Task) error {
    if t.Title == "" {
        return errors.New("required")
    }
    // ... logic duplicated
}
```

### The GoSync Way:

I defined a `Syncable` interface. You write your logic once in a shared Go package. The server runs it natively; the browser runs it via WASM.

```go
// shared/logic.go
// Compiled to BOTH Native Binary and WASM
func Validate(t *Task) error {
    // This code runs in your Chrome tab AND your Linux server
    if t.Title == "" {
        return errors.New("required")
    }
    return nil
}
```

---

## The Hard Part: `syscall/js` and Merkle Trees

Getting Go to talk to the browser isn't exactly plug-and-play yet.

### 1. The Bridge (Go ↔ JS)

I had to heavily utilize `syscall/js` to bridge the Go runtime with the browser's IndexedDB. The biggest challenge was the **single-threaded nature of WASM**. If you aren't careful, a heavy Go routine can deadlock the browser UI.

I ended up writing a custom async wrapper to handle the I/O without freezing the DOM.

### 2. The Sync Protocol (Merkle Trees)

Sending the whole database back and forth is a bandwidth killer. To make this "Local-First," I implemented a **Merkle Tree synchronization protocol**.

Here's how it works:

1. Both the client (IndexedDB) and Server (SQLite) maintain a hash tree of their data.
2. When they connect, they compare the **"Root Hash."**
3. If it matches? **Zero data sent.**
4. If it differs? They drill down the branches to find exactly which record changed (the **delta**) and swap only that item.

It's efficient, fast, and mathematically guarantees consistency.

```
┌─────────────────────────────────────────┐
│              Root Hash                  │
│  (Changes if ANY child changes)         │
└───────────────────┬─────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   ┌─────────┐             ┌─────────┐
   │ Branch A│             │ Branch B│
   └────┬────┘             └────┬────┘
        │                       │
    ┌───┴───┐               ┌───┴───┐
    ▼       ▼               ▼       ▼
 [Leaf1] [Leaf2]         [Leaf3] [Leaf4]
  ✓ Same  ✓ Same         ✗ DIFF!  ✓ Same
                          ↑
                    Only this syncs!
```

---

## The "Ah-Ha" Moment: Dogfooding

I didn't want to just write a library; I wanted to **prove it works**. So I built the documentation website using the engine itself.

When you visit the site, it actually:

1. Downloads the WASM binary (~1.2MB)
2. Boots up the Go engine in your browser
3. Connects to a test server via WebSocket

You can type in one box (Client A), and watch it sync to the "Server" visualization in **real-time**.

![GoSync Interactive Demo](https://gosync-zero.vercel.app/demo-screenshot.png)

You can even simulate **"Offline Mode"** on the site. You'll see the data get queued locally in IndexedDB, and the second you toggle "Online," the Merkle sync kicks in and flushes the queue.

---

## Try it out (and roast my code)

GoSync is currently in **Public Beta (v1.0)**.

I am specifically looking for feedback on my `syscall/js` implementation. I suspect there might be a performance bottleneck there during high-throughput writes, and I'd love to hear from other Go WASM hackers.

### 🔗 Links

- **Live Demo & Docs:** [gosync-zero.vercel.app](https://gosync-zero.vercel.app)
- **Source Code:** [github.com/HarshalPatel1972/GoSync](https://github.com/HarshalPatel1972/GoSync)

---

## Features

| Feature | Description |
|---------|-------------|
| 🔌 **True Offline** | Works without internet using IndexedDB |
| ⚡ **Delta Sync** | Merkle Trees ensure only changed data is transferred |
| 🔒 **Self-Hosted** | No third-party cloud, your data stays yours |
| 🎯 **Last-Write-Wins** | Simple, predictable conflict resolution |
| 🌍 **Cross-Platform** | Same Go logic runs on browser (WASM) and server |

---

Let me know what you think! I'm happy to answer questions about the WASM bridge, the sync protocol, or any architectural decisions.

---

*Built with Go, WASM, and too much ☕ by [Harshal Patel](https://github.com/HarshalPatel1972)*
