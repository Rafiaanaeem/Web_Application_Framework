
const resumeSchema = require("../models/Resume");

function createResumeModels(localConnection, remoteConnection) {
    const ResumeLocal = localConnection.model(
        "Resume",
        resumeSchema,
        "resume"
    );

    const ResumeRemote =
        localConnection === remoteConnection
            ? ResumeLocal
            : remoteConnection.model(
                "Resume",
                resumeSchema,
                "resume"
            );

    return { ResumeLocal, ResumeRemote };
}

module.exports = createResumeModels;
