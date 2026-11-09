import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactPanel from '../components/ContactPanel'
import { TgIcon, VbIcon } from '../components/Icons'
import { CountUp, EASE, Embers, Reveal, SpotlightCard, WordsReveal } from '../components/fx'
import { fetchSaunaGallery } from '../api/saunaGallery'

const CANONICAL_URL = 'https://burzhuyka.com/montazh-saun-ta-ban'
const OG_IMAGE_URL  = 'https://burzhuyka.com/burzuika_org_image.png'

/* ─── Data (word for word from the content brief) ─── */

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
    text: 'Класична баня з дров\'яною піччю, топкою з передбанника, баком для води та м\'якою парою. Монтуємо піч, утеплений димохід і захист стін у зоні печі.',
  },
  {
    id: '04',
    title: 'Фінська сауна',
    text: 'Сухий жар 80–100 °C, мінімалістичні полиці, LED-підсвітка. Ідеально для щоденного використання.',
  },
  {
    id: '05',
    title: 'Сауни для бізнесу',
    text: 'Готелі, фітнес-клуби, бази відпочинку, SPA. Підбираємо обладнання для інтенсивної роботи та забезпечуємо дотримання вимог пожежної безпеки.',
  },
]

const INSTALL_STEPS = [
  { id: '01', title: 'Заміри та проект', text: 'Виїзд на об\'єкт, оцінка стін, підлоги, електрики та можливості виведення димоходу. Ескіз парної з розташуванням печі, полиць і дверей.' },
  { id: '02', title: 'Каркас', text: 'Монтаж каркасу зі струганого бруса камерної сушки.' },
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
    <div className="border-t border-flue last:border-b">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 text-left py-5 text-lg font-normal leading-snug hover:text-brand-primary transition-colors"
        >
          <span>{question}</span>
          <span
            aria-hidden="true"
            className={`flex-shrink-0 text-2xl leading-none text-steel transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
          >
            +
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-8 leading-relaxed text-steel">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
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

/* ─── Hero ─── */
function SaunaHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-forge-black text-forge-cream">
      <motion.img
        src="/home_page_imgs/sauna_shelves.jpg"
        alt="Парна з дров'яною піччю, полицями та підсвіткою"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ y: imageY }}
        initial={{ scale: 1.16 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 2.4, ease: EASE }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forge-black via-forge-black/45 to-forge-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-forge-black/65 via-forge-black/10 to-transparent" />
      <Embers />

      <motion.div className="page-wrap relative w-full pt-28 pb-10" style={{ opacity: contentOpacity }}>
        <nav aria-label="Навігаційний ланцюжок" className="flex items-center gap-2 text-sm text-forge-cream/70 mb-8">
          <Link to="/" className="hover:text-forge-cream transition-colors">Головна</Link>
          <span aria-hidden="true">/</span>
          <span className="text-forge-cream" aria-current="page">Монтаж саун та бань</span>
        </nav>

        <WordsReveal
          as="h1"
          text="Монтаж саун та бань під ключ у Києві та області"
          immediate
          delay={0.4}
          className="heading-display max-w-5xl"
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal delay={0.8} className="lg:col-span-6">
            <p className="max-w-xl text-lg leading-relaxed text-forge-cream/85">
              Облаштовуємо парні від каркасу до першого пару: утеплення, вагонка, полиці, піч, димохід, вентиляція та світло. Одна команда і одна гарантія.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/contacts#consultation" className="btn-primary">Прорахувати сауну</Link>
              <a href="https://t.me/burzhuyka_montazh" target="_blank" rel="noopener noreferrer" aria-label="Надіслати фото приміщення в Telegram" className="btn-on-dark">
                <TgIcon className="w-4 h-4 text-[#2AABEE]" />
                Telegram
              </a>
              <a href="viber://chat?number=%2B380688429412" aria-label="Надіслати фото приміщення у Viber" className="btn-on-dark">
                <VbIcon className="w-4 h-4 text-[#9D8FF7]" />
                Viber
              </a>
            </div>
          </Reveal>

          {/* Temperature gauge */}
          <Reveal delay={1} className="lg:col-span-5 lg:col-start-8">
            <div className="flex items-end justify-between gap-4 mb-3">
              <span className="text-sm text-forge-cream/70">Температура в парній</span>
              <span className="font-display text-4xl font-medium leading-none tracking-[-0.02em]">90–<CountUp value="110" /> °C</span>
            </div>
            <div
              role="img"
              aria-label="Шкала температури парної від 0 до 110 градусів з робочою зоною 90–110 °C"
              className="relative h-1.5 overflow-hidden rounded-full bg-white/20"
            >
              <motion.div
                className="absolute inset-0 origin-left bg-gradient-to-r from-forge-muted via-brand-primary to-brand-light"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.8, ease: EASE, delay: 1.1 }}
              />
              {[...GAUGE_TICKS, GAUGE_HOT_ZONE.from].map(t => (
                <div key={t} className="absolute top-0 bottom-0 w-px bg-forge-black" style={{ left: `${gaugePct(t)}%` }} />
              ))}
            </div>
            <div className="relative h-4 mt-1.5 text-xs text-forge-cream/70">
              {GAUGE_TICKS.map(t => (
                <span key={t} className="absolute -translate-x-1/2" style={{ left: `${gaugePct(t)}%` }}>{t}°</span>
              ))}
              <span className="absolute right-0 text-forge-cream">110°+</span>
            </div>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Install steps: a readout heats up as the visitor works through them ─── */
function InstallSteps() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 60%'] })
  const temperature = useTransform(scrollYProgress, v => `${Math.round(20 + 90 * v)}°`)
  const color = useTransform(scrollYProgress, [0, 0.55, 1], ['#565F67', '#C94A10', '#FF7A1A'])
  return (
    <section className="page-section">
      <div className="page-wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <WordsReveal text="Що входить у монтаж під ключ" className="heading-xl max-w-md" />
            <div aria-hidden="true" className="mt-8 hidden lg:block">
              <motion.p style={{ color }} className="m-0 font-display text-[9.5rem] font-medium leading-none tracking-[-0.05em]">
                <motion.span>{temperature}</motion.span>
              </motion.p>
              <p className="mt-3 max-w-xs text-steel">Так парна набирає температуру, коли все зібрано правильно.</p>
              <div className="mt-5 h-1.5 max-w-sm overflow-hidden rounded-full bg-flue/60">
                <motion.div style={{ scaleX: scrollYProgress, backgroundColor: color }} className="h-full origin-left" />
              </div>
            </div>
          </div>
        </div>
        <ol ref={ref} className="lg:col-span-7">
          {INSTALL_STEPS.map(step => (
            <Reveal as="li" key={step.id} className="grid grid-cols-[3.25rem_1fr] border-t border-flue py-6">
              <span className="font-display text-2xl font-medium text-brand-dark">{Number(step.id)}</span>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-medium leading-snug tracking-[-0.015em]">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-steel">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ─── Wood table with a live colour sample ─── */
const WOOD_TONES = {
  'Липа': '#E7D3A6',
  'Вільха': '#CF9A6C',
  'Фінська ялина': '#E3C98F',
  'Канадський кедр': '#A85F36',
  'Абаш': '#E5C88D',
  'Термодеревина (термолипа, термоосина)': '#5B3A26',
}
const GRAIN = 'repeating-linear-gradient(92deg, rgba(60,30,10,.1) 0 2px, transparent 2px 19px, rgba(60,30,10,.05) 19px 22px, transparent 22px 47px)'

function WoodPicker() {
  const [active, setActive] = useState(WOOD_TABLE[0].wood)
  return (
    <section className="bg-paper page-section">
      <div className="page-wrap">
        <WordsReveal text="З чого ми будуємо" className="heading-display" />
        <Reveal delay={0.1}>
          <p className="mt-6 mb-10 text-lg leading-relaxed text-steel max-w-3xl">
            Дерево для парної підбираємо під ваш бюджет і спосіб використання.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <motion.div
              aria-hidden="true"
              animate={{ backgroundColor: WOOD_TONES[active] }}
              transition={{ duration: 0.6 }}
              style={{ backgroundImage: GRAIN }}
              className="relative flex h-44 items-end overflow-hidden rounded-3xl p-6 lg:sticky lg:top-24 lg:h-[420px]"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`m-0 font-display text-2xl font-medium tracking-[-0.015em] ${active.startsWith('Термо') || active.startsWith('Канад') ? 'text-white' : 'text-ink'}`}
                >
                  {active.split(' (')[0]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          <ul className="lg:col-span-8">
            {WOOD_TABLE.map(row => (
              <li
                key={row.wood}
                onPointerEnter={() => setActive(row.wood)}
                className={`border-t border-flue last:border-b transition-colors ${active === row.wood ? 'bg-plaster' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setActive(row.wood)}
                  onFocus={() => setActive(row.wood)}
                  aria-pressed={active === row.wood}
                  className="grid w-full gap-2 px-4 py-5 text-left sm:grid-cols-[1fr_1.4fr_1fr] sm:gap-6"
                >
                  <span className="font-display text-lg font-medium leading-snug">{row.wood}</span>
                  <span className="leading-relaxed text-steel">{row.features}</span>
                  <span className="leading-relaxed text-steel">{row.bestFor}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─── Page ─── */
export default function MontazhSaunTaBan() {
  const [openFaq, setOpenFaq] = useState(0)

  const { data: portfolio = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ['sauna-gallery'],
    queryFn: fetchSaunaGallery,
  })

  return (
    <div className="bg-plaster text-ink">
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
      <SaunaHero />

      {/* ═══════════ INTRO ═══════════ */}
      <section className="page-section">
        <div className="page-wrap grid gap-10 lg:grid-cols-12">
          <WordsReveal text="Парну будуємо від її серця" className="heading-display lg:col-span-6" />
          <div className="lg:col-span-5 lg:col-start-8 space-y-5 text-lg leading-relaxed text-steel">
            <Reveal><p>Сауна — це не просто кімната, обшита деревом. Це приміщення, де температура піднімається до 90–110 °C, а вологість змінюється за лічені хвилини. Помилки в пароізоляції, вентиляції чи монтажі печі тут коштують дорого: волога в стінах, грибок, тріщини у вагонці або небезпека пожежі.</p></Reveal>
            <Reveal delay={0.1}><p>«Буржуйка» понад 10 років займається монтажем печей, камінів і димоходів, тому парну ми будуємо від її серця — нагрівального обладнання. Ми самі підбираємо піч, самі монтуємо димохід і самі облаштовуємо парну, тож відповідаємо за весь результат, а не за окремий етап.</p></Reveal>
            <Reveal delay={0.2}><p>Працюємо з квартирами, приватними будинками, дачами та комерційними об&apos;єктами: від компактної сауни на 2 особи до бані з комплексом відпочинку.</p></Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ ВАРІАНТИ ОБЛАШТУВАННЯ ═══════════ */}
      <section className="bg-forge-black text-forge-cream page-section">
        <div className="page-wrap">
          <WordsReveal text="Які сауни та бані ми монтуємо" className="heading-display mb-12 max-w-4xl" />
          <div className="grid justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAUNA_TYPES.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 0.08} className="h-full">
                <SpotlightCard className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-brand-light/50">
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <h3 className="font-display text-2xl font-medium leading-snug tracking-[-0.015em] mb-3">{t.title}</h3>
                    <p className="leading-relaxed text-forge-dim">{t.text}</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <InstallSteps />

      <WoodPicker />

      {/* ═══════════ МАТЕРІАЛИ ═══════════ */}
      <section className="pb-20 lg:pb-28 bg-paper">
        <div className="page-wrap grid lg:grid-cols-3 gap-10">
          <Reveal>
            <h3 className="font-display text-xl font-medium mb-3">Нагрівальне обладнання</h3>
            <p className="leading-relaxed text-steel">
              Продаємо та монтуємо{' '}
              <Link to="/catalog?category=sauna" className="text-link">печі для саун</Link>{' '}
              зі свого каталогу: електрокам&apos;янки з вбудованим або виносним пультом, дров&apos;яні печі з топкою з передбанника, печі з парогенератором. Підбираємо потужність за об&apos;ємом парної та утепленням, щоб сауна прогрівалась за 40–60 хвилин без перевитрати енергії.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="font-display text-xl font-medium mb-3">Димохід для печі в бані</h3>
            <p className="leading-relaxed text-steel">
              Монтуємо утеплені (сендвіч) димоходи з нержавіючої сталі, прохідні вузли через стелю та покрівлю, захисні екрани. Це наша основна спеціалізація, тому безпечне виведення диму — частина кожного проекту з дров&apos;яною піччю.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h3 className="font-display text-xl font-medium mb-3">Інші матеріали</h3>
            <p className="leading-relaxed text-steel">
              Базальтова вата, фольгований пароізоляційний шар і алюмінієвий скотч, термостійкі кабелі та світильники, загартоване скло для дверей, просочення для полиць на основі натуральних олій і воску.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ ВІД ЗАЯВКИ ДО ПЕРШОГО ПАРУ ═══════════ */}
      <section className="bg-forge-black text-forge-cream page-section">
        <div className="page-wrap">
          <WordsReveal text="Від заявки до першого пару" className="heading-display mb-12 max-w-4xl" />
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal as="li" key={step.id} delay={(i % 3) * 0.1} className="border-t border-white/15 pt-5">
                <span className="font-display text-5xl font-medium tracking-[-0.03em] text-brand-light">{Number(step.id)}</span>
                <h3 className="mt-3 font-display text-xl font-medium tracking-[-0.01em]">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-forge-dim">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════ ЧОМУ ОБИРАЮТЬ БУРЖУЙКУ ═══════════ */}
      <section className="page-section">
        <div className="page-wrap">
          <WordsReveal text="Чому обирають Буржуйку" className="heading-display mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {ADVANTAGES.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.08} className="border-t border-flue pt-5">
                <h3 className="font-display text-xl font-medium leading-snug mb-2">{a.title}</h3>
                <p className="leading-relaxed text-steel">{a.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ НАШІ РОБОТИ ═══════════ */}
      <section hidden={!portfolioLoading && portfolio.length === 0} className="pb-20 lg:pb-28">
        <div className="page-wrap">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <WordsReveal text="Наші роботи" className="heading-display" />
            <Link to="/gallery" className="text-link">Дивитись усі роботи</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {portfolioLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-paper animate-pulse" aria-hidden="true" />
                ))
              : portfolio.map((img, i) => (
                  <Reveal key={img.id} delay={(i % 4) * 0.07} className="aspect-square overflow-hidden rounded-2xl bg-paper">
                    <motion.img
                      src={img.url}
                      alt="Монтаж сауни — приклад роботи"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={{ scale: 1.07 }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ПИТАННЯ ТА ВІДПОВІДІ ═══════════ */}
      <section className="bg-paper page-section">
        <div className="page-wrap grid gap-10 lg:grid-cols-12">
          <WordsReveal text="Питання та відповіді" className="heading-display lg:col-span-5" />
          <div className="lg:col-span-6 lg:col-start-7">
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

      <ContactPanel
        title="Плануєте сауну?"
        lead="Надішліть фото та розміри приміщення в Telegram чи Viber. Розрахуємо орієнтовну вартість того ж дня."
        showSales={false}
      />

      <Footer />
    </div>
  )
}
