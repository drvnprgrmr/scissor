const usernameField = document.getElementById("field-username");
const emailField = document.getElementById("field-email");
const passwordField = document.getElementById("field-password");
const repeatField = document.getElementById("field-password-repeat");
const form = document.getElementById("form");
form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    // Username validation
    if (!validator.isAlphanumeric(usernameField.value)) {
        alert("Username must only contain alphanumeric characters");
        return usernameField.focus();
    }
    else if (usernameField.value.length < 3 ||
        usernameField.value.length > 30) {
        alert("Username must be between 3 and 30 characters");
        return usernameField.focus();
    }
    // Email validation
    if (!validator.isEmail(emailField.value)) {
        alert("Invalid email format");
        return emailField.focus();
    }
    // Password validation
    if (!validator.isStrongPassword(passwordField.value)) {
        alert("Password must be at least 8 characters, " +
            "contain one uppercase and lowercase letter, " +
            "and one number and symbol");
        return passwordField.focus();
    }
    // Repeat password validation
    if (!validator.equals(passwordField.value, repeatField.value)) {
        alert("Passwords do not match");
        return repeatField.focus();
    }
    form.submit();
});
