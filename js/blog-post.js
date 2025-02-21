document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (postId) {
        await loadBlogPost(postId);
    } else {
        document.getElementById("post-container").innerHTML = "<p>Post not found.</p>";
    }
});

async function loadBlogPost(postId) {
    const url = `https://v2.api.noroff.dev/blog/posts/QueenWoofie/${postId}`;

    try {
        const response = await fetch(url, { cache: "reload" });
        if (!response.ok) {
            throw new Error("Failed to fetch the blog post.");
        }

        const data = await response.json();
        const post = data.data;

        displayPost(post);

    } catch (error) {
        console.error("Error loading blog post:", error);
        document.getElementById("post-container").innerHTML = "<p>⚠️ Failed to load blog post.</p>";
    }
}

function displayPost(post) {
    const postContainer = document.getElementById("post-container");
    if (!postContainer) return;

    const imageUrl = (post.media && post.media.url) ? post.media.url : "../assets/img/placeholder-large.png";

    const authorName = post.author?.name || "Unknown Author";
    
    const publishedDate = new Date(post.created).toLocaleDateString("en-GB", {
        year: "numeric", month: "long", day: "numeric"
    });
    const updatedDate = post.updated 
        ? new Date(post.updated).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
        : "Not Updated";

    postContainer.innerHTML = `
        <div class="post-banner" style="background-image: url('${imageUrl}')">
            <div class="post-overlay" style="border: var(--border-basic)">
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <p class="text small">By: <strong>${authorName}</strong></p>
                    <p class="text small">Published: ${publishedDate}</p>
                    <p class="text small">Last Edited: ${updatedDate}</p>
                </div>
                <button id="share-button" class="text small bold icon link">Share</button>
                <p id="copy-message" class="hidden text small">✅ Link copied!</p>
            </div>
        </div>
        <article class="post-content">
            <p>${post.body}</p>
        </article>
    `;

    const editButtonContainer = document.createElement("div");
    editButtonContainer.classList.add("edit-button-container");
    
    const { username } = getUserInfo();
    if (username === post.author?.name) {
        const editButton = document.createElement("button");
        editButton.innerText = "Edit Post";
        editButton.classList.add("edit-button", "text", "bold", "small", "icon", "pen");
        editButton.onclick = () => {
            window.location.href = `../post/edit.html?id=${post.id}`;
        };
        
        editButtonContainer.appendChild(editButton);
        postContainer.appendChild(editButtonContainer);
    }

    document.getElementById("share-button").addEventListener("click", () => copyPostLink(post.id));
}

function copyPostLink(postId) {
    const postUrl = `${window.location.origin}${window.location.pathname.split("/").slice(0, -2).join("/")}/post/index.html?id=${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
        const message = document.getElementById("copy-message");
        message.classList.remove("hidden");

        setTimeout(() => {
            message.classList.add("hidden");
        }, 2000);
    }).catch(error => {
        console.error("Failed to copy link:", error);
    });
}