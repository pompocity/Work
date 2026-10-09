import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, ScenarioCard, Screen, Toggle } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { CATEGORIES, OWNER } from '../../data/mock.js';
import { summarize } from '../../state/autoApprove.js';

export default function Account() {
  const navigate = useNavigate();
  const { setRole, showToast, properties, autoApprove, updateAutoApprove } = useApp();
  const [prefs, setPrefs] = useState({ sms: true, email: false, emergency: true });
  const set = (k) => (v) => {
    setPrefs((p) => ({ ...p, [k]: v }));
    showToast('Preference saved', 'check');
  };

  return (
    <Screen header={<AppHeader title="Account" logo />} nav="landlord">
      <div className="flex flex-col gap-4">
        <section className="card flex items-center gap-3 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo text-[18px] font-bold text-white">{OWNER.initials}</div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold text-indigo">{OWNER.name}</h2>
            <p className="truncate text-[12px] text-muted">
              {OWNER.company} · {properties.length} properties
            </p>
            <p className="truncate text-[12px] text-muted">{OWNER.email}</p>
          </div>
          <span className="chip border border-teal/30 bg-teal-soft text-teal">Pro</span>
        </section>

        <button onClick={() => navigate('/landlord/financials')} className="card flex items-center gap-3 p-4 text-left hover:bg-tint-hover">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
            <Icon name="monitoring" className="text-[22px]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-indigo">Financials</p>
            <p className="text-[12px] text-muted">Rent, annual revenue & net yield per property</p>
          </div>
          <Icon name="chevron_right" className="text-[20px] text-muted" />
        </button>

        <section className="card p-4">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted">Payouts & Escrow</h3>
          <div className="flex items-center justify-between rounded-xl border border-tint-border bg-white p-3">
            <div className="flex items-center gap-2.5">
              <Icon name="account_balance" className="text-[22px] text-teal" />
              <div>
                <p className="text-[13px] font-bold text-ink">Chase Business ••4417</p>
                <p className="text-[11px] text-muted">Rent deposits · next payout Oct 3</p>
              </div>
            </div>
            <button onClick={() => showToast('Bank settings (demo)', 'account_balance')} className="text-[12px] font-bold text-teal">
              Manage
            </button>
          </div>
        </section>

        <section className="card flex flex-col gap-3 p-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">Automation & Alerts</h3>
          <div className="rounded-xl border border-tint-border bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Icon name="rule" className="text-[22px] text-teal" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-ink">Repair auto-approval</p>
                  <p className="text-[11px] text-muted">{summarize(autoApprove, CATEGORIES.length)}</p>
                </div>
              </div>
              <Toggle on={autoApprove.enabled} onChange={(enabled) => updateAutoApprove({ enabled })} label="Repair auto-approval" />
            </div>
            <button onClick={() => navigate('/landlord/auto-approval')} className="mt-2.5 flex w-full items-center justify-between rounded-lg bg-tint px-3 py-2 text-[12px] font-bold text-indigo hover:bg-tint-hover">
              Customize price, urgency & issue-type rules <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
          {[
            ['emergency', '24/7 emergency escalation', 'Gas, floods, electrical'],
            ['sms', 'SMS alerts', 'New tickets & vendor updates'],
            ['email', 'Weekly email digest', 'Rent roll & spend summary'],
          ].map(([k, t, s]) => (
            <div key={k} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold text-ink">{t}</p>
                <p className="text-[11px] text-muted">{s}</p>
              </div>
              <Toggle on={prefs[k]} onChange={set(k)} label={t} />
            </div>
          ))}
        </section>

        <ScenarioCard />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setRole('tenant');
              navigate('/tenant/home');
            }}
            className="btn-ghost h-11"
          >
            <Icon name="swap_horiz" className="text-[18px]" /> Tenant View
          </button>
          <button onClick={() => navigate('/')} className="btn-ghost h-11 text-error">
            <Icon name="logout" className="text-[18px]" /> Sign Out
          </button>
        </div>
      </div>
    </Screen>
  );
}
