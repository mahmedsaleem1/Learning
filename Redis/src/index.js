import express from 'express';
import { redis } from './redis.js';

const app = express();

app.get('/redis', async (req, res) => {
  try {
    const cacheData = await redis.get('todos');

    if (cacheData) {
      return res.json(JSON.parse(cacheData));
    }

    const data = await fetch('https://jsonplaceholder.typicode.com/todos/')
    .then(response => response.json());

    await redis.setex('todos', 60, JSON.stringify(data)); // Set cache with expiration of 60 seconds
    
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});