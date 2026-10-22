const { requestLogger, logAction } = require('./middleware/loggin_mw');
const { requireLogin, requireAdmin } = require('./middleware/authorization_mw');
const validateRecord = require('./middleware/input_validation_mw');

const {
  generalRateLimiter,
  deleteRateLimiter
} = require('./middleware/rate_limiting_mw');

const {
  notFound,
  errorHandler
} = require('./middleware/errorHandler_mw');


const express = require('express');
const session = require('express-session');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'data.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware using app.use()
app.use(requestLogger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'waf-task3-development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 30 * 60 * 1000
  }
}));

app.use(generalRateLimiter);

async function readRecords() {
  const content = await fs.readFile(dataFile, 'utf8');
  const records = JSON.parse(content);

  if (!Array.isArray(records)) {
    throw new Error('data.json must contain an array.');
  }

  return records;
}

async function writeRecords(records) {
  await fs.writeFile(
    dataFile,
    JSON.stringify(records, null, 2) + '\n',
    'utf8'
  );
}

// function to find a record by its ID
async function findRecord(req, res) {
  const idValue = req.params.id;

  if (!/^[1-9]\d*$/.test(idValue)) {
    res.status(400).render('error', {
      title: 'Invalid Record ID',
      message: 'The record ID must be a positive integer.'
    });
    return null;
  }

  const id = Number(idValue);

  if (!Number.isSafeInteger(id)) {
    res.status(400).render('error', {
      title: 'Invalid Record ID',
      message: 'The record ID is invalid.'
    });
    return null;
  }

  const records = await readRecords();
  const record = records.find(item => item.id === id);

  if (!record) {
    res.status(404).render('error', {
      title: 'Record Not Found',
      message: `No record exists with ID ${id}.`
    });
    return null;
  }

  return { id, records, record };
}
// below are all the routes
// Home route
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/records');
  }

  res.redirect('/login');
});

// Login page
app.get('/login', (req, res) => {
  res.render('login_page', { error: null });
});

// Process login
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  let user = null;

  if (username === 'admin' && password === 'Admin123!') {
    user = { username: 'admin', role: 'admin' };
  } else if (username === 'viewer' && password === 'Viewer123!') {
    user = { username: 'viewer', role: 'viewer' };
  }

  if (!user) {
    return res.status(401).render('login_page', {
      error: 'Invalid username or password.'
    });
  }

  req.session.regenerate(err => {
    if (err) return next(err);

    req.session.user = user;

    req.session.save(err => {
      if (err) return next(err);
      res.redirect('/records');
    });
  });
});

// Logout
app.post('/logout', requireLogin, (req, res, next) => {
  req.session.destroy(err => {
    if (err) return next(err);

    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// View all records
app.get('/records', requireLogin, async (req, res, next) => {
  try {
    const records = await readRecords();

    res.render('records_page', {
      records,
      user: req.session.user
    });
  } catch (err) {
    next(err);
  }
});

// Display add-record form 
app.get('/records/add', requireAdmin, (req, res) => {
  res.render('add_records');
});

// Add a record 
app.post(
  '/records/add',
  requireAdmin,
  validateRecord,
  async (req, res, next) => {
    try {
      const records = await readRecords();

      const maxId = records.reduce(
        (max, record) => Math.max(max, record.id),
        0
      );

      const newRecord = {
        id: maxId + 1,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        email: req.body.email
      };

      records.push(newRecord);
      await writeRecords(records);

      logAction('ADD', newRecord.id, req.session.user.username);
      res.redirect('/records');
    } catch (err) {
      next(err);
    }
  }
);

// Display edit form 
app.get('/records/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const result = await findRecord(req, res);

    if (!result) return;

    res.render('edit_records', {
      record: result.record
    });
  } catch (err) {
    next(err);
  }
});

// Update a record 
app.post(
  '/records/:id/update',
  requireAdmin,
  validateRecord,
  async (req, res, next) => {
    try {
      const result = await findRecord(req, res);

      if (!result) return;

      const { records, record, id } = result;

      record.first_name = req.body.first_name;
      record.last_name = req.body.last_name;
      record.gender = req.body.gender;
      record.email = req.body.email;

      await writeRecords(records);

      logAction('UPDATE', id, req.session.user.username);
      res.redirect('/records');
    } catch (err) {
      next(err);
    }
  }
);

// Delete a record 
app.post(
  '/records/:id/delete',
  requireAdmin,
  deleteRateLimiter,
  async (req, res, next) => {
    try {
      const result = await findRecord(req, res);

      if (!result) return;

      const { records, id } = result;
      const updatedRecords = records.filter(record => record.id !== id);

      await writeRecords(updatedRecords);

      logAction('REMOVE', id, req.session.user.username);
      res.redirect('/records');
    } catch (err) {
      next(err);
    }
  }
);

// Handle unknown routes and server errors
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
