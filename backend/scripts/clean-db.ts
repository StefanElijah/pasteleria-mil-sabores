import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DELETION_ORDER = [
  { label: 'envios', countFn: () => prisma.envio.count(), deleteFn: () => prisma.envio.deleteMany() },
  { label: 'items_pedido', countFn: () => prisma.itemPedido.count(), deleteFn: () => prisma.itemPedido.deleteMany() },
  { label: 'descuentos_usos', countFn: () => prisma.descuentoUso.count(), deleteFn: () => prisma.descuentoUso.deleteMany() },
  { label: 'pedidos', countFn: () => prisma.pedido.count(), deleteFn: () => prisma.pedido.deleteMany() },
  { label: 'pedidos_borrador', countFn: () => prisma.pedidoBorrador.count(), deleteFn: () => prisma.pedidoBorrador.deleteMany() },
  { label: 'direcciones', countFn: () => prisma.direccion.count(), deleteFn: () => prisma.direccion.deleteMany() },
  { label: 'productos', countFn: () => prisma.producto.count(), deleteFn: () => prisma.producto.deleteMany() },
  { label: 'descuentos', countFn: () => prisma.descuento.count(), deleteFn: () => prisma.descuento.deleteMany() },
  { label: 'categorias', countFn: () => prisma.categoria.count(), deleteFn: () => prisma.categoria.deleteMany() },
  { label: 'comunas', countFn: () => prisma.comuna.count(), deleteFn: () => prisma.comuna.deleteMany() },
  { label: 'regiones', countFn: () => prisma.region.count(), deleteFn: () => prisma.region.deleteMany() },
] as const;

async function main() {
  const force = process.argv.includes('--force');

  console.log('\n📊 Contando registros...\n');

  const counts: Record<string, number> = {};

  counts['usuarios'] = await prisma.usuario.count();
  counts['perfiles_staff'] = await prisma.perfilStaff.count();
  counts['perfiles_clientes'] = await prisma.perfilCliente.count();

  for (const { label, countFn } of DELETION_ORDER) {
    counts[label] = await countFn();
  }

  console.log('┌─────────────────────────┬────────┐');
  console.log('│ Tabla                   │ Count  │');
  console.log('├─────────────────────────┼────────┤');

  for (const { label } of DELETION_ORDER) {
    const icon = counts[label] > 0 ? '🗑️ ' : '✅';
    console.log(`│ ${icon} ${label.padEnd(22)} │ ${String(counts[label]).padStart(6)} │`);
  }

  console.log('├─────────────────────────┼────────┤');
  console.log(`│ 🔒 usuarios (conservado) │ ${String(counts['usuarios']).padStart(6)} │`);
  console.log(`│ 🔒 perfiles_staff        │ ${String(counts['perfiles_staff']).padStart(6)} │`);
  console.log(`│ 🔒 perfiles_clientes     │ ${String(counts['perfiles_clientes']).padStart(6)} │`);
  console.log('└─────────────────────────┴────────┘');

  const totalToDelete = DELETION_ORDER.reduce((sum, { label }) => sum + (counts[label] || 0), 0);

  if (totalToDelete === 0) {
    console.log('\n✅ No hay registros para eliminar.');
    await prisma.$disconnect();
    return;
  }

  if (!force) {
    console.log(`\n💡 Modo DRY-RUN. Para eliminar ${totalToDelete} registros ejecuta:`);
    console.log('   pnpm tsx scripts/clean-db.ts --force\n');
    await prisma.$disconnect();
    return;
  }

  console.log(`\n🗑️  Eliminando ${totalToDelete} registros...\n`);

  let totalDeleted = 0;
  for (const { label, deleteFn } of DELETION_ORDER) {
    const result = await deleteFn();
    if (result.count > 0) {
      console.log(`   ✓ ${label}: ${result.count} eliminados`);
      totalDeleted += result.count;
    }
  }

  console.log(`\n✅ Limpieza completada. ${totalDeleted} registros eliminados.`);
  console.log(`🔒 Usuarios conservados: ${counts['usuarios']}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
