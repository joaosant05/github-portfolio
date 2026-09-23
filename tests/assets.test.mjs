import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { QuaternionKeyframeTrack, VectorKeyframeTrack } from 'three';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const name of (await readdir('public/models')).filter(name => name.endsWith('.glb'))) {
  test(`${name}: optimization preserves named scene, materials and animation targets`, async () => {
    const before = (await io.read(`public/models/${name}`)).getRoot();
    const after = (await io.read(`public/models/optimized/${name}`)).getRoot();
    const names = list => list.map(item => item.getName()).sort();
    assert.deepEqual(names(after.listNodes()), names(before.listNodes()));
    assert.deepEqual(names(after.listMaterials()), names(before.listMaterials()));
    const hierarchy = root => root.listNodes().map(n => [n.getName(), n.listChildren().map(c => c.getName()),
      n.getTranslation(), n.getRotation(), n.getScale()]);
    assert.deepEqual(hierarchy(after), hierarchy(before));
    const channels = root => root.listAnimations().flatMap(a => a.listChannels().map(c => [
      a.getName(), c.getTargetNode().getName(), c.getTargetPath(), c.getSampler().getInterpolation(),
    ]));
    assert.deepEqual(channels(after), channels(before));
    const beforeChannels = before.listAnimations().flatMap(a => a.listChannels());
    const afterChannels = after.listAnimations().flatMap(a => a.listChannels());
    for (let i = 0; i < beforeChannels.length; i++) {
      const source = beforeChannels[i].getSampler();
      const output = afterChannels[i].getSampler();
      const Track = beforeChannels[i].getTargetPath() === 'rotation' ? QuaternionKeyframeTrack : VectorKeyframeTrack;
      const originalTrack = new Track('sample', source.getInput().getArray(), source.getOutput().getArray()).createInterpolant();
      const optimizedTrack = new Track('sample', output.getInput().getArray(), output.getOutput().getArray()).createInterpolant();
      const end = source.getInput().getArray().at(-1);
      assert.equal(output.getInput().getArray().at(-1), end);
      for (let sample = 0; sample <= 60; sample++) {
        const time = end * sample / 60;
        const expected = originalTrack.evaluate(time);
        const actual = optimizedTrack.evaluate(time);
        for (let axis = 0; axis < expected.length; axis++) {
          assert.ok(Math.abs(expected[axis] - actual[axis]) < 0.001, `animation changed at ${time}s`);
        }
      }
    }
    for (const mesh of after.listMeshes()) for (const primitive of mesh.listPrimitives()) {
      assert.ok(primitive.getAttribute('POSITION').getCount() > 0);
      assert.ok(primitive.getIndices().getCount() > 0);
    }
    assert.ok(!(after.listExtensionsRequired().some(e => /draco|meshopt/i.test(e.extensionName))));
  });
}

test('hero assets meet transfer and geometry budgets', async () => {
  const report = JSON.parse(await readFile('docs/asset-optimization.json', 'utf8'));
  for (const asset of report.filter(a => a.asset.startsWith('bb8'))) {
    assert.equal((await stat(`public/models/optimized/${asset.asset}`)).size, asset.afterBytes);
    const root = (await io.read(`public/models/optimized/${asset.asset}`)).getRoot();
    const triangles = root.listMeshes().reduce((sum, mesh) => sum + mesh.listPrimitives().reduce(
      (n, primitive) => n + primitive.getIndices().getCount() / 3, 0), 0);
    assert.equal(triangles, asset.afterTriangles);
    assert.ok(asset.afterTriangles < asset.beforeTriangles * 0.45);
    assert.ok(asset.afterBytes < asset.beforeBytes * 0.7);
  }
  for (const asset of report.filter(a => a.asset.startsWith('desert'))) {
    assert.equal((await stat(`public/assets/theme/${asset.asset}`)).size, asset.afterBytes);
    assert.ok(asset.afterBytes < asset.beforeBytes * 0.35);
  }
});
