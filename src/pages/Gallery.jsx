import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { Reveal } from '../components/fx'
import { fetchGallery } from '../api/gallery'

function Lightbox({ images, index, onChange, onClose }) {
  const image = images[index]
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft'  && hasPrev) onChange(index - 1)
      if (e.key === 'ArrowRight' && hasNext) onChange(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onChange, index, hasPrev, hasNext])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl leading-none transition-colors"
        onClick={onClose}
        aria-label="Закрити"
      >
        ✕
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          className="absolute left-3 sm:left-6 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onChange(index - 1) }}
          aria-label="Попереднє"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <motion.img
        layoutId={`gallery-${image.id}`}
        src={image.url}
        alt={image.title || ''}
        className="max-w-[80vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={(_, info) => {
          if (info.offset.x < -90 && hasNext) onChange(index + 1)
          if (info.offset.x > 90 && hasPrev) onChange(index - 1)
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      />

      {/* Next */}
      {hasNext && (
        <button
          className="absolute right-3 sm:right-6 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onChange(index + 1) }}
          aria-label="Наступне"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Counter */}
      <p className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
        {index + 1} / {images.length}
        {image.title && <span className="ml-3">{image.title}</span>}
      </p>
    </motion.div>
  )
}

Lightbox.propTypes = {
  images: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const { data: images = [], isLoading } = useQuery({ queryKey: ['gallery'], queryFn: fetchGallery })
  const close = useCallback(() => setSelectedIndex(null), [])

  return (
    <>
      <Helmet>
        <title>Галерея — Буржуйка</title>
        <meta name="description" content="Фотогалерея наших робіт: монтаж печей, камінів та обладнання для саун у Києві та області." />
        <meta property="og:title" content="Галерея — Буржуйка" />
        <meta property="og:description" content="Фотогалерея наших робіт: монтаж печей, камінів та обладнання для саун у Києві та області." />
        <meta property="og:image" content="https://burzhuyka.com/burzuika_org_image.png" />
        <meta property="og:url" content="https://burzhuyka.com/gallery" />
        <link rel="canonical" href="https://burzhuyka.com/gallery" />
      </Helmet>

      <Navbar />

      <PageHeader crumbs={[{ label: 'Галерея' }]} title="Наші роботи" />

      <main className="min-h-[60vh] py-10 lg:py-14">
        <div className="page-wrap">
          {isLoading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-paper animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && images.length === 0 && (
            <p className="py-16 text-lg text-steel">Галерея поки порожня. Нові роботи з&apos;являться тут незабаром.</p>
          )}

          {!isLoading && images.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[44vw] sm:auto-rows-[30vw] lg:auto-rows-[19vw] grid-flow-dense gap-2 sm:gap-3">
              {images.map((img, i) => (
                <Reveal
                  key={img.id}
                  delay={(i % 4) * 0.06}
                  className={i % 6 === 0 ? 'col-span-2 row-span-2' : i % 6 === 3 ? 'col-span-2' : ''}
                >
                  <button
                    onClick={() => setSelectedIndex(i)}
                    aria-label={img.title || `Відкрити фото ${i + 1}`}
                    className="group h-full w-full overflow-hidden rounded-2xl bg-paper cursor-zoom-in"
                  >
                    <span className="block h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                      <motion.img
                        layoutId={`gallery-${img.id}`}
                        src={img.url}
                        alt={img.title || ''}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                      />
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            images={images}
            index={selectedIndex}
            onChange={setSelectedIndex}
            onClose={close}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  )
}
