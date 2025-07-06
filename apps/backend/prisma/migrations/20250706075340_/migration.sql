/*
  Warnings:

  - Added the required column `totalRounds` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "round" INTEGER NOT NULL DEFAULT 0,
    "totalRounds" INTEGER NOT NULL,
    "guesses" INTEGER NOT NULL DEFAULT 1,
    "difficulty" TEXT NOT NULL DEFAULT 'NORMAL',
    "area" TEXT NOT NULL DEFAULT 'NORMAL'
);
INSERT INTO "new_Game" ("active", "id", "round") SELECT "active", "id", "round" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cordinates" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "area" TEXT NOT NULL
);
INSERT INTO "new_Image" ("cordinates", "id", "url") SELECT "cordinates", "id", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "connected" BOOLEAN NOT NULL DEFAULT true,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "Member_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Member_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("connected", "gameId", "id", "playerId") SELECT "connected", "gameId", "id", "playerId" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
