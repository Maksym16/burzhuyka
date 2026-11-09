import { useEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import PropTypes from 'prop-types'

export const EASE = [0.22, 1, 0.36, 1]

/* Fades and lifts content the first time it scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

Reveal.propTypes = {
  children: PropTypes.node,
  delay: PropTypes.number,
  y: PropTypes.number,
  className: PropTypes.string,
  as: PropTypes.string,
}

/* Heading whose words slide up from behind a mask. */
export function WordsReveal({ text, as = 'h2', className, delay = 0, immediate = false }) {
  const Tag = motion[as]
  const words = text.split(' ')
  const trigger = immediate
    ? { animate: 'shown' }
    : { whileInView: 'shown', viewport: { once: true, margin: '-60px' } }
  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '110%' }, shown: { y: 0 } }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}

WordsReveal.propTypes = {
  text: PropTypes.string.isRequired,
  as: PropTypes.string,
  className: PropTypes.string,
  delay: PropTypes.number,
  immediate: PropTypes.bool,
}

/* Counts the numeric part of a value ("500+", "10+") up when it comes into view. */
export function CountUp({ value, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const match = String(value).match(/^(\D*)(\d+)(.*)$/)
  const target = match ? Number(match[2]) : 0
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? target : 0)

  useEffect(() => {
    if (!inView || !match || reduced) return
    const controls = animate(0, target, { duration: 1.8, ease: EASE, onUpdate: v => setShown(Math.round(v)) })
    return () => controls.stop()
  }, [inView, target]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className={className}>
      {match ? `${match[1]}${shown}${match[3]}` : value}
    </span>
  )
}

CountUp.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
}

/* Image that drifts inside its frame while the page scrolls. */
export function ParallaxImage({ src, alt = '', className = '', distance = 8, eager = false }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}%`, `${distance}%`])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? undefined : 'lazy'}
        style={{ y, scale: 1 + (distance * 2.2) / 100 }}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

ParallaxImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  distance: PropTypes.number,
  eager: PropTypes.bool,
}

/* Sparks rising from the bottom of a dark, positioned container. */
export function Embers({ count = 26 }) {
  const reduced = useReducedMotion()
  const sparks = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 140,
      rise: 45 + Math.random() * 55,
      duration: 5 + Math.random() * 7,
      delay: Math.random() * 8,
    })),
    [count]
  )
  if (reduced) return null
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map(s => (
        <motion.span
          key={s.id}
          className="absolute bottom-[-10px] rounded-full bg-brand-light"
          style={{ left: `${s.left}%`, width: s.size, height: s.size, boxShadow: '0 0 8px 2px rgba(255,122,26,.65)' }}
          animate={{ y: [0, `-${s.rise}vh`], x: [0, s.drift], opacity: [0, 1, 0.8, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

Embers.propTypes = {
  count: PropTypes.number,
}

/* Infinite horizontal ticker. */
export function Marquee({ items, className = '', duration = 32 }) {
  const doubled = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.ul
        className="flex w-max items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <li key={i} aria-hidden={i >= items.length} className="flex items-center whitespace-nowrap">
            {item}
            <span aria-hidden="true" className="mx-8 h-1.5 w-1.5 rounded-full bg-brand-light sm:mx-12" />
          </li>
        ))}
      </motion.ul>
    </div>
  )
}

Marquee.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  duration: PropTypes.number,
}

/* Tracks the pointer inside a card and exposes it as a warm radial light. */
export function SpotlightCard({ children, className = '', color = 'rgba(255,122,26,.16)' }) {
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const background = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, ${color}, transparent 70%)`

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <div className={`group relative overflow-hidden ${className}`} onPointerMove={onMove}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

SpotlightCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
}

/* Tilts in 3D towards the pointer. */
export function TiltCard({ children, className = '', max = 7 }) {
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 })

  function onMove(e) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
  }
  function onLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

TiltCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  max: PropTypes.number,
}
