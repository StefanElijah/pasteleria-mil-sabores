-- DropForeignKey
ALTER TABLE "envios" DROP CONSTRAINT "envios_usuarioId_fkey";

-- AlterTable
ALTER TABLE "envios" ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
