import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const OLD_FOLDER = 'pasteleria-productos';

async function main() {
  const force = process.argv.includes('--force');

  console.log(`\nBuscando assets en la carpeta "${OLD_FOLDER}/"...\n`);

  const { resources } = await cloudinary.api.resources({
    type: 'upload',
    prefix: OLD_FOLDER,
    max_results: 500,
  });

  if (!resources || resources.length === 0) {
    console.log('No se encontraron assets en esa carpeta. Nada que limpiar.');
    return;
  }

  console.log(`Se encontraron ${resources.length} assets:\n`);

  for (const r of resources) {
    console.log(`  - ${r.public_id}  (${r.resource_type}, ${(r.bytes / 1024).toFixed(1)} KB)`);
  }

  if (!force) {
    console.log(`\nModo DRY-RUN. Para eliminarlos ejecuta:`);
    console.log(`  pnpm tsx scripts/cleanup-cloudinary.ts --force\n`);
    return;
  }

  console.log(`\nEliminando ${resources.length} assets...`);

  const publicIds = resources.map((r) => r.public_id);

  const result = await cloudinary.api.delete_resources(publicIds, {
    resource_type: 'image',
  });

  const deleted = Object.entries(result.deleted || {}).filter(([, v]) => v === 'deleted');
  console.log(`Eliminados: ${deleted.length}/${publicIds.length}`);

  const partial = Object.entries(result.deleted || {}).filter(([, v]) => v !== 'deleted');
  if (partial.length > 0) {
    console.log('No se pudieron eliminar:');
    for (const [id, status] of partial) {
      console.log(`  - ${id}: ${status}`);
    }
  }

  console.log('\nLimpieza completada.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
