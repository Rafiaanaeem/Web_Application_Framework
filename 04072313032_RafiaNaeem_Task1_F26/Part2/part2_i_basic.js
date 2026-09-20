// Basic Asynchronous Function Execution

function register() {
    setTimeout(() => {
        console.log("Registration completed!");
    }, 2500);
}

function sendWelcomeMessage() {
    setTimeout(() => {
        console.log("Welcome message sent!");
    }, 3000);
}

function login() {
    setTimeout(() => {
        console.log("Login completed!");
    }, 2000);
}

function fetchProfile() {
    setTimeout(() => {
        console.log("Profile fetched!");
    }, 4000);
}

function updateStatus() {
    setTimeout(() => {
        console.log("Status updated!");
    }, 1500);
}

function logout() {
    setTimeout(() => {
        console.log("Logout completed!");
    }, 3500);
}


// Calling the functions in the given order
register();
sendWelcomeMessage();
login();
fetchProfile();
updateStatus();
logout();
console.log("All operations finished!");