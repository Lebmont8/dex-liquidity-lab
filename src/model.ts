export type Pool = {
  id: string;
  name: string;
  quoteReserve: number;
  baseReserve: number;
  feeBps: number;
};

export const MAX_AMOUNT = 40_000;
export const POOLS: Pool[] = [
  { id: 'shallow', name: 'Shallow pool', quoteReserve: 100_000, baseReserve: 50, feeBps: 30 },
  { id: 'deep', name: 'Deep pool', quoteReserve: 2_000_000, baseReserve: 1_000, feeBps: 30 },
  { id: 'low-fee', name: 'Mid-depth, low fee', quoteReserve: 450_000, baseReserve: 225, feeBps: 5 },
];

export function quote(pool: Pool, input: number) {
  const { quoteReserve, baseReserve, feeBps } = pool;
  if (!Number.isFinite(input) || input < 0) throw new RangeError('Input must be nonnegative and finite.');
  const fee = input * feeBps / 10_000;
  const net = input - fee;
  const mid = quoteReserve / baseReserve;
  const output = baseReserve * net / (quoteReserve + net);
  const averagePrice = output ? input / output : null;
  const curveImpact = net ? net / (quoteReserve + net) : 0;
  const afterSwapMid = (quoteReserve + input) / (baseReserve - output);
  return { fee, output, mid, averagePrice, curveImpact, afterSwapMid };
}
