import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed de base de datos...');

    // 1. Crear regiones y comunas (ejemplo mínimo)
    const regionMetropolitana = await prisma.region.upsert({
        where: { id: '1' },
        update: {},
        create: { id: '1', nombre: 'Metropolitana' },
    });
    const regionValparaiso = await prisma.region.upsert({
        where: { id: '2' },
        update: {},
        create: { id: '2', nombre: 'Valparaíso' },
    });

    await prisma.comuna.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            nombre: 'Santiago',
            regionId: regionMetropolitana.id,
        },
    });
    await prisma.comuna.upsert({
        where: { id: '2' },
        update: {},
        create: {
            id: '2',
            nombre: 'Providencia',
            regionId: regionMetropolitana.id,
        },
    });
    await prisma.comuna.upsert({
        where: { id: '3' },
        update: {},
        create: {
            id: '3',
            nombre: 'Viña del Mar',
            regionId: regionValparaiso.id,
        },
    });

    // 2. Crear categorías de productos
    const tortas = await prisma.categoria.upsert({
        where: { slug: 'tortas' },
        update: {},
        create: {
            nombre: 'Tortas',
            slug: 'tortas',
            icono: '🎂',
            activo: true,
        },
    });
    const pasteles = await prisma.categoria.upsert({
        where: { slug: 'pasteles' },
        update: {},
        create: {
            nombre: 'Pasteles',
            slug: 'pasteles',
            icono: '🍰',
            activo: true,
        },
    });
    const galletas = await prisma.categoria.upsert({
        where: { slug: 'galletas' },
        update: {},
        create: {
            nombre: 'Galletas',
            slug: 'galletas',
            icono: '🍪',
            activo: true,
        },
    });

    // 3. Crear usuario administrador (con contraseña hasheada)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.usuario.upsert({
        where: { email: 'admin@pasteleria.com' },
        update: {},
        create: {
            email: 'admin@pasteleria.com',
            password: adminPassword,
            telefono: '+56912345678',
            rol: 'ADMIN',
            estado: 'ACTIVO',
            perfilStaff: {
                create: {
                    primerNombre: 'Admin',
                    primerApellido: 'Principal',
                },
            },
        },
    });

    // 4. Crear productos de ejemplo
    const productoTortaChocolate = await prisma.producto.upsert({
        where: { slug: 'torta-chocolate' },
        update: {},
        create: {
            nombre: 'Torta de Chocolate',
            slug: 'torta-chocolate',
            descripcion: 'Deliciosa torta de chocolate con cobertura ganache',
            precio: 15990,
            stock: 10,
            imagenes: ['/images/torta-chocolate.jpg'],
            novedad: true,
            destacado: true,
            activo: true,
            categoriaId: tortas.id,
        },
    });

    const productoTortaTresLeches = await prisma.producto.upsert({
        where: { slug: 'torta-tres-leches' },
        update: {},
        create: {
            nombre: 'Torta Tres Leches',
            slug: 'torta-tres-leches',
            descripcion: 'Esponjosa torta bañada en tres leches',
            precio: 18990,
            stock: 8,
            imagenes: ['/images/torta-tres-leches.jpg'],
            novedad: true,
            destacado: true,
            activo: true,
            categoriaId: tortas.id,
        },
    });

    const productoGalletaVainilla = await prisma.producto.upsert({
        where: { slug: 'galleta-vainilla' },
        update: {},
        create: {
            nombre: 'Galleta de Vainilla',
            slug: 'galleta-vainilla',
            descripcion: 'Galletas crujientes de vainilla con chispas',
            precio: 4990,
            stock: 50,
            imagenes: ['/images/galleta-vainilla.jpg'],
            novedad: false,
            destacado: false,
            activo: true,
            categoriaId: galletas.id,
        },
    });

    console.log('✅ Seed completado exitosamente.');
    console.log(`👤 Usuario admin creado: ${admin.email} / contraseña: admin123`);
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });