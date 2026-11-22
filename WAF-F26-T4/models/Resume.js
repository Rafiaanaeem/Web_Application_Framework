
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        contactNumber: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        summary: String,

        qualifications: [{
            degree: String,
            institution: String,
            year: String,
            grade: String
        }],

        certifications: [{
            title: String,
            organization: String,
            year: String
        }],

        professionalExperience: [{
            jobTitle: String,
            organization: String,
            duration: String,
            description: String
        }],

        skills: [String],

        languages: [String],

        hobbies: [String],

        researchStatement: String,

        projects: [{
            title: String,
            description: String
        }],

        achievements: [String],

        documents: [String]
    },
    {
        timestamps: true,
        collection: "resume"
    }
);

module.exports = resumeSchema;
