let slideIndex = [0]; // Initialisation de slideIndex pour suivre les carousels
let currentCommande = null; // Variable pour stocker la commande actuelle

function plusSlides(n, no) {
    showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
    let slides = document.querySelectorAll(`.carousel-slide[data-index="${no}"] .book-item`);
    if (slides.length === 0) return;

    // Gérer les indices de dépassement
    if (slideIndex[no] >= slides.length) { slideIndex[no] = slides.length - 1; }
    if (slideIndex[no] < 0) { slideIndex[no] = 0; }

    let offset = -slideIndex[no] * (slides[0].offsetWidth + 20);
    document.querySelector(`.carousel-slide[data-index="${no}"]`).style.transform = `translateX(${offset}px)`;

    // Désactiver les boutons si nécessaire
    const leftButton = document.querySelector(`.carousel-button.left[data-index="${no}"]`);
    const rightButton = document.querySelector(`.carousel-button.right[data-index="${no}"]`);
    if (leftButton && rightButton) {
        leftButton.disabled = slideIndex[no] === 0;
        rightButton.disabled = slideIndex[no] === slides.length - 1;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadBooks();
    loadFavoritesAndCartStatus();
    setupAddressForm();
});

function loadFavoritesAndCartStatus() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    favorites.forEach(fav => {
        const favIcon = $(`#livre_${fav.id} .fa-heart`);
        if (favIcon.length > 0) {
            favIcon.addClass("fas").removeClass("far");
        }
    });

    cart.forEach(cartItem => {
        const cartIcon = $(`#livre_${cartItem.id} .fa-shopping-cart`);
        if (cartIcon.length > 0) {
            cartIcon.addClass("fas").removeClass("far");
        }
    });
}

function addLivreToCarousel(livre) {
    let lastCarousel = $(".carousel-slide").last();
    const bookCount = lastCarousel.children(".book-item").length;

    if (bookCount >= 10) {
        createNewCarousel();
        lastCarousel = $(".carousel-slide").last();
    }

    const ctn = $("<div></div>").addClass("book-item").attr("id", "livre_" + livre.ID_LIVRE);
    const img = livre.photo ? $("<img>").attr("src", "../uploads/" + livre.photo) : $("<img>").attr("src", "../asset/default-book.png");
    const title = $("<p></p>").text(livre.NOM_LIVRE);
    const quantity = $("<p></p>").text("Quantité: " + livre.QUANTITE);

    const borrow_btn = $("<button></button>").addClass("availability").text("Emprunter");
    borrow_btn.click(() => {
        handleCommande(livre.ID_LIVRE, "emprunter");
    });

    const buy_btn = $("<button></button>").addClass("availability").text("Acheter");
    buy_btn.click(() => {
        handleCommande(livre.ID_LIVRE, "acheter");
    });

    const cart_icon = $("<i></i>").addClass("far fa-shopping-cart").click(() => {
        toggleCart(livre);
    });

    const fav_icon = $("<i></i>").addClass("far fa-heart").click(() => {
        toggleFavorites(livre);
    });

    const icon_container = $("<div></div>").addClass("icon-container").append(cart_icon, fav_icon);

    ctn.append(img, title, quantity, icon_container, borrow_btn, buy_btn);
    lastCarousel.append(ctn);
    const lastIndex = slideIndex.length - 1;
    showSlides(slideIndex[lastIndex], lastIndex);

    // Vérification de l'état des icônes pour le livre actuel
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (favorites.some(fav => fav.id === livre.ID_LIVRE)) {
        fav_icon.addClass("fas").removeClass("far");
    }

    if (cart.some(cartItem => cartItem.id === livre.ID_LIVRE)) {
        cart_icon.addClass("fas").removeClass("far");
    }
}

function handleCommande(livreId, type) {
    const userId = 1; // Utilisez l'ID utilisateur réel ici
    if (!userId) {
        alert("Veuillez vous connecter pour emprunter ou acheter des livres.");
        return;
    }

    // Vérifiez si le livre est dans le panier
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.some(item => item.id === livreId)) {
        alert("Veuillez ajouter le livre au panier avant de procéder à l'achat ou à l'emprunt.");
        return;
    }

    // Stocker la commande actuelle
    currentCommande = { userId, livreId, type };

    // Afficher le formulaire d'adresse
    $("#overlay").removeClass("hidden");
    $("#address-form-box").removeClass("hidden");
}

function loadBooks() {
    $.ajax({
        url: "../php/livre.php",
        type: "GET",
        dataType: "json",
        data: { choice: "select" },
        success: (res) => {
            if (res.success) {
                res.livres.forEach(livre => {
                    addLivreToCarousel(livre);
                });
                slideIndex.forEach((_, index) => showSlides(slideIndex[index], index));
            } else {
                alert(res.error);
            }
        },
        error: (xhr, status, error) => {
            console.error("Error:", error);
            alert("An error occurred while loading books.");
        }
    });
}

function createNewCarousel() {
    const carouselContainer = $("<div></div>").addClass("carousel-container");
    const carousel = $("<div></div>").addClass("carousel");
    const currentIndex = slideIndex.length;
    const leftButton = $("<button></button>").addClass("carousel-button left").html("&#10094;").attr("data-index", currentIndex).click(() => plusSlides(-1, currentIndex));
    const rightButton = $("<button></button>").addClass("carousel-button right").html("&#10095;").attr("data-index", currentIndex).click(() => plusSlides(1, currentIndex));
    const carouselSlide = $("<div></div>").addClass("carousel-slide").attr("data-index", currentIndex);

    carousel.append(leftButton, carouselSlide, rightButton);
    carouselContainer.append(carousel);
    $("#carousels-container").append(carouselContainer);

    slideIndex.push(0);
}

function toggleCart(livre) {
    const userId = 1; // Utilisez l'ID utilisateur réel ici
    if (!userId) {
        alert("Veuillez vous connecter pour ajouter ou supprimer des articles du panier.");
        return;
    }
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingLivre = cart.find(item => item.id === livre.ID_LIVRE);
    if (existingLivre) {
        // Supprimer du panier
        cart = cart.filter(item => item.id !== livre.ID_LIVRE);
        localStorage.setItem("cart", JSON.stringify(cart));
        $(`#livre_${livre.ID_LIVRE} .fa-shopping-cart`).removeClass("fas").addClass("far");

        // Supprimer de la base de données
        fetch("../php/CartController.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: userId, bookId: livre.ID_LIVRE })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== "success") {
                console.error("Failed to remove from cart:", data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    } else {
        // Ajouter au panier
        cart.push({ id: livre.ID_LIVRE, qty: 1, name: livre.NOM_LIVRE, photo: livre.photo });
        localStorage.setItem("cart", JSON.stringify(cart));
        $(`#livre_${livre.ID_LIVRE} .fa-shopping-cart`).addClass("fas").removeClass("far");

        // Ajouter à la base de données
        fetch("../php/CartController.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: userId, bookId: livre.ID_LIVRE })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== "success") {
                console.error("Failed to add to cart:", data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

function toggleFavorites(livre) {
    const userId = 1; // Utilisez l'ID utilisateur réel ici
    if (!userId) {
        alert("Veuillez vous connecter pour ajouter ou supprimer des articles des favoris.");
        return;
    }
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const existingFavorite = favorites.find(item => item.id === livre.ID_LIVRE);
    if (existingFavorite) {
        // Supprimer des favoris
        favorites = favorites.filter(item => item.id !== livre.ID_LIVRE);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        $(`#livre_${livre.ID_LIVRE} .fa-heart`).removeClass("fas").addClass("far");

        // Supprimer de la base de données
        fetch("../php/FavorisController.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: userId, bookId: livre.ID_LIVRE })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== "success") {
                console.error("Failed to remove from favorites:", data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    } else {
        // Ajouter aux favoris
        favorites.push({ id: livre.ID_LIVRE, name: livre.NOM_LIVRE, photo: livre.photo });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        $(`#livre_${livre.ID_LIVRE} .fa-heart`).addClass("fas").removeClass("far");

        // Ajouter à la base de données
        fetch("../php/FavorisController.php", {
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
}

function setupAddressForm() {
    $("#address-form").submit(event => {
        event.preventDefault();

        const adresse = $("#adresse").val().trim();
        const ville = $("#ville").val().trim();
        const code_postal = $("#code_postal").val().trim();

        if (!adresse || !ville || !code_postal) {
            alert("Tous les champs doivent être remplis !");
            return;
        }

        const userId = 1; // Utilisez l'ID utilisateur réel ici
        const { livreId, type } = currentCommande;

        // Envoyer les informations d'adresse au serveur
        $.ajax({
            url: "../php/AdresseController.php",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({ userId: userId, adresse: adresse, ville: ville, code_postal: code_postal }),
            success: (res) => {
                if (res.status === "success") {
                    // Créer la commande après avoir enregistré l'adresse
                    createCommande(userId, livreId, type);
                } else {
                    alert(`Failed to save address: ${res.message}`);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error:", error);
                alert("An error occurred while saving the address.");
            }
        });

        // Cacher le formulaire d'adresse
        $("#overlay").addClass("hidden");
        $("#address-form-box").addClass("hidden");
    });
}

function createCommande(userId, livreId, type) {
    $.ajax({
        url: "../php/CommandeController.php",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ userId: userId, livreId: livreId, type: type }),
        success: (res) => {
            if (res.status === "success") {
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successfully processed.`);
            } else {
                alert(`Failed to process ${type}.`);
            }
        },
        error: (xhr, status, error) => {
            console.error("Error:", error);
            alert("An error occurred while processing your request.");
        }
    });
}

$("#book-form").submit(event => {
    event.preventDefault();
    const name = $("#name").val().trim();
    const desc = $("#desc").val().trim();
    const picture = $("#picture")[0].files[0];

    if (!name || !desc) {
        alert("Tous les champs doivent être remplis !");
        return;
    }

    if (livre_id) updateLivre(name, desc, picture);
    else insertLivre(name, desc, picture);
});

$("#add-book-btn").click(() => {
    $(".box h1").text("Ajouter un livre");
    document.querySelector("form").reset();
    currentPhoto = null;
    $("#current-photo").attr("src", "").addClass("hidden");
    $("#current-photo-link").val("");
    $(".box").removeClass("hidden");
    $("#overlay").removeClass("hidden");
});

$("#overlay").click(() => {
    $(".box").addClass("hidden");
    $("#overlay").addClass("hidden");
});
