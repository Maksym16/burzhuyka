import { useState, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { SAUNA_PACKAGES } from '../data/saunaPricing'
import { fetchSaunaGallery } from '../api/saunaGallery'

gsap.registerPlugin(ScrollTrigger)

const CANONICAL_URL = 'https://burzhuyka.com/montazh-saun-ta-ban'
const OG_IMAGE_URL  = 'https://burzhuyka.com/burzuika_org_image.png'

/* ─── SVG icons (same as Home / Contacts) ─── */
function TgIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.83.941z"/>
    </svg>
  )
}

TgIcon.propTypes = { className: PropTypes.string }

function VbIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.4 0C5.5.2 1.6 3.8.8 9.1c-.4 3-.1 5.8 1.2 8.4.5 1 .8 2 .7 3.1-.1 1-.3 2-.5 3-.2.6 0 1.1.6.9 1.2-.4 2.4-.9 3.5-1.5.8-.4 1.6-.5 2.5-.3 2.1.5 4.2.6 6.3.2 5.1-1 8.6-4.7 8.9-9.9.2-2.9-.5-5.5-2.2-7.8C19.7 2 16.5.3 12.8.1c-.5 0-.9 0-1.4-.1z"/>
    </svg>
  )
}

VbIcon.propTypes = { className: PropTypes.string }

/* ─── Data (word for word from the content brief) ─── */

const STATS = [
  { num: '500+', label: 'виконаних проектів' },
  { num: '10+',  label: 'років на ринку' },
  { num: '1+',   label: 'рік гарантії на монтаж і обладнання' },
]

// Hero temperature gauge — scale 0–110°C, matching the sauna's real
// operating range quoted in the intro copy ("90–110 °C").
const GAUGE_MAX = 110
const GAUGE_TICKS = [20, 60]
const GAUGE_HOT_ZONE = { from: 90, to: 110 }
const gaugePct = (value) => (value / GAUGE_MAX) * 100

const SAUNA_TYPES = [
  {
    id: '01',
    title: 'Сауна в квартирі',
    text: 'Компактна парна з електрокам\'янкою у ванній, гардеробній чи окремій кімнаті. Розраховуємо потужність під вашу електромережу, робимо герметичну пароізоляцію та вентиляцію, щоб волога не потрапляла в інші приміщення.',
  },
  {
    id: '02',
    title: 'Сауна в приватному будинку',
    text: 'Парна в підвалі, на мансарді або в окремому приміщенні біля басейну чи душової. Можливі дров\'яна піч із виведенням димоходу або електрокам\'янка з виносним пультом.',
  },
  {
    id: '03',
    title: 'Баня на дровах',
    text: 'Класична російська баня або українська лазня з дров\'яною піччю, топкою з передбанника, баком для води та м\'якою парою. Монтуємо піч, утеплений димохід і захист стін у зоні печі.',
  },
  {
    id: '04',
    title: 'Фінська сауна',
    text: 'Сухий жар 80–100 °C, мінімалістичні полиці, LED-підсвітка. Ідеально для щоденного використання.',
  },
  {
    id: '05',
    title: 'Інфрачервона кабіна та гімалайська сіль',
    text: 'Як окремий варіант або доповнення до класичної парної: панелі з сіллю, ІЧ-випромінювачі в спинках полиць.',
  },
  {
    id: '06',
    title: 'Сауни для бізнесу',
    text: 'Готелі, фітнес-клуби, бази відпочинку, SPA. Підбираємо обладнання для інтенсивної роботи та забезпечуємо дотримання вимог пожежної безпеки.',
  },
]

const INSTALL_STEPS = [
  { id: '01', title: 'Заміри та проект', text: 'Виїзд на об\'єкт, оцінка стін, підлоги, електрики та можливості виведення димоходу. Ескіз парної з розташуванням печі, полиць і дверей.' },
  { id: '02', title: 'Каркас', text: 'Монтаж каркасу зі струганого бруса камерної сушки, обробленого антисептиком і антипіреном.' },
  { id: '03', title: 'Утеплення та пароізоляція', text: 'Базальтова вата, фольгований пароізоляційний шар із проклеюванням швів, вентиляційний зазор під вагонкою.' },
  { id: '04', title: 'Обшивка стін і стелі', text: 'Вагонка або профіль STEP / SoftLine з липи, вільхи, фінської ялини, кедра чи термодеревини.' },
  { id: '05', title: 'Полиці та спинки', text: 'Дво- або трирівневі полиці, у тому числі «ширяючі» (підвісні) лави, підголівники, драбинки для підлоги.' },
  { id: '06', title: 'Піч і димохід', text: 'Встановлення електрокам\'янки або дров\'яної печі, монтаж утепленого димоходу, захисні екрани та негорючі матеріали в зоні печі. Для електрики — підключення до окремої лінії з автоматом.' },
  { id: '07', title: 'Вентиляція', text: 'Припливно-витяжна схема з регульованими продухами — без неї парна задушлива, а дерево швидко темніє.' },
  { id: '08', title: 'Світло та декор', text: 'Термостійкі світильники, LED-стрічки під полицями, панно з ялівцю чи гімалайської солі.' },
  { id: '09', title: 'Двері', text: 'Скляні загартовані або дерев\'яні двері для сауни.' },
  { id: '10', title: 'Пробний запуск та інструктаж', text: 'Перший розігрів при вас, пояснюємо правила експлуатації та догляду за деревом.' },
]

const WOOD_TABLE = [
  { wood: 'Липа',                                   features: 'Не виділяє смолу, слабо нагрівається, світлий колір і м\'який аромат', bestFor: 'Полиці та стіни, класичний вибір' },
  { wood: 'Вільха',                                  features: 'Теплий відтінок, стійка до вологи, не темніє довго',                   bestFor: 'Стіни, стеля, бані з парою' },
  { wood: 'Фінська ялина',                           features: 'Доступна ціна, рівна якість, хвойний аромат',                          bestFor: 'Стіни та стеля у фінських саунах' },
  { wood: 'Канадський кедр',                         features: 'Виражений аромат, природна стійкість до гниття',                       bestFor: 'Преміальні сауни, акцентні стіни' },
  { wood: 'Абаш',                                    features: 'Майже не нагрівається, дуже щільний',                                  bestFor: 'Полиці та підголівники' },
  { wood: 'Термодеревина (термолипа, термоосина)',   features: 'Не деформується, не боїться вологи, глибокий темний колір',            bestFor: 'Сучасний дизайн, акценти' },
]

const PROCESS_STEPS = [
  { id: '01', title: 'Заявка', text: 'Телефонуєте або надсилаєте фото та розміри приміщення в Viber / Telegram — даємо орієнтовну ціну того ж дня.' },
  { id: '02', title: 'Виїзд на об\'єкт', text: 'Майстер робить заміри, перевіряє електрику, вентиляцію та можливість виведення димоходу.' },
  { id: '03', title: 'Проект і кошторис', text: 'Узгоджуємо планування, породу дерева, піч і декор. Надаємо детальний кошторис із переліком робіт і матеріалів — ціна не змінюється в процесі.' },
  { id: '04', title: 'Доставка матеріалів', text: 'Привозимо піч, вагонку, утеплювач і все для монтажу.' },
  { id: '05', title: 'Монтаж', text: 'Сауна в квартирі — зазвичай 5–10 робочих днів, баня з дров\'яною піччю — від 2 тижнів, залежно від площі та складності.' },
  { id: '06', title: 'Запуск і гарантія', text: 'Пробний розігрів, інструктаж і гарантія на роботи та обладнання.' },
]

const ADVANTAGES = [
  { title: 'Піч, димохід і парна — одна команда', text: 'Не потрібно шукати окремо пічника, монтажника димоходу та столяра. Одна відповідальність і одна гарантія.' },
  { title: 'Понад 10 років із печами', text: 'Ми знаємо, як правильно встановити кам\'янку та захистити стіни від перегріву.' },
  { title: 'Прозорий кошторис', text: 'Перелік усіх робіт і матеріалів до початку монтажу, без доплат «по ходу».' },
  { title: 'Перевірені матеріали', text: 'Дерево камерної сушки, сертифіковані печі та негорючі матеріали.' },
  { title: 'Гарантія на монтаж і обладнання', text: 'Від 1 року.' },
  { title: 'Київ та область', text: 'Виїзд на заміри в узгоджений день.' },
]

const FAQS = [
  { q: 'Чи можна зробити сауну в квартирі?', a: 'Так. Використовуємо електрокам\'янку, робимо герметичну пароізоляцію та вентиляцію. Потрібна окрема електролінія відповідної потужності — перевіряємо це на замірах.' },
  { q: 'Скільки часу займає монтаж?', a: 'Сауна в квартирі — зазвичай 5–10 робочих днів. Баня з дров\'яною піччю та димоходом — від 2 тижнів.' },
  { q: 'Яке дерево краще для полиць?', a: 'Липа або абаш: вони майже не нагріваються та не виділяють смолу. Хвойні породи краще залишити для стін.' },
  { q: 'Електрокам\'янка чи дров\'яна піч?', a: 'Електрична — для квартир і швидкого розігріву без дров. Дров\'яна — для приватного будинку чи окремої бані, де можна вивести димохід і хочеться справжньої пари.' },
  { q: 'Яка потужність печі потрібна?', a: 'Орієнтовно 1 кВт на 1 м³ утепленої парної, плюс запас на скляні двері та кам\'яні стіни. Точний розрахунок робимо під ваш проект.' },
  { q: 'Чи можна купити лише піч або лише змонтувати димохід?', a: 'Так. Продаємо печі для саун із каталогу без монтажу, а також окремо встановлюємо піч і димохід у готову парну.' },
  { q: 'Чи даєте гарантію?', a: 'Так, від 1 року на виконаний монтаж та на обладнання, придбане в нас.' },
]

/* ─── JSON-LD ─── */
const SERVICE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Монтаж саун та бань під ключ',
  name: 'Монтаж саун та бань — Буржуйка',
  description: 'Монтаж саун і бань під ключ у Києві та області: каркас, утеплення, вагонка, полиці, піч і димохід.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Буржуйка',
    url: 'https://burzhuyka.com',
    telephone: '+380935428302',
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Київ та Київська область',
  },
  url: CANONICAL_URL,
  offers: SAUNA_PACKAGES.map(p => ({
    '@type': 'Offer',
    name: `Сауна «${p.title}»`,
    priceCurrency: 'UAH',
    price: p.priceFrom,
    url: CANONICAL_URL,
  })),
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
}

/* ─── Accessible accordion item ─── */
function FaqItem({ id, question, answer, isOpen, onToggle }) {
  const panelId  = `faq-panel-${id}`
  const buttonId = `faq-button-${id}`
  return (
    <div className="border border-forge-border bg-forge-card">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 text-forge-cream font-display font-bold uppercase text-base sm:text-lg hover:text-brand-primary transition-colors"
        >
          <span>{question}</span>
          <span
            aria-hidden="true"
            className={`flex-shrink-0 text-brand-primary text-2xl leading-none transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="px-6 pb-5"
      >
        <p className="text-forge-muted text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

FaqItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

/* ─── Page ─── */
export default function MontazhSaunTaBan() {
  const rootRef = useRef(null)
  const gaugeFillRef = useRef(null)

  const [openFaq, setOpenFaq] = useState(0)

  const { data: portfolio = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ['sauna-gallery'],
    queryFn: fetchSaunaGallery,
  })

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.sh-hero-fade', { y: 22, opacity: 0 })

      gsap.to('.sh-hero-fade', { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.1 })

      if (gaugeFillRef.current) {
        gsap.fromTo(gaugeFillRef.current,
          { width: '0%' },
          { width: '100%', duration: 1.4, ease: 'power2.out', delay: 0.5 }
        )
      }

      gsap.utils.toArray('.sh-reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Portfolio height changes once photos load, so scroll-reveal positions below it need recalculating
  useLayoutEffect(() => {
    ScrollTrigger.refresh()
  }, [portfolio.length, portfolioLoading])

  return (
    <div ref={rootRef} className="bg-forge-black text-forge-cream">
      <Helmet>
        <title>Монтаж сауни та бані під ключ у Києві та області — Буржуйка</title>
        <meta name="description" content="Монтаж саун і бань під ключ у Києві та області: каркас, утеплення, вагонка, полиці, піч і димохід. Виїзд на заміри, кошторис, гарантія. 500+ проектів." />
        <link rel="canonical" href={CANONICAL_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Монтаж сауни та бані під ключ у Києві — Буржуйка" />
        <meta property="og:description" content="Монтаж саун і бань під ключ у Києві та області: каркас, утеплення, вагонка, полиці, піч і димохід. Виїзд на заміри, кошторис, гарантія. 500+ проектів." />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:url" content={CANONICAL_URL} />

        <script type="application/ld+json">{JSON.stringify(SERVICE_JSON_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_JSON_LD)}</script>
      </Helmet>

      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-forge-black pt-28 pb-20 lg:pt-32 lg:pb-24">
        {/* Ghost numeral — the sauna's defining fact, bleeding off the edge */}
        <div
          aria-hidden="true"
          className="absolute -top-10 right-0 lg:-right-8 select-none pointer-events-none font-display font-bold text-brand-primary/[0.06] leading-none text-[200px] sm:text-[280px] lg:text-[360px]"
        >
          100°
        </div>
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-brand-primary/6 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="sh-hero-fade flex items-center gap-2 text-forge-muted text-sm mb-6">
            <Link to="/" className="hover:text-brand-primary transition-colors">Головна</Link>
            <span className="text-forge-border">/</span>
            <span className="text-forge-cream">Монтаж саун та бань</span>
          </nav>

          <div className="sh-hero-fade flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
              Монтаж саун та бань — Буржуйка
            </span>
          </div>

          <h1 className="sh-hero-fade font-display font-bold uppercase leading-[1.02] mb-6 text-4xl sm:text-5xl lg:text-6xl max-w-4xl">
            <span className="block text-forge-cream">Монтаж саун та бань під ключ</span>
            <span className="block text-brand-primary">у Києві та області</span>
          </h1>

          <p className="sh-hero-fade text-forge-dim text-base sm:text-lg leading-relaxed max-w-2xl mb-12">
            Облаштовуємо парні від каркасу до першого пару: утеплення, вагонка, полиці, піч, димохід, вентиляція та світло — одна команда і одна гарантія.
          </p>

          {/* Temperature gauge — signature element */}
          <div className="sh-hero-fade max-w-xl mb-10">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-forge-dim text-xs uppercase tracking-[0.2em]">Температура в парній</span>
              <span className="font-display text-xl font-bold text-brand-primary leading-none">90–110 °C</span>
            </div>
            <div
              role="img"
              aria-label="Шкала температури парної від 0 до 110 градусів з робочою зоною 90–110 °C"
              className="relative h-2 bg-forge-border"
            >
              {/* Hot-zone band (90–110°C) */}
              <div
                className="absolute inset-y-0 bg-brand-primary/25"
                style={{ left: `${gaugePct(GAUGE_HOT_ZONE.from)}%`, right: 0 }}
              />
              {/* Animated fill */}
              <div
                ref={gaugeFillRef}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-forge-muted via-brand-primary to-brand-light"
                style={{ width: '0%' }}
              />
              {/* Ticks */}
              {GAUGE_TICKS.map(t => (
                <div
                  key={t}
                  className="absolute top-0 bottom-0 w-px bg-forge-black/40"
                  style={{ left: `${gaugePct(t)}%` }}
                />
              ))}
            </div>
            <div className="relative h-4 mt-1.5">
              {GAUGE_TICKS.map(t => (
                <span
                  key={t}
                  className="absolute -translate-x-1/2 text-forge-muted text-[11px]"
                  style={{ left: `${gaugePct(t)}%` }}
                >
                  {t}°
                </span>
              ))}
              <span className="absolute right-0 text-brand-primary text-[11px] font-semibold">110°+</span>
            </div>
          </div>

          <div className="sh-hero-fade flex flex-wrap items-center gap-4 mb-10">
            <Link
              to="/contacts#consultation"
              className="inline-flex items-center gap-2.5 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all hover:orange-glow"
            >
              Прорахувати сауну <span>→</span>
            </Link>
            <a
              href="https://t.me/+380688429412"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Надіслати фото приміщення в Telegram"
              className="inline-flex items-center gap-2.5 border border-[#2AABEE] text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white font-semibold px-5 py-4 text-sm uppercase tracking-[0.1em] transition-all"
            >
              <TgIcon className="w-4 h-4" />
              Telegram
            </a>
            <a
              href="viber://chat?number=%2B380688429412"
              aria-label="Надіслати фото приміщення в Viber"
              className="inline-flex items-center gap-2.5 border border-[#7360F2] text-[#7360F2] hover:bg-[#7360F2] hover:text-white font-semibold px-5 py-4 text-sm uppercase tracking-[0.1em] transition-all"
            >
              <VbIcon className="w-4 h-4" />
              Viber
            </a>
          </div>

    
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />
      </section>

      {/* ═══════════ INTRO ═══════════ */}
      <section className="py-20 bg-forge-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 sh-reveal">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Про монтаж</span>
          </div>
          <div className="space-y-5 text-forge-muted text-base leading-relaxed">
            <p>
              Сауна — це не просто кімната, обшита деревом. Це приміщення, де температура піднімається до 90–110 °C, а вологість змінюється за лічені хвилини. Помилки в пароізоляції, вентиляції чи монтажі печі тут коштують дорого: волога в стінах, грибок, тріщини у вагонці або небезпека пожежі.
            </p>
            <p>
              «Буржуйка» понад 10 років займається монтажем печей, камінів і димоходів, тому парну ми будуємо від її серця — нагрівального обладнання. Ми самі підбираємо піч, самі монтуємо димохід і самі облаштовуємо парну, тож відповідаємо за весь результат, а не за окремий етап.
            </p>
            <p>
              Працюємо з квартирами, приватними будинками, дачами та комерційними об&apos;єктами: від компактної сауни на 2 особи до бані з комплексом відпочинку.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ ВАРІАНТИ ОБЛАШТУВАННЯ ═══════════ */}
      <section className="py-24 bg-forge-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4 sh-reveal">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Варіанти облаштування</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-14 sh-reveal">
            Які сауни та бані ми монтуємо
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-forge-border">
            {SAUNA_TYPES.map(t => (
              <div key={t.id} className="sh-reveal relative bg-forge-card p-7 overflow-hidden">
                <span className="absolute top-3 right-5 font-display text-5xl font-bold text-white/5 leading-none select-none">
                  {t.id}
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-forge-cream mb-3 relative">{t.title}</h3>
                <p className="text-forge-muted text-sm leading-relaxed relative">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ЩО ВХОДИТЬ У РОБОТУ ═══════════ */}
      <section className="py-24 bg-forge-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4 sh-reveal">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Монтаж під ключ</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-14 sh-reveal">
            Що входить у роботу
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10">
            {INSTALL_STEPS.map(step => (
              <div key={step.id} className="sh-reveal grid grid-cols-[auto_1fr] gap-5">
                <span className="font-display text-4xl font-bold text-brand-primary/40 leading-none flex-shrink-0">
                  {step.id}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold uppercase text-forge-cream mb-2">{step.title}</h3>
                  <p className="text-forge-muted text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ З ЧОГО МИ БУДУЄМО ═══════════ */}
      <section className="py-24 bg-forge-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4 sh-reveal">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Матеріали та обладнання</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-8 sh-reveal">
            З чого ми будуємо
          </h2>
          <p className="text-forge-muted text-base leading-relaxed mb-10 max-w-3xl sh-reveal">
            Дерево для парної підбираємо під ваш бюджет і спосіб використання:
          </p>

          {/* Wood table — real table on desktop, stacked cards on mobile */}
          <div className="sh-reveal mb-4">
            {/* Desktop / tablet table */}
            <div className="hidden md:block overflow-x-auto border border-forge-border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-forge-card">
                    <th className="text-left font-display uppercase text-xs tracking-widest text-brand-primary px-5 py-4 border-b border-forge-border">Порода</th>
                    <th className="text-left font-display uppercase text-xs tracking-widest text-brand-primary px-5 py-4 border-b border-forge-border">Особливості</th>
                    <th className="text-left font-display uppercase text-xs tracking-widest text-brand-primary px-5 py-4 border-b border-forge-border">Де краще</th>
                  </tr>
                </thead>
                <tbody>
                  {WOOD_TABLE.map((row, i) => (
                    <tr key={row.wood} className={i % 2 === 1 ? 'bg-forge-surface' : ''}>
                      <td className="px-5 py-4 align-top text-forge-cream font-semibold border-b border-forge-border whitespace-nowrap">{row.wood}</td>
                      <td className="px-5 py-4 align-top text-forge-muted border-b border-forge-border">{row.features}</td>
                      <td className="px-5 py-4 align-top text-forge-muted border-b border-forge-border">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards — no horizontal scroll */}
            <div className="md:hidden space-y-4">
              {WOOD_TABLE.map(row => (
                <div key={row.wood} className="bg-forge-card border border-forge-border p-5">
                  <h4 className="font-display text-base font-bold uppercase text-brand-primary mb-3">{row.wood}</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-forge-dim text-xs uppercase tracking-widest mb-1">Особливості</dt>
                      <dd className="text-forge-muted leading-relaxed">{row.features}</dd>
                    </div>
                    <div>
                      <dt className="text-forge-dim text-xs uppercase tracking-widest mb-1">Де краще</dt>
                      <dd className="text-forge-muted leading-relaxed">{row.bestFor}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>

          {/* Heaters / chimney / other materials */}
          <div className="space-y-6 max-w-3xl mt-12">
            <p className="sh-reveal text-forge-muted text-sm leading-relaxed">
              <span className="text-forge-cream font-semibold">Нагрівальне обладнання. </span>
              Продаємо та монтуємо{' '}
              <Link to="/catalog" className="text-brand-primary underline hover:text-brand-dark transition-colors">
                печі для саун
              </Link>{' '}
              зі свого каталогу: електрокам&apos;янки з вбудованим або виносним пультом, дров&apos;яні печі з топкою з передбанника, печі з парогенератором. Підбираємо потужність за об&apos;ємом парної та утепленням — щоб сауна прогрівалась за 40–60 хвилин без перевитрати енергії.
            </p>
            <p className="sh-reveal text-forge-muted text-sm leading-relaxed">
              <span className="text-forge-cream font-semibold">Димохід для печі в бані. </span>
              Монтуємо утеплені (сендвіч) димоходи з нержавіючої сталі, прохідні вузли через стелю та покрівлю, захисні екрани. Це наша основна спеціалізація, тому безпечне виведення диму — частина кожного проекту з дров&apos;яною піччю.
            </p>
            <p className="sh-reveal text-forge-muted text-sm leading-relaxed">
              <span className="text-forge-cream font-semibold">Інші матеріали: </span>
              базальтова вата, фольгований пароізоляційний шар і алюмінієвий скотч, термостійкі кабелі та світильники, загартоване скло для дверей, просочення для полиць на основі натуральних олій і воску.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ ВІД ЗАЯВКИ ДО ПЕРШОГО ПАРУ ═══════════ */}
      <section className="py-24 bg-forge-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4 sh-reveal">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Процес</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-12 sh-reveal">
            Від заявки до першого пару
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-forge-border">
            {PROCESS_STEPS.map(step => (
              <div key={step.id} className="sh-reveal bg-forge-card p-6">
                <span className="font-display text-3xl font-bold text-brand-primary/30 leading-none block mb-3">{step.id}</span>
                <h3 className="font-display text-lg font-bold uppercase text-forge-cream mb-2">{step.title}</h3>
                <p className="text-forge-muted text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ВАРТІСТЬ САУНИ ПІД КЛЮЧ ═══════════ */}
      <section className="py-24 bg-forge-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4 sh-reveal">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Ціни на монтаж</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-6 sh-reveal">
            Вартість сауни під ключ
          </h2>
          <p className="text-forge-muted text-base leading-relaxed mb-14 max-w-3xl sh-reveal">
            Нижче — типові комплектації. Точну ціну розраховуємо після замірів: вона залежить від розмірів, породи дерева, печі та декору.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {SAUNA_PACKAGES.map(pkg => (
              <div key={pkg.id} className="sh-reveal flex flex-col bg-forge-card border border-forge-border hover:border-brand-primary/50 transition-colors p-8">
                <h3 className="font-display text-2xl font-bold uppercase text-forge-cream mb-1">{pkg.title}</h3>
                <p className="text-forge-dim text-xs uppercase tracking-widest mb-6">{pkg.size} · {pkg.persons}</p>

                <ul className="space-y-2 mb-8 flex-1">
                  {pkg.included.map(item => (
                    <li key={item} className="flex items-start gap-2 text-forge-muted text-sm leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-brand-primary flex-shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mb-6">
                  <span className="text-forge-dim text-xs uppercase tracking-wider">від </span>
                  <span className="font-display text-3xl font-bold text-brand-primary leading-none">
                    {pkg.priceFrom.toLocaleString('uk-UA')}
                  </span>
                  <span className="text-forge-dim text-xs ml-1">грн</span>
                </div>

                <Link
                  to="/contacts#consultation"
                  className="inline-flex items-center justify-center gap-2 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold px-6 py-3 text-sm uppercase tracking-widest transition-all"
                >
                  Замовити <span>→</span>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-forge-muted text-sm leading-relaxed mb-10 max-w-3xl sh-reveal">
            Окремо можна замовити монтаж печі та димоходу для вже готової парної, переобшивку старої сауни або лише продаж обладнання.
          </p>

          <div className="sh-reveal">
            <Link
              to="/contacts#consultation"
              className="inline-flex items-center gap-2.5 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all hover:orange-glow"
            >
              Отримати точний кошторис <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ ЧОМУ ОБИРАЮТЬ БУРЖУЙКУ ═══════════ */}
      <section className="py-24 bg-forge-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4 sh-reveal">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Довіра</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-12 sh-reveal">
            Чому обирають Буржуйку
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map(a => (
              <div key={a.title} className="sh-reveal bg-forge-black border border-forge-border p-6">
                <h3 className="font-display text-base font-bold uppercase text-brand-primary mb-3 leading-snug">{a.title}</h3>
                <p className="text-forge-muted text-sm leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ НАШІ РОБОТИ ═══════════ */}
      <section hidden={!portfolioLoading && portfolio.length === 0} className="py-24 bg-forge-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sh-reveal">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
                <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Портфоліо</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none">
                Наші роботи
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold px-6 py-3 text-sm uppercase tracking-widest transition-all flex-shrink-0"
            >
              Дивитись усі роботи <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sh-reveal">
            {portfolioLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-forge-surface animate-pulse" aria-hidden="true" />
                ))
              : portfolio.map(img => (
                  <div key={img.id} className="aspect-square overflow-hidden bg-forge-surface">
                    <img
                      src={img.url}
                      alt="Монтаж сауни — приклад роботи"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ПИТАННЯ ТА ВІДПОВІДІ ═══════════ */}
      <section className="py-24 bg-forge-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4 sh-reveal">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">FAQ</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-12 sh-reveal">
            Питання та відповіді
          </h2>

          <div className="space-y-3 sh-reveal">
            {FAQS.map((f, i) => (
              <FaqItem
                key={f.q}
                id={i}
                question={f.q}
                answer={f.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACTS ═══════════ */}
      <section className="py-24 bg-forge-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sh-reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-brand-primary" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Контакти</span>
            <div className="h-px w-10 bg-brand-primary" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream mb-10">
            Монтаж
          </h2>

          <a href="tel:+380935428302" className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block mb-10">
            +38 093 542 83 02
          </a>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://t.me/+380688429412"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 border border-[#2AABEE] text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all"
            >
              <TgIcon className="w-4 h-4" />
              Telegram
            </a>
            <a
              href="viber://chat?number=%2B380688429412"
              className="flex items-center gap-2.5 border border-[#7360F2] text-[#7360F2] hover:bg-[#7360F2] hover:text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all"
            >
              <VbIcon className="w-4 h-4" />
              Viber
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
