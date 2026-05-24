/*
  Warnings:

  - You are about to drop the column `email` on the `direcciones` table. All the data in the column will be lost.
  - You are about to drop the column `notas` on the `direcciones` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `direcciones` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `direcciones` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `envios` table. All the data in the column will be lost.
  - You are about to drop the column `nombreDestinatario` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaccionId]` on the table `pedidos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `primerApellidoDestinatario` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primerNombreDestinatario` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Made the column `emailDestinatario` on table `pedidos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefonoDestinatario` on table `pedidos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "direcciones" DROP CONSTRAINT "direcciones_regionId_fkey";

-- DropForeignKey
ALTER TABLE "envios" DROP CONSTRAINT "envios_usuarioId_fkey";

-- DropIndex
DROP INDEX "direcciones_regionId_idx";

-- DropIndex
DROP INDEX "envios_usuarioId_idx";

-- AlterTable
ALTER TABLE "direcciones" DROP COLUMN "email",
DROP COLUMN "notas",
DROP COLUMN "regionId",
DROP COLUMN "telefono";

-- AlterTable
ALTER TABLE "envios" DROP COLUMN "usuarioId";

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "nombreDestinatario",
ADD COLUMN     "comprobantePago" TEXT,
ADD COLUMN     "primerApellidoDestinatario" TEXT NOT NULL,
ADD COLUMN     "primerNombreDestinatario" TEXT NOT NULL,
ADD COLUMN     "transaccionId" TEXT,
ALTER COLUMN "emailDestinatario" SET NOT NULL,
ALTER COLUMN "telefonoDestinatario" SET NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "direccion";

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_transaccionId_key" ON "pedidos"("transaccionId");
