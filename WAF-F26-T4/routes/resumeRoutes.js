
const express = require("express");

const createResumeController = require("../controllers/resumeController");
const upload = require("../config/upload");
const validateResume = require("../middleware/validateResume");

function createResumeRoutes(ResumeLocal, ResumeRemote) {
    const router = express.Router();

    const controller = createResumeController(
        ResumeLocal,
        ResumeRemote
    );

    // Display all CVs
    router.get("/", controller.getAllResumes);

    // Display the new CV form
    router.get("/addNew", controller.showAddForm);

    // Create a new CV
    router.post(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "documents", maxCount: 5 }
    ]),
    validateResume,
    controller.createResume
);

    // Display the edit form
    router.get("/:id/edit", controller.showEditForm);

    // Display CV details
    router.get("/:id", controller.getResumeById);

    // Update an existing CV
   router.patch(
    "/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "documents", maxCount: 5 }
    ]),
    validateResume,
    controller.updateResume
);

    // Delete a CV
    router.delete("/:id", controller.deleteResume);

    return router;
}

module.exports = createResumeRoutes;
