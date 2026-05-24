-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'MODERADOR', 'CLIENTE');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "TipoDescuento" AS ENUM ('PORCENTAJE', 'MONTO_FIJO', 'ENVIO_GRATIS');

-- CreateEnum
CREATE TYPE "ObjetivoDescuento" AS ENUM ('TODO', 'PRODUCTOS_ESPECIFICOS', 'CATEGORIAS_ESPECIFICAS');

-- CreateEnum
CREATE TYPE "TipoVivienda" AS ENUM ('CASA', 'DEPARTAMENTO', 'OFICINA', 'LOCAL_COMERCIAL', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'PREPARANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TARJETA', 'TRANSFERENCIA', 'EFECTIVO', 'PAGO_ENTREGA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT,
    "avatar" TEXT,
    "rol" "RolUsuario" NOT NULL DEFAULT 'CLIENTE',
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'ACTIVO',
    "primerNombre" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_staff" (
    "usuarioId" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "cargo" TEXT,

    CONSTRAINT "perfiles_staff_pkey" PRIMARY KEY ("usuarioId")
);

-- CreateTable
CREATE TABLE "perfiles_clientes" (
    "usuarioId" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3),
    "puntos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "perfiles_clientes_pkey" PRIMARY KEY ("usuarioId")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" INTEGER NOT NULL,
    "precioComparacion" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imagenes" TEXT[],
    "novedad" BOOLEAN NOT NULL DEFAULT false,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descuentos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "tipo" "TipoDescuento" NOT NULL,
    "valor" INTEGER NOT NULL,
    "objetivo" "ObjetivoDescuento" NOT NULL DEFAULT 'TODO',
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "valorMinimoPedido" INTEGER,
    "limiteUso" INTEGER,
    "contadorUso" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "descuentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regiones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" TEXT NOT NULL,
    "calle" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "ciudad" TEXT,
    "codigoPostal" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "tipoVivienda" "TipoVivienda" NOT NULL DEFAULT 'CASA',
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comunaId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "usuarioId" TEXT,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "numeroPedido" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "subtotal" INTEGER NOT NULL,
    "costoEnvio" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nombreDestinatario" TEXT,
    "emailDestinatario" TEXT,
    "telefonoDestinatario" TEXT,
    "usuarioId" TEXT,
    "direccionId" TEXT NOT NULL,
    "descuentoId" TEXT,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_pedido" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,

    CONSTRAINT "items_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envios" (
    "id" TEXT NOT NULL,
    "numeroTracking" TEXT,
    "metodoEnvio" TEXT NOT NULL,
    "empresaLogistica" TEXT,
    "fechaEstimadaEntrega" TIMESTAMP(3) NOT NULL,
    "fechaEntregada" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriaToDescuento" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoriaToDescuento_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DescuentoToProducto" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DescuentoToProducto_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "usuarios_estado_idx" ON "usuarios"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_staff_rut_key" ON "perfiles_staff"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_slug_idx" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_activo_idx" ON "categorias"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "productos_slug_key" ON "productos"("slug");

-- CreateIndex
CREATE INDEX "productos_categoriaId_idx" ON "productos"("categoriaId");

-- CreateIndex
CREATE INDEX "productos_slug_idx" ON "productos"("slug");

-- CreateIndex
CREATE INDEX "productos_activo_idx" ON "productos"("activo");

-- CreateIndex
CREATE INDEX "productos_destacado_idx" ON "productos"("destacado");

-- CreateIndex
CREATE INDEX "productos_novedad_idx" ON "productos"("novedad");

-- CreateIndex
CREATE INDEX "productos_precio_idx" ON "productos"("precio");

-- CreateIndex
CREATE UNIQUE INDEX "descuentos_codigo_key" ON "descuentos"("codigo");

-- CreateIndex
CREATE INDEX "descuentos_codigo_idx" ON "descuentos"("codigo");

-- CreateIndex
CREATE INDEX "descuentos_activo_idx" ON "descuentos"("activo");

-- CreateIndex
CREATE INDEX "descuentos_fechaInicio_fechaFin_idx" ON "descuentos"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "regiones_nombre_idx" ON "regiones"("nombre");

-- CreateIndex
CREATE INDEX "comunas_regionId_idx" ON "comunas"("regionId");

-- CreateIndex
CREATE INDEX "comunas_nombre_idx" ON "comunas"("nombre");

-- CreateIndex
CREATE INDEX "direcciones_comunaId_idx" ON "direcciones"("comunaId");

-- CreateIndex
CREATE INDEX "direcciones_regionId_idx" ON "direcciones"("regionId");

-- CreateIndex
CREATE INDEX "direcciones_usuarioId_idx" ON "direcciones"("usuarioId");

-- CreateIndex
CREATE INDEX "direcciones_isDefault_idx" ON "direcciones"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_numeroPedido_key" ON "pedidos"("numeroPedido");

-- CreateIndex
CREATE INDEX "pedidos_usuarioId_idx" ON "pedidos"("usuarioId");

-- CreateIndex
CREATE INDEX "pedidos_numeroPedido_idx" ON "pedidos"("numeroPedido");

-- CreateIndex
CREATE INDEX "pedidos_estado_idx" ON "pedidos"("estado");

-- CreateIndex
CREATE INDEX "pedidos_createdAt_idx" ON "pedidos"("createdAt");

-- CreateIndex
CREATE INDEX "pedidos_descuentoId_idx" ON "pedidos"("descuentoId");

-- CreateIndex
CREATE INDEX "items_pedido_pedidoId_idx" ON "items_pedido"("pedidoId");

-- CreateIndex
CREATE INDEX "items_pedido_productoId_idx" ON "items_pedido"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "envios_pedidoId_key" ON "envios"("pedidoId");

-- CreateIndex
CREATE INDEX "envios_pedidoId_idx" ON "envios"("pedidoId");

-- CreateIndex
CREATE INDEX "envios_usuarioId_idx" ON "envios"("usuarioId");

-- CreateIndex
CREATE INDEX "envios_numeroTracking_idx" ON "envios"("numeroTracking");

-- CreateIndex
CREATE INDEX "envios_fechaEstimadaEntrega_idx" ON "envios"("fechaEstimadaEntrega");

-- CreateIndex
CREATE INDEX "_CategoriaToDescuento_B_index" ON "_CategoriaToDescuento"("B");

-- CreateIndex
CREATE INDEX "_DescuentoToProducto_B_index" ON "_DescuentoToProducto"("B");

-- AddForeignKey
ALTER TABLE "perfiles_staff" ADD CONSTRAINT "perfiles_staff_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_clientes" ADD CONSTRAINT "perfiles_clientes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunas" ADD CONSTRAINT "comunas_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_comunaId_fkey" FOREIGN KEY ("comunaId") REFERENCES "comunas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_descuentoId_fkey" FOREIGN KEY ("descuentoId") REFERENCES "descuentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToDescuento" ADD CONSTRAINT "_CategoriaToDescuento_A_fkey" FOREIGN KEY ("A") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToDescuento" ADD CONSTRAINT "_CategoriaToDescuento_B_fkey" FOREIGN KEY ("B") REFERENCES "descuentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DescuentoToProducto" ADD CONSTRAINT "_DescuentoToProducto_A_fkey" FOREIGN KEY ("A") REFERENCES "descuentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DescuentoToProducto" ADD CONSTRAINT "_DescuentoToProducto_B_fkey" FOREIGN KEY ("B") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
