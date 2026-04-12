import express from 'express';

const app = express();

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});