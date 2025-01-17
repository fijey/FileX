# FileX Explorer Application

A modern web-based file explorer built with Vue 3 and Bun, featuring a dual-panel interface similar to Windows Explorer.

## Features

- 📁 Dual-panel file explorer interface
- 🔍 Real-time search functionality
- 🚀 High performance with caching
- ⚡ Built with Bun runtime
- 🎯 Clean Architecture implementation
- 📦 Monorepo structure

## Tech Stack

### Frontend
- Vue 3 (Composition API)
- Pinia for state management
- Tailwind CSS
- Cypress for testing

### Backend
- Bun runtime
- Elysia framework
- Prisma ORM
- MySQL
- Jest For Testing

## Project Structure

```
filex/
├── package/
│   ├── file-x-backend/    # Backend service
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   └── infrastructure/
│   │   └── tests/
│   └── filex-frontend/    # Frontend application
│       ├── src/
│       │   ├── domain/
│       │   ├── application/
│       │   └── infrastructure/
│       └── tests/
```

## Prerequisites

- Bun >= 1.1.43
- PostgreSQL/MySQL/MariaDB
- Git

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd filex
```

2. Install dependencies:
```bash
bun install
cd package/file-x-backend && bun install
cd ../filex-frontend && bun install
```

3. Configure environment:
```bash
cp package/file-x-backend/.env.example package/file-x-backend/.env
# Update database connection string in .env
```

4. Setup database:
```bash
bun run db:setup
bun run seed:all
```

5. Start the application:
```bash
bun start
```

## Development

### Running services separately

Backend:
```bash
bun run backend  # http://localhost:3000
```

Frontend:
```bash
bun run frontend  # http://localhost:3001
```

### Testing

Run all tests:
```bash
bun test
```

E2E tests:
```bash
cd package/filex-frontend
bun run cypress:open
```
