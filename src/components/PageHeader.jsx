import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import PropTypes from 'prop-types'
import { EASE, Embers, WordsReveal } from './fx'

// Graphite band under the navbar: breadcrumbs, then an optional title and lead.
export default function PageHeader({ crumbs, title, lead }) {
  return (
    <section className="relative overflow-hidden bg-forge-black text-forge-cream pt-28 pb-12 lg:pb-20">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-[-10%] h-[440px] w-[640px] rounded-full bg-brand-primary/30 blur-[120px]"
        animate={{ opacity: [0.55, 0.9, 0.6, 1, 0.55], scale: [1, 1.06, 0.98, 1.04, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <Embers count={12} />
      <div className="page-wrap relative">
        <motion.nav
          aria-label="Навігаційний ланцюжок"
          className="flex flex-wrap items-center gap-2 text-sm text-forge-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link to="/" className="hover:text-forge-cream transition-colors">Головна</Link>
          {crumbs.map(({ label, to }) => (
            <Fragment key={label}>
              <span aria-hidden="true">/</span>
              {to
                ? <Link to={to} className="hover:text-forge-cream transition-colors">{label}</Link>
                : <span className="text-forge-cream" aria-current="page">{label}</span>}
            </Fragment>
          ))}
        </motion.nav>
        {title && (
          <WordsReveal as="h1" text={title} immediate delay={0.35} className="heading-display mt-8 max-w-5xl" />
        )}
        {lead && (
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-forge-dim"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            {lead}
          </motion.p>
        )}
      </div>
    </section>
  )
}

PageHeader.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, to: PropTypes.string })).isRequired,
  title: PropTypes.string,
  lead: PropTypes.node,
}
