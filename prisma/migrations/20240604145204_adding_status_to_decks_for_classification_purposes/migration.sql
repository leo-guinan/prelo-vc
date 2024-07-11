-- CreateEnum
CREATE TYPE "PitchDeckStatus" AS ENUM ('PENDING', 'BOOK_CALL', 'GET_INFO', 'PASS');

-- AlterTable
ALTER TABLE "PitchDeckRequest" ADD COLUMN     "status" "PitchDeckStatus" NOT NULL DEFAULT 'PENDING';
