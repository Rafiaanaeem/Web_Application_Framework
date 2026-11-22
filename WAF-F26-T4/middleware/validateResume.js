
function validateResume(req, res, next) {
    const { fullname, contactNumber, email } = req.body;

    if (
        typeof fullname !== "string" ||
        !fullname.trim()
    ) {
        return res.status(400).send("Full name is required.");
    }

    if (
        typeof contactNumber !== "string" ||
        !contactNumber.trim()
    ) {
        return res.status(400).send("Contact number is required.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        typeof email !== "string" ||
        !emailPattern.test(email.trim())
    ) {
        return res.status(400).send("Please provide a valid email address.");
    }

    next();
}

module.exports = validateResume;
