# CodeSpace: The Ultimate Coding Platform 🚀

CodeSpace is a high-fidelity competitive programming and institution-level analytics platform. It aggregates student performance from multiple platforms (LeetCode, Codeforces, etc.), provides a unified leaderboard, and features a cinematic real-time "Combat" system with an AI Code Auditor.

## ✨ Key Features
- **Global Leaderboard**: Aggregated scores from LeetCode, Codeforces, GFG, and AtCoder.
- **Training Lab**: A custom-built IDE with hidden test case judging.
- **AI Code Auditor**: Real-time feedback on complexity and logic powered by Gemini 1.5 Flash / 2.5 Flash.
- **Tempers (Squad Battles)**: Real-time mission-based competitive programming rounds with socket-based chat.
- **Secure Sandboxing**: Code execution isolated within Docker containers for safety.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Monaco Editor, Socket.io-client.
- **Backend**: Node.js, Express, MongoDB, Socket.io, Docker.
- **AI**: Google Generative AI (Gemini).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Docker (Installed and running)
- Google AI API Key

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` based on `.env.example`
4. `node seed.js` (to populate initial problems)
5. `npm start` or `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` based on `.env.example`
4. `npm run dev`

## 🛡️ Security Note
All user code is executed inside ephemeral Docker containers with resource limits to prevent malicious code from affecting the host system.

## 📜 License
MIT
