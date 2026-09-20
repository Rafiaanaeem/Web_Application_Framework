// Asynchronous Execution Using Promises

function register() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Registration completed!");
            resolve();
        }, 2500);
    });
}

function sendWelcomeMessage() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Welcome message sent!");
            resolve();
        }, 3000);
    });
}

function login() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Login completed!");
            resolve();
        }, 2000);
    });
}

function fetchProfile() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Profile fetched!");
            resolve();
        }, 4000);
    });
}

function updateStatus() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Status updated!");
            resolve();
        }, 1500);
    });
}

function logout() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Logout completed!");
            resolve();
        }, 3500);
    });
}

// Execute functions in the required order using Promises

register()
    .then(() => sendWelcomeMessage())
    .then(() => login())
    .then(() => fetchProfile())
    .then(() => updateStatus())
    .then(() => logout())
    .then(() => {
        console.log("All operations finished!");
    });