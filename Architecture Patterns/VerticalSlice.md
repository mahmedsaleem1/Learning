# Vertical Slice Architecture

**Vertical Slice Architecture** is an architectural pattern where an application is organized around **features or use cases instead of technical layers**.

Instead of grouping code by type:

```
Controllers
Services
Repositories
Models
```

Vertical Slice Architecture groups code by business functionality:

```
Features
 ├── CreateOrder
 ├── CancelOrder
 ├── GetUser
 └── UpdateProfile
```

Each feature contains everything required to complete that operation.

---

# Why Do We Need Vertical Slice Architecture?

Traditional layered architecture:

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Project structure:

```
Application
│
├── Controllers
│      └── OrderController.cs
│
├── Services
│      └── OrderService.cs
│
├── Repositories
│      └── OrderRepository.cs
│
├── DTOs
│      └── OrderDto.cs
│
└── Entities
       └── Order.cs
```

The problem:

A single feature is spread across many folders.

For example, adding "Create Order":

```
Controller
    ↓
Service
    ↓
Repository
    ↓
DTO
    ↓
Entity
```

You must modify multiple places.

---

# Vertical Slice Approach

Instead of organizing by technical layers:

```
Controllers
Services
Repositories
DTOs
```

Organize by business features:

```
Features

 ├── Orders
 │     |
 │     ├── CreateOrder
 │     │       ├── Endpoint.cs
 │     │       ├── Command.cs
 │     │       ├── Handler.cs
 │     │       └── Validator.cs
 │     |
 │     └── CancelOrder
 │             ├── Endpoint.cs
 │             ├── Command.cs
 │             └── Handler.cs
 │
 └── Users
       |
       └── CreateUser
```

Everything related to a feature lives together.

---

# Main Idea

A **vertical slice represents a complete path through the application**.

Example:

```
Create Order Feature

HTTP Request
      |
      ↓
Endpoint
      |
      ↓
Handler
      |
      ↓
Database
      |
      ↓
Response
```

The entire flow exists inside one slice.

---

# Components of Vertical Slice Architecture

## 1. Feature

A feature represents a business action.

Examples:

```
CreateUser
LoginUser
PlaceOrder
GenerateInvoice
```

A feature is usually a user action or business requirement.

---

## 2. Endpoint

Handles communication with the outside world.

Responsibilities:

- Receive request
- Validate input
- Call handler
- Return response

Example:

```csharp
app.MapPost("/orders", async (
    CreateOrderCommand command,
    CreateOrderHandler handler) =>
{
    var result = await handler.Handle(command);

    return Results.Ok(result);
});
```

---

## 3. Command

Represents an action that changes data.

Examples:

```
CreateOrderCommand
UpdateUserCommand
DeleteProductCommand
```

Example:

```csharp
public record CreateOrderCommand(
    int UserId,
    List<int> ProductIds
);
```

---

## 4. Handler

Contains the business logic for that feature.

Example:

```csharp
public class CreateOrderHandler
{
    private readonly AppDbContext _context;

    public CreateOrderHandler(AppDbContext context)
    {
        _context = context;
    }


    public async Task<OrderDto> Handle(
        CreateOrderCommand command)
    {
        var order = new Order
        {
            UserId = command.UserId
        };

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return new OrderDto(order.Id);
    }
}
```

The handler:

- Executes the use case
- Applies business rules
- Saves data
- Returns result

---

# Example: Traditional vs Vertical Slice

## Traditional Layered Architecture

Creating a user:

```
Controllers
    |
    └── UserController.cs


Services
    |
    └── UserService.cs


Repositories
    |
    └── UserRepository.cs


DTOs
    |
    └── CreateUserDto.cs
```

The feature is scattered.

---

## Vertical Slice Architecture

Creating a user:

```
Features

└── Users
     |
     └── CreateUser
          |
          ├── Endpoint.cs
          ├── Command.cs
          ├── Handler.cs
          ├── Validator.cs
          └── Response.cs
```

Everything is together.

---

# Vertical Slice + CQRS

Vertical Slice Architecture is often used with **CQRS (Command Query Responsibility Segregation)**.

CQRS separates:

## Commands

Operations that modify data.

Examples:

```
CreateUser
UpdateOrder
DeleteProduct
```

---

## Queries

Operations that read data.

Examples:

```
GetUser
GetOrders
SearchProducts
```

Example:

```
Features

├── Orders
│
├── CreateOrder
│      ├── Command.cs
│      └── Handler.cs
│
└── GetOrders
       ├── Query.cs
       └── Handler.cs
```

---

# Vertical Slice vs Layered Architecture

| Layered Architecture | Vertical Slice Architecture |
|---|---|
| Organized by technical layers | Organized by features |
| Controllers together | Features together |
| Services shared | Logic closer to use case |
| More abstraction | Less unnecessary abstraction |
| Good for CRUD apps | Good for complex applications |
| Changes affect many files | Changes stay inside a slice |

---

# Benefits of Vertical Slice Architecture

## 1. Better Maintainability

A feature is self-contained.

Example:

```
Payment Feature

Payment
 ├── Endpoint
 ├── Handler
 ├── Validation
 └── Models
```

Everything is easy to find.

---

## 2. Faster Development

Developers work on one feature at a time.

Adding a feature:

```
Create Feature Folder
        ↓
Add Logic
        ↓
Deploy
```

---

## 3. Less Coupling

Features do not depend heavily on each other.

Example:

```
Orders Feature

does not need to know about

Users Feature
```

---

## 4. Easier Testing

Each slice can be tested independently.

Example:

```
CreateOrderHandler

Input
 ↓
Handler
 ↓
Output
```

---

## 5. Better Team Collaboration

Different developers can work on different slices.

Example:

```
Developer A
 └── Payment Feature


Developer B
 └── User Feature


Developer C
 └── Order Feature
```

---

# Drawbacks of Vertical Slice Architecture

## 1. Possible Code Duplication

Different features may have similar logic.

Example:

```
CreateUser
UpdateUser
RegisterUser
```

may each need validation.

---

## 2. More Files

Large applications can contain many small files.

---

## 3. Requires Good Design

Poorly designed slices can become difficult to maintain.

---

# ASP.NET Core Project Structure Example

```
MyApplication

│
├── Features
│
│    ├── Users
│    │      |
│    │      └── CreateUser
│    │             ├── Endpoint.cs
│    │             ├── Command.cs
│    │             ├── Handler.cs
│    │             └── Validator.cs
│    │
│    └── Orders
│           |
│           └── CreateOrder
│                  ├── Endpoint.cs
│                  ├── Command.cs
│                  └── Handler.cs
│
├── Infrastructure
│       └── Database
│
└── Common
        └── Utilities
```

---

# Simple Analogy

Think of a restaurant.

## Layered Architecture

Separate departments:

```
Kitchen Department
Payment Department
Delivery Department
Customer Department
```

A single order moves through many departments.

---

## Vertical Slice Architecture

Each meal has its own complete team:

```
Pizza Order

Chef
Ingredients
Payment
Delivery
```

Everything needed for pizza is together.

---

# When To Use Vertical Slice Architecture?

Good for:

✅ Large applications  
✅ Complex business domains  
✅ Applications with many features  
✅ Systems using CQRS  
✅ Teams working on many features  

---

# When Not To Use It?

Avoid for:

❌ Small CRUD applications  
❌ Simple APIs  
❌ Prototypes with few features  

A simple layered architecture may be enough.

---

# Summary

Vertical Slice Architecture organizes applications around **business features instead of technical layers**.

The flow becomes:

```
Request
   ↓
Feature Endpoint
   ↓
Command / Query
   ↓
Handler
   ↓
Database
   ↓
Response
```

Key idea:

> "Organize code around what the application does, not how the code is technically divided."

Vertical Slice Architecture improves maintainability, scalability, and feature development speed by keeping related code together.