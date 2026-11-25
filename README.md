# DEX Liquidity Lab

At the same initial price, a $10,000 swap does not get the same amount of WETH from a shallow pool and a deep pool. Move the trade-size slider and compare both quotes, including fee, curve impact, and the pool price after the swap.

## Run it

Node.js 24 or newer.

~~~sh
npm ci
npm run dev
~~~

Open the local URL printed by Vite. Use `npm test` to check the quote model or `npm run build` to compile the app. The production build can be served as static files.

## What the chart models

A constant-product pool starts with reserves `x` (USDC) and `y` (WETH). For a quote input `a`, the fee is removed from effective input before calculating WETH out: `y * net / (x + net)`. The post-swap price uses the full input reserve, since this model leaves the fee in the pool. Curve impact compares effective output with the initial midpoint, excluding fees; the displayed effective price includes fees.

All reserves are synthetic. There is no wallet integration, network quote, routing engine, or live execution. The browser model uses floating-point arithmetic for explanation, not on-chain settlement.
