const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 8080;
const EMPLOYEE_FILE = path.join(__dirname, "employees.json");
const USERS_FILE = path.join(__dirname, "users.txt");
const PRODUCTS_FILE = path.join(__dirname, "products.txt");
const BOOKS_FILE = path.join(__dirname, "books.txt");
const LOG_FILE = path.join(__dirname, "log.txt");


// --------------------------------------------------
// Read employees from employees.json
// --------------------------------------------------

function readEmployees() {
    try {
        // Check whether the file exists.
        if (!fs.existsSync(EMPLOYEE_FILE)) {
            throw new Error("employees.json was not found.");
        }

        // Read the file.
        const data = fs.readFileSync(EMPLOYEE_FILE, "utf8");

        // Check whether the file is empty.
        if (!data.trim()) {
            throw new Error("employees.json is empty.");
        }

        // Convert JSON text into a JavaScript array.
        const employees = JSON.parse(data);

        // Make sure the JSON contains an array.
        if (!Array.isArray(employees)) {
            throw new Error("employees.json must contain an array.");
        }

        return employees;

    } catch (error) {
        console.error("Error reading employees.json:", error.message);
        return [];
    }
}


// --------------------------------------------------
// Determine the IP address class
// --------------------------------------------------

function getIPClass(ipAddress) {

    // Make sure the IP is a string.
    if (typeof ipAddress !== "string") {
        return null;
    }

    // Split the IP into its four octets.
    const parts = ipAddress.split(".");

    // IPv4 must have exactly four parts.
    if (parts.length !== 4) {
        return null;
    }

    // Convert the first octet into a number.
    const firstOctet = Number(parts[0]);

    // Class A: 1 - 126
    if (firstOctet >= 1 && firstOctet <= 126) {
        return "A";
    }

    // Class B: 128 - 191
    if (firstOctet >= 128 && firstOctet <= 191) {
        return "B";
    }

    // Class C: 192 - 223
    if (firstOctet >= 192 && firstOctet <= 223) {
        return "C";
    }

    // Class D: 224 - 239
    if (firstOctet >= 224 && firstOctet <= 239) {
        return "D";
    }

    // Class E: 240 - 255
    if (firstOctet >= 240 && firstOctet <= 255) {
        return "E";
    }

    // 127 and invalid values do not belong to these classes.
    return null;
}


// --------------------------------------------------
// Get employees belonging to a particular IP class
// --------------------------------------------------

function getEmployeesByClass(className) {

    const employees = readEmployees();

    return employees.filter(employee => {
        return getIPClass(employee.ipAddress) === className;
    });
}

// --------------------------------------------------
// Log every URL request
// --------------------------------------------------

function logRequest(req, query) {

    try {

        let serialNumber = 1;

        // Check whether log.txt already contains records.
        if (fs.existsSync(LOG_FILE)) {

            const existingData = fs.readFileSync(LOG_FILE, "utf8").trim();

            if (existingData) {
                serialNumber = existingData.split("\n").length + 1;
            }
        }

        const currentDate = new Date();

        const date = currentDate.toLocaleDateString();
        const time = currentDate.toLocaleTimeString();

        const queryParameterCount = Object.keys(query).length;

        const logEntry =
            `Serial: ${serialNumber}, Date: ${date}, Time: ${time}, URL: ${req.url}, Query Parameters: ${queryParameterCount}\n`;

        fs.appendFileSync(LOG_FILE, logEntry);

    } catch (error) {

        console.error("Error writing to log.txt:", error.message);

    }
}

// --------------------------------------------------
// Send JSON response
// --------------------------------------------------

function sendJSON(res, data, statusCode = 200) {

    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data, null, 2));
}


// --------------------------------------------------
// Create HTTP server
// --------------------------------------------------

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
const pathname = parsedUrl.pathname;
const query = parsedUrl.query;

console.log(`${req.method} ${req.url}`);

logRequest(req, query);

    // ----------------------------------------------
    // Class A
    // ----------------------------------------------

    if (pathname === "/api/employees/classA") {

        const employees = getEmployeesByClass("A");

        sendJSON(res, employees);

        return;
    }


    // ----------------------------------------------
    // Class B
    // ----------------------------------------------

    if (pathname === "/api/employees/classB") {

        const employees = getEmployeesByClass("B");

        sendJSON(res, employees);

        return;
    }


    // ----------------------------------------------
    // Class C
    // ----------------------------------------------

    if (pathname === "/api/employees/classC") {

        const employees = getEmployeesByClass("C");

        sendJSON(res, employees);

        return;
    }


    // ----------------------------------------------
    // Class D
    // ----------------------------------------------

    if (pathname === "/api/employees/classD") {

        const employees = getEmployeesByClass("D");

        sendJSON(res, employees);

        return;
    }


    // ----------------------------------------------
    // Class E
    // ----------------------------------------------

    if (pathname === "/api/employees/classE") {

        const employees = getEmployeesByClass("E");

        sendJSON(res, employees);

        return;
    }

    // Part 3 routes

if (pathname === "/users") {

    const id = query.id;
    const name = query.name;
    const age = query.age;
    const city = query.city;
    const university = query.university;

    if (!id || !name || !age || !city || !university) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Missing user information. Please provide id, name, age, city, and university.");
        return;
    }

    const userData =
        `ID: ${id}, Name: ${name}, Age: ${age}, City: ${city}, University: ${university}\n`;

    fs.appendFileSync(
        path.join(__dirname, "users.txt"),
        userData
    );

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("User data saved successfully.");

    return;
}

if (pathname === "/products") {

    const id = query.id;
    const title = query.title;
    const price = query.price;

    if (!id || !title || !price) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Missing product information. Please provide id, title, and price.");
        return;
    }

    const productData =
        `ID: ${id}, Product Title: ${title}, Product Price: ${price}\n`;

    fs.appendFileSync(
        path.join(__dirname, "products.txt"),
        productData
    );

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Product data saved successfully.");

    return;
}

if (pathname === "/books") {

    const id = query.id;
    const title = query.title;
    const edition = query.edition;
    const year = query.year;
    const press = query.press;

    if (!id || !title || !edition || !year || !press) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Missing book information. Please provide id, title, edition, year, and press.");
        return;
    }

    const bookData =
        `ID: ${id}, Book Title: ${title}, Edition: ${edition}, Year of Publication: ${year}, Press Name: ${press}\n`;

    fs.appendFileSync(
        path.join(__dirname, "books.txt"),
        bookData
    );

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Book data saved successfully.");

    return;
}

if (pathname === "/display") {

    const usersFile = path.join(__dirname, "users.txt");
    const productsFile = path.join(__dirname, "products.txt");
    const booksFile = path.join(__dirname, "books.txt");

    let usersData = "";
    let productsData = "";
    let booksData = "";

    try {
        usersData = fs.readFileSync(usersFile, "utf8");

        if (!usersData.trim()) {
            usersData = "No user data available.";
        }

    } catch (error) {
        usersData = "users.txt was not found.";
    }

    try {
        productsData = fs.readFileSync(productsFile, "utf8");

        if (!productsData.trim()) {
            productsData = "No product data available.";
        }

    } catch (error) {
        productsData = "products.txt was not found.";
    }

    try {
        booksData = fs.readFileSync(booksFile, "utf8");

        if (!booksData.trim()) {
            booksData = "No book data available.";
        }

    } catch (error) {
        booksData = "books.txt was not found.";
    }

    const displayData =
        "========== USERS ==========\n\n" +
        usersData +
        "\n\n========== PRODUCTS ==========\n\n" +
        productsData +
        "\n\n========== BOOKS ==========\n\n" +
        booksData;

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end(displayData);

    return;
}

// ----------------------------------------------
// Chat route
// ----------------------------------------------

if (pathname === "/chat") {

    const message = query.message;

    if (!message) {
        res.writeHead(400, {
            "Content-Type": "text/plain"
        });

        res.end("Missing message. Use /chat?message=your_message");
        return;
    }

    const chatEntry =
        `${new Date().toLocaleString()} - ${message}\n`;

    fs.appendFileSync(
        path.join(__dirname, "chat.txt"),
        chatEntry
    );

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("Message received and saved.");

    return;
}
    // ----------------------------------------------
    // Home route
    // ----------------------------------------------

    if (pathname === "/") {

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end("WAF Fall 2026 Task 2 Server is running.");

        return;
    }


    // Route not found

    res.writeHead(404, {
        "Content-Type": "text/plain"
    });

    res.end("404 - Route not found.");
});

// Start server

server.listen(PORT, "0.0.0.0", () => {

    console.log(`Server is running on port ${PORT}.`);

    console.log(
        `Open http://localhost:${PORT}/ in your browser.`
    );
});