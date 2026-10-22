
const requestCounts = new Map();
const deleteCounts = new Map();
const TRUSTED_IPS = new Set(['127.0.0.1', '::1']);
const BLOCKED_IPS = new Set(['203.0.113.10']);
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;
const MAX_DELETES = 3;

function getClientIp(req) {
  return req.ip.replace(/^::ffff:/, '');
}

function showLimitError(res, message) {
  return res.status(429).render('error', {
    title: 'Too Many Requests',
    message
  });
}

// Limit general requests from each IP.
function generalRateLimiter(req, res, next) {
  const ip = getClientIp(req);

  if (BLOCKED_IPS.has(ip)) {
    return res.status(403).render('error', {
      title: 'IP Blocked',
      message: 'Requests from this IP address are blocked.'
    });
  }

  // Trusted IPs bypass the general request limit.
  if (TRUSTED_IPS.has(ip)) {
    return next();
  }

  const now = Date.now();
  let entry = requestCounts.get(ip);

  if (!entry || now - entry.start >= WINDOW_MS) {
    entry = { start: now, count: 0 };
  }

  entry.count++;
  requestCounts.set(ip, entry);

  if (entry.count > MAX_REQUESTS) {
    return showLimitError(
      res,
      'Request limit exceeded. Please try again in a minute.'
    );
  }

  next();
}

function deleteRateLimiter(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();

  let entry = deleteCounts.get(ip);

  if (!entry || now - entry.start >= WINDOW_MS) {
    entry = { start: now, count: 0 };
  }

  entry.count++;
  deleteCounts.set(ip, entry);

  if (entry.count > MAX_DELETES) {
    return showLimitError(
      res,
      'Delete limit exceeded. Only 3 delete requests per minute are allowed.'
    );
  }

  next();
}

module.exports = {
  generalRateLimiter,
  deleteRateLimiter
};
