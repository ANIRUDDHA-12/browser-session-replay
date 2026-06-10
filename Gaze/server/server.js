require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const { pool, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin:true,
  credentials:true
}));
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

  // Strict UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(siteId)) {
    return res.status(400).json({ error: 'Invalid siteId format. Must be a valid UUID v4.' });
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

    // Calculate metrics for this batch
    let duration = 0;
    if (events[0]?.timestamp && events[events.length - 1]?.timestamp) {
      duration = Math.max(0, events[events.length - 1].timestamp - events[0].timestamp);
    }
    
    let hasRageClicks = false;
    let hasErrors = false;
    for (const e of events) {
      if (e.type === 5 && e.data && e.data.tag) {
        if (e.data.tag === 'rage-click') hasRageClicks = true;
        if (e.data.tag === 'console-error' || e.data.tag === 'dead-click') hasErrors = true;
      }
    }

    // Update session updated_at, duration_ms, and anomaly flags
    await pool.query(
      `UPDATE sessions 
       SET updated_at = CURRENT_TIMESTAMP,
           duration_ms = duration_ms + $2,
           has_rage_clicks = has_rage_clicks OR $3,
           has_errors = has_errors OR $4
       WHERE id = $1`,
      [sessionId, duration, hasRageClicks, hasErrors]
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

// Serve SDK script
app.get('/sdk.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../sdk/dist/tracker.js'));
});

// GET /api/sessions (Requires Auth)
app.get('/api/sessions', ClerkExpressWithAuth({}), async (req, res) => {
  if (!req.auth || !req.auth.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await pool.query('SELECT * FROM sessions WHERE tenant_id = $1 ORDER BY updated_at DESC', [req.auth.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/sessions/:id', ClerkExpressWithAuth({}), async (req, res) => {
  if (!req.auth || !req.auth.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1 AND tenant_id = $2', [id, req.auth.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Session not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/sessions/:id/events', ClerkExpressWithAuth({}), async (req, res) => {
  if (!req.auth || !req.auth.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const sessionCheck = await pool.query('SELECT id FROM sessions WHERE id = $1 AND tenant_id = $2', [id, req.auth.userId]);
    if (sessionCheck.rows.length === 0) return res.status(404).json({ error: 'Session not found' });

    const result = await pool.query('SELECT events FROM session_event_batches WHERE session_id = $1 ORDER BY batch_index ASC', [id]);
    
    let allEvents = [];
    result.rows.forEach(row => {
      allEvents = allEvents.concat(row.events);
    });
    
    res.json(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/sites', ClerkExpressWithAuth({}), async (req, res) => {
  if (!req.auth || !req.auth.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await pool.query('SELECT * FROM sites WHERE tenant_id = $1 ORDER BY created_at DESC', [req.auth.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/sites', ClerkExpressWithAuth({}), async (req, res) => {
  if (!req.auth || !req.auth.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { domain } = req.body;
    const tenantId = req.auth.userId;
    if (!domain) return res.status(400).json({ error: 'Domain is required' });
    
    const result = await pool.query(
      'INSERT INTO sites (tenant_id, domain) VALUES ($1, $2) RETURNING *',
      [tenantId, domain]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Ingestion server running on port ${PORT}`);
});
