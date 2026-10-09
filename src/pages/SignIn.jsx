import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, LogoMark, Screen, Sheet, Wordmark } from '../components/ui.jsx';
import { useApp } from '../state/AppState.jsx';

const ROLES = [
  { id: 'tenant', title: 'Renter / Tenant', desc: 'Invited by landlord with unit or lease code', icon: 'home_pin', email: 'sarah.miller@email.com' },
  { id: 'landlord', title: 'Landlord / Owner', desc: 'Manage properties, dispatch pros & repair triage', icon: 'domain', email: 'jordan@ellisholdings.co' },
];

function CodeInput({ value, onChange }) {
  const refs = useRef([]);
  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(-1);
            const next = (value.slice(0, i) + d + value.slice(i + 1)).slice(0, 6);
            onChange(next);
            if (d && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          className="h-12 w-11 rounded-xl border border-tint-border bg-white text-center text-lg font-bold text-indigo focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      ))}
    </div>
  );
}

export default function SignIn() {
  const navigate = useNavigate();
  const { setRole, showToast } = useApp();
  const [role, setRoleLocal] = useState('tenant');
  const [tab, setTab] = useState('password');
  const [email, setEmail] = useState(ROLES[0].email);
  const [password, setPassword] = useState('demo-password');
  const [showPw, setShowPw] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState('');
  const [loading, setLoading] = useState(false);

  const pickRole = (id) => {
    setRoleLocal(id);
    setEmail(ROLES.find((r) => r.id === id).email);
  };

  const enter = (asRole = role) => {
    setLoading(true);
    setTimeout(() => {
      setRole(asRole);
      navigate(asRole === 'tenant' ? '/tenant/home' : '/landlord/portfolio');
    }, 650);
  };

  return (
    <Screen className="flex flex-col justify-between px-5 pb-10 pt-8">
      <div>
        <header className="mb-6 mt-2 flex flex-col items-center text-center">
          <div className="mb-2 flex items-center gap-3">
            <LogoMark size={42} />
            <div className="flex flex-col text-left">
              <div className="flex items-baseline leading-none">
                <Wordmark />
                <span className="ml-2 rounded border border-teal/30 bg-teal-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal">Pro</span>
              </div>
              <p className="mt-0.5 text-[12px] font-medium tracking-tight text-orange">Your rental, handled.</p>
            </div>
          </div>
          <p className="text-xs font-medium text-muted">Select your role to access your management suite</p>
        </header>

        <section className="mb-5">
          <div className="mb-2 flex items-center justify-end px-1">
            <span className="flex items-center gap-1 text-[11px] font-medium text-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Switchable anytime
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => pickRole(r.id)}
                  className={`rounded-2xl p-3.5 text-left transition-all ${
                    active ? 'border-2 border-teal bg-tint shadow-sm' : 'border border-tint-border bg-tint-light opacity-85 hover:bg-tint-hover hover:opacity-100'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${active ? 'bg-teal/15 text-teal' : 'bg-[#DCE7F5] text-indigo'}`}>
                      <Icon name={r.icon} fill={active} className="text-[19px]" />
                    </div>
                    {active ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-white">
                        <Icon name="check" className="text-[14px]" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-[#BACDDD] bg-white" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold leading-tight text-indigo">{r.title}</h3>
                  <p className="mt-1 text-[11px] leading-snug text-muted">{r.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="card mb-5 flex items-center justify-between gap-3 p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-tint-border bg-white text-indigo">
              <Icon name="pin" className="text-[20px]" />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-xs font-bold text-indigo">Have a 6-digit invite?</h4>
              <p className="truncate text-[11px] text-muted">Fast-track direct to your unit onboarding</p>
            </div>
          </div>
          <button onClick={() => setInviteOpen(true)} className="shrink-0 rounded-xl border border-orange/30 bg-white px-3 py-1.5 text-xs font-semibold text-orange hover:bg-orange-soft">
            Enter Code
          </button>
        </section>

        <section className="card mb-4 p-4">
          <div className="mb-4 grid grid-cols-2 rounded-xl border border-tint-border bg-white/70 p-1 text-center">
            {[
              ['password', 'Password Sign In'],
              ['otp', 'Instant Link / OTP'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-lg py-1.5 text-xs transition-colors ${tab === id ? 'bg-indigo font-bold text-white shadow-xs' : 'font-medium text-muted hover:text-indigo'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tab === 'otp' && !otpSent) {
                setOtpSent(true);
                showToast('Demo code sent: 123456', 'sms');
                return;
              }
              enter();
            }}
            className="space-y-3.5"
          >
            <div>
              <label className="label">Email or Mobile Phone</label>
              <div className="relative flex items-center">
                <Icon name="alternate_email" className="absolute left-3 text-[18px] text-muted" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com or (555) 000-0000" className="input pl-9 text-xs" />
              </div>
            </div>

            {tab === 'password' ? (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted">Security Passphrase</label>
                  <button type="button" onClick={() => showToast(`Reset link sent to ${email}`, 'mail')} className="text-[11px] font-medium text-teal hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Icon name="lock" className="absolute left-3 text-[18px] text-muted" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input px-9 text-xs tracking-wider"
                  />
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 text-muted hover:text-indigo" aria-label="Toggle password visibility">
                    <Icon name={showPw ? 'visibility_off' : 'visibility'} className="text-[18px]" />
                  </button>
                </div>
              </div>
            ) : (
              otpSent && (
                <div>
                  <label className="label">6-Digit Code</label>
                  <CodeInput value={otp} onChange={setOtp} />
                  <button type="button" onClick={() => setOtp('123456')} className="mt-2 text-[11px] font-semibold text-teal hover:underline">
                    Autofill demo code
                  </button>
                </div>
              )
            )}

            <button type="submit" disabled={loading} className="btn-orange mt-2 h-12 w-full text-sm tracking-wide">
              {loading ? (
                <>
                  <Icon name="progress_activity" className="animate-spin text-[18px]" /> Signing in…
                </>
              ) : (
                <>
                  <span>{tab === 'otp' && !otpSent ? 'Send Magic Code' : 'Authenticate & Enter'}</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-3 border-t border-tint-border pt-3 text-center">
            <button onClick={() => setInviteOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline">
              <Icon name="key" className="text-[16px]" /> Have a property invite code? Join Unit
            </button>
          </div>
        </section>

        <section className="card mb-4 p-3.5">
          <div className="relative mb-2.5 flex items-center py-1">
            <div className="flex-grow border-t border-tint-border" />
            <span className="mx-2 text-[10px] font-bold uppercase tracking-wider text-muted">Or Connect With</span>
            <div className="flex-grow border-t border-tint-border" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => enter()} className="flex items-center justify-center gap-2 rounded-xl border border-tint-border bg-white px-3 py-2 text-xs font-bold text-indigo hover:bg-slate-50">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-2 .6-2.64 1.35-.56.64-.99 1.71-.86 2.73.99.08 1.96-.48 2.58-1.23" />
              </svg>
              Apple ID
            </button>
            <button onClick={() => enter()} className="flex items-center justify-center gap-2 rounded-xl border border-tint-border bg-white px-3 py-2 text-xs font-bold text-indigo hover:bg-slate-50">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.54 0 2.9.54 3.97 1.43l2.97-2.97C17.15 1.83 14.77 1 12 1 7.42 1 3.52 3.61 1.66 7.4l3.54 2.75C6.07 7.37 8.8 5 12 5z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.41-4.92 3.41-8.7z" />
                <path fill="#FBBC05" d="M5.2 14.85c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.66 7.52C.6 9.63 0 12 0 14.47s.6 4.84 1.66 6.95l3.54-2.57z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.04.7-2.39 1.12-3.95 1.12-3.2 0-5.93-2.37-6.8-5.15L1.66 16.05C3.52 19.84 7.42 23 12 23z" />
              </svg>
              Google
            </button>
          </div>
        </section>
      </div>

      <footer className="card mt-2 flex items-start gap-3 p-3 shadow-none">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal/15 text-teal">
          <Icon name="verified_user" className="text-[16px]" />
        </div>
        <div>
          <div className="mb-0.5 flex items-center gap-1.5">
            <h5 className="text-[11px] font-bold text-indigo">Protected by EnteRent 24/7 Smart Guard</h5>
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          </div>
          <p className="text-[10px] leading-tight text-muted">
            Dual role support enabled. Your permissions, telemetry feeds, and smart access tokens dynamically sync upon authentication.
          </p>
        </div>
      </footer>

      <Sheet open={inviteOpen} onClose={() => setInviteOpen(false)} title="Join Your Unit" eyebrow="Property Invite" icon="key">
        <p className="mb-4 text-[13px] text-muted">Enter the 6-digit code your landlord shared by text or email.</p>
        <CodeInput value={invite} onChange={setInvite} />
        <button type="button" onClick={() => setInvite('482915')} className="mt-2 text-[11px] font-semibold text-teal hover:underline">
          Use demo invite (124 Maple St · Unit 2B)
        </button>
        <button
          disabled={invite.length < 6}
          onClick={() => {
            setInviteOpen(false);
            showToast('Invite verified · 124 Maple St, Unit 2B', 'verified');
            enter('tenant');
          }}
          className="btn-orange mt-4 w-full disabled:opacity-50"
        >
          Verify & Join Unit <Icon name="arrow_forward" className="text-[18px]" />
        </button>
      </Sheet>
    </Screen>
  );
}
