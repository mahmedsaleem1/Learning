# Domain-Driven Design (DDD) Architecture

**Domain-Driven Design (DDD)** is an architectural approach that focuses on designing software around the **business domain** and its rules instead of focusing only on technical concerns.

The main idea:

> "The structure of the software should reflect the structure of the business."

DDD helps developers build complex applications by creating a shared understanding between:

- Software developers
- Domain experts
- Business stakeholders

---

# Why Do We Need DDD?

Traditional applications are often organized around technical layers:

```
Application

├── Controllers
├── Services
├── Repositories
├── Models
└── Database
```

The problem:

The code structure does not always represent the business.

Example:

An e-commerce system contains:

- Orders
- Payments
- Inventory
- Shipping

But technically it may look like:

```
Controllers

Services

Repositories

Entities
```

Developers think in technical terms while the business thinks in domain concepts.

---

# DDD Approach

DDD organizes software around business capabilities.

Example:

```
E-Commerce System

├── Ordering Domain
│
├── Payment Domain
│
├── Inventory Domain
│
└── Shipping Domain
```

Each domain contains its own:

- Rules
- Logic
- Models
- Processes

---

# Core Concepts of DDD

DDD consists of several important concepts:

1. Domain
2. Domain Model
3. Entity
4. Value Object
5. Aggregate
6. Aggregate Root
7. Repository
8. Domain Service
9. Domain Events
10. Bounded Context

---

# 1. Domain

A **Domain** represents the business area that the software solves.

Examples:

## Banking System

```
Domain:

- Accounts
- Transactions
- Loans
```

## Hospital System

```
Domain:

- Patients
- Doctors
- Appointments
```

The domain contains business knowledge and rules.

---

# 2. Domain Model

The **Domain Model** represents business concepts in code.

Example:

Business rule:

> "A customer cannot place an order without items."

Implementation:

```csharp
public class Order
{
    private List<OrderItem> items = new();

    public void AddItem(OrderItem item)
    {
        if(item == null)
            throw new Exception("Invalid item");

        items.Add(item);
    }
}
```

The business rule lives inside the domain model.

---

# 3. Entity

An **Entity** is an object that has a unique identity.

Even if its properties change, it remains the same object.

Example:

```csharp
public class Customer
{
    public Guid Id { get; private set; }

    public string Name { get; private set; }
}
```

Example:

```
Customer A

ID: 101


Customer B

ID: 102
```

Even if both have the same name, they are different entities.

---

# 4. Value Object

A **Value Object** is an object defined by its values, not identity.

Examples:

- Address
- Money
- Email
- Coordinates

Example:

```csharp
public record Money(
    decimal Amount,
    string Currency
);
```

Two value objects:

```
$100 USD

$100 USD
```

are equal because their values are equal.

---

# Entity vs Value Object

| Entity | Value Object |
|---|---|
| Has unique identity | No identity |
| Can change over time | Usually immutable |
| Compared by ID | Compared by values |
| Example: User | Example: Email |

Example:

```
Customer
    |
    └── Address
```

Customer is an Entity.

Address is a Value Object.

---

# 5. Aggregate

An **Aggregate** is a group of related objects that are treated as one unit.

Example:

```
Order Aggregate

Order
 |
 ├── OrderItem
 |
 ├── ShippingAddress
 |
 └── PaymentInfo
```

The aggregate protects business rules and maintains consistency.

---

# 6. Aggregate Root

The **Aggregate Root** is the main entity that controls access to an aggregate.

Example:

```
Order (Aggregate Root)

    |
    ├── OrderItem
    |
    └── Address
```

Objects inside the aggregate should not be modified directly.

Bad:

```csharp
orderItem.Price = 100;
```

Good:

```csharp
order.UpdateItemPrice(orderItemId, 100);
```

The root controls all changes.

---

# 7. Repository

A Repository provides access to domain objects.

It hides database details from the domain.

Example:

```csharp
public interface IOrderRepository
{
    Order GetById(Guid id);

    void Save(Order order);
}
```

Flow:

```
Application

      ↓

Repository

      ↓

Database
```

The domain does not care whether data comes from:

- SQL Server
- MongoDB
- API
- Cache

---

# 8. Domain Service

Sometimes business logic does not naturally belong inside an Entity.

That logic goes into a Domain Service.

Example:

Currency exchange:

```
ExchangeRateService
```

because it involves multiple objects:

```
Account
Currency
Transaction
```

Example:

```csharp
public class PaymentService
{
    public bool Transfer(
        Account from,
        Account to,
        decimal amount)
    {
        // Business rules
    }
}
```

---

# 9. Domain Events

A **Domain Event** represents something important that happened.

Examples:

```
OrderCreated

PaymentCompleted

UserRegistered
```

Flow:

```
Order Created

      ↓

OrderCreated Event

      ↓

Send Email

      ↓

Update Inventory
```

The domain announces events without knowing who handles them.

---

# 10. Bounded Context

A **Bounded Context** defines the boundary where a domain model applies.

Large systems have multiple contexts.

Example:

```
E-Commerce System


Sales Context

Customer
Order
Product


Shipping Context

Package
Address
Delivery


Payment Context

Invoice
Transaction
Card
```

The same word can have different meanings.

Example:

```
Customer
```

Sales context:

```
Customer = Buyer
```

Shipping context:

```
Customer = Receiver
```

DDD separates these meanings.

---

# DDD Architecture Layers

A common DDD architecture:

```
Presentation

      ↓

Application

      ↓

Domain

      ↓

Infrastructure

      ↓

Database
```

---

# 1. Presentation Layer

Responsible for:

- Receiving requests
- Returning responses
- Handling HTTP/UI communication

Example:

```
Controllers

OrderController.cs
```

---

# 2. Application Layer

Coordinates application use cases.

Contains:

- Commands
- Queries
- DTOs
- Application Services

Example:

```
Application

├── Commands
│      └── CreateOrderCommand.cs
│
├── Queries
│      └── GetOrderQuery.cs
│
└── DTOs
       └── OrderDto.cs
```

The application layer tells the domain what to do.

---

# 3. Domain Layer

The heart of DDD.

Contains:

- Entities
- Value Objects
- Aggregates
- Domain Services
- Domain Events

Example:

```
Domain

├── Entities
│      └── Order.cs
│
├── ValueObjects
│      └── Money.cs
│
├── Events
│      └── OrderCreated.cs
│
└── Services
       └── PricingService.cs
```

Contains business rules.

---

# 4. Infrastructure Layer

Contains technical implementations.

Examples:

- Database access
- External APIs
- Email services
- File storage

Example:

```
Infrastructure

├── Database
│      └── AppDbContext.cs
│
├── Repositories
│      └── OrderRepository.cs
│
└── Email
       └── EmailService.cs
```

---

# DDD Project Structure Example

```
MyApplication

│
├── API
│    └── Controllers
│
├── Application
│
│    ├── Commands
│    ├── Queries
│    └── DTOs
│
├── Domain
│
│    ├── Entities
│    ├── ValueObjects
│    ├── Aggregates
│    ├── Events
│    └── Services
│
└── Infrastructure
     
     ├── Database
     ├── Repositories
     └── ExternalServices
```

---

# DDD vs Traditional Layered Architecture

| Traditional Architecture | DDD Architecture |
|---|---|
| Organized by technical layers | Organized around business domains |
| Database-focused | Business-focused |
| Logic often exists in services | Logic exists in domain models |
| Good for simple CRUD | Good for complex systems |
| Less business modeling | Rich domain models |

---

# DDD vs Vertical Slice Architecture

They solve different problems.

## DDD

Focus:

```
How to model business complexity
```

Example:

```
Order Domain

Payment Domain

Shipping Domain
```

---

## Vertical Slice Architecture

Focus:

```
How to organize application features
```

Example:

```
CreateOrder Feature

CancelOrder Feature

GetOrders Feature
```

They can be combined:

```
DDD + Vertical Slice


Order Domain

├── CreateOrder
├── CancelOrder
└── ShipOrder
```

---

# Benefits of DDD

## 1. Better Business Alignment

Code represents real business concepts.

---

## 2. Handles Complex Logic

Business rules stay inside the domain.

---

## 3. Easier Maintenance

Changes remain within their domain.

---

## 4. Better Communication

Developers and business teams share the same language.

---

# Drawbacks of DDD

## 1. More Complexity

DDD introduces many concepts.

---

## 2. Overkill for Simple Applications

A basic CRUD API usually does not need DDD.

---

## 3. Requires Domain Knowledge

Developers need to understand the business deeply.

---

# When To Use DDD?

Good use cases:

✅ Banking systems  
✅ Healthcare systems  
✅ E-commerce platforms  
✅ Enterprise applications  
✅ Complex business workflows  

---

# When Not To Use DDD?

Avoid for:

❌ Simple CRUD APIs  
❌ Small projects  
❌ Basic dashboards  
❌ Simple database applications  

---

# Simple Analogy

Think of building a hospital system.

## Data-focused approach:

```
Tables:

Patients
Doctors
Appointments
```

Only thinking about data.

---

## DDD approach:

```
Patient Domain

- Register Patient
- Assign Doctor
- Schedule Appointment
- Manage Treatment
```

The software follows real hospital processes.

---

# Summary

**Domain-Driven Design (DDD)** organizes software around business concepts instead of technical components.

The flow:

```
Business Domain

        ↓

Domain Model

        ↓

Entities + Value Objects

        ↓

Aggregates

        ↓

Domain Events

        ↓

Application Layer

        ↓

Infrastructure
```

Key principles:

- Business logic belongs in the domain
- Models represent real business concepts
- Complex rules should not live in controllers
- Software structure should match business structure

The main idea:

> "The domain is the heart of the application. Technology exists to support it."