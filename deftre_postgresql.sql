-- PostgreSQL Schema for Deftre Backend
-- Converted from MySQL/MariaDB

-- Create database (run this separately if needed)
-- CREATE DATABASE deftre;

-- Connect to the database
-- \c deftre;

-- Enable UUID extension if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: commandes
CREATE TABLE commandes (
  id SERIAL PRIMARY KEY,
  type_carnet VARCHAR(50) DEFAULT 'standard',
  nom_arabe VARCHAR(255),
  nom_francais VARCHAR(255),
  email VARCHAR(255),
  telephone VARCHAR(50),
  direction_provinciale VARCHAR(255),
  etablissement VARCHAR(255),
  region VARCHAR(255),
  matiere VARCHAR(255),
  cycle VARCHAR(255),
  emploi_temps_url VARCHAR(500),
  date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  statut_commande VARCHAR(50) DEFAULT 'en_attente',
  numero_commande VARCHAR(100),
  methode_paiement VARCHAR(50),
  banque_choisie VARCHAR(255),
  rib_choisi VARCHAR(255),
  recu_url VARCHAR(500),
  montant DECIMAL(10,2) DEFAULT 30.00
);

-- Table: contact
CREATE TABLE contact (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reply_date TIMESTAMP NULL,
  admin_id INTEGER NULL,
  status VARCHAR(20) DEFAULT 'pas encore' CHECK (status IN ('pas encore', 'answered'))
);

-- Table: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'user',
  must_change_password BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: models_images
CREATE TABLE models_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_fr VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: banks (if needed)
CREATE TABLE banks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_commandes_email ON commandes(email);
CREATE INDEX idx_commandes_statut ON commandes(statut_commande);
CREATE INDEX idx_commandes_date ON commandes(date_commande);
CREATE INDEX idx_contact_email ON contact(email);
CREATE INDEX idx_contact_status ON contact(status);
CREATE INDEX idx_users_email ON users(email);

-- Insert sample data (optional)
-- INSERT INTO users (name, email, password, status, must_change_password) 
-- VALUES ('Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '$2b$10$...', 'admin', true);

-- Note: You'll need to hash the password properly when inserting users
-- The password hash should be generated using bcrypt with salt rounds of 10
