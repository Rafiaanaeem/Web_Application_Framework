const os = require("os");
const path = require("path");
const fs = require("fs");
const prompt = require("prompt");
const chalk = require("chalk");
const colors = require("colors");
const validator = require("validator");

// Display system uptime
const uptimeSeconds = os.uptime();

console.log("System Uptime:");
console.log(`${uptimeSeconds} seconds`);

// Display information about the current JavaScript file

const currentFile = __filename;

console.log("\nCurrent JavaScript File Information:");

console.log("File Name:", path.basename(currentFile));
console.log("Directory:", path.dirname(currentFile));
console.log("Extension:", path.extname(currentFile));
console.log("File Name without Extension:", path.basename(currentFile, path.extname(currentFile)));


function readIPFile(fileName) {

    try {

        if (!fs.existsSync(fileName)) {
            console.log(`${fileName} was not found.`);
            return [];
        }

        const data = fs.readFileSync(fileName, "utf8");

        if (!data.trim()) {
            console.log(`${fileName} is empty.`);
            return [];
        }

        return data
            .split(/\r?\n/)
            .map(ip => ip.trim())
            .filter(ip => ip !== "");

    } catch (error) {

        console.log(`Error reading ${fileName}:`, error.message);
        return [];
    }
}


// Check whether two IPs belong to the same /24 network

function sameNetwork(ip1, ip2) {

    const parts1 = ip1.split(".");
    const parts2 = ip2.split(".");

    return (
        parts1[0] === parts2[0] &&
        parts1[1] === parts2[1] &&
        parts1[2] === parts2[2]
    );
}

prompt.start();

prompt.get(
    [
        {
            name: "name",
            description: "Enter your name"
        },
        {
            name: "email",
            description: "Enter your email"
        },
        {
            name: "ipAddress",
            description: "Enter your IPv4 address"
        }
    ],
    function (error, result) {

        if (error) {
            console.log("Input error:", error.message);
            return;
        }

        const name = result.name.trim();
        const email = result.email.trim();
        const ipAddress = result.ipAddress.trim();

        // Validate name.
        if (!name) {
            console.log("Name cannot be empty.");
            return;
        }

        if (name[0] !== name[0].toUpperCase()) {
            console.log("Invalid name. The first letter must be capitalized.");
            return;
        }

        // Display valid name using chalk.
        console.log(
            chalk.white.bgBlue(`Valid name: ${name}`)
        );

        // Validate email.
        if (!validator.isEmail(email)) {
            console.log("Invalid email address.");
            return;
        }

        console.log("Valid email:", email);

        // Validate IPv4 address.
        if (!validator.isIP(ipAddress, 4)) {
            console.log("Invalid IPv4 address.");
            return;
        }

        console.log("Valid IPv4 address:", ipAddress);
        // IP Authentication

        const whiteList = readIPFile(
            path.join(__dirname, "White.txt")
        );

        const blackList = readIPFile(
            path.join(__dirname, "Black.txt")
        );

        // Check exact Black.txt match first.
        if (blackList.includes(ipAddress)) {

            console.log(
                colors.red(`Access blocked for IP: ${ipAddress}`)
            );

            return;
        }

        // Check exact White.txt match.
        if (whiteList.includes(ipAddress)) {

            console.log(
                colors.green(`Access granted for IP: ${ipAddress}`)
            );

            return;
        }

        // Check whether the IP belongs to the network
        // of an authorized IP.
        const networkMatch = whiteList.find(allowedIP => {
            return sameNetwork(ipAddress, allowedIP);
        });

        if (networkMatch) {

            console.log(
                colors.yellow(
                    `Warning: ${ipAddress} belongs to the network whose IP ${networkMatch} has been authorized. Please contact the administrator.`
                )
            );

            return;
        }

        // IP is not authorized.
        fs.appendFileSync(
            path.join(__dirname, "Pending.txt"),
            `${ipAddress}\n`
        );

        console.log(
            colors.red(
                `Access denied. ${ipAddress} has been added to Pending.txt.`
            )
        );
    }
);