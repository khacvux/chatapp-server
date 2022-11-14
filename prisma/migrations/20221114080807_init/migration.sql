/*
  Warnings:

  - The primary key for the `friends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserOneId` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `UserTwoId` on the `friends` table. All the data in the column will be lost.
  - Added the required column `userOneId` to the `friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userTwoId` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "userone_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "usertwo_fkey";

-- AlterTable
ALTER TABLE "friends" DROP CONSTRAINT "friends_pkey",
DROP COLUMN "UserOneId",
DROP COLUMN "UserTwoId",
ADD COLUMN     "userOneId" INTEGER NOT NULL,
ADD COLUMN     "userTwoId" INTEGER NOT NULL,
ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("userOneId", "userTwoId");

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "userone_fkey" FOREIGN KEY ("userOneId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "usertwo_fkey" FOREIGN KEY ("userTwoId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
