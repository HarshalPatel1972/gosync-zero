<div align="center">

# 🔄 GoSync Website

### The website and documentation for [GoSync](https://github.com/HarshalPatel1972/GoSync)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

[Website](https://gosync-zero.vercel.app) · [Documentation](https://gosync-zero.vercel.app/docs) · [GoSync on GitHub](https://github.com/HarshalPatel1972/GoSync) · [npm package](https://www.npmjs.com/package/@harshalpatel2868/gosync-client)

</div>

---

## What is GoSync?

GoSync is an **offline-first, real-time sync engine for web apps** that you host yourself. Your
app reads and writes a local database in the browser, so it's instant and works offline. GoSync
syncs changes to your server and to the user's other devices and tabs in real time, and resolves
conflicts automatically. The server is a single Go binary on SQLite or PostgreSQL.

```javascript
import { createClient } from '@harshalpatel2868/gosync-client';

const db = await createClient({ url: 'wss://sync.example.com/sync', getToken: () => auth.getIdToken() });

await db.set('todos', crypto.randomUUID(), { title: 'Buy milk', done: false }); // works offline
db.watch('todos', (todos) => render(todos)); // live across tabs and devices
```

The engine itself, its source, releases and issue tracker live in
[HarshalPatel1972/GoSync](https://github.com/HarshalPatel1972/GoSync). This repository is only the website.

## What's in this repo

| Path | Contents |
|------|----------|
| `app/` | Next.js App Router pages: home, `/docs/[slug]`, `/examples` |
| `components/` | Homepage sections and docs UI |
| `content/docs/` | Documentation pages in MDX (one file per page) |

The homepage's sync animation is a simulation that runs entirely in the browser. It shows how
GoSync behaves but doesn't connect to a server. The runnable demo is
[`examples/todo`](https://github.com/HarshalPatel1972/GoSync/tree/main/examples/todo) in the main repo.

## Development

```bash
git clone https://github.com/HarshalPatel1972/GoSync-zero.git
cd GoSync-zero
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Editing the docs

Each docs page is an MDX file in `content/docs/`. To add a page:

1. Create `content/docs/NN-your-page.mdx` with `title` and `description` front matter.
2. Map its slug to the file in `slugToFile` in `app/docs/[[...slug]]/page.js`.
3. Add it to `navItems` in `components/docs/DocsSidebar.jsx`.

Keep code samples in sync with the real client API
([`sdk/js/index.d.ts`](https://github.com/HarshalPatel1972/GoSync/blob/main/sdk/js/index.d.ts))
and the server configuration
([`docs/OPERATIONS.md`](https://github.com/HarshalPatel1972/GoSync/blob/main/docs/OPERATIONS.md)).

## Contributing

Contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) first.

## License

MIT. See [LICENSE](LICENSE).

<div align="center">

**Built by [Harshal Patel](https://github.com/HarshalPatel1972)**

</div>
