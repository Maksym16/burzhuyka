import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import PropTypes from 'prop-types'
import { TgIcon, VbIcon } from './Icons'
import { Embers, Reveal, WordsReveal } from './fx'

const INSTALL = { label: 'Монтаж', phones: [['+380935428302', '+38 093 542 83 02']] }
const SALES = { label: 'Продаж', phones: [['+380688429412', '+38 068 842 94 12'], ['+380951420814', '+38 095 142 08 14']] }

// Closing band over live flame, shared by the home and sauna pages.
export default function ContactPanel({ title, lead, showSales = true }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const groups = showSales ? [INSTALL, SALES] : [INSTALL]

  return (
    <section ref={ref} className="relative overflow-hidden bg-forge-dark text-forge-cream py-24 lg:py-36">
      <motion.img
        src="/fire-flame.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ y, scale: 1.3 }}
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forge-dark via-forge-dark/70 to-forge-dark/20" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-forge-dark to-transparent" />
      <Embers count={18} />

      <div className="page-wrap relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <WordsReveal text={title} className="heading-display" />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-forge-dim">{lead}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/contacts#consultation" className="btn-primary">Отримати консультацію</Link>
              <a href="https://t.me/burzhuyka_montazh" target="_blank" rel="noopener noreferrer" className="btn-on-dark">
                <TgIcon className="w-4 h-4 text-[#2AABEE]" />
                Telegram
              </a>
              <a href="viber://chat?number=%2B380688429412" className="btn-on-dark">
                <VbIcon className="w-4 h-4 text-[#9D8FF7]" />
                Viber
              </a>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 space-y-8 self-end">
          {groups.map(({ label, phones }, i) => (
            <Reveal key={label} delay={0.15 * i}>
              <div className="border-t border-white/20 pt-5">
                <p className="mb-3 text-sm text-forge-dim">{label}</p>
                {phones.map(([tel, text]) => (
                  <a
                    key={tel}
                    href={`tel:${tel}`}
                    className="block font-display text-2xl sm:text-3xl font-normal leading-snug tracking-[-0.01em] hover:text-brand-light transition-colors"
                  >
                    {text}
                  </a>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

ContactPanel.propTypes = {
  title: PropTypes.string.isRequired,
  lead: PropTypes.string.isRequired,
  showSales: PropTypes.bool,
}
