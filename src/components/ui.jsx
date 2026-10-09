import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppState.jsx';
import { OWNER, TENANT } from '../data/mock.js';

export function Icon({ name, className = '', fill = false, style }) {
  return (
    <span className={`material-symbols-outlined ${fill ? 'fill' : ''} ${className}`} style={style} aria-hidden="true">
      {name}
    </span>
  );
}

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 48 52" aria-label="EnteRent">
      <polygon points="24,4 44,22 44,50 4,50 4,22" fill="#1a237e" />
      <path d="M13,32 L21,42 L37,22" stroke="#00695c" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ className = 'text-[30px]' }) {
  return (
    <span className={`font-bold tracking-tight text-indigo ${className}`}>
      ente<span className="italic text-teal">r</span>ent
    </span>
  );
}

export function Avatar({ initials, className = 'w-9 h-9 rounded-xl text-xs', tone = 'bg-teal text-white', onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`flex shrink-0 items-center justify-center font-bold ring-2 ring-teal/20 ${tone} ${className}`}
      aria-label="Profile"
    >
      {initials}
    </Tag>
  );
}

/* ---------- Layout ---------- */

export function Screen({ header, nav, footer, children, className = 'px-4 pt-3 pb-8', bg = 'bg-cream' }) {
  return (
    <div className={`relative mx-auto flex min-h-screen w-full max-w-app flex-col ${bg} shadow-[0_0_40px_rgba(26,35,126,0.08)]`}>
      {header}
      <main className={`flex-1 ${className}`}>{children}</main>
      {footer}
      {nav === 'tenant' && <TenantNav />}
      {nav === 'landlord' && <LandlordNav />}
    </div>
  );
}

export function AppHeader({ title, back, logo, eyebrow, right, bell = true, avatar = true }) {
  const navigate = useNavigate();
  const { role } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const isTenant = role === 'tenant';
  return (
    <header className="sticky top-0 z-40 border-b border-tint-border bg-cream/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {back && (
            <button
              aria-label="Go back"
              onClick={() => navigate(back)}
              className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-indigo transition-colors hover:bg-tint"
            >
              <Icon name="arrow_back" className="text-[24px]" />
            </button>
          )}
          {logo && <LogoMark size={30} />}
          {title && (
            <div className="min-w-0">
              {eyebrow && <span className="block text-[10px] font-bold uppercase tracking-wider text-secondary">{eyebrow}</span>}
              <h1 className="truncate text-[18px] font-bold leading-tight tracking-tight text-indigo">{title}</h1>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {right}
          {bell && (
            <button
              aria-label="Notifications"
              onClick={() => setNotifOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-tint-border bg-tint text-indigo transition-colors hover:bg-tint-hover"
            >
              <Icon name="notifications" className="text-[20px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange ring-2 ring-white" />
            </button>
          )}
          {avatar && (
            <Avatar
              initials={isTenant ? TENANT.initials : OWNER.initials}
              tone={isTenant ? 'bg-teal text-white' : 'bg-indigo text-white'}
              onClick={() => navigate(isTenant ? '/tenant/unit' : '/landlord/account')}
            />
          )}
        </div>
      </div>
      <NotificationsSheet open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}

function NavItem({ to, icon, label, also = [] }) {
  const { pathname } = useLocation();
  const match = also.some((p) => pathname.startsWith(p));
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex min-h-[48px] min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
          isActive || match ? 'font-bold text-teal' : 'text-ink-mid hover:text-indigo'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon name={icon} fill={isActive || match} className="text-[22px]" />
          <span className="text-[11px] tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function NavBar({ children }) {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-tint-border bg-cream/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(26,35,126,0.05)] backdrop-blur-md">
      <div className="flex h-16 items-center justify-around px-2">{children}</div>
    </nav>
  );
}

export function TenantNav() {
  return (
    <NavBar>
      <NavItem to="/tenant/home" icon="roofing" label="Home" />
      <NavItem to="/tenant/repairs" icon="home_repair_service" label="Repairs" also={['/tenant/tracker']} />
      <NavItem to="/tenant/inspection" icon="fact_check" label="Inspection" />
      <NavItem to="/tenant/unit" icon="key" label="Unit/Key" />
    </NavBar>
  );
}

export function LandlordNav() {
  return (
    <NavBar>
      <NavItem to="/landlord/portfolio" icon="location_city" label="Portfolio" also={['/landlord/property', '/landlord/financials']} />
      <NavItem to="/landlord/triage" icon="build" label="Triage" also={['/landlord/dispatch']} />
      <NavItem to="/landlord/vendors" icon="engineering" label="Vendors" />
      <NavItem to="/landlord/account" icon="account_circle" label="Account" also={['/landlord/auto-approval']} />
    </NavBar>
  );
}

/* ---------- Overlays ---------- */

export function Sheet({ open, onClose, title, eyebrow, icon, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/60 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm animate-fade sm:items-center" onClick={onClose}>
      <div
        className="animate-sheet max-h-[88vh] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-cream p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/10 text-teal">
                <Icon name={icon} className="text-[20px]" />
              </div>
            )}
            <div>
              {eyebrow && <span className="block text-[11px] font-bold uppercase tracking-wider text-teal">{eyebrow}</span>}
              <h3 className="text-[19px] font-bold leading-tight text-indigo">{title}</h3>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tint text-muted hover:text-indigo">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div key={toast.key} className="animate-sheet pointer-events-none fixed left-1/2 top-[calc(5rem+env(safe-area-inset-top))] z-[60] flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-full bg-inverse-surface px-4 py-2.5 text-[13px] font-semibold text-inverse-on-surface shadow-xl">
      <Icon name={toast.icon} className="text-[18px] text-primary-fixed" />
      <span>{toast.msg}</span>
    </div>
  );
}

function NotificationsSheet({ open, onClose }) {
  const { role, ticket, inspectionCadence } = useApp();
  const navigate = useNavigate();
  const v = ticket.vendor;
  const tenantItems = [
    ticket.stage === 'awaiting' && { icon: 'hourglass_top', title: 'Request sent to landlord', body: `Ticket #${ticket.id} is awaiting approval & vendor dispatch.`, to: '/tenant/tracker' },
    ticket.stage === 'dispatched' && { icon: 'local_shipping', title: `${v?.tech} is on the way`, body: `${v?.company} · ETA ${v?.eta}`, to: '/tenant/tracker' },
    ticket.stage === 'completed' && { icon: 'task_alt', title: 'Repair closed', body: `Ticket #${ticket.id} signed off. Thanks for your review!`, to: '/tenant/tracker' },
    { icon: 'event_available', title: 'Inspection due in 12 days', body: `${inspectionCadence} Video Walkthrough · Oct 30`, to: '/tenant/inspection' },
    { icon: 'payments', title: 'May rent paid', body: 'Autopay cleared $2,400.00 via Wells ACH', to: '/tenant/unit' },
  ].filter(Boolean);
  const landlordItems = [
    ticket.stage === 'awaiting' && { icon: 'water_damage', title: 'Urgent: Kitchen Sink Leak', body: '124 Maple St · Unit 2B · Vendor dispatch ready', to: '/landlord/dispatch', hot: true },
    ticket.stage === 'dispatched' && { icon: 'local_shipping', title: `${v?.company} dispatched`, body: `Ticket #${ticket.id} · ETA ${v?.eta}`, to: '/landlord/triage' },
    ticket.stage === 'completed' && { icon: 'task_alt', title: 'Tenant signed off repair', body: `Ticket #${ticket.id} · payout released to ${v?.company}`, to: '/landlord/triage' },
    { icon: 'fact_check', title: 'HVAC audit 85% complete', body: '88 Harbor Dr · Biannual safety audit', to: '/landlord/property/harbor' },
    { icon: 'group_add', title: '3 new applications', body: '405 Oak Ridge Ln · Move-in July 1st', to: '/landlord/property/oak' },
  ].filter(Boolean);
  const items = role === 'tenant' ? tenantItems : landlordItems;
  return (
    <Sheet open={open} onClose={onClose} title="Notifications" icon="notifications">
      <div className="flex flex-col gap-2">
        {items.map((n) => (
          <button
            key={n.title}
            onClick={() => {
              onClose();
              navigate(n.to);
            }}
            className="flex items-start gap-3 rounded-xl border border-tint-border bg-tint p-3 text-left transition-colors hover:bg-tint-hover"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${n.hot ? 'bg-orange/10 text-orange' : 'bg-teal/10 text-teal'}`}>
              <Icon name={n.icon} className="text-[20px]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-indigo">{n.title}</p>
              <p className="text-[12px] text-muted">{n.body}</p>
            </div>
            <Icon name="chevron_right" className="self-center text-[18px] text-muted" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

export function Stars({ value, onChange, size = 'text-[30px]' }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange?.(n)} aria-label={`${n} stars`}>
          <Icon name="star" fill={n <= value} className={`${size} ${n <= value ? 'text-orange' : 'text-outline-variant'}`} />
        </button>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-teal' : 'bg-outline-variant'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

/* Investor demo helper: jump the shared ticket to any lifecycle stage. */
export function ScenarioCard() {
  const { ticket, setScenario, resetDemo, showToast } = useApp();
  const opts = [
    { id: 'awaiting', label: 'Awaiting dispatch' },
    { id: 'dispatched', label: 'Vendor en route' },
    { id: 'completed', label: 'Completed' },
  ];
  return (
    <section className="card p-4">
      <div className="mb-1 flex items-center gap-2">
        <Icon name="science" className="text-[18px] text-secondary" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-indigo">Demo Scenario</h3>
      </div>
      <p className="mb-3 text-[12px] text-muted">Jump Ticket #9042 to any stage of the repair lifecycle.</p>
      <div className="grid grid-cols-3 gap-2">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => {
              setScenario(o.id);
              showToast(`Scenario set: ${o.label}`, 'science');
            }}
            className={`rounded-lg px-2 py-2 text-[11px] font-bold transition-colors ${
              ticket.stage === o.id ? 'bg-indigo text-white' : 'border border-tint-border bg-white text-indigo hover:bg-tint-hover'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          resetDemo();
          showToast('Demo data reset', 'restart_alt');
        }}
        className="mt-2 w-full rounded-lg py-2 text-[12px] font-semibold text-muted hover:text-indigo"
      >
        Reset all demo data
      </button>
    </section>
  );
}
