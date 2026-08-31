# chai0

AI-powered web app generator. Describe what you want in natural language; a coding agent builds a real Next.js app in an isolated cloud sandbox. Iterate in chat, preview the live result, and browse the generated source.

Inspired by tools like v0 and Bolt.

## What it does

- **Prompt to app** — Submit a prompt from the home screen to create a project and kick off generation.
- **Sandboxed coding agent** — An Inngest agent writes files, reads the filesystem, and runs terminal commands inside an [E2B](https://e2b.dev) sandbox (Next.js + Tailwind + shadcn/ui template).
- **Live preview & code** — Split workspace: chat on the left; Demo (sandbox URL) and Code (file explorer) on the right.
- **Multi-turn follow-ups** — Send more messages in a project; the agent loads prior chat history and continues.
- **Project dashboard** — Authenticated users see their generated projects on the home page.
- **Auth** — Sign-in with [Clerk](https://clerk.com); users and projects are stored in PostgreSQL.

## Stack

| Layer | Tech |
| --- | --- |
| App | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Streamdown |
| Data | Prisma 7, PostgreSQL (`@prisma/adapter-pg`) |
| Auth | Clerk |
| Jobs / agents | Inngest + `@inngest/agent-kit` |
| Sandbox | E2B (`@e2b/code-interpreter`) |
| Client state | TanStack Query |
| LLM | OpenAI-compatible API (`OPENAI_API_KEY`) |

## Architecture

```
Browser  →  Next.js (Clerk, server actions)
                │
                ├─ Prisma / PostgreSQL  (users, projects, messages, fragments)
                │
                └─ Inngest event `code-agent/run`
                        │
                        ├─ Create / connect E2B sandbox
                        ├─ Agent loop (terminal, createOrUpdateFiles, readFiles)
                        ├─ Title + response agents
                        └─ Persist assistant message + fragment (sandbox URL, files)
```

Generation is **asynchronous**. Creating a project or message sends an Inngest event; the HTTP request does not wait for the model to finish. The UI polls/refetches messages until the fragment appears.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 11
- PostgreSQL (local or hosted)
- Clerk application
- OpenAI API key
- E2B account and API key
- Inngest Dev Server for local job execution

## Setup

```bash
pnpm install
```

Copy environment variables into `.env` (or `.env.local`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

OPENAI_API_KEY=
E2B_API_KEY=
```

Apply the schema and generate the Prisma client:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

## Run locally

You need **two processes**: the Next.js app and the Inngest Dev Server (so `code-agent/run` actually executes).

```bash
pnpm dev
```

In another terminal:

```bash
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in, enter a prompt, and you will be redirected to the project workspace while the agent runs.

The Inngest functions are served at `/api/inngest`.

## E2B sandbox template

Generated apps run in a custom template (`sandbox-templates/nextjs`): Bun, `create-next-app`, shadcn/ui, and a Next.js dev server on port 3000.

To rebuild the template (requires `E2B_API_KEY`):

```bash
npx tsx sandbox-templates/nextjs/build.ts
```

The template ID used at runtime is set in `src/features/inngest/function.ts` (`Sandbox.create`).

## Project layout

```
src/
  app/                    # Routes: home, sign-in, project workspace, Inngest API
  components/             # UI, home prompt, project chat / preview / file explorer
  features/
    auth/                 # Clerk ↔ User upsert
    projects/             # Create/list projects, Inngest trigger
    messages/             # Follow-up messages
    inngest/              # Agent function, tools, sandbox helpers
  lib/                    # Prisma client, agent system prompts
prisma/                   # Schema and migrations
sandbox-templates/nextjs/ # E2B image definition
```

## Data model (overview)

- **User** — Clerk identity, owns projects
- **Project** — Named workspace (slug), owns messages
- **Message** — User or assistant; result or error
- **Fragment** — Agent output: sandbox URL, title, generated files (JSON)

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Next.js development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm prisma migrate dev` | Run migrations |
| `pnpm prisma generate` | Generate Prisma Client |
