const update = document.getElementById("update");
const del = document.getElementById("delete");
// Update account details
update.addEventListener("submit", (ev) => {
    ev.preventDefault();
    // Get form data
    const formData = new FormData(update);
    // Prompt for password
    const password = prompt("Enter your password to proceed");
    if (!password)
        return alert("You didn't enter a password");
    fetch("/u", {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            username: formData.get("username"),
            password,
            passwordNew: formData.get("password-new"),
            passwordRepeat: formData.get("password-repeat"),
        })
    }).then(res => res.text()).then(err => {
        if (err)
            alert(err);
        else {
            alert("Account updated successfully!");
            location.pathname = "/u/home";
        }
    });
});
del.addEventListener("click", (ev) => {
    const willDelete = confirm("Are you sure?\nAll links you've created will be deleted and the aliases will no longer work.");
    if (!willDelete)
        return;
    //TODO: Send email for verification instead
    // Prompt for password
    const password = prompt("Enter your password to proceed");
    if (!password)
        return alert("You didn't enter a password");
    fetch("/u", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ password })
    }).then(res => res.text()).then(err => {
        if (err)
            alert(err);
        else {
            alert("Account deleted successfully!\nSorry to see you go. 😭😭");
            location.pathname = "/";
        }
    });
});
