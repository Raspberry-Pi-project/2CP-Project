-- CreateTable
CREATE TABLE `answers` (
    `id_answer` INTEGER NOT NULL AUTO_INCREMENT,
    `id_question` INTEGER NOT NULL,
    `answer_text` TEXT NOT NULL,
    `correct` INTEGER NOT NULL,

    INDEX `id_question`(`id_question`),
    PRIMARY KEY (`id_answer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attempts` (
    `id_attempt` INTEGER NOT NULL AUTO_INCREMENT,
    `id_student` INTEGER NOT NULL,
    `id_quiz` INTEGER NOT NULL,
    `score` FLOAT NOT NULL DEFAULT 0,
    `attempt_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_quiz`(`id_quiz`),
    INDEX `id_student`(`id_student`),
    PRIMARY KEY (`id_attempt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id_question` INTEGER NOT NULL AUTO_INCREMENT,
    `id_quiz` INTEGER NOT NULL,
    `duration` INTEGER NULL,
    `question_text` TEXT NOT NULL,
    `question_number` INTEGER NOT NULL,
    `points` FLOAT NOT NULL,
    `question_type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(40) NOT NULL DEFAULT 'draft',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_quiz`(`id_quiz`),
    PRIMARY KEY (`id_question`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quizzes` (
    `id_quiz` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `duration` INTEGER NULL,
    `id_teacher` INTEGER NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `score` FLOAT NOT NULL,
    `image` BLOB NULL,
    `for_year` INTEGER NULL,
    `for_groupe` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `nb_attempts` INTEGER NOT NULL DEFAULT 1,

    INDEX `id_teacher`(`id_teacher`),
    PRIMARY KEY (`id_quiz`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_answers` (
    `id_student_answer` INTEGER NOT NULL AUTO_INCREMENT,
    `id_attempt` INTEGER NOT NULL,
    `id_question` INTEGER NOT NULL,
    `student_answer_text` TEXT NULL,
    `correct` INTEGER NOT NULL,

    INDEX `id_attempt`(`id_attempt`),
    INDEX `id_question`(`id_question`),
    PRIMARY KEY (`id_student_answer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id_student` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(150) NOT NULL,
    `last_name` VARCHAR(150) NOT NULL,
    `annee` INTEGER NOT NULL,
    `groupe_student` INTEGER NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_student`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `id_teacher` INTEGER NOT NULL AUTO_INCREMENT,
    `last_name` VARCHAR(150) NOT NULL,
    `first_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_teacher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id_admin` INTEGER NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `published_quizzes` (
    `id_published` INTEGER NOT NULL AUTO_INCREMENT,
    `id_quiz` INTEGER NOT NULL,
    `student_number` INTEGER NOT NULL,
    `published_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_quiz`(`id_quiz`),
    PRIMARY KEY (`id_published`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `questions`(`id_question`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attempts` ADD CONSTRAINT `attempts_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students`(`id_student`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attempts` ADD CONSTRAINT `attempts_ibfk_2` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes`(`id_quiz`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes`(`id_quiz`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`id_teacher`) REFERENCES `teachers`(`id_teacher`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_answers` ADD CONSTRAINT `student_answers_ibfk_2` FOREIGN KEY (`id_attempt`) REFERENCES `attempts`(`id_attempt`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_answers` ADD CONSTRAINT `student_answers_ibfk_3` FOREIGN KEY (`id_question`) REFERENCES `questions`(`id_question`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `published_quizzes` ADD CONSTRAINT `published_quizzes_ibfk_1` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes`(`id_quiz`) ON DELETE CASCADE ON UPDATE CASCADE;
