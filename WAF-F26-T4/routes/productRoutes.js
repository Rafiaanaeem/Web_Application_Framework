
const express = require("express");

const validatePriceRange = require("../middleware/validatePriceRange");
const validatePriceUpdate = require("../middleware/validatePriceUpdate");

const createProductController = require("../controllers/productController");

function createProductRoutes(ProductLocal, ProductRemote) {
    const router = express.Router();

    const controller = createProductController(
        ProductLocal,
        ProductRemote
    );

    // Fetch all products
    router.get("/", controller.getAllProducts);

    // Fetch products within a price range
    router.get(
        "/price-range",
        validatePriceRange,
        controller.getProductsByPriceRange
    );

    // Fetch expired products
    router.get("/expired", controller.getExpiredProducts);

    // Fetch products with quantity below 50
    router.get("/low-stock", controller.getLowStockProducts);

    // Fetch products belonging to a particular firm
    router.get("/firm/:firmName", controller.getProductsByFirm);

    // Delete all expired products
    router.delete("/expired", controller.deleteExpiredProducts);

    // Update prices for a firm or a selected product
    router.patch(
        "/firm/:firmName/price",
        validatePriceUpdate,
        controller.updatePricesByFirm
    );

    return router;
}

module.exports = createProductRoutes;
