// ================= USER =================

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    alert("Please login first");
    window.location.href = "../login.html";
}
// SHOW USER INFO
document.getElementById("userName").innerText = "Name: " + user.name;
document.getElementById("userEmail").innerText = "Email: " + user.email;
// ================= FAVORITES =================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const favDiv = document.getElementById("favoritesList");

if (favorites.length === 0) {
    favDiv.innerHTML = "<p>No saved locations</p>";
} else {
    favorites.forEach((loc, index) => {
        favDiv.innerHTML += `
            <div class="location-item">
                <strong>${loc.name}</strong><br>
                <button onclick="openLocation('${loc.name}')">View</button>
                <button onclick="removeFav(${index})">Remove</button>
            </div>
        `;
    });
}
// REMOVE FAVORITE
window.removeFav = function(index) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    location.reload();
};


// ================= REVIEWS =================

fetch(`http://localhost:5000/api/reviews`)
    .then(res => res.json())
    .then(data => {

        const myReviewsDiv = document.getElementById("myReviews");

        // FILTER ONLY THIS USER'S REVIEWS
        const myReviews = data.filter(r => r.userId && r.userId._id === user.id);

        if (myReviews.length === 0) {
            myReviewsDiv.innerHTML = "<p>No reviews yet</p>";
            return;
        }

        myReviews.forEach(r => {
            myReviewsDiv.innerHTML += `
                <div class="location-item">
                    <strong>${r.locationId.name}</strong><br>
                    ${r.comment} (${r.rating}⭐)<br>
                    <button onclick="openLocation('${r.locationId.name}')">Go</button>
                    <button onclick="deleteReview('${r._id}')">Delete</button>
                </div>
            `;
        });

    })
    .catch(err => {
        console.error(err);
        document.getElementById("myReviews").innerHTML = "<p>Error loading reviews</p>";
    });


// DELETE REVIEW
window.deleteReview = function(id) {
    fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Review deleted");
        location.reload();
    })
    .catch(err => console.error(err));
};


// ================= OPEN LOCATION =================

window.openLocation = function(name) {
    window.location.href = `../home.html?location=${encodeURIComponent(name)}`;
};


// ================= LOGOUT =================

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("user");
    alert("Logged out!");
    window.location.href = "../index.html";
};