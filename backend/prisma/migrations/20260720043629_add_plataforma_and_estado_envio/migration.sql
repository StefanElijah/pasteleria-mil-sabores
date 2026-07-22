-- AlterTable
ALTER TABLE "envios" ADD COLUMN     "estadoEnvio" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "plataforma" TEXT;
