-- RenameForeignKey
ALTER TABLE "chats" RENAME CONSTRAINT "chats_from_fkey" TO "userfrom_fkey";

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "userto_fkey" FOREIGN KEY ("to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
