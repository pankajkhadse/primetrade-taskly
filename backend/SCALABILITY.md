# Scalability Notes

## Current Architecture
Taskly is built as a monolithic Node.js + Express application with a MySQL database. The structure is intentionally modular to support a clean migration path toward microservices if needed.

## Horizontal Scaling
- **Stateless JWT** — No server-side session storage. Multiple instances of the app can run behind a load balancer (e.g., Nginx, AWS ALB) with zero shared state required.
- **MySQL Connection Pooling** — The app uses a connection pool, allowing efficient handling of concurrent requests without creating a new DB connection per request.

## Caching Layer (Redis-ready)
- Response caching for `GET /tasks` can be added with Redis, reducing DB reads significantly under high traffic.
- Token blacklisting for logout can be implemented in Redis with TTL matching the JWT expiry — no DB queries needed.

## Database Scaling
- MySQL read replicas can be added for read-heavy workloads (`GET` routes hit replica, writes hit primary).
- Schema uses foreign keys with `ON DELETE CASCADE` ensuring referential integrity at the DB level.
- Indexes can be added on `owner_id` and `email` as traffic grows.

## Modular Structure → Microservices Path
The codebase is separated into:
```
Auth Service   → routes/auth   + controllers/auth   + models/auth
Task Service   → routes/tasks  + controllers/task   + models/task
```
Each can be extracted into an independent microservice with its own DB and deployed separately when traffic demands it.

## Docker Deployment
The app can be containerized with:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```
And orchestrated with `docker-compose` alongside a MySQL container for consistent dev/prod environments.

## API Versioning
All routes are prefixed with `/api/v1/` — new versions (`/api/v2/`) can be introduced without breaking existing clients.

## Future Improvements
- Rate limiting (express-rate-limit) to prevent brute-force attacks
- Helmet.js for HTTP security headers
- Winston or Morgan for structured logging
- CI/CD pipeline with GitHub Actions
