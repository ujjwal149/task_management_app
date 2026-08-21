-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignToId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignToId_fkey" FOREIGN KEY ("assignToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
