# CQRS (Command Query Responsibility Segregation)

**CQRS (Command Query Responsibility Segregation)** is an architectural pattern that separates an application's operations into two different categories:

1. **Commands** → Operations that modify data
2. **Queries** → Operations that read data

The main idea:

> "Separate the code that changes data from the code that reads data."

---

# Why Do We Need CQRS?

In a traditional application, the same model handles both reading and writing.

Example:

```
Client
  |
  ↓
Controller
  |
  ↓
Service
  |
  ↓
Database
```

The same objects handle:

- Creating data
- Updating data
- Deleting data
- Reading data

Example:

```csharp
public class UserService
{
    public User GetUser(int id)
    {
        // Read user
    }

    public void UpdateUser(User user)
    {
        // Update user
    }
}
```

The problem:

Reading and writing have different requirements.

---

# The Problem CQRS Solves

Imagine an e-commerce application.

## Reading Orders

A customer views orders.

Needs:

- Fast queries
- Simple data
- Optimized responses

Example:

```
GET /orders
```

---

## Updating Orders

A customer places an order.

Needs:

- Validation
- Business rules
- Transactions
- Security checks

Example:

```
POST /orders
```

These are different operations.

CQRS separates them:

```
              Application

                  |
        ---------------------
        |                   |
        ↓                   ↓

    Commands             Queries

    Write Data           Read Data
```

---

# Commands

A **Command** represents an action that changes application state.

Examples:

```
CreateUser
UpdateProfile
PlaceOrder
CancelPayment
DeleteProduct
```

Commands:

- Modify data
- Trigger business logic
- Represent user intentions
- Usually do not return large amounts of data

Example:

```csharp
public record CreateUserCommand(
    string Name,
    string Email
);
```

A command says:

> "I want to perform this action."

---

# Command Flow

Example: Creating an order

```
Client
  |
  ↓
CreateOrderCommand
  |
  ↓
Command Handler
  |
  ↓
Business Logic
  |
  ↓
Database
```

Example:

```csharp
public class CreateOrderHandler
{
    private readonly AppDbContext _context;

    public CreateOrderHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task Handle(CreateOrderCommand command)
    {
        var order = new Order
        {
            UserId = command.UserId,
            Amount = command.Amount
        };

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();
    }
}
```

---

# Queries

A **Query** retrieves data without changing application state.

Examples:

```
GetUser
GetOrders
SearchProducts
GenerateReports
```

Queries:

- Read data
- Do not modify state
- Return information

Example:

```csharp
public record GetUserQuery(
    int UserId
);
```

A query says:

> "Give me this information."

---

# Query Flow

Example: Getting user orders

```
Client
  |
  ↓
GetOrdersQuery
  |
  ↓
Query Handler
  |
  ↓
Database
  |
  ↓
Response
```

Example:

```csharp
public class GetOrdersHandler
{
    private readonly AppDbContext _context;

    public GetOrdersHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<OrderDto>> Handle(
        GetOrdersQuery query)
    {
        return await _context.Orders
            .Where(x => x.UserId == query.UserId)
            .Select(x => new OrderDto
            {
                Id = x.Id,
                Amount = x.Amount
            })
            .ToListAsync();
    }
}
```

---

# Does CQRS Require Separate Databases?

No.

**CQRS does not require separate databases.**

There are two levels of CQRS.

---

# 1. Simple CQRS (Most Common)

Commands and Queries are separated in code but use the **same database**.

Architecture:

```
              Application

                  |
        ---------------------
        |                   |
        ↓                   ↓

    Command Side       Query Side

    CreateOrder        GetOrders
    UpdateUser         GetUser

        |                   |
        ↓                   ↓

              Same Database
```

Example:

```
SQL Server

Tables:

Users
Orders
Products
```

The separation exists in the application layer:

```
Features

├── Orders
│
│    ├── CreateOrder
│    │      ├── Command.cs
│    │      └── Handler.cs
│    │
│    └── GetOrders
│           ├── Query.cs
│           └── Handler.cs
```

This is the approach used by many ASP.NET Core applications.

---

# 2. Full CQRS (Advanced)

Commands and Queries use separate databases.

Architecture:

```
                 Application

              /             \

             ↓               ↓

      Command Side       Query Side

      Write Database     Read Database

             ↓               ↓

        PostgreSQL      Elasticsearch
```

---

# Why Separate Databases?

Because reading and writing have different requirements.

## Write Database

Optimized for:

- Data consistency
- Transactions
- Business rules

Example:

```
Orders Table

Id
UserId
Amount
Status
```

---

## Read Database

Optimized for:

- Fast queries
- Search
- Reports
- Display models

Example:

```
OrderView

CustomerName
ProductNames
TotalPrice
OrderStatus
```

Instead of performing expensive joins every time, the read model is already prepared.

---

# How Does Data Move Between Databases?

Usually through events.

Example:

```
User Places Order

        ↓

Command Handler

        ↓

Save Order

        ↓

Publish Event

"OrderCreated"

        ↓

Message Queue

(Kafka / RabbitMQ)

        ↓

Update Read Database
```

Flow:

```
Write Database
       |
       ↓
     Event
       |
       ↓
 Read Database
```

---

# Traditional Architecture vs CQRS

## Traditional CRUD

```
             Application

                 |
                 ↓

            UserService

              /      \

             ↓        ↓

        Read Data   Write Data

                 |
                 ↓

              Database
```

One model handles everything.

---

## CQRS

```
                 Application

              /             \

             ↓               ↓

       Command Side     Query Side

       Write Model      Read Model

             ↓               ↓

        Write DB       Read DB
```

---

# CQRS and Vertical Slice Architecture

CQRS is commonly used with **Vertical Slice Architecture**.

Example:

```
Features

├── Orders
│
│    ├── CreateOrder
│    │       ├── Command.cs
│    │       └── Handler.cs
│    │
│    └── GetOrders
│            ├── Query.cs
│            └── Handler.cs
│
└── Users
     ├── CreateUser
     └── GetUser
```

Each feature contains:

- Command
- Query
- Handler
- Validation
- Response

---

# CQRS Components

## Command Side

```
Command
   |
   ↓
Command Handler
   |
   ↓
Write Database
```

Responsible for changing state.

---

## Query Side

```
Query
   |
   ↓
Query Handler
   |
   ↓
Read Database
```

Responsible for retrieving data.

---

# Benefits of CQRS

## 1. Separation of Responsibilities

Commands:

```
Change data
```

Queries:

```
Read data
```

Each side has a clear purpose.

---

## 2. Better Performance

Read models can be optimized separately.

Example:

```
Write Database

Normalized tables


Read Database

Optimized views
```

---

## 3. Independent Scaling

Read and write systems can scale separately.

Example:

```
Heavy Reading Traffic

        ↓

Add More Query Servers
```

---

## 4. Cleaner Business Logic

Commands represent business actions.

Example:

Instead of:

```
UpdateOrder()
UpdateInventory()
ChargeCard()
```

Use:

```
PlaceOrderCommand
```

---

# Drawbacks of CQRS

## 1. Increased Complexity

Simple applications may not need CQRS.

---

## 2. Data Synchronization

With separate databases:

```
Write Database
       |
       ↓
    Events
       |
       ↓
Read Database
```

The read database may be temporarily behind.

---

## 3. More Code

You introduce:

- Commands
- Queries
- Handlers
- DTOs
- Events

---

# When To Use CQRS?

Good use cases:

✅ Large enterprise systems  
✅ Complex business rules  
✅ High traffic applications  
✅ Financial systems  
✅ E-commerce platforms  
✅ Systems requiring audit history  

---

# When Not To Use CQRS?

Avoid for:

❌ Simple CRUD APIs  
❌ Small applications  
❌ Basic dashboards  
❌ Simple database applications  

A normal service/repository architecture may be enough.

---

# Simple Analogy

Think of a restaurant.

## Traditional Approach

One person does everything:

```
Waiter

Takes orders
Answers questions
Handles payments
```

Too many responsibilities.

---

## CQRS Approach

Separate roles:

```
Order Department

Handles new orders


Information Department

Answers customer questions
```

Each role specializes.

---

# Summary

CQRS separates application operations into:

```
              Application

             /          \

            ↓            ↓

       Commands       Queries

       Write Data     Read Data
```

Commands:

- Modify application state
- Execute business actions
- Handle transactions

Queries:

- Retrieve information
- Do not modify state

Important:

```
CQRS ≠ Separate Databases
```

CQRS only requires separating read and write responsibilities.

Separate databases are an **optional advanced implementation** used when scalability and performance requirements demand it.

CQRS improves maintainability, scalability, and performance for complex systems, but introduces additional complexity and should only be used when the application's needs justify it.