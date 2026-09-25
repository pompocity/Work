import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, ScenarioCard, Screen, Sheet } from '../../components/ui.jsx';
import { LockCard } from '../../components/tenantWidgets.jsx';
import { useApp } from '../../state/AppState.jsx';
import { TENANT, money } from '../../data/mock.js';

const DOCS = [
  { icon: 'description', name: 'Residential Lease Agreement', meta: 'Signed Jun 1, 2025 · PDF' },
  { icon: 'receipt_long', name: 'Move-In Condition Report', meta: '42 photos · Jun 1, 2025' },
  { icon: 'policy', name: 'Renters Insurance Certificate', meta: 'Lemonade · exp. Jun 2026' },
];

export default function UnitKeys() {
  const navigate = useNavigate();
  const { guestPasses, addGuestPass, removeGuestPass, showToast, setRole } = useApp();
  const [passOpen, setPassOpen] = useState(false);
  const [guest, setGuest] = useState('');
  const [duration, setDuration] = useState('4 hours');

  return (
    <Screen header={<AppHeader title="Unit & Keys" logo />} nav="tenant">
      <div className="flex flex-col gap-4">
        <section className="card overflow-hidden">
          <div className="bg-indigo p-4 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">Your Home</span>
            <h2 className="text-[20px] font-bold">{TENANT.address}</h2>
            <p className="text-[12px] text-white/80">Bouldin Creek, Austin, TX 78704 · 2 Bed • 1.5 Bath</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-tint-border text-center">
            {[
              ['Monthly Rent', money(TENANT.rent)],
              ['Lease Ends', 'May 2026'],
              ['Deposit', '$2,400'],
            ].map(([k, v]) => (
              <div key={k} className="p-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">{k}</span>
                <span className="text-[14px] font-bold text-indigo">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-tint-border px-4 py-3">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <Icon name="check_circle" fill className="text-[18px] text-teal" /> Autopay Active · Wells ACH
            </span>
            <button onClick={() => showToast('Next payment: Jun 1 · $2,400.00', 'payments')} className="text-[12px] font-bold text-teal">
              Payments →
            </button>
          </div>
        </section>

        <LockCard />

        <section className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-indigo">Guest & Vendor Passes</h3>
              <p className="text-[12px] text-muted">Time-limited smart lock codes</p>
            </div>
            <button onClick={() => setPassOpen(true)} className="flex items-center gap-1 rounded-lg bg-indigo px-2.5 py-1.5 text-[12px] font-bold text-white">
              <Icon name="add" className="text-[16px]" /> New Pass
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {guestPasses.length === 0 && <p className="py-2 text-center text-[12px] text-muted">No active passes</p>}
            {guestPasses.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-tint-border bg-white p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10 text-teal">
                    <Icon name="key" className="text-[18px]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-ink">{p.name}</p>
                    <p className="text-[11px] text-muted">
                      Code <span className="font-mono font-bold text-indigo">{p.code}</span> · until {p.expires}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    removeGuestPass(p.id);
                    showToast('Pass revoked', 'key_off');
                  }}
                  className="text-[12px] font-semibold text-error"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <h3 className="mb-2 text-[15px] font-bold text-indigo">Documents</h3>
          <div className="flex flex-col divide-y divide-tint-border">
            {DOCS.map((d) => (
              <button key={d.name} onClick={() => showToast(`Opening ${d.name} (demo)`, 'description')} className="flex items-center gap-3 py-2.5 text-left">
                <Icon name={d.icon} className="text-[22px] text-secondary" />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-ink">{d.name}</p>
                  <p className="text-[11px] text-muted">{d.meta}</p>
                </div>
                <Icon name="chevron_right" className="text-[18px] text-muted" />
              </button>
            ))}
          </div>
        </section>

        <section className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo text-[13px] font-bold text-white">JE</div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-ink">Jordan Ellis · Landlord</p>
            <p className="text-[11px] text-muted">Ellis Holdings LLC · replies in ~1 hr</p>
          </div>
          <button onClick={() => showToast('Message thread opened (demo)', 'chat')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-tint-border bg-white text-indigo">
            <Icon name="chat" className="text-[18px]" />
          </button>
        </section>

        <ScenarioCard />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setRole('landlord');
              navigate('/landlord/portfolio');
            }}
            className="btn-ghost h-11"
          >
            <Icon name="swap_horiz" className="text-[18px]" /> Landlord View
          </button>
          <button onClick={() => navigate('/')} className="btn-ghost h-11 text-error">
            <Icon name="logout" className="text-[18px]" /> Sign Out
          </button>
        </div>
      </div>

      <Sheet open={passOpen} onClose={() => setPassOpen(false)} title="Create Access Pass" icon="key" eyebrow="Smart Lock">
        <label className="label">Guest or company name</label>
        <input value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="e.g. Dog walker — Maya" className="input mb-3" />
        <label className="label">Valid for</label>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {['4 hours', '1 day', '1 week'].map((d) => (
            <button key={d} onClick={() => setDuration(d)} className={`rounded-lg py-2 text-[12px] font-bold ${duration === d ? 'bg-indigo text-white' : 'border border-tint-border bg-white text-indigo'}`}>
              {d}
            </button>
          ))}
        </div>
        <button
          disabled={!guest.trim()}
          onClick={() => {
            const code = String(1000 + Math.floor(Math.random() * 9000));
            addGuestPass({ id: 'p' + Date.now(), name: guest.trim(), code, expires: duration === '4 hours' ? 'Today, 8:00 PM' : duration === '1 day' ? 'Tomorrow' : 'Next week' });
            showToast(`Pass created · code ${code}`, 'key');
            setGuest('');
            setPassOpen(false);
          }}
          className="btn-primary w-full disabled:opacity-50"
        >
          Generate Code & Share
        </button>
      </Sheet>
    </Screen>
  );
}
