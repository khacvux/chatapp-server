-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "lastMessageSent" DROP NOT NULL,
ALTER COLUMN "lastMessageAt" DROP NOT NULL;
