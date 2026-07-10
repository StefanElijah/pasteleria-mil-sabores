-- Add new states to EstadoPedido enum (PostgreSQL)
-- Non-destructive: only adds values, doesn't touch existing data
ALTER TYPE "EstadoPedido" ADD VALUE 'EN_REPARTO';
ALTER TYPE "EstadoPedido" ADD VALUE 'INTENTO_FALLIDO';
ALTER TYPE "EstadoPedido" ADD VALUE 'RETRASADO';
ALTER TYPE "EstadoPedido" ADD VALUE 'DEVUELTO';
