/*
  Warnings:

  - You are about to drop the column `speakerDescription` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `speakerName` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `speakerProfileUrl` on the `Event` table. All the data in the column will be lost.
  - The `tags` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `Resource` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "speakerDescription",
DROP COLUMN "speakerName",
DROP COLUMN "speakerProfileUrl",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user',
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];
