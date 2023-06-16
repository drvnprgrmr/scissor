const update = document.getElementById("update")
const del = document.getElementById("delete")


update.addEventListener("submit", (ev) => {
    ev.preventDefault()

    // Get form data
    const formData = new FormData(update)

    // Prompt for password
    const password = prompt("Enter your password to proceed")

    if (!password) return alert("You didn't enter a password")
    
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
    }).then(
        res => res.text()
    ).then(err => {
        if (err) alert(err)
        else {
            alert("Account updated successfully!")
            location.pathname = "/u/home"
        }
    })

})