-- AlterTable
ALTER TABLE "User" ADD COLUMN     "initalDeckUUID" TEXT,
ADD COLUMN     "initalReportUUID" TEXT;

-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deckUUID" TEXT NOT NULL,
    "reportUUID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_deckUUID_reportUUID_userId_key" ON "Connection"("deckUUID", "reportUUID", "userId");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
