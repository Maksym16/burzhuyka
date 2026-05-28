import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SERVICES = [
  'Монтаж димоходів',
  'Встановлення камінів',
  'Монтаж бань/лазні',
  'Продаж обладнання',
  'Консультація',
]

/* ─── SVG icons ─── */

function TgIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.83.941z"/>
    </svg>
  )
}

function VbIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.4 0C5.5.2 1.6 3.8.8 9.1c-.4 3-.1 5.8 1.2 8.4.5 1 .8 2 .7 3.1-.1 1-.3 2-.5 3-.2.6 0 1.1.6.9 1.2-.4 2.4-.9 3.5-1.5.8-.4 1.6-.5 2.5-.3 2.1.5 4.2.6 6.3.2 5.1-1 8.6-4.7 8.9-9.9.2-2.9-.5-5.5-2.2-7.8C19.7 2 16.5.3 12.8.1c-.5 0-.9 0-1.4-.1z"/>
    </svg>
  )
}

export default function Contacts() {
  const rootRef = useRef(null)
  const [form,         setForm]         = useState({ name: '', phone: '', service: '', message: '' })
  const [errors,       setErrors]       = useState({})
  const [submitted,    setSubmitted]    = useState(false)
  const [sending,      setSending]      = useState(false)
  const [privacyOpen,  setPrivacyOpen]  = useState(false)
  const [agreed,       setAgreed]       = useState(false)

  const closePrivacy = useCallback(() => setPrivacyOpen(false), [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-header', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      gsap.fromTo('.contact-left',   { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.contact-right',  { x:  40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.3 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

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
      alert(err.message || 'Помилка відправки. Спробуйте ще раз.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div ref={rootRef}>
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

      {/* ── Dark page header ── */}
      <section className="bg-forge-black pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="contact-header">
            <nav className="flex items-center gap-2 text-forge-muted text-sm mb-6">
              <Link to="/" className="hover:text-brand-primary transition-colors">Головна</Link>
              <span className="text-forge-border">/</span>
              <span className="text-forge-cream">Контакти</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
              <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                Зв&apos;яжіться з нами
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase text-forge-cream leading-none">
              Контакти
            </h1>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="bg-gray-50 py-14 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT — dark contact panel */}
            <div className="contact-left bg-forge-black text-forge-cream p-8 sm:p-10 relative overflow-hidden">
              {/* Corner accent */}
              <div className="absolute top-0 left-0 h-0.5 w-24 bg-brand-primary" />
              <div className="absolute top-0 left-0 w-0.5 h-24 bg-brand-primary" />

              <h2 className="font-display text-3xl font-bold uppercase text-forge-cream mb-10">
                Зв'язок з нами
              </h2>

              {/* Phone */}
              <div className="mb-8 space-y-6">
                <div>
                  <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-2">Монтаж</p>
                  <a
                    href="tel:+380935428302"
                    className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block leading-none"
                  >
                    +38 093 542 83 02
                  </a>
                </div>
                <div>
                  <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-2">Продаж</p>
                  <a
                    href="tel:+380688429412"
                    className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block leading-none mb-2"
                  >
                    +38 068 842 94 12
                  </a>
                  <a
                    href="tel:+380951420814"
                    className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block leading-none"
                  >
                    +38 095 142 08 14
                  </a>
                </div>
              </div>

              <div className="h-px bg-forge-border mb-8" />

              {/* Messengers */}
              <div className="mb-8">
                <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-4">Месенджери</p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://t.me/burzhuyka_montazh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-[#2AABEE] hover:bg-[#1d96d9] text-white font-semibold px-6 py-4 transition-all"
                  >
                    <TgIcon className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-white/70 uppercase tracking-wider mb-0.5">Написати в</div>
                      <div className="font-display text-xl font-bold uppercase tracking-wide">Telegram</div>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</span>
                  </a>
                  <a
                    href="viber://chat?number=%2B380688429412"
                    className="group flex items-center gap-4 bg-[#7360F2] hover:bg-[#5e4ed4] text-white font-semibold px-6 py-4 transition-all"
                  >
                    <VbIcon className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-white/70 uppercase tracking-wider mb-0.5">Написати в</div>
                      <div className="font-display text-xl font-bold uppercase tracking-wide">Viber</div>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</span>
                  </a>
                </div>
              </div>

              <div className="h-px bg-forge-border mb-8" />

              {/* Address */}
              <div className="flex items-start gap-2 text-forge-muted text-xs">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>м. Київ, Україна</span>
              </div>
            </div>

            {/* RIGHT — consultation form */}
            <div className="contact-right bg-white p-8 sm:p-10 relative">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 h-0.5 w-24 bg-brand-primary" />
              <div className="absolute top-0 right-0 w-0.5 h-24 bg-brand-primary" />

              <h2 className="font-display text-3xl font-bold uppercase text-gray-900 mb-2">
                Звернутись<br />за консультацією
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Передзвонимо протягом 30 хвилин у робочий час
              </p>

              {submitted ? (
                <div className="flex flex-col items-center gap-5 py-16 text-center">
                  <div className="w-16 h-16 bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-gray-900">Заявку надіслано!</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Дякуємо! Наш менеджер зв&apos;яжеться з вами найближчим часом.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-brand-primary font-semibold text-sm hover:underline"
                  >
                    Надіслати ще одну заявку
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-[0.12em] mb-2">
                        Ваше ім&apos;я <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Іван Іваненко"
                        className={`w-full border-b-2 px-0 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none transition-colors placeholder:text-gray-300 ${
                          errors.name
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-brand-primary'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-[0.12em] mb-2">
                        Телефон <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+38 (067) 000-00-00"
                        className={`w-full border-b-2 px-0 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none transition-colors placeholder:text-gray-300 ${
                          errors.phone
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-brand-primary'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-[0.12em] mb-2">
                      Послуга
                    </label>
                    <select
                      value={form.service}
                      onChange={e => setForm({ ...form, service: e.target.value })}
                      className="w-full border-b-2 border-gray-200 px-0 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none focus:border-brand-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">— Оберіть послугу —</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-[0.12em] mb-2">
                      Повідомлення
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Опишіть ваш запит або питання..."
                      className="w-full border-b-2 border-gray-200 px-0 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none focus:border-brand-primary transition-colors resize-none placeholder:text-gray-300"
                    />
                  </div>

                  <div className="pt-2 space-y-4">
                    {/* Consent checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={e => setAgreed(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 border-2 border-gray-300 peer-checked:border-brand-primary peer-checked:bg-brand-primary transition-all flex items-center justify-center">
                          {agreed && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-500 text-xs leading-relaxed select-none">
                        Я прочитав{' '}
                        <Link
                          to="/polityka-konfidencijnosti"
                          className="text-brand-primary underline hover:text-brand-dark transition-colors"
                        >
                          Політику конфіденційності
                        </Link>
                        {' '}та{' '}
                        <Link
                          to="/umovy-nadannia-posluh"
                          className="text-brand-primary underline hover:text-brand-dark transition-colors"
                        >
                          Умови надання послуг
                        </Link>
                        {' '}і погоджуюсь з ними
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={sending || !agreed}
                      className="w-full bg-brand-primary hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 uppercase tracking-widest text-sm transition-all hover:orange-glow"
                    >
                      {sending ? 'Надсилаємо...' : 'Надіслати заявку'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Bottom messenger CTA strip */}
          {/* <div className="mt-6 bg-forge-black p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-primary/40" />
            <p className="text-forge-muted text-xs uppercase tracking-widest mb-5">Або зв'яжіться через месенджер — відповідаємо цілодобово</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://t.me/salamander_montazh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#2AABEE] hover:bg-[#1d96d9] text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all"
              >
                <TgIcon className="w-5 h-5" />
                Telegram
              </a>
              <a
                href="viber://chat?number=%2B380670000000"
                className="flex items-center gap-3 bg-[#7360F2] hover:bg-[#5e4ed4] text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all"
              >
                <VbIcon className="w-5 h-5" />
                Viber
              </a>
              <a
                href="tel:+380670000000"
                className="flex items-center gap-3 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all"
              >
                <PhoneIcon className="w-5 h-5" />
                Передзвонити
              </a>
            </div>
          </div> */}
        </div>
      </section>

      <Footer />

      {/* Privacy Policy Modal */}
      {privacyOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePrivacy}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[88vh] flex flex-col relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Orange corner accent */}
            <div className="absolute top-0 left-0 h-0.5 w-16 bg-brand-primary pointer-events-none" />
            <div className="absolute top-0 left-0 w-0.5 h-16 bg-brand-primary pointer-events-none" />

            {/* Sticky header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <p className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.2em] mb-1">
                  Правова інформація
                </p>
                <h3 className="font-display text-xl font-bold uppercase text-gray-900">
                  Політика конфіденційності
                </h3>
              </div>
              <button
                onClick={closePrivacy}
                className="text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none ml-4 flex-shrink-0"
                aria-label="Закрити"
              >
                ×
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-6 text-sm text-gray-600 font-sans leading-relaxed space-y-8">
              <p className="text-gray-400 text-xs">Дата набрання чинності: 27 травня 2026 р.</p>

              <ModalSection title="1. Загальні положення">
                <p>
                  Ця Політика конфіденційності описує, як компанія <strong className="text-gray-800">«Буржуйка»</strong> (м. Київ, Україна) збирає, використовує та захищає персональні дані, що надаються через веб-сайт <strong className="text-gray-800">burzhuyka.com</strong>.
                </p>
                <p className="mt-2">
                  Обробка персональних даних здійснюється відповідно до Закону України «Про захист персональних даних» від 01.06.2010 № 2297-VI. Використовуючи Сайт та заповнюючи форму, ви даєте згоду на обробку даних на умовах, викладених нижче.
                </p>
              </ModalSection>

              <ModalSection title="2. Які персональні дані ми збираємо">
                <p className="mb-2">Ми збираємо лише дані, які ви самостійно вводите у форму зворотного зв&apos;язку:</p>
                <ul className="space-y-1.5">
                  <ModalItem>Ваше ім&apos;я — для персонального звернення під час зв&apos;язку.</ModalItem>
                  <ModalItem>Номер телефону — для зворотного дзвінка або консультації.</ModalItem>
                  <ModalItem>Тип послуги (необов&apos;язково) — для підготовки до розмови.</ModalItem>
                  <ModalItem>Повідомлення (необов&apos;язково) — для кращого розуміння запиту.</ModalItem>
                </ul>
                <p className="mt-2">Ми <strong className="text-gray-800">не збираємо</strong> паспортні дані, банківські реквізити або медичну інформацію.</p>
              </ModalSection>

              <ModalSection title="3. Мета обробки даних">
                <p className="mb-2">Надані дані використовуються виключно для:</p>
                <ul className="space-y-1.5">
                  <ModalItem>Зворотного зв&apos;язку — передзвонити або відповісти на запит.</ModalItem>
                  <ModalItem>Консультацій щодо монтажу печей, камінів та обладнання для лазні.</ModalItem>
                  <ModalItem>Оформлення замовлення на послуги або товари.</ModalItem>
                </ul>
                <p className="mt-2">Ваші дані <strong className="text-gray-800">не продаються</strong> та <strong className="text-gray-800">не передаються</strong> третім особам у комерційних цілях.</p>
              </ModalSection>

              <ModalSection title="4. Зберігання та захист даних">
                <p>
                  Персональні дані зберігаються на захищених серверах і доступні лише уповноваженим співробітникам Компанії. Ми застосовуємо шифрування з&apos;єднань (HTTPS) та обмежений доступ до систем обробки даних.
                </p>
                <p className="mt-2">
                  Дані зберігаються не довше ніж <strong className="text-gray-800">3 роки</strong> з моменту останнього контакту, якщо інше не вимагається законодавством.
                </p>
              </ModalSection>

              <ModalSection title="5. Файли cookie">
                <p className="mb-2">Сайт використовує технічні та аналітичні cookie. Вони допомагають:</p>
                <ul className="space-y-1.5">
                  <ModalItem>Забезпечувати коректну роботу сайту (технічні cookie).</ModalItem>
                  <ModalItem>Аналізувати відвідуваність для покращення сайту (аналітичні cookie).</ModalItem>
                </ul>
                <p className="mt-2">Ви можете вимкнути cookie у налаштуваннях браузера.</p>
              </ModalSection>

              <ModalSection title="6. Права суб'єкта персональних даних">
                <p className="mb-2">Відповідно до законодавства України ви маєте право:</p>
                <ul className="space-y-1.5">
                  <ModalItem><strong className="text-gray-800">Доступ</strong> — дізнатись, які дані ми обробляємо.</ModalItem>
                  <ModalItem><strong className="text-gray-800">Виправлення</strong> — вимагати уточнення неточних даних.</ModalItem>
                  <ModalItem><strong className="text-gray-800">Видалення</strong> — вимагати видалення ваших даних.</ModalItem>
                  <ModalItem><strong className="text-gray-800">Відкликання згоди</strong> — відкликати раніше надану згоду.</ModalItem>
                  <ModalItem><strong className="text-gray-800">Оскарження</strong> — звернутись до Уповноваженого Верховної Ради з прав людини.</ModalItem>
                </ul>
              </ModalSection>

              <ModalSection title="7. Контакти для запитів">
                <p>Для запитів щодо персональних даних зв&apos;яжіться з нами будь-яким зручним способом:</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <a href="tel:+380935428302" className="text-gray-800 hover:text-brand-primary transition-colors font-semibold">
                      +38 (093) 542-83-02
                    </a>
                  </div>
                  <div>
                    <div className="space-y-1">
                      <a href="tel:+380688429412" className="block text-gray-800 hover:text-brand-primary transition-colors font-semibold">
                        +38 (068) 842-94-12
                      </a>
                      <a href="tel:+380951420814" className="block text-gray-800 hover:text-brand-primary transition-colors font-semibold">
                        +38 (095) 142-08-14
                      </a>
                    </div>
                  </div>
                  <div>
                    <a href="mailto:burzhuyka.montazh@gmail.com" className="text-gray-800 hover:text-brand-primary transition-colors font-semibold underline">
                      burzhuyka.montazh@gmail.com
                    </a>
                  </div>
                </div>
                <p className="mt-3 text-gray-400">Відповімо протягом 30 календарних днів.</p>
              </ModalSection>

              <ModalSection title="8. Зміни до Політики" last>
                <p>
                  Компанія може вносити зміни до цієї Політики. Актуальна версія завжди доступна на сторінці{' '}
                  <Link to="/polityka-konfidencijnosti" onClick={closePrivacy} className="text-brand-primary hover:underline">
                    burzhuyka.com/polityka-konfidencijnosti
                  </Link>.
                </p>
              </ModalSection>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex justify-end">
              <button
                onClick={closePrivacy}
                className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold px-6 py-2.5 uppercase tracking-widest transition-colors"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ModalSection({ title, children, last }) {
  return (
    <div className={last ? '' : 'pb-6 border-b border-gray-100'}>
      <h4 className="font-display text-sm font-bold uppercase text-gray-900 tracking-wide mb-3">{title}</h4>
      {children}
    </div>
  )
}

ModalSection.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
  last: PropTypes.bool,
}

function ModalItem({ children }) {
  return (
    <li className="flex items-start gap-2 list-none">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0 mt-1.5" />
      <span>{children}</span>
    </li>
  )
}

ModalItem.propTypes = {
  children: PropTypes.node,
}
