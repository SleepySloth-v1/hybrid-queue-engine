# Use Case Diagram

## Actors

| Actor | Description |
|-------|-------------|
| **Customer** | End user seeking service; books appointments or joins walk-in queue |
| **Provider** | Service provider (stylist, doctor, mechanic) who fulfills appointments |
| **Admin** | Center administrator managing resources, providers, and services |

## Use Cases by Actor

### Customer

| Use Case | Description |
|----------|-------------|
| Register/Login | Create account or authenticate with credentials |
| Book Appointment | Search available slots and reserve a time with a provider |
| View My Appointments | See list of upcoming and past appointments |
| Join Walk-in Queue | Obtain digital token for immediate queue placement |
| View Queue Position | Check current position and estimated wait time |
| Cancel Appointment | Withdraw from confirmed appointment (subject to policy) |

### Provider

| Use Case | Description |
|----------|-------------|
| View Schedule | See daily/weekly appointment calendar |
| Update Availability | Modify working hours or block time slots |
| Update Appointment Status | Change appointment state (PENDING → CONFIRMED → IN_PROGRESS → COMPLETED) |
| Start Appointment | Transition appointment state to IN_PROGRESS |
| Complete Appointment | Mark appointment as COMPLETED with notes |

### Admin

| Use Case | Description |
|----------|-------------|
| Create Center | Register new service center in system |
| Manage Providers | Add, edit, or deactivate provider accounts |
| Manage Services | Create, update, or remove service offerings |
| View All Appointments | Monitor appointments across all providers |
| View Dashboard Metrics | Access analytics on utilization, wait times, no-shows |

## Use Case Diagram (Mermaid)

```mermaid
useCaseDiagram
    actor "Customer" as Customer
    actor "Provider" as Provider
    actor "Admin" as Admin

    rectangle Authentication {
        usecase "Register/Login" as UC_Register
    }

    rectangle "Customer Actions" {
        usecase "Book Appointment" as UC_Book
        usecase "View My Appointments" as UC_ViewMyAppts
        usecase "Join Walk-in Queue" as UC_WalkIn
        usecase "View Queue Position" as UC_ViewQueue
        usecase "Cancel Appointment" as UC_Cancel
    }

    rectangle "Provider Actions" {
        usecase "View Schedule" as UC_ViewSchedule
        usecase "Update Availability" as UC_UpdateAvail
        usecase "Update Appointment Status" as UC_UpdateStatus
        usecase "Start Appointment" as UC_StartAppt
        usecase "Complete Appointment" as UC_CompleteAppt
    }

    rectangle "Admin Actions" {
        usecase "Create Center" as UC_CreateCenter
        usecase "Manage Providers" as UC_ManageProviders
        usecase "Manage Services" as UC_ManageServices
        usecase "View All Appointments" as UC_ViewAllAppts
        usecase "View Dashboard Metrics" as UC_Dashboard
    }

    Customer --> UC_Register
    Customer --> UC_Book
    Customer --> UC_ViewMyAppts
    Customer --> UC_WalkIn
    Customer --> UC_ViewQueue
    Customer --> UC_Cancel

    Provider --> UC_Register
    Provider --> UC_ViewSchedule
    Provider --> UC_UpdateAvail
    Provider --> UC_UpdateStatus
    Provider --> UC_StartAppt
    Provider --> UC_CompleteAppt

    Admin --> UC_Register
    Admin --> UC_CreateCenter
    Admin --> UC_ManageProviders
    Admin --> UC_ManageServices
    Admin --> UC_ViewAllAppts
    Admin --> UC_Dashboard
```
