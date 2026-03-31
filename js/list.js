const pageName = window.location.pathname.split("/").pop().replace(".html", "");

let allLocations = [];

const listContainer = document.getElementById("list-content");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const backBtn = document.getElementById("backToMap");

// 🔙 Back button
backBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
});

// 🔥 Fetch locations
fetch("http://localhost:5000/api/locations")
    .then(response => response.json())
    .then(data => {
        allLocations = data.filter(location => location.type === pageName);
        renderList(allLocations);
    });

// 🔥 MAIN RENDER FUNCTION (ASYNC FOR REVIEWS)
async function renderList(locations) {
    listContainer.innerHTML = "";

    for (const location of locations) {

        let reviews = [];

        try {
            const res = await fetch(`http://localhost:5000/api/reviews/${location._id}`);
            reviews = await res.json();
        } catch (err) {
            console.error("Review fetch error:", err);
        }

        const item = document.createElement("div");
        item.className = "list-item";

        item.innerHTML = `
            <div class="list-info">
                <h3>${location.name}</h3>
                <div class="rating-stars">
                    ${reviews.length > 0 
                        ? generateStars(getAverageRating(reviews)) 
                        : "No rating"}
                </div>
                <p>${location.description}</p>

                <div class="list-reviews">
                    ${generateReviewHTML(reviews)}
                </div>
            </div>

            <div class="list-image">
                <img src="../${location.image}" alt="${location.name}">
            </div>
        `;

        item.style.cursor = "pointer";

        item.addEventListener("click", function() {
            window.location.href = `../index.html?location=${encodeURIComponent(location.name)}`;
        });

        listContainer.appendChild(item);
    }
}
function getAverageRating(reviews) {
    let total = 0;

    reviews.forEach(r => {
        total += r.rating;
    });

    return (total / reviews.length).toFixed(1);
}
// 🔥 GENERATE REVIEWS HTML
function generateReviewHTML(reviews) {

    if (!reviews || reviews.length === 0) {
        return `<p class="no-reviews">No reviews yet</p>`;
    }

    let html = `<h4>Reviews:</h4>`;

    reviews.slice(0, 2).forEach(r => {
        html += `
            <p class="review-item">
                <strong>${r.userId?.name || "Anonymous"}</strong>: 
                ${r.comment} (${r.rating}⭐)
            </p>
        `;
    });

    if (reviews.length > 2) {
        html += `<p class="more-reviews">+ ${reviews.length - 2} more...</p>`;
    }

    return html;
}

// ⭐ GENERATE STARS
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;

    let stars = "";

    for (let i = 0; i < fullStars; i++) {
        stars += "★";
    }

    if (halfStar) stars += "½";

    return stars + ` (${rating})`;
}

// 🔍 SEARCH
searchInput.addEventListener("input", function () {

    const query = this.value.toLowerCase();

    const filtered = allLocations.filter(location =>
        location.name.toLowerCase().includes(query)
    );

    renderList(filtered);
});

// 🔽 SORT
sortSelect.addEventListener("change", function () {

    let sorted = [...allLocations];

    if (this.value === "rating-high") {
        sorted.sort((a, b) => b.rating - a.rating);
    } else if (this.value === "rating-low") {
        sorted.sort((a, b) => a.rating - b.rating);
    }

    renderList(sorted);
});