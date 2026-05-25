<p align="center">
  <img src="https://devme.sh/logo.png" alt="devme" width="120">
</p>

<h3 align="center"><a href="https://devme.sh">devme.sh</a></h3>

<p align="center">
  Product website for <a href="https://github.com/devme-sh/devme">devme</a> — the dev-stack supervisor.
</p>

---

## Stack

- [TanStack Start](https://tanstack.com/start) + React 19
- [webtui/CSS](https://github.com/nicholasgasior/webtui) for terminal-inspired styling
- [Better Auth](https://www.better-auth.com) for authentication
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL
- [PostHog](https://posthog.com) for analytics
- Deployed via [Nitro](https://nitro.build)

## Development

```bash
npm install
npm run dev         # http://localhost:3000
```

## Build

```bash
npm run build
node dist/server/index.mjs
```

## Database

```bash
npm run db:push     # apply schema to local DB
npm run db:studio   # open Drizzle Studio
```
