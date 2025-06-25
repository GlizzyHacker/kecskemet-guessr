/*
  Warnings:

  - You are about to drop the `_GameToPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `playerId` on the `Guess` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `Guess` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_GameToPlayer_B_index";

-- DropIndex
DROP INDEX "_GameToPlayer_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_GameToPlayer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL,
    "connected" BOOLEAN NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "Member_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Member_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cordinates" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "roundId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    CONSTRAINT "Guess_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guess_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("cordinates", "id", "roundId") SELECT "cordinates", "id", "roundId" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
