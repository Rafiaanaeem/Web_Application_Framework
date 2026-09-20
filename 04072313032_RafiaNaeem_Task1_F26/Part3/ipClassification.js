// Part 3: IP Address Classification
const fs = require("fs");
const data = fs.readFileSync("data.json", "utf8");
const records = JSON.parse(data);

fs.writeFileSync("IP_Class_A.txt", "");
fs.writeFileSync("IP_Class_B.txt", "");
fs.writeFileSync("IP_Class_C.txt", "");
fs.writeFileSync("IP_Class_D.txt", "");
fs.writeFileSync("IP_Class_E.txt", "");

let classACount = 0;
let classBCount = 0;
let classCCount = 0;
let classDCount = 0;
let classECount = 0;
let ignoredCount = 0;

records.forEach((record) => {
    const ip = record.ip_address;
    const firstOctet = parseInt(ip.split(".")[0]);
    const completeRecord = JSON.stringify(record, null, 2) + "\n\n";

    // Class A: 1 - 126
    if (firstOctet >= 1 && firstOctet <= 126) {
        fs.appendFileSync("IP_Class_A.txt", completeRecord);
        classACount++;
    }

    // Class B: 128 - 191
    else if (firstOctet >= 128 && firstOctet <= 191) {
        fs.appendFileSync("IP_Class_B.txt", completeRecord);
        classBCount++;
    }

    // Class C: 192 - 223
    else if (firstOctet >= 192 && firstOctet <= 223) {
        fs.appendFileSync("IP_Class_C.txt", completeRecord);
        classCCount++;
    }

    // Class D: 224 - 239
    else if (firstOctet >= 224 && firstOctet <= 239) {
        fs.appendFileSync("IP_Class_D.txt", completeRecord);
        classDCount++;
    }

    // Class E: 240 - 255
    else if (firstOctet >= 240 && firstOctet <= 255) {
        fs.appendFileSync("IP_Class_E.txt", completeRecord);
        classECount++;
    }
    else {
        ignoredCount++;
    }
});

// Display results
console.log("IP address classification completed!");
console.log(`Class A records: ${classACount}`);
console.log(`Class B records: ${classBCount}`);
console.log(`Class C records: ${classCCount}`);
console.log(`Class D records: ${classDCount}`);
console.log(`Class E records: ${classECount}`);
console.log(`Ignored records: ${ignoredCount}`);
console.log(`Total classified records: ${
    classACount +
    classBCount +
    classCCount +
    classDCount +
    classECount
}`);
console.log(`Total input records: ${records.length}`);