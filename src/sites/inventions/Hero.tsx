/**
 * The home page's illustration: a patent drawing on blueprint paper. Two
 * meshing gears for the engines, a light bulb for electricity and a chip for
 * computing — the three longest chains in the index. Drawn in the site's
 * tokens so it follows the palette.
 */
export function Hero({ className, alt }: { className?: string; alt: string }) {
  return (
    <svg viewBox="0 0 400 400" width={512} height={512} role="img" aria-label={alt} className={className}>
      <rect width="400" height="400" className="fill-surface-1" />
      <g className="stroke-line" strokeWidth="1">
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`v${i}`} x1={20 + i * 20} y1="0" x2={20 + i * 20} y2="400" />
        ))}
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={20 + i * 20} x2="400" y2={20 + i * 20} />
        ))}
      </g>
      <g fill="none" className="stroke-ink-2" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M216.00 170.00 L227.65 177.34 L226.12 187.02 L212.77 190.40 L207.16 203.00 L213.58 215.18 L207.42 222.80 L194.16 219.05 L183.00 227.16 L182.47 240.92 L173.33 244.43 L163.72 234.56 L150.00 236.00 L142.66 247.65 L132.98 246.12 L129.60 232.77 L117.00 227.16 L104.82 233.58 L97.20 227.42 L100.95 214.16 L92.84 203.00 L79.08 202.47 L75.57 193.33 L85.44 183.72 L84.00 170.00 L72.35 162.66 L73.88 152.98 L87.23 149.60 L92.84 137.00 L86.42 124.82 L92.58 117.20 L105.84 120.95 L117.00 112.84 L117.53 99.08 L126.67 95.57 L136.28 105.44 L150.00 104.00 L157.34 92.35 L167.02 93.88 L170.40 107.23 L183.00 112.84 L195.18 106.42 L202.80 112.58 L199.05 125.84 L207.16 137.00 L220.92 137.53 L224.43 146.67 L214.56 156.28 Z" />
        <circle cx="150" cy="170" r="40" />
        <circle cx="150" cy="170" r="12" />
        <path d="M303.23 106.01 L311.40 114.24 L308.00 122.25 L296.40 122.09 L288.43 130.64 L289.40 142.19 L281.65 146.15 L272.87 138.57 L261.27 139.99 L254.58 149.47 L246.10 147.51 L244.25 136.06 L234.45 129.70 L223.24 132.66 L218.00 125.71 L223.94 115.75 L220.52 104.57 L210.03 99.63 L210.48 90.94 L221.43 87.13 L226.00 76.37 L221.14 65.84 L227.07 59.48 L237.91 63.60 L248.33 58.29 L251.37 47.10 L260.00 46.04 L265.66 56.16 L277.05 58.79 L286.57 52.17 L293.87 56.91 L291.70 68.30 L298.73 77.64 L310.28 78.69 L312.83 87.01 L303.84 94.34 Z" />
        <circle cx="262" cy="98" r="9" />
        {/* the light bulb */}
        <path d="M290 330 C290 312 268 300 268 276 A32 32 0 1 1 332 276 C332 300 310 312 310 330 Z" />
        <path d="M290 338 H310 M292 346 H308 M296 354 H304" />
        <path d="M290 296 L300 278 L310 296" />
        {/* the chip */}
        <rect x="70" y="290" width="70" height="70" rx="4" />
        <rect x="88" y="308" width="34" height="34" />
        <path d="M80 290 V278 M95 290 V278 M110 290 V278 M125 290 V278 M80 360 V372 M95 360 V372 M110 360 V372 M125 360 V372 M70 300 H58 M70 315 H58 M70 330 H58 M70 345 H58 M140 300 H152 M140 315 H152 M140 330 H152 M140 345 H152" />
      </g>
      <g className="fill-action">
        <circle cx="150" cy="170" r="6" />
        <circle cx="262" cy="98" r="4" />
        <circle cx="300" cy="300" r="5" />
      </g>
      <g className="fill-ink-muted" fontFamily="var(--font-mono)" fontSize="11">
        <text x="20" y="28">FIG. 1</text>
        <text x="300" y="388">PRIOR ART</text>
      </g>
    </svg>
  );
}
