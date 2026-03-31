document.addEventListener("DOMContentLoaded", function() {

    const cards = document.querySelectorAll(".category-card");

    cards.forEach(card => {

        card.addEventListener("click", function() {

            const type = this.dataset.type;
            const wrapper = this.parentElement;
            const subTabsContainer = wrapper.querySelector(".sub-tabs");

            if (type === "near-campus") {
                window.location.href = "pages/nearcampus.html";
                return;
            }

            // Toggle behavior
            if (subTabsContainer.style.maxHeight && subTabsContainer.style.maxHeight !== "0px") {
                collapseAll();
                resetMarkers();
                return;
            }

            collapseAll();
            expandCard(wrapper, subTabsContainer, type);
            filterMarkers(type);

        });

    });

});

function collapseAll() {
    document.querySelectorAll(".sub-tabs").forEach(tab => {
        tab.style.maxHeight = "0";
        tab.innerHTML = "";
    });
}

function expandCard(wrapper, container, type) {

    generateSubTabs(container, type);

    container.style.maxHeight = container.scrollHeight + "px";
}

function generateSubTabs(container, type) {

    // View All
    const viewAll = document.createElement("div");
    viewAll.className = "sub-tab";
    viewAll.innerText = "View All";
    viewAll.onclick = () => {
        window.location.href = `pages/${type}.html`;
    };
    container.appendChild(viewAll);

    // Individual locations
    allMarkers.forEach(marker => {

        if (marker.locationType === type) {

            const tab = document.createElement("div");
            tab.className = "sub-tab";
            tab.innerText = marker.locationData.name;

            tab.onclick = () => {

                // Scroll to map smoothly
                document.getElementById("mapSection").scrollIntoView({
                    behavior: "smooth"
                });

                // Zoom to marker
                map.setView(marker.getLatLng(), 18);

                // Open popup
                showPopup(marker.locationData);
            };

            container.appendChild(tab);
        }

    });
}

function resetMarkers() {
    allMarkers.forEach(marker => {
        marker.addTo(map);
    });
}