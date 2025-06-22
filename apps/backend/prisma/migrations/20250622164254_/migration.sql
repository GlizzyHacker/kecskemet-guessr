/*
  Warnings:

  - You are about to drop the `_GameToPlayer` table. If the table is not empty, all the data it contains will be lost.

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
CREATE TABLE "_all" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_all_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_all_B_fkey" FOREIGN KEY ("B") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "round" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Game" ("id", "round") SELECT "id", "round" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gameId" INTEGER,
    CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("gameId", "id", "name") SELECT "gameId", "id", "name" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_all_AB_unique" ON "_all"("A", "B");

-- CreateIndex
CREATE INDEX "_all_B_index" ON "_all"("B");
