/*
  Warnings:

  - The primary key for the `friends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `receiverId` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `friends` table. All the data in the column will be lost.
  - Added the required column `UserOneId` to the `friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserTwoId` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "userone_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "usertwo_fkey";

-- AlterTable
ALTER TABLE "friends" DROP CONSTRAINT "friends_pkey",
DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "UserOneId" INTEGER NOT NULL,
ADD COLUMN     "UserTwoId" INTEGER NOT NULL,
ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("UserOneId", "UserTwoId");

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "userone_fkey" FOREIGN KEY ("UserOneId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "usertwo_fkey" FOREIGN KEY ("UserTwoId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
