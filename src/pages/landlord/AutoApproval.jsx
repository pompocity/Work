import { AppHeader, Icon, Screen, Toggle } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { URGENCY_LABELS, evaluate } from '../../state/autoApprove.js';
import { CATEGORIES } from '../../data/mock.js';

const PRESETS = [150, 250, 500];
const URGENCY_META = {
  urgent: { icon: 'priority_high', sub: '< 2 hrs' },
  standard: { icon: 'schedule', sub: '24–48 hrs' },
  flexible: { icon: 'event_available', sub: '3–5 days' },
};
const CAT_SHORT = { plumbing: 'Plumbing', electrical: 'Electrical', hvac: 'HVAC', appliance: 'Appliance', pest: 'Pest Control', other: 'General / Other' };

function Section({ icon, title, sub, children }) {
  return (
    <section className="card p-4">
      <div className="mb-3 flex items-start gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-secondary">
          <Icon name={icon} className="text-[18px]" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-indigo">{title}</h3>
          {sub && <p className="text-[12px] text-muted">{sub}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Pill({ on, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[12px] font-bold transition-colors ${on ? 'border-2 border-teal bg-teal/5 text-teal' : 'border border-tint-border bg-white text-muted hover:text-indigo'}`}
    >
      <Icon name={on ? 'check_circle' : 'radio_button_unchecked'} fill={on} className="text-[16px]" />
      {children}
    </button>
  );
}

export default function AutoApproval() {
  const { autoApprove: r, updateAutoApprove: set, resetAutoApprove, properties, ticket, showToast } = useApp();
  const off = !r.enabled;

  // Live preview against the current tenant ticket with the AI top-recommended quote.
  const preview = evaluate(r, { category: ticket.category, urgency: ticket.urgency, price: 185, rating: 4.96 });

  return (
    <Screen header={<AppHeader title="Auto-Approval Rules" back="/landlord/account" />} nav="landlord">
      <div className="flex flex-col gap-4">
        <section className={`flex items-center justify-between gap-3 rounded-2xl p-4 shadow-sm ${r.enabled ? 'bg-indigo text-white' : 'border border-tint-border bg-tint'}`}>
          <div>
            <h2 className={`text-[17px] font-bold ${r.enabled ? 'text-white' : 'text-indigo'}`}>Auto-approve repairs</h2>
            <p className={`text-[12px] ${r.enabled ? 'text-white/80' : 'text-muted'}`}>
              {r.enabled ? 'Matching tickets dispatch instantly. Everything else waits for you.' : 'Off — every repair waits for your approval.'}
            </p>
          </div>
          <Toggle on={r.enabled} onChange={(enabled) => set({ enabled })} label="Auto-approve repairs" />
        </section>

        <div className={`flex flex-col gap-4 transition-opacity ${off ? 'pointer-events-none opacity-50' : ''}`} aria-disabled={off}>
          <Section icon="payments" title="Price limit" sub="Highest quote that can be approved without you">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-[12px] text-muted">Up to</span>
              <span className="text-[26px] font-bold text-teal">${r.maxAmount}</span>
            </div>
            <input type="range" min={50} max={1000} step={25} value={r.maxAmount} onChange={(e) => set({ maxAmount: Number(e.target.value) })} className="w-full accent-teal" aria-label="Maximum auto-approved amount" />
            <div className="mb-3 flex justify-between text-[11px] text-muted">
              <span>$50</span>
              <span>$1,000</span>
            </div>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => set({ maxAmount: p })} className={`rounded-lg py-2 text-[12px] font-bold ${r.maxAmount === p ? 'bg-indigo text-white' : 'border border-tint-border bg-white text-indigo'}`}>
                  ${p}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-tint-border bg-white p-3">
              <div>
                <p className="text-[13px] font-semibold text-ink">Stay within fair-market benchmark</p>
                <p className="text-[11px] text-muted">Reject quotes above the AI's local price range</p>
              </div>
              <Toggle on={r.benchmarkOnly} onChange={(benchmarkOnly) => set({ benchmarkOnly })} label="Benchmark only" />
            </div>
          </Section>

          <Section icon="speed" title="Urgency levels" sub="Which tenant-reported urgency tiers can auto-approve">
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(URGENCY_LABELS).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={r.urgencies[k]}
                  onClick={() => set({ urgencies: { ...r.urgencies, [k]: !r.urgencies[k] } })}
                  className={`flex flex-col items-start rounded-xl p-3 text-left transition-colors ${r.urgencies[k] ? 'border-2 border-teal bg-teal/5' : 'border border-tint-border bg-white'}`}
                >
                  <div className="mb-1.5 flex w-full items-center justify-between">
                    <Icon name={URGENCY_META[k].icon} className={`text-[18px] ${r.urgencies[k] ? 'text-teal' : 'text-muted'}`} />
                    <Icon name={r.urgencies[k] ? 'check_circle' : 'radio_button_unchecked'} fill={r.urgencies[k]} className={`text-[16px] ${r.urgencies[k] ? 'text-teal' : 'text-outline'}`} />
                  </div>
                  <span className="text-[12px] font-bold text-indigo">{URGENCY_LABELS[k]}</span>
                  <span className="text-[11px] text-muted">{URGENCY_META[k].sub}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[11px] text-muted">
              <Icon name="emergency_home" className="text-[14px] text-orange" />
              Life-safety emergencies (gas, floods, electrical) always dispatch immediately and alert you 24/7.
            </p>
          </Section>

          <Section icon="category" title="Issue types" sub="Categories that can be approved automatically">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <Pill key={c.id} on={r.categories[c.id]} onClick={() => set({ categories: { ...r.categories, [c.id]: !r.categories[c.id] } })}>
                  {CAT_SHORT[c.id]}
                </Pill>
              ))}
            </div>
          </Section>

          <Section icon="engineering" title="Vendors" sub="Who can be dispatched without your sign-off">
            <div className="flex flex-col gap-2">
              {[
                ['vetted', 'Vetted marketplace pros', `EnteRent-verified, rated ${r.minRating}★ or higher`],
                ['preferred', 'My preferred vendors only', 'Starred vendors in your Vendor Network'],
              ].map(([id, t, s]) => (
                <button key={id} onClick={() => set({ vendorPolicy: id })} className={`flex items-center gap-3 rounded-xl p-3 text-left ${r.vendorPolicy === id ? 'border-2 border-teal bg-teal/5' : 'border border-tint-border bg-white'}`}>
                  <Icon name={r.vendorPolicy === id ? 'radio_button_checked' : 'radio_button_unchecked'} className={`text-[20px] ${r.vendorPolicy === id ? 'text-teal' : 'text-outline'}`} />
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{t}</p>
                    <p className="text-[11px] text-muted">{s}</p>
                  </div>
                </button>
              ))}
            </div>
            {r.vendorPolicy === 'vetted' && (
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-muted">Minimum vendor rating</span>
                  <span className="font-bold text-indigo">{r.minRating.toFixed(1)}★</span>
                </div>
                <input type="range" min={4} max={5} step={0.1} value={r.minRating} onChange={(e) => set({ minRating: Number(e.target.value) })} className="w-full accent-teal" aria-label="Minimum vendor rating" />
              </div>
            )}
          </Section>

          <Section icon="savings" title="Spending guardrails" sub="Caps that pause auto-approval once reached">
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-muted">Monthly cap per property</span>
              <span className="font-bold text-indigo">${r.monthlyCap.toLocaleString()}</span>
            </div>
            <input type="range" min={250} max={5000} step={250} value={r.monthlyCap} onChange={(e) => set({ monthlyCap: Number(e.target.value) })} className="mb-3 w-full accent-teal" aria-label="Monthly cap per property" />
            <div className="flex items-center justify-between gap-3 rounded-xl border border-tint-border bg-white p-3">
              <div>
                <p className="text-[13px] font-semibold text-ink">Notify me on every auto-approval</p>
                <p className="text-[11px] text-muted">SMS + push with vendor, quote and ETA</p>
              </div>
              <Toggle on={r.notify} onChange={(notify) => set({ notify })} label="Notify on auto-approval" />
            </div>
          </Section>

          <Section icon="domain" title="Applies to" sub="Properties covered by these rules">
            <div className="flex flex-col gap-2">
              {properties.map((p) => {
                const on = r.properties[p.id] !== false;
                return (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-tint-border bg-white p-3">
                    <div className="flex items-center gap-2.5">
                      <img src={p.img} alt="" className="h-9 w-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-[13px] font-semibold text-ink">{p.address}</p>
                        <p className="text-[11px] text-muted">{p.type}</p>
                      </div>
                    </div>
                    <Toggle on={on} onChange={(v) => set({ properties: { ...r.properties, [p.id]: v } })} label={p.address} />
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Live preview */}
        <section className={`rounded-2xl border-2 p-4 ${preview.ok ? 'border-teal/40 bg-teal/5' : 'border-orange/40 bg-orange-soft'}`}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Live preview</span>
          <p className="mt-1 text-[13px] text-ink">
            Ticket #{ticket.id} · {ticket.title} · {URGENCY_LABELS[ticket.urgency]} · Apex Plumbing $185
          </p>
          <p className={`mt-2 flex items-center gap-1.5 text-[14px] font-bold ${preview.ok ? 'text-teal' : 'text-orange'}`}>
            <Icon name={preview.ok ? 'task_alt' : 'front_hand'} className="text-[20px]" />
            {preview.ok ? 'Would auto-approve & dispatch' : 'Would wait for your approval'}
          </p>
          {!preview.ok && (
            <ul className="mt-1 list-disc pl-6 text-[12px] text-ink-mid">
              {preview.reasons.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              resetAutoApprove();
              showToast('Rules reset to defaults', 'restart_alt');
            }}
            className="btn-ghost h-11"
          >
            Reset Defaults
          </button>
          <button onClick={() => showToast('Auto-approval rules saved', 'task_alt')} className="btn-primary">
            Save Rules
          </button>
        </div>
      </div>
    </Screen>
  );
}
