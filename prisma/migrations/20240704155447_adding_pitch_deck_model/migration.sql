-- CreateTable
CREATE TABLE "PitchDeck" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "PitchDeck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PitchDeck_uuid_key" ON "PitchDeck"("uuid");

-- AddForeignKey
ALTER TABLE "PitchDeck" ADD CONSTRAINT "PitchDeck_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
