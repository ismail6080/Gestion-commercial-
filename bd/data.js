// Fonction pour charger les données depuis l'API
async function loadData() {
    try {
      const response = await fetch('http://localhost:3001/data');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données.');
      }
      const data = await response.json();
  
      // Stocker les données dans les variables globales
      window.fournisseur = data.fournisseur;
      window.client = data.client;
      window.villes = data.villes;
      window.articles = data.articles;
      window.artfamille = data.artfamille;
      window.reception = data.reception;
      window.orders = data.orders;
      window.ventes = data.ventes;
      window.commandes = data.commandes;
  
      console.log('Données chargées avec succès.');
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }
  async function saveDataToServer() {
    try {
      const response = await fetch('http://localhost:3001/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fournisseur: window.fournisseur,
          client: window.client,
          villes: window.villes,
          articles: window.articles,
          artfamille: window.artfamille,
          reception: window.reception,
          orders: window.orders,
          ventes: window.ventes,
          commandes: window.commandes
        })
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Données enregistrées avec succès:', result.message);
      } else {
        console.error('Erreur lors de l\'enregistrement des données:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données au serveur:', error);
    }
  }
  
  // Exemple d'appel de la fonction lorsque vous voulez sauvegarder les données
  saveDataToServer();
  
  
  // Charger les données lors du chargement de la page
  window.onload = loadData;
  