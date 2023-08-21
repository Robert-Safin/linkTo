/*
  Warnings:

  - Added the required column `avatarPublicId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatarUrl` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "avatarPublicId" TEXT NOT NULL,
ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
