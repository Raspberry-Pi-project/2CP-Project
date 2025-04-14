-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 14 avr. 2025 à 23:32
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
(1, 'Wassim', 'Belguenbour', 'test@gmail.com', '$2b$10$Zo7loWDWiwhNyTY9lKOrsOqX4lUe8cBz2NZKDgjw5lk4ydKrP.Ds.', '2025-03-11 08:09:14'),
(2, 'Abdelouahab', 'Meridja', 'test3@gmail.com', '$2b$10$XZx0n0EKyPpbWnjMlFLOz.TPpHbjNKs4VM2b00MBQ/6P4LroLv1Ji', '2025-03-22 10:00:46');

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
(2, 1, 'uhuhjhjgjhghj', 1),
(3, 1, 'kokokokok', 0),
(4, 4, 'ahs', 1),
(5, 4, 'adbyd', 0),
(6, 5, 'TRUE', 1),
(7, 5, 'FALSE', 0),
(8, 6, 'TRUE', 1),
(9, 6, 'FALSE', 0),
(10, 7, 'TRUE', 0),
(11, 7, 'FALSE', 1),
(12, 8, 'TRUE', 0),
(13, 8, 'FALSE', 1),
(14, 9, 'TRUE', 1),
(15, 9, 'FALSE', 0),
(16, 10, 'TRUE', 0),
(17, 10, 'FALSE', 1),
(18, 11, 'TRUE', 1),
(19, 11, 'FALSE', 0),
(20, 12, 'TRUE', 0),
(21, 12, 'FALSE', 1),
(22, 13, 'TRUE', 1),
(23, 13, 'FALSE', 0),
(24, 14, 'TRUE', 0),
(25, 14, 'FALSE', 1),
(26, 15, 'TRUE', 1),
(27, 15, 'FALSE', 0),
(28, 16, 'TRUE', 0),
(29, 16, 'FALSE', 1),
(30, 17, 'TRUE', 1),
(31, 17, 'FALSE', 0),
(32, 18, 'TRUE', 0),
(33, 18, 'FALSE', 1),
(34, 19, 'TRUE', 1),
(35, 19, 'FALSE', 0),
(36, 20, 'TRUE', 0),
(37, 20, 'FALSE', 1),
(38, 21, 'TRUE', 1),
(39, 21, 'FALSE', 0);

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
(1, 9, 0, 'test qst', 2, 0, 'multiChoice', '2025-02-23 18:47:16', 50),
(2, 9, 10, 'huhuhuh', 3, 1.5, 'multiChoice', '2025-03-09 16:11:02', 50),
(3, 9, 10, 'oooooo', 3, 1.5, 'multiChoice', '2025-03-09 16:11:28', 0),
(4, 14, 0, 'vsgqs', 1, 1, 'multiple-choice', '2025-04-13 12:22:52', 0),
(5, 15, 30, 'water', 1, 2, 'true-false', '2025-04-13 15:02:01', 0),
(6, 16, 30, 'water', 1, 2, 'true-false', '2025-04-13 15:05:35', 0),
(7, 16, 0, 'ddzd', 2, 1, 'true-false', '2025-04-13 15:05:35', 0),
(8, 17, 0, 'a', 1, 1, 'true-false', '2025-04-13 15:35:57', 0),
(9, 18, 0, 'hyfgygf', 1, 1, 'true-false', '2025-04-13 18:41:45', 0),
(10, 18, 0, 'dhbf', 2, 1, 'true-false', '2025-04-13 18:41:45', 0),
(11, 19, 0, 'hyfgygf', 1, 1, 'true-false', '2025-04-14 12:04:04', 0),
(12, 19, 0, 'dhbf', 2, 1, 'true-false', '2025-04-14 12:04:04', 0),
(13, 20, 0, 'hyfgygf', 1, 1, 'true-false', '2025-04-14 12:04:43', 0),
(14, 20, 0, 'dhbf', 2, 1, 'true-false', '2025-04-14 12:04:43', 0),
(15, 21, 0, 'hyfgygf', 1, 1, 'true-false', '2025-04-14 12:07:13', 0),
(16, 21, 0, 'dhbf', 2, 1, 'true-false', '2025-04-14 12:07:13', 0),
(17, 22, 0, 'hyfgygf', 1, 1, 'true-false', '2025-04-14 16:27:37', 0),
(18, 22, 0, 'dhbf', 2, 1, 'true-false', '2025-04-14 16:27:37', 0),
(19, 23, 0, 'hyfgygf', 1, 1, 'true-false', '2025-04-14 16:30:50', 0),
(20, 23, 0, 'dhbf', 2, 1, 'true-false', '2025-04-14 16:30:50', 0),
(21, 23, 0, 'ayayaya', 3, 1, 'true-false', '2025-04-14 16:30:50', 0);

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
  `nb_attempts` int(11) NOT NULL DEFAULT 1,
  `image` blob DEFAULT NULL,
  `navigation` varchar(100) NOT NULL DEFAULT 'dynamic'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `quizzes`
--

INSERT INTO `quizzes` (`id_quiz`, `title`, `description`, `duration`, `correctionType`, `id_teacher`, `subject`, `status`, `score`, `for_year`, `for_groupe`, `created_at`, `nb_attempts`, `image`, `navigation`) VALUES
(9, 'test 7', 'just a test', 0, '', 11, 'CS', 'draft', 0, 2, 9, '2025-02-23 18:46:03', 0, '', ''),
(10, 'test quiz', 'teeeeest', 0, '', 11, 'sfsd', 'draft', 0, 2, 9, '2025-02-25 05:55:03', 0, '', ''),
(11, 'test quiz', 'teeeeest', 0, '', 11, 'sfsd', 'draft', 0, NULL, NULL, '2025-02-25 05:55:18', 0, '', ''),
(12, 'test quiz', 'teeeeest', 0, '', 11, 'sfsd', 'draft', 0, NULL, NULL, '2025-02-25 06:24:01', 0, '', ''),
(13, 'test quiz', 'teeeeest', 0, '', 11, 'sfsd', 'draft', 0, NULL, NULL, '2025-02-25 06:27:52', 0, '', ''),
(14, 'hhu', 'h', 30, 'auto', 12, 'gyg', 'draft', 100, 7, 2, '2025-04-13 12:22:52', 1, '', ''),
(15, 'c', 'a', 30, 'auto', 12, 'ad', 'draft', 100, 4, 2, '2025-04-13 15:02:01', 1, '', ''),
(16, 'c', 'a', 30, 'auto', 12, 'ad', 'draft', 100, 4, 2, '2025-04-13 15:05:35', 1, '', ''),
(17, 's', 's', 30, 'auto', 12, 'a', 'published', 100, 4, 2, '2025-04-13 15:35:57', 1, '', ''),
(18, 'fefef', 'fyegfy', 30, 'auto', 12, 'efbhdf', 'draft', 100, NULL, NULL, '2025-04-13 18:41:45', 1, NULL, ''),
(19, 'fefef', 'fyegfy', 30, 'auto', 12, 'efbhdf', 'draft', 100, 2, 2, '2025-04-14 12:04:04', 1, NULL, ''),
(20, 'fefef', 'fyegfy', 30, 'auto', 12, 'efbhdf', 'draft', 100, 2, 1, '2025-04-14 12:04:43', 1, NULL, ''),
(21, 'fefef', 'fyegfy', 30, 'auto', 12, 'efbhdf', 'published', 100, 4, 4, '2025-04-14 12:07:13', 1, NULL, ''),
(22, 'fefef', 'fyegfy', 30, 'auto', 12, 'efbhdf', 'published', 100, 4, 4, '2025-04-14 16:27:37', 1, NULL, ''),
(23, 'fefef', 'fyegfy', 30, 'auto', 12, 'efbhdf', 'draft', 100, 4, 4, '2025-04-14 16:30:50', 1, NULL, '');

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
(2, 'Abdelouahab', 'Meridja', 2, 9, 'na_meridja@esi.dz', '$2b$10$K8x4NYV8Yf6aSwFcbJobQusLKhDal.S43S.vtRAyTAa0MOrM.nhU.', '2025-03-11 07:57:03'),
(3, 'Wassim', 'Belguenbour', 2, 9, 'test2@gmail.com', '$2b$10$UIKZClF88HykBlX.6x1eJOwpeMsJrX2BhCBRK8B7EIf5ffmWCcubm', '2025-03-11 08:26:31');

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
(12, 'Meridja', 'Abdelouahab', 'test4@gmail.com', '$2b$10$1Vl4dcJqJTawN70GVIjKJuTk4kMl2aBR0WMOqgnahUBFfL7WU.GDC', '2025-03-22 10:13:24');

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
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `answers`
--
ALTER TABLE `answers`
  MODIFY `id_answer` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `attempts`
--
ALTER TABLE `attempts`
  MODIFY `id_attempt` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `published_quizzes`
--
ALTER TABLE `published_quizzes`
  MODIFY `id_published` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `questions`
--
ALTER TABLE `questions`
  MODIFY `id_question` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id_quiz` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `students`
--
ALTER TABLE `students`
  MODIFY `id_student` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `student_answers`
--
ALTER TABLE `student_answers`
  MODIFY `id_student_answer` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
