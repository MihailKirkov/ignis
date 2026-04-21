'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';

/* ─────────────────────────── Types ─────────────────────────────────── */

export type ServiceKey = 'landing' | 'business' | 'webapp';

interface FormData {
  service:     ServiceKey | '';
  description: string;
  budget:      string;
  timeline:    string;
  name:        string;
  email:       string;
  company:     string;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

/* ─────────────────────────── Context ───────────────────────────────── */

interface ModalCtx {
  open:  (service?: ServiceKey) => void;
  close: () => void;
}

const ProjectModalContext = createContext<ModalCtx>({
  open:  () => {},
  close: () => {},
});

export const useProjectModal = () => useContext(ProjectModalContext);

/* ─────────────────────────── Provider ──────────────────────────────── */

export function ProjectModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen,       setIsOpen]       = useState(false);
  const [initService,  setInitService]  = useState<ServiceKey | ''>('');

  const open = (service?: ServiceKey) => {
    setInitService(service ?? '');
    setIsOpen(true);
  };

  return (
    <ProjectModalContext.Provider value={{ open, close: () => setIsOpen(false) }}>
      {children}
      <Modal
        isOpen={isOpen}
        initService={initService}
        onClose={() => setIsOpen(false)}
      />
    </ProjectModalContext.Provider>
  );
}

/* ─────────────────────────── Icons ─────────────────────────────────── */

function IconLanding() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="2" y="4" width="22" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="2" y="4" width="22" height="6" rx="2" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="6" y="15" width="14" height="1.6" rx="0.8" fill="currentColor" fillOpacity="0.5"/>
      <rect x="8" y="18" width="10" height="1.6" rx="0.8" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  );
}

function IconBusiness() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="2"  y="3"  width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="14" y="3"  width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="2"  y="14" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="14" y="14" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

function IconWebApp() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="2" y="3" width="22" height="20" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M2 9h22" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="6.5"  cy="6" r="1.1" fill="currentColor" fillOpacity="0.5"/>
      <circle cx="10.5" cy="6" r="1.1" fill="currentColor" fillOpacity="0.5"/>
      <path d="M9 17l-3 3 3 3M17 17l3 3-3 3M14 15l-2 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─────────────────────────── Step indicator ────────────────────────── */

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {[1, 2, 3].map((n) => {
        const done   = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center">
            <div
              className={[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                active
                  ? 'bg-ignis text-white shadow-[0_0_12px_rgba(255,107,44,0.5)]'
                  : done
                    ? 'bg-ignis/25 text-ignis'
                    : 'bg-surface-3 text-text-muted',
              ].join(' ')}
            >
              {done ? (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : n}
            </div>
            {n < 3 && (
              <div
                className="w-10 h-px mx-1 transition-colors duration-300"
                style={{ background: done ? 'rgba(255,107,44,0.4)' : '#1e1e2e' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── Input helpers ─────────────────────────── */

const inputBase: React.CSSProperties = {
  background: '#0d0d14',
  border: '1px solid #1e1e2e',
  transition: 'border-color 0.2s',
};

function focusBorder(e: React.FocusEvent<HTMLElement>) {
  (e.currentTarget as HTMLElement).style.borderColor = '#ff6b2c';
}
function blurBorder(e: React.FocusEvent<HTMLElement>) {
  (e.currentTarget as HTMLElement).style.borderColor = '#1e1e2e';
}

/* ─────────────────────────── Modal (internal) ──────────────────────── */

function Modal({
  isOpen,
  initService,
  onClose,
}: {
  isOpen:      boolean;
  initService: ServiceKey | '';
  onClose:     () => void;
}) {
  const t = useTranslations('modal');

  /* Lifecycle state */
  const [rendered,      setRendered]      = useState(false);
  const [step,          setStep]          = useState<1 | 2 | 3>(1);
  const [submitState,   setSubmitState]   = useState<SubmitState>('idle');
  const [validationErr, setValidationErr] = useState('');

  const prevStepRef = useRef<number>(1);

  const [form, setForm] = useState<FormData>({
    service: '', description: '', budget: '', timeline: '',
    name: '', email: '', company: '',
  });

  /* Refs for GSAP */
  const overlayRef     = useRef<HTMLDivElement>(null);
  const cardRef        = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);

  /* ── Open: reset + mount ── */
  useEffect(() => {
    if (!isOpen) return;
    const start = initService ? 2 : 1;
    setStep(start as 1 | 2 | 3);
    prevStepRef.current = start;
    setForm({
      service: initService, description: '', budget: '', timeline: '',
      name: '', email: '', company: '',
    });
    setSubmitState('idle');
    setValidationErr('');
    setRendered(true);
    document.body.style.overflow = 'hidden';
  }, [isOpen, initService]);

  /* ── Entrance animation (runs once after mount) ── */
  useLayoutEffect(() => {
    if (!rendered) return;
    const overlay = overlayRef.current;
    const card    = cardRef.current;
    if (!overlay || !card) return;
    gsap.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' },
    );
    gsap.fromTo(card,
      { opacity: 0, scale: 0.94, y: 28 },
      { opacity: 1, scale: 1,    y: 0,  duration: 0.38, ease: 'power3.out' },
    );
  }, [rendered]);

  /* ── Step slide-in animation ── */
  useLayoutEffect(() => {
    if (step === prevStepRef.current) return;
    const el  = stepContentRef.current;
    const dir = step > prevStepRef.current ? 1 : -1;
    prevStepRef.current = step;
    if (!el) return;
    gsap.fromTo(el,
      { x: 36 * dir, opacity: 0 },
      { x: 0,        opacity: 1, duration: 0.24, ease: 'power2.out' },
    );
  }, [step]);

  /* ── Escape key ── */
  useEffect(() => {
    if (!rendered) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered]);

  /* ── Scroll lock cleanup on unmount ── */
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ── Close with exit animation ── */
  function handleClose() {
    const overlay = overlayRef.current;
    const card    = cardRef.current;
    if (!overlay || !card) {
      onClose(); setRendered(false); document.body.style.overflow = '';
      return;
    }
    gsap.to(card,    { opacity: 0, scale: 0.94, y: 20, duration: 0.2,  ease: 'power2.in' });
    gsap.to(overlay, {
      opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        onClose();
        setRendered(false);
        document.body.style.overflow = '';
      },
    });
  }

  /* ── Step transition ── */
  function goTo(next: 1 | 2 | 3) {
    const el  = stepContentRef.current;
    const dir = next > step ? 1 : -1;
    if (!el) { setStep(next); return; }
    gsap.to(el, {
      x: -36 * dir, opacity: 0, duration: 0.18, ease: 'power2.in',
      onComplete: () => setStep(next),
    });
  }

  /* ── Form helpers ── */
  function setField(field: keyof FormData) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setValidationErr('');
    };
  }

  function validateStep2(): boolean {
    const { description, budget, timeline, name, email } = form;
    if (!description.trim() || !budget || !timeline || !name.trim() || !email.trim()) {
      setValidationErr(t('requiredFields'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationErr(t('invalidEmail'));
      return false;
    }
    return true;
  }

  /* ── Submit ── */
  async function handleSubmit() {
    setSubmitState('submitting');
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service:     form.service,
          description: form.description,
          budget:      form.budget,
          timeline:    form.timeline,
          name:        form.name,
          email:       form.email,
          ...(form.company ? { company: form.company } : {}),
        }),
      });
      if (!res.ok) throw new Error('failed');
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    }
  }

  /* ── Label maps ── */
  const SERVICE_LABELS: Record<ServiceKey | '', string> = {
    landing:  t('landingTitle'),
    business: t('businessTitle'),
    webapp:   t('webappTitle'),
    '':       '',
  };
  const BUDGET_LABELS: Record<string, string> = {
    b500: t('b500'), b1k: t('b1k'), b3k: t('b3k'), b8k: t('b8k'),
  };
  const TIMELINE_LABELS: Record<string, string> = {
    asap: t('tAsap'), '1to2': t('t1to2'), '3to6': t('t3to6'), flex: t('tFlex'),
  };

  const services = [
    { key: 'landing'  as ServiceKey, icon: <IconLanding />,  title: t('landingTitle'),  desc: t('landingDesc'),  price: t('landingPrice')  },
    { key: 'business' as ServiceKey, icon: <IconBusiness />, title: t('businessTitle'), desc: t('businessDesc'), price: t('businessPrice') },
    { key: 'webapp'   as ServiceKey, icon: <IconWebApp />,   title: t('webappTitle'),   desc: t('webappDesc'),   price: t('webappPrice')   },
  ];

  const STEP_TITLES = [t('title1'), t('title2'), t('title3')];

  if (!rendered) return null;

  const showSuccess = submitState === 'success';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(6,6,10,0.82)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-lg flex flex-col rounded-2xl overflow-hidden"
        style={{
          background:  '#0d0d14',
          border:      '1px solid #1e1e2e',
          maxHeight:   '92vh',
          boxShadow:   '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,107,44,0.07)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            {!showSuccess
              ? <StepIndicator current={step} />
              : <div />}
            <button
              onClick={handleClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-3 transition-all duration-200 cursor-pointer ml-auto"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M11.5 3.5l-8 8M3.5 3.5l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {!showSuccess && (
            <h2 className="font-display text-lg font-bold text-text">
              {STEP_TITLES[step - 1]}
            </h2>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6">
          <div ref={stepContentRef}>

            {/* ════════ SUCCESS ════════ */}
            {showSuccess && (
              <div className="py-10 text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ background: 'rgba(255,107,44,0.14)' }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l6 6 12-12" stroke="#ff6b2c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-text mb-3">
                  {t('successTitle')}
                </h3>
                <p className="text-text-secondary leading-relaxed mb-8 max-w-xs mx-auto">
                  {t('successSub')}
                </p>
                <a
                  href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #ff6b2c, #ffb347)' }}
                >
                  {t('bookCall')}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            )}

            {/* ════════ STEP 1 — Service selection ════════ */}
            {!showSuccess && step === 1 && (
              <div className="flex flex-col gap-2.5 pb-6 pt-1">
                {services.map(({ key, icon, title, desc, price }) => {
                  const selected = form.service === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, service: key }));
                        goTo(2);
                      }}
                      className="w-full text-left rounded-xl p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer group"
                      style={{
                        border:     `1px solid ${selected ? '#ff6b2c' : '#1e1e2e'}`,
                        background: selected ? 'rgba(255,107,44,0.07)' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!selected) (e.currentTarget as HTMLElement).style.borderColor = '#2a2a3e';
                      }}
                      onMouseLeave={(e) => {
                        if (!selected) (e.currentTarget as HTMLElement).style.borderColor = '#1e1e2e';
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                        style={{
                          background: selected ? 'rgba(255,107,44,0.15)' : 'rgba(255,255,255,0.04)',
                          color:      selected ? '#ff6b2c' : '#4a4a62',
                        }}
                      >
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                          <span className={['text-sm font-semibold', selected ? 'text-text' : 'text-text-secondary'].join(' ')}>
                            {title}
                          </span>
                          <span className="text-xs font-semibold text-ignis flex-shrink-0">
                            {price}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
                      </div>
                      <svg
                        className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                        style={{ color: selected ? '#ff6b2c' : '#4a4a62' }}
                        fill="none" viewBox="0 0 16 16"
                      >
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ════════ STEP 2 — Project details ════════ */}
            {!showSuccess && step === 2 && (
              <div className="pb-6 pt-1">

                {/* Selected service chip — click to go back */}
                {form.service && (
                  <button
                    onClick={() => goTo(1)}
                    className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-lg text-xs font-semibold text-ignis cursor-pointer transition-colors duration-200 hover:bg-ignis/10"
                    style={{ border: '1px solid rgba(255,107,44,0.3)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M6.5 2L3 5l3.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {SERVICE_LABELS[form.service]}
                  </button>
                )}

                <div className="flex flex-col gap-4">
                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                      {t('descLabel')} <span className="text-ignis">*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={setField('description')}
                      placeholder={t('descPlaceholder')}
                      rows={3}
                      className="w-full rounded-xl px-4 py-3 text-sm text-text placeholder-text-muted resize-none focus:outline-none"
                      style={inputBase}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                  </div>

                  {/* Budget + Timeline */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        {t('budgetLabel')} <span className="text-ignis">*</span>
                      </label>
                      <select
                        value={form.budget}
                        onChange={setField('budget')}
                        className="w-full rounded-xl px-4 py-3 text-sm text-text focus:outline-none appearance-none"
                        style={inputBase}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      >
                        <option value="" disabled>—</option>
                        <option value="b500">{t('b500')}</option>
                        <option value="b1k">{t('b1k')}</option>
                        <option value="b3k">{t('b3k')}</option>
                        <option value="b8k">{t('b8k')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        {t('timelineLabel')} <span className="text-ignis">*</span>
                      </label>
                      <select
                        value={form.timeline}
                        onChange={setField('timeline')}
                        className="w-full rounded-xl px-4 py-3 text-sm text-text focus:outline-none appearance-none"
                        style={inputBase}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      >
                        <option value="" disabled>—</option>
                        <option value="asap">{t('tAsap')}</option>
                        <option value="1to2">{t('t1to2')}</option>
                        <option value="3to6">{t('t3to6')}</option>
                        <option value="flex">{t('tFlex')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        {t('nameLabel')} <span className="text-ignis">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={setField('name')}
                        placeholder={t('namePlaceholder')}
                        className="w-full rounded-xl px-4 py-3 text-sm text-text placeholder-text-muted focus:outline-none"
                        style={inputBase}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        {t('emailLabel')} <span className="text-ignis">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={setField('email')}
                        placeholder={t('emailPlaceholder')}
                        className="w-full rounded-xl px-4 py-3 text-sm text-text placeholder-text-muted focus:outline-none"
                        style={inputBase}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                      {t('companyLabel')}
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={setField('company')}
                      placeholder={t('companyPlaceholder')}
                      className="w-full rounded-xl px-4 py-3 text-sm text-text placeholder-text-muted focus:outline-none"
                      style={inputBase}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                  </div>

                  {/* Validation error */}
                  {validationErr && (
                    <p className="text-xs text-red-400">{validationErr}</p>
                  )}
                </div>
              </div>
            )}

            {/* ════════ STEP 3 — Review ════════ */}
            {!showSuccess && step === 3 && (
              <div className="pb-6 pt-1">
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid #1e1e2e' }}
                >
                  {[
                    { label: t('rvService'),  value: SERVICE_LABELS[form.service]    },
                    { label: t('rvDesc'),      value: form.description               },
                    { label: t('rvBudget'),    value: BUDGET_LABELS[form.budget]     },
                    { label: t('rvTimeline'),  value: TIMELINE_LABELS[form.timeline] },
                    { label: t('rvName'),      value: form.name                      },
                    { label: t('rvEmail'),     value: form.email                     },
                    ...(form.company ? [{ label: t('rvCompany'), value: form.company }] : []),
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className="flex gap-3 px-4 py-3"
                      style={{
                        background:  i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderBottom: i < arr.length - 1 ? '1px solid #1e1e2e' : 'none',
                      }}
                    >
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">
                        {label}
                      </span>
                      <span className="text-sm text-text flex-1 break-words leading-relaxed">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {submitState === 'error' && (
                  <p className="text-xs text-red-400 mt-3">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex-shrink-0 px-6 py-4 flex items-center gap-3"
          style={{ borderTop: '1px solid #1e1e2e' }}
        >
          {/* Left button: back / close */}
          {!showSuccess && (
            <button
              onClick={step > 1 ? () => goTo((step - 1) as 1 | 2 | 3) : handleClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text transition-all duration-200 cursor-pointer"
              style={{ border: '1px solid #1e1e2e' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2a2a3e')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e1e2e')}
            >
              {step > 1 ? t('back') : t('close')}
            </button>
          )}

          <div className="flex-1" />

          {/* Right button: next / submit */}
          {!showSuccess && step < 3 && (
            <button
              onClick={() => {
                if (step === 1) {
                  if (form.service) goTo(2);
                } else {
                  if (validateStep2()) goTo(3);
                }
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #ff6b2c, #ffb347)' }}
            >
              {t('next')}
            </button>
          )}

          {!showSuccess && step === 3 && (
            <button
              onClick={handleSubmit}
              disabled={submitState === 'submitting'}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #ff6b2c, #ffb347)' }}
            >
              {submitState === 'submitting' ? t('sending') : t('submit')}
            </button>
          )}

          {showSuccess && (
            <button
              onClick={handleClose}
              className="ml-auto px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text transition-all duration-200 cursor-pointer"
              style={{ border: '1px solid #1e1e2e' }}
            >
              {t('close')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
