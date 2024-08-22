const mysql = require('mysql2');

// Connexion à MySQL (sans base de données spécifique)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '' // Assurez-vous que le mot de passe est correct
});

// Fonction pour créer la base de données et les tables
async function setupDatabase() {
  // Promesse pour créer la base de données
  const createDatabase = () => {
    return new Promise((resolve, reject) => {
      connection.query('CREATE DATABASE IF NOT EXISTS project3', (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  };

  // Promesse pour utiliser la base de données
  const useDatabase = () => {
    return new Promise((resolve, reject) => {
      connection.query('USE project3', (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  };

  // Promesse pour créer les tables
  const createTables = () => {
    const queries = [
      `CREATE TABLE IF NOT EXISTS article (
        idart INT PRIMARY KEY,
        Nom_article VARCHAR(255),
        prix DECIMAL(10, 2),
        qstock INT,
        codef VARCHAR(255)
      )`,
      `CREATE TABLE IF NOT EXISTS fournisseur (
        ID INT PRIMARY KEY,
        Nom_complete VARCHAR(255),
        Téléphone VARCHAR(50),
        Email VARCHAR(255),
        Address VARCHAR(255),
        BirthDate DATE,
        Ville VARCHAR(255)
      )`,
      `CREATE TABLE IF NOT EXISTS client (
        ID INT PRIMARY KEY,
        Nom_complete VARCHAR(255),
        Téléphone VARCHAR(50),
        Email VARCHAR(255),
        Address VARCHAR(255),
        BirthDate DATE,
        Ville VARCHAR(255)
      )`,
      `CREATE TABLE IF NOT EXISTS famille_article (
        idartf INT PRIMARY KEY,
        Désignation VARCHAR(255),
        code VARCHAR(255)
      )`,
      `CREATE TABLE IF NOT EXISTS reception (
        Id INT PRIMARY KEY,
        ReceptionNumber VARCHAR(255),
        Date DATE,
        FournisseurId INT,
        Service VARCHAR(255),
        Observation TEXT,
        Facturation VARCHAR(50),
        FOREIGN KEY (FournisseurId) REFERENCES fournisseur(ID)
      )`,
      `CREATE TABLE IF NOT EXISTS commande_reception (
        ReceptionId INT,
        CammandeId VARCHAR(255),
        ArticleId INT,
        Quantity INT,
        Price DECIMAL(10, 2),
        Amount DECIMAL(10, 2),
        PRIMARY KEY (ReceptionId, CammandeId),
        FOREIGN KEY (ReceptionId) REFERENCES reception(Id),
        FOREIGN KEY (ArticleId) REFERENCES article(idart)
      )`,
      `CREATE TABLE IF NOT EXISTS vente (
        Id INT PRIMARY KEY,
        VenteNumber VARCHAR(255),
        Date DATE,
        Client INT,
        Observation TEXT,
        Facturation VARCHAR(50),
        Total DECIMAL(10, 2),
        FOREIGN KEY (Client) REFERENCES client(ID)
      )`,
      `CREATE TABLE IF NOT EXISTS commande_vente (
        VenteId INT,
        CammandeId VARCHAR(255),
        ArticleId INT,
        Quantity INT,
        Price DECIMAL(10, 2),
        Amount DECIMAL(10, 2),
        PRIMARY KEY (VenteId, CammandeId),
        FOREIGN KEY (VenteId) REFERENCES vente(Id),
        FOREIGN KEY (ArticleId) REFERENCES article(idart)
      )`
    ];

    return new Promise((resolve, reject) => {
      queries.forEach((query, index) => {
        connection.query(query, (error) => {
          if (error) return reject(error);
          if (index === queries.length - 1) resolve();
        });
      });
    });
  };

  try {
    await createDatabase();
    await useDatabase();
    await createTables();
    console.log('Base de données et tables créées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la création de la base de données ou des tables:', error);
  } finally {
    connection.end();
  }
}

// Appeler la fonction pour créer la base de données et les tables
setupDatabase();
