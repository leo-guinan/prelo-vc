const express = require('express');
const { Pool } = require('pg');  // Assuming you're using PostgreSQL

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DIRECT_DATABASE_URL,
});

app.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query('SELECT chat_url FROM User WHERE slug = $1', [slug]);
    
    if (result.rows.length > 0) {
      const chatUrl = result.rows[0].chat_url;
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