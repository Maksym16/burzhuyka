import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactPanel from '../components/ContactPanel'
import FlueDiagram from '../components/FlueDiagram'
import { PhoneIcon } from '../components/Icons'
import { CountUp, EASE, Embers, Marquee, ParallaxImage, Reveal, SpotlightCard, WordsReveal } from '../components/fx'
import { fetchManufacturers, fetchProducts } from '../api/products'
import { fetchGallery } from '../api/gallery'
import { fetchHeroCarousel } from '../api/heroCarousel'
import { fetchReviews, submitReview } from '../api/reviews'
import { uploadReviewImage } from '../api/upload'

/* ─── Hero carousel images ─── */
const HERO_IMAGES = [
  { src: '/home_page_imgs/pexels-alexander-mass-748453803-36989812.jpg', alt: 'Опалювальна піч у вітальні' },
  { src: '/home_page_imgs/pexels-artbovich-6301175.jpg', alt: 'Камін в інтер\'єрі' },
  { src: '/home_page_imgs/roof.jpg', alt: 'Димохід на покрівлі' },
  { src: '/home_page_imgs/sauna_shelves.jpg', alt: 'Сауна з піччю та полицями' },
]

/* ─── Data ─── */
const SERVICES = [
  {
    id: '01',
    title: 'Монтаж димоходів',
    desc: 'Встановлення одностінних та утеплених (термо) димоходів під ключ.',
    img:  '/home_page_imgs/roof.jpg',
    points: ['Встановлення одностінних та утеплених (термо) димоходів', 'Гільзовка димоходних каналів', 'Монтаж керамічних димоходів'],
    detail: 'Правильно змонтований димохід — це основа безпечної та ефективної роботи будь-якого опалювального пристрою. Ми встановлюємо одностінні та утепленні (термо) димоходи, виконуємо гільзовку існуючих цегляних каналів нержавіючою трубою, а також монтуємо керамічні димохідні системи провідних виробників.',
    fullPoints: ['Встановлення одностінних та утеплених (термо) димоходів', 'Гільзовка димохідних каналів', 'Монтаж керамічних димоходів', 'Перевірка тяги та пробний розпал'],
    priceNote: 'Вартість монтажу розраховується індивідуально під кожного замовника, залежно від конструктивної особливості будівлі та складності виконання робіт + комплектуючі матеріали.',
  },
  {
    id: '02',
    title: 'Монтаж камінів',
    desc: 'Каміни та вставки провідних євробрендів — Kratki, Schmid, Romotop. Монтаж під ключ.',
    img:  '/home_page_imgs/fireplace.jpg',
    points: ['Монтаж камінних топок', 'Монтаж термоізоляційних коробів', 'Термоізоляція стін в зоні каміна', 'Розвідка теплого повітря від каміна'],
    detail: 'Монтаж каміна включає встановлення камінної топки, зведення термоізоляційного короба та підключення до димоходу. Технічна конструкція виконується виключно кваліфікованими фахівцями — це не загальнобудівельні роботи. Помилки на цьому етапі можуть призвести до пожежі або неефективної роботи каміна. Ми працюємо з камінами та вставками провідних виробників.',
    fullPoints: ['Монтаж камінної топки на постамент', 'Монтаж термоізоляційного короба', 'Термоізоляція стін у зоні каміна', 'Підключення до існуючого або нового димоходу', 'Розведення теплого повітря від каміна в сусідні приміщення (опційно)'],
    priceNote: 'Вартість монтажу розраховується індивідуально, залежно від побажань, складності та використовуваних матеріалів + матеріали.',
  },
  {
    id: '03',
    title: 'Монтаж саун та бань',
    desc: 'Комплексне облаштування парних — від каркасу та ізоляції до оздоблення і підключення обладнання.',
    img:  '/home_page_imgs/sauna_shelves_lights.jpg',
    points: ['Монтаж каркаса та тепло-пароізоляції', 'Обшивка вагонкою та монтаж полків', 'Встановлення та під\'єднання нагрівального обладнання', 'Монтаж вентиляції, освітлення та декоративних елементів'],
    detail: 'Комплексне облаштування парних — від каркасу та ізоляції до оздоблення і підключення обладнання. Ми реалізуємо проекти будь-якої складності: від невеликих домашніх саун до саун та бань громадського користування.',
    fullPoints: ['Монтаж каркасу та тепло-пароізоляції', 'Обшивка вагонкою та монтаж полиць', 'Встановлення та під\'єднання нагрівального обладнання', 'Монтаж вентиляції, освітлення та декоративних елементів'],
    priceNote: 'Вартість розраховується індивідуально, залежно від побажань замовника, використовуваних матеріалів та складності виконання робіт.',
    link: '/montazh-saun-ta-ban',
  },
]

const TRUST_POINTS = [
  { title: '500+ виконаних проектів', text: 'Наш досвід говорить сам за себе. Кожен об\'єкт ми здаємо з детальним інструктажем та пробним пуском.' },
  { title: 'Сертифіковані матеріали', text: 'Ми використовуємо лише перевірені матеріали та обладнання, що відповідають технічним вимогам виробників.' },
  { title: 'Гарантія на роботи та продукцію', text: 'Ми надаємо гарантію не лише на обладнання, а й на якість виконаного монтажу.' },
  { title: 'Вузька спеціалізація', text: 'Ми займаємося виключно монтажем печей, камінів, димоходів і саун. Жодних загальнобудівельних підрядників.' },
]

const PROCESS_STEPS = [
  { id: '1', title: 'Виїзд на об\'єкт', text: 'Оглядаємо місце монтажу, оцінюємо стан приміщення та його конструктивні особливості, чи підходить воно під монтаж обладнання, робимо заміри та обговорюємо проект.' },
  { id: '2', title: 'Консультація', text: 'З\'ясовуємо деталі вашого проекту, підбираємо оптимальне обладнання під ваш бюджет і задачі.' },
  { id: '3', title: 'Кошторис', text: 'Надаємо детальний кошторис із переліком робіт і матеріалів.' },
  { id: '4', title: 'Доставка', text: 'Робимо відправку або привозимо матеріали, камін чи обладнання для сауни разом із усіма монтажними матеріалами (за домовленістю).' },
  { id: '5', title: 'Монтаж', text: 'Виконуємо встановлення в обумовлені й максимально стислі терміни з дотриманням норм безпеки та вимог виробника.' },
]

const CATALOG_CATS = [
  { label: 'Печі для саун',    categoryId: 'sauna',     img: '/home_page_imgs/sauna_heater.jpg' },
  { label: 'Опалювальні печі', categoryId: 'heating',   img: '/home_page_imgs/heater.jpg' },
  { label: 'Каміни',           categoryId: 'fireplace', img: '/home_page_imgs/fireplace.jpg' },
]

function modelsLabel(n) {
  const tens = n % 100, ones = n % 10
  if (tens >= 11 && tens <= 14) return `${n} моделей`
  if (ones === 1) return `${n} модель`
  if (ones >= 2 && ones <= 4) return `${n} моделі`
  return `${n} моделей`
}

const STATS = [
  { num: '500+', label: 'Виконаних проектів' },
  { num: '10+',  label: 'Років на ринку' },
  { num: 'Від 1 року', label: 'Гарантії на послуги та продукцію' },
]

const REVIEW_COMMENT_LIMIT = 250

function StarRating({ value, onChange, size = 'w-5 h-5' }) {
  const interactive = typeof onChange === 'function'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${n <= value ? 'text-brand-primary' : 'text-flue'}`}
          aria-label={interactive ? `Оцінка ${n}` : undefined}
        >
          <svg className={size} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  size: PropTypes.string,
}

/* ─── Hero ─── */
const HERO_WORDS = ['димоходи', 'каміни', 'сауни', 'печі']
const SLIDE_MS = 3000

function Hero({ slides }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [current, setCurrent] = useState(0)
  const index = current % slides.length
  const word = HERO_WORDS[current % HERO_WORDS.length]

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    if (reduced) return
    const timer = setTimeout(() => setCurrent(c => c + 1), SLIDE_MS)
    return () => clearTimeout(timer)
  }, [current, reduced])

  const slide = slides[index]

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-forge-black text-forge-cream">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={slide.src || slide.url}
            src={slide.src || slide.url}
            alt={slide.alt || ''}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: 'linear' } }}
          />
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-forge-black via-forge-black/40 to-forge-black/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-forge-black/60 via-forge-black/10 to-transparent" />
      <Embers />

      <motion.div className="page-wrap relative w-full pt-28 pb-8" style={{ y: contentY, opacity: contentOpacity }}>
        <h1 className="sr-only">Печі, каміни, димоходи та сауни: продаємо, монтуємо, гарантуємо</h1>
        <div aria-hidden="true" className="font-display font-medium leading-[0.98] tracking-[-0.04em] text-[clamp(3.25rem,11.5vw,10.5rem)]">
          <div className="overflow-hidden pb-[0.08em]">
            <motion.div initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.45 }}>
              Монтуємо
            </motion.div>
          </div>
          <div className="relative overflow-hidden pb-[0.08em] text-brand-light">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={word}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                exit={{ y: '-105%' }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {word}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal delay={0.9} className="lg:col-span-6">
            <p className="max-w-lg text-lg leading-relaxed text-forge-cream/85">
              Продаємо, монтуємо, гарантуємо. Печі, каміни та обладнання для бань і лазні під ключ, Київ та область.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/contacts#consultation" className="btn-primary">Отримати консультацію</Link>
              <a href="tel:+380935428302" className="btn-on-dark">
                <PhoneIcon className="w-4 h-4" />
                +38 093 542 83 02
              </a>
            </div>
          </Reveal>

          <Reveal delay={1.05} className="lg:col-span-5 lg:col-start-8">
            <dl className="grid grid-cols-3 gap-5">
              {STATS.map(s => (
                <div key={s.label} className="flex flex-col-reverse justify-end gap-2 border-t border-white/25 pt-3">
                  <dt className="text-sm leading-snug text-forge-cream/70">{s.label}</dt>
                  <dd className="m-0 font-display text-xl sm:text-3xl font-medium leading-none tracking-[-0.02em]">
                    <CountUp value={s.num} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Slide timers double as the slide picker */}
        {slides.length > 1 && (
          <div className="mt-8 flex gap-1.5" role="group" aria-label="Фото">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Фото ${i + 1}`} aria-current={i === index} className="group flex-1 py-2">
                <span className="relative block h-0.5 overflow-hidden bg-white/25 group-hover:bg-white/50 transition-colors">
                  {i === index && (
                    <motion.span
                      key={current}
                      className="absolute inset-0 origin-left bg-brand-light"
                      initial={{ scaleX: reduced ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}

Hero.propTypes = {
  slides: PropTypes.array.isRequired,
}

/* ─── Stacking service cards ─── */
const CARD_THEMES = [
  { card: 'bg-paper text-ink', muted: 'text-steel', rule: 'border-flue/70', link: 'btn-primary' },
  { card: 'bg-forge-black text-forge-cream', muted: 'text-forge-dim', rule: 'border-white/15', link: 'btn-primary' },
  { card: 'bg-[#3B2318] text-forge-cream', muted: 'text-[#D9C8BC]', rule: 'border-white/15', link: 'btn-primary' },
]

function ServiceCard({ service, index, total, progress }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length]
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.04])
  return (
    <div className="lg:sticky lg:h-[calc(100vh-6rem)] lg:min-h-[600px] lg:max-h-[780px]" style={{ top: `${5 + index * 1.25}rem` }}>
      <motion.article
        style={{ scale }}
        className={`${theme.card} grid h-full origin-top overflow-hidden rounded-3xl shadow-[0_-20px_60px_-30px_rgba(32,37,42,.45)] lg:grid-cols-2`}
      >
        <ParallaxImage src={service.img} alt={service.title} distance={7} className="aspect-[4/3] lg:aspect-auto" />
        <div className="flex flex-col p-7 sm:p-10 lg:p-12">
          <h3 className="heading-xl">{service.title}</h3>
          <p className={`mt-5 leading-relaxed ${theme.muted}`}>{service.detail}</p>
          <ul className={`mt-6 border-t ${theme.rule}`}>
            {service.fullPoints.map((p, i) => (
              <motion.li
                key={p}
                className={`border-b ${theme.rule} py-2.5 text-[15px] leading-snug font-normal`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE }}
              >
                {p}
              </motion.li>
            ))}
          </ul>
          <p className={`mt-5 text-sm leading-relaxed ${theme.muted}`}>{service.priceNote}</p>
          <div className="mt-auto pt-6">
            <Link to={service.link || '/contacts#consultation'} className={theme.link}>
              {service.link ? 'Детальніше про монтаж саун' : 'Замовити монтаж'}
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

ServiceCard.propTypes = {
  service: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progress: PropTypes.object.isRequired,
}

function Services() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section className="page-section pb-10 lg:pb-16">
      <div className="page-wrap">
        <div className="max-w-4xl mb-14 lg:mb-20">
          <WordsReveal text="Що ми монтуємо" className="heading-display" />
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-steel">
              Понад 10 років встановлюємо печі, каміни та обладнання для саун і лазень. Ми не просто продаємо обладнання, а несемо повну відповідальність за якість монтажу та надаємо гарантію на виконані роботи.
            </p>
          </Reveal>
        </div>
        <div ref={ref} className="space-y-6 lg:space-y-10">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} total={SERVICES.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Process timeline: the line fills like heat climbing a flue ─── */
function ProcessStep({ step }) {
  const ref = useRef(null)
  const lit = useInView(ref, { margin: '0px 0px -45% 0px' })
  const [reached, setReached] = useState(false)
  useEffect(() => { if (lit) setReached(true) }, [lit])
  return (
    <li ref={ref} className="relative pl-16 sm:pl-20 pb-12 last:pb-0">
      <motion.span
        animate={{
          backgroundColor: reached ? '#C94A10' : '#F9F9F7',
          color: reached ? '#FFFFFF' : '#565F67',
        }}
        transition={{ duration: 0.35 }}
        className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full font-display text-base font-medium"
      >
        {step.id}
      </motion.span>
      <motion.div animate={{ opacity: reached ? 1 : 0.4 }} transition={{ duration: 0.4 }}>
        <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.02em]">{step.title}</h3>
        <p className="mt-2 max-w-xl text-lg leading-relaxed text-steel">{step.text}</p>
      </motion.div>
    </li>
  )
}

ProcessStep.propTypes = {
  step: PropTypes.object.isRequired,
}

function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 55%', 'end 55%'] })
  return (
    <section className="page-section">
      <div className="page-wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <WordsReveal text="Як ми працюємо" className="heading-display" />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm text-lg leading-relaxed text-steel">
                Монтаж не потрібен? Можемо підібрати обладнання або прорахувати димохід окремо.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ol ref={ref} className="relative">
            <span aria-hidden="true" className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-flue/70" />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: scrollYProgress }}
              className="absolute left-[21px] top-2 bottom-2 w-0.5 origin-top bg-gradient-to-b from-brand-primary to-brand-light"
            />
            {PROCESS_STEPS.map(step => <ProcessStep key={step.id} step={step} />)}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ─── Scrollable strip of finished work ─── */
function WorkStrip({ images }) {
  const track = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEnds = () => {
    const el = track.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  useEffect(() => {
    updateEnds()
    window.addEventListener('resize', updateEnds)
    return () => window.removeEventListener('resize', updateEnds)
  }, [images.length])

  // One photo per click: card width plus the gap
  const scrollStrip = (dir) => {
    const el = track.current
    if (!el) return
    const card = el.firstElementChild
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section className="pb-20 lg:pb-28">
      <div className="page-wrap flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <WordsReveal text="Наші роботи" className="heading-display" />
          <p className="mt-3 text-steel">Гортайте стрічку або скористайтеся стрілками.</p>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/gallery" className="text-link">Дивитись усі роботи</Link>
          {images.length > 1 && (
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollStrip(-1)}
                disabled={atStart}
                className="btn-on-light !p-0 w-12 h-12 disabled:opacity-35 disabled:cursor-default"
                aria-label="Попередні роботи"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollStrip(1)}
                disabled={atEnd}
                className="btn-on-light !p-0 w-12 h-12 disabled:opacity-35 disabled:cursor-default"
                aria-label="Наступні роботи"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          )}
        </div>
      </div>
      <motion.div
        ref={track}
        onScroll={updateEnds}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] scroll-px-4 sm:scroll-px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map(img => (
          <Link
            key={img.id}
            to="/gallery"
            className="group block aspect-[4/3] w-[75vw] max-w-[520px] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-flue/30"
          >
            <motion.img
              src={img.url}
              alt={img.title || ''}
              loading="lazy"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="h-full w-full object-cover"
            />
          </Link>
        ))}
      </motion.div>
    </section>
  )
}

WorkStrip.propTypes = {
  images: PropTypes.array.isRequired,
}

/* ─── Catalog panels that widen under the pointer ─── */
function CatalogPanels({ countFor }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex flex-col gap-3 lg:h-[560px] lg:flex-row" onPointerLeave={() => setHovered(0)}>
      {CATALOG_CATS.map((c, i) => {
        const count = countFor(c.categoryId)
        const on = hovered === i
        return (
          <motion.div
            key={c.categoryId}
            className="min-w-0 lg:basis-0"
            initial={false}
            animate={{ flexGrow: on ? 2.3 : 1 }}
            transition={{ type: 'spring', stiffness: 170, damping: 26 }}
            onPointerEnter={() => setHovered(i)}
          >
            <Link
              to={`/catalog?category=${c.categoryId}`}
              onFocus={() => setHovered(i)}
              className="group relative block h-64 overflow-hidden rounded-3xl bg-forge-black text-forge-cream sm:h-80 lg:h-full"
            >
              <motion.img
                src={c.img}
                alt=""
                loading="lazy"
                animate={{ scale: on ? 1.05 : 1.14 }}
                transition={{ duration: 1, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forge-black/90 via-forge-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.02em]">{c.label}</h3>
                  {count > 0 && <p className="mt-1 text-[15px] text-forge-dim">{modelsLabel(count)}</p>}
                </div>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: on ? 0 : -45, backgroundColor: on ? '#FF7A1A' : 'rgba(255,255,255,.16)' }}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </motion.span>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

CatalogPanels.propTypes = {
  countFor: PropTypes.func.isRequired,
}

/* ─── Component ─── */
export default function Home() {
  const reviewsScrollRef = useRef(null)
  const scrollReviews = (dir) => {
    const el = reviewsScrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const { data: heroImages = [] } = useQuery({
    queryKey: ['hero-carousel'],
    queryFn: fetchHeroCarousel,
  })
  const heroSlides = heroImages.length > 0 ? heroImages : HERO_IMAGES

  const { data: galleryImages = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGallery,
  })
  const featuredImages = galleryImages.slice(0, 10)

  const { data: manufacturers = [] } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: fetchManufacturers,
  })

  const countByCategory = (id) => allProducts.filter(p => p.category_id === id).length

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
  })

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [activeReview, setActiveReview] = useState(null) // review object whose full comment is shown
  const [activeImage, setActiveImage] = useState(null)   // image url shown fullscreen

  useEffect(() => {
    if (!activeReview && !activeImage) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setActiveReview(null)
        setActiveImage(null)
      }
    }
    window.addEventListener('keydown', onKey)

    // Lock background scroll so it doesn't jump/chain with the modal's own scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [activeReview, activeImage])

  const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, comment: '' })
  const [reviewError, setReviewError] = useState('')
  const [reviewImage, setReviewImage] = useState(null) // { url, public_id }

  const imageMutation = useMutation({
    mutationFn: uploadReviewImage,
    onSuccess: (data) => setReviewImage(data),
    onError: (err) => setReviewError(err.message),
  })

  function handleReviewImageChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setReviewError('')
    imageMutation.mutate(file)
  }

  const reviewMutation = useMutation({
    mutationFn: () => submitReview(reviewForm.name, reviewForm.rating, reviewForm.comment, reviewImage?.url, reviewImage?.public_id),
    onSuccess: () => {
      setReviewForm({ name: '', rating: 0, comment: '' })
      setReviewImage(null)
      setReviewError('')
    },
    onError: (err) => setReviewError(err.message),
  })

  function handleReviewSubmit(e) {
    e.preventDefault()
    if (!reviewForm.name.trim())    return setReviewError("Вкажіть ваше ім'я")
    if (!reviewForm.rating)         return setReviewError('Оберіть оцінку')
    if (!reviewForm.comment.trim()) return setReviewError('Напишіть відгук')
    if (imageMutation.isPending)    return setReviewError('Зачекайте, фото ще завантажується')
    reviewMutation.mutate()
  }

  return (
    <div className="bg-plaster text-ink">
      <Helmet>
        <title>Буржуйка — Продаж та монтаж печей і камінів | Київ</title>
        <meta name="description" content="Продаж та монтаж печей для сауни, опалювальних печей та камінів. Виробник Новаслав та інші бренди. Установка під ключ — Київ та область." />
        <meta property="og:title" content="Буржуйка — Продаж та монтаж печей і камінів | Київ" />
        <meta property="og:description" content="Продаж та монтаж печей для сауни, опалювальних печей та камінів. Установка під ключ — Київ та область." />
        <meta property="og:image" content="https://burzhuyka.com/burzuika_org_image.png" />
        <meta property="og:url" content="https://burzhuyka.com" />
        <link rel="canonical" href="https://burzhuyka.com" />
      </Helmet>

      <Navbar />

      <Hero slides={heroSlides} />

      {/* Manufacturers ticker */}
      {/* {manufacturers.length > 0 && (
        <section aria-label="Виробники в нашому каталозі" className="bg-forge-black py-6 text-forge-cream border-t border-white/10">
          <Marquee
            items={manufacturers.map(m => <span key={m.id} className="font-display text-2xl sm:text-3xl font-normal tracking-[-0.01em]">{m.label}</span>)}
          />
        </section>
      )} */}

      <Services />

      <FlueDiagram
        title="Безпека залежить від кожного вузла"
        lead="Помилка на одному етапі може призвести до пожежі або неефективної роботи всієї системи. Тому ми відповідаємо за весь шлях, від топки до оголовка труби."
      />

      <Process />

      {/* ═══════════ TRUST ═══════════ */}
      <section className="bg-forge-black text-forge-cream page-section">
        <div className="page-wrap">
          <WordsReveal text="Чому нам довіряють" className="heading-display mb-12" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08} className="h-full">
                <SpotlightCard className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-brand-light/50">
                  <h3 className="font-display text-xl font-medium leading-snug tracking-[-0.01em]">{t.title}</h3>
                  <p className="mt-4 leading-relaxed text-forge-dim">{t.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATALOG ═══════════ */}
      <section className="page-section">
        <div className="page-wrap">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <WordsReveal text="Каталог обладнання" className="heading-display" />
            <Link to="/catalog" className="text-link">Переглянути весь каталог</Link>
          </div>
          <Reveal>
            <CatalogPanels countFor={countByCategory} />
          </Reveal>
        </div>
      </section>

      {featuredImages.length > 0 && <WorkStrip images={featuredImages} />}

      {/* ═══════════ REVIEWS ═══════════ */}
      <section className="bg-paper page-section">
        <div className="page-wrap">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <WordsReveal text="Що кажуть клієнти" className="heading-display" />
              {averageRating && (
                <div className="mt-4 flex items-center gap-3 text-lg text-steel">
                  <StarRating value={Math.round(Number(averageRating))} size="w-5 h-5" />
                  {averageRating.replace('.', ',')} із 5
                </div>
              )}
            </div>
            {reviews.length > 1 && (
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => scrollReviews(-1)} className="btn-on-light !p-0 w-12 h-12" aria-label="Попередні відгуки">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => scrollReviews(1)} className="btn-on-light !p-0 w-12 h-12" aria-label="Наступні відгуки">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            <div
              ref={reviewsScrollRef}
              className="flex items-start gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pt-2 pb-2 mb-12 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {reviews.map((r, i) => {
                const isLong = r.comment.length > REVIEW_COMMENT_LIMIT
                const preview = isLong ? `${r.comment.slice(0, REVIEW_COMMENT_LIMIT).trimEnd()}…` : r.comment
                return (
                  <motion.figure
                    key={r.id}
                    initial={{ opacity: 0, y: 36, rotate: i % 2 ? 1.5 : -1.5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 3) * 0.08 }}
                    className="snap-start flex-shrink-0 w-[85%] sm:w-[46%] lg:w-[31.5%] m-0 bg-plaster rounded-3xl p-7"
                  >
                    {r.image_url && (
                      <button
                        type="button"
                        onClick={() => setActiveImage(r.image_url)}
                        className="block w-full mb-5 cursor-zoom-in"
                        aria-label="Переглянути фото"
                      >
                        <img src={r.image_url} alt="" loading="lazy" className="w-full h-44 rounded-2xl object-cover" />
                      </button>
                    )}
                    <StarRating value={r.rating} size="w-4 h-4" />
                    <blockquote className="m-0 mt-4 text-lg leading-relaxed whitespace-pre-wrap">{preview}</blockquote>
                    {isLong && (
                      <button type="button" onClick={() => setActiveReview(r)} className="text-link mt-2 text-sm">
                        Показати більше
                      </button>
                    )}
                    <figcaption className="mt-5 text-[15px] font-normal">{r.name}</figcaption>
                  </motion.figure>
                )
              })}
            </div>
          ) : (
            <p className="text-steel text-lg mb-10">Поки немає відгуків. Поділіться своїм першим.</p>
          )}

          {/* Leave a review */}
          <button
            type="button"
            onClick={() => setReviewFormOpen(v => !v)}
            aria-expanded={reviewFormOpen}
            className="btn-on-light"
          >
            <motion.span aria-hidden="true" animate={{ rotate: reviewFormOpen ? 45 : 0 }} className="text-xl leading-none">+</motion.span>
            Залишити відгук
          </button>

          <AnimatePresence initial={false}>
            {reviewFormOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="overflow-hidden"
              >
                <form onSubmit={handleReviewSubmit} className="max-w-2xl pt-8 pb-1 px-1">
                  {reviewMutation.isSuccess ? (
                    <p className="text-lg font-normal">Дякуємо! Відгук буде опубліковано після перевірки.</p>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <p className="field-label">Ваша оцінка</p>
                        <StarRating value={reviewForm.rating} onChange={n => setReviewForm(f => ({ ...f, rating: n }))} size="w-7 h-7" />
                      </div>
                      <div>
                        <label htmlFor="review-name" className="field-label">Ваше ім&apos;я</label>
                        <input
                          id="review-name"
                          type="text"
                          value={reviewForm.name}
                          onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                          className="field"
                        />
                      </div>
                      <div>
                        <label htmlFor="review-comment" className="field-label">Ваш відгук</label>
                        <textarea
                          id="review-comment"
                          rows={4}
                          value={reviewForm.comment}
                          onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                          className="field resize-none"
                        />
                      </div>

                      {reviewImage ? (
                        <div className="relative w-28 h-28">
                          <img src={reviewImage.url} alt="" className="w-full h-full rounded-xl object-cover" />
                          <button
                            type="button"
                            onClick={() => setReviewImage(null)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center text-sm"
                            aria-label="Видалити фото"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-2 text-[15px] font-normal text-steel hover:text-ink cursor-pointer transition-colors focus-within:text-ink">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {imageMutation.isPending ? 'Завантаження...' : 'Додати фото (необов’язково)'}
                          <input type="file" accept="image/*" onChange={handleReviewImageChange} disabled={imageMutation.isPending} className="sr-only" />
                        </label>
                      )}

                      {reviewError && <p className="field-error">{reviewError}</p>}

                      <div>
                        <button type="submit" disabled={reviewMutation.isPending || imageMutation.isPending} className="btn-primary">
                          {reviewMutation.isPending ? 'Надсилаємо...' : 'Надіслати відгук'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ContactPanel
        title="Потрібна консультація?"
        lead="Зателефонуйте або напишіть у Telegram чи Viber. Проконсультуємо щодо вашого проекту."
      />

      <Footer />

      <AnimatePresence>
        {activeReview && (
          <motion.div
            key="review"
            className="fixed inset-0 z-[60] bg-paper flex flex-col"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex items-center justify-end px-4 sm:px-6 py-3 border-b border-flue flex-shrink-0">
              <button
                onClick={() => setActiveReview(null)}
                className="w-10 h-10 text-steel hover:text-ink text-3xl leading-none"
                aria-label="Закрити"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="max-w-2xl mx-auto px-6 sm:px-8 py-10">
                <StarRating value={activeReview.rating} size="w-5 h-5" />
                <p className="text-lg leading-relaxed mt-6 whitespace-pre-wrap">{activeReview.comment}</p>
                <p className="font-normal mt-6">{activeReview.name}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeImage && (
          <motion.div
            key="image"
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl leading-none transition-colors"
              aria-label="Закрити"
            >
              ✕
            </button>
            <motion.img
              src={activeImage}
              alt=""
              className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
