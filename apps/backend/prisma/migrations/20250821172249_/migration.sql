-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'USER', 'ADMIN', 'SUPERUSER');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'GUEST';
