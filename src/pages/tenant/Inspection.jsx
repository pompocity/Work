import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, Screen } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';

const CLIP_SECONDS = 6;

function CameraModal({ room, onClose, onSave }) {
  const [phase, setPhase] = useState('init'); // init | rec | review
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (phase === 'init') {
      const t = setTimeout(() => setPhase('rec'), 900);
      return () => clearTimeout(t);
    }
    if (phase === 'rec') {
      const t = setInterval(() => setSecs((s) => s + 1), 1000);
      return () => clearInterval(t);
    }
  }, [phase]);

  useEffect(() => {
    if (secs >= CLIP_SECONDS) setPhase('review');
  }, [secs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade">
      <div className="relative flex h-full max-h-[760px] w-full max-w-app flex-col bg-neutral-950 text-white">
        <div className="flex items-center justify-between p-4">
          <button onClick={onClose} aria-label="Close camera" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Icon name="close" className="text-[22px]" />
          </button>
          <span className="text-sm font-semibold">{room.name}</span>
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${phase === 'rec' ? 'bg-red-600' : 'bg-white/10'}`}>
            <span className={`h-2 w-2 rounded-full ${phase === 'rec' ? 'animate-pulse bg-white' : 'bg-white/50'}`} />
            00:{String(secs).padStart(2, '0')}
          </span>
        </div>
        <div className="relative mx-4 flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900">
          <Icon name={room.icon} className="text-[96px] text-white/15" />
          <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-dashed border-white/25" />
          {phase === 'rec' && <div className="absolute inset-x-6 h-0.5 bg-teal shadow-[0_0_14px_#00695c] animate-scan" />}
          <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/60 p-2.5 text-center text-xs backdrop-blur">
            {phase === 'init' && 'Initializing lens…'}
            {phase === 'rec' && 'Pan slowly across faucets, drains and under-cabinet areas'}
            {phase === 'review' && (
              <span className="flex items-center justify-center gap-1 font-semibold text-primary-fixed">
                <Icon name="auto_awesome" className="text-[16px]" /> AI clarity check passed · no new damage detected
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 p-6">
          {phase === 'review' ? (
            <>
              <button
                onClick={() => {
                  setSecs(0);
                  setPhase('rec');
                }}
                className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold"
              >
                Retake
              </button>
              <button onClick={onSave} className="flex items-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-bold">
                <Icon name="check" className="text-[18px]" /> Save Clip
              </button>
            </>
          ) : (
            <button onClick={() => phase === 'rec' && setPhase('review')} aria-label="Stop recording" className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white">
              <span className={`bg-red-600 transition-all ${phase === 'rec' ? 'h-6 w-6 rounded-md' : 'h-12 w-12 rounded-full'}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Inspection() {
  const navigate = useNavigate();
  const { rooms, completeRoom, inspectionSubmitted, submitInspection, inspectionCadence, showToast } = useApp();
  const [camera, setCamera] = useState(null);
  const doneCount = rooms.filter((r) => r.done).length;
  const pct = Math.round((doneCount / rooms.length) * 100);
  const nextRoom = rooms.find((r) => !r.done);

  const footer = (
    <footer className="sticky bottom-0 z-40 border-t border-tint-border bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-2">
        {nextRoom ? (
          <button onClick={() => setCamera(nextRoom)} className="btn-primary h-12 text-base font-semibold">
            <Icon name="fiber_manual_record" fill className="animate-pulse text-[20px] text-red-400" /> Record Next Room ({nextRoom.name})
          </button>
        ) : (
          <button
            disabled={inspectionSubmitted}
            onClick={() => {
              submitInspection();
              showToast('Inspection submitted · deposit protected', 'verified_user');
            }}
            className="btn-primary h-12 bg-teal text-base font-semibold hover:bg-teal-dark disabled:opacity-60"
          >
            <Icon name={inspectionSubmitted ? 'task_alt' : 'send'} className="text-[20px]" />
            {inspectionSubmitted ? 'Submitted to Landlord' : 'Submit Walkthrough to Landlord'}
          </button>
        )}
        <button
          onClick={() => {
            showToast('Draft saved', 'save');
            navigate('/tenant/home');
          }}
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#E0DDD8] bg-cream-dim text-sm font-medium text-slate-700 hover:bg-[#E0DDD8]/60"
        >
          <Icon name="save" className="text-[18px] text-slate-500" /> {nextRoom ? 'Save Draft & Exit' : 'Back to Home'}
        </button>
      </div>
    </footer>
  );

  return (
    <Screen header={<AppHeader title="Inspection Walkthrough" back="/tenant/home" bell={false} />} footer={footer} bg="bg-cream-dim" className="px-4 pb-6 pt-4">
      <div className="flex flex-col gap-4">
        <section className="card space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo/10 px-3 py-1 text-xs font-medium text-indigo">
              <Icon name="event_note" className="text-[15px]" /> {inspectionCadence} • Due in 12 days • Oct 30
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold leading-snug tracking-tight text-slate-900">Video Walkthrough</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">Self-guided room scan</p>
          </div>
          <div className="space-y-2.5 rounded-xl border border-tint-border bg-tint-deep p-3.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <Icon name="pie_chart" fill className="text-[20px] text-teal" /> {doneCount} of {rooms.length} Rooms Verified
              </span>
              <span className="text-sm font-bold text-teal">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E0DDD8]">
              <div className="h-full rounded-full bg-teal transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-medium">
                <Icon name="timer" className="text-[14px]" /> {nextRoom ? `~${(rooms.length - doneCount) * 1} minutes left` : 'Complete'}
              </span>
              <span className="font-medium text-slate-600">High Precision Audit</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">

          {rooms.map((r) => {
            if (r.done)
              return (
                <div key={r.id} className="card flex items-center justify-between rounded-xl p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-teal">
                      <Icon name={r.icon} className="text-[24px]" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold leading-tight text-slate-900">{r.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <Icon name="videocam" className="text-[14px] text-teal" /> {r.clip} clip verified
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    <Icon name="check_circle" fill className="text-[14px]" /> DONE
                  </span>
                </div>
              );
            if (r.id === nextRoom?.id)
              return (
                <div key={r.id} className="space-y-3 rounded-xl border-2 border-orange/60 bg-gradient-to-b from-orange-soft to-tint p-4 shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-100 text-orange">
                        <Icon name={r.icon} className="text-[24px]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold leading-tight text-slate-900">{r.name}</h3>
                        <p className="mt-0.5 text-xs font-medium text-orange">{r.hint}</p>
                      </div>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">UP NEXT</span>
                  </div>
                  <div className="space-y-2.5 rounded-lg border border-orange-200/80 bg-orange-50/70 p-3">
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <Icon name="info" className="shrink-0 text-[18px] text-orange" />
                      <span>Ensure water valves and under-cabinet areas are clearly visible with steady movement.</span>
                    </div>
                    <button onClick={() => setCamera(r)} className="btn-primary h-10 w-full rounded-lg">
                      <Icon name="videocam" className="text-[18px]" /> Open Camera Lens
                    </button>
                  </div>
                </div>
              );
            return (
              <div key={r.id} className="card flex items-center justify-between rounded-xl p-3.5 opacity-90">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E0DDD8] bg-cream-dim text-slate-500">
                    <Icon name={r.icon} className="text-[24px]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold leading-tight text-slate-800">{r.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{r.hint}</p>
                  </div>
                </div>
                <span className="rounded-full border border-[#E0DDD8] bg-cream-dim px-2.5 py-1 text-xs font-semibold tracking-wider text-slate-600">QUEUED</span>
              </div>
            );
          })}
        </section>

        <section className="card flex items-start gap-3 rounded-xl p-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-amber-900">
            <Icon name="lightbulb" className="text-[18px]" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Inspector Pro-Tip</h4>
            <p className="mt-1 text-xs leading-relaxed text-amber-950">
              Pan slowly across faucets, drain caps, and corners with indoor overhead lights on for automatic AI clarity validation.
            </p>
          </div>
        </section>
      </div>

      {camera && (
        <CameraModal
          room={camera}
          onClose={() => setCamera(null)}
          onSave={() => {
            completeRoom(camera.id);
            showToast(`${camera.name} verified`, 'videocam');
            setCamera(null);
          }}
        />
      )}
    </Screen>
  );
}
