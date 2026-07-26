# Service Layer Pattern

The **Service Layer Pattern** is an architectural pattern that **contains the application's business logic** and acts as a bridge between the **Controllers (Presentation Layer)** and the **Repositories (Data Access Layer)**.

---

# Why Do We Need a Service Layer?

Without a service layer:

```
Controller
    ↓
Repository
    ↓
Database
```

The controller would contain business logic, making the code:

- Hard to maintain
- Hard to test
- Difficult to reuse
- Tightly coupled

With a service layer:

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Each layer has a single responsibility.

---

# Responsibilities of Each Layer

## Controller Layer

The controller is responsible for:

- Receiving HTTP requests
- Validating request format
- Calling service methods
- Returning HTTP responses

Example:

```csharp
[HttpPost]
public async Task<IActionResult> CreateGame(CreateGameDto dto)
{
    var game = await _gameService.CreateAsync(dto);

    return CreatedAtAction(
        nameof(GetById),
        new { id = game.Id },
        game
    );
}
```

The controller should **not contain business logic**.

---

# Service Layer

The service layer contains:

- Business rules
- Validation logic
- Workflow coordination
- Entity and DTO conversion
- Communication between repositories

Example:

```csharp
public class GameService : IGameService
{
    private readonly IGameRepository _repository;

    public GameService(IGameRepository repository)
    {
        _repository = repository;
    }

    public async Task<GameDto> CreateAsync(CreateGameDto dto)
    {
        if (dto.Price < 0)
            throw new Exception("Price cannot be negative.");

        var game = new Game
        {
            Name = dto.Name,
            Genre = dto.Genre,
            Price = dto.Price
        };

        await _repository.AddAsync(game);

        return new GameDto
        {
            Id = game.Id,
            Name = game.Name,
            Genre = game.Genre,
            Price = game.Price
        };
    }
}
```

The service:

- Applies business rules
- Converts DTO → Entity
- Calls repositories
- Converts Entity → DTO

---

# Repository Layer

The repository layer is responsible only for database operations.

Example:

```csharp
public class GameRepository : IGameRepository
{
    private readonly AppDbContext _context;

    public async Task AddAsync(Game game)
    {
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
    }
}
```

The repository:

- Does CRUD operations
- Talks to the database
- Does not contain business rules
- Does not handle DTOs

---

# Real-World Example

Imagine an e-commerce application.

A user purchases a product.

Business rules:

- Product must exist
- Product must have stock
- User must have enough balance
- Reduce product quantity
- Deduct payment
- Create order
- Send confirmation email

## Bad Approach

```
Controller
    ↓
Check stock
Deduct money
Update inventory
Create order
Send email
```

The controller becomes too large.

---

## Better Approach

```
Controller
      ↓
OrderService.PlaceOrder()
      ↓
      ├── ProductRepository
      ├── UserRepository
      ├── OrderRepository
      ├── PaymentService
      └── EmailService
```

The controller only does:

```csharp
await _orderService.PlaceOrder(dto);
```

The service handles the complete workflow.

---

# Service Layer Can Use Multiple Repositories

A service often coordinates multiple repositories.

Example:

```
OrderService
      |
      ├── ProductRepository
      ├── UserRepository
      ├── OrderRepository
      └── PaymentRepository
```

The service acts as an orchestrator.

---

# Service Layer + Repository Pattern

Typical architecture:

```
              HTTP Request
                    |
                    ↓
             GameController
                    |
                    ↓
              GameService
             /     |      \
            ↓      ↓       ↓
     GameRepository GenreRepository ReviewRepository
            \       |       /
             \      |      /
                    ↓
               Database
```

The service coordinates repositories to complete business operations.

---

# Benefits of Service Layer

## 1. Separation of Concerns

Each layer has one responsibility.

```
Controller  → HTTP
Service     → Business Logic
Repository  → Database
```

---

## 2. Reusability

The same service can be used by:

- APIs
- Background jobs
- Console applications
- Other services

---

## 3. Easier Testing

Services can be tested by mocking repositories.

Example:

```
GameService
      |
      ↓
Mock GameRepository
```

No real database is required.

---

## 4. Cleaner Controllers

Instead of:

```csharp
Controller
{
    Validate();
    CheckStock();
    CalculatePrice();
    Save();
}
```

You get:

```csharp
Controller
{
    service.Create();
}
```

---

# Repository vs Service Layer

| Repository | Service |
|---|---|
| Database access | Business logic |
| Uses DbContext | Uses repositories |
| Performs CRUD | Performs workflows |
| Works with entities | Works with DTOs and entities |
| No business rules | Contains business rules |
| Data-focused | Application-focused |

---

# ASP.NET Core Project Structure

```
GameStore.Api
│
├── Controllers
│      └── GameController.cs
│
├── Services
│      ├── IGameService.cs
│      └── GameService.cs
│
├── Repositories
│      ├── IGameRepository.cs
│      └── GameRepository.cs
│
├── Entities
│      └── Game.cs
│
├── DTOs
│      ├── CreateGameDto.cs
│      ├── UpdateGameDto.cs
│      └── GameDto.cs
│
└── Data
       └── AppDbContext.cs
```

---

# Simple Analogy

Think of a restaurant:

| Software Layer | Restaurant |
|---|---|
| Controller | Waiter |
| Service | Chef |
| Repository | Pantry/Storage |
| Database | Inventory |

The waiter takes your order.

The chef decides how to prepare the meal.

The pantry provides ingredients.

The inventory stores the data.

The waiter should not cook, and the pantry staff should not decide recipes.

---

# Summary

The **Service Layer Pattern** places business logic between controllers and repositories.

The flow becomes:

```
Request
   ↓
Controller
   ↓
Service (Business Logic)
   ↓
Repository (Database Access)
   ↓
Database
```

It creates cleaner, more maintainable, testable, and scalable applications.