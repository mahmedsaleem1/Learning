# Repository Design Pattern

The **Repository Pattern** is a design pattern that acts as a middle layer between your application's business logic and the database.

Instead of accessing the database directly, your code talks to a **repository**, which handles all data operations.

## Why Use It?

- Separates business logic from data access logic.
- Makes code easier to maintain.
- Makes testing easier (repositories can be mocked).
- Allows changing the database without affecting business logic.

---

## Real-Life Analogy

Think of a **library**.

- You **don't** go into the storage room to find a book.
- You ask the **librarian**.
- The librarian knows where the books are and gets them for you.

Here:

- **Application** → You
- **Repository** → Librarian
- **Database** → Library storage

---

## Repository Responsibilities

A repository usually provides methods like:

- Create (Add)
- Read (Get)
- Update
- Delete

These are commonly called **CRUD operations**.

Example:

```csharp
Add(product);
GetById(id);
Update(product);
Delete(id);
```

---

## Basic Structure

```
Application
      │
      ▼
Repository Interface
      │
      ▼
Repository Implementation
      │
      ▼
Database
```

---

## Implementation Steps

### 1. Create the Entity

Example:

```csharp
class Product
{
    Id
    Name
    Price
}
```

Represents the data stored in the database.

---

### 2. Create a Repository Interface

Define what operations are allowed.

Example:

```csharp
interface IProductRepository
{
    Add();
    GetById();
    Update();
    Delete();
}
```

The interface only declares methods.

---

### 3. Create the Repository Implementation

Implement the interface.

Example:

```csharp
class ProductRepository : IProductRepository
{
    // actual database logic
}
```

This class contains all database-related code.

---

### 4. Use the Repository

Instead of writing SQL or database code everywhere:

```csharp
repository.Add(product);

repository.GetById(1);

repository.Update(product);

repository.Delete(2);
```

Business logic never talks directly to the database.

---

# Advantages

- Clean separation of concerns.
- Easier to test.
- Easier to maintain.
- Database can be replaced with minimal changes.
- Centralized data access logic.

---

# Disadvantages

- Adds unnecessary complexity for small projects.
- Requires extra interfaces and classes.
- Can sometimes hide useful database-specific features.

---

# Common Use Cases

- ASP.NET Core applications
- REST APIs
- Microservices
- Large enterprise applications
- Unit testing with mocked repositories
- Applications where the database may change

---

# Limitation

The Repository Pattern works best for similar data sources (like SQL databases).

Some data sources have unique features:

- SQL databases → Transactions, joins, complex queries.
- Object storage (e.g., S3) → File uploads, pre-signed URLs.

Trying to force everything into one generic CRUD repository can hide these specialized capabilities.

---

# Key Takeaway

> **Repository Pattern = A middle layer that hides database operations from the rest of the application.**

Business Logic → Repository → Database

This keeps the code cleaner, easier to maintain, and easier to test.