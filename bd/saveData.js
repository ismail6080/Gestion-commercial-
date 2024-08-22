const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project3",
});

app.use(cors());
app.use(express.json());

app.post("/save-data", async (req, res) => {
  const {
    fournisseur,
    client,
    villes,
    articles,
    artfamille,
    reception,
    orders,
    ventes,
    commandes,
  } = req.body;

  try {
    // Vider les tables
    await connection.promise().query("DELETE FROM fournisseur");
    await connection.promise().query("DELETE FROM client");
    await connection.promise().query("DELETE FROM article");
    await connection.promise().query("DELETE FROM famille_article");
    await connection.promise().query("DELETE FROM reception");
    await connection.promise().query("DELETE FROM commande_reception");
    await connection.promise().query("DELETE FROM vente");
    await connection.promise().query("DELETE FROM commande_vente");

    // Insérer les données dans la table fournisseur
    for (const item of fournisseur) {
      await connection.promise().query(
        "INSERT INTO fournisseur (ID, Nom_complete, Ville) VALUES (?, ?, ?)",
        [item.ID, item.Nom_complete, item.Ville]
      );
    }

    // Insérer les données dans la table client
    for (const item of client) {
      await connection.promise().query(
        "INSERT INTO client (ID, Nom_complete, Ville) VALUES (?, ?, ?)",
        [item.ID, item.Nom_complete, item.Ville]
      );
    }

    // Insérer les données dans la table article
    for (const item of articles) {
      await connection.promise().query(
        "INSERT INTO article (idart, Nom_article, Prix, Stock) VALUES (?, ?, ?, ?)",
        [item.idart, item.Nom_article, item.Prix, item.Stock]
      );
    }

    // Insérer les données dans la table famille_article
    for (const item of artfamille) {
      await connection.promise().query(
        "INSERT INTO famille_article (idfamille, Nom_famille) VALUES (?, ?)",
        [item.idfamille, item.Nom_famille]
      );
    }

    // Insérer les données dans la table reception
    for (const item of reception) {
      await connection.promise().query(
        "INSERT INTO reception (Id, ReceptionNumber, Date, FournisseurId, Service, Observation, Facturation) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          item.Id,
          item.ReceptionNumber,
          item.Date,
          item.FournisseurId,
          item.Service,
          item.Observation,
          item.Facturation,
        ]
      );
    }

    // Insérer les données dans la table commande_reception
    for (const item of orders) {
      await connection.promise().query(
        "INSERT INTO commande_reception (ReceptionId, CammandeId, ArticleId, Quantity, Price, Amount) VALUES (?, ?, ?, ?, ?, ?)",
        [
          item.ReceptionId,
          item.CammandeId,
          item.ArticleId,
          item.Quantity,
          item.Price,
          item.Amount,
        ]
      );
    }

    // Insérer les données dans la table vente
    for (const item of ventes) {
      await connection.promise().query(
        "INSERT INTO vente (Id, VenteNumber, Date, Client, Observation, Facturation, Total) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          item.Id,
          item.VenteNumber,
          item.Date,
          item.Client,
          item.Observation,
          item.Facturation,
          item.Total,
        ]
      );
    }

    // Insérer les données dans la table commande_vente
    for (const item of commandes) {
      await connection.promise().query(
        "INSERT INTO commande_vente (VenteId, CammandeId, ArticleId, Quantity, Price, Amount) VALUES (?, ?, ?, ?, ?, ?)",
        [
          item.VenteId,
          item.CammandeId,
          item.ArticleId,
          item.Quantity,
          item.Price,
          item.Amount,
        ]
      );
    }

    res.json({ message: "Données enregistrées avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données:", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement des données." });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
