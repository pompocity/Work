import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './ui.jsx';
import { useApp } from '../state/AppState.jsx';
import { TENANT } from '../data/mock.js';

export const STAGE_META = {
  awaiting: { label: 'Awaiting Landlord', chip: 'bg-orange/10 text-orange border-orange/20', progress: 1 },
  dispatched: { label: 'Vendor Dispatched', chip: 'bg-teal/10 text-teal border-teal/20', progress: 2 },
  completed: { label: 'Completed', chip: 'bg-teal text-white border-teal', progress: 3 },
};

/* Ticket summary card — mirrors tenant_home.html / tenant_repair_hub.html */
export function TicketCard({ variant = 'home' }) {
  const { ticket, showToast } = useApp();
  const navigate = useNavigate();
  const meta = STAGE_META[ticket.stage];
  const v = ticket.vendor;
  const steps = ['Triage', 'Dispatched', 'Completed'];

  return (
    <section className="card overflow-hidden">
      {variant === 'hub' && (
        <div className="flex items-center justify-between border-b border-tint-border bg-tint-light px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${ticket.stage === 'completed' ? 'bg-teal' : 'animate-pulse bg-teal'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
              {ticket.stage === 'completed' ? 'Resolved' : 'In Progress'}
            </span>
          </div>
          <span className="rounded border border-tint-border bg-white px-2 py-0.5 text-[11px] font-semibold text-ink-mid">Ticket #{ticket.id}</span>
        </div>
      )}
      <div className="flex flex-col gap-3.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {variant === 'home' && <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Ticket #{ticket.id}</span>}
            <h3 className="text-[17px] font-bold text-ink">{ticket.title}</h3>
            {variant === 'hub' && (
              <p className="mt-0.5 text-[13px] text-ink-mid">
                {ticket.urgency === 'urgent' ? 'High-priority' : 'Standard-window'} seal replacement under primary basin
              </p>
            )}
          </div>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.chip}`}>{meta.label}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className={`h-1.5 rounded-full ${i < meta.progress ? 'bg-teal' : 'bg-[#E0DDD8]'}`} />
            ))}
          </div>
          <div className="grid grid-cols-3 text-[11px] font-semibold">
            {steps.map((s, i) => (
              <span key={s} className={`${i === 1 ? 'text-center' : i === 2 ? 'text-right' : ''} ${i < meta.progress ? 'text-teal' : 'text-muted'}`}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-tint-border bg-white p-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {v ? (
              <img src={v.techImg} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-container text-muted">
                <Icon name="hourglass_top" className="text-[20px]" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-[13px] font-bold text-ink">{v ? v.tech : 'Vendor pending'}</span>
                {v && <Icon name="verified" fill className="text-[15px] text-teal" />}
              </div>
              <span className="block truncate text-[12px] text-ink-mid">{v ? v.company : 'Landlord reviewing your triage'}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end border-l border-tint-border pl-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mid">
              {ticket.stage === 'completed' ? 'Closed' : v ? 'Arrival' : 'Requested'}
            </span>
            <span className="text-[13px] font-bold text-teal">
              {ticket.stage === 'completed' ? ticket.completedAt : v ? v.eta.replace(' PM – ', ' – ') : ticket.window.split(' · ')[1] || ticket.window}
            </span>
          </div>
        </div>

        {variant === 'home' ? (
          <button onClick={() => navigate('/tenant/tracker')} className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-surface-container-high text-[14px] font-bold text-teal transition-colors hover:bg-surface-container-highest">
            View Details & Live Tracking <Icon name="east" className="text-[18px]" />
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigate('/tenant/tracker')} className="btn-ghost h-9 text-[12px] text-ink">
              <Icon name="navigation" className="text-[17px] text-teal" /> Track Status
            </button>
            <button
              onClick={() => (v ? navigate('/tenant/tracker?message=1') : showToast('Messaging opens once a vendor is assigned', 'info'))}
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-indigo/20 bg-indigo/10 text-[12px] font-semibold text-indigo transition-colors hover:bg-indigo/15"
            >
              <Icon name="forum" className="text-[17px]" /> Message
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* Smart lock with 1-tap unlock + auto re-lock, from tenant_home.html */
export function useSmartLock() {
  const { lockLocked, setLock, showToast } = useApp();
  const [busy, setBusy] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const toggle = () => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      const next = !lockLocked;
      setLock(next);
      showToast(next ? 'Main door locked' : 'Door unlocked · auto re-locks in 8s', next ? 'lock' : 'lock_open');
      clearTimeout(timer.current);
      if (!next) timer.current = setTimeout(() => setLock(true), 8000);
    }, 600);
  };
  return { locked: lockLocked, busy, toggle };
}

export function LockCard() {
  const { locked, busy, toggle } = useSmartLock();
  const [reveal, setReveal] = useState(false);
  const navigate = useNavigate();
  return (
    <section className="rounded-2xl border border-tint-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${locked ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-tertiary-fixed text-tertiary'}`}>
            <Icon name={locked ? 'lock' : 'lock_open_right'} fill className="text-[22px]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[15px] font-bold text-ink">Main Door Lock</h4>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${locked ? 'bg-surface-container-high text-primary' : 'bg-tertiary-fixed text-tertiary'}`}>
                {locked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
            <p className="truncate text-[12px] text-ink-mid">Schlage Encode Smart Deadbolt</p>
          </div>
        </div>
        <button onClick={() => setReveal((r) => !r)} className="flex shrink-0 items-center gap-1 rounded-lg bg-surface-container-low px-2.5 py-1.5 text-[13px] font-semibold tracking-widest text-ink-mid">
          <Icon name={reveal ? 'visibility_off' : 'visibility'} className="text-[17px]" />
          {reveal ? TENANT.pin : '••••'}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button onClick={toggle} className={`btn-primary ${busy ? 'opacity-75' : ''}`}>
          <Icon name={locked ? 'lock_open' : 'lock'} className="text-[18px]" />
          {busy ? (locked ? 'Unlocking…' : 'Locking…') : locked ? '1-Tap Unlock' : 'Lock Door'}
        </button>
        <button onClick={() => navigate('/tenant/unit')} className="flex h-11 items-center gap-1.5 rounded-xl bg-surface-container-low px-4 text-[13px] font-semibold text-ink hover:bg-surface-container">
          <Icon name="key" className="text-[18px]" /> Passes
        </button>
      </div>
    </section>
  );
}
