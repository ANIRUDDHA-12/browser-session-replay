import { record } from 'rrweb';

const currentScript = document.currentScript;
const scriptSiteId = currentScript ? currentScript.getAttribute('data-site-id') : null;
const scriptIngressUrl = currentScript ? currentScript.getAttribute('data-ingress-url') : null;

const config = window.MyTrackerConfig || {};
const finalSiteId = scriptSiteId || config.siteId;
const finalIngressUrl = scriptIngressUrl || config.ingressUrl || 'http://localhost:3000';

if (!finalSiteId) {
  console.warn('Session Tracker SDK: Missing siteId. Recording disabled.');
} else {
  initTracker();
}

let sessionId = null;
let eventsBuffer = [];
let pendingDeadClicks = [];
const clicksQueue = [];

function initTracker() {
  fetch(`${finalIngressUrl}/api/record/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: finalSiteId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      width: window.innerWidth,
      height: window.innerHeight
    })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  })
  .then(data => {
    sessionId = data.sessionId;
    flushEvents(); // Flush any early events
  })
  .catch(err => {
    console.error('Session Tracker SDK: Failed to start session tracking:', err);
  });

  startRecording();
  setupRageClickDetector();
  setupDeadClickDetector();
  setupErrorInterceptor();

  setInterval(flushEvents, 5000);
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushOnUnload();
    }
  });
}

function startRecording() {
  record({
    emit(event) {
      eventsBuffer.push(event);
    },
    maskAllInputs: true,
    blockClass: 'private-data',
    blockSelector: '[data-private]'
  });
}

function addCustomEvent(tag, payload) {
  if (record && record.addCustomEvent) {
    try {
      record.addCustomEvent(tag, payload);
    } catch (e) {
      // safe fail
    }
  }
}

function setupRageClickDetector() {
  document.addEventListener('click', (e) => {
    const now = Date.now();
    const click = { x: e.clientX, y: e.clientY, time: now };
    clicksQueue.push(click);

    const oneSecondAgo = now - 1000;
    while (clicksQueue.length > 0 && clicksQueue[0].time < oneSecondAgo) {
      clicksQueue.shift();
    }

    if (clicksQueue.length >= 3) {
      let isRage = true;
      for (let i = 0; i < clicksQueue.length; i++) {
        for (let j = i + 1; j < clicksQueue.length; j++) {
          const dx = clicksQueue[i].x - clicksQueue[j].x;
          const dy = clicksQueue[i].y - clicksQueue[j].y;
          if (Math.sqrt(dx * dx + dy * dy) > 100) {
            isRage = false;
            break;
          }
        }
        if (!isRage) break;
      }

      if (isRage) {
        addCustomEvent('rage-click', {
          x: click.x,
          y: click.y,
          clickCount: clicksQueue.length
        });
        clicksQueue.length = 0; // reset to prevent duplicate firing
      }
    }
  }, { capture: true, passive: true });
}

function setupDeadClickDetector() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    markNetworkHappened();
    return originalFetch.apply(this, args);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(...args) {
    markNetworkHappened();
    return originalOpen.apply(this, args);
  };

  function markNetworkHappened() {
    const now = Date.now();
    pendingDeadClicks.forEach(c => {
      if (now - c.time <= 500) c.networked = true;
    });
  }

  const observer = new MutationObserver(() => {
    const now = Date.now();
    pendingDeadClicks.forEach(c => {
      if (now - c.time <= 500) c.mutated = true;
    });
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });

  document.addEventListener('click', (e) => {
    if (isInteractive(e.target)) {
      pendingDeadClicks.push({
        x: e.clientX,
        y: e.clientY,
        target: e.target,
        time: Date.now(),
        mutated: false,
        networked: false,
        resolved: false
      });
    }
  }, { capture: true, passive: true });

  setInterval(() => {
    const now = Date.now();
    for (let i = pendingDeadClicks.length - 1; i >= 0; i--) {
      const c = pendingDeadClicks[i];
      if (now - c.time > 500) {
        if (!c.resolved) {
          c.resolved = true;
          if (!c.mutated && !c.networked) {
            addCustomEvent('dead-click', {
              x: c.x,
              y: c.y,
              tagName: c.target.tagName,
              elementId: c.target.id || null,
              className: c.target.className || null
            });
          }
        }
        pendingDeadClicks.splice(i, 1);
      }
    }
  }, 100);
}

function isInteractive(element) {
  let current = element;
  let depth = 0;
  while (current && depth < 5) {
    const tag = current.tagName;
    if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return true;
    if (current.getAttribute && ['button', 'link'].includes(current.getAttribute('role'))) return true;
    try {
      if (window.getComputedStyle(current).cursor === 'pointer') return true;
    } catch (e) {}
    current = current.parentElement;
    depth++;
  }
  return false;
}

function setupErrorInterceptor() {
  window.addEventListener('error', (event) => {
    addCustomEvent('console-error', {
      message: event.message || 'Unknown error',
      source: event.filename || 'unknown',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      stack: event.error ? event.error.stack : null
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    addCustomEvent('console-error', {
      message: reason ? (reason.message || String(reason)) : 'Unhandled promise rejection',
      source: 'promise',
      lineno: 0,
      colno: 0,
      stack: (reason && reason.stack) ? reason.stack : null
    });
  });
}

function flushEvents() {
  if (!sessionId || eventsBuffer.length === 0) return;

  const eventsToFlush = [...eventsBuffer];
  eventsBuffer = [];

  fetch(`${finalIngressUrl}/api/record/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, events: eventsToFlush }),
    keepalive: true
  }).catch(err => {
    console.error('Session Tracker SDK: Failed to flush events:', err);
    eventsBuffer = [...eventsToFlush, ...eventsBuffer];
  });
}

function flushOnUnload() {
  if (!sessionId || eventsBuffer.length === 0) return;

  const eventsToFlush = [...eventsBuffer];
  eventsBuffer = [];
  const payload = JSON.stringify({ sessionId, events: eventsToFlush });
  const url = `${finalIngressUrl}/api/record/events`;

  let success = false;
  if (navigator.sendBeacon) {
    success = navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
  }

  if (!success) {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true
    }).catch(() => {});
  }
}
