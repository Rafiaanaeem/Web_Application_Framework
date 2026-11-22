
function errorHandler(err, req, res, next) {

    console.error("Application Error:", err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode);

    // Handle browser requests
    if (req.accepts("html")) {
        return res.send(`
            <h1>${statusCode} - Error</h1>
            <p>${err.message}</p>
            <a href="/">Go Home</a>
        `);
    }

    // Handle API requests
    res.json({
        success: false,
        message: err.message || "Internal Server Error"
    });
}

module.exports = errorHandler;
