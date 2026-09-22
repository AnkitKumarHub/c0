# c0

**Describe it. Build it. Ship it.**

c0 is a website where you describe the app you want in normal sentences, and an AI assistant builds a working preview you can open in the browser and keep improving through chat.

Similar in spirit to tools like v0 or Bolt — you talk; the product builds.

## What you can do

- **Sign in** and keep your projects in one place
- **Describe** what you want built (a landing page, dashboard, form, and more)
- Watch a **live preview** appear as the assistant works
- **Chat** to change or extend the app — no need to start over
- **Browse the generated code** alongside the preview in the workspace

## Who this is for

- Founders and builders who want a working prototype fast
- Designers and product people exploring an idea without writing code
- Developers experimenting with AI-assisted app building

## How it works

| Step | What happens |
| --- | --- |
| **1. Describe** | You write what you want, like emailing a developer a brief. |
| **2. Generate** | An AI coding assistant builds the app in the cloud — you don’t install anything to run the build. |
| **3. Preview and refine** | You open the live preview, ask for changes in chat, and repeat. |

```mermaid
flowchart LR
  User[You] --> Site[c0 website]
  Site --> Chat[Chat]
  Site --> Preview[Live preview]
```

## What this repository is

This repo is the **source code for the c0 web application** itself — not an app that a user generated in a session. It is a full product: sign-in, saved projects, background jobs, and an AI coding assistant that builds and previews apps for you.

---

## Tech

Technical overview, architecture, and local setup.

- [Features](#features)
- [Stack](#stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Run locally](#run-locally)
- [E2B sandbox template](#e2b-sandbox-template)
- [Project layout](#project-layout)
- [Data model](#data-model-overview)
- [Scripts](#scripts)

### Features

- **Prompt to app** — Submit a prompt from the home screen to create a project and kick off generation.
- **Sandboxed coding agent** — An Inngest agent writes files, reads the filesystem, and runs terminal commands inside an [E2B](https://e2b.dev) sandbox (Next.js + Tailwind + shadcn/ui template).
- **Live preview & code** — Split workspace: chat on the left; Demo (sandbox URL) and Code (file explorer) on the right.
- **Multi-turn follow-ups** — Send more messages in a project; the agent loads prior chat history and continues.
- **Project dashboard** — Authenticated users see their generated projects on the home page.
- **Auth** — Sign-in with [Clerk](https://clerk.com); users and projects are stored in PostgreSQL.

### Stack

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

### Architecture

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

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 11
- PostgreSQL (local or hosted)
- Clerk application
- OpenAI API key
- E2B account and API key
- Inngest Dev Server for local job execution

### Setup

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

### Run locally

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

### E2B sandbox template

Generated apps run in a custom template (`sandbox-templates/nextjs`): Bun, `create-next-app`, shadcn/ui, and a Next.js dev server on port 3000.

To rebuild the template (requires `E2B_API_KEY`):

```bash
npx tsx sandbox-templates/nextjs/build.ts
```

The template ID used at runtime is set in `src/features/inngest/function.ts` (`Sandbox.create`).

### Project layout

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

### Data model (overview)

- **User** — Clerk identity, owns projects
- **Project** — Named workspace (slug), owns messages
- **Message** — User or assistant; result or error
- **Fragment** — Agent output: sandbox URL, title, generated files (JSON)

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Next.js development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm prisma migrate dev` | Run migrations |
| `pnpm prisma generate` | Generate Prisma Client |
