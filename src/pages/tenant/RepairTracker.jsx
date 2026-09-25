import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppHeader, Icon, Screen, Sheet, Stars } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';

function Step({ state, icon, title, time, desc, last, badge }) {
  const dot =
    state === 'done'
      ? 'bg-primary text-white'
      : state === 'current'
      ? 'bg-secondary text-white shadow-md'
      : 'bg-surface-container-high text-outline';
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${dot}`}>
          <Icon name={state === 'done' ? 'check' : icon} className={`text-[18px] ${state === 'current' ? 'animate-pulse' : ''}`} />
          {state === 'current' && <span className="absolute -inset-1 animate-ping rounded-full bg-secondary/20" />}
        </div>
        {!last && <div className={`mt-1 h-10 w-0.5 ${state === 'done' ? 'bg-primary' : 'bg-surface-container-high'}`} />}
      </div>
      <div className={`flex-1 pt-1 ${state === 'pending' ? 'opacity-70' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <span className={`text-[14px] ${state === 'current' ? 'font-bold text-secondary' : 'font-semibold text-on-surface'}`}>{title}</span>
          {badge || <span className="shrink-0 text-[11px] font-bold text-on-surface-variant">{time}</span>}
        </div>
        <p className="mt-0.5 text-[12px] text-on-surface-variant">{desc}</p>
      </div>
    </div>
  );
}

export default function RepairTracker() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { ticket, sendMessage, completeTicket, showToast } = useApp();
  const [noteOpen, setNoteOpen] = useState(params.get('message') === '1');
  const [draftMsg, setDraftMsg] = useState('');
  const [signOpen, setSignOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [checks, setChecks] = useState({ fixed: true, clean: true });
  const v = ticket.vendor;
  const stage = ticket.stage;
  const stepNo = stage === 'awaiting' ? 2 : stage === 'dispatched' ? 3 : 4;

  const s = (n) => (stage === 'completed' || n < stepNo ? 'done' : n === stepNo ? 'current' : 'pending');

  const send = () => {
    if (!draftMsg.trim()) return;
    sendMessage(draftMsg.trim());
    setDraftMsg('');
    showToast(`Note sent to ${v.tech.split(' ')[0]}`, 'send');
  };

  return (
    <Screen header={<AppHeader logo title="Repair Status" />} nav="tenant" bg="bg-surface">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/tenant/home')} aria-label="Go back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface shadow-sm hover:bg-surface-container-high">
              <Icon name="arrow_back" className="text-[20px]" />
            </button>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-secondary">{stage === 'completed' ? 'Closed Ticket' : 'Live Dispatch'}</span>
              <h1 className="text-[20px] font-bold tracking-tight text-on-surface">Ticket #{ticket.id}</h1>
            </div>
          </div>
          {stage === 'completed' ? (
            <span className="chip shrink-0 bg-primary-fixed px-2.5 py-1 text-on-primary-fixed">
              <Icon name="task_alt" className="text-[14px]" /> Resolved
            </span>
          ) : ticket.urgency === 'urgent' ? (
            <span className="chip shrink-0 bg-tertiary-fixed px-2.5 py-1 text-on-tertiary-fixed">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-container" /> Urgent Priority
            </span>
          ) : (
            <span className="chip shrink-0 bg-secondary-fixed px-2.5 py-1 text-on-secondary-fixed">
              <Icon name="schedule" className="text-[14px]" /> Standard Window
            </span>
          )}
        </div>

        <div className="card relative overflow-hidden p-4">
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary-fixed/20 blur-xl" />
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-primary-container">
              <Icon name="water_drop" className="text-[26px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[11px] font-bold text-on-surface-variant">Reported {ticket.reportedAt}</span>
                <span className="h-1 w-1 rounded-full bg-outline-variant" />
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-primary">
                  <Icon name="auto_awesome" className="text-[14px]" /> AI Verified
                </span>
              </div>
              <h2 className="mt-0.5 text-[20px] font-semibold leading-snug text-on-surface">{ticket.title}</h2>
              <p className="mt-0.5 text-[14px] leading-relaxed text-on-surface-variant">Under P-Trap Joint • Continuous dripping noted under primary basin. Moisture barrier intact.</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold tracking-tight text-on-surface">Resolution Progress</h3>
            <span className="rounded-full bg-primary-fixed/30 px-2 py-0.5 text-[11px] font-bold text-primary">
              {stage === 'completed' ? 'Complete' : `Step ${stepNo} of 4`}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <Step state="done" icon="check" title="Issue Reported & Triage" time={ticket.reportedAt} desc="Automated diagnostics completed via mobile audit form." />
            <Step
              state={s(2)}
              icon="hourglass_top"
              title={stage === 'awaiting' ? 'Awaiting Landlord Approval' : 'Landlord Approved'}
              time={ticket.approvedAt || 'Pending'}
              desc={
                stage === 'awaiting'
                  ? `Landlord is reviewing AI triage · requested ${ticket.window}.`
                  : ticket.urgency === 'urgent'
                  ? 'Emergency protocol waived standard reserve threshold.'
                  : 'Approved within owner auto-limit budget.'
              }
            />
            <Step
              state={s(3)}
              icon="local_shipping"
              title={v ? `Vendor Assigned (${v.tech})` : 'Vendor Assignment'}
              desc={v ? (stage === 'completed' ? `${v.company} completed on-site repair.` : 'Technician en route in specialized plumbing service vehicle.') : 'Verified pro will be matched after approval.'}
              time="Pending"
              badge={stage === 'dispatched' ? <span className="shrink-0 rounded bg-tertiary-fixed/60 px-1.5 py-0.5 text-[11px] font-bold text-tertiary-container">In Transit</span> : undefined}
            />
            <Step
              state={s(4)}
              icon="verified"
              title="Work Verification & Payout"
              time={ticket.completedAt || 'Pending'}
              desc={stage === 'completed' ? `You signed off · ${'★'.repeat(ticket.rating)} · vendor payout released.` : 'Resident final walkthrough & automated vendor payout release.'}
              last
            />
          </div>
          {stage === 'dispatched' && (
            <button onClick={() => setSignOpen(true)} className="btn-primary mt-4 w-full bg-primary hover:bg-primary-container">
              <Icon name="rate_review" className="text-[18px]" /> Work done? Review & Sign Off
            </button>
          )}
        </div>

        {v ? (
          <div className="card p-4">
            <div className="mb-4 flex items-center justify-between border-b border-indigo/10 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Assigned Specialist</span>
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-primary">
                <Icon name="verified" className="text-[16px]" /> Verified Vendor
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={v.techImg} alt={v.tech} className="h-14 w-14 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary-container text-white">
                  <Icon name="check" className="text-[12px]" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[16px] font-semibold text-on-surface">{v.tech}</h4>
                  {v.rating && (
                    <span className="inline-flex items-center text-[11px] font-bold text-tertiary-container">
                      <Icon name="star" fill className="text-[14px]" /> {v.rating}
                    </span>
                  )}
                </div>
                <p className="truncate text-[12px] text-on-surface-variant">
                  {v.company}
                  {v.license ? ` • Lic #${v.license}` : ''}
                </p>
                <div className="mt-0.5 inline-flex items-center gap-0.5 text-[12px] font-medium text-secondary">
                  <Icon name="schedule" className="text-[14px]" /> ETA Window: <strong className="ml-0.5">{v.eta}</strong>
                </div>
              </div>
            </div>
            {stage !== 'completed' && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={() => setNoteOpen((o) => !o)} className="flex h-11 items-center justify-center gap-1 rounded-lg border-[1.5px] border-secondary bg-white text-[14px] font-semibold text-secondary hover:bg-secondary-fixed/40 active:scale-[0.98]">
                  <Icon name="chat_bubble" className="text-[18px]" /> Message {v.tech.split(' ')[0]}
                </button>
                <button onClick={() => showToast(`Calling ${v.tech} · ${v.phone || '(512) 555-0142'}`, 'call')} className="flex h-11 items-center justify-center gap-1 rounded-lg bg-indigo text-[14px] font-semibold text-white hover:bg-indigo/90 active:scale-[0.98]">
                  <Icon name="call" className="text-[18px]" /> Call Technician
                </button>
              </div>
            )}
            {noteOpen && stage !== 'completed' && (
              <div className="mt-3 rounded-lg bg-surface-container-low p-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-secondary">Direct Note to {v.tech.split(' ')[0]}</span>
                  <button onClick={() => setNoteOpen(false)} className="text-on-surface-variant hover:text-on-surface" aria-label="Close note">
                    <Icon name="close" className="text-[16px]" />
                  </button>
                </div>
                {ticket.messages.length > 0 && (
                  <div className="mb-2 flex flex-col items-end gap-1">
                    {ticket.messages.map((m, i) => (
                      <div key={i} className="max-w-[85%] rounded-xl rounded-br-sm bg-secondary px-3 py-1.5 text-[12px] text-white">
                        {m.text}
                        <span className="ml-2 text-[10px] opacity-70">{m.at}</span>
                      </div>
                    ))}
                    <div className="self-start rounded-xl rounded-bl-sm bg-white px-3 py-1.5 text-[12px] text-on-surface">Got it, thanks! See you soon. — {v.tech.split(' ')[0]}</div>
                  </div>
                )}
                <form
                  className="flex gap-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                >
                  <input
                    value={draftMsg}
                    onChange={(e) => setDraftMsg(e.target.value)}
                    placeholder="e.g., Gate code is #4029..."
                    className="flex-1 rounded bg-white px-2 py-1.5 text-[12px] text-on-surface outline-none placeholder:text-outline focus:ring-1 focus:ring-primary"
                  />
                  <button type="submit" className="rounded bg-secondary px-3 py-1 text-[11px] font-bold text-white">
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="card flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-secondary">
              <Icon name="engineering" className="text-[24px]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Assigned Specialist</span>
              <h4 className="text-[15px] font-semibold text-on-surface">Matching a verified pro…</h4>
              <p className="text-[12px] text-on-surface-variant">Your landlord will pick from AI-ranked local vendors. You'll get an SMS when dispatched.</p>
            </div>
          </div>
        )}

        <div className="card p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed/40 text-primary">
              <Icon name="shield" className="text-[22px]" />
            </div>
            <div className="flex-1">
              <h4 className="text-[16px] font-semibold text-on-surface">Resident Zero-Charge Guarantee</h4>
              <p className="mt-0.5 text-[12px] leading-relaxed text-on-surface-variant">
                100% funded by property owner under standard residential covenant. You inspect and approve all repairs before the ticket formally closes.
              </p>
              <div className="mt-2 flex items-center gap-4 border-t border-surface-container-high pt-1.5 text-[11px] text-on-surface-variant">
                <span className="flex items-center gap-0.5">
                  <Icon name="verified_user" className="text-[16px] text-primary" /> Zero Out-of-Pocket
                </span>
                <span className="flex items-center gap-0.5">
                  <Icon name="rate_review" className="text-[16px] text-primary" /> Sign-off Approval
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={signOpen} onClose={() => setSignOpen(false)} title="Final Walkthrough" eyebrow={`Ticket #${ticket.id}`} icon="rate_review">
        <p className="mb-3 text-[13px] text-muted">Confirm the repair meets your standard. Signing off releases the vendor payout — you pay nothing.</p>
        {[
          ['fixed', 'Leak is fully stopped'],
          ['clean', 'Work area left clean'],
        ].map(([k, label]) => (
          <label key={k} className="mb-2 flex cursor-pointer items-center gap-2.5 rounded-xl border border-tint-border bg-tint p-3">
            <input type="checkbox" checked={checks[k]} onChange={(e) => setChecks((c) => ({ ...c, [k]: e.target.checked }))} className="h-4 w-4 accent-teal" />
            <span className="text-[13px] font-semibold text-indigo">{label}</span>
          </label>
        ))}
        <p className="mb-1 mt-3 text-[11px] font-bold uppercase tracking-wider text-muted">Rate {v?.tech}</p>
        <Stars value={rating} onChange={setRating} />
        <button
          disabled={!checks.fixed}
          onClick={() => {
            completeTicket(rating);
            setSignOpen(false);
            showToast('Signed off · vendor payout released', 'task_alt');
          }}
          className="btn-primary mt-4 w-full disabled:opacity-50"
        >
          Approve & Close Ticket
        </button>
        {!checks.fixed && (
          <button
            onClick={() => {
              setSignOpen(false);
              showToast('Follow-up visit requested', 'replay');
            }}
            className="mt-2 w-full py-2 text-[13px] font-semibold text-orange"
          >
            Request follow-up visit instead
          </button>
        )}
      </Sheet>
    </Screen>
  );
}
