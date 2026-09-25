import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, Screen, Sheet } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { IMAGES, PRIVATE_VENDORS, VENDORS } from '../../data/mock.js';

const BADGE = {
  teal: 'bg-primary-fixed text-on-primary-fixed-variant',
  orange: 'bg-tertiary-fixed text-on-tertiary-fixed',
  gray: 'bg-surface-container-high text-on-surface',
};

export default function VendorSelection() {
  const navigate = useNavigate();
  const { ticket, dispatchVendor, updateTicket, showToast } = useApp();
  const [tab, setTab] = useState('market');
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [custom, setCustom] = useState({ name: '', contact: '' });
  const [sheet, setSheet] = useState(null); // photos | budget
  const [budgetDraft, setBudgetDraft] = useState(ticket.budget);
  const [sending, setSending] = useState(false);
  const budget = ticket.budget;
  const open = ticket.stage === 'awaiting';

  const confirm = () => {
    setSending(true);
    setTimeout(() => {
      const v = selected.vendor;
      dispatchVendor(
        {
          id: v.id,
          company: v.company,
          tech: v.tech,
          license: v.license,
          rating: v.rating,
          techImg: v.techImg || IMAGES.marcus,
          phone: v.phone,
          eta: v.eta || '2:00 PM – 4:00 PM',
        },
        selected.price
      );
      setSending(false);
      setSelected(null);
      showToast(`Dispatch request transmitted to ${v.company}!`, 'send');
      setTimeout(() => navigate('/landlord/triage'), 900);
    }, 900);
  };

  return (
    <Screen header={<AppHeader title="Dispatch / Marketplace" back="/landlord/property/maple" />} nav="landlord" bg="bg-surface">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">Ticket #{ticket.id}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-tertiary' : 'bg-teal'}`} />
            <span className={`text-[11px] font-bold uppercase ${open ? 'text-tertiary' : 'text-teal'}`}>{open ? 'Awaiting Dispatch' : ticket.stage === 'dispatched' ? 'Dispatched' : 'Closed'}</span>
          </div>
          <span className="flex items-center gap-1 text-[12px] text-on-surface-variant">
            <Icon name="schedule" className="text-[16px]" /> {ticket.reportedAt}
          </span>
        </div>

        {!open && (
          <div className="flex items-center gap-3 rounded-xl border border-teal/30 bg-teal/10 p-3">
            <Icon name="task_alt" className="text-[22px] text-teal" />
            <div className="flex-1 text-[12px] text-ink">
              <strong>{ticket.vendor?.company}</strong> is {ticket.stage === 'dispatched' ? 'assigned' : 'finished'} for this ticket. Selecting another vendor will reassign the job.
            </div>
          </div>
        )}

        <div className="relative overflow-hidden rounded-xl bg-secondary-fixed/30 p-3 shadow-sm">
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-secondary-fixed/50 blur-2xl" />
          <div className="relative z-10 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <Icon name="plumbing" className="text-[24px]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 truncate text-[12px] text-on-surface-variant">
                  <Icon name="location_on" className="text-[15px]" />
                  <span className="font-bold text-on-surface">124 Maple St</span> · Unit 2B
                </div>
                <h2 className="mt-0.5 text-[16px] font-semibold leading-tight text-on-surface">Water Leak Under Kitchen Sink</h2>
                <p className="mt-0.5 text-[12px] text-on-surface-variant">Diagnosis: P-trap seal failure · Tenant Sarah Miller</p>
              </div>
            </div>
            <button onClick={() => setSheet('photos')} className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm active:scale-95">
              <Icon name="photo_library" className="text-[16px]" /> 2 Photos
            </button>
          </div>
          <div className="relative z-10 mt-3 flex flex-col gap-1 rounded-lg bg-white/80 p-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-outline">Benchmark Estimate</span>
                <div className="text-[15px] font-semibold text-on-surface">
                  $120 – $240 <span className="text-[12px] font-normal text-on-surface-variant">(Austin Metro)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Approved Budget</span>
                <div className="text-[15px] font-bold text-primary">${budget}.00 Max</div>
              </div>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-container">
              <div className="h-full w-[48%] bg-primary/40" />
              <div className="h-full w-[36%] bg-primary" />
              <div className="h-full w-[16%] bg-tertiary-container/60" />
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="flex items-center gap-1 text-[12px] text-on-surface-variant">
                <span className="h-2 w-2 rounded-full bg-primary" /> Pre-approved under owner auto-limit
              </span>
              <button
                onClick={() => {
                  setBudgetDraft(budget);
                  setSheet('budget');
                }}
                className="flex items-center gap-0.5 text-[11px] font-bold text-secondary hover:underline"
              >
                Edit Budget <Icon name="tune" className="text-[14px]" />
              </button>
            </div>
          </div>
          <div className="relative z-10 mt-2 flex items-start gap-1.5 rounded-lg bg-white/60 p-2 text-[11px] text-on-surface-variant">
            <Icon name="person" className="text-[15px] text-secondary" />
            <span>
              Tenant requested <strong className="text-on-surface">{ticket.urgency === 'urgent' ? 'Urgent (< 2 hrs)' : 'Standard (24–48 hrs)'}</strong> · preferred {ticket.window}
            </span>
          </div>
        </div>

        <div className="flex items-center rounded-xl bg-surface-container p-1 shadow-inner">
          <button onClick={() => setTab('market')} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-semibold transition-all ${tab === 'market' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}>
            <Icon name="verified" className="text-[18px]" /> Marketplace AI
            <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">3 Ready</span>
          </button>
          <button onClick={() => setTab('private')} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-semibold transition-all ${tab === 'private' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}>
            <Icon name="person_pin" className="text-[18px]" /> Private Vendor
          </button>
        </div>

        {tab === 'market' ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="flex items-center gap-1.5 text-[14px] font-bold text-on-surface">
                <Icon name="auto_awesome" className="text-[18px] text-primary" /> Vetted Local Contractors
              </span>
              <span className="text-[12px] text-on-surface-variant">Sorted by Match & Distance</span>
            </div>
            {VENDORS.map((v, i) => {
              const under = budget - v.price;
              return (
                <div key={v.id} className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${BADGE[v.badge.tone]}`}>
                      <Icon name={v.badge.icon} className="text-[14px]" /> {v.badge.text}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wide ${v.badge.tone === 'orange' ? 'text-tertiary' : 'text-primary'}`}>{v.score}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="relative shrink-0">
                      <img src={v.img} alt={v.company} className="h-14 w-14 rounded-xl object-cover shadow-sm" />
                      <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm ${v.badge.tone === 'orange' ? 'bg-tertiary' : v.badge.tone === 'teal' ? 'bg-primary' : 'bg-surface-container-highest text-on-surface'}`}>
                        <Icon name={v.badge.tone === 'orange' ? 'bolt' : v.badge.tone === 'teal' ? 'verified' : 'handyman'} className="text-[13px]" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-[16px] font-semibold text-on-surface">{v.company}</h3>
                        <div className="shrink-0 text-right">
                          <span className={`text-[20px] font-bold ${v.badge.tone === 'orange' ? 'text-on-surface' : 'text-primary'}`}>${v.price}</span>
                          <span className="-mt-1 block text-[11px] text-on-surface-variant">{v.priceLabel}</span>
                        </div>
                      </div>
                      <p className="text-[12px] text-on-surface-variant">
                        {v.techRole}: {v.tech} · Lic #{v.license}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[12px]">
                        <span className="flex items-center font-bold text-tertiary">
                          <Icon name="star" fill className="text-[15px]" /> {v.rating}
                        </span>
                        <span className="text-outline-variant">·</span>
                        <span className="text-on-surface-variant">{v.jobs} EnteRent jobs</span>
                        <span className="text-outline-variant">·</span>
                        <span className="font-bold text-primary">{v.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {v.tags.map((t) => (
                      <span key={t.text} className="flex items-center gap-1 rounded bg-surface-container-low px-2 py-0.5 text-[11px] font-bold text-on-surface-variant">
                        <Icon name={t.icon} className={`text-[13px] ${t.icon === 'speed' ? 'text-tertiary' : 'text-primary'}`} /> {t.text}
                      </span>
                    ))}
                    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${under >= 0 ? 'bg-primary-fixed/40 text-on-primary-fixed-variant' : 'bg-error-container text-on-error-container'}`}>
                      {under >= 0 ? `$${under} under budget` : `$${-under} over budget`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelected({ vendor: v, price: v.price })}
                      className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg text-[14px] font-bold shadow-sm transition-all active:scale-[0.99] ${i === 0 ? 'bg-indigo text-white hover:bg-indigo/90' : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'}`}
                    >
                      Select & Request Dates <Icon name="arrow_forward" className="text-[18px]" />
                    </button>
                    <button onClick={() => showToast(`Chat opened with ${v.company}`, 'chat')} aria-label={`Message ${v.company}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high">
                      <Icon name="chat" className="text-[19px]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm">
            <div className="flex items-center gap-1 text-primary">
              <Icon name="contacts_product" />
              <h3 className="text-[16px] font-semibold text-on-surface">Your Preferred Directory</h3>
            </div>
            <p className="text-[12px] text-on-surface-variant">Dispatch directly to your trusted contractor or invite a new provider into EnteRent.</p>
            {PRIVATE_VENDORS.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low p-3 hover:bg-surface-container">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white ${v.tone}`}>{v.initials}</div>
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold text-on-surface">{v.company}</div>
                    <div className="truncate text-[12px] text-on-surface-variant">{v.phone} · Stored Vendor</div>
                  </div>
                </div>
                <button onClick={() => setSelected({ vendor: { ...v, eta: 'Tenant picks slot' }, price: v.price })} className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
                  Assign
                </button>
              </div>
            ))}
            <button onClick={() => setAddOpen((a) => !a)} className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-surface-container text-[12px] font-bold text-secondary">
              <Icon name="person_add" className="text-[18px]" /> + Assign Another External Contractor
            </button>
            {addOpen && (
              <div className="flex flex-col gap-2.5 pt-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface">Company / Contractor Name</label>
                  <input value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} placeholder="e.g. Frank's Plumbing LLC" className="input" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface">Phone or Email for Dispatch Link</label>
                  <input value={custom.contact} onChange={(e) => setCustom({ ...custom, contact: e.target.value })} placeholder="e.g. frank@austinplumbing.com" className="input" />
                </div>
                <button
                  disabled={!custom.name.trim()}
                  onClick={() => setSelected({ vendor: { id: 'custom', company: custom.name.trim(), tech: custom.name.trim(), eta: 'Awaiting contractor slots', phone: custom.contact }, price: 200 })}
                  className="h-11 rounded-lg bg-primary text-[12px] font-bold text-white shadow-sm disabled:opacity-50"
                >
                  Send Ticket & Request Appointment
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-2 rounded-xl bg-surface-container p-3 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name="info" className="text-[20px]" />
          </div>
          <div>
            <h4 className="text-[16px] font-semibold text-on-surface">Automated Dispatch Sequence</h4>
            <p className="mt-1 text-[12px] leading-relaxed text-on-surface-variant">
              Once you confirm a vendor, they will receive job specs and submit available 2-hour arrival slots. Tenant <span className="font-bold text-on-surface">Sarah Miller</span> will then select the time that fits her schedule.
            </p>
          </div>
        </div>
      </div>

      <Sheet open={!!selected} onClose={() => setSelected(null)} title={selected?.vendor.company} eyebrow="Ready to Dispatch" icon="check_circle">
        {selected && (
          <>
            <div className="flex flex-col gap-1.5 rounded-lg bg-tint p-3 text-[12px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Agreed Authorization Cap:</span>
                <span className="font-bold text-on-surface">${selected.price}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Property & Unit:</span>
                <span className="font-bold text-on-surface">124 Maple St · Unit 2B</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Tenant Notification:</span>
                <span className="text-right font-bold text-primary">SMS Prompt queued for Sarah Miller</span>
              </div>
            </div>
            {selected.price > budget && <p className="mt-2 text-[11px] font-semibold text-error">Quote exceeds approved budget — confirming raises the cap for this ticket.</p>}
            <button onClick={confirm} disabled={sending} className="btn-primary mt-4 h-12 w-full">
              {sending ? (
                <>
                  <Icon name="progress_activity" className="animate-spin text-[19px]" /> Transmitting…
                </>
              ) : (
                <>
                  Confirm & Transmit Ticket <Icon name="send" className="text-[19px]" />
                </>
              )}
            </button>
            <button onClick={() => setSelected(null)} className="mt-2 h-10 w-full rounded-lg text-[12px] font-semibold text-on-surface-variant">
              Cancel
            </button>
          </>
        )}
      </Sheet>

      <Sheet open={sheet === 'photos'} onClose={() => setSheet(null)} title="Tenant Photos" icon="photo_library" eyebrow="Ticket #9042">
        <div className="grid grid-cols-2 gap-2">
          {[
            [IMAGES.ptrapTriage, 'Under-sink drainage'],
            [IMAGES.ptrapReport, 'Cabinet pan'],
          ].map(([src, cap]) => (
            <figure key={cap}>
              <img src={src} alt={cap} className="aspect-square w-full rounded-lg object-cover" />
              <figcaption className="mt-1 text-[11px] font-semibold text-muted">{cap}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1 text-[12px] text-teal">
          <Icon name="auto_awesome" className="text-[16px]" /> AI: P-trap seal degradation observed (98% conf.)
        </p>
      </Sheet>

      <Sheet open={sheet === 'budget'} onClose={() => setSheet(null)} title="Approved Budget" icon="tune" eyebrow="Owner auto-limit">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[12px] text-muted">Authorization cap</span>
          <span className="text-[24px] font-bold text-primary">${budgetDraft}</span>
        </div>
        <input type="range" min={120} max={500} step={10} value={budgetDraft} onChange={(e) => setBudgetDraft(Number(e.target.value))} className="w-full accent-teal" />
        <div className="mb-4 flex justify-between text-[11px] text-muted">
          <span>$120</span>
          <span>Benchmark $120–$240</span>
          <span>$500</span>
        </div>
        <button
          onClick={() => {
            updateTicket({ budget: budgetDraft });
            setSheet(null);
            showToast(`Budget set to $${budgetDraft}.00`, 'payments');
          }}
          className="btn-primary w-full"
        >
          Save Budget
        </button>
      </Sheet>
    </Screen>
  );
}
