const fs = require("fs");
const path = require("path");
const http = require("http");
const url = require("url");
const EMPLOYEE_FILE = path.join(__dirname, "employees.json");
const USERS_FILE = path.join(__dirname, "users.txt");
const PRODUCTS_FILE = path.join(__dirname, "products.txt");
const BOOKS_FILE = path.join(__dirname, "books.txt");
const LOG_FILE = path.join(__dirname, "log.txt");
const NEW_EMPLOYEE_FILE = path.join(__dirname, "new_employees.json");

// Read employees from employees.json

function readEmployees() {
    try {
        if (!fs.existsSync(EMPLOYEE_FILE)) {
            throw new Error("employees.json was not found.");
        }

        const data = fs.readFileSync(EMPLOYEE_FILE, "utf8");

        if (!data.trim()) {
            throw new Error("employees.json is empty.");
        }

        const employees = JSON.parse(data);

        if (!Array.isArray(employees)) {
            throw new Error("employees.json must contain an array.");
        }

        return employees;

    } catch (error) {
        console.error("Error reading employees.json:", error.message);
        return [];
    }
}

// Save employees to employees.json

function saveEmployees(employees) {
    try {
        fs.writeFileSync(
            EMPLOYEE_FILE,
            JSON.stringify(employees, null, 2),
            "utf8"
        );

        return true;

    } catch (error) {
        console.error("Error saving employees.json:", error.message);
        return false;
    }
}


// Determine IP address class

function getIPClass(ipAddress) {

    if (typeof ipAddress !== "string") {
        return null;
    }

    const parts = ipAddress.split(".");

    if (parts.length !== 4) {
        return null;
    }

    const firstOctet = Number(parts[0]);

    if (firstOctet >= 1 && firstOctet <= 126) {
        return "A";
    }

    if (firstOctet >= 128 && firstOctet <= 191) {
        return "B";
    }

    if (firstOctet >= 192 && firstOctet <= 223) {
        return "C";
    }

    if (firstOctet >= 224 && firstOctet <= 239) {
        return "D";
    }

    if (firstOctet >= 240 && firstOctet <= 255) {
        return "E";
    }

    return null;
}


// Delete all Class E employees

function deleteClassEEmployees() {

    const employees = readEmployees();

    if (employees.length === 0) {
        console.log("No employees found.");
        return;
    }

    const originalCount = employees.length;

    const updatedEmployees = employees.filter(employee => {
        return getIPClass(employee.ipAddress) !== "E";
    });

    const deletedCount =
        originalCount - updatedEmployees.length;

    if (saveEmployees(updatedEmployees)) {

        console.log(`Original employees: ${originalCount}`);
        console.log(`Class E employees deleted: ${deletedCount}`);
        console.log(`Remaining employees: ${updatedEmployees.length}`);
        console.log("employees.json updated successfully.");

    }
}

// Update all Class D employees

function updateClassDEmployees() {

    const employees = readEmployees();

    if (employees.length === 0) {
        console.log("No employees found.");
        return;
    }

    let updatedCount = 0;

    employees.forEach(employee => {

        if (getIPClass(employee.ipAddress) === "D") {

            employee.company = "XYZ Corp";

            updatedCount++;
        }
    });

    if (saveEmployees(employees)) {

        console.log(`Class D employees updated: ${updatedCount}`);
        console.log("Company changed to XYZ Corp.");
        console.log("employees.json updated successfully.");

    }
}

function appendNewEmployees() {
    try {
        const employees = readEmployees();

        if (!fs.existsSync(NEW_EMPLOYEE_FILE)) {
            console.log("new_employees.json file not found.");
            return;
        }

        const newData = fs.readFileSync(NEW_EMPLOYEE_FILE, "utf8");

        if (newData.trim() === "") {
            console.log("new_employees.json is empty.");
            return;
        }

        let newEmployees;

        try {
            newEmployees = JSON.parse(newData);
        } catch (error) {
            console.log("new_employees.json contains invalid JSON.");
            return;
        }

        if (!Array.isArray(newEmployees) || newEmployees.length === 0) {
            console.log("new_employees.json does not contain valid employee records.");
            return;
        }

        // Find the current maximum ID
        let maxId = employees.reduce((max, employee) => {
            return Math.max(max, Number(employee.id));
        }, 0);

        // Reassign IDs to the new employees
        newEmployees.forEach(employee => {
            maxId++;
            employee.id = maxId;
        });

        // Append new employees
        employees.push(...newEmployees);

        // Save updated employees.json
        saveEmployees(employees);

        console.log("New employees added:", newEmployees.length);
        console.log("Total employees now:", employees.length);
        console.log("New IDs start from:", employees[employees.length - newEmployees.length].id);
        console.log("New IDs end at:", employees[employees.length - 1].id);
        console.log("employees.json updated successfully.");

    } catch (error) {
        console.log("Error appending new employees:", error.message);
    }
}


function getClassCEmployees() {
    try {
        const employees = readEmployees();

        const classCEmployees = employees.filter(employee => {
            return getIPClass(employee.ipAddress) === "C";
        });

        return classCEmployees;

    } catch (error) {
        console.log("Error retrieving Class C employees:", error.message);
        return [];
    }
}


const classCEmployees = getClassCEmployees();

console.log("Total Class C employees:", classCEmployees.length);
console.log(JSON.stringify(classCEmployees, null, 2));