
const express = require("express");

function createProductImportRoutes(ProductLocal, ProductRemote) {

    const router = express.Router();

    const createProductImportController =
        require("../controllers/productImportController");

    const { importProducts } =
        createProductImportController(ProductLocal, ProductRemote);

    router.post("/import", importProducts);

    return router;
}

module.exports = createProductImportRoutes;
