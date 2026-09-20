const fs = require("fs");
const data = fs.readFileSync("data.json", "utf8");
const records = JSON.parse(data);

fs.writeFileSync("com.txt", "");
fs.writeFileSync("gov.txt", "");
fs.writeFileSync("edu.txt", "");
fs.writeFileSync("uk.txt", "");

let comCount = 0;
let govCount = 0;
let eduCount = 0;
let ukCount = 0;

records.forEach((record) => {
    const email = record.email.toLowerCase();

    const completeRecord = JSON.stringify(record, null, 2) + "\n\n";

    if (email.endsWith(".com")) {
        fs.appendFileSync("com.txt", completeRecord);
        comCount++;
    }
    else if (email.endsWith(".gov")) {
        fs.appendFileSync("gov.txt", completeRecord);
        govCount++;
    }
    else if (email.endsWith(".edu")) {
        fs.appendFileSync("edu.txt", completeRecord);
        eduCount++;
    }
    else if (email.endsWith(".uk")) {
        fs.appendFileSync("uk.txt", completeRecord);
        ukCount++;
    }
});

// Displaying the  results
console.log("Domain classification completed!");
console.log(`.com records: ${comCount}`);
console.log(`.gov records: ${govCount}`);
console.log(`.edu records: ${eduCount}`);
console.log(`.uk records: ${ukCount}`);
console.log(`Total classified records: ${comCount + govCount + eduCount + ukCount}`);
console.log(`Total input records: ${records.length}`);