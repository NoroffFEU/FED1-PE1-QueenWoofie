document.addEventListener("DOMContentLoaded", async () => {
    const { username, accessToken, apiKey } = getUserInfo();
    const profileMenu = document.getElementById("profile-menu");
    const profileButton = document.getElementById("profile-button");

    if (!profileMenu || !profileButton) {
        return;
    }

    profileMenu.innerHTML = "";

    if (username && accessToken) {
        const userInfo = document.createElement("p");
        userInfo.innerText = `Logged in as: ${username}`;
        userInfo.classList.add("large", "text", "username-display");
        profileMenu.appendChild(userInfo);

        const logoutButton = document.createElement("button");
        logoutButton.innerText = "Logout";
        logoutButton.classList.add("large", "text", "bold");
        logoutButton.addEventListener("click", logoutUser);
        profileMenu.appendChild(logoutButton);
    } else {
        profileMenu.innerHTML = `
            <a class="large text" href="../account/login.html">Login</a>
            <a class="large text" href="../account/register.html">Register</a>
        `;
    }

    profileButton.addEventListener("click", () => {
        profileMenu.classList.toggle("show-menu");
        profileButton.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.classList.remove("show-menu");
            profileButton.classList.remove("active");
        }
    });
});