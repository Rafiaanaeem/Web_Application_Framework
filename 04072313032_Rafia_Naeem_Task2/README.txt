WAF Fall 2026 - Task 2

Name: Rafia Naeem
Roll No: 04072313032

Project: Node.js Web Application and Network-Based Tasks

PART 1 - EMPLOYEE DATA AND IP CLASSIFICATION
-------------------------------------------

- Generated 7,000 employee records using Mockaroo.
- Stored the records in employees.json.
- Each employee contains:
  id, fullName, email, department, ipAddress, company
- Employee IDs are unique and auto-incrementing.
- IP addresses are classified into Class A, B, C, D and E.
- Implemented the following API routes:

  /api/employees/classA
  /api/employees/classB
  /api/employees/classC
  /api/employees/classD
  /api/employees/classE

- Node.js fs module is used to read employees.json and filter employees according to IP class.


PART 2 - EMPLOYEE DATA MODIFICATION
-------------------------------------------


- Removed all Class E employees from employees.json.
- Updated the company of all Class D employees to "XYZ Corp".
- Generated 100 additional employee records in new_employees.json.
- Appended the new employees to employees.json.
- Reassigned employee IDs to maintain unique IDs.
- Implemented Class C employee retrieval.


PART 3 - NODE.JS WEB SERVER
-------------------------------------------


A Node.js HTTP server was created using the built-in http module.

Implemented routes:

  /
  /users
  /products
  /display
  /books

The following files are used to store data:

  users.txt
  products.txt
  books.txt

Query parameters are used to send information to the server.

The /display route displays the stored users, products and books data.

A log.txt file is also maintained. Each request records:

- Serial number
- Date
- Time
- Requested URL
- Number of query parameters


PART 4 - NODE.JS MODULES AND IP AUTHENTICATION
-------------------------------------------


The following Node.js modules/packages were used:

Built-in modules:
- os
- path
- fs

External packages:
- chalk
- colors
- validator
- prompt

The program:

- Displays system uptime.
- Displays information about the current JavaScript file.
- Prompts the user for name, email and IPv4 address.
- Validates the entered name.
- Validates the email using validator.
- Validates the IPv4 address using validator.
- Checks the IP against White.txt and Black.txt.
- Grants access for authorized IP addresses.
- Blocks blacklisted IP addresses.
- Checks whether an IP belongs to an authorized network.
- Adds unauthorized IP addresses to Pending.txt.


Files used:

  White.txt
  Black.txt
  Pending.txt


PART 5 - LOCAL NETWORK CHAT
-------------------------------------------


A chat route was implemented using Node.js.

Route:

  /chat?message=your_message

The Node.js url module is used to parse the request URL and extract the message.

Messages are stored in:

  chat.txt

The server listens on port 8080 and can receive requests using the receiver's local network IP address.


ERROR HANDLING
-------------------------------------------

The project includes error handling for:

- Missing files
- Empty files
- Invalid JSON
- Invalid IPv4 addresses
- Missing query parameters
- Invalid user input
- Invalid email addresses
- Empty name input


HOW TO RUN

1. Open the project folder in PowerShell.

2. Install the required packages if necessary:

   npm install

3. Start the main server:

   node index.js

4. Open a browser and test the required routes.

5. Run Part 4 separately:

   node Part4.js

PROJECT FILES

index.js
Part1.js
Part2.js
Part4.js
employees.json
new_employees.json
users.txt
products.txt
books.txt
log.txt
White.txt
Black.txt
Pending.txt
chat.txt
package.json
package-lock.json
README.txt