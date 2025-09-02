-- Neon PostgreSQL Schema for Deftre Backend
-- Run this in your Neon database

-- Table: commandes
CREATE TABLE IF NOT EXISTS commandes (
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
CREATE TABLE IF NOT EXISTS contact (
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
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS models_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_fr VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: banks
CREATE TABLE IF NOT EXISTS banks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_commandes_email ON commandes(email);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes(statut_commande);
CREATE INDEX IF NOT EXISTS idx_commandes_date ON commandes(date_commande);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert initial admin user (password will be hashed by the application)
-- The password 'D130115280' will be automatically hashed when the server starts
