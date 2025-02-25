/*
  Warnings:

  - Added the required column `first_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL;
