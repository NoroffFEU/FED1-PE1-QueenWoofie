document.addEventListener("DOMContentLoaded", async () => {
    const { username, accessToken, apiKey } = getUserInfo();
    const profileMenu = document.getElementById("profile-menu");
    const profileButton = document.getElementById("profile-button");

    if (!profileMenu || !profileButton) {
        return;
    }

    const repoName = "/FED1-PE1-QueenWoofie";
    const basePath = `${window.location.origin}${repoName}`;

    const pathPrefix = window.location.pathname === `${repoName}/index.html` || window.location.pathname === `${repoName}/`
    ? `${basePath}/account/`
    : `${basePath}/account/`; 

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
            <a class="large text" href="${pathPrefix}login.html">Login</a>
            <a class="large text" href="${pathPrefix}register.html">Register</a>
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