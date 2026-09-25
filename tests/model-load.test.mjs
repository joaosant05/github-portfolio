import test from 'node:test';
import assert from 'node:assert/strict';
import { initialModelLoadState, modelLoadReducer } from '../src/utils/modelLoadState.js';

test('failed loads retry twice before showing the refresh dialog', () => {
  let state = initialModelLoadState;
  for (let i = 0; i < 3; i++) {
    state = modelLoadReducer(state, { type: 'error', attempt: i });
    assert.equal(state.status, i < 2 ? 'retrying' : 'failed');
    if (i < 2) state = modelLoadReducer(state, { type: 'retry', attempt: i });
  }
  assert.equal(state.attempt, 2);
});

test('late completion and duplicate errors cannot revive an abandoned request', () => {
  let state = modelLoadReducer(initialModelLoadState, { type: 'error', attempt: 0 });
  assert.equal(modelLoadReducer(state, { type: 'ready', attempt: 0 }), state);
  assert.equal(modelLoadReducer(state, { type: 'error', attempt: 0 }), state);
  state = modelLoadReducer(state, { type: 'retry', attempt: 0 });
  assert.equal(modelLoadReducer(state, { type: 'ready', attempt: 0 }), state);
  assert.equal(modelLoadReducer(state, { type: 'error', attempt: 0 }), state);
});

test('a recovered model gets a fresh retry budget if its context is later lost', () => {
  let state = { attempt: 2, failures: 2, status: 'loading' };
  state = modelLoadReducer(state, { type: 'ready', attempt: 2 });
  assert.equal(state.failures, 0);
  state = modelLoadReducer(state, { type: 'error', attempt: 2 });
  assert.equal(state.status, 'retrying');
  assert.equal(state.failures, 1);
});
