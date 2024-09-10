require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');  // Assuming you're using PostgreSQL

const app = express();
const port = process.env.PORT || 3000;
// Database connection
const pool = new Pool({
  connectionString: process.env.DIRECT_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

app.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT "chatUrl" FROM "User" WHERE slug = $1', [slug]);
    
    if (result.rows.length > 0) {
      const chatUrl = result.rows[0].chatUrl;
      res.redirect(301, `${chatUrl}`);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Server error');
  }
});

app.get('/', (req, res) => {
  res.send('Health check');
});

app.listen(port, () => {
  console.log(`Redirect server running on port ${port}`);
});