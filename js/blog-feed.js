document.addEventListener("DOMContentLoaded", async () => {
    await loadBlogPosts();
});

let allPosts = [];

async function loadBlogPosts() {
    const url = "https://v2.api.noroff.dev/blog/posts/QueenWoofie";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch blog posts.`);
        }

        const data = await response.json();
        const posts = data.data;

        console.log("Fetched Posts:", allPosts);

        displayCarousel(posts.slice(0, 3));
        displayPostGrid(posts.slice(0, 12));

    } catch (error) {
        console.error("Error loading blog posts", error);
        document.getElementById("post-grid").innerHTML = "<p>⚠️ Failed to load blog posts. Please try again later.</p>";
    }
}

function displayCarousel(posts) {
    const carouselContainer = document.querySelector("#carousel");
    if (!carouselContainer) return;


    carouselContainer.innerHTML = `
        <div class="carousel-wrapper">
            <button id="prev-btn" class="carousel-nav left">❮</button>
            <div class="carousel-items"></div>
            <button id="next-btn" class="carousel-nav right">❯</button>
            <div class="carousel-indicators"></div>
        </div>
    `;

    const carouselItems = document.querySelector(".carousel-items");
    const indicators = document.querySelector(".carousel-indicators");

    posts.forEach((post, index) => {
        const imageUrl = post.media?.url || "/assets/img/placeholder-large.png";
        const postSnippet = post.body.length > 150 ? post.body.substring(0, 150) + "..." : post.body;

        const postElement = document.createElement("div");
        postElement.classList.add("carousel-item");
        if (index === 0) postElement.classList.add("active");

        postElement.innerHTML = `
            <div class="carousel-banner" style="background-image: url('${imageUrl}')">
                <div class="carousel-overlay">
                    <h1>${post.title}</h1>
                    <p class="text small">${postSnippet}</p>
                    <button class="text small" onclick="window.location.href='/post/index.html?id=${post.id}'">Read More</button>
                </div>
            </div>
        `;

        carouselItems.appendChild(postElement);

        // ✅ Add dot indicators
        const dot = document.createElement("span");
        dot.classList.add("indicator");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => moveCarouselTo(index));
        indicators.appendChild(dot);
    });

    setupCarousel(posts.length);
}

// ✅ Function to handle carousel navigation
let currentSlide = 0;

function setupCarousel(totalSlides) {
    document.getElementById("prev-btn").addEventListener("click", () => moveCarouselTo(currentSlide - 1));
    document.getElementById("next-btn").addEventListener("click", () => moveCarouselTo(currentSlide + 1));
}

function moveCarouselTo(index) {
    const slides = document.querySelectorAll(".carousel-item");
    const dots = document.querySelectorAll(".indicator");

    if (index < 0) {
        currentSlide = slides.length - 1; // Loop back to the last slide
    } else if (index >= slides.length) {
        currentSlide = 0; // Loop to the first slide
    } else {
        currentSlide = index;
    }

    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentSlide);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

// ✅ Function to display a grid of blog posts
function displayPostGrid(posts) {
    const postGrid = document.querySelector("#post-grid");
    if (!postGrid) return;

    postGrid.innerHTML = ""; // Clear old content

    posts.forEach(post => {
        if (!post.id) return;

        const imageUrl = post.media?.url || "/assets/img/placeholder-small.png";

        const postElement = document.createElement("div");
        postElement.classList.add("post-thumbnail");

        postElement.innerHTML = `
            <div class="post-banner" style="background-image: url('${imageUrl}')">
                <div class="post-overlay">
                    <h2>${post.title}</h2>
                </div>
            </div>
            <button class="text smallh" onclick="window.location.href='/post/index.html?id=${post.id}'">Read More</button>
        `;

        postGrid.appendChild(postElement);
    });
}