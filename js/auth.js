function getUserInfo() {
    const loginData = JSON.parse(localStorage.getItem("loginData")) || {};
    const userInfo = {
        username: loginData.username || null,
        email: loginData.email || null,
        accessToken: loginData.accessToken || localStorage.getItem("accessToken"),
        apiKey: localStorage.getItem("apiKey"),
    };

    console.log("Retrieved User Info:", userInfo);
    return userInfo;
}

function isLoggedIn() {
    return !!localStorage.getItem("loginData") && !!localStorage.getItem("accessToken") && !!localStorage.getItem("apiKey");
}

function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = "/account/login.html";
    }
}

function logoutUser() {
    localStorage.removeItem("loginData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("apiKey");
    window.location.href = "/account/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const { username, email, accessToken } = getUserInfo();
    const usernameDisplay = document.getElementById("username-display");
    const authRequiredElements = document.querySelectorAll(".auth-required");

    if (username && accessToken) { 
        authRequiredElements.forEach((el) => el.style.display="block");

        if (usernameDisplay) {
            usernameDisplay.innerText = `Logged in as: ${username} (${email})`;
        }
    } else {
        authRequiredElements.forEach((el) => el.style.display="none");
    }
});
