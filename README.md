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

# Preview Project

## Screenshot 1
![Screenshot 1](https://res.cloudinary.com/dlrsduhgh/image/upload/v1737157119/Screenshot_18-Jan_06-28-27_Google-chrome_ozkmwg.png)

## Screenshot 2
![Screenshot 2](https://res.cloudinary.com/dlrsduhgh/image/upload/v1737157119/Screenshot_18-Jan_06-28-11_Google-chrome_zut8ut.png)

## Screenshot 3
![Screenshot 3](https://res.cloudinary.com/dlrsduhgh/image/upload/v1737157119/Screenshot_18-Jan_06-27-51_Google-chrome_cyil1n.png)

## Screenshot 4
![Screenshot 5](https://res.cloudinary.com/dlrsduhgh/image/upload/v1737157119/Screenshot_18-Jan_06-27-44_Google-chrome_krnroy.png)

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
