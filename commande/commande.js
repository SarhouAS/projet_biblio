document.addEventListener('DOMContentLoaded', function() {
    fetch('../php/CommandeController.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                console.log('Fetched commandes:', data.commandes); // Log fetched commandes
                const commandes = data.commandes;
                const container = document.querySelector('#commandes-container');

                commandes.forEach(commande => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="../uploads/${commande.photo}" alt="${commande.NOM_LIVRE}">
                        <p>Nom du Livre: ${commande.NOM_LIVRE}</p>
                        <p>Email Utilisateur: ${commande.EMAIL}</p>
                        <p>Nom: ${commande.NOM}</p>
                        <p>Prénom: ${commande.PRENOM}</p>
                        <p>Adresse: ${commande.ADRESSRE}</p>
                        <p>Ville: ${commande.VILLE}</p>
                        <p>Code Postal: ${commande.CODE_POSTAL}</p>
                        <p>Type: ${commande.TYPE}</p>
                        <label for="etat-${commande.ID_COMMANDE}">État:</label>
                        <select id="etat-${commande.ID_COMMANDE}">
                            <option value="en attente" ${commande.ETAT === 'en attente' ? 'selected' : ''}>En attente</option>
                            <option value="acceptée" ${commande.ETAT === 'acceptée' ? 'selected' : ''}>Acceptée</option>
                            <option value="refusée" ${commande.ETAT === 'refusée' ? 'selected' : ''}>Refusée</option>
                        </select>
                        <button onclick="updateCommande(${commande.ID_COMMANDE})">Mettre à jour</button>
                    `;
                    container.appendChild(card);
                });
            } else {
                alert('Erreur lors de la récupération des commandes : ' + data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
});

function updateCommande(commandeId) {
    const etat = document.getElementById(`etat-${commandeId}`).value;

    // Log the data being sent
    console.log('Updating Commande:', { commandeId, etat });

    fetch('../php/CommandeController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ commandeId: commandeId, etat: etat })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            alert('Commande mise à jour avec succès');
            location.reload();
        } else {
            alert('Erreur lors de la mise à jour de la commande : ' + data.message);
        }
    })
    .catch(error => console.error('Erreur:', error));
}
