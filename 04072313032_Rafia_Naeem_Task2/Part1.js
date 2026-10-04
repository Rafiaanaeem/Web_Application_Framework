const fs = require("fs");

let allEmployees = [];

for (let i = 1; i <= 7; i++) {
    const fileName = `employees_${i}.json`;

    try {
        if (!fs.existsSync(fileName)) {
            throw new Error(`${fileName} was not found.`);
        }

        const data = fs.readFileSync(fileName, "utf8");

        if (!data.trim()) {
            throw new Error(`${fileName} is empty.`);
        }

        const employees = JSON.parse(data);

        if (!Array.isArray(employees)) {
            throw new Error(`${fileName} does not contain a JSON array.`);
        }

        allEmployees = allEmployees.concat(employees);

        console.log(`${fileName}: ${employees.length} records loaded.`);
    } catch (error) {
        console.error(`Error processing ${fileName}: ${error.message}`);
        process.exit(1);
    }
}

// Reassign IDs and correct field names.
allEmployees.forEach((employee, index) => {
    employee.id = index + 1;

    employee.fullName = employee.full_name;
    employee.ipAddress = employee.ip_address;

    delete employee.full_name;
    delete employee.ip_address;
});

// Save the final combined file.
fs.writeFileSync(
    "employees.json",
    JSON.stringify(allEmployees, null, 2),
    "utf8"
);

console.log(`\nTotal employees: ${allEmployees.length}`);
console.log("employees.json created successfully.");