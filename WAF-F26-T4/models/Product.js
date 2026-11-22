
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true
        },

        firmName: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        expiryDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
        collection: "products"
    }
);

module.exports = productSchema;
