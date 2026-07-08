ALTER TABLE "productos" ADD COLUMN IF NOT EXISTS "imagenPrincipal" TEXT;

UPDATE "productos"
SET "imagenPrincipal" = imagenes[1]
WHERE "imagenPrincipal" IS NULL
  AND imagenes IS NOT NULL
  AND array_length(imagenes, 1) IS NOT NULL
  AND array_length(imagenes, 1) >= 1;

UPDATE "productos"
SET "imagenes" = imagenes[2:array_length(imagenes, 1)]
WHERE "imagenPrincipal" IS NOT NULL
  AND imagenes IS NOT NULL
  AND array_length(imagenes, 1) IS NOT NULL
  AND array_length(imagenes, 1) >= 1;
