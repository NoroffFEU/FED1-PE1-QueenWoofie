const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginButton = document.querySelector("#login-button");

loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await loginUser();
});

async function loginUser() {
    const loginUrl = "https://v2.api.noroff.dev/auth/login";
    const apiKeyUrl = "https://v2.api.noroff.dev/auth/create-api-key";

    const userData = {
        email: email.value,
        password: password.value
    };

    try {
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(userData)
        });

        const json = await response.json();

        if (!response.ok) {
            console.error("Login failed:", json.message || "Unknown error");
            document.getElementById("login-message").innerText = json.message || "Login failed.";
            return;
        }

        if (!json.data || !json.data.accessToken) {
            throw new Error("Missing access token in API response.");
        }

        const accessToken = json.data.accessToken;
        const username = json.data.name;
        const email = json.data.email;

        const loginData = { username, email, accessToken };
        localStorage.setItem("loginData", JSON.stringify(loginData));
        localStorage.setItem("accessToken", accessToken);

        let apiKey = localStorage.getItem("apiKey");

        if (!apiKey) {
            console.log("No API key found. Creating a new one...");

            const apiKeyResponse = await fetch(apiKeyUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({ name: username })
            });

            const apiKeyData = await apiKeyResponse.json();

            if (!apiKeyResponse.ok || !apiKeyData.data || !apiKeyData.data.key) {
                throw new Error("Failed to create API key.");
            }

            apiKey = apiKeyData.data.key;
            localStorage.setItem("apiKey", apiKey);
        }

        document.getElementById("login-message").innerText = "Login successful!";
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1000);

    } catch (error) {
        console.error("Login Error:", error);
        document.getElementById("login-message").innerText = error.message || "An error occurred. Please try again.";
    }
}