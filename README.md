<div align="center">

# 🔄 GoSync

### Offline-First Sync Engine for Modern Web Apps

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**Write once. Run everywhere. Sync automatically.**

[Live Demo](https://gosync.io) · [Documentation](https://gosync.io/docs) · [NPM Package](https://www.npmjs.com/package/@harshalpatel2868/gosync-client)

</div>

---

## ✨ What is GoSync?

GoSync is an **offline-first synchronization engine** that solves the "Two-Language Problem" in modern web development. Most sync solutions force you to duplicate business logic — writing validation in JavaScript for the frontend and again in Go/Node/Python for the backend.

**GoSync eliminates this** by running a **Shared Brain**:
- 🧠 Write conflict resolution logic **once in Go**
- 🌐 Compile to **WASM** for browsers, native binary for servers
- 📡 Uses **Merkle Trees** for bandwidth-efficient delta sync
- 💾 True offline with **IndexedDB** persistence

---

## 🚀 Quick Start

```bash
# Install the SDK
npm install @harshalpatel2868/gosync-client
```

```javascript
import { GoSync } from '@harshalpatel2868/gosync-client';

// Initialize
await GoSync.init({
  url: 'ws://localhost:8080/sync',
  debug: true
});

// Add data (saved to IndexedDB immediately)
await GoSync.add('todos', {
  id: 'uuid-1234',
  title: 'Buy groceries',
  completed: false,
  updated_at: new Date().toISOString()
});

// Subscribe to changes
GoSync.subscribe('todos', (data) => {
  console.log('Data synced:', data);
});
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │  Your App   │───▶│  GoSync SDK  │───▶│   IndexedDB   │  │
│  └─────────────┘    └──────────────┘    └───────────────┘  │
│                            │                                 │
│                     ┌──────▼──────┐                         │
│                     │  WASM Core  │                         │
│                     │ (Merkle Tree)│                         │
│                     └──────┬──────┘                         │
└────────────────────────────┼────────────────────────────────┘
                             │ WebSocket
┌────────────────────────────▼────────────────────────────────┐
│                        Server (Go)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐ │
│  │  Sync Engine │───▶│  Merkle Tree │───▶│   Database    │ │
│  └──────────────┘    └──────────────┘    │ (SQLite/PG)   │ │
│                                          └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Features

| Feature | Description |
|---------|-------------|
| **🔌 True Offline** | Works without internet using IndexedDB |
| **⚡ Delta Sync** | Merkle Trees ensure only changed data is transferred |
| **🔒 Self-Hosted** | No third-party cloud, your data stays yours |
| **🎯 Last-Write-Wins** | Simple, predictable conflict resolution |
| **🌍 Cross-Platform** | Same Go logic runs on browser (WASM) and server |

---

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/HarshalPatel1972/gosync-zero.git
cd gosync-zero

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📚 Documentation

Visit our [documentation](https://gosync.io/docs) for:

- [Introduction](https://gosync.io/docs/introduction) - Why GoSync?
- [Quick Start](https://gosync.io/docs/quick-start) - Get started in 5 minutes
- [Server Setup](https://gosync.io/docs/server-setup) - Deploy the Go server
- [Conflict Resolution](https://gosync.io/docs/conflict-resolution) - Understanding LWW

---

## 🗺️ Roadmap

| Version | Status | Features |
|---------|--------|----------|
| v0.1.0 | ✅ Released | Core offline sync, IndexedDB, WebSocket |
| v0.2.0 | 🚧 In Progress | CRDT support, React hooks |
| v0.3.0 | 📋 Planned | Multi-tab sync, Service Worker |
| v1.0.0 | 🎯 Future | Production-ready, full test coverage |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Harshal Patel](https://github.com/HarshalPatel1972)**

⭐ Star this repo if you find it useful!

</div>
