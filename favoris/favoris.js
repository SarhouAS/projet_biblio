const userId = 1; // Utilisez l'ID utilisateur réel ici

function addToFavorites(livre) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(item => item.id === livre.ID_LIVRE)) {
        favorites.push({ id: livre.ID_LIVRE, name: livre.NOM_LIVRE, photo: livre.photo });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Livre ajouté aux favoris.");
    } else {
        alert("Livre déjà dans les favoris.");
    }

    // Ajouter à la base de données
    fetch("../php/FavoritesController.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId, bookId: livre.ID_LIVRE })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status !== "success") {
            console.error("Failed to add to favorites:", data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}

function loadFavoriteItems() {
    fetch(`../php/FavorisController.php?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const favorites = data.items;
            favorites.forEach(el => {
                const div = $("<div></div>").addClass("book-item").attr("id", "tr_" + el.ID_LIVRE);
                const img = $("<img>").attr("src", "../uploads/" + el.photo).attr("alt", el.NOM_LIVRE);
                const title = $("<p></p>").text(el.NOM_LIVRE);

                const deleteIcon = $("<i class='fa fa-trash' aria-hidden='true'></i>").click(() => {
                    fetch("../php/FavorisController.php", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ userId: userId, bookId: el.ID_LIVRE })
                    })
                    .then(() => {
                        $("#tr_" + el.ID_LIVRE).remove();
                    });
                });

                div.append(img, title, deleteIcon);
                $("#favorites-items").append(div);
            });
        } else {
            console.error("Failed to load favorite items:", data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}

function plusSlides(n, no) {
    const slides = document.querySelectorAll(`.carousel-slide[data-index="${no}"] .book-item`);
    const container = document.querySelector(`.carousel-slide[data-index="${no}"]`);
    const currentTransform = container.style.transform || "translateX(0px)";
    const currentTranslateX = parseInt(currentTransform.replace("translateX(", "").replace("px)", ""));
    const offset = n * (slides[0].offsetWidth + 20); // Adjust offset as needed
    const newTranslateX = currentTranslateX - offset;

    container.style.transform = `translateX(${newTranslateX}px)`;
}

document.addEventListener("DOMContentLoaded", loadFavoriteItems);
