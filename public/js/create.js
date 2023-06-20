const urlField = document.getElementById("field-url");
const aliasField = document.getElementById("field-alias");

const form = document.getElementById("form");

form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    // Url validation
    if (!validator.isURL(urlField.value)) {
        alert("Invalid URL");
        return urlField.focus();
    } else if (
        !validator.isURL(urlField.value, {
            require_protocol: true,
            require_valid_protocol: true,
        })
    ) {
        // Include http protocol if user forgot to include it (to avoid unexpected behaviors)
        urlField.value = "http://" + urlField.value;
        console.log(urlField.value);
    }

    // Alias validation
    if (aliasField.value && !validator.isAlphanumeric(aliasField.value)) {
        alert("Alias must only contain alphanumeric characters");
        return aliasField.focus();
    }

    form.submit();
});
