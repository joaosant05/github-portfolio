import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

// Read locally; emit only aggregate timings for the requested site's process.
const [, , filename, domain = 'joaosantosdev.com.br'] = process.argv;
if (!filename) throw new Error('Usage: node scripts/analyze-firefox-profile.mjs profile.json.gz [domain]');
const input = readFileSync(filename);
const profile = JSON.parse(filename.endsWith('.gz') ? gunzipSync(input) : input);
const { stackTable: stacks, frameTable: frames, funcTable: funcs, sources, stringArray: strings } = profile.shared;
const pageIDs = new Set(profile.pages.filter(p => p.url.includes(domain)).map(p => p.innerWindowID));
const threads = profile.threads.filter(t => t.processType === 'tab' && t.isMainThread && t.usedInnerWindowIDs?.some(id => pageIDs.has(id)));
const top = (map, count = 25) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, count);
const add = (map, key, value) => map.set(key, (map.get(key) ?? 0) + value);
const label = frame => {
  const func = frames.func[frame];
  const file = strings[sources.filename[funcs.source[func]]];
  return `${strings[funcs.name[func]]}${file?.includes(domain) ? ` (${file.split('/').at(-1)}:${frames.line[frame]}:${frames.column[frame]})` : ''}`;
};
for (const thread of threads) {
  const categories = new Map(), self = new Map(), inclusive = new Map();
  let active = 0;
  for (let i = 0; i < thread.samples.length; i++) {
    let stack = thread.samples.stack[i];
    if (stack === null) continue;
    const leaf = stacks.frame[stack];
    let annotated = stack;
    while (!(frames.flags[stacks.frame[annotated]] & 4) && stacks.prefixOffset[annotated]) annotated -= stacks.prefixOffset[annotated];
    const category = profile.meta.categories[frames.category[stacks.frame[annotated]]]?.name;
    add(categories, category, 1);
    if (category === 'Idle') continue;
    active++;
    add(self, label(leaf), 1);
    const visited = new Set();
    while (true) {
      visited.add(label(stacks.frame[stack]));
      const offset = stacks.prefixOffset[stack];
      if (!offset) break;
      stack -= offset;
    }
    for (const name of visited) add(inclusive, name, 1);
  }
  const markers = new Map(), counts = new Map(), longest = [], transitions = new Map();
  const m = thread.markers;
  for (let i = 0; i < m.length; i++) {
    const name = strings[m.name[i]];
    add(counts, name, 1);
    const data = m.data[i];
    if (data?.type === 'CSSTransition') {
      const target = data.Target?.match(/class="([^"]+)"/)?.[1] ?? 'other';
      const key = `${target}: ${data.property}`;
      const entry = transitions.get(key) ?? { count: 0, cancelled: 0 };
      entry.count++;
      if (data.Canceled) entry.cancelled++;
      transitions.set(key, entry);
    }
    if (m.phase[i] !== 1) continue;
    const duration = m.endTime[i] - m.startTime[i];
    add(markers, name, duration);
    if (duration > 16 && /LongTask|RefreshDriverTick|Styles|Reflow|RefreshObserver|ViewManagerFlush/.test(name)) longest.push({ name, duration, type: m.data[i]?.type });
  }
  const delay = thread.samples.eventDelay?.filter(Number.isFinite).sort((a,b)=>a-b) ?? [];
  console.log(JSON.stringify({ durationMs: thread.samples.timeDeltas.slice(1).reduce((a,b)=>a+b,0),
    cpuMs: thread.samples.threadCPUDelta.reduce((a,b)=>a+(b??0),0)/1e6,
    activeSamples: active, totalSamples: thread.samples.length, categories:top(categories), self:top(self), inclusive:top(inclusive),
    eventDelay:{p95:delay[Math.floor(delay.length*.95)],max:delay.at(-1)},
    markerDurationsMs:top(markers),markerCounts:top(counts),longest:longest.sort((a,b)=>b.duration-a.duration).slice(0,15),
    transitions: [...transitions.entries()].sort((a,b)=>b[1].count-a[1].count)
  },null,2));
}
