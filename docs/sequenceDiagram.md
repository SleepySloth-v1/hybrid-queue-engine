# Sequence Diagrams

## Sequence 1: Booking an Appointment

This diagram illustrates the main flow for a customer booking an appointment with transactional safety.

```mermaid
sequenceDiagram
    actor C as Customer
    participant FE as React Frontend
    participant BC as AppointmentController
    participant AS as AppointmentService
    participant SS as SchedulerService
    participant P as PrismaClient
    participant DB as PostgreSQL

    C->>FE: Select date, provider, service
    FE->>BC: GET /api/slots/available?providerId=&date=
    BC->>SS: getAvailableSlots(providerId, date)
    SS->>P: findMany(schedules)
    P->>DB: SELECT * FROM WorkingSchedule
    DB-->>P: schedules
    P-->>SS: schedules
    SS->>P: findMany(appointments)
    P->>DB: SELECT * FROM Appointment
    DB-->>P: existing appointments
    P-->>SS: appointments
    SS->>SS: calculate free slots
    SS-->>BC: availableSlots[]
    BC-->>FE: 200 OK (slots)
    FE-->>C: Display available slots

    C->>FE: Select slot and confirm booking
    FE->>BC: POST /api/appointments
    Note over BC: Request body: {providerId, serviceId, startTime, endTime}

    BC->>AS: createAppointment(data)
    AS->>P: $transaction(async (tx) => {
    Note over P: Prisma $transaction with overlap validation

    P->>DB: BEGIN TRANSACTION

    P->>DB: SELECT * FROM Appointment<br/>WHERE providerId = ?<br/>AND status = 'CONFIRMED'
    DB-->>P: existing confirmed appointments

    AS->>AS: validateOverlap(startTime, endTime, existing)

    alt Overlap Detected
        P->>DB: ROLLBACK
        DB-->>P: rollback complete
        P-->>AS: TransactionError
        AS-->>BC: SlotUnavailableError
        BC-->>FE: 409 Conflict
        FE-->>C: "Slot no longer available"
    else No Overlap
        P->>DB: INSERT INTO Appointment<br/>(customerId, providerId, serviceId,<br/>startTime, endTime, status)
        DB-->>P: appointment record

        P->>DB: COMMIT
        DB-->>P: commit complete
        P-->>AS: createdAppointment
    end

    AS-->>BC: appointment
    BC-->>FE: 201 Created (appointment)
    FE-->>C: Booking confirmed
```

## Sequence 2: Walk-in Queue Join + Wait Time Calculation

This diagram shows a customer joining the walk-in queue and receiving a dynamic wait time estimate.

```mermaid
sequenceDiagram
    actor C as Customer
    participant FE as React Frontend
    participant QC as QueueController
    participant QS as QueueService
    participant SS as SchedulerService
    participant P as PrismaClient
    participant DB as PostgreSQL

    C->>FE: Request walk-in service
    FE->>QC: GET /api/services
    QC->>P: findMany(Service)
    P->>DB: SELECT * FROM Service
    DB-->>P: services[]
    P-->>QC: services
    QC-->>FE: 200 OK (services)
    FE-->>C: Display available services

    C->>FE: Select service
    FE->>QC: GET /api/queue/wait-times?serviceId=
    QC->>QS: calculateWaitTime(serviceId)
    QS->>P: findMany(Provider where service offered)
    P->>DB: SELECT p.* FROM Provider p<br/>JOIN Provider_Service ps ON p.id = ps.providerId<br/>WHERE ps.serviceId = ?
    DB-->>P: providers[]

    loop Each Provider
        QS->>P: countQueueEntries(providerId, status='WAITING')
        P->>DB: SELECT COUNT(*) FROM QueueEntry<br/>WHERE providerId = ?<br/>AND status = 'WAITING'
        DB-->>P: count
        P-->>QS: queueDepth

        QS->>P: findActiveAppointment(providerId)
        P->>DB: SELECT * FROM Appointment<br/>WHERE providerId = ?<br/>AND status = 'IN_PROGRESS'<br/>LIMIT 1
        DB-->>P: activeAppt or null

        QS->>SS: estimateCompletionTime(providerId, activeAppt)
        SS-->>QS: completionEstimate

        QS->>P: getAvgServiceTime(serviceId)
        P->>DB: SELECT avgDuration FROM Service WHERE id = ?
        DB-->>P: avgDuration
        P-->>QS: serviceDuration

        QS->>QS: calculateProviderWaitTime(queueDepth, completionEstimate, serviceDuration)
    end

    QS->>QS: selectBestProvider(minWaitTime)
    QS-->>QC: {providerId, estimatedWaitMinutes, queuePosition}
    QC-->>FE: 200 OK (wait estimate)
    FE-->>C: Show wait time and confirm join

    C->>FE: Confirm join queue
    FE->>QC: POST /api/queue/join
    Note over QC: Request body: {serviceId, customerId}

    QC->>QS: joinQueue(data)
    QS->>P: $transaction(async (tx) => {
    Note over P: TRANSACTION START

    P->>DB: BEGIN TRANSACTION

    P->>DB: INSERT INTO QueueEntry<br/>(customerId, providerId, serviceId,<br/>status, priority, joinedAt)
    DB-->>P: queueEntry record

    P->>DB: SELECT COUNT(*) FROM QueueEntry<br/>WHERE providerId = ?<br/>AND status = 'WAITING'<br/>AND joinedAt < ?
    DB-->>P: positionNumber

    P->>DB: COMMIT
    DB-->>P: commit complete
    P-->>QS: {queueEntry, positionNumber}

    QS-->>QC: queueEntry with position
    QC-->>FE: 201 Created (queue token)
    FE-->>C: Display queue position and live updates

    Note over C,DB: WebSocket/SSE for real-time position updates (out of scope)
```
