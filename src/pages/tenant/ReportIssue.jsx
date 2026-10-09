import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppHeader, Icon, Screen } from '../../components/ui.jsx';
import CategorySheet, { categoryOf } from '../../components/CategorySheet.jsx';
import { useApp } from '../../state/AppState.jsx';
import { IMAGES } from '../../data/mock.js';

const TIERS = [
  { id: 'urgent', label: 'Urgent', sub: '< 2 hrs', icon: 'priority_high', active: 'border-orange bg-orange/[0.05]', iconBox: 'bg-orange text-white', check: 'text-orange', subTone: 'text-orange' },
  { id: 'standard', label: 'Standard', sub: '24–48 hrs', icon: 'schedule', active: 'border-indigo bg-indigo/[0.04]', iconBox: 'bg-indigo/10 text-indigo', check: 'text-indigo', subTone: 'text-indigo/60' },
  { id: 'flexible', label: 'Flexible', sub: '3–5 days', icon: 'event_available', active: 'border-teal bg-teal/[0.05]', iconBox: 'bg-teal/10 text-teal', check: 'text-teal', subTone: 'text-indigo/60' },
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { draft, updateDraft, showToast } = useApp();
  const [catOpen, setCatOpen] = useState(false);
  const [scanning, setScanning] = useState(params.get('photo') === '1');
  const cat = categoryOf(draft.category);

  useEffect(() => {
    if (!scanning) return;
    const t = setTimeout(() => {
      setScanning(false);
      showToast('Frame captured & analyzed', 'photo_camera');
    }, 1600);
    return () => clearTimeout(t);
  }, [scanning, showToast]);

  const footer = (
    <div className="sticky bottom-0 z-40 border-t border-tint-border bg-tint-light/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <button onClick={() => navigate('/tenant/triage')} className="btn-orange h-12 w-full text-[15px]">
        Proceed to Issue Triage <Icon name="arrow_forward" className="text-[20px]" />
      </button>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[12px] font-semibold text-indigo/70">
        <Icon name="verified_user" className="text-[16px] text-teal" /> Feeds directly to Landlord portal
      </p>
    </div>
  );

  return (
    <Screen header={<AppHeader title="Issue Report" back="/tenant/home" bell={false} />} footer={footer} bg="bg-cream-dim">
      <div className="flex flex-col gap-4">
        <div className="card rounded-xl p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo/80">Initial Intake • Issue Capture</span>
            <span className="rounded-md bg-teal/10 px-2 py-0.5 text-xs font-bold text-teal">Draft</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E0DDD8]">
            <div className="h-full w-1/4 rounded-full bg-teal" />
          </div>
        </div>

        <div className="card flex items-center justify-between p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal/20 bg-teal/10 text-teal">
              <Icon name={cat.icon} fill className="text-[22px]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo/60">Report Category</p>
              <p className="truncate text-[16px] font-bold text-indigo">{cat.label}</p>
            </div>
          </div>
          <button onClick={() => setCatOpen(true)} className="flex shrink-0 items-center gap-1 rounded-lg border border-tint-border bg-tint-deep px-3 py-1.5 text-xs font-semibold text-indigo hover:bg-white">
            Edit <Icon name="edit" className="text-[15px]" />
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="relative h-52 w-full overflow-hidden bg-neutral-900">
            {scanning ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
                <div className="absolute inset-x-6 h-0.5 bg-orange/80 shadow-[0_0_12px_#e65100] animate-scan" />
                <Icon name="photo_camera" className="text-[40px] opacity-80" />
                <span className="text-sm font-semibold">Capturing & analyzing frame…</span>
              </div>
            ) : (
              <>
                <img src={IMAGES.ptrapReport} alt="Under-sink P-trap with active drip" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-orange" /> Live Frame Analyzed
                    </span>
                    <button onClick={() => setScanning(true)} className="flex items-center gap-1 rounded border border-white/10 bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
                      <Icon name="refresh" className="text-[13px]" /> Retake
                    </button>
                  </div>
                  <div className="relative my-auto self-center">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-orange bg-orange/15">
                      <Icon name="water_drop" fill className="animate-bounce text-[28px] text-orange" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-mono text-[11px] opacity-90">
                      <Icon name="photo_camera" className="text-[14px]" /> IMG_8820.HEIC
                    </span>
                    <span className="rounded-full border border-teal/40 bg-teal/90 px-2.5 py-0.5 text-[11px] font-medium">Unit 2B • Under-sink</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-tint-border bg-tint-deep p-3.5">
            <p className="flex min-w-0 items-center gap-2 truncate text-sm font-semibold text-indigo">
              <Icon name="warning" fill className="shrink-0 text-[20px] text-orange" /> Active drip at P-trap joint
            </p>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-teal/20 bg-teal/10 px-2.5 py-1 text-xs font-bold text-teal">
              <Icon name="verified" className="text-[14px]" /> 98% Confidence
            </span>
          </div>
        </div>

        <div className="card flex flex-col gap-3.5 p-4">
          <div>
            <h3 className="text-sm font-bold text-indigo">Tenant Urgency Assessment</h3>
            <p className="text-xs text-indigo/60">Specify how this issue impacts your living conditions</p>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {TIERS.map((t) => {
              const active = draft.urgency === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => updateDraft({ urgency: t.id })}
                  className={`flex flex-col rounded-xl p-3 text-left transition-all ${active ? `border-2 shadow-sm ${t.active}` : 'border border-tint-border bg-tint-deep hover:bg-white'}`}
                >
                  <div className="mb-2 flex w-full items-start justify-between">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${t.iconBox}`}>
                      <Icon name={t.icon} className="text-[16px]" />
                    </div>
                    <Icon name={active ? 'check_circle' : 'radio_button_unchecked'} fill={active} className={`text-[18px] ${active ? t.check : 'text-indigo/30'}`} />
                  </div>
                  <p className="text-xs font-bold text-indigo">{t.label}</p>
                  <p className={`text-[11px] font-medium ${active ? t.subTone : 'text-indigo/60'}`}>{t.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card flex items-center gap-3.5 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal/20 bg-teal/10 text-teal">
            <Icon name="real_estate_agent" className="text-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-bold text-indigo">Direct to Landlord Review</p>
              <span className="shrink-0 rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-bold uppercase text-teal">Instant Sync</span>
            </div>
            <p className="text-xs font-medium text-indigo/70">Includes AI diagnostic telemetry & fair market cost estimate</p>
          </div>
        </div>
      </div>
      <CategorySheet open={catOpen} onClose={() => setCatOpen(false)} value={draft.category} onChange={(category) => updateDraft({ category })} />
    </Screen>
  );
}
