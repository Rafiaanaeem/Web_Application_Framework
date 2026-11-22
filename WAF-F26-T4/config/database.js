
const mongoose = require("mongoose");

async function connectDatabases() {
    try {
        // Connect to Local MongoDB
        const localConnection = mongoose.createConnection(
            process.env.LOCAL_MONGO_URI
        );

        await localConnection.asPromise();

        console.log("Local MongoDB connected successfully!");
        console.log("Local Database:", localConnection.name);

        // Connect to Remote MongoDB Atlas
        const remoteConnection = mongoose.createConnection(
            process.env.REMOTE_MONGO_URI
        );

        await remoteConnection.asPromise();

        console.log("Remote MongoDB Atlas connected successfully!");
        console.log("Remote Database:", remoteConnection.name);

        return {
            localConnection,
            remoteConnection
        };

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}

module.exports = connectDatabases;