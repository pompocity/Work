import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PROPERTIES, ROOMS, VENDORS } from '../data/mock.js';

/*
  Mock app state shared by both personas so the investor journey is continuous:
  tenant reports -> ticket "awaiting" landlord -> landlord dispatches vendor ->
  tenant tracks "dispatched" -> tenant signs off -> "completed".
*/

const STORAGE_KEY = 'enterent-demo-v2';

const initialTicket = () => ({
  id: '9042',
  title: 'Kitchen Sink Leak',
  category: 'plumbing',
  stage: 'awaiting', // awaiting | dispatched | completed
  urgency: 'urgent',
  window: 'Today · 2 – 4 PM',
  note: '',
  description:
    'Noticed fresh water dripping from the chrome curved pipe joint directly underneath the kitchen sink when doing dishes. Floor cabinet base is damp.',
  vendor: null,
  budget: 250,
  messages: [],
  rating: 0,
  reportedAt: '1:42 PM',
  approvedAt: null,
  completedAt: null,
});

const initialDraft = () => ({
  category: 'plumbing',
  urgency: 'urgent',
  description: initialTicket().description,
  // AI triage answers: option id or 'other' (with free text in otherText)
  valve: '',
  pooling: '',
  onset: '',
  otherText: { valve: '', pooling: '', onset: '' },
  tier: 'standard',
  window: 'Today · 2 – 4 PM',
  note: '',
});

const initialState = () => ({
  role: 'tenant',
  ticket: initialTicket(),
  draft: initialDraft(),
  rooms: ROOMS.map((r) => ({ ...r })),
  inspectionSubmitted: false,
  inspectionCadence: 'Biannual', // set by landlord in Property Portal checklist
  properties: PROPERTIES,
  guestPasses: [
    { id: 'p1', name: 'Apex Plumbing Co.', code: '5530', expires: 'Today, 6:00 PM' },
  ],
  lockLocked: true,
});

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable — fall back to defaults */
  }
  return initialState();
}

const nowLabel = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, setState] = useState(load);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const showToast = useCallback((msg, icon = 'check_circle') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, icon, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const actions = useMemo(
    () => ({
      setRole: (role) => setState((s) => ({ ...s, role })),
      updateDraft: (patch) => setState((s) => ({ ...s, draft: { ...s.draft, ...patch } })),
      resetDraft: () => setState((s) => ({ ...s, draft: initialDraft() })),
      updateTicket: (patch) => setState((s) => ({ ...s, ticket: { ...s.ticket, ...patch } })),
      submitReport: (patch) =>
        setState((s) => ({
          ...s,
          ticket: {
            ...s.ticket,
            ...patch,
            stage: 'awaiting',
            vendor: null,
            messages: [],
            rating: 0,
            reportedAt: nowLabel(),
            approvedAt: null,
            completedAt: null,
          },
        })),
      dispatchVendor: (vendor, price) =>
        setState((s) => ({
          ...s,
          ticket: {
            ...s.ticket,
            stage: 'dispatched',
            vendor: { ...vendor, price },
            approvedAt: nowLabel(),
          },
        })),
      completeTicket: (rating) =>
        setState((s) => ({
          ...s,
          ticket: { ...s.ticket, stage: 'completed', rating, completedAt: nowLabel() },
        })),
      sendMessage: (text) =>
        setState((s) => ({
          ...s,
          ticket: { ...s.ticket, messages: [...s.ticket.messages, { text, at: nowLabel() }] },
        })),
      setScenario: (stage) =>
        setState((s) => {
          const base = initialTicket();
          if (stage === 'awaiting') return { ...s, ticket: base };
          const vendor = { ...VENDORS[0] };
          return {
            ...s,
            ticket: {
              ...base,
              stage,
              vendor,
              approvedAt: '1:48 PM',
              completedAt: stage === 'completed' ? '3:21 PM' : null,
              rating: stage === 'completed' ? 5 : 0,
            },
          };
        }),
      completeRoom: (id) =>
        setState((s) => ({ ...s, rooms: s.rooms.map((r) => (r.id === id ? { ...r, done: true, clip: `${30 + Math.floor(Math.random() * 20)}s` } : r)) })),
      setInspectionCadence: (inspectionCadence) => setState((s) => ({ ...s, inspectionCadence })),
      submitInspection: () => setState((s) => ({ ...s, inspectionSubmitted: true })),
      addProperty: (p) => setState((s) => ({ ...s, properties: [...s.properties, p] })),
      addGuestPass: (p) => setState((s) => ({ ...s, guestPasses: [...s.guestPasses, p] })),
      removeGuestPass: (id) => setState((s) => ({ ...s, guestPasses: s.guestPasses.filter((p) => p.id !== id) })),
      setLock: (locked) => setState((s) => ({ ...s, lockLocked: locked })),
      resetDemo: () => setState((s) => ({ ...initialState(), role: s.role })),
    }),
    []
  );

  const value = useMemo(() => ({ ...state, ...actions, toast, showToast }), [state, actions, toast, showToast]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useApp() {
  return useContext(AppStateContext);
}
