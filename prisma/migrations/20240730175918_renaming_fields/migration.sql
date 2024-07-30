/*
  Warnings:

  - You are about to drop the column `initalDeckUUID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `initalReportUUID` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "initalDeckUUID",
DROP COLUMN "initalReportUUID",
ADD COLUMN     "initialDeckUUID" TEXT,
ADD COLUMN     "initialReportUUID" TEXT;
