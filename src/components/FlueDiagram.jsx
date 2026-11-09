import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import PropTypes from 'prop-types'
import { EASE } from './fx'

const NODES = [
  { id: 1, title: 'Піч або камін', text: 'Підбираємо потужність за об\'ємом приміщення та утепленням і встановлюємо обладнання за вимогами виробника.', x: 244, y: 470, lead: 'M259 470H302' },
  { id: 2, title: 'Захист стін', text: 'Термоізоляція стін у зоні каміна, захисні екрани та негорючі матеріали в зоні печі.', x: 404, y: 376, lead: 'M419 376H440' },
  { id: 3, title: 'Утеплений димохід', text: 'Утеплені (сендвіч) димоходи з нержавіючої сталі, гільзовка цегляних каналів або керамічні системи.', x: 268, y: 362, lead: 'M283 362H335' },
  { id: 4, title: 'Прохідні вузли', text: 'Безпечний прохід труби через стелю та покрівлю, із захисними екранами навколо.', x: 268, y: 250, lead: 'M280 259 318 288' },
  { id: 5, title: 'Перевірка тяги', text: 'Перевіряємо тягу, робимо пробний розпал і докладно пояснюємо правила експлуатації.', x: 424, y: 66, lead: 'M409 66 362 50' },
]

const LINE = '#C9CED2'
const DIM = '#5D6770'
const HOT = '#FF7A1A'
const BG = '#20252A'

const clamp = (v) => Math.min(1, Math.max(0, v))

function Part({ on, children }) {
  return <g stroke={on ? HOT : LINE} className="transition-colors duration-300">{children}</g>
}

Part.propTypes = {
  on: PropTypes.bool,
  children: PropTypes.node,
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return desktop
}

// Cutaway of a house, echoing the logo. On desktop the section pins and scrolling
// draws the house, then carries heat up the flue one safety node at a time.
export default function FlueDiagram({ title, lead }) {
  const desktop = useIsDesktop()
  const reduced = useReducedMotion()
  const pinned = desktop && !reduced

  const sectionRef = useRef(null)
  const svgRef = useRef(null)
  const inView = useInView(svgRef, { once: true, amount: 0.15 })

  const [active, setActive] = useState(1)
  const draw = useMotionValue(0)
  const heat = useMotionValue(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const background = useTransform(heat, [0, 1], [BG, '#34241C'])
  const glow = useTransform(heat, [0, 1], [0.15, 0.75])
  // Round line caps would otherwise leave a dot at the start of an undrawn path
  const shellOpacity = useTransform(draw, [0, 0.02], [0, 1])
  // With reduced motion the outline is simply there from the start
  const shellLength = reduced ? 1 : draw
  const shellFade = reduced ? 1 : shellOpacity

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!pinned) return
    draw.set(clamp(p / 0.14))
    heat.set(clamp((p - 0.08) / 0.84))
    setActive(Math.min(5, 1 + Math.floor(p * 5)))
  })

  // Without pinning the drawing plays once and the buttons drive the heat.
  useEffect(() => {
    if (pinned || reduced || !inView) return
    const controls = animate(draw, 1, { duration: 1.4, ease: 'easeInOut' })
    return () => controls.stop()
  }, [pinned, inView, reduced, draw])

  useEffect(() => {
    if (pinned) return
    animate(heat, (active - 1) / 4, { duration: 0.8, ease: EASE })
  }, [pinned, active, heat])

  function goTo(id) {
    if (!pinned) {
      setActive(id)
      return
    }
    const el = sectionRef.current
    const range = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + range * ((id - 0.5) / 5), behavior: 'smooth' })
  }

  const node = NODES[active - 1]

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundColor: background }}
      className={`relative text-forge-cream ${pinned ? 'h-[420vh]' : 'py-20'}`}
    >
      <div className={pinned ? 'sticky top-0 flex h-screen items-center overflow-hidden' : ''}>
        <motion.div
          aria-hidden="true"
          style={{ opacity: glow }}
          className="pointer-events-none absolute left-[18%] bottom-[-10%] h-[70vh] w-[46vw] rounded-full bg-brand-primary/40 blur-[130px]"
        />

        <div className="page-wrap relative w-full grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:order-2">
            <h2 className="heading-xl text-balance">{title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-forge-dim">{lead}</p>

            {/* Step switcher */}
            <div className="mt-8 flex gap-1.5" role="group" aria-label="Етапи">
              {NODES.map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => goTo(n.id)}
                  aria-label={n.title}
                  aria-current={active === n.id}
                  className="group flex-1 py-3"
                >
                  <span className="relative block h-1 overflow-hidden rounded-full bg-white/15 group-hover:bg-white/30 transition-colors">
                    {active >= n.id && (
                      <motion.span
                        layout
                        className="absolute inset-0 rounded-full bg-brand-light"
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 min-h-[190px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="font-display text-sm font-normal text-brand-light">Вузол {node.id} із {NODES.length}</p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl font-medium tracking-[-0.02em]">{node.title}</h3>
                  <p className="mt-3 max-w-lg text-lg leading-relaxed text-forge-dim">{node.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <svg
              ref={svgRef}
              viewBox="30 10 500 550"
              role="img"
              aria-label="Схема будинку в розрізі: піч, захист стіни, утеплений димохід, прохідні вузли через стелю та покрівлю, оголовок труби"
              className="mx-auto w-full max-w-[600px] lg:max-h-[86vh]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="flue-heat" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#FFB067" />
                  <stop offset="55%" stopColor={HOT} />
                  <stop offset="100%" stopColor="#C94A10" />
                </linearGradient>
              </defs>

              {/* House shell draws itself */}
              <motion.g stroke={DIM} strokeWidth="2" style={{ opacity: shellFade }}>
                <motion.path style={{ pathLength: shellLength }} d="M92 276V540H468V276" />
                <motion.path style={{ pathLength: shellLength }} d="M40 540H520" />
                <motion.path style={{ pathLength: shellLength }} d="M92 300H468" />
              </motion.g>
              <motion.path style={{ pathLength: shellLength, opacity: shellFade }} d="M60 292 280 96 500 292" stroke={LINE} strokeWidth="9" />

              {/* Heat rising through the flue */}
              <motion.rect
                x="340" y="62" width="20" height="352"
                fill="url(#flue-heat)" stroke="none"
                style={{ scaleY: heat, originY: 1 }}
              />

              {/* Stove */}
              <Part on={active === 1}>
                <rect x="302" y="414" width="96" height="112" rx="4" strokeWidth="2.5" fill={BG} />
                <rect x="318" y="444" width="64" height="56" rx="2" strokeWidth="2" />
                <path d="M314 526v14M386 526v14" strokeWidth="2.5" />
              </Part>
              <motion.path
                d="M350 494c-14-6-16-20-6-30 0 7 4 8 6 3 3-5 2-9 0-15 12 8 20 18 15 30-2 6-8 10-15 12Z"
                fill={HOT}
                style={{ originX: 0.5, originY: 1 }}
                animate={reduced ? undefined : { scaleY: [1, 1.14, 0.95, 1.08, 1], scaleX: [1, 0.94, 1.05, 0.97, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Wall protection */}
              <Part on={active === 2}>
                <path d="M452 344V540" strokeWidth="3" strokeDasharray="2 8" />
                <path d="M440 344V540" strokeWidth="2" />
              </Part>

              {/* Insulated flue: outer jacket with insulation shown as a broken inner line */}
              <Part on={active === 3}>
                <path d="M335 414V322M365 414V322M335 278V160M365 278V160" strokeWidth="2.5" />
                <path d="M342 414V322M358 414V322M342 278V160M358 278V160" strokeWidth="1.5" strokeDasharray="5 6" />
              </Part>

              {/* Flue above the roof and cap */}
              <Part on={active === 3 || active === 5}>
                <path d="M335 160V62M365 160V62" strokeWidth="2.5" />
              </Part>
              <Part on={active === 5}>
                <path d="M325 62H375L350 34Z" strokeWidth="2.5" fill={BG} />
              </Part>

              {/* Ceiling and roof passages */}
              <Part on={active === 4}>
                <rect x="318" y="278" width="64" height="44" rx="2" strokeWidth="2.5" fill={BG} fillOpacity="0.72" />
                <path d="M325 112H375V182L325 137Z" strokeWidth="2.5" fill={BG} fillOpacity="0.72" />
              </Part>

              {/* Draught check: smoke leaving the cap */}
              <AnimatePresence>
                {active === 5 && !reduced && [0, 1, 2].map(i => (
                  <motion.circle
                    key={i}
                    cx={350}
                    r={5}
                    fill="#C9CED2"
                    stroke="none"
                    initial={{ cy: 32, opacity: 0, r: 3 }}
                    animate={{ cy: [32, 6], cx: [350, 350 + (i - 1) * 14], opacity: [0, 0.5, 0], r: [3, 11] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.1, delay: i * 0.7, repeat: Infinity, ease: 'easeOut' }}
                  />
                ))}
              </AnimatePresence>

              {/* Leader lines */}
              {NODES.map(n => (
                <path key={n.id} d={n.lead} stroke={active === n.id ? HOT : DIM} strokeWidth="1.5" className="transition-colors duration-300" />
              ))}

              {/* Node markers */}
              {NODES.map(n => {
                const on = active === n.id
                return (
                  <g key={n.id} className="cursor-pointer" onClick={() => goTo(n.id)}>
                    {on && !reduced && (
                      <motion.circle
                        cx={n.x} cy={n.y} r={15}
                        stroke={HOT} strokeWidth="1.5"
                        initial={{ r: 15, opacity: 0.8 }}
                        animate={{ r: 30, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <circle cx={n.x} cy={n.y} r="15" fill={on ? HOT : BG} stroke={on ? HOT : LINE} strokeWidth="1.5" className="transition-colors duration-300" />
                    <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="500" fill={on ? BG : '#F1F2EF'} stroke="none">{n.id}</text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

FlueDiagram.propTypes = {
  title: PropTypes.string.isRequired,
  lead: PropTypes.string.isRequired,
}
