require('dotenv').config({ path: './server/.env' });
const { pool } = require('./server/db');

const siteIds = ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'];
const tenantId = 'test-tenant'; // In a production app, this matches the Clerk user ID
const domain = 'localhost';

async function register() {
  try {
    console.log('Connecting to database and registering test sites...');
    for (const siteId of siteIds) {
      const res = await pool.query(
        `INSERT INTO sites (id, tenant_id, domain) 
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING
         RETURNING *`,
        [siteId, tenantId, domain]
      );
      if (res.rows.length > 0) {
        console.log(`Test site ${siteId} registered successfully:`, res.rows[0]);
      } else {
        console.log(`Test site ${siteId} already exists in the database.`);
      }
    }
  } catch (err) {
    console.error('Failed to register test site:', err);
  } finally {
    await pool.end();
  }
}

register();
