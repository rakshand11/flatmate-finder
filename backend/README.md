# Flatmate Backend

A backend service for a flatmate / roommate management app built with **Node.js, Express, and TypeScript**. This API handles user authentication, flat‑related data, and optionally integrates both **MongoDB (Mongoose)** and **PostgreSQL** for flexible data‑store choices.

---

## 🛠 Tech Stack

- **Runtime & Framework:** Node.js + Express.js  
- **Language:** TypeScript  
- **Databases:**  
  - MongoDB (via Mongoose)  
  - PostgreSQL (via `pg`)  
- **Security & Auth:**  
  - Password hashing with `bcrypt`  
  - JWT‑based authentication with `jsonwebtoken`  
- **Other:**  
  - Environment variables via `dotenv`  
  - CORS handling via `cors`  
  - Cookie support via `cookie-parser`

---

## 📦 Installation

1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root (see example below).

---

## 🌐 Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/flatmate

# PostgreSQL (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/flatmate

# JWT
JWT_SECRET=your-jwt-secret-key

# Cookie / Session options
COOKIE_NAME=flatmate_jwt
COOKIE_MAX_AGE=86400000
```

---

## 🚀 Running the Server

This project uses `tsc-watch` to rebuild TypeScript on changes and automatically restart the server.

- Start in development:
  ```bash
  npm run start
  ```

- Build production bundle (runs `tsc -b`):
  ```bash
  npm run build
  ```

By default, the server compiles to `dist/index.js` and listens on the port defined in `.env`.

---

## 📂 Project Structure (Suggested)
