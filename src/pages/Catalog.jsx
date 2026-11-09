import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { EASE, Embers, Reveal, TiltCard, WordsReveal } from '../components/fx'
import { fetchProducts, fetchCategories, fetchManufacturers } from '../api/products'

/* ─── Product card ─── */
function ProductCard({ product }) {
  return (
    <TiltCard className="h-full">
      <Link to={`/catalog/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-paper shadow-[0_14px_40px_-28px_rgba(32,37,42,.45)] transition-shadow duration-300 hover:shadow-[0_28px_60px_-28px_rgba(32,37,42,.6)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-white flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
          {product.is_on_sale && (
            <span className="absolute top-3 left-3 rounded-full bg-brand-primary text-white text-sm font-normal px-3 py-1">
              Акція
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-display text-lg font-medium leading-snug tracking-[-0.01em] group-hover:text-brand-dark transition-colors">
            {product.name}
          </h3>

          <ul className="mt-3 mb-5 space-y-1 flex-1 text-sm leading-snug text-steel">
            {(product.specs || []).slice(0, 4).map(spec => (
              <li key={spec}>{spec.includes('|') ? spec.split('|')[0] : spec}</li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-flue/60 pt-4 mt-auto">
            {product.price != null ? (
              <p className="m-0 text-sm text-steel">
                від <span className="font-display text-xl font-medium text-ink tracking-[-0.01em]">{Number(product.price).toLocaleString('uk-UA')}</span> грн
              </p>
            ) : (
              <p className="m-0 text-sm text-steel">Ціна за запитом</p>
            )}
            <span aria-hidden="true" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-plaster transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white">
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  )
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
}

/* ─── Page ─── */
export default function Catalog() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('category') || 'sauna')
  const [activeMfr, setActiveMfr] = useState('all')

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { data: manufacturers = [] } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: fetchManufacturers,
  })

  const categoryProducts = allProducts.filter(p => p.category_id === activeTab)
  const visibleProducts  = activeMfr === 'all'
    ? categoryProducts
    : categoryProducts.filter(p => p.manufacturer_id === activeMfr)

  const handleTab = id => {
    setActiveTab(id)
    setActiveMfr('all')
  }

  const handleMfr = id => {
    setActiveMfr(id)
  }

  // Only show manufacturers that have products in the active tab
  const availableMfrs = manufacturers.filter(m =>
    categoryProducts.some(p => p.manufacturer_id === m.id)
  )

  return (
    <div>
      <Helmet>
        <title>Каталог печей та камінів — Буржуйка</title>
        <meta name="description" content="Каталог печей для сауни, опалювальних печей та камінів. Новаслав та інші виробники. Київ та область." />
        <meta property="og:title" content="Каталог печей та камінів — Буржуйка" />
        <meta property="og:description" content="Каталог печей для сауни, опалювальних печей та камінів. Новаслав та інші виробники. Київ та область." />
        <meta property="og:image" content="https://burzhuyka.com/burzuika_org_image.png" />
        <meta property="og:url" content="https://burzhuyka.com/catalog" />
        <link rel="canonical" href="https://burzhuyka.com/catalog" />
      </Helmet>

      <Navbar />

      <PageHeader
        crumbs={[{ label: 'Каталог' }]}
        title="Каталог обладнання"
        lead="Обладнання від вітчизняних та закордонних виробників."
      />

      <section className="py-12 lg:py-16 min-h-screen">
        <div className="page-wrap">
          <div role="group" aria-label="Категорії" className="inline-flex max-w-full flex-wrap gap-1 rounded-[1.75rem] bg-paper p-1.5 mb-5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleTab(cat.id)}
                aria-pressed={activeTab === cat.id}
                className={`relative rounded-full px-5 py-2.5 font-display text-base sm:text-lg font-normal tracking-[-0.01em] transition-colors duration-200 ${
                  activeTab === cat.id ? 'text-white' : 'text-steel hover:text-ink'
                }`}
              >
                {activeTab === cat.id && (
                  <motion.span
                    layoutId="catalog-tab"
                    className="absolute inset-0 rounded-full bg-forge-black"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{cat.label}</span>
              </button>
            ))}
          </div>

          <div role="group" aria-label="Виробники" className="flex flex-wrap gap-2 mb-8">
            {[{ id: 'all', label: 'Всі виробники' }, ...availableMfrs].map(m => (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMfr(m.id)}
                aria-pressed={activeMfr === m.id}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-normal transition-colors ${
                  activeMfr === m.id
                    ? 'bg-brand-primary border-brand-primary text-white'
                    : 'border-flue text-steel hover:border-ink hover:text-ink'
                }`}
              >
                {m.label}
                {m.country && <span className="ml-1.5 opacity-70">{m.country}</span>}
              </motion.button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-paper rounded-3xl h-80 animate-pulse" />
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="py-16 text-lg text-steel">
              У цій категорії поки немає товарів. Оберіть іншу категорію або зверніться за консультацією.
            </p>
          )}

          <Reveal className="relative mt-20 overflow-hidden rounded-3xl bg-forge-black text-forge-cream p-8 sm:p-14">
            <Embers count={14} />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <WordsReveal text="Не знайшли потрібне?" className="heading-xl" />
                <p className="mt-3 text-lg text-forge-dim">Підберемо обладнання під ваші потреби та бюджет.</p>
              </div>
              <div className="inline-block flex-shrink-0 self-start lg:self-center">
                <Link to="/contacts#consultation" className="btn-primary">Отримати консультацію</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
