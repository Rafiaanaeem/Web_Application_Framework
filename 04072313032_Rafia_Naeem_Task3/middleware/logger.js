
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'logs', 'requests.log');

// Write a message to the log file.
function writeLog(message) {
  fs.appendFileSync(logFile, message + '\n', 'utf8');
}

// Log every incoming HTTP request.
function requestLogger(req, res, next) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    writeLog(
      `[${timestamp}] ${req.method} ${req.originalUrl} ` +
      `Status: ${res.statusCode} Duration: ${duration}ms ` +
      `IP: ${req.ip}`
    );
  });

  next();
}

// Log individual CRUD actions.
function logAction(action, recordId, username) {
  writeLog(
    `[${new Date().toISOString()}] CRUD: ${action} ` +
    `Record ID: ${recordId} User: ${username}`
  );
}

module.exports = {
  requestLogger,
  logAction
};
