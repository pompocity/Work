import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader, Icon, Screen } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { FIN_MONTHS, financialsFor, money } from '../../data/mock.js';

const BAR = '#00897b'; // validated single-series hue (dataviz validator: passes on #EDF3FA)
const pct = (n) => `${(n * 100).toFixed(2)}%`;
const signed = (n) => (n < 0 ? `−${money(-n)}` : money(n));

/* Single-series monthly bar chart with per-bar hover tooltip. */
function RentChart({ values }) {
  const [hover, setHover] = useState(null);
  const W = 320;
  const H = 150;
  const padL = 34;
  const padB = 20;
  const max = Math.max(...values, 1);
  const top = Math.ceil(max / 1000) * 1000;
  const plotH = H - padB - 8;
  const slot = (W - padL) / values.length;
  const bw = slot - 6;
  const y = (v) => 8 + plotH - (v / top) * plotH;
  const ticks = [0, top / 2, top];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Rent collected per month, last 12 months">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W} y1={y(t)} y2={y(t)} stroke="#D4E2F0" strokeWidth="1" />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fill="#717B8A">
              {t === 0 ? '0' : `${t / 1000}k`}
            </text>
          </g>
        ))}
        {values.map((v, i) => {
          const x = padL + i * slot + 3;
          const h = Math.max(y(0) - y(v), 0);
          const r = Math.min(4, h);
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => setHover(i)}>
              <rect x={padL + i * slot} y={0} width={slot} height={H} fill="transparent" />
              {v > 0 ? (
                <path
                  d={`M${x},${y(0)} V${y(v) + r} Q${x},${y(v)} ${x + r},${y(v)} H${x + bw - r} Q${x + bw},${y(v)} ${x + bw},${y(v) + r} V${y(0)} Z`}
                  fill={BAR}
                  opacity={hover === null || hover === i ? 1 : 0.55}
                />
              ) : (
                <rect x={x} y={y(0) - 2} width={bw} height={2} rx={1} fill="#BEC9C5" />
              )}
              <text x={x + bw / 2} y={H - 6} textAnchor="middle" fontSize="9" fill={hover === i ? '#1a237e' : '#717B8A'} fontWeight={hover === i ? 700 : 400}>
                {FIN_MONTHS[i][0]}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-inverse-surface px-2.5 py-1.5 text-[11px] text-inverse-on-surface shadow-lg"
          style={{ left: `${((padL + hover * slot + slot / 2) / W) * 100}%` }}
        >
          <span className="font-bold">{FIN_MONTHS[hover]}</span> · {values[hover] > 0 ? `${money(values[hover])} collected` : 'Vacant — $0'}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, sub, tone = 'text-indigo' }) {
  return (
    <div className="rounded-xl border border-tint-border bg-white p-3">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">{label}</span>
      <span className={`block text-[20px] font-bold leading-tight ${tone}`}>{value}</span>
      {sub && <span className="block text-[11px] text-muted">{sub}</span>}
    </div>
  );
}

function PortfolioView({ properties, onOpen, repairsExtra }) {
  const rows = properties.map((p) => ({ p, f: financialsFor(p) }));
  const withF = rows.filter((r) => r.f);
  const rentRoll = properties.reduce((a, p) => a + p.rent, 0);
  const annual = withF.reduce((a, r) => a + r.f.annualRent, 0);
  const noi = withF.reduce((a, r) => a + r.f.noi, 0);
  const value = withF.reduce((a, r) => a + r.f.value, 0);
  const cash = withF.reduce((a, r) => a + r.f.cashFlow, 0);
  const repairs = withF.reduce((a, r) => a + r.f.repairsYtd, 0) + repairsExtra;
  return (
    <>
      <section className="rounded-2xl bg-indigo p-4 text-white shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">Portfolio · {properties.length} properties</span>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <span className="block text-[30px] font-bold leading-none">{money(annual)}</span>
            <span className="text-[12px] text-white/80">Projected annual revenue</span>
          </div>
          <div className="text-right">
            <span className="block text-[20px] font-bold leading-none text-primary-fixed">{pct(noi / value)}</span>
            <span className="text-[12px] text-white/80">Blended net yield</span>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="Monthly Rent Roll" value={money(rentRoll)} sub="Gross, all units" />
        <Kpi label="Monthly Cash Flow" value={signed(cash)} sub="After mortgage & opex" tone={cash < 0 ? 'text-error' : 'text-teal'} />
        <Kpi label="Net Operating Income" value={money(noi)} sub="Annual, before debt" />
        <Kpi label="Repairs YTD" value={money(repairs)} sub="All properties" />
      </div>
      <section className="card p-2">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-muted">
          <span>Property</span>
          <span className="text-right">Rent / mo</span>
          <span className="w-14 text-right">Yield</span>
        </div>
        {rows.map(({ p, f }) => (
          <button key={p.id} onClick={() => onOpen(p.id)} className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-x-3 rounded-xl px-2 py-2.5 text-left hover:bg-tint-hover">
            <span className="flex min-w-0 items-center gap-2.5">
              <img src={p.img} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold text-ink">{p.address}</span>
                <span className="block truncate text-[11px] text-muted">{f ? (f.occupied ? 'Occupied' : 'Vacant · make-ready') : 'Onboarding'}</span>
              </span>
            </span>
            <span className="text-right text-[13px] font-bold text-indigo">{money(p.rent)}</span>
            <span className="w-14 text-right text-[13px] font-bold text-teal">{f ? pct(f.capRate) : '—'}</span>
          </button>
        ))}
      </section>
    </>
  );
}

function PropertyView({ p, f, ticket, showToast }) {
  const repairExtra = p.id === 'maple' && ticket.stage === 'completed' ? ticket.vendor?.price || 0 : 0;
  const ledger = ['Oct 1', 'Sep 1', 'Aug 1', 'Jul 1'].flatMap((d, mi) =>
    p.units.map((u) => {
      const collected = f.collected[f.collected.length - 1 - mi] > 0;
      return { key: d + u.id, d, label: p.units.length > 1 ? `Unit ${u.id}` : 'Rent', amount: collected ? (p.units.length > 1 ? u.rent : f.collected[f.collected.length - 1 - mi]) : 0, bank: u.bank };
    })
  );
  return (
    <>
      <section className="card overflow-hidden">
        <div className="relative h-28">
          <img src={p.img} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-white/80">{p.area}</span>
              <h2 className="text-[20px] font-bold leading-tight">{p.address}</h2>
            </div>
            <div className="text-right">
              <span className="block text-[11px] text-white/80">Est. value</span>
              <span className="text-[17px] font-bold">{money(f.value)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2 text-[12px]">
          <span className="text-muted">
            Purchased {f.purchase.year} · {money(f.purchase.price)}
          </span>
          <span className="font-bold text-teal">+{money(f.equity)} equity</span>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <Kpi label="Monthly Rent" value={money(p.rent)} sub={f.occupied ? `${p.units.length} unit${p.units.length > 1 ? 's' : ''} leased` : 'Target · vacant'} />
        <Kpi label="Annual Revenue" value={money(f.annualRent)} sub={`${money(f.collected12)} collected (12 mo)`} />
        <Kpi label="Net Yield" value={pct(f.capRate)} sub="NOI ÷ est. value" tone="text-teal" />
        <Kpi label="Net Operating Income" value={money(f.noi)} sub="Annual, before debt" />
        <Kpi label="Monthly Cash Flow" value={signed(f.cashFlow)} sub="After mortgage & opex" tone={f.cashFlow < 0 ? 'text-error' : 'text-teal'} />
        <Kpi label="Repairs YTD" value={money(f.repairsYtd + repairExtra)} sub={repairExtra ? `Incl. ticket #${ticket.id}` : 'Paid to vendors'} />
      </div>

      <section className="card p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-[14px] font-bold text-indigo">Rent Collected</h3>
          <span className="text-[11px] text-muted">Last 12 months · tap a bar</span>
        </div>
        <RentChart values={f.collected} />
      </section>

      <section className="card p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-[14px] font-bold text-indigo">Monthly Expenses</h3>
          <span className="text-[13px] font-bold text-ink">{money(f.opexMonthly + f.mortgage)}</span>
        </div>
        <div className="flex flex-col divide-y divide-tint-border">
          {[{ label: 'Mortgage (P&I)', amount: f.mortgage, icon: 'home' }, ...f.opex].map((o) => (
            <div key={o.label} className="flex items-center justify-between py-2 text-[13px]">
              <span className="flex items-center gap-2 text-ink">
                <Icon name={o.icon} className="text-[18px] text-secondary" /> {o.label}
              </span>
              <span className="font-semibold text-ink">{money(o.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-indigo">Rent Ledger</h3>
          <button onClick={() => showToast(`Statement exported · ${p.address} 2026.pdf`, 'download')} className="flex items-center gap-1 text-[12px] font-bold text-teal">
            <Icon name="download" className="text-[16px]" /> Export
          </button>
        </div>
        <div className="flex flex-col divide-y divide-tint-border">
          {repairExtra > 0 && (
            <div className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-ink">
                Repair #{ticket.id} · {ticket.vendor?.company}
              </span>
              <span className="font-bold text-error">−{money(repairExtra)}.00</span>
            </div>
          )}
          {ledger.map((l) => (
            <div key={l.key} className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-ink">
                {l.d} · {l.label}
                {l.amount > 0 && l.bank && <span className="text-muted"> · {l.bank}</span>}
              </span>
              <span className={`font-bold ${l.amount > 0 ? 'text-teal' : 'text-muted'}`}>{l.amount > 0 ? `+${money(l.amount)}.00` : 'Vacant'}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function Financials() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, ticket, showToast } = useApp();
  const p = id ? properties.find((x) => x.id === id) : null;
  const f = p ? financialsFor(p) : null;
  const repairsExtra = ticket.stage === 'completed' ? ticket.vendor?.price || 0 : 0;

  return (
    <Screen header={<AppHeader title="Financials" back={p ? `/landlord/property/${p.id}` : '/landlord/portfolio'} />} nav="landlord">
      <div className="flex flex-col gap-3">
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
          {[{ id: null, address: 'Portfolio' }, ...properties].map((x) => {
            const active = (x.id || null) === (id || null);
            return (
              <button
                key={x.id || 'all'}
                onClick={() => navigate(x.id ? `/landlord/financials/${x.id}` : '/landlord/financials')}
                className={`flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[11px] font-bold ${active ? 'bg-indigo text-white' : 'border border-tint-border bg-tint text-on-surface-variant'}`}
              >
                {!x.id && <Icon name="pie_chart" className="text-[15px]" />}
                {x.address}
              </button>
            );
          })}
        </div>

        {!id && <PortfolioView properties={properties} repairsExtra={repairsExtra} onOpen={(pid) => navigate(`/landlord/financials/${pid}`)} />}
        {p && f && <PropertyView p={p} f={f} ticket={ticket} showToast={showToast} />}
        {id && (!p || !f) && (
          <div className="card flex flex-col items-center gap-2 p-8 text-center">
            <Icon name="query_stats" className="text-[36px] text-teal" />
            <p className="text-[14px] font-bold text-indigo">{p ? 'Financials coming soon' : 'Property not found'}</p>
            <p className="text-[12px] text-muted">Revenue and yield populate after the first rent cycle.</p>
          </div>
        )}
      </div>
    </Screen>
  );
}
