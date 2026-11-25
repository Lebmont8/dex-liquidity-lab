import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POOLS, quote } from '../src/model.ts';

const [shallow, deep, lowFee] = POOLS;

test('same opening price does not imply the same swap quote', () => {
  const first = quote(shallow, 10_000);
  const second = quote(deep, 10_000);
  assert.equal(first.mid, 2000);
  assert.equal(first.mid, second.mid);
  assert.ok(second.output > first.output);
  assert.ok(first.curveImpact > second.curveImpact);
});

test('fees are separated from the constant-product trade', () => {
  const input = 10_000;
  const result = quote(shallow, input);
  assert.equal(result.fee, 30);
  const adjustedX = shallow.quoteReserve + input - result.fee;
  const adjustedY = shallow.baseReserve - result.output;
  assert.ok(Math.abs(adjustedX * adjustedY - shallow.quoteReserve * shallow.baseReserve) < 1e-8);
  assert.equal(result.afterSwapMid, (shallow.quoteReserve + input) / adjustedY);
  assert.equal(quote(lowFee, input).fee, 5);
});

test('zero input and invalid input are handled', () => {
  assert.deepEqual(quote(shallow, 0), {
    fee: 0, output: 0, mid: 2000, averagePrice: null, curveImpact: 0, afterSwapMid: 2000,
  });
  for (const input of [-1, Number.NaN, Infinity]) assert.throws(() => quote(shallow, input), RangeError);
});
