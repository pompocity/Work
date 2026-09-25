import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, Screen, Sheet } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { IMAGES, WINDOWS } from '../../data/mock.js';

const TITLES = {
  plumbing: 'Kitchen Sink Leak',
  electrical: 'Outlet / Lighting Fault',
  hvac: 'HVAC Not Cooling',
  appliance: 'Appliance Malfunction',
  pest: 'Pest Sighting',
  other: 'General Maintenance',
};

export default function ReviewUrgency() {
  const navigate = useNavigate();
  const { draft, submitReport, resetDraft } = useApp();
  const aiUrgent = draft.pooling === 'pooling' || draft.valve !== 'stopped';
  const recommended = aiUrgent ? 'urgent' : 'standard';
  const [tier, setTier] = useState(recommended);
  const [note, setNote] = useState('');
  const [slot, setSlot] = useState(0);
  const [noteError, setNoteError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const needsReason = tier === 'urgent' && recommended !== 'urgent';

  const submit = () => {
    if (needsReason && note.trim().length < 5) {
      setNoteError(true);
      document.getElementById('tenant-note')?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const w = WINDOWS[slot];
      submitReport({
        title: TITLES[draft.category],
        category: draft.category,
        urgency: tier,
        window: `${w.day} · ${w.time}`,
        note,
        description: draft.description,
      });
      resetDraft();
      setSubmitting(false);
      setDone(true);
    }, 1300);
  };

  const card = (id) => {
    const active = tier === id;
    return `relative cursor-pointer rounded-2xl p-4 text-left transition-all duration-200 bg-tint ${
      active ? (id === 'urgent' ? 'border-2 border-tertiary shadow-md' : 'border-2 border-primary shadow-md') : 'border border-tint-border opacity-90 hover:opacity-100'
    }`;
  };
  const Radio = ({ on, tone }) => (
    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${on ? `${tone} text-white` : 'bg-surface-container text-transparent'}`}>
      <Icon name="check" className="text-[16px]" />
    </div>
  );

  return (
    <Screen header={<AppHeader title="AI Diagnostic Triage" back="/tenant/triage" bell={false} />} bg="bg-surface">
      <div className="flex flex-col gap-6 pb-4">
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                <Icon name="check" fill className="text-[14px]" />
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">Step 2 of 2 • Review & Revise AI Triage</span>
            </div>
            <span className="text-[11px] font-semibold text-primary">100% Ready</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
            <div className="h-full w-full rounded-full bg-primary" />
          </div>
        </section>

        <section className="card flex flex-col gap-2 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-fixed text-on-secondary-fixed">
                <Icon name="smart_toy" className="text-[18px]" />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-on-surface">AI Vision & Diagnostic Verdict</h2>
                <p className="text-[12px] text-on-surface-variant">Analyzed 2 photos & audio clip</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded border border-tint-border bg-white px-1.5 py-0.5 text-[11px] font-bold text-secondary">
              <Icon name="check_circle" fill className="text-[12px] text-primary" /> AI Evaluated
            </span>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-tint-border bg-white p-2">
            <img src={IMAGES.ptrapThumb} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-on-surface">Plumbing: P-trap seal failure</p>
              <p className="line-clamp-2 text-[12px] text-on-surface-variant">
                {aiUrgent
                  ? 'Active seepage reported past shutoff or pooling risk. Structural substrate saturation possible — expedited dispatch advised.'
                  : 'Water contained; safety shutoff verified. Continuous low drip detected without structural substrate saturation.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-1.5 py-1 text-[11px] font-bold text-primary">
              <Icon name="recommend" className="text-[14px]" />
              AI Recommended: {aiUrgent ? 'Urgent Dispatch (< 2 Hours)' : 'Standard Window (24–48 Hours)'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-tint-border bg-white px-1.5 py-1 text-[11px] font-bold text-on-surface-variant">
              <Icon name="payments" className="text-[14px] text-outline" />
              {aiUrgent ? 'Active hazard.' : 'Non-imminent hazard.'} Pre-approved benchmark $120–$240.
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-[20px] font-bold tracking-tight text-indigo">Review or Revise Urgency Tier</h3>
              <span className="text-[12px] text-outline">Tap to adjust</span>
            </div>
            <p className="text-[12px] leading-relaxed text-on-surface-variant">
              The landlord reviews your notes before assigning a vendor. If you believe the AI recommendation is inaccurate or if conditions change, specify your requested tier and justification below.
            </p>
          </div>

          <button className={card('standard')} onClick={() => setTier('standard')}>
            <div className="mb-1 flex items-start justify-between">
              <span className={`chip rounded ${recommended === 'standard' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                <Icon name={recommended === 'standard' ? 'thumb_up' : 'tune'} className="text-[12px]" />
                {recommended === 'standard' ? 'AI Recommended Tier' : 'Tenant Revision Option'}
              </span>
              <Radio on={tier === 'standard'} tone="bg-primary" />
            </div>
            <h4 className="text-[20px] font-semibold text-on-surface">Standard Window</h4>
            <div className="flex items-center gap-1 text-[16px] font-semibold text-primary">
              <Icon name="schedule" className="text-[18px]" /> 24–48 Hours Regular Queue
            </div>
            <p className="pt-0.5 text-[12px] text-on-surface-variant">
              Routine triage workflow. Technician arrives within standard operating hours (8 AM – 5 PM). Fits non-imminent maintenance benchmark.
            </p>
          </button>

          <button className={card('urgent')} onClick={() => setTier('urgent')}>
            <div className="mb-1 flex items-start justify-between">
              <span className="chip rounded bg-tertiary-fixed text-on-tertiary-fixed-variant">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary" />
                {recommended === 'urgent' ? 'AI Recommended Tier' : 'Tenant Revision Option'}
              </span>
              <Radio on={tier === 'urgent'} tone="bg-tertiary" />
            </div>
            <h4 className="text-[20px] font-semibold text-on-surface">Request Urgent Dispatch</h4>
            <div className="flex items-center gap-1 text-[16px] font-semibold text-tertiary">
              <Icon name="bolt" className="text-[18px]" /> &lt; 2 Hours Arrival SLA
            </div>
            <p className="pt-0.5 text-[12px] text-on-surface-variant">
              Immediate dispatch request forwarded to property manager. Please provide reason below for prompt authorization.
            </p>
          </button>

          <div className={`rounded-2xl border bg-tint p-3 ${noteError ? 'border-error' : 'border-tint-border'}`}>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="tenant-note" className="flex items-center gap-1 text-[16px] font-semibold text-on-surface">
                <Icon name="edit_note" className="text-[18px] text-primary" /> Reason for Revision / Note to Landlord
              </label>
              <span className={`shrink-0 text-[11px] font-bold ${needsReason ? 'text-tertiary' : 'text-on-surface-variant'}`}>{needsReason ? 'Required' : 'Optional if standard'}</span>
            </div>
            <p className="mb-1.5 text-[12px] text-on-surface-variant">Why does this need faster dispatch? (Landlord authorization required for tier escalation)</p>
            <textarea
              id="tenant-note"
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setNoteError(false);
              }}
              placeholder="Explain why immediate dispatch is needed (e.g., bucket overflowing rapidly, tenant traveling tomorrow morning, leak worsening)..."
              className="w-full rounded-xl border border-tint-border bg-white p-2 text-[14px] text-on-surface focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {noteError && <p className="mt-1 text-[11px] font-semibold text-error">Add a short reason so your landlord can authorize the escalation.</p>}
          </div>
        </section>

        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-semibold text-on-surface">Preferred Arrival Window</span>
            <span className="text-[11px] font-bold uppercase text-on-surface-variant">Local Time</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {WINDOWS.map((w, i) => (
              <button
                key={i}
                onClick={() => setSlot(i)}
                className={`flex flex-col items-center justify-center rounded-lg px-1 py-2 text-center shadow-sm transition-all ${slot === i ? 'bg-indigo text-white' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
              >
                <span className="text-[12px] font-semibold leading-tight">{w.day}</span>
                <span className={`text-[12px] ${slot === i ? 'opacity-90' : 'text-on-surface-variant'}`}>{w.time}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card flex items-start gap-2 p-3">
          <div className="shrink-0 rounded-xl bg-tertiary-fixed p-1 text-on-tertiary-fixed">
            <Icon name="emergency_home" className="text-[22px]" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-x-2">
              <h5 className="text-[16px] font-semibold text-on-surface">Utmost Urgency Override</h5>
              <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">(Gas, Floods, Electrical)</span>
            </div>
            <p className="text-[12px] leading-relaxed text-on-surface-variant">
              Immediate emergency dispatch overrides are reserved for life safety hazards (e.g. natural gas smell, uncontrolled main line rupture). These bypass standard triage and trigger instant 24/7 landlord & vendor emergency alerts.
            </p>
          </div>
        </section>

        <section>
          <button
            onClick={submit}
            disabled={submitting}
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-[16px] font-semibold text-white shadow-lg transition-all active:scale-[0.98] ${tier === 'urgent' ? 'bg-tertiary hover:bg-tertiary-container' : 'bg-indigo hover:bg-indigo/90'}`}
          >
            {submitting ? (
              <>
                <Icon name="progress_activity" className="animate-spin text-[20px]" /> Sending to Landlord…
              </>
            ) : (
              <>
                {tier === 'urgent' ? 'Submit Urgent Request to Landlord' : 'Submit Triage to Landlord for Approval'}
                <Icon name="arrow_forward" className="text-[20px]" />
              </>
            )}
          </button>
          <p className="mt-1 px-2 text-center text-[12px] text-on-surface-variant">Landlord will review AI diagnosis and tenant notes to authorize budget and dispatch vendor.</p>
        </section>
      </div>

      <Sheet open={done} onClose={() => navigate('/tenant/tracker')} title="Submitted to Landlord" eyebrow="Ticket #9042" icon="task_alt">
        <p className="text-[13px] leading-relaxed text-muted">
          Your AI triage, photos and notes were synced to the landlord portal. You'll be notified the moment a verified vendor is dispatched.
        </p>
        <div className="my-4 flex flex-col gap-1.5 rounded-xl bg-tint p-3 text-[12px]">
          <div className="flex justify-between">
            <span className="text-muted">Requested tier</span>
            <span className="font-bold text-indigo">{tier === 'urgent' ? 'Urgent · < 2 hrs' : 'Standard · 24–48 hrs'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Arrival window</span>
            <span className="font-bold text-indigo">
              {WINDOWS[slot].day} · {WINDOWS[slot].time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Cost to you</span>
            <span className="font-bold text-teal">$0 · Landlord covered</span>
          </div>
        </div>
        <button onClick={() => navigate('/tenant/tracker')} className="btn-primary w-full">
          Track Request <Icon name="arrow_forward" className="text-[18px]" />
        </button>
        <button onClick={() => navigate('/tenant/home')} className="mt-2 w-full py-2 text-[13px] font-semibold text-muted hover:text-indigo">
          Back to Home
        </button>
      </Sheet>
    </Screen>
  );
}
