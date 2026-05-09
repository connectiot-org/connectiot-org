# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Project Setup
1. Clone the repository and install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
2. Environment variables:
   - Copy `.env.example` to `.env` in both `client/` and `server/` directories and fill in the required values (Supabase, Cloudinary, JWT secret, etc.).
3. Database setup:
   - Run the SQL migration found in `database/migrations/001_initial_schema.sql` (create this directory and file if not present) against your Supabase PostgreSQL database.

### Development
- **Client (React + Vite):**
  ```bash
  cd client
  npm run dev   # starts Vite dev server at http://localhost:5173
  ```
- **Server (Node.js + Express + TypeScript):**
  ```bash
  cd server
  npm run dev   # starts server with nodemon/ts-node at http://localhost:3001
  ```
  Alternatively, to build and run:
  ```bash
  npm run build   # compiles TypeScript to JavaScript in dist/
  npm start       # runs the compiled server (node dist/index.js)
  ```

### Building for Production
- **Client:**
  ```bash
  cd client
  npm run build   # outputs to dist/
  ```
- **Server:**
  ```bash
  cd server
  npm run build   # compiles TypeScript to JavaScript
  ```
  The built server can be run with `node dist/index.js`.

### Linting and Testing
*No linting or testing commands are currently configured in the project. Consider adding ESLint, Prettier, and Jest/Vitest as needed.*

## Code Architecture and Structure

### High-Level Overview
JhatsApp is a monorepo real-time messaging application inspired by WhatsApp Web, split into two main parts:

1. **Client (`client/`)** – React 18 + TypeScript frontend built with Vite, Tailwind CSS, Zustand for state management, Socket.IO client for real-time communication, and React Query for data fetching.
2. **Server (`server/`)** – Node.js + Express + TypeScript backend providing REST API endpoints and Socket.IO server for real-time events. Uses Supabase (PostgreSQL) as the primary database, bcrypt for password hashing, JSON Web Tokens for authentication, and Cloudinary for media storage.

### Key Architectural Decisions
- **Real-time Communication:** Socket.IO establishes persistent bidirectional connections between client and server for instant message delivery, typing indicators, read receipts, and online/offline presence.
- **State Management:** Zustand stores manage global state:
  - `authStore`: user authentication state and token.
  - `chatStore`: conversations, active conversation, messages, typing users, and search query.
  - `uiStore`: UI state such as dark mode and mobile menu visibility.
- **Data Flow:**
  - Initial data (users, conversations) fetched via REST API (`/api/*` endpoints).
  - Real-time updates (new messages, typing status, etc.) pushed via Socket.IO events.
  - Outgoing messages and actions (send message, typing start/stop, mark as read) sent via Socket.IO to the server, which persists to the database and broadcasts to other clients.
- **Folder Structure** (as defined in the README):
  ```
  jhatsapp/
  ├── client/                          # React Frontend
  │   ├── src/
  │   │   ├── components/              # Reusable UI components (sidebar, chat, profile, etc.)
  │   │   ├── hooks/                   # Custom React hooks (useSocket, useMessages, etc.)
  │   │   ├── pages/                   # Page components (AuthPage, ChatPage, etc.)
  │   │   ├── store/                   # Zustand stores (auth, chat, ui)
  │   │   ├── types/                   # TypeScript interfaces and types
  │   │   ├── utils/                   # Utility functions (date formatting, notifications, etc.)
  │   │   ├── App.tsx
  │   │   └── main.tsx
  │   ├── package.json
  │   ├── tailwind.config.js
  │   ├── tsconfig.json
  │   └── vite.config.ts
  │
  ├── server/                          # Node.js Backend
  │   ├── src/
  │   │   ├── config/                  # Configuration (Supabase, Cloudinary, Socket.IO)
  │   │   ├── controllers/             # Request handlers (auth, message, conversation, etc.)
  │   │   ├── middleware/              # Custom middleware (auth, error handling)
  │   │   ├── models/                  # TypeScript interfaces (if using TypeORM/sequelize, but here using Supabase directly)
  │   │   ├── routes/                  # API route definitions
  │   │   ├── sockets/                 # Socket.IO event handlers (message, typing, presence)
  │   │   ├── utils/                   # Helper functions (jwt, bcrypt, response formatting)
  │   │   └── index.ts                 # Entry point
  │   ├── package.json
  │   └── tsconfig.json
  │
  ├── .env.example
  ├── .gitignore
  ├── README.md                        # This file (the main build guide)
  └── database/
      └── migrations/
          └── 001_initial_schema.sql   # Supabase SQL schema
  ```

### Important Notes for Claude Code
- When generating or modifying code, adhere to the existing patterns and conventions seen in the README's step-by-step prompts.
- The client uses Tailwind CSS with a dark mode preference; ensure new components use the appropriate utility classes from the JhatsApp color palette.
- Server-side validation and error handling should follow the existing controller and middleware patterns.
- Any new Socket.IO events should be added to the `socket.types.ts` (if created) and handled in the appropriate socket handler file.
- Environment variables are critical for configuration; never hardcode secrets or keys.
- The project is designed to be extensible; follow the modular structure when adding new features (e.g., new controllers, routes, socket handlers, and client components/services).

This CLAUDE.md is intended to help future instances of Claude Code quickly understand how to work with the JhatsApp codebase. For detailed step-by-step instructions, refer to the README.md.