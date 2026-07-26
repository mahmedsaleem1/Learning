# Unit of Work (UoW) Pattern

The **Unit of Work (UoW) pattern** is a design pattern that manages a
set of related database operations as a **single transaction**.

Its main goal is to ensure that:

-   Multiple changes are tracked together.
-   All changes are committed successfully, or none are.
-   Database access is coordinated efficiently.

## Simple analogy

Imagine you're transferring money between two bank accounts:

1.  Deduct \$100 from Account A.
2.  Add \$100 to Account B.

Both operations must succeed together. If step 2 fails, step 1 should be
rolled back.

A Unit of Work groups these operations into one transaction.

## Without Unit of Work

``` csharp
accountRepository.Update(accountA);
accountRepository.Save();

accountRepository.Update(accountB);
accountRepository.Save();
```

**Problem:** - First save may succeed. - Second save may fail. - Data
becomes inconsistent.

## With Unit of Work

``` csharp
using (var transaction = unitOfWork.Begin())
{
    accountRepository.Update(accountA);
    accountRepository.Update(accountB);

    unitOfWork.Commit();
}
```

Now: - Both updates succeed → commit. - Any update fails → rollback.

## Responsibilities

A Unit of Work typically:

1.  Tracks new, modified, and deleted entities.
2.  Coordinates repositories.
3.  Manages transactions.
4.  Persists all changes in one commit.

## Relationship with Repository Pattern

``` text
Service Layer
     |
     v
 UnitOfWork
   /     \
UserRepo OrderRepo
```

Example:

``` csharp
public void PlaceOrder(Order order)
{
    _orderRepository.Add(order);

    _inventoryRepository.ReduceStock(order.Items);

    _unitOfWork.Commit();
}
```

## Example Interface

``` csharp
public interface IUnitOfWork
{
    IUserRepository Users { get; }
    IOrderRepository Orders { get; }

    Task CommitAsync();
    Task RollbackAsync();
}
```

Usage:

``` csharp
var user = await unitOfWork.Users.GetById(id);

user.Name = "John";

await unitOfWork.CommitAsync();
```

## ORMs

  ORM                Unit of Work Equivalent
  ------------------ -------------------------
  Entity Framework   `DbContext`
  Hibernate          `Session`
  NHibernate         `ISession`
  SQLAlchemy         `Session`

Example:

``` csharp
using var context = new AppDbContext();

user.Name = "John";
order.Status = "Completed";

await context.SaveChangesAsync();
```

`DbContext` tracks changes and commits them together, effectively acting
as the Unit of Work.

## Benefits

-   Transaction consistency
-   Fewer database round trips
-   Centralized commit/rollback logic
-   Easier testing and maintenance
-   Coordinates multiple repositories

## Drawbacks

-   Additional abstraction layer
-   Can be unnecessary if the ORM already provides it
-   May overcomplicate simple applications

## Summary

The **Unit of Work pattern** is a transaction management pattern that
**collects multiple data changes and commits them as a single atomic
operation**. In ORMs like Entity Framework, `DbContext` already serves
as a Unit of Work.
