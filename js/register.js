const userName = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const passwordRepeat = document.querySelector("#password-repeat");
const submitButton = document.querySelector("#register-button");
const registerMessage = document.getElementById("register-message");

submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await registerUser();
});

async function registerUser() {
    const registerUrl = "https://v2.api.noroff.dev/auth/register";
    const apiKeyUrl = "https://v2.api.noroff.dev/auth/create-api-key";

    if (!email.value.endsWith("@stud.noroff.no")) {
        document.getElementById("register-message").innerText = "Email invalid - You must use a stud.noroff.no email.";
        return;
    }

    if (password.value.length < 8) {
        document.getElementById("register-message").innerText = "Password must be at least 8 characters long.";
        return;
    }

    if (password.value !== passwordRepeat.value) {
        document.getElementById("register-message").innerText = "Passwords do not match.";
        return;
    }

    const userData = {
        name: userName.value,
        email: email.value,
        password: password.value
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    };

    console.log("Sending data:", userData);

    try {
        const response = await fetch(registerUrl, options);
        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Registration failed.");
        }
        registerMessage.innerText = "Registration successful!";

        const username = json.data.name;
        const userEmail = json.data.email;
        const accessToken = json.data.accessToken;

        const loginData = {
            username,
            email: userEmail,
            accessToken
        };

        localStorage.setItem("loginData", JSON.stringify(loginData));
        localStorage.setItem("accessToken", accessToken);

        console.log("User registered and stored in localStorage:", loginData);

        let apiKey = localStorage.getItem("apiKey");

        if (!apiKey) {
            console.log("No API key found, creating a new one...");

            const apiKeyResponse = await fetch(apiKeyUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ name: username })
            });

            if (!apiKeyResponse.ok) {
                throw new Error("API Key creation failed: " + (await apiKeyResponse.text()));
            }

            const apiKeyData = await apiKeyResponse.json();
            apiKey = apiKeyData.data.key;

            localStorage.setItem("apiKey", apiKey);
            console.log("API Key created and stored:", apiKey);
        }
        setTimeout(() => {
            window.location.href = "/account/login.html";
        }, 2000);

    } catch (error) {
        console.error("Registration error:", error);
        registerMessage.innerText = error.message || "An error occurred. Please try again.";
    }
}