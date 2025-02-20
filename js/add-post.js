document.addEventListener("DOMContentLoaded", () => {
    requireLogin();
});

document.getElementById("add-post-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await createNewPost();
});

async function createNewPost() {
    const { username, accessToken, apiKey } = getUserInfo();

    if (!accessToken || !apiKey) {
        document.getElementById("add-message").innerText = "You must be logged in to create a post.";
        return;
    }

    console.log("✅ Access Token & API Key Found.");

    const url = `https://v2.api.noroff.dev/blog/posts/${username}`;

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body-editor").value.trim();
    const imageUrl = document.getElementById("img").value.trim();

    if (!title || !body) {
        document.getElementById("add-message").innerText = "Title and body are required.";
        return;
    }

    const media = imageUrl ? { url: imageUrl, alt: "User-uploaded image" } : null;

    const postData = {
        title,
        body,
        media
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "X-Noroff-API-Key": apiKey
            },
            body: JSON.stringify(postData)
        });

        const json = await response.json();
        console.log("✅ Server Response:", json);

        if (response.ok) {
            document.getElementById("add-message").innerText = "Post created successfully!";
            setTimeout(() => {
                window.location.href = `/post/index.html?id=${json.data.id}`;
            }, 1500);
        } else {
            document.getElementById("add-message").innerText = json.message || "Failed to add post.";
        }
    } catch (error) {
        console.error("❌ Error creating post:", error);
        document.getElementById("add-message").innerText = "An error occurred. Please try again.";
    }
}