# Hybrid Queue Engine

A production-ready appointment booking and walk-in queue management system built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js + TypeScript (strict mode)
- **Framework**: Express 5
- **ORM**: Prisma 7
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Testing**: Jest + ts-jest
- **Linting**: ESLint + Prettier

## Architecture

```
Layered: Controller → Service → Repository (Prisma)
```

All business logic lives in the service layer. Controllers are thin delegation layers. Database writes go through Prisma transactions.

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema (7 models, 4 enums)
├── src/
│   ├── config/
│   │   ├── env.ts             # Environment config loader
│   │   └── prisma.ts          # Prisma client singleton
│   ├── modules/
│   │   ├── auth/              # Register, Login, Refresh (fully implemented)
│   │   ├── users/             # User management
│   │   ├── centers/           # Center management
│   │   ├── providers/         # Provider management
│   │   ├── services/          # Service catalog
│   │   ├── appointments/      # Appointment booking
│   │   ├── queue/             # Walk-in queue
│   │   └── scheduler/         # Pure business logic (wait time, allocation)
│   ├── shared/
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts    # JWT verification
│   │   │   ├── roleMiddleware.ts    # Role-based access control
│   │   │   ├── validate.ts          # Zod request validation
│   │   │   └── errorHandler.ts      # Global error handler
│   │   ├── utils/
│   │   │   ├── apiResponse.ts       # Structured API responses
│   │   │   ├── jwt.ts               # Token generation/verification
│   │   │   ├── password.ts          # Password hashing (bcrypt)
│   │   │   └── errors.ts            # Custom error classes
│   │   └── types/
│   │       └── index.ts             # Shared TypeScript types
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server bootstrap
├── .env.example
├── tsconfig.json
├── jest.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- npm

### Installation

```bash
cd backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string
```

### Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Development

```bash
npm run dev
```

Server starts at `http://localhost:5000`
Health check: `GET /api/v1/health`

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:generate` | Generate Prisma client |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh access token |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/me` | JWT | Get current user profile |
| GET | `/api/v1/users/` | Admin | List all users |

### Centers
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/centers/` | Admin | Create center |
| GET | `/api/v1/centers/` | JWT | List centers |
| GET | `/api/v1/centers/:id` | JWT | Get center details |

### Providers
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/providers/` | Admin | Create provider |
| GET | `/api/v1/providers/` | JWT | List providers |
| GET | `/api/v1/providers/:id` | JWT | Get provider details |

### Services
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/services/` | Admin | Create service |
| GET | `/api/v1/services/` | JWT | List services |
| GET | `/api/v1/services/center/:centerId` | JWT | Get services by center |

### Appointments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/appointments/` | JWT | Create appointment |
| GET | `/api/v1/appointments/` | JWT | List appointments |
| GET | `/api/v1/appointments/:id` | JWT | Get appointment |
| PATCH | `/api/v1/appointments/:id/status` | JWT | Update status |

### Queue
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/queue/` | JWT | Add to queue |
| GET | `/api/v1/queue/center/:centerId` | JWT | Get queue for center |
| PATCH | `/api/v1/queue/:id/status` | JWT | Update queue status |

## Database Models

- **User**: Multi-role (ADMIN, PROVIDER, CUSTOMER)
- **Center**: Physical locations
- **Provider**: Linked to User + Center with specialization
- **Service**: Offered at Centers with duration
- **WorkingSchedule**: Provider availability per weekday
- **Appointment**: Bookable slots with status state machine
- **QueueEntry**: Walk-in queue with priority support

## Roles

| Role | Capabilities |
|---|---|
| ADMIN | Full access, manage centers/providers/services |
| PROVIDER | Manage own schedule and appointments |
| CUSTOMER | Book appointments, join queue |
