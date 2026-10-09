import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon, Screen } from '../../components/ui.jsx';
import { useApp } from '../../state/AppState.jsx';
import { CATEGORIES, TICKET_HISTORY, money } from '../../data/mock.js';
import { summarize } from '../../state/autoApprove.js';

export default function TriageQueue() {
  const navigate = useNavigate();
  const { ticket, showToast, autoApprove } = useApp();
  const [view, setView] = useState('open');
  const isOpen = ticket.stage !== 'completed';

  const stageChip = {
    awaiting: ['Awaiting Dispatch', 'bg-orange/10 text-orange'],
    dispatched: ['Vendor En Route', 'bg-secondary-fixed text-secondary'],
    completed: ['Closed', 'bg-teal/10 text-teal'],
  }[ticket.stage];

  const liveCard = (
    <button
      onClick={() => navigate(ticket.stage === 'awaiting' ? '/landlord/dispatch' : '/landlord/property/maple')}
      className={`card flex flex-col gap-3 p-4 text-left transition-shadow hover:shadow-md ${ticket.stage === 'awaiting' ? 'border-l-4 border-l-orange' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Ticket #{ticket.id}</span>
        <span className={`chip ${stageChip[1]}`}>{stageChip[0]}</span>
      </div>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange">
          <Icon name="water_damage" className="text-[22px]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-indigo">{ticket.title}</h3>
          <p className="text-[12px] text-muted">124 Maple St · Unit 2B · Sarah Miller</p>
          <p className="mt-1 text-[12px] text-ink">
            {ticket.stage === 'awaiting'
              ? `AI: P-trap seal failure · Tenant requested ${ticket.urgency === 'urgent' ? 'urgent' : 'standard'} · ${ticket.window}`
              : `${ticket.vendor?.company} · ${money(ticket.vendor?.price || 0)} authorized${ticket.stage === 'completed' ? ` · rated ${ticket.rating}★` : ''}`}
          </p>
        </div>
      </div>
      {ticket.stage === 'awaiting' && (
        <span className="btn-orange h-10 w-full text-[13px]">
          <Icon name="plumbing" className="text-[18px]" /> Choose Vendor & Dispatch
        </span>
      )}
    </button>
  );

  return (
    <Screen header={<AppHeader title="Triage & Repairs" logo />} nav="landlord">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Open', isOpen ? 1 : 0, 'text-orange'],
            ['Avg Resolve', '6.2h', 'text-teal'],
            ['Spend (30d)', money(1615 + (ticket.stage === 'completed' ? ticket.vendor?.price || 0 : 0)), 'text-indigo'],
          ].map(([k, v, tone]) => (
            <div key={k} className="card rounded-xl p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{k}</span>
              <span className={`block text-[20px] font-bold ${tone}`}>{v}</span>
            </div>
          ))}
        </div>

        <div className="flex rounded-xl bg-surface-container p-1">
          {[
            ['open', 'Open'],
            ['closed', 'History'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} className={`flex-1 rounded-lg py-2 text-[12px] font-bold ${view === id ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}>
              {label}
            </button>
          ))}
        </div>

        {view === 'open' ? (
          isOpen ? (
            liveCard
          ) : (
            <div className="card flex flex-col items-center gap-2 p-8 text-center">
              <Icon name="celebration" className="text-[36px] text-teal" />
              <p className="text-[14px] font-bold text-indigo">Inbox zero</p>
              <p className="text-[12px] text-muted">No open repair tickets across your portfolio.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2">
            {!isOpen && liveCard}
            {TICKET_HISTORY.map((h) => (
              <button key={h.id} onClick={() => showToast(`#${h.id} · ${h.vendor} · ${money(h.cost)}`, 'receipt_long')} className="card flex items-center gap-3 p-3 text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-secondary">
                  <Icon name={h.icon} className="text-[20px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">{h.title}</p>
                  <p className="truncate text-[11px] text-muted">
                    {h.property} · {h.date}
                  </p>
                </div>
                <span className="text-[13px] font-bold text-indigo">{money(h.cost)}</span>
              </button>
            ))}
          </div>
        )}

        <button onClick={() => navigate('/landlord/auto-approval')} className="card flex items-start gap-3 p-4 text-left hover:bg-tint-hover">
          <Icon name="smart_toy" className="text-[24px] text-teal" />
          <div className="flex-1">
            <h4 className="text-[14px] font-bold text-indigo">AI Auto-Approve</h4>
            <p className="text-[12px] text-muted">{summarize(autoApprove, CATEGORIES.length)}</p>
          </div>
          <Icon name="chevron_right" className="self-center text-[20px] text-muted" />
        </button>
      </div>
    </Screen>
  );
}
