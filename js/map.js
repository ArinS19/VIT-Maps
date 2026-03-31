// ================= MAP INIT =================

let allMarkers = [];
const map = L.map('map-container').setView([12.8406, 80.1532], 16);

// Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// DOM refs
const popup = document.getElementById("map-popup");
const closeBtn = document.getElementById("closePopupBtn");


// ================= MARKER ICON =================

function getMarkerIcon(type) {
    let iconUrl;

    switch(type) {
        case "food": iconUrl = "assets/icons/marker-icon-red.png"; break;
        case "academic": iconUrl = "assets/icons/marker-icon-blue.png"; break;
        case "hostel": iconUrl = "assets/icons/marker-icon-green.png"; break;
        case "sports": iconUrl = "assets/icons/marker-icon-orange.png"; break;
        case "other": iconUrl = "assets/icons/marker-icon-yellow.png"; break;
        default: iconUrl = "assets/icons/marker-icon-blue.png";
    }

    return L.icon({
        iconUrl,
        shadowUrl: "assets/icons/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}


// ================= LOAD LOCATIONS =================

fetch("http://localhost:5000/api/locations")
    .then(res => res.json())
    .then(data => {

        data.forEach(location => {

            const marker = L.marker(location.coordinates, {
                icon: getMarkerIcon(location.type)
            }).addTo(map);

            marker.bindTooltip(location.name, {
                direction: "top",
                offset: [0, -15],
                className: "custom-tooltip"
            });

            marker.locationData = location;

            marker.on("click", () => showPopup(location));

            allMarkers.push(marker);
        });

        // HANDLE REDIRECT
        const params = new URLSearchParams(window.location.search);
        const locationName = params.get("location");

        if (locationName) {
            const target = allMarkers.find(m => m.locationData.name === locationName);

            if (target) {
                map.setView(target.getLatLng(), 20);
                showPopup(target.locationData);

                document.getElementById("mapSection")?.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }

    })
    .catch(err => console.error("Fetch error:", err));


// ================= POPUP =================

function showPopup(data) {

    document.getElementById("popup-name").innerText = data.name;
    document.getElementById("popup-type").innerText = "Type: " + data.type;
    document.getElementById("popup-rating").innerText = "Rating: Loading...";
    document.getElementById("popup-desc").innerText = data.description;

    // MENU
    const menuDiv = document.getElementById("popup-menu");
    menuDiv.innerHTML = "";

    if (data.menu?.length > 0) {
        let list = "<strong>Menu:</strong><ul>";
        data.menu.forEach(item => list += `<li>${item}</li>`);
        list += "</ul>";
        menuDiv.innerHTML = list;
    }

    document.getElementById("popup-image").src = data.image;

    popup.classList.add("active");


    // ================= REVIEWS + RATING =================

    fetch(`http://localhost:5000/api/reviews/${data._id}`)
        .then(res => res.json())
        .then(reviews => {

            const reviewsDiv = document.getElementById("reviews-section");
            reviewsDiv.innerHTML = "<h4>Reviews</h4>";

            if (reviews.length === 0) {
                reviewsDiv.innerHTML += "<p>No reviews yet</p>";
                document.getElementById("popup-rating").innerText = "Rating: N/A";
            } else {

                let total = 0;

                reviews.forEach(r => {
                    total += r.rating;

                    reviewsDiv.innerHTML += `
                        <p>
                            <strong>${r.userId?.name || "Anonymous"}</strong>:
                            ${r.comment} (${r.rating}⭐)
                        </p>
                    `;
                });

                const avg = (total / reviews.length).toFixed(1);

                document.getElementById("popup-rating").innerText =
                    `⭐ ${avg} (${reviews.length} reviews)`;
            }

        })
        .catch(err => {
            console.error(err);
            document.getElementById("popup-rating").innerText = "Rating: Error";
        });


    // ================= SAVE =================

    const saveBtn = document.getElementById("saveBtn");
    saveBtn.onclick = () => {

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        const exists = favorites.find(loc => loc._id === data._id);

        if (exists) {
            alert("Already saved!");
            return;
        }

        favorites.push(data);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        alert("Saved!");
    };


    // ================= SHARE =================

    const shareBtn = document.getElementById("shareBtn");
    shareBtn.onclick = () => {

        const url = `${window.location.origin}/index.html?location=${encodeURIComponent(data.name)}`;

        navigator.clipboard.writeText(url)
            .then(() => alert("Link copied!"))
            .catch(() => alert("Copy failed"));
    };


    // ================= ADD REVIEW =================

    const submitBtn = document.getElementById("submitReview");
    submitBtn.onclick = null;

    submitBtn.onclick = () => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please login first");
            return;
        }

        const rating = Number(document.getElementById("review-rating").value);
        const comment = document.getElementById("review-comment").value;

        if (!rating || rating < 1 || rating > 5 || !comment) {
            alert("Enter valid rating and comment");
            return;
        }

        fetch("http://localhost:5000/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                locationId: data._id,
                rating,
                comment
            })
        })
        .then(res => res.json())
        .then(() => {
            alert("Review added!");
            showPopup(data); // refresh
        });
    };
}


// ================= CLOSE POPUP =================

closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
});

popup.addEventListener("mouseenter", () => map.scrollWheelZoom.disable());
popup.addEventListener("mouseleave", () => map.scrollWheelZoom.enable());


// ================= FILTER =================

window.filterMarkers = function(type) {
    allMarkers.forEach(marker => {
        if (marker.locationData.type === type) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
};