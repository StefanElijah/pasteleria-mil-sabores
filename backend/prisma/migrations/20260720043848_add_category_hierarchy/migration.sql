-- AlterTable
ALTER TABLE "categorias" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "ordenVisual" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "padreId" TEXT;

-- CreateIndex
CREATE INDEX "categorias_padreId_idx" ON "categorias"("padreId");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_padreId_fkey" FOREIGN KEY ("padreId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
