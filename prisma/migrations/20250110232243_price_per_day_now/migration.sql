/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `pricePerDay` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerDay` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "pricePerDay" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "pricePerDay" DOUBLE PRECISION NOT NULL;
