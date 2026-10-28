
function validateRecord(req, res, next) {
  const {
    first_name,
    last_name,
    gender,
    email
  } = req.body;

  const errors = [];

  // validation through regular expressions
  // Validate first name
  if (!first_name || !first_name.trim()) {
    errors.push('First name is required.');
  }

  // Validate last name
  if (!last_name || !last_name.trim()) {
    errors.push('Last name is required.');
  }

  // Validate gender
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    errors.push('Please select a valid gender.');
  }

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    typeof email !== 'string' ||
    !emailPattern.test(email.trim())
  ) {
    errors.push('Please enter a valid email address.');
  }
  // Display errors if any field is invalid
  if (errors.length > 0) {
    return res.status(400).render('error', {
      title: 'Validation Error',
      message: errors.join(' ')
    });
  }

  req.body.first_name = first_name.trim();
  req.body.last_name = last_name.trim();
  req.body.email = email.trim();

  next();
}

module.exports = validateRecord;
