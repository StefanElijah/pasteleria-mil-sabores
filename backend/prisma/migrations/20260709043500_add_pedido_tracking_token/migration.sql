-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN "trackingToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_trackingToken_key" ON "pedidos"("trackingToken");

-- CreateIndex
CREATE INDEX "pedidos_trackingToken_idx" ON "pedidos"("trackingToken");
