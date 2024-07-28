-- CreateEnum
CREATE TYPE "PitchDeckProcessingStatus" AS ENUM ('PROCESSING', 'COMPLETE');

-- AlterTable
ALTER TABLE "PitchDeck" ADD COLUMN     "reportUUID" TEXT,
ADD COLUMN     "status" "PitchDeckProcessingStatus" NOT NULL DEFAULT 'PROCESSING';
