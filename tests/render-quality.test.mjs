import test from 'node:test';
import assert from 'node:assert/strict';
import { cappedDpr, createRenderQuality, sampleRenderQuality } from '../src/utils/renderQuality.js';

function samples(quality, fps, count) {
  for (let i = 0; i < count; i++) quality = sampleRenderQuality(quality, fps);
  return quality;
}

test('one stall does not lower quality; sustained slow frames do', () => {
  const original = createRenderQuality();
  const stall = samples(original, 10, 1);
  assert.equal(stall.dpr, original.dpr);
  assert.equal(samples(stall, 60, 1).slow, 0);
  assert.ok(samples(original, 25, 2).dpr < original.dpr);
});

test('persistent overload has bounded resolution and keeps animation running', () => {
  const quality = samples(createRenderQuality(), 5, 100);
  assert.equal(quality.dpr, 0.5);
  assert.equal(quality.fps, 20);
  assert.ok(quality.changes < 10);
});

test('a deliberate 30 FPS cap is not mistaken for a slow device', () => {
  const quality = samples(createRenderQuality({ fps: 30, maxDpr: 1 }), 29, 100);
  assert.equal(quality.dpr, 1);
  assert.equal(quality.fps, 30);
  assert.equal(quality.changes, 0);
});

test('recovery is slower than degradation and stops bouncing', () => {
  let quality = samples(createRenderQuality(), 20, 2);
  assert.equal(samples(quality, 60, 5).dpr, quality.dpr);
  assert.ok(samples(quality, 60, 6).dpr > quality.dpr);
  for (let i = 0; i < 12; i++) {
    quality = samples(quality, 20, 2);
    quality = samples(quality, 60, 6);
  }
  const settled = samples(quality, 60, 100);
  assert.equal(settled.dpr, quality.dpr);
});

test('a single prolonged slowdown can recover fully once the load clears', () => {
  const slow = samples(createRenderQuality(), 5, 40);
  const recovered = samples(slow, 60, 100);
  assert.equal(recovered.dpr, recovered.maxDpr);
  assert.equal(recovered.fps, recovered.maxFps);
  assert.equal(recovered.flips, 1);
});

test('4K drawing buffer stays within budget, including fractional OS scaling', () => {
  for (const [width, height, dpr] of [[3840, 2160, 1.25], [2560, 1440, 1.5], [390, 844, 1]]) {
    const capped = cappedDpr(width, height, dpr);
    assert.ok(width * height * capped ** 2 <= 1_500_001);
    assert.ok(capped <= dpr);
  }
  assert.equal(cappedDpr(0, 0, 1), 1);
});
