/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `License` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "License" DROP COLUMN "expiresAt",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "timeBalance" INTEGER NOT NULL DEFAULT 0;
