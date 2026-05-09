# 🟢 JhatsApp — AI Vibe Coding Full Build Guide (README.md)

> **Project:** JhatsApp — A WhatsApp Web-style real-time messaging web application  
> **Inspired UI:** https://jmail.world/messages (iMessage/WhatsApp-style conversation interface)  
> **Built With:** React + TypeScript + Tailwind CSS + Node.js + Socket.IO + Supabase/Firebase  
> **AI Coding Mode:** Vibe Coding (Cursor AI / Windsurf / Bolt / Lovable / ChatGPT)

---

## 🧠 HOW TO USE THIS FILE WITH AI (VIBE CODING INSTRUCTIONS)

Paste this entire README into your AI assistant (Cursor, Windsurf, Bolt, ChatGPT, Claude, etc.) and say:

> **"Follow this README step by step and build the JhatsApp project. Start with Step 1 and do not skip any section. Generate all files, folders, components, and code exactly as described."**

The AI will generate the full codebase for you step by step.

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [UI/UX Design Specification](#3-uiux-design-specification)
4. [Project Folder Structure](#4-project-folder-structure)
5. [Dataset & Data Schema](#5-dataset--data-schema)
6. [Step 1 — Project Setup](#step-1--project-setup)
7. [Step 2 — Backend Setup (Node.js + Socket.IO)](#step-2--backend-setup-nodejs--socketio)
8. [Step 3 — Database Setup (Supabase / Firebase)](#step-3--database-setup-supabase--firebase)
9. [Step 4 — Authentication System](#step-4--authentication-system)
10. [Step 5 — Frontend Layout (Sidebar + Chat Window)](#step-5--frontend-layout-sidebar--chat-window)
11. [Step 6 — Contacts & Conversation List](#step-6--contacts--conversation-list)
12. [Step 7 — Chat Window & Message Bubbles](#step-7--chat-window--message-bubbles)
13. [Step 8 — Real-Time Messaging (Socket.IO)](#step-8--real-time-messaging-socketio)
14. [Step 9 — Message Features](#step-9--message-features)
15. [Step 10 — Search Functionality](#step-10--search-functionality)
16. [Step 11 — Profile & Settings Panel](#step-11--profile--settings-panel)
17. [Step 12 — Dark Mode / Light Mode](#step-12--dark-mode--light-mode)
18. [Step 13 — Mobile Responsive Design](#step-13--mobile-responsive-design)
19. [Step 14 — Notifications](#step-14--notifications)
20. [Step 15 — Deployment](#step-15--deployment)
21. [Full Dataset Definitions](#full-dataset-definitions)
22. [Environment Variables](#environment-variables)
23. [AI Prompts Per Step](#ai-prompts-per-step)

---

## 1. PROJECT OVERVIEW

**JhatsApp** is a full-stack real-time messaging web application with:
- A **two-panel layout**: Left sidebar (contact/chat list) + Right chat window
- **iMessage/WhatsApp-style** conversation bubbles (sent = right/green, received = left/grey)
- **Real-time messaging** via WebSockets (Socket.IO)
- **User authentication** (email/password or phone)
- **Contact/conversation management**
- **Media sharing** (images, files, emojis)
- **Search** across messages and contacts
- **Dark mode + Light mode**
- **Fully responsive** (Desktop + Mobile)
- **Typing indicators**, **read receipts**, **online/offline status**

---

## 2. TECH STACK

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI Framework |
| Tailwind CSS v3 | Styling |
| React Router v6 | Routing |
| Zustand | State Management |
| Socket.IO Client | Real-time messaging |
| React Query | Data fetching |
| Lucide React | Icons |
| Emoji Mart | Emoji Picker |
| date-fns | Date formatting |
| Axios | HTTP client |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| Socket.IO | WebSocket real-time engine |
| Supabase (or Firebase) | Database + Auth + Storage |
| PostgreSQL (via Supabase) | Database |
| JWT | Token auth |
| Multer | File upload handler |
| Cloudinary | Media file storage |

### DevOps
| Tool | Purpose |
|------|---------|
| Vite | Frontend build tool |
| Vercel | Frontend deployment |
| Railway / Render | Backend deployment |
| GitHub Actions | CI/CD |

---

## 3. UI/UX DESIGN SPECIFICATION

### 🎨 Color Palette (WhatsApp/JhatsApp Theme)

```css
/* Primary Colors */
--brand-green:       #25D366;  /* Send button, active icons */
--brand-dark-green:  #128C7E;  /* Header background */
--brand-teal:        #075E54;  /* Sidebar header */

/* Chat Bubble Colors */
--bubble-sent:       #DCF8C6;  /* Light mode sent */
--bubble-received:   #FFFFFF;  /* Light mode received */
--bubble-sent-dark:  #005C4B;  /* Dark mode sent */
--bubble-received-dark: #202C33; /* Dark mode received */

/* Background Colors */
--bg-sidebar:        #111B21;  /* Dark sidebar */
--bg-chat:           #0B141A;  /* Dark chat background */
--bg-input:          #202C33;  /* Input area */
--bg-light:          #F0F2F5;  /* Light mode main bg */

/* Text Colors */
--text-primary:      #E9EDEF;
--text-secondary:    #8696A0;
--text-timestamp:    #667781;
```

### 📐 Layout Specification

```
┌─────────────────────────────────────────────────────┐
│                    JhatsApp                         │
├──────────────────┬──────────────────────────────────┤
│   SIDEBAR (30%)  │      CHAT WINDOW (70%)            │
│                  │                                   │
│ [Avatar] [Name]  │  [Avatar] [Name] [Status]  [Icons]│
│ [🔍 Search]      │─────────────────────────────────  │
│                  │                                   │
│ ┌──────────────┐ │   ┌─────────────────────┐        │
│ │ 👤 Contact 1 │ │   │ Hello! (received)   │        │
│ │ Last message │ │   └─────────────────────┘        │
│ │ 12:00 PM  ✓✓│ │                                   │
│ └──────────────┘ │       ┌─────────────────────┐    │
│ ┌──────────────┐ │       │ Hi there! (sent)    │    │
│ │ 👤 Contact 2 │ │       └─────────────────────┘    │
│ │ Last message │ │                                   │
│ └──────────────┘ │─────────────────────────────────  │
│                  │ [📎][😊] [Type a message...]  [🎤]│
└──────────────────┴──────────────────────────────────┘
```

### 📱 Mobile Layout (< 768px)
- Sidebar takes **full screen** (contact list)
- Tapping a contact opens **full screen chat window**
- Back button returns to sidebar

---

## 4. PROJECT FOLDER STRUCTURE

```
jhatsapp/
├── client/                          # React Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.png
│   ├── src/
│   │   ├── assets/                  # Images, SVGs
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── AuthLayout.tsx
│   │   │   ├── sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── SidebarHeader.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── ContactList.tsx
│   │   │   │   └── ContactItem.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── ChatHeader.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   ├── EmojiPicker.tsx
│   │   │   │   ├── FileUpload.tsx
│   │   │   │   ├── TypingIndicator.tsx
│   │   │   │   └── EmptyChat.tsx
│   │   │   ├── profile/
│   │   │   │   ├── ProfilePanel.tsx
│   │   │   │   └── UserAvatar.tsx
│   │   │   ├── common/
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Badge.tsx
│   │   │   └── layout/
│   │   │       ├── MainLayout.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSocket.ts
│   │   │   ├── useMessages.ts
│   │   │   ├── useContacts.ts
│   │   │   ├── useTyping.ts
│   │   │   └── useOnlineStatus.ts
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts               # Axios instance
│   │   │   ├── authService.ts
│   │   │   ├── messageService.ts
│   │   │   ├── contactService.ts
│   │   │   └── uploadService.ts
│   │   ├── store/
│   │   │   ├── authStore.ts         # Zustand auth store
│   │   │   ├── chatStore.ts         # Zustand chat store
│   │   │   ├── uiStore.ts           # UI state (dark mode, panels)
│   │   │   └── socketStore.ts       # Socket connection state
│   │   ├── types/
│   │   │   ├── user.types.ts
│   │   │   ├── message.types.ts
│   │   │   ├── conversation.types.ts
│   │   │   └── socket.types.ts
│   │   ├── utils/
│   │   │   ├── dateFormatter.ts
│   │   │   ├── fileValidator.ts
│   │   │   └── stringHelpers.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # Supabase client
│   │   │   ├── cloudinary.ts
│   │   │   └── socket.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── messageController.ts
│   │   │   ├── conversationController.ts
│   │   │   ├── contactController.ts
│   │   │   └── uploadController.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts    # JWT verification
│   │   │   ├── rateLimiter.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Message.ts
│   │   │   ├── Conversation.ts
│   │   │   └── Contact.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── messageRoutes.ts
│   │   │   ├── conversationRoutes.ts
│   │   │   ├── contactRoutes.ts
│   │   │   └── uploadRoutes.ts
│   │   ├── sockets/
│   │   │   ├── socketHandler.ts     # Main Socket.IO handler
│   │   │   ├── messageSocket.ts
│   │   │   ├── typingSocket.ts
│   │   │   └── presenceSocket.ts
│   │   ├── utils/
│   │   │   ├── jwtHelper.ts
│   │   │   ├── bcryptHelper.ts
│   │   │   └── responseHelper.ts
│   │   └── index.ts                 # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example
├── .gitignore
├── docker-compose.yml               # Optional
└── README.md                        # This file
```

---

## 5. DATASET & DATA SCHEMA

### 📊 Database Tables (PostgreSQL via Supabase)

#### `users` table
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  avatar_url    TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  status_text   TEXT DEFAULT 'Hey there! I am using JhatsApp',
  is_online     BOOLEAN DEFAULT false,
  last_seen     TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `conversations` table
```sql
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            VARCHAR(10) DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  name            VARCHAR(100),              -- Only for groups
  avatar_url      TEXT,                      -- Only for groups
  created_by      UUID REFERENCES users(id),
  last_message_id UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `conversation_participants` table
```sql
CREATE TABLE conversation_participants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(10) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);
```

#### `messages` table
```sql
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES users(id),
  content         TEXT,
  type            VARCHAR(20) DEFAULT 'text' 
                  CHECK (type IN ('text','image','video','audio','file','emoji','system')),
  file_url        TEXT,
  file_name       TEXT,
  file_size       INTEGER,
  reply_to_id     UUID REFERENCES messages(id),
  is_deleted      BOOLEAN DEFAULT false,
  is_edited       BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `message_status` table
```sql
CREATE TABLE message_status (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  status      VARCHAR(10) DEFAULT 'sent' CHECK (status IN ('sent','delivered','read')),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);
```

#### `contacts` table
```sql
CREATE TABLE contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  contact_id  UUID REFERENCES users(id),
  nickname    VARCHAR(100),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);
```

### 📦 TypeScript Types

#### `src/types/user.types.ts`
```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar_url: string;
  status_text: string;
  is_online: boolean;
  last_seen: string;
  created_at: string;
}

export interface AuthUser extends User {
  token: string;
}
```

#### `src/types/message.types.ts`
```typescript
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'emoji' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: User;
  content: string;
  type: MessageType;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to_id?: string;
  reply_to?: Message;
  status: MessageStatus;
  is_deleted: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}
```

#### `src/types/conversation.types.ts`
```typescript
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar_url?: string;
  participants: User[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}
```

#### `src/types/socket.types.ts`
```typescript
export interface SocketEvents {
  // Client → Server
  'join_conversation': (conversationId: string) => void;
  'send_message': (data: SendMessagePayload) => void;
  'typing_start': (data: TypingPayload) => void;
  'typing_stop': (data: TypingPayload) => void;
  'mark_read': (data: MarkReadPayload) => void;

  // Server → Client
  'new_message': (message: Message) => void;
  'user_typing': (data: TypingPayload) => void;
  'user_stop_typing': (data: TypingPayload) => void;
  'message_status_update': (data: StatusUpdatePayload) => void;
  'user_online': (userId: string) => void;
  'user_offline': (data: { userId: string; last_seen: string }) => void;
}

export interface SendMessagePayload {
  conversation_id: string;
  content: string;
  type: MessageType;
  file_url?: string;
  reply_to_id?: string;
}

export interface TypingPayload {
  conversation_id: string;
  user_id: string;
  username: string;
}
```

### 🧪 Seed Data (Mock Dataset for Development)

#### `server/src/seed/mockUsers.ts`
```typescript
export const mockUsers = [
  {
    id: "u1",
    username: "alice_wonder",
    email: "alice@jhatsapp.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    status_text: "Exploring wonderland 🌸",
    is_online: true,
    last_seen: new Date().toISOString()
  },
  {
    id: "u2",
    username: "bob_builder",
    email: "bob@jhatsapp.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    status_text: "Yes we can! 🔨",
    is_online: false,
    last_seen: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "u3",
    username: "carol_singer",
    email: "carol@jhatsapp.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
    status_text: "🎵 Music is life",
    is_online: true,
    last_seen: new Date().toISOString()
  },
  {
    id: "u4",
    username: "dave_coder",
    email: "dave@jhatsapp.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=dave",
    status_text: "git commit -m 'fix everything'",
    is_online: false,
    last_seen: new Date(Date.now() - 7200000).toISOString()
  }
];

export const mockConversations = [
  {
    id: "c1",
    type: "direct",
    participants: ["u1", "u2"],
    last_message: {
      content: "Hey! How are you doing?",
      created_at: new Date(Date.now() - 600000).toISOString(),
      sender_id: "u2"
    },
    unread_count: 2
  },
  {
    id: "c2",
    type: "direct",
    participants: ["u1", "u3"],
    last_message: {
      content: "Did you hear the new album? 🎶",
      created_at: new Date(Date.now() - 1800000).toISOString(),
      sender_id: "u3"
    },
    unread_count: 0
  },
  {
    id: "c3",
    type: "group",
    name: "Dev Team 🚀",
    avatar_url: "https://api.dicebear.com/7.x/identicon/svg?seed=devteam",
    participants: ["u1", "u2", "u3", "u4"],
    last_message: {
      content: "PR is ready for review!",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      sender_id: "u4"
    },
    unread_count: 5
  }
];

export const mockMessages = [
  {
    id: "m1",
    conversation_id: "c1",
    sender_id: "u2",
    content: "Hey! How are you doing?",
    type: "text",
    status: "read",
    created_at: new Date(Date.now() - 700000).toISOString()
  },
  {
    id: "m2",
    conversation_id: "c1",
    sender_id: "u1",
    content: "I'm great! Working on JhatsApp 😄",
    type: "text",
    status: "delivered",
    created_at: new Date(Date.now() - 650000).toISOString()
  },
  {
    id: "m3",
    conversation_id: "c1",
    sender_id: "u2",
    content: "That's awesome! Can't wait to try it!",
    type: "text",
    status: "sent",
    created_at: new Date(Date.now() - 600000).toISOString()
  }
];
```

---

## STEP 1 — PROJECT SETUP

### 🤖 AI Prompt for Step 1:
> *"Create a monorepo project called 'jhatsapp' with two folders: 'client' (React + TypeScript + Vite + Tailwind CSS) and 'server' (Node.js + Express + TypeScript). Set up all package.json files, tsconfig.json files, tailwind.config.js, vite.config.ts, and .env.example. Install all dependencies listed in the Tech Stack section."*

### Commands to run:
```bash
# Create root folder
mkdir jhatsapp && cd jhatsapp
git init

# ---- CLIENT SETUP ----
npm create vite@latest client -- --template react-ts
cd client
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom zustand @tanstack/react-query axios socket.io-client
npm install lucide-react emoji-mart date-fns
npm install -D @types/node

# ---- SERVER SETUP ----
cd ../
mkdir server && cd server
npm init -y
npm install express socket.io cors dotenv bcryptjs jsonwebtoken
npm install @supabase/supabase-js multer cloudinary
npm install -D typescript ts-node nodemon @types/express @types/node @types/cors
npm install -D @types/bcryptjs @types/jsonwebtoken @types/multer
```

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#25D366',
          darkGreen: '#128C7E',
          teal: '#075E54',
        },
        chat: {
          bg: '#0B141A',
          sidebar: '#111B21',
          input: '#202C33',
          sentBubble: '#005C4B',
          receivedBubble: '#202C33',
          sentBubbleLight: '#DCF8C6',
          receivedBubbleLight: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

### `client/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
    background-color: #111B21;
    color: #E9EDEF;
    height: 100vh;
    overflow: hidden;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #374045; border-radius: 3px; }
}

@layer components {
  .bubble-sent {
    @apply bg-chat-sentBubble text-[#E9EDEF] rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl;
  }
  .bubble-received {
    @apply bg-chat-receivedBubble text-[#E9EDEF] rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-2xl;
  }
  .sidebar-item {
    @apply flex items-center gap-3 px-4 py-3 hover:bg-[#202C33] cursor-pointer transition-colors;
  }
  .input-field {
    @apply w-full bg-[#2A3942] text-[#E9EDEF] rounded-lg px-4 py-2 outline-none placeholder:text-[#8696A0];
  }
}
```

---

## STEP 2 — BACKEND SETUP (Node.js + Socket.IO)

### 🤖 AI Prompt for Step 2:
> *"Create the full Node.js Express + TypeScript backend for JhatsApp inside the 'server/src' folder. Create the entry point index.ts, configure Express with CORS, JSON parsing, and Socket.IO. Create all routes, controllers, middleware, socket handlers, and utils as defined in the folder structure. Use the models defined in the Data Schema section."*

### `server/src/index.ts`
```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import conversationRoutes from './routes/conversationRoutes';
import contactRoutes from './routes/contactRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { initializeSocket } from './sockets/socketHandler';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'JhatsApp server is running 🟢' });
});

// Socket.IO
initializeSocket(io);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 JhatsApp server running on port ${PORT}`);
});

export { io };
```

### `server/src/sockets/socketHandler.ts`
```typescript
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { handleMessageSocket } from './messageSocket';
import { handleTypingSocket } from './typingSocket';
import { handlePresenceSocket } from './presenceSocket';

const connectedUsers = new Map<string, string>(); // userId -> socketId

export function initializeSocket(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`✅ User connected: ${userId}`);
    connectedUsers.set(userId, socket.id);

    // Notify others that user is online
    socket.broadcast.emit('user_online', userId);

    // Join all user's conversations
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Handle message events
    handleMessageSocket(io, socket, connectedUsers);

    // Handle typing events
    handleTypingSocket(io, socket);

    // Handle presence/online status
    handlePresenceSocket(io, socket, connectedUsers);

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${userId}`);
      connectedUsers.delete(userId);
      socket.broadcast.emit('user_offline', {
        userId,
        last_seen: new Date().toISOString()
      });
    });
  });

  return connectedUsers;
}
```

### `server/src/sockets/messageSocket.ts`
```typescript
import { Server, Socket } from 'socket.io';
import { supabase } from '../config/database';

export function handleMessageSocket(
  io: Server,
  socket: Socket,
  connectedUsers: Map<string, string>
) {
  socket.on('send_message', async (data) => {
    const { conversation_id, content, type, file_url, reply_to_id } = data;
    const sender_id = socket.data.userId;

    try {
      // Save to database
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id,
          sender_id,
          content,
          type: type || 'text',
          file_url,
          reply_to_id,
        })
        .select(`
          *,
          sender:users(id, username, avatar_url),
          reply_to:messages(id, content, sender_id)
        `)
        .single();

      if (error) throw error;

      // Update conversation's last message
      await supabase
        .from('conversations')
        .update({ last_message_id: message.id, updated_at: new Date().toISOString() })
        .eq('id', conversation_id);

      // Broadcast to conversation room
      io.to(`conversation:${conversation_id}`).emit('new_message', message);

    } catch (err) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('mark_read', async ({ conversation_id, message_id }) => {
    const user_id = socket.data.userId;
    await supabase
      .from('message_status')
      .upsert({ message_id, user_id, status: 'read' });

    io.to(`conversation:${conversation_id}`).emit('message_status_update', {
      message_id,
      user_id,
      status: 'read'
    });
  });
}
```

### `server/src/sockets/typingSocket.ts`
```typescript
import { Server, Socket } from 'socket.io';

export function handleTypingSocket(io: Server, socket: Socket) {
  socket.on('typing_start', (data) => {
    socket.to(`conversation:${data.conversation_id}`)
      .emit('user_typing', { ...data, user_id: socket.data.userId });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`conversation:${data.conversation_id}`)
      .emit('user_stop_typing', { ...data, user_id: socket.data.userId });
  });
}
```

---

## STEP 3 — DATABASE SETUP (Supabase / Firebase)

### 🤖 AI Prompt for Step 3:
> *"Set up the Supabase database configuration for JhatsApp. Create the Supabase client configuration file at 'server/src/config/database.ts'. Also create all SQL migration files for the tables: users, conversations, conversation_participants, messages, message_status, and contacts — using the exact schemas defined in the Dataset section of this README."*

### `server/src/config/database.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
```

### SQL Migration: `database/migrations/001_initial_schema.sql`
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  avatar_url    TEXT DEFAULT '',
  status_text   TEXT DEFAULT 'Hey there! I am using JhatsApp',
  is_online     BOOLEAN DEFAULT false,
  last_seen     TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            VARCHAR(10) DEFAULT 'direct' CHECK (type IN ('direct','group')),
  name            VARCHAR(100),
  avatar_url      TEXT,
  created_by      UUID REFERENCES users(id),
  last_message_id UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSATION PARTICIPANTS
CREATE TABLE IF NOT EXISTS conversation_participants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(10) DEFAULT 'member',
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES users(id),
  content         TEXT,
  type            VARCHAR(20) DEFAULT 'text',
  file_url        TEXT,
  file_name       TEXT,
  file_size       INTEGER,
  reply_to_id     UUID REFERENCES messages(id),
  is_deleted      BOOLEAN DEFAULT false,
  is_edited       BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGE STATUS
CREATE TABLE IF NOT EXISTS message_status (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  status      VARCHAR(10) DEFAULT 'sent',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- CONTACTS
CREATE TABLE IF NOT EXISTS contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  contact_id  UUID REFERENCES users(id),
  nickname    VARCHAR(100),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);

-- INDEXES
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_participants_user ON conversation_participants(user_id);
```

---

## STEP 4 — AUTHENTICATION SYSTEM

### 🤖 AI Prompt for Step 4:
> *"Build the complete authentication system for JhatsApp. Create the backend auth controller with register, login, logout, and getMe endpoints using bcryptjs and JWT. Create the frontend auth store using Zustand, auth service using Axios, LoginForm and RegisterForm components with full form validation, and the AuthPage. Style it with Tailwind CSS using the JhatsApp color palette."*

### `server/src/controllers/authController.ts`
```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const { data: user, error } = await supabase
      .from('users')
      .insert({ username, email, password_hash: hashedPassword, avatar_url: avatarUrl })
      .select('id, username, email, avatar_url, status_text, is_online')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
      throw error;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ user, token });

  } catch (err: any) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    // Update online status
    await supabase.from('users').update({ is_online: true }).eq('id', user.id);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password_hash, ...safeUser } = user;

    res.json({ user: { ...safeUser, is_online: true }, token });

  } catch (err: any) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { data: user } = await supabase
    .from('users')
    .select('id, username, email, avatar_url, status_text, is_online, last_seen')
    .eq('id', userId)
    .single();
  res.json({ user });
};
```

### `client/src/store/authStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../types/user.types';

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: 'jhatsapp-auth' }
  )
);
```

### `client/src/pages/AuthPage.tsx`
```tsx
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-[#111B21] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/30">
          <span className="text-4xl">💬</span>
        </div>
        <h1 className="text-3xl font-bold text-[#E9EDEF]">JhatsApp</h1>
        <p className="text-[#8696A0] mt-1">Connect. Chat. Share.</p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-[#202C33] rounded-2xl p-8 shadow-2xl">
        {/* Toggle */}
        <div className="flex bg-[#111B21] rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'login'
                ? 'bg-brand-green text-white shadow-md'
                : 'text-[#8696A0] hover:text-[#E9EDEF]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'register'
                ? 'bg-brand-green text-white shadow-md'
                : 'text-[#8696A0] hover:text-[#E9EDEF]'
            }`}
          >
            Create Account
          </button>
        </div>

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;
```

### `client/src/components/auth/LoginForm.tsx`
```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form
      );
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[#8696A0] text-xs mb-1 uppercase tracking-wide">Email</label>
        <input
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div className="relative">
        <label className="block text-[#8696A0] text-xs mb-1 uppercase tracking-wide">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input-field pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-[#8696A0] hover:text-[#E9EDEF]"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-green hover:bg-brand-darkGreen text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <LogIn size={18} />
            Sign In
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
```

---

## STEP 5 — FRONTEND LAYOUT (Sidebar + Chat Window)

### 🤖 AI Prompt for Step 5:
> *"Build the main two-panel layout for JhatsApp. Create MainLayout.tsx that contains the Sidebar (30% width) and ChatWindow (70% width) side by side. Style with Tailwind CSS dark theme using the color palette from this README. Make it responsive: on mobile, show only sidebar by default, and show only chat window when a conversation is selected."*

### `client/src/components/layout/MainLayout.tsx`
```tsx
import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import ChatWindow from '../chat/ChatWindow';
import { useChatStore } from '../../store/chatStore';

const MainLayout: React.FC = () => {
  const activeConversation = useChatStore((state) => state.activeConversation);

  return (
    <div className="flex h-screen bg-[#111B21] overflow-hidden">
      {/* Sidebar - hidden on mobile when chat is open */}
      <div className={`
        ${activeConversation ? 'hidden md:flex' : 'flex'}
        w-full md:w-[30%] lg:w-[25%] xl:w-[30%]
        min-w-0 md:min-w-[300px] md:max-w-[400px]
        flex-col border-r border-[#2A3942]
      `}>
        <Sidebar />
      </div>

      {/* Chat Window */}
      <div className={`
        ${!activeConversation ? 'hidden md:flex' : 'flex'}
        flex-1 flex-col
      `}>
        {activeConversation ? (
          <ChatWindow />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-[#222E35]">
    <div className="w-32 h-32 bg-[#374045] rounded-full flex items-center justify-center mb-6">
      <span className="text-6xl">💬</span>
    </div>
    <h2 className="text-2xl font-light text-[#E9EDEF] mb-2">JhatsApp Web</h2>
    <p className="text-[#8696A0] text-center max-w-xs">
      Send and receive messages without keeping your phone online. Use JhatsApp on up to 4 linked devices.
    </p>
    <div className="mt-8 flex items-center gap-2 text-[#8696A0] text-sm">
      <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
      End-to-end encrypted
    </div>
  </div>
);

export default MainLayout;
```

### `client/src/store/chatStore.ts`
```typescript
import { create } from 'zustand';
import { Conversation } from '../types/conversation.types';
import { Message } from '../types/message.types';

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  searchQuery: string;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  updateMessageStatus: (conversationId: string, messageId: string, status: string) => void;
  setTypingUser: (conversationId: string, userId: string, isTyping: boolean) => void;
  setSearchQuery: (query: string) => void;
  updateConversationLastMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  typingUsers: {},
  searchQuery: '',

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  updateMessageStatus: (conversationId, messageId, status) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((m) =>
          m.id === messageId ? { ...m, status } : m
        ),
      },
    })),

  setTypingUser: (conversationId, userId, isTyping) =>
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: isTyping
            ? [...new Set([...current, userId])]
            : current.filter((id) => id !== userId),
        },
      };
    }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  updateConversationLastMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, last_message: message, updated_at: message.created_at }
          : c
      ),
    })),
}));
```

---

## STEP 6 — CONTACTS & CONVERSATION LIST

### 🤖 AI Prompt for Step 6:
> *"Build the Sidebar components for JhatsApp: SidebarHeader.tsx (with avatar, icons for new chat/menu), SearchBar.tsx (with search input and filter), ContactList.tsx (lists all conversations sorted by latest message), and ContactItem.tsx (shows avatar, name, last message preview, timestamp, unread badge, and online indicator). Use the Zustand chatStore for state. Style everything with Tailwind CSS dark theme."*

### `client/src/components/sidebar/Sidebar.tsx`
```tsx
import React from 'react';
import SidebarHeader from './SidebarHeader';
import SearchBar from './SearchBar';
import ContactList from './ContactList';

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#111B21]">
      <SidebarHeader />
      <SearchBar />
      <ContactList />
    </div>
  );
};

export default Sidebar;
```

### `client/src/components/sidebar/SidebarHeader.tsx`
```tsx
import React, { useState } from 'react';
import {
  MessageSquarePlus,
  MoreVertical,
  Moon,
  Sun,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import UserAvatar from '../profile/UserAvatar';

const SidebarHeader: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#202C33] border-b border-[#2A3942]">
      {/* Avatar */}
      <button className="hover:opacity-80 transition-opacity">
        <UserAvatar
          src={user?.avatar_url}
          username={user?.username || ''}
          size="md"
          showOnline={true}
          isOnline={true}
        />
      </button>

      {/* App Name (center) */}
      <h1 className="text-[#E9EDEF] font-semibold text-lg">JhatsApp</h1>

      {/* Action Icons */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#374045] rounded-full transition-all"
          title="New Chat"
        >
          <MessageSquarePlus size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#374045] rounded-full transition-all"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 w-48 bg-[#233138] rounded-xl shadow-2xl z-50 overflow-hidden">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 px-4 py-3 text-[#E9EDEF] hover:bg-[#374045] text-sm"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-[#E9EDEF] hover:bg-[#374045] text-sm">
                <Settings size={16} /> Settings
              </button>
              <hr className="border-[#374045]" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-[#374045] text-sm"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
```

### `client/src/components/sidebar/SearchBar.tsx`
```tsx
import React from 'react';
import { Search, X } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useChatStore();

  return (
    <div className="px-3 py-2 bg-[#111B21]">
      <div className="relative flex items-center bg-[#202C33] rounded-xl overflow-hidden">
        <Search size={16} className="absolute left-3 text-[#8696A0]" />
        <input
          type="text"
          placeholder="Search or start new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent py-2 pl-9 pr-4 text-sm text-[#E9EDEF] placeholder:text-[#8696A0] outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-[#8696A0] hover:text-[#E9EDEF]"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
```

### `client/src/components/sidebar/ContactItem.tsx`
```tsx
import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { Conversation } from '../../types/conversation.types';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import UserAvatar from '../profile/UserAvatar';

interface Props {
  conversation: Conversation;
}

const ContactItem: React.FC<Props> = ({ conversation }) => {
  const currentUser = useAuthStore((state) => state.user);
  const { activeConversation, setActiveConversation } = useChatStore();

  const isActive = activeConversation?.id === conversation.id;
  const lastMessage = conversation.last_message;

  // Get the other participant for direct chats
  const otherParticipant = conversation.type === 'direct'
    ? conversation.participants?.find((p) => p.id !== currentUser?.id)
    : null;

  const displayName = conversation.type === 'group'
    ? conversation.name
    : otherParticipant?.username || 'Unknown';

  const displayAvatar = conversation.type === 'group'
    ? conversation.avatar_url
    : otherParticipant?.avatar_url;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'dd/MM/yyyy');
  };

  const isSentByMe = lastMessage?.sender_id === currentUser?.id;

  return (
    <button
      onClick={() => setActiveConversation(conversation)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 transition-colors text-left
        ${isActive ? 'bg-[#2A3942]' : 'hover:bg-[#202C33]'}
        border-b border-[#1F2C33]
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <UserAvatar
          src={displayAvatar}
          username={displayName || ''}
          size="lg"
          showOnline={conversation.type === 'direct'}
          isOnline={otherParticipant?.is_online}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-[#E9EDEF] truncate">{displayName}</span>
          {lastMessage && (
            <span className={`text-xs flex-shrink-0 ml-2 ${
              conversation.unread_count > 0 ? 'text-brand-green' : 'text-[#8696A0]'
            }`}>
              {formatTime(lastMessage.created_at)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            {/* Read Receipt */}
            {isSentByMe && (
              <span className={`flex-shrink-0 ${
                lastMessage?.status === 'read' ? 'text-[#53BDEB]' : 'text-[#8696A0]'
              }`}>
                {lastMessage?.status === 'sent'
                  ? <Check size={14} />
                  : <CheckCheck size={14} />
                }
              </span>
            )}
            <span className="text-sm text-[#8696A0] truncate">
              {lastMessage?.type === 'image' ? '📷 Photo' :
               lastMessage?.type === 'file' ? '📎 File' :
               lastMessage?.type === 'audio' ? '🎵 Audio' :
               lastMessage?.content || 'No messages yet'}
            </span>
          </div>

          {/* Unread Badge */}
          {conversation.unread_count > 0 && (
            <span className="flex-shrink-0 ml-2 min-w-[20px] h-5 bg-brand-green text-white text-xs rounded-full flex items-center justify-center px-1 font-medium">
              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ContactItem;
```

---

## STEP 7 — CHAT WINDOW & MESSAGE BUBBLES

### 🤖 AI Prompt for Step 7:
> *"Build the full chat window for JhatsApp. Create ChatWindow.tsx (container), ChatHeader.tsx (shows contact name, online status, video/voice call icons), MessageList.tsx (scrollable list of messages grouped by date), and MessageBubble.tsx (renders sent/received bubbles with timestamp, read receipt checkmarks, message type handling for text/image/file, and reply-to preview). Use the bubble styles from the CSS layer defined in Step 1."*

### `client/src/components/chat/ChatHeader.tsx`
```tsx
import React from 'react';
import { ArrowLeft, Phone, Video, Search, MoreVertical } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import UserAvatar from '../profile/UserAvatar';
import TypingIndicator from './TypingIndicator';
import { formatDistanceToNow } from 'date-fns';

const ChatHeader: React.FC = () => {
  const { activeConversation, setActiveConversation, typingUsers } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);

  if (!activeConversation) return null;

  const otherParticipant = activeConversation.type === 'direct'
    ? activeConversation.participants?.find((p) => p.id !== currentUser?.id)
    : null;

  const displayName = activeConversation.type === 'group'
    ? activeConversation.name
    : otherParticipant?.username;

  const displayAvatar = activeConversation.type === 'group'
    ? activeConversation.avatar_url
    : otherParticipant?.avatar_url;

  const isTyping = (typingUsers[activeConversation.id] || []).length > 0;
  const isOnline = otherParticipant?.is_online;
  const lastSeen = otherParticipant?.last_seen;

  const getStatusText = () => {
    if (isTyping) return null; // TypingIndicator handles this
    if (activeConversation.type === 'group') {
      return `${activeConversation.participants?.length} members`;
    }
    if (isOnline) return 'online';
    if (lastSeen) return `last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}`;
    return '';
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#202C33] border-b border-[#2A3942]">
      {/* Back button - mobile only */}
      <button
        onClick={() => setActiveConversation(null)}
        className="md:hidden text-[#8696A0] hover:text-[#E9EDEF] mr-1"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Avatar */}
      <UserAvatar
        src={displayAvatar}
        username={displayName || ''}
        size="md"
        showOnline={activeConversation.type === 'direct'}
        isOnline={isOnline}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-[#E9EDEF] truncate">{displayName}</h2>
        {isTyping ? (
          <TypingIndicator conversationId={activeConversation.id} />
        ) : (
          <p className="text-xs text-[#8696A0]">{getStatusText()}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#374045] rounded-full transition-all">
          <Video size={20} />
        </button>
        <button className="p-2 text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#374045] rounded-full transition-all">
          <Phone size={20} />
        </button>
        <button className="p-2 text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#374045] rounded-full transition-all">
          <Search size={20} />
        </button>
        <button className="p-2 text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#374045] rounded-full transition-all">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
```

### `client/src/components/chat/MessageBubble.tsx`
```tsx
import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, CornerUpLeft, Download } from 'lucide-react';
import { Message } from '../../types/message.types';
import { useAuthStore } from '../../store/authStore';

interface Props {
  message: Message;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<Props> = ({ message, showAvatar = false }) => {
  const currentUser = useAuthStore((state) => state.user);
  const isSent = message.sender_id === currentUser?.id;

  if (message.is_deleted) {
    return (
      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className={`
          px-3 py-2 rounded-2xl text-sm italic text-[#8696A0] border border-[#374045]
          ${isSent ? 'bg-[#005C4B]/30' : 'bg-[#202C33]/50'}
          max-w-[65%]
        `}>
          🚫 This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 mb-1 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar for group chats */}
      {showAvatar && !isSent && (
        <img
          src={message.sender?.avatar_url}
          alt={message.sender?.username}
          className="w-7 h-7 rounded-full flex-shrink-0"
        />
      )}

      <div className={`max-w-[65%] ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender name (group chats) */}
        {showAvatar && !isSent && (
          <span className="text-xs text-brand-green font-medium mb-1 ml-3">
            {message.sender?.username}
          </span>
        )}

        {/* Reply Preview */}
        {message.reply_to && (
          <div className={`
            flex items-center gap-2 mb-1 px-3 py-2 rounded-lg border-l-4 border-brand-green
            ${isSent ? 'bg-[#004E3D]' : 'bg-[#1A2530]'}
            max-w-full text-xs
          `}>
            <CornerUpLeft size={12} className="text-brand-green flex-shrink-0" />
            <span className="text-[#8696A0] truncate">
              {message.reply_to.content || 'Media message'}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div className={`
          relative px-3 py-2 rounded-2xl shadow-sm
          ${isSent
            ? 'bubble-sent rounded-tr-sm'
            : 'bubble-received rounded-tl-sm'
          }
        `}>
          {/* Image */}
          {message.type === 'image' && message.file_url && (
            <img
              src={message.file_url}
              alt="image"
              className="rounded-lg max-w-[250px] max-h-[300px] object-cover mb-1 cursor-pointer hover:opacity-90"
            />
          )}

          {/* File */}
          {message.type === 'file' && (
            <a
              href={message.file_url}
              download={message.file_name}
              className="flex items-center gap-3 p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
            >
              <div className="w-10 h-10 bg-[#0078D4] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                {message.file_name?.split('.').pop()?.toUpperCase() || 'FILE'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate text-[#E9EDEF]">{message.file_name}</p>
                <p className="text-xs text-[#8696A0]">
                  {message.file_size ? `${(message.file_size / 1024).toFixed(1)} KB` : ''}
                </p>
              </div>
              <Download size={16} className="text-[#8696A0] flex-shrink-0" />
            </a>
          )}

          {/* Text content */}
          {(message.type === 'text' || message.type === 'emoji') && (
            <p className="text-sm text-[#E9EDEF] whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          )}

          {/* Timestamp + Status */}
          <div className={`flex items-center gap-1 justify-end mt-1 ${
            message.type === 'image' ? 'absolute bottom-3 right-3' : ''
          }`}>
            <span className="text-[10px] text-[#8696A0]">
              {message.is_edited && 'edited · '}
              {format(new Date(message.created_at), 'HH:mm')}
            </span>
            {isSent && (
              <span className={
                message.status === 'read' ? 'text-[#53BDEB]' : 'text-[#8696A0]'
              }>
                {message.status === 'sent'
                  ? <Check size={12} />
                  : <CheckCheck size={12} />
                }
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
```

### `client/src/components/chat/MessageList.tsx`
```tsx
import React, { useEffect, useRef } from 'react';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import MessageBubble from './MessageBubble';
import { useChatStore } from '../../store/chatStore';
import { Message } from '../../types/message.types';

const MessageList: React.FC = () => {
  const { activeConversation, messages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversationMessages = activeConversation
    ? messages[activeConversation.id] || []
    : [];

  const isGroupChat = activeConversation?.type === 'group';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  const formatDateDivider = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const renderMessages = () => {
    return conversationMessages.map((message, index) => {
      const prevMessage = conversationMessages[index - 1];
      const showDateDivider = !prevMessage ||
        !isSameDay(new Date(message.created_at), new Date(prevMessage.created_at));
      const showAvatar = isGroupChat &&
        (!prevMessage || prevMessage.sender_id !== message.sender_id);

      return (
        <React.Fragment key={message.id}>
          {showDateDivider && (
            <div className="flex items-center justify-center my-4">
              <span className="bg-[#182229] text-[#8696A0] text-xs px-4 py-1 rounded-full border border-[#2A3942] shadow-sm">
                {formatDateDivider(new Date(message.created_at))}
              </span>
            </div>
          )}
          <MessageBubble message={message} showAvatar={showAvatar} />
        </React.Fragment>
      );
    });
  };

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-3"
      style={{
        backgroundImage: 'url("/chat-bg.png")',
        backgroundSize: '400px',
        backgroundColor: '#0B141A',
      }}
    >
      {conversationMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-[#8696A0] text-sm">No messages yet</p>
            <p className="text-[#8696A0] text-xs mt-1">Send a message to start the conversation!</p>
          </div>
        </div>
      ) : (
        <>
          {renderMessages()}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
```

---

## STEP 8 — REAL-TIME MESSAGING (Socket.IO)

### 🤖 AI Prompt for Step 8:
> *"Create the Socket.IO client integration for JhatsApp. Build the useSocket.ts custom hook that connects to the server with JWT auth, listens to all socket events (new_message, user_typing, user_stop_typing, message_status_update, user_online, user_offline), and updates Zustand stores accordingly. Also build the useMessages.ts hook for fetching messages via API and sending via socket."*

### `client/src/hooks/useSocket.ts`
```typescript
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { Message } from '../types/message.types';

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const token = useAuthStore((state) => state.token);
  const { addMessage, setTypingUser, updateMessageStatus, updateConversationLastMessage } =
    useChatStore();

  useEffect(() => {
    if (!token || socketInstance?.connected) return;

    socketInstance = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('🔌 JhatsApp connected to server');
    });

    socketInstance.on('new_message', (message: Message) => {
      addMessage(message.conversation_id, message);
      updateConversationLastMessage(message.conversation_id, message);
    });

    socketInstance.on('user_typing', ({ conversation_id, user_id, username }) => {
      setTypingUser(conversation_id, user_id, true);
    });

    socketInstance.on('user_stop_typing', ({ conversation_id, user_id }) => {
      setTypingUser(conversation_id, user_id, false);
    });

    socketInstance.on('message_status_update', ({ message_id, status, conversation_id }) => {
      updateMessageStatus(conversation_id, message_id, status);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from JhatsApp server');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return () => {
      socketInstance?.disconnect();
      socketInstance = null;
    };
  }, [token]);

  return socketInstance;
};

export const getSocket = () => socketInstance;
```

### `client/src/hooks/useMessages.ts`
```typescript
import { useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { getSocket } from './useSocket';

export const useMessages = (conversationId: string | undefined) => {
  const token = useAuthStore((state) => state.token);
  const { setMessages, addMessage, messages } = useChatStore();

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async () => {
    if (!conversationId || !token) return;

    // Return cached if available
    if (messages[conversationId]?.length > 0) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(conversationId, data.messages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [conversationId, token]);

  // Send message
  const sendMessage = useCallback(
    (content: string, type = 'text', fileUrl?: string, replyToId?: string) => {
      const socket = getSocket();
      if (!socket || !conversationId) return;

      socket.emit('send_message', {
        conversation_id: conversationId,
        content,
        type,
        file_url: fileUrl,
        reply_to_id: replyToId,
      });
    },
    [conversationId]
  );

  // Typing indicators
  const startTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;
    socket.emit('typing_start', { conversation_id: conversationId });
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;
    socket.emit('typing_stop', { conversation_id: conversationId });
  }, [conversationId]);

  // Join conversation room
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;
    socket.emit('join_conversation', conversationId);
    fetchMessages();
  }, [conversationId]);

  return { sendMessage, startTyping, stopTyping };
};
```

---

## STEP 9 — MESSAGE FEATURES

### 🤖 AI Prompt for Step 9:
> *"Build the MessageInput.tsx component for JhatsApp with: text input area (multi-line), emoji picker button using emoji-mart, file/image attachment button with file preview, send button (shows mic icon when empty, send icon when text present), reply-to message preview bar, typing debounce for the typing indicator. Also add right-click context menu on MessageBubble with: Reply, Copy, Delete, and Forward options."*

### `client/src/components/chat/MessageInput.tsx`
```tsx
import React, { useState, useRef, useCallback } from 'react';
import { Smile, Paperclip, Mic, Send, X, CornerUpLeft } from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';
import { useChatStore } from '../../store/chatStore';
import { useDebounce } from '../../hooks/useDebounce';

const MessageInput: React.FC = () => {
  const { activeConversation } = useChatStore();
  const { sendMessage, startTyping, stopTyping } = useMessages(activeConversation?.id);

  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }

    // Typing indicator with debounce
    startTyping();
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 1500);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed, 'text', undefined, replyTo?.id);
    setText('');
    setReplyTo(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    stopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      ).then((r) => r.json());

      const type = file.type.startsWith('image/') ? 'image' : 'file';
      sendMessage(file.name, type, data.url);
    } catch (err) {
      console.error('Upload failed', err);
    }

    e.target.value = '';
  };

  return (
    <div className="bg-[#202C33] border-t border-[#2A3942]">
      {/* Reply Preview */}
      {replyTo && (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-[#2A3942] bg-[#182229]">
          <CornerUpLeft size={16} className="text-brand-green flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-brand-green font-medium">Replying to {replyTo.sender?.username}</p>
            <p className="text-xs text-[#8696A0] truncate">{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="text-[#8696A0] hover:text-[#E9EDEF]">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2 px-3 py-3">
        {/* Emoji Picker */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-[#8696A0] hover:text-[#E9EDEF] transition-colors flex-shrink-0 mb-0.5"
        >
          <Smile size={22} />
        </button>

        {/* File Attachment */}
        <label className="p-2 text-[#8696A0] hover:text-[#E9EDEF] transition-colors cursor-pointer flex-shrink-0 mb-0.5">
          <Paperclip size={22} />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
          />
        </label>

        {/* Text Area */}
        <div className="flex-1 bg-[#2A3942] rounded-xl overflow-hidden">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            rows={1}
            className="w-full bg-transparent px-4 py-3 text-sm text-[#E9EDEF] placeholder:text-[#8696A0] outline-none resize-none max-h-[150px] leading-relaxed"
          />
        </div>

        {/* Send / Mic Button */}
        <button
          onClick={text.trim() ? handleSend : undefined}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all mb-0.5
            ${text.trim()
              ? 'bg-brand-green hover:bg-brand-darkGreen text-white shadow-md'
              : 'text-[#8696A0] hover:text-[#E9EDEF]'
            }
          `}
        >
          {text.trim() ? <Send size={18} /> : <Mic size={22} />}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
```

---

## STEP 10 — SEARCH FUNCTIONALITY

### 🤖 AI Prompt for Step 10:
> *"Implement the search functionality for JhatsApp. The SearchBar already captures input via Zustand. Now update ContactList.tsx to filter conversations based on searchQuery — matching against display name AND last message content. Also build a server-side search endpoint GET /api/messages/search?q={query}&conversationId={id} that searches message content using Supabase full-text search (ilike)."*

### `server/src/controllers/messageController.ts` (Search endpoint)
```typescript
import { Request, Response } from 'express';
import { supabase } from '../config/database';

export const searchMessages = async (req: Request, res: Response) => {
  const { q, conversationId } = req.query;
  const userId = (req as any).userId;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: 'Search query required' });
  }

  try {
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, username, avatar_url)
      `)
      .ilike('content', `%${q}%`)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(50);

    if (conversationId) {
      query = query.eq('conversation_id', conversationId);
    }

    const { data: messages, error } = await query;
    if (error) throw error;

    res.json({ messages, query: q });
  } catch (err: any) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const { before, limit = 50 } = req.query;

  try {
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, username, avatar_url),
        reply_to:messages(id, content, sender_id)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(Number(limit));

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data: messages, error } = await query;
    if (error) throw error;

    res.json({ messages });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};
```

### `client/src/components/sidebar/ContactList.tsx`
```tsx
import React, { useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import ContactItem from './ContactItem';
import axios from 'axios';

const ContactList: React.FC = () => {
  const { conversations, setConversations, searchQuery } = useChatStore();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/conversations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversations(data.conversations);
      } catch (err) {
        console.error('Failed to fetch conversations', err);
      }
    };
    fetchConversations();
  }, [token]);

  const filtered = conversations
    .filter((conv) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const name = (conv.type === 'group' ? conv.name : conv.participants?.[0]?.username) || '';
      const lastMsg = conv.last_message?.content || '';
      return name.toLowerCase().includes(q) || lastMsg.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const aTime = new Date(a.updated_at).getTime();
      const bTime = new Date(b.updated_at).getTime();
      return bTime - aTime;
    });

  return (
    <div className="flex-1 overflow-y-auto">
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-[#8696A0]">
          <p className="text-sm">
            {searchQuery ? `No chats matching "${searchQuery}"` : 'No conversations yet'}
          </p>
        </div>
      ) : (
        filtered.map((conversation) => (
          <ContactItem key={conversation.id} conversation={conversation} />
        ))
      )}
    </div>
  );
};

export default ContactList;
```

---

## STEP 11 — PROFILE & SETTINGS PANEL

### 🤖 AI Prompt for Step 11:
> *"Build the ProfilePanel.tsx component for JhatsApp — a slide-in panel from the left when the user clicks their avatar in SidebarHeader. It should show: user avatar (with upload button), username, email, status text (editable), and a list of settings. Also create UserAvatar.tsx as a reusable component that shows initials as fallback, online indicator dot, and different sizes (sm/md/lg/xl)."*

### `client/src/components/profile/UserAvatar.tsx`
```tsx
import React from 'react';

interface Props {
  src?: string | null;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnline?: boolean;
  isOnline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: 'w-8 h-8', text: 'text-xs', dot: 'w-2 h-2 border border-[#111B21]' },
  md: { container: 'w-10 h-10', text: 'text-sm', dot: 'w-2.5 h-2.5 border border-[#202C33]' },
  lg: { container: 'w-12 h-12', text: 'text-base', dot: 'w-3 h-3 border-2 border-[#111B21]' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', dot: 'w-4 h-4 border-2 border-[#111B21]' },
};

const getInitials = (name: string) => {
  return name
    .split(/[\s_-]/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
};

const getColorFromName = (name: string) => {
  const colors = [
    'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const UserAvatar: React.FC<Props> = ({
  src,
  username,
  size = 'md',
  showOnline = false,
  isOnline = false,
  className = ''
}) => {
  const sizes = sizeMap[size];

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={username}
          className={`${sizes.container} rounded-full object-cover`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className={`
          ${sizes.container} ${getColorFromName(username)}
          rounded-full flex items-center justify-center
          ${sizes.text} font-bold text-white
        `}>
          {getInitials(username)}
        </div>
      )}

      {showOnline && (
        <span className={`
          absolute bottom-0 right-0 ${sizes.dot} rounded-full
          ${isOnline ? 'bg-brand-green' : 'bg-[#8696A0]'}
        `} />
      )}
    </div>
  );
};

export default UserAvatar;
```

---

## STEP 12 — DARK MODE / LIGHT MODE

### 🤖 AI Prompt for Step 12:
> *"Create the UIStore using Zustand with isDarkMode state and toggleDarkMode action, persisted with localStorage. In App.tsx, apply or remove the 'dark' class on the document.documentElement based on isDarkMode. Update all Tailwind classes in components to use dark: variants where needed."*

### `client/src/store/uiStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  toggleDarkMode: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isDarkMode: true,
      isMobileMenuOpen: false,
      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.isDarkMode;
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newMode };
        }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    }),
    { name: 'jhatsapp-ui' }
  )
);
```

---

## STEP 13 — MOBILE RESPONSIVE DESIGN

### 🤖 AI Prompt for Step 13:
> *"Ensure JhatsApp is fully responsive. On screens < 768px: show only sidebar (contact list) by default; when a contact is selected, hide sidebar and show full-screen chat window; add a back button in ChatHeader that calls setActiveConversation(null). On screens >= 768px: show both panels side by side. Use Tailwind CSS responsive prefixes (md:, lg:, xl:) throughout all layout components."*

### Mobile CSS Additions to `index.css`
```css
/* Mobile-specific overrides */
@media (max-width: 767px) {
  .bubble-sent, .bubble-received {
    max-width: 85% !important;
  }

  .message-input-row {
    padding: 8px !important;
  }
}

/* Smooth transitions for panel switching */
.panel-slide {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
```

---

## STEP 14 — NOTIFICATIONS

### 🤖 AI Prompt for Step 14:
> *"Add browser notification support to JhatsApp. In useSocket.ts, when a 'new_message' event fires and the message is not from the current user and the window is not focused, call the Notification API to show a browser notification with the sender's name and message preview. Also build a Toast.tsx component for in-app notifications using a simple Zustand store for toast queue management."*

### `client/src/utils/notifications.ts`
```typescript
import { Message } from '../types/message.types';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showBrowserNotification = (message: Message) => {
  if (Notification.permission !== 'granted') return;
  if (document.hasFocus()) return;

  const notification = new Notification(
    `JhatsApp — ${message.sender?.username || 'Someone'}`,
    {
      body: message.type === 'text'
        ? message.content
        : message.type === 'image'
        ? '📷 Photo'
        : '📎 File',
      icon: message.sender?.avatar_url || '/logo.png',
      badge: '/logo.png',
      tag: message.conversation_id,
    }
  );

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  setTimeout(() => notification.close(), 5000);
};
```

---

## STEP 15 — DEPLOYMENT

### 🤖 AI Prompt for Step 15:
> *"Create all deployment configuration files for JhatsApp. Create a Vercel configuration (vercel.json) for the React client, a railway.toml or Render render.yaml for the Node.js backend server. Also create a GitHub Actions CI/CD workflow (.github/workflows/deploy.yml) that runs on push to main, builds both client and server, and deploys them."*

### `client/vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### `server/render.yaml`
```yaml
services:
  - type: web
    name: jhatsapp-server
    env: node
    buildCommand: npm install && npx tsc
    startCommand: node dist/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: JWT_SECRET
        sync: false
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_KEY
        sync: false
      - key: CLIENT_URL
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
```

### `.github/workflows/deploy.yml`
```yaml
name: JhatsApp CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-client:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - run: npm ci
      - run: npm run build
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: client-build
          path: client/dist

  build-server:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./server
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      - run: npm ci
      - run: npx tsc --noEmit
```

---

## FULL DATASET DEFINITIONS

### Mock Data File: `client/src/data/mockData.ts`
```typescript
// Used for development/demo mode when backend is not running

export const DEMO_USER = {
  id: 'demo-user-001',
  username: 'you_demo',
  email: 'demo@jhatsapp.com',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  status_text: 'Available 🟢',
  is_online: true,
  last_seen: new Date().toISOString(),
};

export const DEMO_CONVERSATIONS = [
  {
    id: 'conv-001',
    type: 'direct' as const,
    participants: [
      DEMO_USER,
      {
        id: 'user-002',
        username: 'Alice Wonder',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        is_online: true,
        status_text: 'At the beach 🏖️',
        last_seen: new Date().toISOString(),
      }
    ],
    last_message: {
      id: 'msg-010',
      conversation_id: 'conv-001',
      sender_id: 'user-002',
      content: 'Are you free tonight?',
      type: 'text' as const,
      status: 'delivered' as const,
      is_deleted: false,
      is_edited: false,
      created_at: new Date(Date.now() - 300000).toISOString(),
      updated_at: new Date(Date.now() - 300000).toISOString(),
    },
    unread_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'conv-002',
    type: 'group' as const,
    name: 'Dev Team 🚀',
    avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=devteam',
    participants: [
      DEMO_USER,
      { id: 'user-003', username: 'Bob Builder', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', is_online: false },
      { id: 'user-004', username: 'Carol Singer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol', is_online: true },
    ],
    last_message: {
      id: 'msg-020',
      conversation_id: 'conv-002',
      sender_id: 'user-003',
      content: 'PR is merged! 🎉',
      type: 'text' as const,
      status: 'read' as const,
      is_deleted: false,
      is_edited: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    unread_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const DEMO_MESSAGES: Record<string, any[]> = {
  'conv-001': [
    {
      id: 'msg-001', conversation_id: 'conv-001', sender_id: 'user-002',
      content: 'Hey! 👋 How are you?', type: 'text', status: 'read',
      is_deleted: false, is_edited: false,
      sender: { id: 'user-002', username: 'Alice Wonder', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
      created_at: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: 'msg-002', conversation_id: 'conv-001', sender_id: 'demo-user-001',
      content: "I'm doing great! Just finished building JhatsApp 😄", type: 'text', status: 'read',
      is_deleted: false, is_edited: false,
      sender: DEMO_USER,
      created_at: new Date(Date.now() - 500000).toISOString(),
    },
    {
      id: 'msg-003', conversation_id: 'conv-001', sender_id: 'user-002',
      content: 'That sounds amazing! 🚀', type: 'text', status: 'read',
      is_deleted: false, is_edited: false,
      sender: { id: 'user-002', username: 'Alice Wonder', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
      created_at: new Date(Date.now() - 400000).toISOString(),
    },
    {
      id: 'msg-004', conversation_id: 'conv-001', sender_id: 'demo-user-001',
      content: 'Thanks! Check out the repo when it\'s ready 🔥', type: 'text', status: 'delivered',
      is_deleted: false, is_edited: false,
      sender: DEMO_USER,
      created_at: new Date(Date.now() - 350000).toISOString(),
    },
    {
      id: 'msg-010', conversation_id: 'conv-001', sender_id: 'user-002',
      content: 'Are you free tonight?', type: 'text', status: 'delivered',
      is_deleted: false, is_edited: false,
      sender: { id: 'user-002', username: 'Alice Wonder', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
      created_at: new Date(Date.now() - 300000).toISOString(),
    },
  ],
};
```

---

## ENVIRONMENT VARIABLES

### `.env.example`
```env
# ============================
# CLIENT (client/.env)
# ============================
VITE_API_URL=http://localhost:3001
VITE_SERVER_URL=http://localhost:3001
VITE_APP_NAME=JhatsApp

# ============================
# SERVER (server/.env)
# ============================
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Cloudinary (for file/image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## AI PROMPTS PER STEP

> **Copy these prompts one-by-one into your AI coding tool (Cursor, Windsurf, Bolt, etc.)**

### Prompt 1 — Scaffold
```
Create the full project scaffold for JhatsApp as described in the README.md.
Set up both client/ (React + Vite + TypeScript + Tailwind) and server/ (Node.js + Express + TypeScript) directories with all config files, package.json, tsconfig, and tailwind.config. Install all dependencies.
```

### Prompt 2 — Backend
```
Build the complete JhatsApp backend in server/src/. Create all controllers (auth, message, conversation, contact, upload), routes, middleware, socket handlers (socketHandler, messageSocket, typingSocket, presenceSocket), and Supabase config. Follow the exact schemas in the README.
```

### Prompt 3 — Database
```
Create the SQL migration file for JhatsApp at database/migrations/001_initial_schema.sql.
Create tables: users, conversations, conversation_participants, messages, message_status, contacts — with all constraints, indexes, and foreign keys as defined in the README.
```

### Prompt 4 — Auth
```
Build the full authentication system for JhatsApp. Backend: authController with register/login/getMe/logout. Frontend: Zustand authStore, axios authService, LoginForm, RegisterForm, AuthPage. Use the JhatsApp color palette and dark Tailwind theme.
```

### Prompt 5 — Layout
```
Build the JhatsApp main layout with MainLayout.tsx (two-panel: sidebar 30% + chat 70%), ChatPage.tsx, EmptyState component, and the Zustand chatStore and uiStore. Make it responsive for mobile.
```

### Prompt 6 — Sidebar
```
Build all sidebar components: Sidebar, SidebarHeader (with avatar, New Chat, menu icons), SearchBar (with Zustand integration), ContactList (fetches from API, filters by searchQuery), ContactItem (avatar, name, last message, timestamp, unread badge, online dot).
```

### Prompt 7 — Chat Window
```
Build all chat components: ChatWindow (container), ChatHeader (contact name/status/actions), MessageList (with date dividers, grouped messages, auto-scroll), MessageBubble (sent/received styling, image/file/text types, reply preview, timestamp, read receipts), TypingIndicator.
```

### Prompt 8 — Socket
```
Create useSocket.ts hook for Socket.IO client connection with JWT auth, listening to all events (new_message, user_typing, user_stop_typing, message_status_update, user_online, user_offline) and updating Zustand stores. Create useMessages.ts for fetching messages, sendMessage, startTyping, stopTyping.
```

### Prompt 9 — Message Input
```
Build MessageInput.tsx with: textarea (auto-resize, Shift+Enter for newline, Enter to send), emoji picker toggle, file attachment with upload to Cloudinary, reply-to preview bar, send/mic button toggle, typing indicator debounce.
```

### Prompt 10 — Search
```
Add message search: Update ContactList to filter conversations. Add server-side GET /api/messages/search?q= endpoint using Supabase ilike full-text search. Add a SearchResults panel that shows matching messages with context.
```

### Prompt 11 — Profile
```
Build ProfilePanel.tsx (slide-in panel) and UserAvatar.tsx (reusable avatar with initials fallback, online dot, sm/md/lg/xl sizes). Add avatar upload to profile panel using Cloudinary. Add editable status text with inline save.
```

### Prompt 12 — Polish & Deploy
```
Add dark/light mode toggle (Zustand UIStore + Tailwind dark: classes). Add browser notification support (useNotification.ts). Add Toast.tsx for in-app notifications. Create vercel.json, render.yaml, and GitHub Actions workflow for deployment.
```

---

## 📁 FINAL CHECKLIST

```
✅ Step 1:  Project scaffold + dependencies installed
✅ Step 2:  Backend server running on port 3001
✅ Step 3:  Supabase database created with all tables
✅ Step 4:  Auth (register/login/logout) working
✅ Step 5:  Two-panel layout renders
✅ Step 6:  Sidebar shows contacts + search works
✅ Step 7:  Chat window shows messages with bubbles
✅ Step 8:  Real-time messaging via Socket.IO works
✅ Step 9:  Message input with emoji + file upload works
✅ Step 10: Search filters conversations and messages
✅ Step 11: Profile panel + avatar update working
✅ Step 12: Dark/light mode toggle works
✅ Step 13: Mobile responsive layout works
✅ Step 14: Browser notifications appear
✅ Step 15: Deployed to Vercel + Render/Railway
```

---

## 🚀 QUICK START

```bash
# 1. Clone and install
git clone https://github.com/yourname/jhatsapp.git
cd jhatsapp

# 2. Setup environment
cp .env.example client/.env
cp .env.example server/.env
# Fill in your Supabase, Cloudinary, JWT values

# 3. Run database migrations in Supabase SQL Editor
# Paste contents of database/migrations/001_initial_schema.sql

# 4. Start server
cd server && npm run dev

# 5. Start client (new terminal)
cd client && npm run dev

# 6. Open browser
open http://localhost:5173
```

---



MIT License — Free to use, modify, and distribute.

---

*Built with ❤️ using AI Vibe Coding — JhatsApp v1.0.0*
```

---

## 🎯 Summary of What This README.md Does for Your AI

Here's what this complete guide covers, referencing the best patterns from the research:

| # | Feature | What AI Will Build |
|---|---------|-------------------|
| 1 | **Project Setup** | React + Tailwind + mocked API services, full monorepo |
| 2 | **Real-time Backend** | Lightweight Node.js backend designed for real-time chat with Socket.IO |
| 3 | **Database** | Full PostgreSQL schema via Supabase with 6 normalized tables |
| 4 | **Auth** | JWT-based register/login with bcrypt |
| 5 | **Two-panel UI** | Structured into two primary sections: the sidebar and the chat window |
| 6 | **Sidebar** | Allows users to view their profile, access various tools, search for chats, and navigate through a list of conversations |
| 7 | **Message Bubbles** | Chat window displays messages of the active chat and provides tools for composing and sending new messages |
| 8 | **Socket.IO** | Built with React and Socket.IO for real-time sync |
| 9 | **Input Features** | Emoji, file upload, reply-to, typing indicator |
| 10 | **Search** | Full-text search across conversations + messages |
| 11 | **Responsive** | Mobile responsive, providing seamless chat across devices |
| 12 | **Dark Mode** | Application supports both light and dark themes |
| 13 | **Deploy** | Vercel + Render + GitHub Actions CI/CD |

> ✅ **Just copy this entire README.md file and paste it into Cursor AI, Windsurf, Bolt, or any AI coding tool and say: "Build JhatsApp step by step following this README."** The AI will generate your full application!