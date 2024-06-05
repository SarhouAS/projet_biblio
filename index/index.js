document.addEventListener('DOMContentLoaded', function() {
    fetch('../php/livreController.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const livres = data.livres;
                const livresContainer = document.getElementById('livres-container');

                livres.forEach(livre => {
                    const livreElement = document.createElement('div');
                    livreElement.classList.add('book-item');
                    livreElement.innerHTML = `
                        <img src="../asset/${livre.image}" alt="${livre.titre}">
                        <p>${livre.titre}<br>Quantité: ${livre.quantite}</p>
                        <button class="availability">Acheter</button>
                        <button class="availability">Emprunter</button>
                    `;
                    livresContainer.appendChild(livreElement);
                });
            } else {
                console.error('Erreur lors de la récupération des livres:', data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
});

let slideIndex = [0, 0];

function plusSlides(n, no) {
    showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
    let slides = document.querySelectorAll(`.carousel-slide[data-index="${no}"] .book-item`);
    if (n >= slides.length) { slideIndex[no] = 0; }
    if (n < 0) { slideIndex[no] = slides.length - 1; }
    let offset = -slideIndex[no] * (slides[0].offsetWidth + 20); 
    document.querySelector(`.carousel-slide[data-index="${no}"]`).style.transform = `translateX(${offset}px)`;
}

document.addEventListener("DOMContentLoaded", function() {
    showSlides(0, 0);
    showSlides(0, 1);
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.availability').forEach(button => {
        button.addEventListener('click', function() {
            let type = this.textContent.trim(); 
            
            fetch('../php/CommandeController.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type: type })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Commande créée avec succès');
                } else if (data.message === 'User not logged in') {
                    alert('Veuillez vous connecter pour faire une demande');
                } else {
                    alert('Erreur lors de la création de la commande');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors de la création de la commande');
            });
        });
    });
});
