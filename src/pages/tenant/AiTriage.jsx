import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppHeader, Icon, Screen } from '../../components/ui.jsx';
import CategorySheet, { categoryOf } from '../../components/CategorySheet.jsx';
import { useApp } from '../../state/AppState.jsx';
import { IMAGES } from '../../data/mock.js';

const TONES = {
  teal: 'bg-primary/10 text-primary',
  orange: 'bg-tertiary-fixed text-tertiary',
  gray: 'bg-surface-container-high text-on-surface-variant',
  red: 'bg-error-container text-error',
  indigo: 'bg-secondary-fixed text-secondary',
};

// Successive AI prompts. Each answer is an option id or 'other' (free text).
const PROMPTS = [
  {
    key: 'valve',
    lead: 'Active drip detected.',
    question: 'Have you shut off the safety valve directly under the sink?',
    options: [
      { id: 'stopped', title: 'Yes, leak stopped', sub: 'Shutoff successful, water flow halted', tag: 'Stable', tone: 'teal' },
      { id: 'dripping', title: 'Yes, but still dripping', sub: 'Seepage persists past valve seal', tag: 'Active', tone: 'orange' },
      { id: 'unknown', title: 'Cannot locate shutoff valve', sub: 'Requires technician assistance to locate', tag: 'Assistance', tone: 'gray' },
    ],
  },
  {
    key: 'pooling',
    lead: 'Checking for water damage.',
    question: 'Is water actively pooling onto drywall or cabinetry below?',
    options: [
      { id: 'pooling', title: 'Pooling onto subfloor/cabinet', sub: 'Standing water present, risk of structural damage', tag: 'High Risk', tone: 'red' },
      { id: 'bucket', title: 'Contained in bucket', sub: 'Temporary catchment in place', tag: 'Contained', tone: 'teal' },
      { id: 'damp', title: 'Minor dampness only', sub: 'Surface moisture, no pooling', tag: 'Low', tone: 'gray' },
    ],
  },
  {
    key: 'onset',
    lead: 'Almost done.',
    question: 'When did you first notice the leak, and is it changing?',
    options: [
      { id: 'today', title: 'Just started today', sub: 'First noticed within the last few hours', tag: 'New', tone: 'indigo' },
      { id: 'ongoing', title: 'Slow drip for a few days', sub: 'Steady rate, not getting worse', tag: 'Ongoing', tone: 'gray' },
      { id: 'worsening', title: 'Getting worse quickly', sub: 'Drip rate or puddle size increasing', tag: 'Escalating', tone: 'red' },
    ],
  },
];

function Option({ active, onClick, title, sub, tag, tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white p-3 text-left transition-all ${active ? 'border-primary ring-1 ring-primary/30' : 'border-tint-border hover:border-primary/50'}`}
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-primary' : 'border-outline'}`}>
          {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
        </span>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-on-surface">{title}</span>
          <span className="text-[12px] text-on-surface-variant">{sub}</span>
        </div>
      </div>
      <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${TONES[tone]}`}>{tag}</span>
    </button>
  );
}

export default function AiTriage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { draft, updateDraft, showToast } = useApp();
  const [catOpen, setCatOpen] = useState(false);
  const [rescanning, setRescanning] = useState(false);
  const [thinking, setThinking] = useState(false);
  const cat = categoryOf(draft.category);

  const step = Math.min(Math.max(Number(params.get('q')) || 1, 1), PROMPTS.length);
  const prompt = PROMPTS[step - 1];
  const answer = draft[prompt.key];
  const otherText = draft.otherText?.[prompt.key] || '';
  const answered = answer && (answer !== 'other' || otherText.trim().length > 0);
  const isLast = step === PROMPTS.length;

  // Don't allow skipping ahead via the URL past an unanswered prompt.
  useEffect(() => {
    const firstOpen = PROMPTS.findIndex((p) => !draft[p.key] || (draft[p.key] === 'other' && !draft.otherText?.[p.key]?.trim()));
    if (firstOpen >= 0 && step > firstOpen + 1) setParams({ q: String(firstOpen + 1) }, { replace: true });
  }, [step, draft, setParams]);

  useEffect(() => {
    if (answer === 'other') document.getElementById('ai_explanation')?.focus();
  }, [answer]);

  const choose = (id) => updateDraft({ [prompt.key]: id });
  const setOther = (text) => updateDraft({ otherText: { ...draft.otherText, [prompt.key]: text } });

  const retake = () => {
    setRescanning(true);
    setTimeout(() => {
      setRescanning(false);
      showToast('Re-scan complete · 98% confidence', 'auto_awesome');
    }, 1400);
  };

  const next = () => {
    if (!answered) return;
    if (isLast) return navigate('/tenant/review');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setParams({ q: String(step + 1) });
      window.scrollTo(0, 0);
    }, 700);
  };

  const pct = Math.round((step - 1 + (answered ? 1 : 0)) * (50 / PROMPTS.length));

  return (
    <Screen header={<AppHeader title="AI Diagnostic Triage" back={step > 1 ? `/tenant/triage?q=${step - 1}` : '/tenant/report'} bell={false} />} bg="bg-surface">
      <div className="flex flex-col gap-5 pb-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Step 1 of 2 • Interactive AI Diagnostic</span>
            <span className="text-[12px] font-medium text-on-surface-variant">{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
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

        {step === 1 ? (
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
                      <span className="text-[11px] font-bold">P-trap seal degradation observed (98% Confidence)</span>
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
        ) : (
          <div className="card flex items-center gap-3 p-2.5">
            <img src={IMAGES.ptrapTriage} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-on-surface">P-trap seal degradation observed</p>
              <p className="text-[11px] font-bold text-primary">98% Confidence · AI Scanned Feed</p>
            </div>
            <Icon name="verified" className="text-[20px] text-primary" />
          </div>
        )}

        <div className="card flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-2">
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
          </div>

          <div className="flex items-center gap-1.5" aria-label={`Question ${step} of ${PROMPTS.length}`}>
            {PROMPTS.map((p, i) => (
              <div key={p.key} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step - 1 || (i === step - 1 && answered) ? 'bg-primary' : i === step - 1 ? 'bg-primary/30' : 'bg-surface-container-high'}`} />
            ))}
            <span className="ml-1 shrink-0 text-[11px] font-bold text-on-surface-variant">
              {step} of {PROMPTS.length}
            </span>
          </div>

          {thinking ? (
            <div className="flex flex-col items-center gap-2 py-10 text-on-surface-variant">
              <div className="flex gap-1.5">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
              <span className="text-[12px] font-semibold">Sentinel AI is analyzing your answer…</span>
            </div>
          ) : (
            <div key={prompt.key} className="animate-sheet flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-primary">{prompt.lead}</span>
              <h2 className="text-[17px] font-semibold leading-snug text-on-surface">{prompt.question}</h2>
              <div className="flex flex-col gap-1.5 pt-2" role="radiogroup">
                {prompt.options.map((o) => (
                  <Option key={o.id} {...o} active={answer === o.id} onClick={() => choose(o.id)} />
                ))}
                <Option active={answer === 'other'} onClick={() => choose('other')} title="Other" sub="Describe it in your own words" tag="Custom" tone="indigo" />
              </div>

              {answer === 'other' && (
                <div className="animate-fade mt-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="ai_explanation" className="flex items-center gap-1.5 text-[12px] font-bold text-on-surface">
                      <Icon name="edit_note" className="text-[16px] text-primary" /> Explain to AI
                    </label>
                    <span className="text-[11px] font-semibold text-primary">Directs Triage</span>
                  </div>
                  <textarea
                    id="ai_explanation"
                    rows={3}
                    value={otherText}
                    onChange={(e) => setOther(e.target.value)}
                    className="w-full resize-none rounded-xl border border-tint-border bg-white p-3 text-[13px] text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Describe specific symptoms, sound, smell, or recent changes (e.g. water pressure, hot/cold line, when drip started)..."
                  />
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <Icon name="info" className="text-[14px] text-primary" />
                    <span className="text-[11px] leading-tight">Detailed tenant context directly informs triage accuracy and pre-authorizes toolkits for dispatch.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          {isLast ? (
            <button
              onClick={next}
              disabled={!answered}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-tertiary-container px-4 py-3 text-[14px] font-semibold text-white shadow-md transition-all hover:bg-tertiary active:scale-[0.99] disabled:opacity-40 disabled:shadow-none"
            >
              Continue to Review & Urgency Revision (Step 2) <Icon name="arrow_forward" className="text-[20px]" />
            </button>
          ) : (
            <button onClick={next} disabled={!answered || thinking} className="btn-primary h-12 w-full disabled:opacity-40">
              Next Question <Icon name="arrow_forward" className="text-[20px]" />
            </button>
          )}
          <p className="mt-2 text-center text-[12px] text-on-surface-variant">
            {answered
              ? isLast
                ? 'Review AI triage findings and adjust dispatch priority'
                : `Question ${step + 1} of ${PROMPTS.length} next`
              : answer === 'other'
              ? 'Type a short explanation to continue'
              : 'Select an answer to continue'}
          </p>
        </div>
      </div>
      <CategorySheet open={catOpen} onClose={() => setCatOpen(false)} value={draft.category} onChange={(category) => updateDraft({ category })} />
    </Screen>
  );
}
