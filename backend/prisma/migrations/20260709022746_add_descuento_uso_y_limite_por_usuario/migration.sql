/*
  Warnings:

  - You are about to drop the column `icono` on the `categorias` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categorias" DROP COLUMN "icono";

-- AlterTable
ALTER TABLE "descuentos" ADD COLUMN     "limiteUsoPorUsuario" INTEGER;

-- CreateTable
CREATE TABLE "descuentos_usos" (
    "id" TEXT NOT NULL,
    "descuentoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "pedidoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "descuentos_usos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "descuentos_usos_descuentoId_usuarioId_idx" ON "descuentos_usos"("descuentoId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "descuentos_usos_descuentoId_usuarioId_pedidoId_key" ON "descuentos_usos"("descuentoId", "usuarioId", "pedidoId");

-- AddForeignKey
ALTER TABLE "descuentos_usos" ADD CONSTRAINT "descuentos_usos_descuentoId_fkey" FOREIGN KEY ("descuentoId") REFERENCES "descuentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descuentos_usos" ADD CONSTRAINT "descuentos_usos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descuentos_usos" ADD CONSTRAINT "descuentos_usos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
