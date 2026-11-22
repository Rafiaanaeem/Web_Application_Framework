// Get the beginning of today's date in Pakistan time (UTC+5)
function getTodayStartInPakistan() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Karachi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const dateParts = {};

    for (const part of parts) {
        dateParts[part.type] = part.value;
    }

    return new Date(Date.UTC(
        Number(dateParts.year),
        Number(dateParts.month) - 1,
        Number(dateParts.day)
    ));
}

// Escape special characters in regular expressions
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createProductController(ProductLocal, ProductRemote) {

    // Fetch all products from local database
    async function getAllProducts(req, res, next) {
        try {
            const products = await ProductLocal.find();

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // Fetch products within a price range
    async function getProductsByPriceRange(req, res, next) {
        try {
            const minPrice = req.query.min === undefined
                ? 500
                : Number(req.query.min);

            const maxPrice = req.query.max === undefined
                ? 1000
                : Number(req.query.max);

            const products = await ProductLocal.find({
                price: {
                    $gte: minPrice,
                    $lte: maxPrice
                }
            });

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // Fetch expired products
    async function getExpiredProducts(req, res, next) {
        try {
            const todayStart = getTodayStartInPakistan();

            const products = await ProductLocal.find({
                expiryDate: {
                    $lt: todayStart
                }
            });

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // Fetch products with quantity below 50
    async function getLowStockProducts(req, res, next) {
        try {
            const products = await ProductLocal.find({
                quantity: {
                    $lt: 50
                }
            });

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // Fetch products belonging to a particular firm
    async function getProductsByFirm(req, res, next) {
        try {
            const firmName = req.params.firmName.trim();

            if (!firmName) {
                return res.status(400).json({
                    success: false,
                    message: "Firm name is required."
                });
            }

            const products = await ProductLocal.find({
                firmName: {
                    $regex: `^${escapeRegex(firmName)}$`,
                    $options: "i"
                }
            });

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete expired products from both databases
    async function deleteExpiredProducts(req, res, next) {
        try {
            const todayStart = getTodayStartInPakistan();

            const filter = {
                expiryDate: {
                    $lt: todayStart
                }
            };

            const results = await Promise.all([
                ProductLocal.deleteMany(filter),
                ProductRemote.deleteMany(filter)
            ]);

            res.status(200).json({
                success: true,
                message: "Expired products deleted from both databases.",
                localDeletedCount: results[0].deletedCount,
                remoteDeletedCount: results[1].deletedCount
            });
        } catch (error) {
            next(error);
        }
    }

    // Update prices for a firm or a specific product
    async function updatePricesByFirm(req, res, next) {
        try {
            const firmName = req.params.firmName.trim();
            const { newPrice, productName } = req.body;

            if (!firmName) {
                return res.status(400).json({
                    success: false,
                    message: "Firm name is required."
                });
            }

            if (
                !Number.isFinite(Number(newPrice)) ||
                Number(newPrice) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "A valid non-negative new price is required."
                });
            }

            if (
    productName !== undefined &&
    (typeof productName !== "string" || !productName.trim())
) {
    return res.status(400).json({
        success: false,
        message: "Product name must be a non-empty string."
    });
}

            const filter = {
                firmName: {
                    $regex: `^${escapeRegex(firmName)}$`,
                    $options: "i"
                }
            };

            // If productName is provided, update only that product
            if (productName) {
                filter.productName = {
                    $regex: `^${escapeRegex(productName.trim())}$`,
                    $options: "i"
                };
            }

            const update = {
                $set: {
                    price: Number(newPrice)
                }
            };

            const results = await Promise.all([
                ProductLocal.updateMany(filter, update),
                ProductRemote.updateMany(filter, update)
            ]);

            res.status(200).json({
                success: true,
                message: "Product prices updated in both databases.",
                localModifiedCount: results[0].modifiedCount,
                remoteModifiedCount: results[1].modifiedCount
            });
        } catch (error) {
            next(error);
        }
    }

    return {
        getAllProducts,
        getProductsByPriceRange,
        getExpiredProducts,
        getLowStockProducts,
        getProductsByFirm,
        deleteExpiredProducts,
        updatePricesByFirm
    };
}

module.exports = createProductController;
