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
flowchart LR

    Customer([Customer])
    Provider([Provider])
    Admin([Admin])

    subgraph Authentication
        UC_Register([Register / Login])
    end

    subgraph Customer_Actions
        UC_Book([Book Appointment])
        UC_ViewMyAppts([View My Appointments])
        UC_WalkIn([Join Walk-in Queue])
        UC_ViewQueue([View Queue Position])
        UC_Cancel([Cancel Appointment])
    end

    subgraph Provider_Actions
        UC_ViewSchedule([View Schedule])
        UC_UpdateAvail([Update Availability])
        UC_UpdateStatus([Update Appointment Status])
        UC_StartAppt([Start Appointment])
        UC_CompleteAppt([Complete Appointment])
    end

    subgraph Admin_Actions
        UC_CreateCenter([Create Center])
        UC_ManageProviders([Manage Providers])
        UC_ManageServices([Manage Services])
        UC_ViewAllAppts([View All Appointments])
        UC_Dashboard([View Dashboard Metrics])
    end

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

