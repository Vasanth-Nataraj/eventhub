# EventHub — Intelligent Skill-Indexed Event Management Platform

EventHub is an enterprise-grade full-stack event discovery and registration platform engineered with the MERN stack. Designed specifically for collegiate developers and hackathons, EventHub pairs candidate skill sets against competition requirements using a real-time MongoDB Atlas aggregation pipeline.

---

## Key Technical Features

- **Algorithmic Skill Matching Engine:** Powered by MongoDB Atlas `$setIntersection`, dynamically computing array overlap between user skills and event requirements at the database layer.
- **Atomic Booking Transactions:** Concurrency-safe seat reservation system with race-condition prevention and real-time capacity counters.
- **Two-Sided Platform Architecture:** Native attendee onboarding with indexed technical skills and organizer event hosting console.
- **Design System:** Custom bento-box interface built with Tailwind CSS, balancing Notion-style data clarity with Stripe-inspired ambient gradient depths.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js REST API
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Security:** JSON Web Tokens (JWT), Bcrypt password hashing

---

## Quick Start & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Cluster or local MongoDB instance

### 1. Clone & Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET in .env
npm run dev
```
*Server runs on `http://localhost:5000`*

### 2. Seed Database
```bash
cd server
node seed.js
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```
*Client runs on `http://localhost:5173`*
