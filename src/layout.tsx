import type { ReactNode } from 'react';

export function Page({ children }: { children: ReactNode }) {
  return <main>
    <header className="masthead">
      <h1>DEX Liquidity Lab</h1>
      <p>Compare two constant-product pools and see how liquidity changes a swap quote.</p>
    </header>
    {children}
  </main>;
}

export function Metric({ label, children }: { label: string; children: ReactNode }) {
  return <div><dt>{label}</dt><dd>{children}</dd></div>;
}
