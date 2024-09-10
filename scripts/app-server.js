require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');  // Assuming you're using PostgreSQL

const app = express();
const port = process.env.PORT || 3000;
console.log("process.env.DIRECT_DATABASE_URL", process.env.DIRECT_DATABASE_URL)
// Database connection
const pool = new Pool({
  connectionString: process.env.DIRECT_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Redirect server running on port ${port}`);
});