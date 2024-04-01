/*
  Warnings:

  - You are about to drop the `Nanny` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_nannyId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- DropTable
DROP TABLE "Nanny";

-- DropTable
DROP TABLE "Review";

-- CreateTable
CREATE TABLE "nannys" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "experience" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "kidsAge" TEXT NOT NULL,
    "pricePerHour" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "characters" TEXT[],

    CONSTRAINT "nannys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "nannyId" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_nannyId_fkey" FOREIGN KEY ("nannyId") REFERENCES "nannys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
