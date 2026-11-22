
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Convert Mockaroo date strings into valid JavaScript Dates
function parseExpiryDate(value) {
    if (!value) {
        throw new Error("Expiry date is missing.");
    }

    // Handle Mockaroo dates such as 2/16/2026
    const match = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (match) {
        const month = Number(match[1]);
        const day = Number(match[2]);
        const year = Number(match[3]);

        const date = new Date(Date.UTC(year, month - 1, day));

        if (
            date.getUTCFullYear() !== year ||
            date.getUTCMonth() !== month - 1 ||
            date.getUTCDate() !== day
        ) {
            throw new Error(`Invalid expiry date: ${value}`);
        }

        return date;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid expiry date: ${value}`);
    }

    return date;
}

function createProductImportController(ProductLocal, ProductRemote) {

    async function importProducts(req, res, next) {
        let importedIds = [];

        const sameDatabase = ProductLocal === ProductRemote;

        try {
            const filePath = path.join(
                __dirname,
                "../data/productsInformation.json"
            );

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: "productsInformation.json file was not found."
                });
            }

            const fileContent = fs.readFileSync(filePath, "utf8");
            const products = JSON.parse(fileContent);

            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "The JSON file must contain a non-empty array."
                });
            }

            // Validate and prepare all products
            const preparedProducts = products.map((product, index) => {

                const requiredFields = [
                    "productName",
                    "firmName",
                    "price",
                    "quantity",
                    "expiryDate"
                ];

                for (const field of requiredFields) {
                    if (
                        product[field] === undefined ||
                        product[field] === null ||
                        product[field] === ""
                    ) {
                        throw new Error(
                            `Missing ${field} in product at index ${index}.`
                        );
                    }
                }

                const productName = String(product.productName).trim();
                const firmName = String(product.firmName).trim();
                const price = Number(product.price);
                const quantity = Number(product.quantity);

                if (!productName || !firmName) {
                    throw new Error(
                        `Invalid product or firm name at index ${index}.`
                    );
                }

                if (!Number.isFinite(price) || price < 0) {
                    throw new Error(
                        `Invalid price at product index ${index}.`
                    );
                }

                if (!Number.isInteger(quantity) || quantity < 0) {
                    throw new Error(
                        `Invalid quantity at product index ${index}.`
                    );
                }

                return {
                    _id: new mongoose.Types.ObjectId(),
                    productName,
                    firmName,
                    price,
                    quantity,
                    expiryDate: parseExpiryDate(product.expiryDate)
                };
            });

            // Check local database
            const localCount = await ProductLocal.countDocuments();
            if (localCount === 1000) {
    return res.status(409).json({
        success: false,
        message: "The 1000 products have already been imported. Duplicate import is not allowed.",
        localCount
    });
}
            if (localCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Products already exist in the local database. Import cancelled.",
                    localCount
                });
            }

            // Check remote database only if it is separate
            if (!sameDatabase) {
                const remoteCount = await ProductRemote.countDocuments();

                if (remoteCount > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "Products already exist in the remote database. Import cancelled.",
                        localCount,
                        remoteCount
                    });
                }
            }

            importedIds = preparedProducts.map(product => product._id);

            // Import into local database
            await ProductLocal.insertMany(preparedProducts);

            // Import into remote database only when separate
            if (!sameDatabase) {
                await ProductRemote.insertMany(preparedProducts);
            }

            return res.status(201).json({
                success: true,
                message: sameDatabase
                    ? "Products successfully imported into the local database."
                    : "Products successfully imported into both databases.",
                importedCount: preparedProducts.length,
                localDatabase: "Imported",
                remoteDatabase: sameDatabase ? "Not configured separately yet" : "Imported"
            });

        } catch (error) {

            // Roll back partially imported records
            if (importedIds.length > 0) {
                try {
                    await ProductLocal.deleteMany({
                        _id: { $in: importedIds }
                    });

                    if (!sameDatabase) {
                        await ProductRemote.deleteMany({
                            _id: { $in: importedIds }
                        });
                    }

                } catch (cleanupError) {
                    console.error(
                        "Import cleanup failed:",
                        cleanupError.message
                    );
                }
            }

            if (error instanceof SyntaxError) {
                return res.status(400).json({
                    success: false,
                    message: "The products JSON file contains invalid JSON."
                });
            }

            if (
                error.message.includes("Invalid") ||
                error.message.includes("Missing")
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next(error);
        }
    }

    return { importProducts };
}

module.exports = createProductImportController;
