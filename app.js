const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Docker by Hoa Test 4! 🐳');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}`);
});