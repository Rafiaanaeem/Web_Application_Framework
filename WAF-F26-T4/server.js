
require("dotenv").config();
const createProductModels = require("./config/productModels");
const createResumeModels = require("./config/resumeModels");

const createProductRoutes = require("./routes/productRoutes");
const createProductImportRoutes = require("./routes/productImportRoutes");
const createResumeRoutes = require("./routes/resumeRoutes");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const connectDatabases = require("./config/database");
const app = express();

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Support PATCH and DELETE through HTML forms
app.use(methodOverride("_method"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Home route
app.get("/", (req, res) => {
    res.send(`
        <h1>WAF Task 4</h1>
        <p>Grocery Products and CV Management System</p>
        <p>Application server is running.</p>
    `);
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running."
    });
});

// Routes will be registered here after database setup
// app.use("/api/products", productRoutes);
// app.use("/api/products", productImportRoutes);
// app.use("/resumes", resumeRoutes);



// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const { localConnection, remoteConnection } = await connectDatabases();

        const { ProductLocal, ProductRemote } =
    createProductModels(localConnection, remoteConnection);

    const { ResumeLocal, ResumeRemote } =
    createResumeModels(localConnection, remoteConnection);

        // Mount Product routes
        app.use(
            "/api/products",
            createProductRoutes(ProductLocal, ProductRemote)
        );

        // Mount Product import routes
        app.use(
            "/api/products",
            createProductImportRoutes(ProductLocal, ProductRemote)
        );

        // Mount Resume routes
        app.use(
            "/resumes",
            createResumeRoutes(ResumeLocal, ResumeRemote)
        );
        // Handle invalid routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);
        app.listen(PORT, () => {
            console.log("Local MongoDB connected successfully!");
            console.log("Product and Resume models initialized.");
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();

