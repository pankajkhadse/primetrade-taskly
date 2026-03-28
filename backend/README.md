# Taskly — Backend Developer Intern Assignment

A secure, scalable REST API built with **Node.js + Express + MySQL**, featuring JWT authentication, role-based access control, and a React.js frontend.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Node.js, Express.js               |
| Database   | MySQL                             |
| Auth       | JWT (jsonwebtoken), bcrypt        |
| Validation | express-validator                 |
| Frontend   | React.js, Axios, Tailwind CSS     |
| Tooling    | Vite, dotenv                      |

---

## Project Structure

```
taskly-backend/
├── config/
│   └── db.js                  # MySQL connection pool
├── controllers/
│   ├── auth.controller.js     # Register, Login
│   └── task.controller.js     # CRUD for tasks
├── middleware/
│   ├── authenticate.js        # JWT verification
│   ├── restrictTo.js          # Role-based access
│   ├── validate.js            # express-validator error handler
│   └── validators.js          # Validation rule sets
├── models/
│   ├── auth.model.js          # User DB queries
│   └── task.model.js          # Task DB queries
├── routes/
│   ├── auth.routes.js
│   └── task.routes.js
├── .env.example
├── app.js
└── server.js
```

---

## Database Schema

```sql
CREATE DATABASE taskly;
USE taskly;

CREATE TABLE users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    phone_no   VARCHAR(15)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    owner_id   INT NOT NULL,
    name       VARCHAR(100) NOT NULL,
    task       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MySQL >= 8

### 1. Clone the repository
```bash
git clone https://github.com/pankajkhadse/primetrade-taskly.git
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your values:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=taskly
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Set up the database
Run the SQL schema above in your MySQL client, or:
```bash
mysql -u root -p < schema.sql
```

### 5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:8081`

---

## API Reference

Base URL: `http://localhost:8081/v1`

### Auth Routes

| Method | Endpoint             | Access  | Description       |
|--------|----------------------|---------|-------------------|
| POST   | `/auth/register`     | Public  | Register new user |
| POST   | `/auth/login`        | Public  | Login & get token |

### Task Routes

| Method | Endpoint      | Access        | Description                        |
|--------|---------------|---------------|------------------------------------|
| POST   | `/task`      | Client only   | Create a task                      |
| GET    | `/task`      | Auth required | Get tasks (admin=all, client=own)  |
| GET    | `/task/:id`  | Auth required | Get single task                    |
| PUT    | `/task/:id`  | Auth required | Update task (owner or admin)       |
| DELETE | `/task/:id`  | Auth required | Delete task (owner or admin)       |

### Authentication
All protected routes require the JWT token in the header:
```
Authorization: Bearer <token>
```

---

## Role-Based Access

| Action         | Admin | Client |
|----------------|-------|--------|
| Register/Login | ✅    | ✅     |
| Create Task    | ❌    | ✅     |
| View Tasks     | ✅ (all) | ✅ (own) |
| Edit Task      | ✅    | ✅ (own only) |
| Delete Task    | ✅    | ✅ (own only) |

---

## Security Practices

- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT** tokens signed with secret key, expire in 7 days
- **express-validator** sanitizes and validates all inputs
- Role-based middleware prevents unauthorized actions
- `.env` file excluded from version control via `.gitignore`

---

## Scalability Notes

- **Stateless JWT** — no server-side session storage; app can scale horizontally behind a load balancer with zero config changes
- **Modular structure** — new entities (notes, products, bookings) can be added as independent route/controller/model modules without touching existing code
- **Connection pooling** — MySQL pool handles concurrent requests efficiently
- **Redis-ready** — token blacklisting and response caching can be added by plugging Redis into the existing middleware layer
- **Docker-ready** — can be containerized with a single `Dockerfile` and orchestrated with `docker-compose` alongside MySQL
- **Microservices path** — auth and task services are already logically separated and can be extracted into independent services if traffic demands it

---

## Frontend

The React.js frontend is located in the `/frontend` folder (or separate repo).

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:3000`

Features:
- Register & login with JWT stored in localStorage
- Protected dashboard (redirects to login if no token)
- Full task CRUD with modals and toast notifications
- Admin sees all tasks with owner names; client sees only their own
- All API errors displayed inline

---

## API Documentation

Postman collection is included in the repo:
```
taskly.postman_collection.json
```
Import it into Postman: **File → Import → select the JSON file**

---

## Environment Variables Reference

```env
PORT=5000                        # Server port
DB_HOST=localhost                # MySQL host
DB_USER=root                     # MySQL username
DB_PASSWORD=yourpassword         # MySQL password
DB_NAME=taskly                   # Database name
JWT_SECRET=your_secret_here      # JWT signing secret (keep this strong)
JWT_EXPIRES_IN=7d                # Token expiry (e.g. 7d, 24h)
```

---

## Author

**Pankaj** — B.Tech Computer Science  
[GitHub](https://github.com/yourname) · [LinkedIn](https://linkedin.com/in/yourname)
