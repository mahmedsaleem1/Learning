# Serverless Architecture

**Serverless Architecture** is a cloud computing architecture where developers build and run applications without managing traditional servers.

The cloud provider is responsible for:

- Server provisioning
- Server maintenance
- Scaling
- Availability
- Infrastructure management

Developers only focus on writing and deploying code.

---

# Why Do We Need Serverless Architecture?

Traditional server-based architecture:

```
Client
  ↓
Application Server
  ↓
Database
```

The organization must manage:

- Server setup
- Operating system updates
- Scaling resources
- Load balancing
- Server availability

With serverless architecture:

```
Client
  ↓
API Gateway
  ↓
Cloud Functions
  ↓
Database / Services
```

The cloud provider automatically manages infrastructure.

---

# What Does "Serverless" Mean?

Serverless does **not mean there are no servers**.

Servers still exist.

The difference is:

```
Traditional Architecture

Developer
    |
    ↓
Manages Servers
    |
    ↓
Runs Application
```

```
Serverless Architecture

Developer
    |
    ↓
Writes Functions
    |
    ↓
Cloud Provider Manages Servers
```

Examples of serverless platforms:

- AWS Lambda
- Azure Functions
- Google Cloud Functions
- Cloudflare Workers

---

# Core Components of Serverless Architecture

## 1. Functions as a Service (FaaS)

The main building block of serverless applications.

A function runs only when triggered.

Example:

```
HTTP Request
      |
      ↓
AWS Lambda Function
      |
      ↓
Return Response
```

Example:

```javascript
exports.handler = async (event) => {

    const user = await getUser(event.userId);

    return {
        statusCode: 200,
        body: JSON.stringify(user)
    };
};
```

The function:

- Executes when called
- Performs a specific task
- Stops after completing execution

---

# 2. API Gateway

API Gateway acts as the entry point for client requests.

Architecture:

```
Client
  |
  ↓
API Gateway
  |
  ↓
Lambda Function
  |
  ↓
Database
```

Responsibilities:

- Routes HTTP requests
- Authentication
- Request validation
- Rate limiting

Example:

```
GET /users/10

        |
        ↓

API Gateway

        |
        ↓

GetUser Function
```

---

# 3. Managed Databases

Serverless applications usually use managed databases.

Examples:

- DynamoDB
- Firebase Firestore
- MongoDB Atlas
- Azure Cosmos DB

The application does not manage:

- Database servers
- Scaling
- Replication
- Backups

Example:

```
Lambda Function
       |
       ↓
DynamoDB
```

---

# 4. Event-Driven Architecture

Serverless applications are often event-driven.

A function runs when an event occurs.

Examples:

```
User Uploads Image
        |
        ↓
Storage Event
        |
        ↓
Image Processing Function
        |
        ↓
Save Result
```

Other events:

- New database record
- File upload
- Payment received
- Scheduled task
- Message queue event

---

# Serverless Architecture Example

Imagine an image-sharing application.

A user uploads a picture.

Flow:

```
User
 |
 ↓
Frontend Application
 |
 ↓
API Gateway
 |
 ↓
Upload Function
 |
 ↓
Cloud Storage
 |
 ↓
Image Processing Function
 |
 ↓
Database
```

Each function performs one responsibility.

---

# Serverless vs Traditional Architecture

## Traditional Architecture

```
Client
 |
 ↓
Backend Server
 |
 ↓
Database
```

The server:

- Runs continuously
- Handles all requests
- Requires scaling
- Needs maintenance

---

## Serverless Architecture

```
Client
 |
 ↓
API Gateway
 |
 ↓
Function
 |
 ↓
Database
```

Functions:

- Run only when needed
- Scale automatically
- Have no server management

---

# Serverless vs Microservices

Serverless and microservices are related but different.

## Microservices

A system is divided into independent services.

Example:

```
Application

 ├── User Service
 ├── Payment Service
 ├── Order Service
 └── Notification Service
```

Each service usually runs continuously.

---

## Serverless

A system is divided into small functions.

Example:

```
Application

 ├── CreateUser Function
 ├── ProcessPayment Function
 ├── SendEmail Function
 └── GenerateReport Function
```

Functions execute only when required.

---

# Benefits of Serverless Architecture

## 1. Automatic Scaling

Serverless platforms automatically handle traffic changes.

Example:

```
100 Users
    ↓
1 Function Instance
```

During high traffic:

```
1 Million Users
    ↓
Thousands of Function Instances
```

No manual scaling is required.

---

## 2. Cost Efficiency

You pay only for execution time.

Traditional:

```
Server Running 24/7
      |
      ↓
Pay continuously
```

Serverless:

```
Function Executes
      |
      ↓
Pay for execution
```

---

## 3. Faster Development

Developers focus on:

- Writing code
- Deploying functions
- Building features

They do not manage:

- Servers
- Operating systems
- Infrastructure

---

## 4. High Availability

Cloud providers handle:

- Hardware failures
- Replication
- Availability zones
- Infrastructure recovery

---

# Limitations of Serverless

## 1. Cold Start

The first request may be slower.

Example:

```
First Request

User
 ↓
Create Function Environment
 ↓
Execute Function
```

Later requests are faster.

---

## 2. Execution Limits

Functions usually have:

- Maximum execution time
- Memory limits
- Package size limits

Not ideal for:

- Long-running processes
- Heavy computation

---

## 3. Vendor Lock-In

Applications may become dependent on cloud providers.

Example:

```
AWS Lambda
      ↓
AWS DynamoDB
      ↓
AWS Services
```

Moving to another provider may require changes.

---

# Serverless Project Structure Example

```
MyServerlessApp
│
├── functions
│      |
│      ├── createUser
│      │      └── index.js
│      |
│      ├── getUser
│      │      └── index.js
│      |
│      └── processPayment
│             └── index.js
│
├── api
│      └── routes.yml
│
├── database
│      └── models
│
└── infrastructure
       └── cloud-config.yml
```

---

# Serverless Request Flow

Example: Creating a user

```
Client
  |
  ↓
POST /users
  |
  ↓
API Gateway
  |
  ↓
CreateUser Function
  |
  ↓
Validate Data
  |
  ↓
Save User
  |
  ↓
Database
  |
  ↓
Response
```

---

# Simple Analogy

Think of a restaurant:

## Traditional Architecture

You own the restaurant.

You manage:

- Building
- Kitchen equipment
- Staff
- Electricity
- Maintenance

---

## Serverless Architecture

You use a food delivery kitchen.

You only provide:

- Recipe (code)
- Order requirements (events)

The kitchen provider manages:

- Equipment
- Staff
- Operations
- Scaling

---

# When To Use Serverless?

Good use cases:

✅ APIs with unpredictable traffic  
✅ Event processing  
✅ File processing  
✅ Background jobs  
✅ Notifications  
✅ IoT applications  
✅ Scheduled tasks  

---

# When Not To Use Serverless?

Avoid serverless for:

❌ Long-running applications  
❌ Heavy computation workloads  
❌ Applications requiring full server control  
❌ Extremely low-latency systems requiring persistent connections  

---

# Summary

Serverless Architecture allows developers to build applications without managing servers.

The architecture:

```
Request
   ↓
API Gateway
   ↓
Cloud Function
   ↓
Database / Services
```

Key ideas:

- Functions execute on demand
- Infrastructure is managed by the cloud provider
- Applications scale automatically
- Costs are based on usage

Serverless helps teams build scalable applications faster while reducing infrastructure management.