const linkList = document.getElementById("link-list")

linkList.addEventListener("click", (ev) => {
    const [s, i] = ev.target.id.split("-")
    if (s === "copy") {
        const alias = document.getElementById("alias-" + i).textContent
        const toCopy = `${location.origin}/${alias.trim()}`
        navigator.clipboard.writeText(toCopy)
        alert("Link Copied to clipboard")
    }

    console.log(ev.target)
})
