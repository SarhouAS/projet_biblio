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
                const commandes = data.commandes;
                const tableBody = document.querySelector('#commandes-table tbody');
                commandes.forEach(commande => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${commande.ID_COMMANDE}</td>
                        <td>${commande.EMAIL}</td>
                        <td>${commande.NOM}</td>
                        <td>${commande.PRENOM}</td>
                        <td>${commande.ADRESSRE}</td>
                        <td>${commande.VILLE}</td>
                        <td>${commande.CODE_POSTAL}</td>
                        <td>${commande.TYPE}</td>
                        <td>
                            <select id="etat-${commande.ID_COMMANDE}">
                                <option value="en attente" ${commande.ETAT === 'en attente' ? 'selected' : ''}>En attente</option>
                                <option value="acceptée" ${commande.ETAT === 'acceptée' ? 'selected' : ''}>Acceptée</option>
                                <option value="refusée" ${commande.ETAT === 'refusée' ? 'selected' : ''}>Refusée</option>
                            </select>
                        </td>
                        <td>
                            <button onclick="updateCommande(${commande.ID_COMMANDE})">Mettre à jour</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                alert('Erreur lors de la récupération des commandes : ' + data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
});

function updateCommande(commandeId) {
    const etat = document.getElementById(`etat-${commandeId}`).value;

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
