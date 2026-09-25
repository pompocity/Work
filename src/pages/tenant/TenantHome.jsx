import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, Screen } from '../../components/ui.jsx';
import { LockCard, TicketCard } from '../../components/tenantWidgets.jsx';
import { TENANT } from '../../data/mock.js';

export default function TenantHome() {
  const navigate = useNavigate();
  return (
    <Screen header={<AppHeader logo />} nav="tenant" bg="bg-surface">
      <div className="flex flex-col gap-4">
        {/* Resident summary */}
        <section className="rounded-2xl border border-tint-border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal text-[17px] font-bold text-white">{TENANT.initials}</div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-[17px] font-bold text-ink">{TENANT.name}</h1>
                  <span className="h-2 w-2 rounded-full bg-teal" />
                </div>
                <p className="truncate text-[13px] text-ink-mid">{TENANT.address}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-surface-container-high px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">Active Lease</span>
          </div>
          <button onClick={() => navigate('/tenant/unit')} className="mt-3 flex w-full items-center justify-between rounded-lg bg-surface-container-low px-3 py-2 text-[13px] transition-colors hover:bg-surface-container">
            <span className="flex items-center gap-1.5 font-semibold text-ink">
              <Icon name="check_circle" fill className="text-[18px] text-primary" /> May Rent Paid
            </span>
            <span className="flex items-center gap-1 text-ink-mid">
              <Icon name="sync" className="text-[16px]" /> Autopay Active
            </span>
          </button>
        </section>

        {/* Need something fixed */}
        <section className="rounded-2xl border border-tint-border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-tertiary-container text-white">
              <Icon name="home_repair_service" className="text-[28px]" />
            </div>
            <div>
              <h2 className="font-serif text-[26px] leading-tight text-ink">Need something fixed?</h2>
              <p className="mt-1 text-[14px] text-ink-mid">AI triage fast-tracks your issue in under 60 seconds.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={() => navigate('/tenant/report')} className="flex h-12 items-center justify-center gap-2 rounded-lg bg-tertiary-container text-[15px] font-bold text-white shadow-sm transition-all hover:bg-tertiary active:scale-[0.99]">
              Report an Issue <Icon name="arrow_forward" className="text-[18px]" />
            </button>
            <button onClick={() => navigate('/tenant/report?photo=1')} className="flex h-12 items-center justify-center gap-2 rounded-lg bg-surface-container-low text-[15px] font-semibold text-ink transition-colors hover:bg-surface-container">
              <Icon name="photo_camera" className="text-[20px] text-tertiary-container" /> Snap Photo
            </button>
          </div>
        </section>

        <TicketCard variant="home" />
        <LockCard />
      </div>
    </Screen>
  );
}
