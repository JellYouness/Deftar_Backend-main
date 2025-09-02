-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 27 août 2025 à 02:07
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `deftre`
--

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

CREATE TABLE `commandes` (
  `id` int(11) NOT NULL,
  `nom_arabe` varchar(255) DEFAULT NULL,
  `nom_francais` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `direction_provinciale` varchar(255) DEFAULT NULL,
  `etablissement` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `matiere` varchar(255) DEFAULT NULL,
  `cycle` varchar(255) DEFAULT NULL,
  `emploi_temps_url` varchar(500) DEFAULT NULL,
  `date_commande` datetime DEFAULT NULL,
  `statut_commande` varchar(50) DEFAULT NULL,
  `numero_commande` varchar(100) DEFAULT NULL,
  `methode_paiement` varchar(50) DEFAULT NULL,
  `recu_url` varchar(500) DEFAULT NULL,
  `montant` decimal(10,2) DEFAULT 30.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commandes`
--

INSERT INTO `commandes` (`id`, `nom_arabe`, `nom_francais`, `email`, `telephone`, `direction_provinciale`, `etablissement`, `region`, `matiere`, `cycle`, `emploi_temps_url`, `date_commande`, `statut_commande`, `numero_commande`, `methode_paiement`, `recu_url`, `montant`) VALUES
(1, 'ملخص الطلب', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'rabat-sale-kenitra', 'EST', 'sale', 'anglais', 'college', NULL, '2025-08-23 15:54:05', 'payée', 'CMD_1755964445972', 'cmi', NULL, 30.00),
(2, 'ملخص الطلب', 'Abdessamad Hnioua', 'abdessamadhnioua@gmail.com', '+212670775289', 'rabat-sale-kenitra', 'est', 'temara', 'sciences-physiques', 'lycee', '/uploads/emploi_temps/1755965543360-Capture dâÃ©cran 2023-12-28 080327.png', '2025-08-23 16:12:23', 'payée', 'CMD_1755965543338', 'cmi', NULL, 30.00),
(3, 'ملخص الطلب', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'casablanca-settat', 'EST', 'mohammedia', 'arabe', 'college', '/uploads/emploi_temps/1755965645243-musique.png', '2025-08-23 16:14:05', 'en_attente', 'CMD_1755965645230', 'virement', '/uploads/recu/1755965645243-prÃ©-demande-SQY1O18I.pdf', 30.00),
(5, 'ملخص الطلب', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'casablanca-settat', 'EST', 'mohammedia', 'sciences-physiques', 'college', '/uploads/emploi_temps/1755985659687-musique.png', '2025-08-23 21:47:39', 'en_attente', 'CMD_1755985659688', 'virement', '/uploads/recu/1755985659687-CDC Diftar.pdf', 30.00),
(6, 'hhhhhh', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'fes-meknes', 'est', 'fes', 'informatique', 'college', '/uploads/emploi_temps/1755992677105-musique.png', '2025-08-23 23:44:37', 'en_attente', 'CMD_1755992677093', 'virement', '/uploads/recu/1755992677105-FILE_176999_CINOUPASSEPORT.pdf', 30.00),
(7, '', '', 'abdessamadhnioua@gmail.com', '', '', '', '', '', '', '/uploads/emploi_temps/1755997018349-usb (1).png', '2025-08-24 00:56:58', 'en_attente', 'CMD_1755997018321', 'virement', '/uploads/recu/1755997018351-screencapture-localhost-3000-association-acceuil-etape1-2025-07-13-11_48_52.pdf', 30.00),
(8, 'hnioua', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'casablanca-settat', 'EST', 'casablanca', 'francais', 'college', '/uploads/emploi_temps/1755997315473-musique.png', '2025-08-24 01:01:55', 'payé', 'CMD_1755997315459', 'virement', '/uploads/recu/1755997315473-FILE_176999_CINOUPASSEPORT.pdf', 30.00),
(9, 'Clé secrète', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'casablanca-settat', 'ESRT', 'casablanca', 'technologie', 'college', '/uploads/emploi_temps/1756043512230-S28f4f4816f2b4adf8f45b02a65e13c2eF-removebg-preview.png', '2025-08-24 13:51:52', 'en_attente', 'CMD_1756043512196', 'virement', '/uploads/recu/1756043512241-prÃ©-demande-52DL9KI1.pdf', 30.00),
(10, 'heyt', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'rabat-sale-kenitra', 'est', 'rabat', 'arabe', 'college', '/uploads/emploi_temps/1756058961401-S28f4f4816f2b4adf8f45b02a65e13c2eF-removebg-preview.png', '2025-08-24 18:09:21', 'en_attente', 'CMD_1756058961386', 'virement', NULL, 30.00),
(11, 'HH', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'casablanca-settat', 'est', 'casablanca', 'mathematiques', 'college', '/uploads/emploi_temps/1756062439886-usb.png', '2025-08-24 19:07:19', 'en_attente', 'CMD_1756062439875', 'virement', '/uploads/recu/1756062439886-Business Plan traveelmee.pdf', 30.00),
(12, 'ncccc', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'casablanca-settat', 'est', 'casablanca', 'chimie', 'college', '/uploads/emploi_temps/1756071199772-arduino_uno-2_640x359-removebg-preview.png', '2025-08-24 21:33:19', 'en_attente', 'CMD_1756071199763', 'virement', '/uploads/recu/1756071199774-CV__Copy_-5.pdf', 30.00),
(13, 'heu', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'casablanca-settat', 'est', 'casablanca', 'svt', 'college', '/uploads/emploi_temps/1756081997093-S28f4f4816f2b4adf8f45b02a65e13c2eF-removebg-preview.png', '2025-08-25 00:33:17', 'complété', 'CMD_1756081997073', 'virement', '/uploads/recu/1756081997105-screencapture-localhost-3000-association-acceuil-etape1-2025-07-13-11_48_52.pdf', 30.00),
(14, 'HNIOUA', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'rabat-sale-kenitra', 'est', 'rabat', 'arabe', 'college', '/uploads/emploi_temps/1756131137579-Capture dâÃ©cran 2023-12-19 200253.png', '2025-08-25 14:12:17', 'refusé', 'CMD_1756131137561', 'virement', '/uploads/recu/1756131137581-ChÃ¨res Ã©tudiantes.pdf', 30.00),
(15, 'hhhhh', 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '+212670775289', 'rabat-sale-kenitra', 'EST', 'rabat', 'technologie', 'college', '/uploads/emploi_temps/1756209995338-DSC_3314cpy00.jpg', '2025-08-26 12:06:35', 'en retard', 'CMD_1756209995315', 'virement', '/uploads/recu/1756209995340-ChÃ¨res Ã©tudiantes.pdf', 30.00),
(16, 'younes', 'hnioua', 'younes.prof07@gmail.com', '+212670775289', 'casablanca-settat', 'mbourk', 'casablanca', 'informatique', 'lycee', '/uploads/emploi_temps/1756215256678-20250415_175707.jpg', '2025-08-26 13:34:16', 'en_attente', 'CMD_1756215256668', 'virement', '/uploads/recu/1756215256710-ChÃ¨res Ã©tudiantes.pdf', 30.00);

-- --------------------------------------------------------

--
-- Structure de la table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reply_date` timestamp NULL DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `status` enum('pas encore','répondu') DEFAULT 'pas encore'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contact`
--

INSERT INTO `contact` (`id`, `name`, `email`, `message`, `created_at`, `reply_date`, `admin_id`, `status`) VALUES
(1, 'ABDESSAMAD HNIOUA', 'abdessamadhnioua@gmail.com', 'salam 3likoum', '2025-08-24 14:00:40', NULL, NULL, ''),
(2, 'ABDESSAMAD HNIOUA', 'abdessamadhnioua@gmail.com', 'salam', '2025-08-24 14:01:51', NULL, NULL, 'pas encore'),
(3, 'ABDESSAMAD HNIOUA', 'abdessamadhnioua@gmail.com', 'hey', '2025-08-24 14:05:13', NULL, NULL, 'pas encore'),
(4, 'بشرا حفيظة', 'abdessamadhnioua@gmail.com', 'saa  a', '2025-08-24 14:06:03', NULL, NULL, 'pas encore'),
(5, 'ABDESSAMAD HNIOUA', 'abdessamadhnioua@gmail.com', 'HY', '2025-08-25 22:59:23', NULL, NULL, 'pas encore');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('admin','client','superview') NOT NULL DEFAULT 'client',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `must_change_password` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `status`, `created_at`, `updated_at`, `must_change_password`) VALUES
(1, 'Abdessamad HNIOUA', 'abdessamadhnioua@gmail.com', '$2b$10$OdqPPn1ru7O/v/ujrg6geu0VJt1QbzPF3nd/l78k2XiLppJnT0dC6', 'admin', '2025-08-24 17:47:18', '2025-08-27 00:07:05', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
