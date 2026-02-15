# Hybrid Queue Engine

## Problem Statement

Physical service centers (salons, hospitals, car service centers) face systemic inefficiencies:

- **Uncertain wait times**: Customers lack visibility into actual queue depth and estimated completion times
- **Overbooking**: Manual scheduling creates overlapping appointments without conflict detection
- **Poor walk-in handling**: Walk-in customers disrupt scheduled flows, creating bottlenecks and customer dissatisfaction
- **No fairness model**: No systematic prioritization between pre-booked appointments and walk-in traffic
- **No concurrency safety**: Race conditions allow double-booking when multiple customers request slots simultaneously

## Proposed Solution

A Hybrid Queue Engine that provides:

- **Appointment scheduling**: Pre-booked slot reservation with provider-specific availability windows
- **Walk-in digital token queues**: Unified queue system supporting both scheduled and walk-in customers
- **Dynamic wait time estimation**: Algorithmic calculation based on provider speed, queue depth, and service complexity
- **Overlap prevention**: Transactional booking with row-level validation logic
- **Role-based access control**: JWT-secured endpoints with Admin, Provider, and Customer privilege separation
- **Multi-provider support**: Center-level resource allocation across multiple service providers

## Scope

### In Scope

- Role-based authentication (Admin, Provider, Customer)
- Provider schedule management with recurring availability patterns
- Appointment lifecycle state machine (PENDING → CONFIRMED → IN_PROGRESS → COMPLETED/CANCELLED)
- Queue prioritization algorithm (FIFO within priority tier)
- Dynamic wait time estimation with real-time updates
- Transactional booking using Prisma $transaction and row-level validation logic

### Future Scope

- Payment gateway integration
- Distributed microservices architecture
- AI/ML-based scheduling optimization
- Multi-region deployment and geo-replication
- Third-party calendar synchronization

## Core Business Invariants

1. **No Overlapping Confirmed Appointments**: A provider cannot have two CONFIRMED appointments with overlapping time ranges. Enforced by unique constraint on (providerId, startTime) and overlap validation in service layer.
2. **Controlled State Transitions**: Appointment state changes follow a defined workflow (no direct PENDING → COMPLETED)
3. **FIFO Queue Discipline**: Queue entries with equal priority are served in first-in-first-out order
4. **Transactional Consistency**: All write operations affecting multiple records occur within atomic transactions using Prisma $transaction
5. **Single Provider Assignment**: Each appointment and queue entry maps to exactly one provider

## Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| ACID Compliance | All booking operations use Prisma $transaction with proper error handling |
| Concurrency Safety | Row-level validation logic prevents race conditions in slot allocation |
| Modularity | Layered architecture (Controller → Service → Repository) with clear boundaries |
| Security | JWT authentication with role claims, password hashing with bcrypt |
| Performance | Sub-500ms response time for slot availability queries |
| Code Quality | TypeScript strict mode, consistent error handling patterns |
