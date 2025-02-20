document.addEventListener("DOMContentLoaded", async () => {
    requireLogin();

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    console.log("Post ID:", postId);
    
    if (!postId) {
        document.getElementById("edit-message").innerText = "Post not found.";
        return;
    }

    await loadPostForEditing(postId);
});

async function loadPostForEditing(postId) {
    const url = `https://v2.api.noroff.dev/blog/posts/QueenWoofie/${postId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch post.");

        const data = await response.json();
        const post = data.data;

        console.log("Loaded Post Data:", post);

        document.getElementById("title").value = post.title;
        document.getElementById("body-editor").value = post.body;

        if (post.media && post.media.url) {
            document.getElementById("img").value = post.media.url;
        } else {
            document.getElementById("img").value = "";
        }

    } catch (error) {
        console.error("Error loading post:", error);
        document.getElementById("edit-message").innerText = "⚠️ Failed to load post.";
    }
}

document.getElementById("edit-post-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await updatePost();
});

async function updatePost() {
    const { username, accessToken, apiKey } = getUserInfo();
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    const url = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;
    
    const updatedData = {
        title: document.getElementById("title").value.trim(),
        body: document.getElementById("body").value.trim(),
        media: {
            url: document.getElementById("image").value.trim(),
            alt: "User updated image"
        }
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "X-Noroff-API-Key": apiKey
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error("Failed to update post.");

        document.getElementById("edit-message").innerText = "Post updated successfully!";
        
        setTimeout(() => {
            window.location.href = `/post/index.html?id=${postId}`;
        }, 1500);

    } catch (error) {
        console.error("Error updating post:", error);
        document.getElementById("edit-message").innerText = "⚠️ Failed to update post.";
    }
}

document.getElementById("delete-post-button").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    await deletePost();
});

async function deletePost() {
    const { username, accessToken, apiKey } = getUserInfo();
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    const url = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "X-Noroff-API-Key": apiKey
            }
        });

        if (!response.ok) throw new Error("Failed to delete post.");

        alert("Post deleted successfully!");
        window.location.href = "/index.html";

    } catch (error) {
        console.error("Error deleting post:", error);
        alert("⚠️ Failed to delete post.");
    }
}