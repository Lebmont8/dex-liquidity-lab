import { useState } from 'react';
import { Metric, Page } from './layout.tsx';
import { MAX_AMOUNT, POOLS, quote } from './model.ts';
import { Plot } from './Plot.tsx';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const token = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 });
const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 });
const colors = ['#b4ed8b', '#95cafa'];

export function App() {
  const [amount, setAmount] = useState(10_000);
  const [choice, setChoice] = useState(['shallow', 'deep']);
  const pools = choice.map(id => POOLS.find(pool => pool.id === id)!);
  const quotes = pools.map(pool => quote(pool, amount));
  const points = pools.map((pool, index) => ({
    color: colors[index],
    mark: { x: amount, y: quotes[index].output },
    points: Array.from({ length: 81 }, (_, sample) => {
      const x = MAX_AMOUNT * sample / 80;
      return { x, y: quote(pool, x).output };
    }),
  }));

  function select(index: number, value: string) {
    setChoice(previous => {
      const next = [...previous];
      if (next[1 - index] === value) next[1 - index] = next[index];
      next[index] = value;
      return next;
    });
  }

  return <Page>
    <div className="panel controls" aria-label="Swap settings">
      <label>First pool
        <select value={choice[0]} onChange={event => select(0, event.target.value)}>
          {POOLS.map(pool => <option key={pool.id} value={pool.id}>{pool.name}</option>)}
        </select>
      </label>
      <label>Second pool
        <select value={choice[1]} onChange={event => select(1, event.target.value)}>
          {POOLS.map(pool => <option key={pool.id} value={pool.id}>{pool.name}</option>)}
        </select>
      </label>
      <label className="wide" htmlFor="amount">
        <span>Swap amount (USDC)<span className="value" aria-hidden="true">{usd.format(amount)}</span></span>
        <input id="amount" type="range" aria-valuetext={usd.format(amount)} min="0" max={MAX_AMOUNT} step="250" value={amount}
          onChange={event => setAmount(event.target.valueAsNumber)} />
      </label>
    </div>
    <section className="panel chart-panel" aria-labelledby="quote-chart">
      <h2 id="quote-chart">Swap output by input size</h2>
      <Plot series={points} xMax={MAX_AMOUNT} yMin={0} yMax={MAX_AMOUNT / 2000}
        xLabel="Input (USDC)" yLabel="Output (WETH)"
        description={pools.map((pool, index) => pool.name + ': ' + token.format(quotes[index].output) + ' WETH at the selected input').join('. ')}
        formatX={value => value ? '$' + value / 1000 + 'k' : '$0'}
        formatY={value => token.format(value)} />
      <div className="legend">{pools.map((pool, index) =>
        <span key={pool.id}><i aria-hidden="true" style={{ color: colors[index] }} />{pool.name}</span>)}</div>
    </section>
    <div className="cards">
      {pools.map((pool, index) => {
        const result = quotes[index];
        return <section key={pool.id} className="panel">
          <h3>{pool.name}</h3>
          <dl>
            <Metric label="WETH received">{token.format(result.output)}</Metric>
            <Metric label={'Swap fee (' + pool.feeBps + ' bp)'}>{usd.format(result.fee)}</Metric>
            <Metric label="Curve price impact (excl. fee)">{percent.format(result.curveImpact)}</Metric>
            <Metric label="Effective price / WETH">{result.averagePrice === null ? '—' : usd.format(result.averagePrice)}</Metric>
            <Metric label="Pool price after swap">{usd.format(result.afterSwapMid)}</Metric>
            <Metric label="Initial USDC reserve">{usd.format(pool.quoteReserve)}</Metric>
          </dl>
        </section>;
      })}
    </div>
    <p className="note">Synthetic WETH/USDC pools. All start at $2,000 per WETH. No wallet, network quote, or trade.</p>
  </Page>;
}
