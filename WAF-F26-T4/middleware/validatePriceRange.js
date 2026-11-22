
function validatePriceRange(req, res, next) {
    const min = req.query.min;
    const max = req.query.max;

    if (min !== undefined && (!Number.isFinite(Number(min)) || Number(min) < 0)) {
        return res.status(400).json({
            success: false,
            message: "Minimum price must be a valid non-negative number."
        });
    }

    if (max !== undefined && (!Number.isFinite(Number(max)) || Number(max) < 0)) {
        return res.status(400).json({
            success: false,
            message: "Maximum price must be a valid non-negative number."
        });
    }

    const minPrice = min === undefined ? 500 : Number(min);
    const maxPrice = max === undefined ? 1000 : Number(max);

    if (minPrice > maxPrice) {
        return res.status(400).json({
            success: false,
            message: "Minimum price cannot be greater than maximum price."
        });
    }

    next();
}

module.exports = validatePriceRange;
