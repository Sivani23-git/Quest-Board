# ⚔️ QuestBoard — Gamified Productivity & Learning Platform

QuestBoard is a full-stack, gamified productivity and interactive learning web platform designed to transform daily habits, personal goals, quizzes, and coding challenges into an engaging RPG-style adventure.

---

## 🌟 Key Features

- **🛡️ Gamified Progression**: Earn XP, gold coins, level up, unlock achievement badges, and build daily streaks.
- **📜 Quest System**: Manage personal quests with priority tags, recurring schedules, and instant reward claims.
- **💻 Interactive Code Arena**: Real-time multi-language code editor (Python, JavaScript, etc.) powered by local sandbox execution for automated test case verification.
- **🧠 Skill Trees & Quizzes**: Upgrade specialized tech trees and complete timed interactive quizzes.
- **🏪 Reward Vault**: Spend hard-earned gold coins on customizable custom rewards.
- **🏆 Global Leaderboards**: Compete with fellow questers across global level rankings and weekly challenges.
- **📊 Quest Analytics**: Track completion rates, XP velocity, and activity heatmaps with Recharts.

---

## 🏗️ Architecture & Tech Stack

### Frontend (`/client`)
- **React 19** + **Vite**
- **Tailwind CSS** + **Lucide Icons**
- **Monaco Editor** for coding challenges
- **TanStack React Query** for asynchronous data synchronization
- **Recharts** for performance visual analytics
- **Canvas Confetti** for quest completion celebration effects

### Backend (`/server`)
- **Node.js** & **Express (ES Modules)**
- **MongoDB** & **Mongoose ODM**
- **JWT Authentication** + **Bcrypt.js** password hashing
- **Piston Sandbox Service** for isolated code execution
- **Helmet**, **Rate Limiting**, & **Mongo Sanitize** for security
- **Jest** & **Supertest** for automated integration testing

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 2. Setup Server
```bash
cd server
npm install
cp .env.example .env   # Configure PORT, MONGO_URI, JWT_SECRET
npm run dev
```

### 3. Setup Client
```bash
cd client
npm install
npm run dev
```

---

## 🧪 Testing & Verification

Run the comprehensive integration test suite for backend authentication, quest flows, code sandbox validation, and shop transactions:

```bash
cd server
npm test
```

---

## 📦 Deployment & Production Build

### Client Production Build
```bash
cd client
npm run build
```
The optimized production bundle will be output to `client/dist`.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
