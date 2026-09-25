import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, Screen, Sheet } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { IMAGES, money } from '../../data/mock.js';

const FILTERS = [
  { id: 'all', icon: 'domain' },
  { id: 'austin', icon: 'location_on', label: 'Austin Metro' },
  { id: 'urgent' },
  { id: 'turnover', icon: 'swap_horiz', label: 'Turnover' },
];

function Pin({ p, alert, onClick }) {
  const inspection = p.status === 'inspection';
  const turnover = p.status === 'turnover';
  return (
    <button onClick={onClick} className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-95" style={p.pin}>
      <div className="relative flex flex-col items-center">
        {alert && (
          <span className="absolute -right-1 -top-1 z-30 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary-container opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-tertiary-container" />
          </span>
        )}
        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-lg transition-transform group-hover:scale-105 ${inspection ? 'bg-primary text-white' : 'bg-white text-on-surface'}`}>
          <Icon
            name={alert ? 'warning' : inspection ? 'verified' : turnover ? 'sync_alt' : 'home'}
            className={`text-[16px] ${alert ? 'text-error' : inspection ? 'text-primary-fixed' : turnover ? 'text-tertiary-container' : 'text-teal'}`}
          />
          <span className="text-[13px] font-semibold leading-tight">{money(p.rent)}</span>
        </div>
        <div className={`-mt-1.5 h-2.5 w-2.5 rotate-45 ${inspection ? 'bg-primary' : 'bg-white'}`} />
        <div className="mt-1 rounded bg-surface-container-highest/95 px-2 py-0.5 shadow-xs">
          <span className="text-[10px] font-bold leading-none tracking-tight text-on-surface-variant">{p.address.replace(' Ln', '')}</span>
        </div>
      </div>
    </button>
  );
}

export default function Portfolio() {
  const navigate = useNavigate();
  const { properties, ticket, addProperty, showToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [sortDesc, setSortDesc] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newProp, setNewProp] = useState({ address: '', rent: '', type: 'Single Family · 3 Bed' });
  const cardRefs = useRef({});

  const hasAlert = ticket.stage === 'awaiting';
  const urgentCount = hasAlert ? 1 : 0;
  const rentRoll = properties.reduce((a, p) => a + p.rent, 0);

  const visible = useMemo(() => {
    let list = properties.filter((p) => {
      if (filter === 'urgent') return p.id === 'maple' && hasAlert;
      if (filter === 'turnover') return p.status === 'turnover';
      return true;
    });
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => [p.address, p.area, p.type, ...p.units.map((u) => u.tenant)].join(' ').toLowerCase().includes(q) || (p.id === 'maple' && 'leak sink urgent'.includes(q)));
    }
    if (sortDesc !== null) list = [...list].sort((a, b) => (sortDesc ? b.rent - a.rent : a.rent - b.rent));
    return list;
  }, [properties, filter, query, sortDesc, hasAlert]);

  const focusCard = (id) => {
    setFilter('all');
    setQuery('');
    setTimeout(() => {
      cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlight(id);
      setTimeout(() => setHighlight(null), 2200);
    }, 50);
  };

  const mapleBanner = {
    awaiting: {
      box: 'bg-error-container/40',
      iconBox: 'bg-error text-white',
      icon: 'water_damage',
      title: 'Urgent: Kitchen Sink Leak',
      titleTone: 'text-on-error-container',
      time: '14m ago',
      body: `Unit 2B · Tenant reported moisture under main basin. Vendor dispatch ready.`,
    },
    dispatched: {
      box: 'bg-secondary-fixed/50',
      iconBox: 'bg-secondary text-white',
      icon: 'local_shipping',
      title: `Vendor En Route: ${ticket.vendor?.company}`,
      titleTone: 'text-on-secondary-fixed',
      time: ticket.approvedAt,
      body: `Unit 2B · ${ticket.vendor?.tech} · ETA ${ticket.vendor?.eta}`,
    },
    completed: {
      box: 'bg-primary/10',
      iconBox: 'bg-primary text-white',
      icon: 'task_alt',
      title: 'Repair Closed · Tenant Signed Off',
      titleTone: 'text-primary',
      time: ticket.completedAt,
      body: `Unit 2B · Kitchen sink leak resolved · payout released`,
    },
  }[ticket.stage];

  return (
    <Screen header={<AppHeader logo />} nav="landlord" className="pb-8 pt-2">
      <div className="flex flex-col gap-2 px-4">
        <div className="relative w-full rounded-xl border border-tint-border bg-tint shadow-sm">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-outline" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search units, tenants, or alerts in Central Texas..." className="h-11 w-full rounded-xl bg-transparent pl-10 pr-10 text-[14px] text-on-surface placeholder:text-outline focus:outline-none" />
          <button onClick={() => (query ? setQuery('') : setFilter('all'))} className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center rounded-lg p-1 text-on-surface-variant hover:text-primary" aria-label="Clear">
            <Icon name={query ? 'close' : 'tune'} className="text-[18px]" />
          </button>
        </div>
        <div className="no-scrollbar -mx-4 flex items-center gap-1.5 overflow-x-auto px-4 py-0.5">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            if (f.id === 'urgent')
              return (
                <button key={f.id} onClick={() => setFilter('urgent')} className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11px] font-bold transition-all ${active ? 'bg-error text-white' : 'bg-error-container text-on-error-container'}`}>
                  <span className="relative flex h-2 w-2">
                    {urgentCount > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-70" />}
                    <span className={`relative h-2 w-2 rounded-full ${active ? 'bg-white' : 'bg-error'}`} />
                  </span>
                  Priority Alerts ({urgentCount} Urgent)
                </button>
              );
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11px] font-bold transition-all ${active ? 'bg-indigo text-white shadow-sm' : 'border border-tint-border bg-tint text-on-surface-variant hover:bg-tint-hover'}`}>
                <Icon name={f.icon} className="text-[15px]" />
                {f.label || `All ${properties.length} Properties`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="mt-1 px-4">
        <div className="relative h-[330px] w-full overflow-hidden rounded-xl bg-surface-container shadow-md">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500" style={{ backgroundImage: `url('${IMAGES.map}')`, transform: `scale(${zoom})` }} />
          <div className="pointer-events-none absolute inset-0 bg-surface/35 backdrop-blur-[1.5px]" />
          <div className="absolute left-3 right-3 top-3 z-30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-md">
              <Icon name="explore" className="text-[16px] text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface">Austin · Central TX Hub</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-white/90 p-1 shadow-sm backdrop-blur-md">
              <button onClick={() => setZoom((z) => Math.min(z + 0.25, 2))} className="flex h-7 w-7 items-center justify-center rounded hover:bg-surface-container-high" aria-label="Zoom in">
                <Icon name="add" className="text-[18px]" />
              </button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.25, 1))} className="flex h-7 w-7 items-center justify-center rounded hover:bg-surface-container-high" aria-label="Zoom out">
                <Icon name="remove" className="text-[18px]" />
              </button>
              <button onClick={() => setZoom(1)} className="flex h-7 w-7 items-center justify-center rounded hover:bg-surface-container-high" title="Fit All Units">
                <Icon name="crop_free" className="text-[16px]" />
              </button>
            </div>
          </div>
          {properties
            .filter((p) => p.pin)
            .map((p) => (
              <Pin key={p.id} p={p} alert={p.id === 'maple' && hasAlert} onClick={() => focusCard(p.id)} />
            ))}
          <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between rounded-lg bg-white/95 p-2 shadow-sm backdrop-blur-md">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-container" />
              <span className="truncate text-[11px] text-on-surface-variant">Tap a property marker to inspect unit status</span>
            </div>
            <button onClick={() => focusCard(properties[0].id)} className="flex shrink-0 items-center text-[11px] font-bold text-primary hover:underline">
              Portfolio ({properties.length}) <Icon name="arrow_forward" className="text-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Rollup stats */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 px-4">
        <div className="card rounded-xl p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Rent Roll</span>
            <Icon name="payments" className="text-[14px] text-primary" />
          </div>
          <span className="mt-1 block text-[22px] font-bold text-on-surface">${(rentRoll / 1000).toFixed(1)}k</span>
          <span className="block text-[11px] text-on-surface-variant">/ month gross</span>
        </div>
        <div className="card rounded-xl p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Occupancy</span>
            <Icon name="pie_chart" className="text-[14px] text-primary" />
          </div>
          <span className="mt-1 block text-[22px] font-bold text-primary">100%</span>
          <span className="block text-[11px] text-on-surface-variant">4 of 4 doors filled</span>
        </div>
        <button onClick={() => (hasAlert ? navigate('/landlord/dispatch') : navigate('/landlord/triage'))} className="card rounded-xl p-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${hasAlert ? 'text-error' : 'text-primary'}`}>{hasAlert ? 'Alert' : 'Triage'}</span>
            <Icon name={hasAlert ? 'error_outline' : 'check_circle'} className={`text-[14px] ${hasAlert ? 'text-error' : 'text-primary'}`} />
          </div>
          <span className={`mt-1 block text-[22px] font-bold ${hasAlert ? 'text-error' : 'text-primary'}`}>{hasAlert ? '1 Urgent' : 'All Clear'}</span>
          <span className="block text-[11px] text-on-surface-variant">{hasAlert ? 'Triage pending' : ticket.stage === 'dispatched' ? '1 vendor en route' : 'No open tickets'}</span>
        </button>
      </div>

      {/* Property cards */}
      <div className="mt-6 flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-indigo">Managed Units</h2>
            <p className="text-[12px] text-on-surface-variant">Real-time status, rents, and active tickets</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-1 rounded-lg bg-indigo px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs active:scale-95">
              <Icon name="add" className="text-[16px]" /> Add
            </button>
            <button onClick={() => setSortDesc((s) => (s === null ? true : !s))} className="flex items-center gap-1 rounded-lg border border-tint-border bg-tint px-2.5 py-1.5 text-xs font-semibold text-teal">
              <Icon name="swap_vert" className="text-[16px]" /> {sortDesc === null ? 'Sort' : sortDesc ? 'Rent ↓' : 'Rent ↑'}
            </button>
          </div>
        </div>

        {visible.length === 0 && <p className="card p-6 text-center text-[13px] text-muted">No properties match this view.</p>}

        {visible.map((p) => {
          const isMaple = p.id === 'maple';
          return (
            <article key={p.id} ref={(el) => (cardRefs.current[p.id] = el)} className={`card overflow-hidden rounded-xl transition-all duration-300 ${highlight === p.id ? 'scale-[1.01] ring-4 ring-primary/25' : ''}`}>
              <div className="relative h-36 w-full overflow-hidden">
                <img src={p.img} alt={p.address} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30" />
                <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                  {isMaple && hasAlert && (
                    <span className="flex items-center gap-1 rounded-full bg-error-container px-2 py-0.5 text-[11px] font-bold text-on-error-container">
                      <span className="h-1.5 w-1.5 rounded-full bg-error" /> 1 Action Req
                    </span>
                  )}
                  {p.status === 'inspection' && (
                    <span className="flex items-center gap-1 rounded-full bg-primary-fixed px-2 py-0.5 text-[11px] font-bold text-on-primary-fixed">
                      <Icon name="verified_user" className="text-[13px]" /> In Inspection
                    </span>
                  )}
                  {p.status === 'turnover' && (
                    <span className="flex items-center gap-1 rounded-full bg-secondary-fixed px-2 py-0.5 text-[11px] font-bold text-on-secondary-fixed">
                      <Icon name="handyman" className="text-[13px]" /> Make-Ready Day 3
                    </span>
                  )}
                  <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-on-surface backdrop-blur-md">{p.type}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-white/80">{p.area}</span>
                    <h3 className="font-serif text-[24px] font-medium leading-none drop-shadow-sm">{p.address}</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-[24px] font-semibold leading-none">{money(p.rent)}</span>
                    <span className="block text-[11px] text-white/85">{p.rentLabel}</span>
                  </div>
                </div>
              </div>

              {isMaple && mapleBanner && (
                <div className={`flex items-start gap-2.5 p-2 ${mapleBanner.box}`}>
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${mapleBanner.iconBox}`}>
                    <Icon name={mapleBanner.icon} className="text-[16px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`truncate text-[11px] font-bold ${mapleBanner.titleTone}`}>{mapleBanner.title}</span>
                      <span className="shrink-0 text-[10px] text-on-surface-variant">{mapleBanner.time}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[12px] text-on-surface-variant">{mapleBanner.body}</p>
                  </div>
                </div>
              )}
              {p.status === 'inspection' && (
                <div className="flex items-center justify-between bg-primary/10 p-2">
                  <span className="flex items-center gap-2 text-[12px] font-medium text-on-surface">
                    <Icon name="checklist" className="text-[18px] text-primary" /> Biannual HVAC & Safety Audit in progress
                  </span>
                  <span className="text-[11px] font-bold text-primary">85% Complete</span>
                </div>
              )}
              {p.status === 'turnover' && (
                <div className="flex flex-col gap-1 border-b border-tint-border bg-tint-deep p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-on-surface">Turnover Schedule: Paint & Flooring</span>
                    <span className="text-[11px] font-bold text-secondary">2 Days Left</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full w-[60%] rounded-full bg-secondary" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 p-3 pt-2">
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {(isMaple
                    ? [...p.metrics, { label: 'Health', value: hasAlert ? 'Needs Triage' : ticket.stage === 'dispatched' ? 'Repair Active' : 'Healthy', tone: hasAlert ? 'text-error' : 'text-teal' }]
                    : p.metrics
                  ).map((m) => (
                    <div key={m.label} className="rounded-lg border border-tint-border bg-tint-light px-1 py-1.5">
                      <span className="block text-[10px] uppercase text-on-surface-variant">{m.label}</span>
                      <span className={`text-[12px] font-semibold ${m.tone || 'text-on-surface'}`}>{m.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {isMaple && hasAlert ? (
                    <button onClick={() => navigate('/landlord/property/maple')} className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-tertiary text-[14px] font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.98]">
                      Resolve Ticket & Portal <Icon name="arrow_forward" className="text-[18px]" />
                    </button>
                  ) : (
                    <button onClick={() => navigate(`/landlord/property/${p.id}`)} className="btn-primary h-11 flex-1">
                      Enter Property Portal <Icon name="arrow_forward" className="text-[18px]" />
                    </button>
                  )}
                  <button
                    onClick={() => showToast(isMaple ? 'Calling Sarah Miller · Unit 2B' : p.status === 'turnover' ? '6 showings scheduled this week' : 'Audit checklist: 17 of 20 items passed', isMaple ? 'call' : 'info')}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-low text-secondary hover:bg-surface-container"
                    aria-label="Quick action"
                  >
                    <Icon name={isMaple ? 'call' : p.status === 'turnover' ? 'calendar_month' : 'assignment'} className="text-[20px]" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title="Add Property" icon="add_home" eyebrow="Portfolio">
        <label className="label">Street address</label>
        <input value={newProp.address} onChange={(e) => setNewProp({ ...newProp, address: e.target.value })} placeholder="e.g. 17 Barton Hills Dr" className="input mb-3" />
        <label className="label">Monthly rent</label>
        <input value={newProp.rent} onChange={(e) => setNewProp({ ...newProp, rent: e.target.value.replace(/\D/g, '') })} placeholder="2400" inputMode="numeric" className="input mb-3" />
        <label className="label">Type</label>
        <select value={newProp.type} onChange={(e) => setNewProp({ ...newProp, type: e.target.value })} className="input mb-4">
          <option>Single Family · 3 Bed</option>
          <option>Condo · 2 Bed</option>
          <option>Duplex · 2 Units</option>
        </select>
        <button
          disabled={!newProp.address.trim() || !newProp.rent}
          onClick={() => {
            const rent = Number(newProp.rent);
            addProperty({
              id: 'p' + Date.now(),
              address: newProp.address.trim(),
              short: newProp.address.trim().split(' ')[0],
              area: 'Austin Metro',
              fullAddress: `${newProp.address.trim()}, Austin, TX`,
              type: newProp.type,
              tier: newProp.type.split(' ·')[0],
              rent,
              rentLabel: '/ target lease',
              net: 0,
              img: IMAGES.oak,
              streetImg: IMAGES.oak,
              metrics: [
                { label: 'Status', value: 'Onboarding', tone: 'text-secondary' },
                { label: 'Listing', value: 'Draft' },
                { label: 'Tenants', value: 'Invite' },
              ],
              units: [{ id: 'SF', tenant: 'Vacant — Invite Tenant', beds: newProp.type.split('· ')[1] || '—', rent, vacant: true }],
            });
            setAddOpen(false);
            setNewProp({ address: '', rent: '', type: 'Single Family · 3 Bed' });
            showToast('Property added to portfolio', 'add_home');
          }}
          className="btn-primary w-full disabled:opacity-50"
        >
          Add to Portfolio
        </button>
      </Sheet>
    </Screen>
  );
}
