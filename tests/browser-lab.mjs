// Local-only Vite harness. Not an application entry point or a production feature.
const mode = new URLSearchParams(location.search).get('mode');
const originalGetContext = HTMLCanvasElement.prototype.getContext;
const contexts = new WeakSet();
const counters = new Map();
HTMLCanvasElement.prototype.getContext = function (type, ...args) {
  if (mode === 'no-webgl' && /webgl/.test(type)) return null;
  const context = originalGetContext.call(this, type, ...args);
  if (context && /webgl/.test(type) && !contexts.has(context)) {
    contexts.add(context);
    counters.set(this, 0);
    if (mode === 'context-loss') {
      setTimeout(() => context.getExtension('WEBGL_lose_context')?.loseContext(), 8000);
    }
    for (const method of ['drawElements', 'drawArrays']) {
      const original = context[method].bind(context);
      context[method] = (...params) => {
        counters.set(this, counters.get(this) + 1);
        return original(...params);
      };
    }
  }
  return context;
};

if (mode === 'slow') {
  const start = performance.now();
  const busyFrame = () => {
    const until = performance.now() + 38;
    while (performance.now() < until) { /* Synthetic CPU contention, not a GPU benchmark. */ }
    if (performance.now() - start < 45000) requestAnimationFrame(busyFrame);
  };
  requestAnimationFrame(busyFrame);
}

setInterval(() => {
  for (const [canvas, draws] of counters) {
    canvas.setAttribute('data-test-draws', String(draws));
  }
}, 250);
await import('../src/main.jsx');
