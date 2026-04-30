# BRIEFSY: Cognitive News Platform

Briefsy is a **perspective-driven news platform** that transforms passive news consumption into active discussion.
Users can explore real-world articles, share structured viewpoints, and engage with different perspectives on the same story.

---

## Features

* Live News Feed: Fetches real-time articles from external APIs
* Perspective System: Users post viewpoints (supporting, critical, neutral, personal)
* Voting Mechanism: Upvote / downvote perspectives
* Personalized Feed: Based on user interests
* Authentication: JWT-based secure login/register
* Caching Layer: In-memory TTL cache for faster responses
* Discussion Panel UI: Separate space for content vs opinions

---

## Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* REST APIs
* In-memory caching (Node-cache)

### Frontend

* React (Vite)
* CSS (custom UI system)

---

## Project Structure

```
briefsy/
├── client/        # React frontend
├── server/        # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── config/
│   └── server.js
```

---

## Setup Instructions

### 1. Clone Repo

```
git clone https://github.com/samriddhi-bisht/briefsy-project
cd briefsy
```

---

### 2. Backend Setup

```
cd server
npm install
```

Create `.env` file:

```
PORT=5000

DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=briefsy_db
DB_PASSWORD=your_password
DB_PORT=5432

JWT_SECRET=your_secret
NEWS_API_KEY=your_news_api_key
```

Run server:

```
npm run dev
```

---

### 3. Frontend Setup

```
cd client
npm install
npm run dev
```

---

## API Endpoints

### Articles

* GET /api/articles/category/:category
* GET /api/articles/personalized

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Perspectives

* GET /api/povs/:articleId
* POST /api/povs/:articleId
* POST /api/povs/:povId/vote

### Bookmarks

* POST /api/bookmarks/:articleId

---

## Caching Strategy

* Articles are cached using TTL-based in-memory cache
* Reduces repeated database queries
* Improves response time for frequent requests

```
Cache Key: articles:<category>
```

---

## Key Highlights

* Designed relational data model for articles, users, perspectives, and votes
* Built scalable REST APIs with proper separation of concerns
* Implemented performance optimization via caching
* Created a UX that separates content from opinions

---

## Future Improvements

* Redis / Dragonfly caching for production scale
* AI-based bias detection
* Real-time discussions (WebSockets)
* Moderation and reporting system
* Trending and controversy ranking

---
