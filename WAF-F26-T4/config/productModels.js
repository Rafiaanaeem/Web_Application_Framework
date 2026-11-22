
const productSchema = require("../models/Product");

function createProductModels(localConnection, remoteConnection) {
    const ProductLocal = localConnection.model(
        "Product",
        productSchema,
        "products"
    );

    const ProductRemote =
        localConnection === remoteConnection
            ? ProductLocal
            : remoteConnection.model(
                "Product",
                productSchema,
                "products"
            );

    return { ProductLocal, ProductRemote };
}

module.exports = createProductModels;
