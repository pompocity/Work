import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppHeader, Icon, Screen, Sheet, Toggle } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { money } from '../../data/mock.js';

const TABS = ['Dashboard', 'Active Triage', 'Units & Tenants', 'Appliances & HVAC', 'Smart Access'];

const APPLIANCES = [
  { icon: 'mode_fan', name: 'Carrier Infinity HVAC', meta: 'Serviced Apr 2025 · Filter due Nov', ok: true },
  { icon: 'water_heater', name: 'Rheem 50gal Water Heater', meta: 'Installed 2019 · Anode check due', ok: false },
  { icon: 'kitchen', name: 'Samsung Refrigerators (x2)', meta: 'Warranty through 2027', ok: true },
  { icon: 'local_laundry_service', name: 'LG Washer / Dryer (shared)', meta: 'Lint vent cleaned Jul 2025', ok: true },
];

function AlertCard({ ticket, onDispatch, onDismiss, showToast }) {
  if (ticket.stage !== 'awaiting') {
    const done = ticket.stage === 'completed';
    return (
      <div className="card rounded-2xl border-l-4 p-4" style={{ borderLeftColor: done ? '#00695c' : '#4c56af' }}>
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${done ? 'bg-teal/10 text-teal' : 'bg-secondary-fixed text-secondary'}`}>
            <Icon name={done ? 'task_alt' : 'local_shipping'} className="text-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${done ? 'text-teal' : 'text-secondary'}`}>
              {done ? 'Resolved · Payout Released' : 'Vendor Dispatched'}
            </span>
            <h3 className="text-base font-bold leading-snug text-indigo">Water Leak Under Kitchen Sink • Unit 2B</h3>
            <p className="text-xs text-muted">
              {ticket.vendor?.company} · {ticket.vendor?.tech} · {done ? `Closed ${ticket.completedAt} · Tenant rated ${ticket.rating}★` : `ETA ${ticket.vendor?.eta}`}
            </p>
            <p className="mt-1 text-xs font-semibold text-indigo">Authorized: {money(ticket.vendor?.price || 0)}</p>
          </div>
        </div>
        {!done && (
          <button onClick={() => showToast(`Calling ${ticket.vendor?.tech}`, 'call')} className="btn-ghost mt-3 h-9 w-full text-xs">
            <Icon name="call" className="text-[16px]" /> Contact Vendor
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="card relative overflow-hidden rounded-2xl border-l-4 border-l-orange p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange">
              <Icon name="warning" className="text-[14px]" /> {ticket.urgency === 'urgent' ? 'Immediate Action' : 'Needs Review'}
            </span>
            <span className="text-xs font-medium text-muted">Reported {ticket.reportedAt}</span>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-teal-200/60 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal">
            <Icon name="smart_toy" className="text-[14px]" /> AI Triage Verified
          </span>
        </div>
        <div className="flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-base font-bold leading-snug text-indigo">Water Leak Under Kitchen Sink • Unit 2B</h3>
            <p className="text-xs text-muted">
              Tenant: <strong className="text-indigo">Sarah Miller</strong> • Sub-meter 2B registered sudden +4.8 GPH flow spike.
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-tint-border bg-white/80 px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Austin Benchmark Fee</span>
            <span className="text-sm font-bold text-indigo">$120 – $240</span>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-tint-border bg-white/70 p-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
            <Icon name="psychology" className="text-[18px]" />
          </div>
          <p className="text-xs leading-relaxed text-muted">
            <span className="font-bold text-indigo">Diagnostic Log:</span> Interactive tenant flow prompted Sarah to shut off the copper stopcock under the basin. Valve successfully sealed. Leak active on trap assembly.
            Tenant requested <strong className="text-indigo">{ticket.urgency === 'urgent' ? 'urgent dispatch' : 'standard window'}</strong> · {ticket.window}.
            {ticket.note && <> Note: “{ticket.note}”</>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button onClick={onDispatch} className="flex items-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-dark active:scale-[0.99]">
            <Icon name="plumbing" className="text-[16px]" /> Dispatch Technician
          </button>
          <button onClick={() => showToast('Calling Sarah Miller · (512) 555-0188', 'call')} className="flex items-center gap-1.5 rounded-xl border border-tint-border bg-white px-3.5 py-2.5 text-xs font-bold text-indigo hover:bg-slate-50">
            <Icon name="call" className="text-[16px]" /> Call Sarah
          </button>
          <button onClick={onDismiss} className="ml-auto rounded-xl px-3 py-2 text-xs font-semibold text-muted hover:text-indigo">
            Dismiss Flag
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PropertyPortal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, ticket, showToast, inspectionCadence, setInspectionCadence } = useApp();
  const [tab, setTab] = useState('Dashboard');
  const [dismissed, setDismissed] = useState(false);
  const [sheet, setSheet] = useState(null); // ledger | checklist | log
  const [locks, setLocks] = useState({ front: true, rear: true, garage: false });
  const [checklist, setChecklist] = useState({ hvac: true, smoke: true, plumbing: true, gutters: false });
  const [freq, setFreq] = useState(inspectionCadence);
  const p = properties.find((x) => x.id === id);
  if (!p) return <Navigate to="/landlord/portfolio" replace />;

  const isMaple = p.id === 'maple';
  const alertActive = isMaple && ticket.stage === 'awaiting';
  const showAlert = isMaple && !dismissed;
  const gross = p.units.reduce((a, u) => a + (u.vacant ? 0 : u.rent), 0);

  const alert = showAlert && (
    <AlertCard
      ticket={ticket}
      showToast={showToast}
      onDispatch={() => navigate('/landlord/dispatch')}
      onDismiss={() => {
        setDismissed(true);
        showToast('Flag dismissed · ticket stays in Triage queue', 'flag');
      }}
    />
  );

  const unitTiles = (
    <div className="flex flex-col gap-2">
      {p.units.map((u) => {
        const hot = u.hasTicket && ticket.stage !== 'completed';
        return (
          <div key={u.id} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg bg-surface-container-low p-3">
            {hot && <div className="absolute bottom-0 left-0 top-0 w-1 bg-tertiary-container" />}
            <div className="flex items-center gap-3 pl-1">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-bold ${hot ? 'bg-tertiary-container/15 text-tertiary' : 'bg-primary/10 text-primary'}`}>{u.id}</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[15px] font-semibold text-on-surface">{u.tenant}</h4>
                  {!u.vacant && <span className={`h-2 w-2 rounded-full ${hot ? 'animate-ping bg-tertiary-container' : 'bg-primary'}`} />}
                </div>
                <p className="text-[12px] text-on-surface-variant">
                  {u.beds} • {money(u.rent)}/mo
                </p>
              </div>
            </div>
            <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${u.vacant ? 'bg-secondary-fixed text-secondary' : hot ? 'bg-tertiary-container/15 text-tertiary' : 'bg-primary/10 text-primary'}`}>
              {u.vacant ? 'Vacant' : hot ? (ticket.stage === 'dispatched' ? 'Repair Active' : 'Sink Leak') : 'Healthy'}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Screen header={<AppHeader title="Property Detail" back="/landlord/portfolio" />} className="p-0">
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        {/* Estates rail */}
        <aside className="z-10 flex w-16 shrink-0 flex-col items-center gap-6 border-r border-tint-border bg-cream-dim py-4">
          <div className="flex w-full flex-col items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">Estates</span>
            {properties.map((x) => {
              const active = x.id === p.id;
              return (
                <div key={x.id} className="relative">
                  <button
                    onClick={() => {
                      setTab('Dashboard');
                      navigate(`/landlord/property/${x.id}`);
                    }}
                    title={x.address}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all active:scale-95 ${active ? 'bg-primary text-white shadow-md' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    {active ? <Icon name="apartment" fill className="text-[20px]" /> : <span className="text-[14px] font-bold">{x.short}</span>}
                  </button>
                  {active && <div className="absolute -left-2.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
                  {x.id === 'maple' && alertActive && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary-container opacity-75" />
                      <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-tertiary-container text-[9px] font-bold text-white">1</span>
                    </span>
                  )}
                </div>
              );
            })}
            <button onClick={() => navigate('/landlord/portfolio')} title="Add New Property" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-outline shadow-sm hover:bg-primary/10 hover:text-primary">
              <Icon name="add" className="text-[20px]" />
            </button>
          </div>
          <div className="h-px w-8 bg-surface-variant" />
          <div className="flex w-full flex-col items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">Triage</span>
            <button onClick={() => setTab('Active Triage')} title="Repairs" className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white text-tertiary shadow-sm hover:bg-tertiary-fixed">
              <Icon name="build" className="text-[18px]" />
              {alertActive && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-tertiary-container" />}
            </button>
            <button onClick={() => setSheet('checklist')} title="Inspections" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-secondary shadow-sm hover:bg-secondary-fixed">
              <Icon name="fact_check" className="text-[18px]" />
            </button>
            <button onClick={() => setTab('Smart Access')} title="Smart Locks" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm hover:bg-primary-fixed">
              <Icon name="vpn_key" className="text-[18px]" />
            </button>
          </div>
        </aside>

        {/* Main pane */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 px-3 py-4 pb-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/landlord/portfolio')} className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-1 text-[12px] font-semibold text-primary hover:text-primary-container">
                <Icon name="map" className="text-[16px]" /> Austin GIS Map
              </button>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase text-primary">{p.tier}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {p.units.some((u) => u.vacant) ? 'Vacant · Leasing' : '100% Occupied'}
            </span>
          </div>

          <div className="card flex flex-col gap-3 p-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <Icon name="location_on" className="text-[19px]" />
                </div>
                <h2 className="text-[22px] font-bold tracking-tight text-indigo">{p.address}</h2>
              </div>
              <p className="ml-10 mt-1 text-xs font-medium text-muted">{p.fullAddress}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Gross Monthly</span>
                <span className="text-[22px] font-bold text-teal">{money(gross || p.rent)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Net Escrow Yield</span>
                <span className="text-[22px] font-bold text-indigo">
                  {money(p.net)}
                  <span className="text-xs font-medium text-muted">/mo</span>
                </span>
              </div>
            </div>
          </div>

          <div className="no-scrollbar -mx-3 flex items-center gap-2 overflow-x-auto px-3 pb-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${tab === t ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
              >
                {t === 'Units & Tenants' ? `Units & Tenants (${p.units.length})` : t}
                {t === 'Active Triage' && alertActive && <span className="rounded-full bg-tertiary-container px-1.5 text-[10px] font-bold text-white">1</span>}
              </button>
            ))}
          </div>

          {tab === 'Dashboard' && (
            <>
              {alert}
              <div className="card flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[16px] font-semibold text-on-surface">
                    <Icon name="photo_camera" className="text-[20px] text-primary" /> Site Live Telemetry
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> 2 Devices Online
                  </span>
                </div>
                <div className="relative h-44 w-full overflow-hidden rounded-lg bg-surface-container-high">
                  <img src={p.streetImg} alt={p.address} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-[11px] font-semibold text-on-surface shadow-sm backdrop-blur">
                    <Icon name={locks.front ? 'lock' : 'lock_open'} className="text-[14px] text-primary" /> Front Entry {locks.front ? 'Locked' : 'Unlocked'}
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      <Icon name="videocam" className="text-[16px]" /> Ring Portico: Idle (Motion 3h ago)
                    </span>
                    <span className="font-mono text-white/80">98% Batt</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['thermostat', 'HVAC Avg', '71°F'],
                    ['water_drop', 'Main Press', '54 PSI'],
                    ['wifi', 'Hub Ping', '14ms'],
                  ].map(([ic, k, v]) => (
                    <div key={k} className="flex flex-col items-center rounded-lg bg-surface-container-low p-2 text-center">
                      <Icon name={ic} className="text-[18px] text-primary" />
                      <span className="mt-0.5 text-[11px] font-bold text-on-surface-variant">{k}</span>
                      <span className="text-[16px] font-bold text-on-surface">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[16px] font-semibold text-on-surface">
                    <Icon name="door_front" className="text-[20px] text-secondary" /> Property Status Pulse
                  </span>
                  <span className="text-[11px] font-bold text-on-surface-variant">Rent cycle on time</span>
                </div>
                {unitTiles}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button onClick={() => setSheet('log')} className="flex items-center justify-center gap-1 rounded-lg bg-surface-container px-2 py-2 text-[11px] font-bold text-on-surface hover:bg-surface-container-high">
                    <Icon name="build" className="text-[16px] text-tertiary" /> Log Repair
                  </button>
                  <button onClick={() => showToast('Inspection request sent to tenants', 'checklist')} className="flex items-center justify-center gap-1 rounded-lg bg-surface-container px-2 py-2 text-[11px] font-bold text-on-surface hover:bg-surface-container-high">
                    <Icon name="checklist" className="text-[16px] text-secondary" /> Inspect
                  </button>
                  <button onClick={() => setTab('Smart Access')} className="flex items-center justify-center gap-1 rounded-lg bg-surface-container px-2 py-2 text-[11px] font-bold text-on-surface hover:bg-surface-container-high">
                    <Icon name="key" className="text-[16px] text-primary" /> Share Key
                  </button>
                </div>
                <button onClick={() => setSheet('checklist')} className="group flex w-full items-center justify-between rounded-xl border border-tint-border bg-white px-3 py-2.5 text-left hover:bg-tint">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                      <Icon name="assignment_turned_in" className="text-[16px]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-snug text-indigo">Configure Periodic Inspection Checklist</p>
                      <p className="text-[10px] text-muted">Automate quarterly walk-through protocols & vendor dispatch</p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-[18px] text-muted group-hover:text-indigo" />
                </button>
              </div>

              <div className="card p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[15px] font-semibold text-on-surface">
                    <Icon name="receipt_long" className="text-[20px] text-primary" /> Rent Intake (Current Cycle)
                  </span>
                  <button onClick={() => setSheet('ledger')} className="shrink-0 text-[12px] font-semibold text-primary hover:underline">
                    Ledger →
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {p.units
                    .filter((u) => !u.vacant)
                    .map((u) => (
                      <div key={u.id} className="flex items-center justify-between rounded-lg bg-surface-container-low p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon name="check_circle" className="text-[16px]" />
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-on-surface">Unit {u.id} Autopay</p>
                            <p className="text-[12px] text-on-surface-variant">Cleared Oct 1 • {u.bank}</p>
                          </div>
                        </div>
                        <span className="text-[14px] font-bold text-primary">+{money(u.rent)}.00</span>
                      </div>
                    ))}
                  {p.units.every((u) => u.vacant) && <p className="py-2 text-center text-[12px] text-muted">No rent collected — unit in make-ready.</p>}
                </div>
              </div>
            </>
          )}

          {tab === 'Active Triage' &&
            (isMaple ? (
              <>
                {dismissed ? (
                  <AlertCard ticket={ticket} showToast={showToast} onDispatch={() => navigate('/landlord/dispatch')} onDismiss={() => showToast('Already dismissed from dashboard', 'flag')} />
                ) : (
                  alert
                )}
              </>
            ) : (
              <div className="card flex flex-col items-center gap-2 p-8 text-center">
                <Icon name="task_alt" className="text-[36px] text-teal" />
                <p className="text-[14px] font-bold text-indigo">No active tickets</p>
                <p className="text-[12px] text-muted">Tenant reports for {p.address} will appear here with AI triage.</p>
              </div>
            ))}

          {tab === 'Units & Tenants' && (
            <div className="card flex flex-col gap-3 p-4">
              {unitTiles}
              <button onClick={() => showToast('Invite code 482915 sent by SMS', 'send')} className="btn-ghost w-full">
                <Icon name="person_add" className="text-[18px]" /> Invite Tenant to Unit
              </button>
            </div>
          )}

          {tab === 'Appliances & HVAC' && (
            <div className="card flex flex-col divide-y divide-tint-border p-2">
              {APPLIANCES.map((a) => (
                <button key={a.name} onClick={() => showToast(`${a.name}: service history opened`, a.icon)} className="flex items-center gap-3 p-2.5 text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-secondary">
                    <Icon name={a.icon} className="text-[20px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-ink">{a.name}</p>
                    <p className="text-[11px] text-muted">{a.meta}</p>
                  </div>
                  <span className={`chip text-[10px] ${a.ok ? 'bg-teal/10 text-teal' : 'bg-orange/10 text-orange'}`}>{a.ok ? 'Good' : 'Due'}</span>
                </button>
              ))}
            </div>
          )}

          {tab === 'Smart Access' && (
            <div className="card flex flex-col gap-2 p-4">
              {[
                ['front', 'Front Entry · Schlage Encode'],
                ['rear', 'Rear Door · Yale Assure'],
                ['garage', 'Garage · MyQ Opener'],
              ].map(([k, label]) => (
                <div key={k} className="flex items-center justify-between rounded-xl border border-tint-border bg-white p-3">
                  <div className="flex items-center gap-2.5">
                    <Icon name={locks[k] ? 'lock' : 'lock_open'} className={`text-[20px] ${locks[k] ? 'text-teal' : 'text-orange'}`} />
                    <div>
                      <p className="text-[13px] font-bold text-ink">{label}</p>
                      <p className="text-[11px] text-muted">{locks[k] ? 'Locked' : 'Unlocked'} · 98% battery</p>
                    </div>
                  </div>
                  <Toggle
                    on={locks[k]}
                    label={label}
                    onChange={(v) => {
                      setLocks((l) => ({ ...l, [k]: v }));
                      showToast(`${label.split(' ·')[0]} ${v ? 'locked' : 'unlocked'}`, v ? 'lock' : 'lock_open');
                    }}
                  />
                </div>
              ))}
              <button onClick={() => showToast('Vendor key sent · valid today 2–6 PM', 'vpn_key')} className="btn-primary mt-1 w-full">
                <Icon name="vpn_key" className="text-[18px]" /> Share Temporary Vendor Key
              </button>
            </div>
          )}
        </div>
      </div>

      <Sheet open={sheet === 'ledger'} onClose={() => setSheet(null)} title="Ledger History" icon="receipt_long" eyebrow={p.address}>
        <div className="flex flex-col divide-y divide-tint-border">
          {['Oct 1', 'Sep 1', 'Aug 1', 'Jul 1'].flatMap((d) =>
            p.units
              .filter((u) => !u.vacant)
              .map((u) => (
                <div key={d + u.id} className="flex items-center justify-between py-2.5 text-[13px]">
                  <span className="text-ink">
                    {d} · Unit {u.id}
                  </span>
                  <span className="font-bold text-teal">+{money(u.rent)}.00</span>
                </div>
              ))
          )}
          {isMaple && ticket.stage === 'completed' && (
            <div className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-ink">Repair #{ticket.id} · {ticket.vendor?.company}</span>
              <span className="font-bold text-error">−{money(ticket.vendor?.price || 0)}.00</span>
            </div>
          )}
        </div>
      </Sheet>

      <Sheet open={sheet === 'checklist'} onClose={() => setSheet(null)} title="Inspection Checklist" icon="assignment_turned_in" eyebrow="Automation">
        {[
          ['hvac', 'HVAC filter & coil check'],
          ['smoke', 'Smoke / CO detector test'],
          ['plumbing', 'Under-sink & water heater scan'],
          ['gutters', 'Gutters & exterior drainage'],
        ].map(([k, label]) => (
          <div key={k} className="mb-2 flex items-center justify-between rounded-xl border border-tint-border bg-tint p-3">
            <span className="text-[13px] font-semibold text-indigo">{label}</span>
            <Toggle on={checklist[k]} label={label} onChange={(v) => setChecklist((c) => ({ ...c, [k]: v }))} />
          </div>
        ))}
        <label className="label mt-3">Frequency</label>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {['Monthly', 'Quarterly', 'Biannual'].map((f) => (
            <button key={f} onClick={() => setFreq(f)} className={`rounded-lg py-2 text-[12px] font-bold ${freq === f ? 'bg-indigo text-white' : 'border border-tint-border bg-white text-indigo'}`}>
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setSheet(null);
            setInspectionCadence(freq);
            showToast(`${freq} tenant video walkthrough scheduled`, 'event_available');
          }}
          className="btn-primary w-full"
        >
          Save Automation
        </button>
      </Sheet>

      <Sheet open={sheet === 'log'} onClose={() => setSheet(null)} title="Log a Repair" icon="build" eyebrow={p.address}>
        <label className="label">What needs attention?</label>
        <input className="input mb-3" placeholder="e.g. Replace porch light fixture" />
        <label className="label">Unit</label>
        <select className="input mb-4">
          {p.units.map((u) => (
            <option key={u.id}>Unit {u.id}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setSheet(null);
            showToast('Repair logged · AI matching vendors', 'build');
          }}
          className="btn-primary w-full"
        >
          Log & Get Vendor Quotes
        </button>
      </Sheet>
    </Screen>
  );
}
