const mysql = require("mysql2");
const express = require("express");
const cors = require("cors"); 
const app = express();
const port = 3001;

// Connexion à MySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "project3",
});

// Utiliser le middleware CORS pour autoriser toutes les requêtes
app.use(cors());

// Middleware pour les réponses JSON
app.use(express.json());

// API pour récupérer les données
app.get("/data", async (req, res) => {
    try {
        const [fournisseurs] = await connection
            .promise()
            .query("SELECT * FROM fournisseur");
        const [clients] = await connection.promise().query("SELECT * FROM client");
        const [villes] = await connection
            .promise()
            .query(
                "SELECT DISTINCT Ville FROM fournisseur UNION SELECT DISTINCT Ville FROM client"
            );
        const [articles] = await connection
            .promise()
            .query("SELECT * FROM article");
        const [artfamille] = await connection
            .promise()
            .query("SELECT * FROM famille_article");
        const [reception] = await connection.promise().query(`
          SELECT 
            r.Id,
            r.ReceptionNumber,
            r.Date,
            f.Nom_complete AS FournisseurId,
            r.Service,
            r.Observation,
            r.Facturation
          FROM 
            reception r
          JOIN 
            fournisseur f ON r.FournisseurId = f.ID
        `);
        const [orders] = await connection
            .promise()
            .query(`
          SELECT 
            cr.ReceptionId,
            cr.CammandeId,
            cr.ArticleId,
            a.Nom_article AS NomArticle,
            cr.Quantity,
            cr.Price,
            cr.Amount
          FROM 
            commande_reception cr
          JOIN 
            article a ON cr.ArticleId = a.idart;
        `);
        const [ventes] = await connection.promise().query(`
          SELECT 
            v.Id,
            v.VenteNumber,
            v.Date,
            v.Client,
            c.Nom_complete AS Client,
            v.Observation,
            v.Facturation,
            v.Total
          FROM 
            vente v
          JOIN 
            client c ON v.Client = c.ID;
        `);
        const [commandes] = await connection.promise().query(`
          SELECT 
            cv.VenteId,
            cv.CammandeId,
            cv.ArticleId,
            a.Nom_article AS NomArticle,
            cv.Quantity,
            cv.Price,
            cv.Amount
          FROM 
            commande_vente cv
          JOIN 
            article a ON cv.ArticleId = a.idart;
        `);

        res.json({
            fournisseur: fournisseurs,
            client: clients,
            villes: villes,
            articles: articles,
            artfamille: artfamille,
            reception: reception,
            orders: orders,
            ventes: ventes,
            commandes: commandes,
        });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Erreur lors de la récupération des données." });
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
