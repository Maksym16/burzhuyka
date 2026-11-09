import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { EASE, Reveal } from '../components/fx'
import { fetchProductBySlug } from '../api/products'

function SpecsRenderer({ specs, specColumns }) {
  const isTable = specColumns && specColumns.length > 0

  if (isTable) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] border-collapse">
          <thead>
            <tr className="border-b border-ink">
              <th className="text-left font-normal text-steel py-3 pr-6 w-1/2">Параметр</th>
              {specColumns.map(col => (
                <th key={col} className="text-right font-normal px-4 py-3 whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((row, i) => {
              const cells = row.split('|')
              return (
                <tr key={i} className="border-b border-flue/70">
                  <td className="py-3 pr-6 text-steel">{cells[0]}</td>
                  {cells.slice(1).map((v, j) => (
                    <td key={j} className="px-4 py-3 text-right font-normal">{v}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <dl className="border-t border-ink">
      {specs.map((spec, i) => {
        const colonIdx = spec.indexOf(':')
        const hasLabel = colonIdx > 0 && colonIdx < 40
        return (
          <div key={i} className="grid sm:grid-cols-2 gap-1 sm:gap-6 border-b border-flue/70 py-3 text-[15px]">
            {hasLabel ? (
              <>
                <dt className="text-steel">{spec.slice(0, colonIdx).trim()}</dt>
                <dd className="m-0 font-normal">{spec.slice(colonIdx + 1).trim()}</dd>
              </>
            ) : (
              <dd className="m-0 font-normal sm:col-span-2">{spec}</dd>
            )}
          </div>
        )
      })}
    </dl>
  )
}

SpecsRenderer.propTypes = {
  specs: PropTypes.arrayOf(PropTypes.string).isRequired,
  specColumns: PropTypes.arrayOf(PropTypes.string),
}

export default function ProductPage() {
  const { slug } = useParams()

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product-slug', slug],
    queryFn: () => fetchProductBySlug(slug),
    retry: false,
  })

  return (
    <div>
      <Helmet>
        <title>{product ? `${product.name} — Буржуйка` : 'Буржуйка'}</title>
        <meta name="description" content={product?.description?.slice(0, 155) ?? 'Деталі товару — Буржуйка'} />
        <meta property="og:title" content={product ? `${product.name} — Буржуйка` : 'Буржуйка'} />
        <meta property="og:description" content={product?.description?.slice(0, 155) ?? ''} />
        <meta property="og:image" content="https://burzhuyka.com/burzuika_org_image.png" />
        <meta property="og:url" content={`https://burzhuyka.com/catalog/${product?.slug ?? ''}`} />
        <link rel="canonical" href={`https://burzhuyka.com/catalog/${product?.slug ?? ''}`} />
        {product && (
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description ?? undefined,
            url: `https://burzhuyka.com/catalog/${product.slug}`,
            image: 'https://burzhuyka.com/burzuika_org_image.png',
            brand: { '@type': 'Brand', name: product.manufacturer_label ?? 'Новаслав' },
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              priceCurrency: 'UAH',
              seller: { '@type': 'Organization', name: 'Буржуйка', url: 'https://burzhuyka.com' },
            },
          })}</script>
        )}
      </Helmet>

      <Navbar />

      <PageHeader
        crumbs={[{ label: 'Каталог', to: '/catalog' }, ...(product ? [{ label: product.name }] : [])]}
      />

      <section className="py-12 lg:py-16 min-h-screen">
        <div className="page-wrap">
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-paper rounded-3xl aspect-square animate-pulse" />
              <div className="space-y-4">
                <div className="bg-flue/50 h-10 w-3/4 animate-pulse" />
                <div className="bg-flue/50 h-4 w-full animate-pulse" />
                <div className="bg-flue/50 h-4 w-5/6 animate-pulse" />
              </div>
            </div>
          )}

          {isError && (
            <div className="py-16">
              <h1 className="heading-lg mb-4">Товар не знайдено</h1>
              <p className="mb-8 text-lg text-steel">Можливо, його вже немає в каталозі або посилання застаріло.</p>
              <Link to="/catalog" className="btn-primary">Повернутись до каталогу</Link>
            </div>
          )}

          {product && (
            <ProductGalleryLayout product={product} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function ProductGalleryLayout({ product }) {
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images || []).filter(img => img !== product.image),
  ]
  const [activeImg, setActiveImg] = useState(allImages[0] ?? null)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16 lg:mb-20">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative bg-white rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center">
            {activeImg ? (
              <AnimatePresence initial={false}>
                <motion.img
                  key={activeImg}
                  src={activeImg}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </AnimatePresence>
            ) : (
              <p className="text-steel">Фото готується</p>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  aria-label={`Фото ${i + 1}`}
                  aria-pressed={activeImg === img}
                  className="relative w-20 h-20 flex-shrink-0 rounded-2xl p-1"
                >
                  {activeImg === img && (
                    <motion.span
                      layoutId="product-thumb"
                      className="absolute inset-0 rounded-2xl border-2 border-brand-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <img src={img} alt="" loading="lazy" className="w-full h-full rounded-xl object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <Reveal className="lg:col-span-5 flex flex-col">
          <p className="flex items-center gap-3 text-[15px] font-normal text-steel mb-3">
            {product.category_label}
            {product.is_on_sale && (
              <span className="rounded-full bg-brand-primary text-white text-sm px-3 py-0.5">Акція</span>
            )}
          </p>

          <h1 className="heading-lg">{product.name}</h1>

          {product.manufacturer_label && (
            <p className="mt-3 text-steel">
              {product.manufacturer_label}
              {product.country && `, ${product.country}`}
            </p>
          )}

          {product.price != null && (
            <p className="mt-6 text-steel">
              від <span className="font-display text-[2rem] font-medium leading-none text-ink tracking-[-0.02em]">{Number(product.price).toLocaleString('uk-UA')}</span> грн
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/contacts#consultation" className="btn-primary">Замовити</Link>
            <a href="tel:+380688429412" className="btn-on-light">+38 068 842 94 12</a>
          </div>

          {product.description && (
            <div className="mt-8 border-t border-flue pt-6 leading-relaxed text-steel space-y-3">
              {product.description.split('\n\n').map((para, i) => (
                <p key={i} style={{ whiteSpace: 'pre-line' }}>{para}</p>
              ))}
            </div>
          )}
        </Reveal>
      </div>

      {(product.specs || []).length > 0 && (
        <Reveal className="max-w-4xl">
          <h2 className="heading-lg mb-6">Технічні характеристики</h2>
          <SpecsRenderer specs={product.specs} specColumns={product.spec_columns} />
        </Reveal>
      )}

      <Link to="/catalog" className="text-link inline-block mt-10">
        Повернутись до каталогу
      </Link>
    </>
  )
}

ProductGalleryLayout.propTypes = {
  product: PropTypes.object.isRequired,
}
