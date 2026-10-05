---
title: I Rebuilt My Go Sync Engine From Scratch. Here's What v1 Got Wrong.
published: false
description: GoSync v2 is an offline-first, real-time sync engine for web apps. What broke in v1, how v2 fixes it (outboxes, cursors, hybrid logical clocks), and how I tested it in real browsers and under load.
tags: ["go", "webdev", "javascript", "opensource"]
cover_image: https://gosync-zero.vercel.app/og-image.jpg
---

A few months ago I wrote about [GoSync](https://github.com/HarshalPatel1972/GoSync), my experiment in compiling Go to WebAssembly and running a sync engine in the browser.

The demo worked. You could add a todo, kill the server, refresh, restart, and everything synced. People liked it.

Then I asked myself a harder question: **would I let real users put real data in it?**

The honest answer was no. So I rebuilt it. GoSync **v2.0** is out, and this post is about what was wrong, what replaced it, and how I convinced myself the new version actually works.

---

## What v1 got wrong

Looking back at v1 with "production" eyes was humbling.

**1. No authentication, one shared dataset.** Every client could read and overwrite every other client's data. Fine for a demo; a non-starter for anything else.

**2. Old data could overwrite new data.** When hashes didn't match, the server saved whatever the client sent. A phone that had been offline for a week could come back and silently replace edits made on your laptop that morning.

**3. Every change re-sent everything.** v1 compared a single hash of the whole dataset. On any mismatch, both sides exchanged *all* of their data. That's fine for 10 todos and painful for 10,000.

**4. "Real-time" wasn't.** Other devices only saw changes when they happened to run their own check.

**5. The server address was hardcoded to `localhost`.**

None of these are exotic bugs. They're the reasons sync is a hard problem, and they're why most teams reach for Firebase instead of building it themselves.

---

## The v2 design

I threw away the protocol and rebuilt it on the model modern sync engines use: **push, pull, poke**.

### 1. Writes go to a local outbox first

```javascript
await db.set('todos', id, { title: 'Ship v2', done: false });
```

That single call updates IndexedDB *and* appends the write to a local outbox, in one transaction. The UI updates instantly, offline or not. The outbox survives reloads, crashes and restarts, so nothing is lost until the server confirms it.

### 2. Push: send only your own pending writes

When online, the client uploads its outbox. Every write carries a client-assigned ID, and the server remembers the last ID it applied per device. Retries and duplicate messages are harmless; the server skips anything it has already seen.

### 3. Pull: download only what changed

The server keeps a version number per user. Each changed field is tagged with the version that changed it. Clients remember a **cursor** (the last version they saw) and ask for everything after it. A device that was offline for a month downloads one month of changes, not the whole database.

### 4. Poke: real-time without polling

When data changes, the server sends a tiny "poke" to that user's other connected devices, and they pull immediately. With several server instances on PostgreSQL, the pokes travel between servers via `LISTEN/NOTIFY`, so your phone and laptop can be connected to different servers and still sync in milliseconds.

---

## Conflicts: per-field last-writer-wins on hybrid logical clocks

The question everyone asks: *what happens when two devices edit the same thing offline?*

GoSync treats **every field of every document** as its own register. If you rename a task on your phone while marking it done on your laptop, both edits survive. Only when two devices change the *same field* does one win.

"Wins" means "was written later," and that's where it gets interesting, because device clocks lie. Phones drift. Laptops are minutes off. So GoSync orders writes with a **hybrid logical clock**, which combines wall-clock time with a counter:

- It never goes backwards, even when the device clock does.
- If you *see* someone's edit and then change it, your edit is ordered after theirs, even if your clock is behind.
- Clients estimate the server's time on connect, and the server rejects timestamps far in the future, so a broken clock can't win every conflict.

Because the merge rule is deterministic, every device converges to exactly the same state, regardless of message order, duplicates or how long anyone was offline.

---

## Things I didn't expect to need

**Multi-tab.** Open your app in three tabs and you'd have three WebSocket connections fighting over one IndexedDB database. v2 elects one leader tab with the Web Locks API; the others share the database and get updates over a BroadcastChannel. Close the leader and another tab takes over.

**Deleted documents that never die.** A delete has to be remembered so other devices learn about it. Remember them forever and your database only grows. Forget them too early and a device that was offline the whole time brings the document back to life. v2 compacts old deletes into a tiny "purge record" that still syncs and still blocks stale writes from resurrecting the document.

**Restoring from a backup.** If you restore your database from last night's backup, version numbers go backwards, and devices with newer cursors would silently skip the next day's writes. v2 versions are derived from the clock, so they keep increasing even across a restore. I only found this one while writing the backup docs, which is a good argument for writing docs.

---

## How I tested it

I didn't want "it works on my machine." So:

- **Real browsers.** Playwright drives Chromium, Firefox and WebKit through multi-tab leader election, failover when the leader tab closes, and persistence across restarts.
- **The real SDK.** The published npm package, installed fresh into a Vite app, syncing against the released server binary.
- **Load.** A load generator simulates thousands of devices and measures how long a write takes to appear on the user's other devices:

| Setup | Devices | Writes/s | p50 | p99 |
|---|---|---|---|---|
| SQLite, 1 server | 2,000 | 1,048 | 2.8 ms | 92 ms |
| PostgreSQL, 2 servers | 600 | 611 | 13 ms | 110 ms |

Every run delivered 100% of writes with zero errors, including past saturation, where it slows down instead of losing data. The PostgreSQL run is in CI on every push.

The load tests also caught real bugs: a SQLite tail latency of **4.5 seconds** (fixed with group commit, background checkpoints and prepared statements; p99 is now under 100 ms), and a PostgreSQL bottleneck I'd never heard of, where every transaction that sends a `NOTIFY` is serialised behind a database-wide lock. Batching notifications fixed it.

---

## Try it

```bash
npm install @harshalpatel2868/gosync-client
```

```javascript
import { createClient } from '@harshalpatel2868/gosync-client';

const db = await createClient({
  url: 'wss://your-server.example.com/sync',
  getToken: () => auth.getIdToken(), // Auth0, Clerk, Supabase, Firebase... (JWKS)
  dbName: `app-${user.id}`,
});

await db.set('todos', crypto.randomUUID(), { title: 'Buy milk', done: false });
db.watch('todos', (todos) => render(todos)); // local, other tabs, other devices
```

The server is a single Go binary (Linux, macOS, Windows) on SQLite or PostgreSQL. It's MIT licensed and self-hosted, with no per-seat pricing.

**What it's not for:** collaborative editing of the *same* text (use Yjs or Automerge), or syncing huge shared datasets to every user.

### 🔗 Links

- **Docs:** [gosync-zero.vercel.app/docs](https://gosync-zero.vercel.app/docs)
- **Source:** [github.com/HarshalPatel1972/GoSync](https://github.com/HarshalPatel1972/GoSync)
- **npm:** [@harshalpatel2868/gosync-client](https://www.npmjs.com/package/@harshalpatel2868/gosync-client)

---

I'd love feedback, especially from anyone who has built sync before and has scars to show for it. What would you need before using something like this in production?

---

*Built with Go, WebAssembly, and a healthy fear of losing user data, by [Harshal Patel](https://github.com/HarshalPatel1972)*
