
function validatePriceUpdate(req, res, next) {
    const { newPrice } = req.body;

    if (
        newPrice === undefined ||
        newPrice === "" ||
        !Number.isFinite(Number(newPrice)) ||
        Number(newPrice) < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid non-negative newPrice."
        });
    }

    req.body.newPrice = Number(newPrice);

    next();
}

module.exports = validatePriceUpdate;
