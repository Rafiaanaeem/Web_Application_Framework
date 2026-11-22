
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directories if they do not exist
const imageDir = path.join(__dirname, "../uploads/images");
const documentDir = path.join(__dirname, "../uploads/documents");

fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(documentDir, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "image") {
            cb(null, imageDir);
        } else if (file.fieldname === "documents") {
            cb(null, documentDir);
        } else {
            cb(new Error("Invalid file field"));
        }
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

// Validate uploaded file types
function fileFilter(req, file, cb) {
    if (file.fieldname === "image") {
        const allowedImages = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedImages.includes(file.mimetype)) {
            return cb(null, true);
        }

        return cb(new Error("Only JPG, PNG and WEBP images are allowed."));
    }

    if (file.fieldname === "documents") {
        const allowedDocuments = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedDocuments.includes(file.mimetype)) {
            return cb(null, true);
        }

        return cb(new Error("Only PDF, DOC and DOCX documents are allowed."));
    }

    cb(new Error("Unexpected file field."));
}

// Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 6
    }
});

module.exports = upload;
