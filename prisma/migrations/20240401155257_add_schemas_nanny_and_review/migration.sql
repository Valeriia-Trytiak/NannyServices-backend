-- CreateTable
CREATE TABLE "Nanny" (
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

    CONSTRAINT "Nanny_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "nannyId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_nannyId_fkey" FOREIGN KEY ("nannyId") REFERENCES "Nanny"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
