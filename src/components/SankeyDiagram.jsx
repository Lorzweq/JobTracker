import { STAGES, STAGE_KEYS, STAGE_COLORS } from "../utils/helpers";

export default function SankeyDiagram({ jobs, t }) {
  const W = 820, H = 420, COL_W = 160, GAP = 8;
  const counts = {};
  STAGES.forEach(s => counts[s] = jobs.filter(j => j.stage === s).length);
  const total = jobs.length;
  if (total === 0) return <div className="sankey-empty">{t("noJobsYet")}</div>;

  const barH = (count, total, avail) => Math.max(24, (count / Math.max(total, 1)) * avail);
  const avail = H - 60;
  const apH = avail;
  const apY = 30;
  const intH = barH(counts["Interview"], total, avail);
  const intY = 30 + (avail - intH) / 2;
  const col3 = ["Offer", "Rejected", "No Response", "Scam"];
  const col3Keys = { Offer: t("offer"), Rejected: t("rejected"), "No Response": t("noresponse"), Scam: t("scam") };
  const col3Hs = col3.map(k => barH(counts[k], total, avail));
  let col3Y = 30 + (avail - col3Hs.reduce((a,b)=>a+b,0) - GAP*2) / 2;
  const col3Nodes = col3.map((k, i) => {
    const h = col3Hs[i];
    const y = col3Y;
    col3Y += h + GAP;
    return { key: k, label: col3Keys[k], h, y, count: counts[k] };
  });

  const col1X = 60, col2X = 310, col3X = 580;

  // ── Compute flow paths ────────────────────────────────────────────────
  const flows = [];

  // Applied → Interview
  if (counts["Interview"] > 0) {
    flows.push({
      x0: col1X + COL_W, y0: apY + apH * 0.3, y0b: apY + apH * 0.3 + intH,
      x1: col2X, y1: intY, y1b: intY + intH,
      color: STAGE_COLORS["Interview"],
    });
  }

  // Applied → each col3 node directly
  col3Nodes.forEach((node, i) => {
    if (node.count > 0) {
      const srcYStart = apY + apH * (0.4 + i * 0.15);
      flows.push({
        x0: col1X + COL_W, y0: srcYStart, y0b: srcYStart + node.h * 0.8,
        x1: col3X, y1: node.y, y1b: node.y + node.h,
        color: STAGE_COLORS[node.key],
        dashed: node.key === "No Response",
      });
    }
  });

  // Interview → Offer
  if (counts["Interview"] > 0 && counts["Offer"] > 0) {
    const offerNode = col3Nodes.find(n => n.key === "Offer");
    if (offerNode) {
      flows.push({
        x0: col2X + COL_W, y0: intY + intH * 0.2, y0b: intY + intH * 0.2 + offerNode.h,
        x1: col3X, y1: offerNode.y, y1b: offerNode.y + offerNode.h,
        color: STAGE_COLORS["Offer"],
      });
    }
  }

  const path = (f) => {
    const mx = (f.x0 + f.x1) / 2;
    return `M${f.x0},${f.y0} C${mx},${f.y0} ${mx},${f.y1} ${f.x1},${f.y1}
            L${f.x1},${f.y1b} C${mx},${f.y1b} ${mx},${f.y0b} ${f.x0},${f.y0b} Z`;
  };

  return (
    <div className="sankey-wrap">
      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, margin: "0 auto" }}>
          <defs>
            {STAGES.map(s => (
              <linearGradient key={s} id={`grad-${s.replace(" ", "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={STAGE_COLORS["Applied"]} stopOpacity="0.5" />
                <stop offset="100%" stopColor={STAGE_COLORS[s]} stopOpacity="0.7" />
              </linearGradient>
            ))}
          </defs>

          {/* Flow paths */}
          {flows.map((f, i) => (
            <path
              key={i}
              d={path(f)}
              fill={`url(#grad-${(col3Nodes.find(n => STAGE_COLORS[n.key] === f.color)?.key || "Applied").replace(" ", "")})`}
              opacity="0.55"
              strokeDasharray={f.dashed ? "4 3" : undefined}
            />
          ))}

          {/* Column 1: Applied */}
          <rect x={col1X} y={apY} width={COL_W} height={apH} rx="6" fill={STAGE_COLORS["Applied"]} opacity="0.85" />
          <text x={col1X + COL_W/2} y={apY+apH/2-8} textAnchor="middle" fill="var(--chart-node-text)" fontSize="13" fontWeight="600">{t("applied")}</text>
          <text x={col1X + COL_W/2} y={apY+apH/2+12} textAnchor="middle" fill="var(--chart-node-text)" fontSize="22" fontWeight="700">{total}</text>

          {/* Column 2: Interview */}
          {counts["Interview"] > 0 && (
            <>
              <rect x={col2X} y={intY} width={COL_W} height={intH} rx="6" fill={STAGE_COLORS["Interview"]} opacity="0.85" />
              <text x={col2X+COL_W/2} y={intY+intH/2-8} textAnchor="middle" fill="var(--chart-node-text)" fontSize="12" fontWeight="600">{t("interview")}</text>
              <text x={col2X+COL_W/2} y={intY+intH/2+12} textAnchor="middle" fill="var(--chart-node-text)" fontSize="20" fontWeight="700">{counts["Interview"]}</text>
            </>
          )}

          {/* Column 3: Offer / Rejected / No Response */}
          {col3Nodes.map(node => node.count > 0 && (
            <g key={node.key}>
              <rect x={col3X} y={node.y} width={COL_W} height={node.h} rx="6" fill={STAGE_COLORS[node.key]} opacity="0.85" />
              <text x={col3X+COL_W/2} y={node.y+node.h/2-8} textAnchor="middle" fill="var(--chart-node-text)" fontSize="11" fontWeight="600">{node.label}</text>
              <text x={col3X+COL_W/2} y={node.y+node.h/2+12} textAnchor="middle" fill="var(--chart-node-text)" fontSize="18" fontWeight="700">{node.count}</text>
            </g>
          ))}

          {/* Percentage labels */}
          {col3Nodes.map(node => node.count > 0 && (
            <text key={node.key + "_pct"} x={col3X + COL_W + 10} y={node.y + node.h/2 + 5}
              fill={STAGE_COLORS[node.key]} fontFamily="'DM Mono', monospace" fontSize="11" opacity="0.8">
              {Math.round(node.count / total * 100)}%
            </text>
          ))}
        </svg>
      </div>

      {/* Stats pills */}
      <div className="stats-row">
        {STAGES.map((s, idx) => (
          <div key={s} className="stat-pill" style={{ borderColor: STAGE_COLORS[s] }}>
            <span className="stat-num" style={{ color: STAGE_COLORS[s] }}>{counts[s]}</span>
            <span className="stat-label">{t(STAGE_KEYS[idx])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}