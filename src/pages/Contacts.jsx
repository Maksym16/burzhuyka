import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence, motion } from 'motion/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { TgIcon, VbIcon } from '../components/Icons'
import { EASE, Reveal } from '../components/fx'

const SERVICES = [
  'Монтаж димоходів',
  'Встановлення камінів',
  'Монтаж бань/лазні',
  'Продаж обладнання',
  'Консультація',
]

export default function Contacts() {
  const formRef = useRef(null)
  const { hash } = useLocation()
  const [form,         setForm]         = useState({ name: '', phone: '', service: '', message: '' })
  const [errors,       setErrors]       = useState({})
  const [submitted,    setSubmitted]    = useState(false)
  const [sending,      setSending]      = useState(false)
  const [agreed,       setAgreed]       = useState(false)
  const [submitError,  setSubmitError]  = useState('')

  useEffect(() => {
    if (hash === '#consultation') {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = "Вкажіть ваше ім'я"
    if (!form.phone.trim()) e.phone = 'Вкажіть номер телефону'
    return e
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitError('')
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name,
          phone:   form.phone,
          service: form.service,
          message: form.message,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Помилка відправки')
      }
      setSubmitted(true)
      setForm({ name: '', phone: '', service: '', message: '' })
      setAgreed(false)
    } catch (err) {
      setSubmitError(err.message || 'Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <Helmet>
        <title>Контакти — Буржуйка | Київ</title>
        <meta name="description" content="Зв'яжіться з нами для консультації по монтажу та продажу печей і камінів. Київ та область." />
        <meta property="og:title" content="Контакти — Буржуйка" />
        <meta property="og:description" content="Зв'яжіться з нами для консультації по монтажу та продажу печей і камінів. Київ та область." />
        <meta property="og:image" content="https://burzhuyka.com/burzuika_org_image.png" />
        <meta property="og:url" content="https://burzhuyka.com/contacts" />
        <link rel="canonical" href="https://burzhuyka.com/contacts" />
      </Helmet>

      <Navbar />

      <PageHeader crumbs={[{ label: 'Контакти' }]} title="Контакти" />

      <section className="py-12 lg:py-20">
        <div className="page-wrap grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="heading-xl mb-8">Зв&apos;язок з нами</h2>

            <div className="space-y-6">
              <div className="border-t border-flue pt-4">
                <p className="text-sm text-steel mb-2">Монтаж</p>
                <a href="tel:+380935428302" className="block font-display text-2xl sm:text-3xl font-normal tracking-[-0.01em] hover:text-brand-primary transition-colors">
                  +38 093 542 83 02
                </a>
              </div>
              <div className="border-t border-flue pt-4">
                <p className="text-sm text-steel mb-2">Продаж</p>
                <a href="tel:+380688429412" className="block font-display text-2xl sm:text-3xl font-normal tracking-[-0.01em] hover:text-brand-primary transition-colors mb-1">
                  +38 068 842 94 12
                </a>
                <a href="tel:+380951420814" className="block font-display text-2xl sm:text-3xl font-normal tracking-[-0.01em] hover:text-brand-primary transition-colors">
                  +38 095 142 08 14
                </a>
              </div>
              <div className="border-t border-flue pt-4">
                <p className="text-sm text-steel mb-3">Месенджери</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://t.me/burzhuyka_montazh" target="_blank" rel="noopener noreferrer" className="btn-on-light">
                    <TgIcon className="w-5 h-5 text-[#229ED9]" />
                    Написати в Telegram
                  </a>
                  <a href="viber://chat?number=%2B380688429412" className="btn-on-light">
                    <VbIcon className="w-5 h-5 text-[#7360F2]" />
                    Написати у Viber
                  </a>
                </div>
              </div>
              <div className="border-t border-flue pt-4">
                <p className="text-sm text-steel mb-1">Де працюємо</p>
                <p className="font-normal">Київ та область</p>
              </div>
            </div>
          </Reveal>

          <div id="consultation" ref={formRef} className="lg:col-span-6 lg:col-start-7 bg-paper rounded-3xl shadow-[0_24px_70px_-40px_rgba(32,37,42,.5)] p-6 sm:p-10 scroll-mt-24">
            <h2 className="heading-lg">Звернутись за консультацією</h2>
            <p className="mt-3 mb-8 text-steel">Передзвонимо протягом 30 хвилин у робочий час.</p>

            {submitted ? (
              <motion.div className="py-10" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                <svg className="mb-5 h-16 w-16 text-brand-primary" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <motion.circle cx="26" cy="26" r="24" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeInOut' }} />
                  <motion.path d="M15 27l8 8 14-16" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }} />
                </svg>
                <h3 className="heading-md">Заявку надіслано</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-steel">
                  Дякуємо! Наш менеджер зв&apos;яжеться з вами найближчим часом.
                </p>
                <button onClick={() => setSubmitted(false)} className="text-link mt-6">
                  Надіслати ще одну заявку
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="field-label">Ваше ім&apos;я</label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      aria-invalid={!!errors.name}
                      className={`field ${errors.name ? '!border-red-700' : ''}`}
                    />
                    <AnimatePresence>
                      {errors.name && <motion.p className="field-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors.name}</motion.p>}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="field-label">Телефон</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+38 067 000 00 00"
                      aria-invalid={!!errors.phone}
                      className={`field ${errors.phone ? '!border-red-700' : ''}`}
                    />
                    <AnimatePresence>
                      {errors.phone && <motion.p className="field-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors.phone}</motion.p>}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-service" className="field-label">Послуга (необов&apos;язково)</label>
                  <select
                    id="contact-service"
                    value={form.service}
                    onChange={e => setForm({ ...form, service: e.target.value })}
                    className="field cursor-pointer"
                  >
                    <option value="">Оберіть послугу</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="field-label">Повідомлення (необов&apos;язково)</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="field resize-none"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-brand-primary"
                  />
                  <span className="text-sm leading-relaxed text-steel">
                    Я прочитав{' '}
                    <Link to="/polityka-konfidencijnosti" className="text-link">Політику конфіденційності</Link>
                    {' '}та{' '}
                    <Link to="/umovy-nadannia-posluh" className="text-link">Умови надання послуг</Link>
                    {' '}і погоджуюсь з ними
                  </span>
                </label>

                {submitError && <p className="field-error" role="alert">{submitError}</p>}

                <motion.button whileTap={agreed ? { scale: 0.98 } : undefined} type="submit" disabled={sending || !agreed} className="btn-primary w-full">
                  {sending ? 'Надсилаємо...' : 'Надіслати заявку'}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
