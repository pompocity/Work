import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, Screen } from '../../components/ui.jsx';
import CategorySheet, { categoryOf } from '../../components/CategorySheet.jsx';
import { useApp } from '../../state/AppState.jsx';
import { IMAGES } from '../../data/mock.js';

const TONES = {
  teal: 'bg-primary/10 text-primary',
  orange: 'bg-tertiary-fixed text-tertiary',
  gray: 'bg-surface-container-high text-on-surface-variant',
  red: 'bg-error-container text-error',
};

const Q1 = [
  { id: 'stopped', title: 'Yes, leak stopped', sub: 'Shutoff successful, water flow halted', tag: 'Stable', tone: 'teal' },
  { id: 'dripping', title: 'Yes, but still dripping', sub: 'Seepage persists past valve seal', tag: 'Active', tone: 'orange' },
  { id: 'unknown', title: 'Cannot locate shutoff valve', sub: 'Requires technician assistance to locate', tag: 'Assistance', tone: 'gray' },
];
const Q2 = [
  { id: 'pooling', title: 'Pooling onto subfloor/cabinet', sub: 'Standing water present, risk of structural damage', tag: 'High Risk', tone: 'red' },
  { id: 'bucket', title: 'Contained in bucket', sub: 'Temporary catchment in place', tag: 'Contained', tone: 'teal' },
  { id: 'damp', title: 'Minor dampness only', sub: 'Surface moisture, no pooling', tag: 'Low', tone: 'gray' },
];

function Options({ name, options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 pt-1">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <label
            key={o.id}
            className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border bg-white p-3 transition-all ${active ? 'border-primary ring-1 ring-primary/30' : 'border-tint-border hover:border-primary/50'}`}
          >
            <div className="flex items-center gap-3">
              <input type="radio" name={name} checked={active} onChange={() => onChange(o.id)} className="h-4 w-4 accent-primary" />
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-on-surface">{o.title}</span>
                <span className="text-[12px] text-on-surface-variant">{o.sub}</span>
              </div>
            </div>
            <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${TONES[o.tone]}`}>{o.tag}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function AiTriage() {
  const navigate = useNavigate();
  const { draft, updateDraft, showToast } = useApp();
  const [catOpen, setCatOpen] = useState(false);
  const [rescanning, setRescanning] = useState(false);
  const [error, setError] = useState(false);
  const cat = categoryOf(draft.category);

  const retake = () => {
    setRescanning(true);
    setTimeout(() => {
      setRescanning(false);
      showToast('Re-scan complete · 98% confidence', 'auto_awesome');
    }, 1400);
  };

  const next = () => {
    if (draft.explanation.trim().length < 5) {
      setError(true);
      document.getElementById('ai_explanation')?.focus();
      return;
    }
    navigate('/tenant/review');
  };

  return (
    <Screen header={<AppHeader title="AI Diagnostic Triage" back="/tenant/report" bell={false} />} bg="bg-surface">
      <div className="flex flex-col gap-5 pb-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Step 1 of 2 • Interactive AI Diagnostic</span>
            <span className="text-[12px] font-medium text-on-surface-variant">50%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
            <div className="h-full w-1/2 rounded-full bg-primary" />
          </div>
        </div>

        <div className="card flex items-center justify-between p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary">
              <Icon name={cat.icon} fill className="text-[20px]" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Auto-Classified</span>
              <span className="text-[16px] font-semibold text-on-surface">{cat.label}</span>
            </div>
          </div>
          <button onClick={() => setCatOpen(true)} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-primary hover:bg-white">
            Change
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="relative aspect-[4/3] w-full bg-surface-container">
            <img src={IMAGES.ptrapTriage} alt="P-trap under kitchen sink" className={`h-full w-full object-cover transition-opacity ${rescanning ? 'opacity-40' : ''}`} />
            {rescanning && <div className="absolute inset-x-4 h-0.5 bg-tertiary-container shadow-[0_0_12px_#a53800] animate-scan" />}
            <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-inverse-surface/80 px-2 py-1 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-container" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-inverse-on-surface">{rescanning ? 'Re-scanning…' : 'AI Scanned Feed'}</span>
            </div>
            {!rescanning && (
              <div className="pointer-events-none absolute inset-x-[24%] bottom-[24%] top-[38%]">
                <div className="relative h-full w-full rounded bg-tertiary/10">
                  {['-left-1 -top-1', '-right-1 -top-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((p) => (
                    <span key={p} className={`absolute h-3 w-3 rounded-sm bg-tertiary-container ${p}`} />
                  ))}
                  <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded bg-tertiary-container px-2 py-0.5 text-white shadow-sm">
                    <Icon name="warning" className="text-[14px]" />
                    <span className="text-[11px] font-bold">P-trap seal degradation observed (98% Conf.)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-tint-border p-3">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Icon name="verified" className="text-[18px]" />
              <span className="text-[12px]">P-trap seal degradation observed</span>
            </div>
            <button onClick={retake} disabled={rescanning} className="flex items-center gap-1 text-[12px] font-semibold text-secondary hover:opacity-80">
              <Icon name="refresh" className={`text-[16px] ${rescanning ? 'animate-spin' : ''}`} /> Retake
            </button>
          </div>
        </div>

        <div className="card flex flex-col gap-5 p-5">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="smart_toy" className="text-[20px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Sentinel AI Diagnostic</span>
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-bold text-primary">Interactive</span>
              </div>
              <p className="mt-0.5 text-[12px] text-on-surface-variant">Dynamic triage in progress based on visual scan</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface">
              <span className="h-2 w-2 rounded-full bg-primary" /> Diagnostic Prompt 1
            </span>
            <h2 className="text-[16px] font-semibold text-on-surface">Active drip detected. Have you shut off the safety valve directly under the sink?</h2>
            <Options name="valve" options={Q1} value={draft.valve} onChange={(valve) => updateDraft({ valve })} />
          </div>

          <div className="h-px w-full bg-tint-border" />

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface">
              <span className="h-2 w-2 rounded-full bg-primary" /> Follow-up Prompt 2
            </span>
            <h3 className="text-[16px] font-semibold text-on-surface">Is water actively pooling onto drywall or cabinetry below?</h3>
            <Options name="pooling" options={Q2} value={draft.pooling} onChange={(pooling) => updateDraft({ pooling })} />
          </div>

          <div className="h-px w-full bg-tint-border" />

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="ai_explanation" className="flex items-center gap-1.5 text-[12px] font-bold text-on-surface">
                <Icon name="edit_note" className="text-[16px] text-primary" /> Explain to AI (Required context)
              </label>
              <span className="text-[11px] font-semibold text-primary">Directs Triage</span>
            </div>
            <textarea
              id="ai_explanation"
              rows={3}
              value={draft.explanation}
              onChange={(e) => {
                updateDraft({ explanation: e.target.value });
                if (error) setError(false);
              }}
              className={`w-full resize-none rounded-xl border bg-white p-3 text-[13px] text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/20 ${error ? 'border-error' : 'border-tint-border focus:border-primary'}`}
              placeholder="Describe specific symptoms, sound, smell, or recent changes (e.g. water pressure, hot/cold line, when drip started)..."
            />
            {error ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-error">Please add a short description so the AI can finalize triage.</span>
                <button
                  onClick={() => {
                    updateDraft({ explanation: 'Drip started this morning on the cold line side. Slow steady drip, no smell. Water pressure seems normal.' });
                    setError(false);
                  }}
                  className="shrink-0 text-[11px] font-bold text-primary underline"
                >
                  Use sample
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Icon name="info" className="text-[14px] text-primary" />
                <span className="text-[11px] leading-tight">Detailed tenant context directly informs triage accuracy and pre-authorizes toolkits for dispatch.</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <button onClick={next} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-tertiary-container px-4 py-3 text-[14px] font-semibold text-white shadow-md transition-all hover:bg-tertiary active:scale-[0.99]">
            Continue to Review & Urgency Revision (Step 2) <Icon name="arrow_forward" className="text-[20px]" />
          </button>
          <p className="mt-2 text-center text-[12px] text-on-surface-variant">Review AI triage findings and adjust dispatch priority</p>
        </div>
      </div>
      <CategorySheet open={catOpen} onClose={() => setCatOpen(false)} value={draft.category} onChange={(category) => updateDraft({ category })} />
    </Screen>
  );
}
