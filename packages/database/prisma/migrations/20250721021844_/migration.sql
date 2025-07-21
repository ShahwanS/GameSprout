/*
  Warnings:

  - You are about to drop the `GameState` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_roomId_fkey";

-- DropTable
DROP TABLE "GameState";
