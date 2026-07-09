-- CreateTable
CREATE TABLE "pedidos_borrador" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "cartId" TEXT,
    "recipient" JSONB,
    "address" JSONB,
    "shippingMethod" TEXT,
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_borrador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pedidos_borrador_usuarioId_idx" ON "pedidos_borrador"("usuarioId");

-- CreateIndex
CREATE INDEX "pedidos_borrador_updatedAt_idx" ON "pedidos_borrador"("updatedAt");

-- AddForeignKey
ALTER TABLE "pedidos_borrador" ADD CONSTRAINT "pedidos_borrador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
