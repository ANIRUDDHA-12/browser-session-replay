require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { pool, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Increase limits for large JSON payloads from rrweb
app.use(express.json({ limit: '50mb' }));

// Initialize DB on boot
initDatabase().catch(err => {
  console.error("Critical: Database initialization failed", err);
  process.exit(1);
});

// POST /api/record/start
// Validates siteId and creates a new active session
app.post('/api/record/start', async (req, res) => {
  const { siteId, url, userAgent, width, height } = req.body;

  if (!siteId || !url || !userAgent) {
    return res.status(400).json({ error: 'Missing required fields: siteId, url, userAgent' });
  }

  try {
    // Look up tenant_id from sites
    const siteResult = await pool.query('SELECT tenant_id FROM sites WHERE id = $1', [siteId]);
    
    if (siteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Site not found or unregistered' });
    }

    const tenantId = siteResult.rows[0].tenant_id;
    const sessionId = crypto.randomUUID();

    // Insert new session
    await pool.query(
      `INSERT INTO sessions (id, tenant_id, site_id, url, user_agent, status)
       VALUES ($1, $2, $3, $4, $5, 'active')`,
      [sessionId, tenantId, siteId, url, userAgent]
    );

    res.status(201).json({ sessionId });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/record/events
// Accepts sessionId and an array of events, performs append-only insert
app.post('/api/record/events', async (req, res) => {
  const { sessionId, events } = req.body;

  if (!sessionId || !events || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid fields: sessionId, events array' });
  }

  try {
    // Append-only insert into session_event_batches
    await pool.query(
      `INSERT INTO session_event_batches (session_id, events)
       VALUES ($1, $2::jsonb)`,
      [sessionId, JSON.stringify(events)]
    );

    // Update session updated_at timestamp
    await pool.query(
      `UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [sessionId]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    // Handle foreign key violation if session does not exist
    if (error.code === '23503') {
      return res.status(404).json({ error: 'Session not found' });
    }
    console.error('Error recording events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Ingestion server running on port ${PORT}`);
});
