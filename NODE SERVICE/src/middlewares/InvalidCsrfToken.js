function invalidCsrfToken(error, req, res, next) {
  // error handler
  console.log('InvalidCSRFToken middleware: ', JSON.stringify(error));
  if (error.code !== 'EBADCSRFTOKEN') return next(error)

  // handle CSRF token errors here
  res.status(403)
  res.send('form tampered with')
}

module.exports = invalidCsrfToken
