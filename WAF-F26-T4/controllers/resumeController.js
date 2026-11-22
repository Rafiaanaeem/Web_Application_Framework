
const fs = require("fs");
const path = require("path");

function createResumeController(ResumeLocal, ResumeRemote) {
    const sameDatabase = ResumeLocal === ResumeRemote;
    // Create an HTTP error
    function createError(message, statusCode) {
        const error = new Error(message);
        error.statusCode = statusCode;
        return error;
    }

    // Remove newly uploaded files if an operation fails
    async function cleanupUploadedFiles(files = {}) {
        const uploadedFiles = [
            ...(files.image || []),
            ...(files.documents || [])
        ];

        for (const file of uploadedFiles) {
            try {
                await fs.promises.unlink(file.path);
            } catch (error) {
                console.error("Uploaded file cleanup failed:", error.message);
            }
        }
    }

    // Remove stored files when a CV is permanently deleted
    async function cleanupStoredFiles(resume) {
        if (!resume) return;

        const imageFolder = path.join(__dirname, "../uploads/images");
        const documentFolder = path.join(__dirname, "../uploads/documents");

        const filesToDelete = [];

        if (resume.image) {
            filesToDelete.push(
                path.join(imageFolder, path.basename(resume.image))
            );
        }

        for (const document of resume.documents || []) {
            filesToDelete.push(
                path.join(documentFolder, path.basename(document))
            );
        }

        for (const filePath of filesToDelete) {
            try {
                await fs.promises.unlink(filePath);
            } catch (error) {
                if (error.code !== "ENOENT") {
                    console.error("Stored file cleanup failed:", error.message);
                }
            }
        }
    }

    // Convert form data into the Resume schema format
    function parseResumeData(body, files = {}, existingResume = null) {

        const data = {};

        const simpleArrays = [
            "skills",
            "languages",
            "hobbies",
            "achievements"
        ];

        simpleArrays.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(body, field)) {
                const value = body[field];

                data[field] = Array.isArray(value)
                    ? value.map(item => String(item).trim()).filter(Boolean)
                    : String(value || "")
                        .split(",")
                        .map(item => item.trim())
                        .filter(Boolean);
            } else {
                data[field] = existingResume?.[field] || [];
            }
        });

        const objectArrays = [
            "qualifications",
            "certifications",
            "professionalExperience",
            "projects"
        ];

        objectArrays.forEach((field) => {
            let value = body[field];

            if (value === undefined) {
                data[field] = existingResume?.[field] || [];
                return;
            }

            if (!Array.isArray(value)) {
                value = [value];
            }

            data[field] = value.filter(item =>
                item &&
                typeof item === "object" &&
                Object.values(item).some(
                    value => String(value || "").trim() !== ""
                )
            );
        });

        // Basic CV information
        data.fullname = body.fullname?.trim();
        data.contactNumber = body.contactNumber?.trim();
        data.email = body.email?.trim().toLowerCase();
        data.summary = body.summary || "";
        data.researchStatement = body.researchStatement || "";

        // Profile image
        if (files.image?.[0]) {
            data.image = files.image[0].filename;
        } else {
            data.image = existingResume?.image || "";
        }

        // Preserve existing documents and append new documents
        const newDocuments = (files.documents || []).map(
            file => file.filename
        );

        data.documents = [
            ...(existingResume?.documents || []),
            ...newDocuments
        ];

        return data;
    }

    // Display all CVs
    async function getAllResumes(req, res, next) {
        try {
            const resumes = await ResumeLocal.find().sort({
                createdAt: -1
            });

            res.render("home", { resumes });

        } catch (error) {
            next(error);
        }
    }

    // Display add CV form
    function showAddForm(req, res) {
        res.render("newCV");
    }

    // Create a new CV
    
// Create a new CV
async function createResume(req, res, next) {
    try {
        const data = parseResumeData(req.body, req.files);

        const resume = new ResumeLocal(data);

        // Save in the local database
        await resume.save();

        // Save remotely only if it is a separate database
        if (!sameDatabase) {
            try {
                await ResumeRemote.create(resume.toObject());

            } catch (remoteError) {
                // Roll back local record if remote creation fails
                await ResumeLocal.findByIdAndDelete(resume._id);

                throw remoteError;
            }
        }

        res.redirect("/resumes");

    } catch (error) {
        await cleanupUploadedFiles(req.files);
        next(error);
    }
}


    // Display individual CV
    async function getResumeById(req, res, next) {
        try {
            const resume = await ResumeLocal.findById(req.params.id);

            if (!resume) {
                throw createError("CV not found.", 404);
            }

            res.render("details", { resume });

        } catch (error) {
            next(error);
        }
    }

    // Display edit form
    async function showEditForm(req, res, next) {
        try {
            const resume = await ResumeLocal.findById(req.params.id);

            if (!resume) {
                throw createError("CV not found.", 404);
            }

            res.render("edit", { resume });

        } catch (error) {
            next(error);
        }
    }

    // Update an existing CV
    async function updateResume(req, res, next) {
        let previousRemote = null;
        let remoteWasCreated = false;

        try {
            const existingResume = await ResumeLocal.findById(
                req.params.id
            );

            if (!existingResume) {
                throw createError("CV not found.", 404);
            }

            const data = parseResumeData(
                req.body,
                req.files,
                existingResume
            );

            // Keep a copy of the previous remote record for rollback
            previousRemote = await ResumeRemote.findById(req.params.id);

            if (previousRemote) {
                await ResumeRemote.findByIdAndUpdate(
                    req.params.id,
                    data,
                    { runValidators: true }
                );

            } else {
                // Repair a missing remote record
                await ResumeRemote.create({
                    ...data,
                    _id: existingResume._id
                });

                remoteWasCreated = true;
            }

            try {
                await ResumeLocal.findByIdAndUpdate(
                    req.params.id,
                    data,
                    {
                        new: true,
                        runValidators: true
                    }
                );

            } catch (localError) {

                // Restore the previous remote state
                if (remoteWasCreated) {
                    await ResumeRemote.findByIdAndDelete(req.params.id);
                } else if (previousRemote) {
                    await ResumeRemote.findByIdAndUpdate(
                        req.params.id,
                        previousRemote.toObject(),
                        { overwrite: true, runValidators: false }
                    );
                }

                throw localError;
            }

            // Remove the old image only after a successful update
            if (
                req.files?.image?.[0] &&
                existingResume.image
            ) {
                await cleanupStoredFiles({
                    image: existingResume.image,
                    documents: []
                });
            }

            res.redirect("/resumes");

        } catch (error) {
            await cleanupUploadedFiles(req.files);
            next(error);
        }
    }

    // Delete a CV
    async function deleteResume(req, res, next) {
        try {
            const existingResume = await ResumeLocal.findById(
                req.params.id
            );

            if (!existingResume) {
                throw createError("CV not found.", 404);
            }

            // Delete remote record first
            const remoteResume = await ResumeRemote.findByIdAndDelete(
                req.params.id
            );

            try {
                // Then delete local record
                await ResumeLocal.findByIdAndDelete(req.params.id);

            } catch (localError) {

                // Restore remote record if local deletion fails
                if (remoteResume) {
                    await ResumeRemote.create(remoteResume.toObject());
                }

                throw localError;
            }

            // Remove associated files after successful deletion
            await cleanupStoredFiles(existingResume);

            res.redirect("/resumes");

        } catch (error) {
            next(error);
        }
    }

    return {
        getAllResumes,
        showAddForm,
        createResume,
        getResumeById,
        showEditForm,
        updateResume,
        deleteResume
    };
}

module.exports = createResumeController;
