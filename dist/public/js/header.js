const profile = document.getElementById("profile");
const profileNav = document.getElementById("profile-nav");
const body = document.getElementsByTagName("body")[0];
profile.addEventListener("click", (ev) => {
    // Don't let it get to the body click event listener
    ev.stopPropagation();
    const navStyle = getComputedStyle(profileNav);
    console.log(navStyle.display);
    // Toggle display of profile nav
    if (navStyle.display === "none")
        profileNav.style.display = "flex";
    else if (navStyle.display === "flex")
        profileNav.style.display = "none";
});
body.addEventListener("click", (ev) => {
    // Hide profile nav if it's shown
    if (profileNav.style.display === "flex")
        profileNav.style.display = "none";
});
