const userId = 1; // Utilisez l'ID utilisateur réel ici

function addToCart(livre) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingLivre = cart.find(item => item.id === livre.ID_LIVRE);
    if (existingLivre) {
        existingLivre.qty++;
    } else {
        cart.push({ id: livre.ID_LIVRE, qty: 1, name: livre.NOM_LIVRE, photo: livre.photo });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Livre ajouté au panier.");

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

function loadCartItems() {
    fetch(`../php/CartController.php?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const cart = data.items;
            cart.forEach(el => {
                const div = $("<div></div>").addClass("book-item").attr("id", "tr_" + el.ID_LIVRE);
                const img = $("<img>").attr("src", "../uploads/" + el.photo).attr("alt", el.NOM_LIVRE);
                const title = $("<p></p>").text(el.NOM_LIVRE);
                const quantity = $("<p></p>").attr("id", "qty_" + el.ID_LIVRE).text("Quantité: " + el.QUANTITE);

                const minusIcon = $("<i class='fa fa-minus' aria-hidden='true'></i>").click(() => {
                    el.QUANTITE--;
                    if (el.QUANTITE <= 0) {
                        fetch("../php/CartController.php", {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ userId: userId, bookId: el.ID_LIVRE })
                        })
                        .then(() => {
                            $("#tr_" + el.ID_LIVRE).remove();
                        });
                    } else {
                        localStorage.setItem("cart", JSON.stringify(cart));
                        $("#qty_" + el.ID_LIVRE).text("Quantité: " + el.QUANTITE);
                    }
                });

                const plusIcon = $("<i class='fa fa-plus' aria-hidden='true'></i>").click(() => {
                    el.QUANTITE++;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    $("#qty_" + el.ID_LIVRE).text("Quantité: " + el.QUANTITE);
                });

                const deleteIcon = $("<i class='fa fa-trash' aria-hidden='true'></i>").click(() => {
                    fetch("../php/CartController.php", {
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

                div.append(img, title, quantity, minusIcon, plusIcon, deleteIcon);
                $("#cart-items").append(div);
            });
        } else {
            console.error("Failed to load cart items:", data.message);
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

document.addEventListener("DOMContentLoaded", loadCartItems);
