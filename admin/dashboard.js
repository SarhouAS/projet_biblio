let slideIndex = [0]; // Initialisation de slideIndex pour suivre les carousels

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
});

let livre_id = null;
let currentPhoto = null;

function checkIfEmpty() {
    const carousels = $(".carousel-slide");
    carousels.each(function() {
        if ($(this).children(".book-item").length === 0) {
            const none_article = $("<h2></h2>").text("Aucun livre");
            $(this).html(none_article);
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

    const modify_btn = $("<button></button>").addClass("availability").text("Modifier");
    modify_btn.click(() => {
        $(".box h1").text("Modifier un livre");
        livre_id = livre.ID_LIVRE;
        currentPhoto = livre.photo;
        $("#name").val(livre.NOM_LIVRE);
        $("#desc").val(livre.QUANTITE);
        if (currentPhoto) {
            $("#current-photo").attr("src", "../uploads/" + currentPhoto).removeClass("hidden");
            $("#current-photo-link").val(currentPhoto);
        }
        $(".box").removeClass("hidden");
        $("#overlay").removeClass("hidden");
    });

    const delete_btn = $("<button></button>").addClass("availability").text("Supprimer");
    delete_btn.click(() => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) deleteLivre(livre.ID_LIVRE);
    });

    ctn.append(img, title, quantity, modify_btn, delete_btn);
    lastCarousel.append(ctn);
    const lastIndex = slideIndex.length - 1;
    showSlides(slideIndex[lastIndex], lastIndex);
}

function deleteLivre(id) {
    $.ajax({
        url: "../php/livre.php",
        type: "POST",
        dataType: "json",
        data: { choice: "delete", ID_LIVRE: id },
        success: (res) => {
            if (res.success) {
                const bookItem = $(`#livre_${id}`);
                const carouselIndex = parseInt(bookItem.closest('.carousel-slide').attr('data-index'));
                bookItem.remove();
                showSlides(slideIndex[carouselIndex], carouselIndex);
                checkIfEmpty();
            } else {
                alert(res.error);
            }
        }
    });
}

function insertLivre(name, desc, picture) {
    const fd = new FormData();
    fd.append("choice", "insert");
    fd.append("NOM_LIVRE", name);
    fd.append("QUANTITE", desc);
    fd.append("photo", picture);

    $.ajax({
        url: "../php/livre.php",
        type: "POST",
        dataType: "json",
        contentType: false,
        processData: false,
        cache: false,
        data: fd,
        success: (res) => {
            if (res.success) {
                addLivreToCarousel({
                    ID_LIVRE: res.ID_LIVRE,
                    NOM_LIVRE: name,
                    QUANTITE: desc,
                    photo: res.photo
                });
                $(".box").addClass("hidden");
                $("#overlay").addClass("hidden");
            } else {
                alert(res.error);
            }
        }
    });
}

function updateLivre(name, desc, picture) {
    const fd = new FormData();
    fd.append("choice", "update");
    fd.append("NOM_LIVRE", name);
    fd.append("QUANTITE", desc);
    if (picture) {
        fd.append("photo", picture);
    } else {
        fd.append("currentPhoto", currentPhoto);
    }
    fd.append("ID_LIVRE", livre_id);

    $.ajax({
        url: "../php/livre.php",
        type: "POST",
        dataType: "json",
        contentType: false,
        processData: false,
        cache: false,
        data: fd,
        success: (res) => {
            if (res.success) {
                const bookItem = $(`#livre_${livre_id}`);
                bookItem.find("p:eq(0)").text(name);
                bookItem.find("p:eq(1)").text("Quantité: " + desc);
                if (res.photo) {
                    bookItem.find("img").attr("src", "../uploads/" + res.photo);
                }
                livre_id = null;
                currentPhoto = null;
                $(".box").addClass("hidden");
                $("#overlay").addClass("hidden");
            } else {
                alert(res.error);
            }
        }
    });
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
                checkIfEmpty();
                slideIndex.forEach((_, index) => showSlides(slideIndex[index], index));
            } else {
                alert(res.error);
            }
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
