-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 12 avr. 2025 à 01:37
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
(1, 1, 'Answer 1 Question 1 quiz 9', 1),
(2, 1, 'Answer 2 Question 1 quiz 9', 0),
(3, 2, 'Answer 1 Question 2 quiz 9', 1),
(4, 2, 'Answer 2 Question 2 quiz 9', 0),
(5, 2, 'Answer 3 Question 2 quiz 9', 1),
(6, 3, 'Answer 1 Question 3 quiz 9', 0),
(7, 3, 'Answer 2 Question 3 quiz 9', 1),
(8, 3, 'Answer 3 Question 3 quiz 9', 1),
(9, 4, 'Answer 1 Question 1 quiz 15', 1),
(10, 4, 'Answer 2 Question 1 quiz 15', 0),
(11, 5, 'Answer 1 Question 2 quiz 15', 1),
(12, 5, 'Answer 2 Question 2 quiz 15', 0),
(13, 6, 'Answer 1 Question 3 quiz 15', 1),
(14, 6, 'Answer 2 Question 3 quiz 15', 0),
(15, 6, 'Answer 3 Question 3 quiz 15', 1),
(16, 7, 'Answer 1 Question 1 quiz 16', 1),
(17, 8, 'Answer 1 Question 2 quiz 16', 0),
(18, 8, 'Answer 2 Question 2 quiz 16', 1),
(19, 9, 'Answer 1 Question 3 quiz 16', 0),
(20, 9, 'Answer 2 Question 3 quiz 16', 1),
(21, 9, 'Answer 3 Question 3 quiz 16', 0),
(22, 10, 'Answer 1 Question 1 quiz 10', 1),
(23, 10, 'Answer 2 Question 1 quiz 10', 0),
(24, 11, 'Answer 1 Question 2 quiz 10', 1),
(25, 11, 'Answer 2 Question 2 quiz 10', 0),
(26, 11, 'Answer 3 Question 2 quiz 10', 1),
(27, 12, 'Answer 1 Question 3 quiz 10', 0),
(28, 12, 'Answer 2 Question 3 quiz 10', 1),
(29, 12, 'Answer 3 Question 3 quiz 10', 1),
(30, 13, 'Answer 1 Question 1 quiz 11', 1),
(31, 13, 'Answer 2 Question 1 quiz 11', 0),
(32, 14, 'Answer 1 Question 2 quiz 11', 1),
(33, 14, 'Answer 2 Question 2 quiz 11', 0),
(34, 14, 'Answer 3 Question 2 quiz 11', 1),
(35, 15, 'Answer 1 Question 3 quiz 11', 0),
(36, 15, 'Answer 2 Question 3 quiz 11', 1),
(37, 15, 'Answer 3 Question 3 quiz 11', 1),
(38, 16, 'Answer 1 Question 1 quiz 12', 1),
(39, 16, 'Answer 2 Question 1 quiz 12', 0),
(40, 17, 'Answer 1 Question 2 quiz 12', 1),
(41, 17, 'Answer 2 Question 2 quiz 12', 0),
(42, 17, 'Answer 3 Question 2 quiz 12', 1),
(43, 18, 'Answer 1 Question 3 quiz 12', 0),
(44, 18, 'Answer 2 Question 3 quiz 12', 1),
(45, 18, 'Answer 3 Question 3 quiz 12', 1),
(46, 19, 'Answer 1 Question 1 quiz 13', 1),
(47, 19, 'Answer 2 Question 1 quiz 13', 0),
(48, 20, 'Answer 1 Question 2 quiz 13', 1),
(49, 20, 'Answer 2 Question 2 quiz 13', 0),
(50, 20, 'Answer 3 Question 2 quiz 13', 1),
(51, 21, 'Answer 1 Question 3 quiz 13', 0),
(52, 21, 'Answer 2 Question 3 quiz 13', 1),
(53, 21, 'Answer 3 Question 3 quiz 13', 1),
(54, 22, 'Answer 1 Question 1 quiz 14', 1),
(55, 22, 'Answer 2 Question 1 quiz 14', 0),
(56, 23, 'Answer 1 Question 2 quiz 14', 1),
(57, 23, 'Answer 2 Question 2 quiz 14', 0),
(58, 23, 'Answer 3 Question 2 quiz 14', 1),
(59, 24, 'Answer 1 Question 3 quiz 14', 0),
(60, 24, 'Answer 2 Question 3 quiz 14', 1),
(61, 24, 'Answer 3 Question 3 quiz 14', 1),
(62, 25, 'Answer 1 Question 1 quiz 17', 1),
(63, 25, 'Answer 2 Question 1 quiz 17', 0),
(64, 26, 'Answer 1 Question 2 quiz 17', 1),
(65, 26, 'Answer 2 Question 2 quiz 17', 0),
(66, 26, 'Answer 3 Question 2 quiz 17', 1),
(67, 27, 'Answer 1 Question 3 quiz 17', 0),
(68, 27, 'Answer 2 Question 3 quiz 17', 1),
(69, 27, 'Answer 3 Question 3 quiz 17', 1);

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
(1, 15, 3, '2025-03-26 14:14:38'),
(2, 15, 4, '2025-03-26 14:14:38'),
(3, 16, 0, '2025-04-09 01:31:11');

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
(1, 9, 10, 'Question 1 quiz 9', 2, 2, 'QCS', '2025-02-23 18:47:16', 20),
(2, 9, 10, 'Question 2 quiz 9', 3, 2, 'QCM', '2025-03-09 16:11:02', 40),
(3, 9, 10, 'Question 3 quiz 9', 3, 3, 'QCM', '2025-03-09 16:11:28', 40),
(4, 15, 15, 'Question 1 quiz 15', 2, 2, 'QCS', '2025-03-26 14:14:38', 20),
(5, 15, 20, 'Question 2 quiz 15', 2, 3, 'QCM', '2025-03-26 14:14:38', 40),
(6, 15, 25, 'Question 3 quiz 15', 3, 5, 'QCM', '2025-03-26 14:14:38', 40),
(7, 16, 30, 'Question 1 quiz 16', 1, 5, 'QS', '2025-03-26 14:14:38', 40),
(8, 16, 30, 'Question 2 quiz 16', 2, 5, 'QCS', '2025-03-26 14:14:38', 30),
(9, 16, 30, 'Question 3 quiz 16', 3, 5, 'QCM', '2025-03-26 14:14:38', 30),
(10, 10, 10, 'Question 1 quiz 10', 2, 2, 'QCS', '2025-02-23 18:47:16', 20),
(11, 10, 10, 'Question 2 quiz 10', 3, 2, 'QCM', '2025-03-09 16:11:02', 40),
(12, 10, 10, 'Question 3 quiz 10', 3, 3, 'QCM', '2025-03-09 16:11:28', 40),
(13, 11, 10, 'Question 1 quiz 11', 2, 2, 'QCS', '2025-02-23 18:47:16', 20),
(14, 11, 10, 'Question 2 quiz 11', 3, 2, 'QCM', '2025-03-09 16:11:02', 40),
(15, 11, 10, 'Question 3 quiz 11', 3, 3, 'QCM', '2025-03-09 16:11:28', 40),
(16, 12, 10, 'Question 1 quiz 12', 2, 2, 'QCS', '2025-02-23 18:47:16', 20),
(17, 12, 10, 'Question 2 quiz 12', 3, 2, 'QCM', '2025-03-09 16:11:02', 40),
(18, 12, 10, 'Question 3 quiz 12', 3, 3, 'QCM', '2025-03-09 16:11:28', 40),
(19, 13, 10, 'Question 1 quiz 13', 2, 2, 'QCS', '2025-02-23 18:47:16', 20),
(20, 13, 10, 'Question 2 quiz 13', 3, 2, 'QCM', '2025-03-09 16:11:02', 40),
(21, 13, 10, 'Question 3 quiz 13', 3, 3, 'QCM', '2025-03-09 16:11:28', 40),
(22, 14, 10, 'Question 1 quiz 14', 2, 2, 'QCS', '2025-02-23 18:47:16', 20),
(23, 14, 10, 'Question 2 quiz 14', 3, 2, 'QCM', '2025-03-09 16:11:02', 40),
(24, 14, 10, 'Question 3 quiz 14', 3, 3, 'QCM', '2025-03-09 16:11:28', 40),
(25, 17, 10, 'Question 1 quiz 17', 2, 2, 'QCS', '2025-02-23 18:47:16', 20),
(26, 17, 10, 'Question 2 quiz 17', 3, 2, 'QCM', '2025-03-09 16:11:02', 40),
(27, 17, 10, 'Question 3 quiz 17', 3, 3, 'QCM', '2025-03-09 16:11:28', 40);

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
(9, 'Test QUIZ 9', 'Just a test QUIZ 9', 30, 'automatic', 11, 'subject 9', 'draft', 20, 2, 9, '2025-02-23 18:46:03', 2),
(10, 'Test QUIZ 10', 'Just a test QUIZ 10', 30, 'manual', 11, 'subject 10', 'draft', 20, 2, 9, '2025-02-25 05:55:03', 2),
(11, 'Test QUIZ 11', 'Just a test QUIZ 11', 30, 'automatic', 11, 'subject 11', 'draft', 20, 2, 9, '2025-02-25 05:55:18', 1),
(12, 'Test QUIZ 12', 'Just a test QUIZ 12', 30, 'manual', 11, 'subject 12', 'draft', 20, 2, 9, '2025-02-25 06:24:01', 1),
(13, 'Test QUIZ 13', 'Just a test QUIZ 13', 30, 'automatic', 11, 'subject 13', 'draft', 20, 2, 9, '2025-02-25 06:27:52', 2),
(14, 'Test QUIZ 14', 'Just a test QUIZ 14', 30, 'automatic', 12, 'subject 14', 'draft', 20, 2, 9, '2025-03-26 14:14:38', 3),
(15, 'Test QUIZ 15', 'Just a test QUIZ 15', 30, 'automatic', 12, 'subject 15', 'draft', 20, 2, 9, '2025-03-26 14:14:38', 2),
(16, 'Test QUIZ 16', 'Just a test QUIZ 16', 30, 'manual', 11, 'subject 16', 'draft', 20, 2, 9, '2025-03-26 14:14:38', 2),
(17, 'Test QUIZ 17', 'Just a test QUIZ 17', 30, 'automatic', 12, 'subject 17', 'draft', 20, 2, 9, '2025-03-26 14:14:38', 3);

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
(4, 'Abderrahmene', 'Hemaizia', 2, 9, 'ahemaizia@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 11:18:41'),
(5, 'Karim', 'Mohamed', 2, 9, 'kmohamed@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38'),
(6, 'Ali', 'Yacine', 1, 2, 'ayacine@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38'),
(7, 'sofiane', 'Amir', 2, 9, 'samir@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38'),
(8, 'Djamel', 'Yanis', 2, 9, 'dyanis@example.com', '$2b$10$UPW1me6aI59Fp0L6qgJTbe5vtXuZc.08lKnTLMH3heOxxV67ZB0rS', '2025-03-26 14:14:38');

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
(11, 'Meridja', 'Abdelouahab', 'na_meridja@esi.dzz', 'abdou2005mero', '2025-02-19 16:29:53'),
(12, 'Dupont', 'Jean', 'jean.dupont@example.com', '$2b$10$anotherhashedpassword', '2025-03-26 14:14:38');

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
  MODIFY `id_attempt` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `published_quizzes`
--
ALTER TABLE `published_quizzes`
  MODIFY `id_published` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id_student_answer` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
