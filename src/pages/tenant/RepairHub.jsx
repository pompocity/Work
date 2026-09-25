import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, Screen, Sheet } from '../../components/ui.jsx';
import { TicketCard, useSmartLock } from '../../components/tenantWidgets.jsx';
import { useApp } from '../../state/AppState.jsx';
import { TENANT, TENANT_HISTORY } from '../../data/mock.js';

export default function RepairHub() {
  const navigate = useNavigate();
  const { rooms, showToast } = useApp();
  const { locked, busy, toggle } = useSmartLock();
  const [reveal, setReveal] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const remaining = rooms.filter((r) => !r.done).length;

  return (
    <Screen header={<AppHeader logo />} nav="tenant">
      <div className="flex flex-col gap-3.5">
        <section className="card flex items-center justify-between gap-3 p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal/15 bg-teal/10 text-teal">
              <Icon name="apartment" className="text-[22px]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-[16px] font-bold leading-tight text-ink">Good afternoon, {TENANT.first}</h1>
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-teal" />
              </div>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] font-medium text-ink-mid">
                <Icon name="location_on" className="text-[14px] text-teal" />
                {TENANT.address} · <span className="font-semibold text-teal">Lease active</span>
              </p>
            </div>
          </div>
          <button onClick={() => setConciergeOpen(true)} aria-label="Tenant concierge" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-tint-border bg-white text-indigo shadow-sm hover:bg-tint-hover">
            <Icon name="support_agent" className="text-[20px]" />
          </button>
        </section>

        <section className="card flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange/20 bg-orange/10 text-orange">
                <Icon name="construction" className="text-[19px]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo">Maintenance Request</span>
            </div>
            <span className="chip border border-teal/20 bg-teal/10 text-[10px] text-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Instant Dispatch
            </span>
          </div>
          <div>
            <h2 className="text-[18px] font-bold tracking-tight text-ink">Need something fixed?</h2>
            <p className="text-[13px] leading-relaxed text-ink-mid">AI triage resolves issues fast and coordinates verified repairs seamlessly.</p>
          </div>
          <button onClick={() => navigate('/tenant/report')} className="btn-orange rounded-lg">
            <Icon name="bolt" className="text-[19px]" /> Report an Issue →
          </button>
          <button onClick={() => navigate('/tenant/report?photo=1')} className="btn-ghost rounded-lg">
            <Icon name="photo_camera" className="text-[18px]" /> Snap Photo / Video
          </button>
        </section>

        <TicketCard variant="hub" />

        <section className="grid grid-cols-2 gap-3">
          <div className="card flex min-h-[148px] flex-col justify-between p-3.5">
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${locked ? 'border-teal/20 bg-teal/10 text-teal' : 'border-orange/20 bg-orange/10 text-orange'}`}>
                <Icon name={locked ? 'lock' : 'lock_open'} className="text-[18px]" />
              </div>
              <span className={`text-[11px] font-bold uppercase ${locked ? 'text-teal' : 'text-orange'}`}>{locked ? 'Locked' : 'Unlocked'}</span>
            </div>
            <div className="my-2">
              <h4 className="text-[14px] font-bold text-ink">Main Entry</h4>
              <p className="font-mono text-[12px] font-medium tracking-wider text-ink-mid">PIN: {reveal ? TENANT.pin : '••••'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={toggle} className="flex h-8 flex-1 items-center justify-center rounded-md border border-tint-border bg-white text-[11px] font-semibold text-ink shadow-sm hover:bg-tint-hover active:scale-95">
                {busy ? '…' : locked ? 'Tap Unlock' : 'Tap to Lock'}
              </button>
              <button onClick={() => setReveal((r) => !r)} aria-label="Toggle pin reveal" className="flex h-8 w-8 items-center justify-center rounded-md border border-tint-border bg-white text-ink-mid shadow-sm hover:bg-tint-hover">
                <Icon name={reveal ? 'visibility_off' : 'visibility'} className="text-[16px]" />
              </button>
            </div>
          </div>
          <div className="card flex min-h-[148px] flex-col justify-between p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange/20 bg-orange/10 text-orange">
                <Icon name="event_available" className="text-[18px]" />
              </div>
              <span className="rounded border border-orange/20 bg-orange/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-orange">12 Days</span>
            </div>
            <div className="my-2">
              <h4 className="text-[14px] font-bold text-ink">Inspection Checklist</h4>
              <p className="truncate text-[12px] text-ink-mid">{remaining ? `${remaining} rooms left · Video scan` : 'All rooms verified'}</p>
            </div>
            <button onClick={() => navigate('/tenant/inspection')} className="flex h-8 w-full items-center justify-center gap-1 rounded-md border border-tint-border bg-white text-[11px] font-semibold text-ink shadow-sm hover:bg-tint-hover">
              Details <Icon name="arrow_forward" className="text-[14px]" />
            </button>
          </div>
        </section>

        <section className="card p-4">
          <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">Past Requests</h3>
          <div className="flex flex-col divide-y divide-tint-border">
            {TENANT_HISTORY.map((h) => (
              <button key={h.id} onClick={() => showToast(`Ticket #${h.id} closed ${h.date} · ${h.vendor}`, 'history')} className="flex items-center gap-3 py-2.5 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-ink-mid">
                  <Icon name={h.icon} className="text-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{h.title}</p>
                  <p className="text-[11px] text-muted">#{h.id} · Closed {h.date}</p>
                </div>
                <span className="chip bg-teal/10 text-[10px] text-teal">Resolved</span>
              </button>
            ))}
          </div>
        </section>

        <footer className="flex items-start gap-3 rounded-2xl border-2 border-teal/40 bg-tint p-3.5 shadow-sm">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal text-white shadow-sm">
            <Icon name="verified_user" className="text-[18px]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal">Resident Protection</span>
            <p className="text-[12px] leading-relaxed text-ink-mid">
              <strong className="font-bold text-ink">100% covered by landlord.</strong> You review and sign off when work is completed to your standard.
            </p>
          </div>
        </footer>
      </div>

      <Sheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} title="Resident Concierge" icon="support_agent" eyebrow="24/7 Support">
        <div className="flex flex-col gap-2">
          {[
            ['chat', 'Chat with EnteRent support', 'Avg reply under 2 min'],
            ['call', 'Call landlord office', 'Ellis Holdings · (512) 555-0100'],
            ['emergency_home', 'Emergency hotline', 'Gas, floods, electrical hazards'],
          ].map(([icon, t, s]) => (
            <button
              key={t}
              onClick={() => {
                setConciergeOpen(false);
                showToast(`${t} — connecting (demo)`, icon);
              }}
              className="flex items-center gap-3 rounded-xl border border-tint-border bg-tint p-3 text-left hover:bg-tint-hover"
            >
              <Icon name={icon} className="text-[22px] text-teal" />
              <div>
                <p className="text-[13px] font-bold text-indigo">{t}</p>
                <p className="text-[12px] text-muted">{s}</p>
              </div>
            </button>
          ))}
        </div>
      </Sheet>
    </Screen>
  );
}
