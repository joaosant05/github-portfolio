import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { NodeIO, PropertyType } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, resample, textureCompress, prune } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

// Keep original exports intact. No runtime geometry decoder or new network service.
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
await MeshoptSimplifier.ready;
await mkdir('public/models/optimized', { recursive: true });
const report = [];
const triangles = (document) => document.getRoot().listMeshes().reduce(
  (sum, mesh) => sum + mesh.listPrimitives().reduce(
    (n, primitive) => n + (primitive.getIndices()?.getCount() ?? primitive.getAttribute('POSITION').getCount()) / 3, 0), 0);

for (const name of (await readdir('public/models')).filter((name) => name.endsWith('.glb'))) {
  const input = `public/models/${name}`;
  const output = `public/models/optimized/${name}`;
  const document = await io.read(input);
  const before = triangles(document);
  const mobile = name === 'bb8-mobile.glb';
  const hero = name.startsWith('bb8');
  await document.transform(
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: hero ? (mobile ? 0.3 : 0.4) : 0.5,
      error: hero ? (mobile ? 0.008 : 0.003) : 0.001 }),
    resample({ cleanup: false }),
    textureCompress({ encoder: sharp, resize: [mobile ? 512 : 1024, mobile ? 512 : 1024] }),
    prune({ propertyTypes: [PropertyType.ACCESSOR, PropertyType.BUFFER], keepAttributes: true }),
  );
  // The JSX models reference names directly. Never flatten, join or prune nodes/materials.
  await io.write(output, document);
  let afterTriangles = triangles(document);
  if ((await stat(output)).size > (await stat(input)).size && triangles(document) >= before * 0.98) {
    await copyFile(input, output);
    afterTriangles = before;
  }
  report.push({ asset: name, beforeBytes: (await stat(input)).size, afterBytes: (await stat(output)).size,
    beforeTriangles: before, afterTriangles });
}

for (const name of ['desert', 'desert-mobile']) {
  const input = `public/assets/theme/${name}.jpg`;
  const output = `public/assets/theme/${name}.webp`;
  await sharp(input).webp({ quality: 85, effort: 6 }).toFile(output);
  report.push({ asset: `${name}.webp`, beforeBytes: (await stat(input)).size, afterBytes: (await stat(output)).size });
}
await writeFile('docs/asset-optimization.json', `${JSON.stringify(report, null, 2)}\n`);
console.table(report);
