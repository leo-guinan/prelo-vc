-- CreateTable
CREATE TABLE "ShareProfile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "passion" TEXT NOT NULL,
    "thesis" TEXT NOT NULL,
    "industries" TEXT NOT NULL,
    "checkSize" TEXT NOT NULL,

    CONSTRAINT "ShareProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShareProfile_userId_key" ON "ShareProfile"("userId");

-- AddForeignKey
ALTER TABLE "ShareProfile" ADD CONSTRAINT "ShareProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
