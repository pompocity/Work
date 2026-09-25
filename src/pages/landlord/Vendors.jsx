import { useState } from 'react';
import { AppHeader, Icon, Screen, Sheet } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { DIRECTORY_EXTRA, PRIVATE_VENDORS, VENDORS } from '../../data/mock.js';

const TRADES = ['All', 'Plumbing', 'HVAC', 'Electrical', 'Paint & Drywall'];

export default function Vendors() {
  const { showToast } = useApp();
  const [trade, setTrade] = useState('All');
  const [q, setQ] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ name: '', contact: '' });
  const [favs, setFavs] = useState({ apex: true });

  const all = [
    ...VENDORS.map((v) => ({ ...v, icon: 'plumbing', tradeKey: 'Plumbing' })),
    ...DIRECTORY_EXTRA.map((v) => ({ ...v, tradeKey: v.trade })),
    ...PRIVATE_VENDORS.map((v) => ({ ...v, rating: null, jobs: null, distance: 'Private', icon: 'handyman', tradeKey: v.trade.includes('Plumb') ? 'Plumbing' : 'General' })),
  ];
  const list = all.filter((v) => (trade === 'All' || v.tradeKey === trade) && `${v.company} ${v.tech}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <Screen header={<AppHeader title="Vendor Network" logo />} nav="landlord">
      <div className="flex flex-col gap-3">
        <div className="relative rounded-xl border border-tint-border bg-tint">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-outline" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vendors or technicians..." className="h-11 w-full rounded-xl bg-transparent pl-10 pr-3 text-[14px] focus:outline-none" />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
          {TRADES.map((t) => (
            <button key={t} onClick={() => setTrade(t)} className={`h-8 shrink-0 rounded-full px-3 text-[11px] font-bold ${trade === t ? 'bg-indigo text-white' : 'border border-tint-border bg-tint text-on-surface-variant'}`}>
              {t}
            </button>
          ))}
        </div>

        {list.map((v) => (
          <div key={v.id} className="card flex items-center gap-3 p-3">
            {v.img ? (
              <img src={v.img} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-secondary">
                <Icon name={v.icon} className="text-[24px]" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="truncate text-[14px] font-bold text-indigo">{v.company}</p>
                {v.rating && <Icon name="verified" fill className="text-[15px] text-teal" />}
              </div>
              <p className="truncate text-[11px] text-muted">
                {v.tech} · {v.trade || v.tradeKey}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                {v.rating ? (
                  <>
                    <span className="flex items-center font-bold text-tertiary">
                      <Icon name="star" fill className="text-[13px]" /> {v.rating}
                    </span>
                    <span className="text-muted">{v.jobs} jobs</span>
                  </>
                ) : (
                  <span className="font-semibold text-secondary">Stored private vendor</span>
                )}
                <span className="font-bold text-primary">{v.distance}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <button
                onClick={() => {
                  setFavs((f) => ({ ...f, [v.id]: !f[v.id] }));
                  showToast(favs[v.id] ? 'Removed from preferred' : 'Added to preferred vendors', 'star');
                }}
                aria-label="Toggle preferred"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white"
              >
                <Icon name="star" fill={!!favs[v.id]} className={`text-[18px] ${favs[v.id] ? 'text-orange' : 'text-outline'}`} />
              </button>
              <button onClick={() => showToast(`Calling ${v.company}`, 'call')} aria-label="Call" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-secondary">
                <Icon name="call" className="text-[18px]" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="card p-6 text-center text-[13px] text-muted">No vendors match.</p>}

        <button onClick={() => setInviteOpen(true)} className="btn-primary w-full">
          <Icon name="person_add" className="text-[18px]" /> Invite Your Own Vendor
        </button>
      </div>

      <Sheet open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite a Vendor" icon="person_add" eyebrow="Private Directory">
        <label className="label">Company name</label>
        <input value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} className="input mb-3" placeholder="e.g. Frank's Plumbing LLC" />
        <label className="label">Phone or email</label>
        <input value={invite.contact} onChange={(e) => setInvite({ ...invite, contact: e.target.value })} className="input mb-4" placeholder="frank@austinplumbing.com" />
        <button
          disabled={!invite.name.trim()}
          onClick={() => {
            setInviteOpen(false);
            showToast(`Invite sent to ${invite.name.trim()}`, 'send');
            setInvite({ name: '', contact: '' });
          }}
          className="btn-primary w-full disabled:opacity-50"
        >
          Send Invite Link
        </button>
      </Sheet>
    </Screen>
  );
}
