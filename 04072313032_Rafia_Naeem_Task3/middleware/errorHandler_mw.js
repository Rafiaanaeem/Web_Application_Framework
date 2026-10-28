function notFound(req, res, next) {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: `The route ${req.originalUrl} does not exist.`
  });
}

function errorHandler(err, req, res, next) {
  console.error(err.stack || err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).render('error', {
    title: 'Server Error',
    message: 'An unexpected server error occurred.'
  });
}
module.exports = {
  notFound,
  errorHandler
};
