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
    CONSTRAINT "Guess_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("cordinates", "id", "memberId", "roundId", "score") SELECT "cordinates", "id", "memberId", "roundId", "score" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
