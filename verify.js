const http = require('http');

console.log('Starting verification simulation...');
console.log('1. Ensure the server is running (node server/server.js).');
console.log('2. This script tests the API endpoints the SDK uses.');

const ingressUrl = 'http://localhost:3000';
const siteId = 'test-site-uuid'; // Note: In reality, you'd need a valid siteId from your NeonDB.

const startPayload = JSON.stringify({
  siteId: siteId,
  url: 'http://localhost/test',
  userAgent: 'VerificationScript/1.0',
  width: 1024,
  height: 768
});

const startReq = http.request(ingressUrl + '/api/record/start', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(startPayload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`POST /api/record/start - Status: ${res.statusCode}`);
    console.log(`Response: ${body}`);
    if (res.statusCode === 201) {
      const sessionId = JSON.parse(body).sessionId;
      sendEvents(sessionId);
    } else {
      console.log('Ensure server is running and database is initialized with the test siteId.');
    }
  });
});

startReq.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});
startReq.write(startPayload);
startReq.end();

function sendEvents(sessionId) {
  const eventsPayload = JSON.stringify({
    sessionId: sessionId,
    events: [
      { type: 1, data: { foo: 'bar' }, timestamp: Date.now() },
      { type: 6, data: { plugin: 'rrweb/custom', payload: { tag: 'rage-click' } }, timestamp: Date.now() }
    ]
  });

  const eventReq = http.request(ingressUrl + '/api/record/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(eventsPayload)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`POST /api/record/events - Status: ${res.statusCode}`);
      console.log(`Response: ${body}`);
      console.log('Verification completed.');
    });
  });

  eventReq.on('error', (e) => {
    console.error(`Problem with events request: ${e.message}`);
  });
  eventReq.write(eventsPayload);
  eventReq.end();
}
