-- CreateTable
CREATE TABLE "nanny_user_favorites" (
    "id" SERIAL NOT NULL,
    "nannyId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "nanny_user_favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nanny_user_favorites" ADD CONSTRAINT "nanny_user_favorites_nannyId_fkey" FOREIGN KEY ("nannyId") REFERENCES "nannys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nanny_user_favorites" ADD CONSTRAINT "nanny_user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
