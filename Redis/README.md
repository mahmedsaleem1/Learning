# Redis Learning Project

A Node.js project for learning Redis caching concepts.

## Project Structure

```
redis/
├── src/
│   └── index.js          # Main entry point
├── config/
│   └── redis.js          # Redis client configuration
├── .env                  # Environment variables (local)
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore rules
└── package.json          # Project dependencies
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure your Redis connection:
   ```bash
   cp .env.example .env
   ```

3. Make sure Redis server is running

## Usage

Run the application:
```bash
npm start
```

## Dependencies

- `redis` - Redis client for Node.js
- `dotenv` - Environment variable management

## License

ISC
