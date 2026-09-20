// Asynchronous Execution Using Callbacks

function register(callback) {
    setTimeout(() => {
        console.log("Registration completed!");
        callback();
    }, 2500);
}

function sendWelcomeMessage(callback) {
    setTimeout(() => {
        console.log("Welcome message sent!");
        callback();
    }, 3000);
}

function login(callback) {
    setTimeout(() => {
        console.log("Login completed!");
        callback();
    }, 2000);
}

function fetchProfile(callback) {
    setTimeout(() => {
        console.log("Profile fetched!");
        callback();
    }, 4000);
}

function updateStatus(callback) {
    setTimeout(() => {
        console.log("Status updated!");
        callback();
    }, 1500);
}

function logout(callback) {
    setTimeout(() => {
        console.log("Logout completed!");
        callback();
    }, 3500);
}

// Execute functions in the required order using callbacks

register(() => {
    sendWelcomeMessage(() => {
        login(() => {
            fetchProfile(() => {
                updateStatus(() => {
                    logout(() => {
                        console.log("All operations finished!");
                    });
                });
            });
        });
    });
});