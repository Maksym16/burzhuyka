import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchProducts } from '../api/products'
import { fetchGallery } from '../api/gallery'
import { fetchHeroCarousel } from '../api/heroCarousel'
import { fetchReviews, submitReview } from '../api/reviews'
import { uploadReviewImage } from '../api/upload'

gsap.registerPlugin(ScrollTrigger)

/* ─── Hero carousel images ─── */
const HERO_IMAGES = [
  { src: '/home_page_imgs/pexels-artbovich-6301175.jpg', alt: 'Камін в інтер\'єрі' },
  { src: '/home_page_imgs/borsuika.jpg',                 alt: 'Опалювальна піч' },
  { src: '/home_page_imgs/heater.jpg',                   alt: 'Нагрівач' },
  { src: '/home_page_imgs/sauna.jpg',                    alt: 'Сауна' },
  { src: '/home_page_imgs/sauna_shelves.jpg',            alt: 'Полиці сауни' },
]

function HeroCarousel({ images: slides = HERO_IMAGES }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setCurrent(0)
  }, [slides])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative">
      {/* Offset frame */}
      <div className="absolute -top-5 -right-5 w-full h-full border border-brand-primary/25 pointer-events-none z-10" />

      {/* Slides */}
      <div className="relative w-full h-[520px] overflow-hidden">
        {slides.map((img, i) => (
          <img
            key={img.src || img.url}
            src={img.src || img.url}
            alt={img.alt || ''}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Corner accents */}
      <div className="absolute bottom-0 left-0 h-1 w-20 bg-brand-primary z-10" />
      <div className="absolute bottom-0 left-0 w-1 h-20 bg-brand-primary z-10" />

      {/* Pagination dots */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === current ? 'bg-brand-primary w-7' : 'w-3 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Data ─── */
const SERVICES = [
  {
    id: '01',
    title: 'Монтаж димоходів',
    desc: 'Встановлення одностінних та утеплених (термо) димоходів під ключ.',
    img:  '/home_page_imgs/side_pipe.jpg',
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
  },
]

const TRUST_POINTS = [
  { title: '500+ виконаних проектів', text: 'Наш досвід говорить сам за себе. Кожен об\'єкт ми здаємо з детальним інструктажем та пробним пуском.' },
  { title: 'Сертифіковані матеріали', text: 'Ми використовуємо лише перевірені матеріали та обладнання, що відповідають технічним вимогам виробників.' },
  { title: 'Гарантія на роботи та продукцію', text: 'Ми надаємо гарантію не лише на обладнання, а й на якість виконаного монтажу.' },
  { title: 'Вузька спеціалізація', text: 'Ми займаємося виключно монтажем печей, камінів, димоходів і саун. Жодних загальнобудівельних підрядників.' },
]

const PROCESS_STEPS = [
  { id: '01', title: 'Виїзд на об\'єкт', text: 'Оглядаємо місце монтажу, оцінюємо стан приміщення та його конструктивні особливості, чи підходить воно під монтаж обладнання, робимо заміри та обговорюємо проект.' },
  { id: '02', title: 'Консультація', text: 'З\'ясовуємо деталі вашого проекту, підбираємо оптимальне обладнання під ваш бюджет і задачі.' },
  { id: '03', title: 'Кошторис', text: 'Надаємо детальний кошторис із переліком робіт і матеріалів.' },
  { id: '04', title: 'Доставка', text: 'Робимо відправку або привозимо матеріали, камін чи обладнання для сауни разом із усіма монтажними матеріалами (за домовленістю).' },
  { id: '05', title: 'Монтаж', text: 'Виконуємо встановлення в обумовлені й максимально стислі терміни з дотриманням норм безпеки та вимог виробника.' },
  { id: '06', title: 'Продаж', text: 'Також можемо підібрати вам обладнання або прорахувати димохід без монтажу.' },
]


const CATALOG_CATS = [
  { label: 'Печі для саун',    categoryId: 'sauna',     icon: '🔥' },
  { label: 'Опалювальні печі', categoryId: 'heating',   icon: '🏠' },
  { label: 'Каміни',           categoryId: 'fireplace', icon: '🪵' },
]

const STATS = [
  { num: '500+',  label: 'Виконаних проектів' },
  { num: '10+',    label: 'Років на ринку'      },
  { num: '1+',     label: 'Роки гарантії на послуги та продукцію'       },
  { num: '24/7',  label: 'Підтримка клієнтів'  },
]

const REVIEW_COMMENT_LIMIT = 250

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
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${n <= value ? 'text-brand-primary' : 'text-forge-border'}`}
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

/* ─── Component ─── */
export default function Home() {
  const rootRef = useRef(null)
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
  const carouselImages = galleryImages.slice(0, 10)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const carouselMax = Math.max(0, carouselImages.length - 3)
  const prevSlide = () => setCarouselIdx(i => Math.max(0, i - 1))
  const nextSlide = () => setCarouselIdx(i => Math.min(carouselMax, i + 1))

  useEffect(() => {
    if (carouselImages.length <= 3) return
    const t = setInterval(() => setCarouselIdx(i => (i >= carouselMax ? 0 : i + 1)), 3500)
    return () => clearInterval(t)
  }, [carouselImages.length, carouselMax])

  const countByCategory = (id) => allProducts.filter(p => p.category_id === id).length

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
  })

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* Set initial states before first paint — prevents flash */
      gsap.set('.hero-line',  { yPercent: 110 })
      gsap.set('.hero-body',  { y: 28, opacity: 0 })
      gsap.set('.hero-stat',  { y: 16, opacity: 0 })
      gsap.set('.hero-img',   { x: 60, opacity: 0 })
      gsap.set('.service-card', { opacity: 0, y: 80, scale: 0.96 })
      gsap.set('.cat-tile',   { y: 44, opacity: 0 })

      /* Hero staggered line reveal */
      gsap.to('.hero-line', { yPercent: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out' })
      gsap.to('.hero-body', { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.25 })
      gsap.to('.hero-stat', { y: 0, opacity: 1, stagger: 0.06, duration: 0.55, ease: 'power2.out', delay: 0.4 })
      gsap.to('.hero-img',  { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.1 })

      /* Services scroll reveal */
      gsap.to('.service-card',
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 85%', once: true } }
      )

      /* Catalog preview */
      gsap.to('.cat-tile',
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: '.catalog-preview', start: 'top 85%', once: true } }
      )

      /* Stats */
      gsap.fromTo('.stat-block',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: '.stats-section', start: 'top 85%', once: true } }
      )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="bg-forge-black text-forge-cream">
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

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image + overlays */}
        <div className="absolute inset-0">
          <img
            src="/fire-flame.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark vignette */}
          <div className="absolute inset-0 bg-forge-black/40" />
          {/* Directional fade — left side more visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-forge-black via-forge-black/60 to-forge-black/20" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forge-black to-transparent" />
        </div>

        {/* Orange ambient glow */}
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-brand-primary/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT — content */}
            <div>
              {/* Label line */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
                <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                  Монтаж та продаж — Буржуйка
                </span>
              </div>

              {/* Display heading — each line wrapped for clip reveal */}
              <h1 className="font-display font-bold uppercase leading-none mb-8 text-5xl sm:text-6xl lg:text-[80px]">
                <div className="clip-reveal overflow-hidden">
                  <span className="hero-line block text-forge-cream">ПРОДАЄМО</span>
                </div>
                <div className="clip-reveal overflow-hidden">
                  <span className="hero-line block text-brand-primary">МОНТУЄМО</span>
                </div>
                <div className="clip-reveal overflow-hidden">
                  <span className="hero-line block text-forge-cream">ГАРАНТУЄМО</span>
                </div>
              </h1>

              {/* Subtitle */}
              <p className="hero-body text-forge-dim text-base sm:text-lg leading-relaxed max-w-md mb-8">
                Монтаж та продаж печей, камінів і обладнання для бань та лазні. Установка під ключ Київ та область.
              </p>

              {/* Stats strip */}
              <div className="flex items-stretch gap-0 border-t border-forge-border pt-8">
                {STATS.slice(0, 3).map((s, i) => (
                  <div
                    key={s.label}
                    className={`hero-stat flex-1 ${i > 0 ? 'border-l border-forge-border pl-6' : ''} ${i < 2 ? 'pr-6' : ''}`}
                  >
                    <div className="font-display text-3xl font-bold text-brand-primary leading-none mb-1">{s.num}</div>
                    <div className="text-forge-cream text-xs leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — hero carousel (desktop only) */}
            <div className="hidden lg:block hero-img">
              <HeroCarousel images={heroSlides} />
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section className="services-section py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
                <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Наші послуги</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-4">
                Що ми монтуємо
              </h2>
              <p className="text-brand-primary font-sans font-semibold text-sm uppercase tracking-wide mb-3">
                Монтаж під ключ — Київ та область
              </p>
              <p className="text-forge-muted text-base leading-relaxed">
                Буржуйка — це досвідчені фахівці, в яких понад 10 років досвіду встановлення печей, камінів та обладнання для саун і лазень. Більше 500 реалізованих проектів у Києві та області. Ми не просто продаємо обладнання — ми несемо повну відповідальність за якість монтажу та надаємо гарантію на виконані роботи.
              </p>
            </div>
            <Link
              to="/contacts"
              className="hidden sm:inline-flex items-center gap-2 text-forge-muted hover:text-brand-primary text-sm font-medium uppercase tracking-wide transition-colors flex-shrink-0"
            >
              Замовити послугу <span className="text-lg leading-none">→</span>
            </Link>
          </div>

          {/* Single unified grid: photo cards row + service list rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {/* Photo cards */}
            {SERVICES.map(s => (
              <div
                key={s.id}
                className="service-card group relative bg-forge-card hover:border-brand-primary/50 overflow-hidden transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forge-card via-forge-card/40 to-transparent" />
                  <span className="absolute top-4 right-5 font-display text-6xl font-bold text-white/8 leading-none select-none">
                    {s.id}
                  </span>
                </div>
                <div className="h-0.5 bg-brand-primary w-0 group-hover:w-full transition-all duration-500 ease-out" />
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold uppercase text-forge-cream mb-2 group-hover:text-brand-primary transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-forge-muted text-sm leading-relaxed mb-4">{s.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {s.points.map(p => (
                      <li key={p} className="flex items-center gap-2 text-forge-dim text-sm">
                        <span className="w-1 h-1 rounded-full bg-brand-primary flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contacts"
                    className="inline-flex items-center gap-2 text-brand-primary font-sans font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all"
                  >
                    Замовити <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed breakdown */}
          <div className="mt-20 pt-16 border-t border-forge-border">
            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-forge-cream mb-12">
              Що входить в роботу монтажу
            </h3>
            <div className="space-y-12">
              {SERVICES.map(s => (
                <div key={s.id} className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-10">
                  <span className="font-display text-5xl font-bold text-brand-primary leading-none flex-shrink-0">
                    {s.id}
                  </span>
                  <div>
                    <h4 className="font-display text-xl font-bold uppercase text-forge-cream mb-3">{s.title}</h4>
                    <p className="text-forge-muted text-sm leading-relaxed mb-4 max-w-2xl">{s.detail}</p>
                    <p className="text-forge-dim text-xs uppercase tracking-widest mb-2">Що включено:</p>
                    <ul className="space-y-1.5 mb-4">
                      {s.fullPoints.map(p => (
                        <li key={p} className="flex items-center gap-2 text-forge-dim text-sm">
                          <span className="w-1 h-1 rounded-full bg-brand-primary flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <p className="text-forge-muted text-xs italic leading-relaxed max-w-2xl">{s.priceNote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHY TRUST US ═══════════ */}
      <section className="py-24 bg-forge-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Довіра</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-12">
            Чому нам довіряють
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {TRUST_POINTS.map(t => (
              <div key={t.title} className="bg-forge-black border border-forge-border p-6">
                <h3 className="font-display text-base font-bold uppercase text-brand-primary mb-3 leading-snug">{t.title}</h3>
                <p className="text-forge-muted text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>

          <p className="text-forge-dim text-sm leading-relaxed max-w-3xl">
            Перед початком робіт ми обов&apos;язково виїжджаємо на об&apos;єкт, робимо заміри та надаємо кошторис.
          </p>
        </div>
      </section>

      {/* ═══════════ HOW WE WORK ═══════════ */}
      <section className="py-24 bg-forge-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Процес</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none mb-12">
            Як ми працюємо
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-forge-border mb-14">
            {PROCESS_STEPS.map(step => (
              <div key={step.id} className="bg-forge-card p-6">
                <span className="font-display text-3xl font-bold text-brand-primary/30 leading-none block mb-3">{step.id}</span>
                <h3 className="font-display text-lg font-bold uppercase text-forge-cream mb-2">{step.title}</h3>
                <p className="text-forge-muted text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          {/* Mini CTA */}
          <div className="border border-brand-primary/30 bg-forge-card p-8 sm:p-10 text-center">
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-forge-cream mb-2">
              Залишились питання?
            </h3>
            <p className="text-forge-muted text-sm mb-6">
              Зателефонуйте нам або напишіть у Telegram / Viber — відповімо швидко та проконсультуємо щодо вашого проекту.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
              <div>
                <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-1">Монтаж</p>
                <a href="tel:+380935428302" className="font-display text-xl font-bold text-forge-cream hover:text-brand-primary transition-colors">
                  +38 093 542 83 02
                </a>
              </div>
              <div>
                <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-1">Продаж</p>
                <a href="tel:+380688429412" className="font-display text-xl font-bold text-forge-cream hover:text-brand-primary transition-colors">
                  +38 068 842 94 12
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ OUR WORK ═══════════ */}
      {carouselImages.length > 0 && (
        <section className="gallery-preview-section py-24 bg-forge-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
                  <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Портфоліо</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none">
                  Наші роботи
                </h2>
                <p className="text-forge-muted mt-3 text-sm">Переглянте приклади наших установок</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    disabled={carouselIdx === 0}
                    className="w-10 h-10 border border-forge-border flex items-center justify-center text-forge-dim hover:border-brand-primary hover:text-brand-primary transition-all disabled:opacity-30 disabled:cursor-default"
                    aria-label="Назад"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={carouselIdx >= carouselMax}
                    className="w-10 h-10 border border-forge-border flex items-center justify-center text-forge-dim hover:border-brand-primary hover:text-brand-primary transition-all disabled:opacity-30 disabled:cursor-default"
                    aria-label="Вперед"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <Link
                  to="/gallery"
                  className="hidden sm:inline-flex items-center gap-2 text-forge-muted hover:text-brand-primary text-sm font-medium uppercase tracking-wide transition-colors"
                >
                  Дивитись усі <span className="text-lg leading-none">→</span>
                </Link>
              </div>
            </div>

            {/* Carousel track */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${carouselIdx * (100 / 3)}%)` }}
              >
                {carouselImages.map((img) => (
                  <div key={img.id} className="w-1/3 flex-shrink-0 px-1.5">
                    <Link to="/gallery" className="group block aspect-square overflow-hidden bg-forge-surface">
                      <img
                        src={img.url}
                        alt={img.title || ''}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {carouselImages.length > 3 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {Array.from({ length: carouselMax + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === carouselIdx ? 'bg-brand-primary w-6' : 'w-3 bg-forge-border hover:bg-forge-dim'
                    }`}
                    aria-label={`Слайд ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-8 sm:hidden">
              <Link
                to="/gallery"
                className="inline-block border border-brand-primary text-brand-primary font-semibold px-8 py-3 text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
              >
                Дивитись усі роботи
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CATALOG PREVIEW ═══════════ */}
      <section className="catalog-preview py-24 bg-forge-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Асортимент</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none">
              Каталог товарів
            </h2>
            <Link
              to="/catalog"
              className="hidden sm:inline-flex items-center gap-2 text-forge-muted hover:text-brand-primary text-sm font-medium uppercase tracking-wide transition-colors"
            >
              Переглянути всі <span className="text-lg leading-none">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATALOG_CATS.map((c, i) => (
              <Link
                to="/catalog"
                key={c.label}
                className="cat-tile group bg-forge-card border border-forge-border hover:border-brand-primary/60 p-8 transition-all duration-300 relative overflow-hidden"
              >
                {/* Background number */}
                <span className="absolute -right-2 -bottom-4 font-display text-[90px] font-bold text-white/5 leading-none select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="text-4xl mb-6">{c.icon}</div>
                <h3 className="font-display text-2xl font-bold uppercase text-forge-cream mb-2 group-hover:text-brand-primary transition-colors">
                  {c.label}
                </h3>
                {/* <p className="text-forge-muted text-sm mb-5 leading-relaxed">{c.desc}</p> */}
                <div className="flex items-center justify-between">
                  <span className="text-brand-primary text-xs font-semibold uppercase tracking-widest">{countByCategory(c.categoryId)} моделей</span>
                  <span className="text-forge-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all inline-block">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/catalog"
              className="inline-block border border-brand-primary text-brand-primary font-semibold px-8 py-3 text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
            >
              Весь каталог
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ REVIEWS ═══════════ */}
      <section className="py-24 bg-forge-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-primary" />
              <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Відгуки</span>
              <div className="h-px w-10 bg-brand-primary" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream text-balance">
              Що кажуть клієнти
            </h2>
          </div>

          {reviews.length > 0 ? (
            <div className="relative mb-16">
              <div
                ref={reviewsScrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                {reviews.map(r => {
                  const isLong = r.comment.length > REVIEW_COMMENT_LIMIT
                  const preview = isLong ? `${r.comment.slice(0, REVIEW_COMMENT_LIMIT).trimEnd()}…` : r.comment
                  return (
                    <div
                      key={r.id}
                      className="snap-start flex-shrink-0 w-[85%] sm:w-[46%] lg:w-[31%] bg-forge-black border border-forge-border p-6"
                    >
                      {r.image_url && (
                        <button
                          type="button"
                          onClick={() => setActiveImage(r.image_url)}
                          className="block w-full mb-4 cursor-zoom-in"
                          aria-label="Переглянути фото"
                        >
                          <img
                            src={r.image_url}
                            alt=""
                            loading="lazy"
                            className="w-full h-44 object-cover hover:opacity-90 transition-opacity"
                          />
                        </button>
                      )}
                      <StarRating value={r.rating} size="w-4 h-4" />
                      <p className="text-forge-dim text-sm leading-relaxed mt-4 mb-2 whitespace-pre-wrap">{preview}</p>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => setActiveReview(r)}
                          className="text-brand-primary text-xs font-semibold uppercase tracking-wide hover:underline mb-2"
                        >
                          Показати більше
                        </button>
                      )}
                      <p className="text-forge-cream text-sm font-semibold mt-2">{r.name}</p>
                    </div>
                  )
                })}
              </div>

              {/* Arrows */}
              {reviews.length > 1 && (
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => scrollReviews(-1)}
                    className="w-10 h-10 border border-forge-border flex items-center justify-center text-forge-dim hover:border-brand-primary hover:text-brand-primary transition-all"
                    aria-label="Назад"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollReviews(1)}
                    className="w-10 h-10 border border-forge-border flex items-center justify-center text-forge-dim hover:border-brand-primary hover:text-brand-primary transition-all"
                    aria-label="Вперед"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-forge-muted text-center mb-16">Поки немає відгуків. Будьте першим!</p>
          )}

          {/* Leave a review */}
          <form onSubmit={handleReviewSubmit} className="max-w-xl mx-auto bg-forge-black border border-forge-border p-8">
            <h3 className="font-display text-lg font-bold uppercase text-forge-cream mb-6 text-center">Залишити відгук</h3>

            {reviewMutation.isSuccess ? (
              <p className="text-brand-primary text-sm text-center">
                Дякуємо! Відгук буде опубліковано після перевірки.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <StarRating value={reviewForm.rating} onChange={n => setReviewForm(f => ({ ...f, rating: n }))} size="w-7 h-7" />
                </div>
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  value={reviewForm.name}
                  onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-forge-surface border border-forge-border px-4 py-3 text-sm text-forge-cream placeholder:text-forge-muted focus:outline-none focus:border-brand-primary"
                />
                <textarea
                  placeholder="Ваш відгук"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  className="w-full bg-forge-surface border border-forge-border px-4 py-3 text-sm text-forge-cream placeholder:text-forge-muted focus:outline-none focus:border-brand-primary resize-none"
                />

                {/* Photo attachment */}
                {reviewImage ? (
                  <div className="relative w-28 h-28">
                    <img src={reviewImage.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setReviewImage(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-sm"
                      aria-label="Видалити фото"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex items-center gap-2 text-forge-muted hover:text-brand-primary text-xs uppercase tracking-wide cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {imageMutation.isPending ? 'Завантаження...' : 'Додати фото (необов’язково)'}
                    <input type="file" accept="image/*" onChange={handleReviewImageChange} disabled={imageMutation.isPending} className="hidden" />
                  </label>
                )}

                {reviewError && <p className="text-red-400 text-xs">{reviewError}</p>}

                <button
                  type="submit"
                  disabled={reviewMutation.isPending || imageMutation.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3 uppercase tracking-widest text-sm transition-colors"
                >
                  {reviewMutation.isPending ? 'Надсилаємо...' : 'Надіслати відгук'}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ═══════════ CONTACT STRIP ═══════════ */}
      <section className="py-24 bg-forge-black relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-brand-primary" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Контакти</span>
            <div className="h-px w-10 bg-brand-primary" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-forge-cream mb-4 text-balance">
            Потрібна консультація?
          </h2>
          <p className="text-forge-muted text-lg mb-10">
            Зв'яжіться зручним способом — відповімо швидко
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            {/* <a
              href="tel:+380670000000"
              className="flex items-center gap-2.5 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all hover:orange-glow"
            >
              <PhoneIcon className="w-4 h-4" />
              Передзвонити
            </a> */}
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

          {/* Large phone */}
          <div className="border-t border-forge-border pt-12">
            <p className="text-forge-muted text-xs uppercase tracking-widest mb-8">Або дзвоніть напряму</p>
            <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-16">
              <div>
                <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-2">Монтаж</p>
                <a href="tel:+380935428302" className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block">
                  +38 093 542 83 02
                </a>
              </div>
              <div>
                <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-2">Продаж</p>
                <a href="tel:+380688429412" className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block mb-2">
                  +38 068 842 94 12
                </a>
                <a href="tel:+380951420814" className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block">
                  +38 095 142 08 14
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Full review comment modal */}
      {activeReview && (
        <div className="fixed inset-0 z-50 bg-forge-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-end px-4 sm:px-6 py-4 border-b border-forge-border flex-shrink-0">
            <button
              onClick={() => setActiveReview(null)}
              className="text-forge-muted hover:text-forge-cream text-3xl leading-none"
              aria-label="Закрити"
            >
              ×
            </button>
          </div>

          {/* Scrollable content */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="max-w-2xl mx-auto px-6 sm:px-8 py-10">
              <StarRating value={activeReview.rating} size="w-5 h-5" />
              <p className="text-forge-dim text-base leading-relaxed mt-6 whitespace-pre-wrap">{activeReview.comment}</p>
              <p className="text-forge-cream text-sm font-semibold mt-6">{activeReview.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen review image */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl leading-none transition-colors"
            aria-label="Закрити"
          >
            ✕
          </button>
          <img
            src={activeImage}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
