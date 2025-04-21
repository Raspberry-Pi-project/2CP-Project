-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 20 avr. 2025 à 16:11
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
-- Base de données : `trivio`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id_admin` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id_admin`, `first_name`, `last_name`, `email`, `password`, `created_at`) VALUES
(1, 'Wassim', 'Belguenbour', 'test@gmail.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-11 08:09:14'),
(2, 'a', 'ab', 'a@gmail.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 11:46:54'),
(3, 'Super', 'Admin', 'superadmin@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38');

-- --------------------------------------------------------

--
-- Structure de la table `answers`
--

CREATE TABLE `answers` (
  `id_answer` int(255) NOT NULL,
  `id_question` int(255) NOT NULL,
  `answer_text` text NOT NULL,
  `correct` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `answers`
--

INSERT INTO `answers` (`id_answer`, `id_question`, `answer_text`, `correct`) VALUES
(1, 1, 'Answer 1 Question 1 PRST1', 1),
(2, 1, 'Answer 2 Question 1 PRST1', 0),
(3, 2, 'Answer 1 Question 2 PRST1', 1),
(4, 2, 'Answer 2 Question 2 PRST1', 0),
(5, 2, 'Answer 3 Question 2 PRST1', 1),
(6, 3, 'Answer 1 Question 3 PRST1', 0),
(7, 3, 'Answer 2 Question 3 PRST1', 1),
(8, 3, 'Answer 3 Question 3 PRST1', 1),
(9, 4, 'Answer 1 Question 1 ANG3', 1),
(10, 4, 'Answer 2 Question 1 ANG3', 0),
(11, 5, 'Answer 1 Question 2 ANG3', 1),
(12, 5, 'Answer 2 Question 2 ANG3', 0),
(13, 6, 'Answer 1 Question 3 ANG3', 1),
(14, 6, 'Answer 2 Question 3 ANG3', 0),
(15, 6, 'Answer 3 Question 3 ANG3', 1),
(16, 7, 'Answer 1 Question 1 PRST2', 1),
(17, 8, 'Answer 1 Question 2 PRST2', 0),
(18, 8, 'Answer 2 Question 2 PRST2', 1),
(19, 9, 'Answer 1 Question 3 PRST2', 0),
(20, 9, 'Answer 2 Question 3 PRST2', 1),
(21, 9, 'Answer 3 Question 3 PRST2', 0),
(22, 10, 'Answer 1 Question 1 ELEF2', 1),
(23, 10, 'Answer 2 Question 1 ELEF2', 0),
(24, 11, 'Answer 1 Question 2 ELEF2', 1),
(25, 11, 'Answer 2 Question 2 ELEF2', 0),
(26, 11, 'Answer 3 Question 2 ELEF2', 1),
(27, 12, 'Answer 1 Question 3 ELEF2', 0),
(28, 12, 'Answer 2 Question 3 ELEF2', 1),
(29, 12, 'Answer 3 Question 3 ELEF2', 1),
(30, 13, 'Answer 1 Question 1 ALG3', 1),
(31, 13, 'Answer 2 Question 1 ALG3', 0),
(32, 14, 'Answer 1 Question 2 ALG3', 1),
(33, 14, 'Answer 2 Question 2 ALG3', 0),
(34, 14, 'Answer 3 Question 2 ALG3', 1),
(35, 15, 'Answer 1 Question 3 ALG3', 0),
(36, 15, 'Answer 2 Question 3 ALG3', 1),
(37, 15, 'Answer 3 Question 3 ALG3', 1),
(38, 16, 'Answer 1 Question 1 ANAL3', 1),
(39, 16, 'Answer 2 Question 1 ANAL3', 0),
(40, 17, 'Answer 1 Question 2 ANAL3', 1),
(41, 17, 'Answer 2 Question 2 ANAL3', 0),
(42, 17, 'Answer 3 Question 2 ANAL3', 1),
(43, 18, 'Answer 1 Question 3 ANAL3', 0),
(44, 18, 'Answer 2 Question 3 ANAL3', 1),
(45, 18, 'Answer 3 Question 3 ANAL3', 1),
(46, 19, 'Answer 1 Question 1 ARCH2', 1),
(47, 19, 'Answer 2 Question 1 ARCH2', 0),
(48, 20, 'Answer 1 Question 2 ARCH2', 1),
(49, 20, 'Answer 2 Question 2 ARCH2', 0),
(50, 20, 'Answer 3 Question 2 ARCH2', 1),
(51, 21, 'Answer 1 Question 3 ARCH2', 0),
(52, 21, 'Answer 2 Question 3 ARCH2', 1),
(53, 21, 'Answer 3 Question 3 ARCH2', 1),
(54, 22, 'Answer 1 Question 1 SFSD', 1),
(55, 22, 'Answer 2 Question 1 SFSD', 0),
(56, 23, 'Answer 1 Question 2 SFSD', 1),
(57, 23, 'Answer 2 Question 2 SFSD', 0),
(58, 23, 'Answer 3 Question 2 SFSD', 1),
(59, 24, 'Answer 1 Question 3 SFSD', 0),
(60, 24, 'Answer 2 Question 3 SFSD', 1),
(61, 24, 'Answer 3 Question 3 SFSD', 1),
(62, 25, 'Answer 1 Question 1 PRJP', 1),
(63, 25, 'Answer 2 Question 1 PRJP', 0),
(64, 26, 'Answer 1 Question 2 PRJP', 1),
(65, 26, 'Answer 2 Question 2 PRJP', 0),
(66, 26, 'Answer 3 Question 2 PRJP', 1),
(67, 27, 'Answer 1 Question 3 PRJP', 0),
(68, 27, 'Answer 2 Question 3 PRJP', 1),
(69, 27, 'Answer 3 Question 3 PRJP', 1),
(70, 28, 'Answer 1 Question 1 OOE', 1),
(71, 28, 'Answer 2 Question 1 OOE', 0),
(72, 29, 'Answer 1 Question 2 OOE', 1),
(73, 29, 'Answer 2 Question 2 OOE', 0),
(74, 29, 'Answer 3 Question 2 OOE', 1),
(75, 30, 'Answer 1 Question 3 OOE', 0),
(76, 30, 'Answer 2 Question 3 OOE', 1),
(77, 30, 'Answer 3 Question 3 OOE', 1),
(78, 31, 'Answer 1 Question 1 LOGM', 1),
(79, 31, 'Answer 2 Question 1 LOGM', 0),
(80, 32, 'Answer 1 Question 2 LOGM', 1),
(81, 32, 'Answer 2 Question 2 LOGM', 0),
(82, 32, 'Answer 3 Question 2 LOGM', 1),
(83, 33, 'Answer 1 Question 3 LOGM', 0),
(84, 33, 'Answer 2 Question 3 LOGM', 1),
(85, 33, 'Answer 3 Question 3 LOGM', 1),
(86, 34, 'Answer 1 Question 1 ANAL4', 1),
(87, 34, 'Answer 2 Question 1 ANAL4', 0),
(88, 35, 'Answer 1 Question 2 ANAL4', 1),
(89, 35, 'Answer 2 Question 2 ANAL4', 0),
(90, 35, 'Answer 3 Question 2 ANAL4', 1),
(91, 36, 'Answer 1 Question 3 ANAL4', 0),
(92, 36, 'Answer 2 Question 3 ANAL4', 1),
(93, 36, 'Answer 3 Question 3 ANAL4', 1),
(94, 37, 'Answer 1 Question 1 SINF', 1),
(95, 37, 'Answer 2 Question 1 SINF', 0),
(96, 38, 'Answer 1 Question 2 SINF', 1),
(97, 38, 'Answer 2 Question 2 SINF', 0),
(98, 38, 'Answer 3 Question 2 SINF', 1),
(99, 39, 'Answer 1 Question 3 SINF', 0),
(100, 39, 'Answer 2 Question 3 SINF', 1),
(101, 39, 'Answer 3 Question 3 SINF', 1),
(102, 40, 'Answer 1 Question 1 POO', 1),
(103, 40, 'Answer 2 Question 1 POO', 0),
(104, 41, 'Answer 1 Question 2 POO', 1),
(105, 41, 'Answer 2 Question 2 POO', 0),
(106, 41, 'Answer 3 Question 2 POO', 1),
(107, 42, 'Answer 1 Question 3 POO', 0),
(108, 42, 'Answer 2 Question 3 POO', 1),
(109, 42, 'Answer 3 Question 3 POO', 1),
(110, 43, 'Answer 1 Question 1 ANG2', 1),
(111, 43, 'Answer 2 Question 1 ANG2', 0),
(112, 44, 'Answer 1 Question 2 ANG2', 1),
(113, 44, 'Answer 2 Question 2 ANG2', 0),
(114, 44, 'Answer 3 Question 2 ANG2', 1),
(115, 45, 'Answer 1 Question 3 ANG2', 0),
(116, 45, 'Answer 2 Question 3 ANG2', 1),
(117, 45, 'Answer 3 Question 3 ANG2', 1),
(118, 46, 'Answer 1 Question 1 ECON', 1),
(119, 46, 'Answer 2 Question 1 ECON', 0),
(120, 47, 'Answer 1 Question 2 ECON', 1),
(121, 47, 'Answer 2 Question 2 ECON', 0),
(122, 47, 'Answer 3 Question 2 ECON', 1),
(123, 48, 'Answer 1 Question 3 ECON', 0),
(124, 48, 'Answer 2 Question 3 ECON', 1),
(125, 48, 'Answer 3 Question 3 ECON', 1);

-- --------------------------------------------------------

--
-- Structure de la table `attempts`
--

CREATE TABLE `attempts` (
  `id_attempt` int(255) NOT NULL,
  `id_student` int(255) NOT NULL,
  `id_quiz` int(255) NOT NULL,
  `corrected` int(11) NOT NULL,
  `score` float NOT NULL DEFAULT 0,
  `attempt_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `published_quizzes`
--

CREATE TABLE `published_quizzes` (
  `id_published` int(11) NOT NULL,
  `id_quiz` int(11) NOT NULL,
  `student_number` int(11) NOT NULL,
  `published_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `published_quizzes`
--

INSERT INTO `published_quizzes` (`id_published`, `id_quiz`, `student_number`, `published_at`) VALUES
(9, 9, 50, '2025-04-11 13:40:20'),
(10, 10, 50, '2025-04-14 13:40:20'),
(11, 11, 50, '2025-04-14 13:40:20'),
(12, 12, 50, '2025-04-12 13:40:20'),
(13, 16, 50, '2025-04-14 13:40:20');

-- --------------------------------------------------------

--
-- Structure de la table `questions`
--

CREATE TABLE `questions` (
  `id_question` int(255) NOT NULL,
  `id_quiz` int(255) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `question_text` text NOT NULL,
  `question_number` int(11) NOT NULL,
  `points` float NOT NULL,
  `question_type` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `question_percentage` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `questions`
--

INSERT INTO `questions` (`id_question`, `id_quiz`, `duration`, `question_text`, `question_number`, `points`, `question_type`, `created_at`, `question_percentage`) VALUES
(1, 9, 10, 'Question 1 PRST1', 2, 3, 'QCU', '2025-02-23 18:47:16', 30),
(2, 9, 10, 'Question 2 PRST1', 3, 3, 'QCM', '2025-03-09 16:11:02', 30),
(3, 9, 10, 'Question 3 PRST1', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(4, 15, 10, 'Question 1 ANG3', 2, 4, 'QCU', '2025-03-26 14:14:38', 40),
(5, 15, 20, 'Question 2 ANG3', 2, 2, 'QCM', '2025-03-26 14:14:38', 20),
(6, 15, 10, 'Question 3 ANG3', 3, 4, 'QCM', '2025-03-26 14:14:38', 40),
(7, 16, 10, 'Question 1 PRST2', 1, 5, 'QS', '2025-03-26 14:14:38', 50),
(8, 16, 10, 'Question 2 PRST2', 2, 2, 'QCU', '2025-03-26 14:14:38', 20),
(9, 16, 10, 'Question 3 PRST2', 3, 3, 'QCM', '2025-03-26 14:14:38', 30),
(10, 10, 10, 'Question 1 ELEF2', 2, 4, 'QCU', '2025-02-23 18:47:16', 40),
(11, 10, 10, 'Question 2 ELEF2', 3, 3, 'QCM', '2025-03-09 16:11:02', 30),
(12, 10, 10, 'Question 3 ELEF2', 3, 3, 'QCM', '2025-03-09 16:11:28', 30),
(13, 11, 10, 'Question 1 ALG3', 2, 3, 'QCU', '2025-02-23 18:47:16', 30),
(14, 11, 10, 'Question 2 ALG3', 3, 3, 'QCM', '2025-03-09 16:11:02', 30),
(15, 11, 10, 'Question 3 ALG3', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(16, 12, 10, 'Question 1 ANAL3', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(17, 12, 10, 'Question 2 ANAL3', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(18, 12, 10, 'Question 3 ANAL3', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(19, 13, 10, 'Question 1 ARCH2', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(20, 13, 10, 'Question 2 ARCH2', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(21, 13, 10, 'Question 3 ARCH2', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(22, 14, 10, 'Question 1 SFSD', 2, 3, 'QCU', '2025-02-23 18:47:16', 30),
(23, 14, 10, 'Question 2 SFSD', 3, 3, 'QCM', '2025-03-09 16:11:02', 30),
(24, 14, 10, 'Question 3 SFSD', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(25, 17, 10, 'Question 1 PRJP', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(26, 17, 10, 'Question 2 PRJP', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(27, 17, 10, 'Question 3 PRJP', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(28, 18, 10, 'Question 1 OOE', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(29, 18, 10, 'Question 2 OOE', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(30, 18, 10, 'Question 3 OOE', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(31, 19, 10, 'Question 1 LOGM', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(32, 19, 10, 'Question 2 LOGM', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(33, 19, 10, 'Question 3 LOGM', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(34, 20, 10, 'Question 1 ANAL4', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(35, 20, 10, 'Question 2 ANAL4', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(36, 20, 10, 'Question 3 ANAL4', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(37, 21, 10, 'Question 1 SINF', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(38, 21, 10, 'Question 2 SINF', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(39, 21, 10, 'Question 3 SINF', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(40, 22, 10, 'Question 1 POO', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(41, 22, 10, 'Question 2 POO', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(42, 22, 10, 'Question 3 POO', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(43, 23, 10, 'Question 1 ANG2', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(44, 23, 10, 'Question 2 ANG2', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(45, 23, 10, 'Question 3 ANG2', 3, 4, 'QCM', '2025-03-09 16:11:28', 40),
(46, 24, 10, 'Question 1 ECON', 2, 2, 'QCU', '2025-02-23 18:47:16', 20),
(47, 24, 10, 'Question 2 ECON', 3, 4, 'QCM', '2025-03-09 16:11:02', 40),
(48, 24, 10, 'Question 3 ECON', 3, 4, 'QCM', '2025-03-09 16:11:28', 40);

-- --------------------------------------------------------

--
-- Structure de la table `quizzes`
--

CREATE TABLE `quizzes` (
  `id_quiz` int(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `correctionType` varchar(100) NOT NULL,
  `id_teacher` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'draft',
  `score` float NOT NULL,
  `for_year` int(11) DEFAULT NULL,
  `for_groupe` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `nb_attempts` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `quizzes`
--

INSERT INTO `quizzes` (`id_quiz`, `title`, `description`, `duration`, `correctionType`, `id_teacher`, `subject`, `status`, `score`, `for_year`, `for_groupe`, `created_at`, `nb_attempts`) VALUES
(9, 'PRST1', 'Probabilités et statistiques', 10, 'automatic', 11, 'subject: PRST1', 'draft', 10, 2, 9, '2025-02-23 18:46:03', 2),
(10, 'ELEF2', 'Electronique fondamentale 2', 10, 'automatic', 12, 'subject: ELEF2', 'draft', 10, 2, 9, '2025-02-25 05:55:03', 2),
(11, 'ALG3', 'Algèbre 3', 10, 'automatic', 13, 'subject: ALG3', 'draft', 10, 2, 9, '2025-02-25 05:55:18', 1),
(12, 'ANAL3', 'Analyse 3', 10, 'automatic', 14, 'subject: ANAL3', 'draft', 10, 2, 9, '2025-02-25 06:24:01', 1),
(13, 'ARCH2', 'Architecture des ordinateurs 2', 10, 'automatic', 15, 'subject: ARCH2', 'draft', 10, 2, 9, '2025-02-25 06:27:52', 2),
(14, 'SFSD', 'Structure Fichiers et Structures de Données', 10, 'automatic', 16, 'subject: SFSD', 'draft', 10, 2, 9, '2025-03-26 14:14:38', 3),
(15, 'ANG3', 'Anglais 3', 10, 'automatic', 17, 'subject: ANG3', 'draft', 10, 2, 9, '2025-03-26 14:14:38', 2),
(16, 'PRST2', 'Probabilités et Statistiques 2', 10, 'automatic', 18, 'subject: PRST2', 'draft', 10, 2, 9, '2025-03-26 14:14:38', 2),
(17, 'PRJP', 'Projet Pluridisciplinaire', 10, 'automatic', 19, 'subject: PRJP', 'draft', 10, 2, 9, '2025-03-26 14:14:38', 3),
(18, 'OOE', 'Optique et Ondes éléctromagnétiques', 10, 'automatic', 20, 'subject: OOE', 'draft', 20, 2, 9, '2025-02-25 05:55:18', 1),
(19, 'LOGM', 'Logique Mathématique', 10, 'automatic', 21, 'subject: LOGM', 'draft', 10, 2, 9, '2025-02-25 06:24:01', 1),
(20, 'ANAL4', 'Analyse 4', 10, 'automatic', 22, 'subject: ANAL4', 'draft', 10, 2, 9, '2025-02-25 06:27:52', 2),
(21, 'SINF', 'Introduction aux systèmes d’information', 10, 'automatic', 23, 'subject: SINF', 'draft', 10, 2, 9, '2025-03-26 14:14:38', 3),
(22, 'POO', 'Programmation Orientée Objet', 10, 'automatic', 24, 'subject: POO', 'draft', 10, 2, 9, '2025-03-26 14:14:38', 2),
(23, 'ANG2', 'Anglais 2', 10, 'automatic', 25, 'subject: ANG2', 'draft', 10, 2, 9, '2025-03-26 14:14:38', 2),
(24, 'ECON', 'Economie', 10, 'automatic', 26, 'subject: ECON', 'draft', 10, 2, 9, '2025-03-26 14:14:38', 3);

-- --------------------------------------------------------

--
-- Structure de la table `students`
--

CREATE TABLE `students` (
  `id_student` int(255) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `annee` int(11) NOT NULL,
  `groupe_student` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `students`
--

INSERT INTO `students` (`id_student`, `first_name`, `last_name`, `annee`, `groupe_student`, `email`, `password`, `created_at`) VALUES
(2, 'Abdelouahab', 'Meridja', 2, 9, 'ameridja@esi.dz', '$2b$10$K8x4NYV8Yf6aSwFcbJobQusLKhDal.S43S.vtRAyTAa0MOrM.nhU.', '2025-03-11 07:57:03'),
(3, 'Wassim', 'Belguenbour', 2, 9, 'wbelguenbour@gmail.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-11 08:26:31'),
(4, 'Abderrahmene', 'Hemaizia', 1, 1, 'ahemaizia@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 11:18:41'),
(5, 'Karim', 'Mohamed', 2, 9, 'kmohamed@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38'),
(6, 'Ali', 'Yacine', 1, 2, 'ayacine@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38'),
(7, 'sofiane', 'Amir', 2, 9, 'samir@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38'),
(8, 'Djamel', 'Yanis', 3, 15, 'dyanis@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38');

-- --------------------------------------------------------

--
-- Structure de la table `student_answers`
--

CREATE TABLE `student_answers` (
  `id_student_answer` int(255) NOT NULL,
  `id_attempt` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `student_answer_text` text DEFAULT NULL,
  `correct` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `teachers`
--

CREATE TABLE `teachers` (
  `id_teacher` int(255) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) CHARACTER SET big5 COLLATE big5_chinese_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `teachers`
--

INSERT INTO `teachers` (`id_teacher`, `last_name`, `first_name`, `email`, `password`, `created_at`) VALUES
(11, 'Prof1', 'prof1', 'pprof1@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(12, 'Prof2', 'Prof2', 'pprof2@example.com', '$2b$10$anotherhashedpassword', '2025-03-26 14:14:38'),
(13, 'Prof3', 'prof3', 'pprof3@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(14, 'Prof4', 'prof4', 'pprof4@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(15, 'Prof5', 'Prof5', 'pprof5@example.com', '$2b$10$anotherhashedpassword', '2025-03-26 14:14:38'),
(16, 'Prof6', 'prof6', 'pprof6@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(17, 'Prof7', 'prof7', 'pprof7@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(18, 'Prof8', 'Prof8', 'pprof8@example.com', '$2b$10$anotherhashedpassword', '2025-03-26 14:14:38'),
(19, 'Prof9', 'prof9', 'pprof9@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(20, 'Prof10', 'prof10', 'pprof10@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(21, 'Prof11', 'Prof11', 'pprof11@example.com', '$2b$10$anotherhashedpassword', '2025-03-26 14:14:38'),
(22, 'Prof12', 'prof12', 'pprof12@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(23, 'Prof13', 'prof13', 'pprof13@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(24, 'Prof14', 'prof14', 'pprof14@example.com', 'abdou2005mero', '2025-02-19 16:29:53'),
(25, 'Prof15', 'Prof15', 'pprof15@example.com', '$2b$10$anotherhashedpassword', '2025-03-26 14:14:38'),
(26, 'Prof16', 'prof16', 'pprof16@example.com', 'abdou2005mero', '2025-02-19 16:29:53');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id_answer`),
  ADD KEY `id_question` (`id_question`);

--
-- Index pour la table `attempts`
--
ALTER TABLE `attempts`
  ADD PRIMARY KEY (`id_attempt`),
  ADD KEY `id_student` (`id_student`),
  ADD KEY `id_quiz` (`id_quiz`);

--
-- Index pour la table `published_quizzes`
--
ALTER TABLE `published_quizzes`
  ADD PRIMARY KEY (`id_published`),
  ADD KEY `id_quiz` (`id_quiz`);

--
-- Index pour la table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id_question`),
  ADD KEY `id_quiz` (`id_quiz`);

--
-- Index pour la table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id_quiz`),
  ADD KEY `id_teacher` (`id_teacher`) USING BTREE;

--
-- Index pour la table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id_student`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `student_answers`
--
ALTER TABLE `student_answers`
  ADD PRIMARY KEY (`id_student_answer`),
  ADD KEY `id_attempt` (`id_attempt`),
  ADD KEY `id_question` (`id_question`);

--
-- Index pour la table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id_teacher`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `answers`
--
ALTER TABLE `answers`
  MODIFY `id_answer` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT pour la table `attempts`
--
ALTER TABLE `attempts`
  MODIFY `id_attempt` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT pour la table `published_quizzes`
--
ALTER TABLE `published_quizzes`
  MODIFY `id_published` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `questions`
--
ALTER TABLE `questions`
  MODIFY `id_question` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id_quiz` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `students`
--
ALTER TABLE `students`
  MODIFY `id_student` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `student_answers`
--
ALTER TABLE `student_answers`
  MODIFY `id_student_answer` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=430;

--
-- AUTO_INCREMENT pour la table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id_teacher` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id_question`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `attempts`
--
ALTER TABLE `attempts`
  ADD CONSTRAINT `attempts_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_2` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes` (`id_quiz`);

--
-- Contraintes pour la table `published_quizzes`
--
ALTER TABLE `published_quizzes`
  ADD CONSTRAINT `published_quizzes_ibfk_1` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes` (`id_quiz`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes` (`id_quiz`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`id_teacher`) REFERENCES `teachers` (`id_teacher`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `student_answers`
--
ALTER TABLE `student_answers`
  ADD CONSTRAINT `student_answers_ibfk_2` FOREIGN KEY (`id_attempt`) REFERENCES `attempts` (`id_attempt`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_answers_ibfk_3` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id_question`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
