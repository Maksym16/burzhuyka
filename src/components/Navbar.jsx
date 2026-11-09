import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { PhoneIcon } from './Icons';

const NAV_LINKS = [
  { to: '/', label: 'Головна' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/montazh-saun-ta-ban', label: 'Сауни та бані' },
  { to: '/contacts', label: 'Контакти' },
];

const EASE = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32 });

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 500 && y > prev);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 text-forge-cream transition-colors duration-300 ${
        scrolled || open ? 'bg-forge-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}
      animate={{ y: hidden && !open ? '-100%' : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className="page-wrap">
        <div className="flex items-center justify-between py-3">
          <Link to="/" onClick={() => setOpen(false)} className="relative z-10 flex items-center gap-2.5">
            <img src="/logo/logo.png" alt="" className="h-9 w-auto object-contain" />
            <span className="font-display text-xl font-medium tracking-[-0.01em] leading-none">Буржуйка</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className="relative rounded-full px-3 lg:px-4 py-2 text-sm lg:text-[15px] font-normal whitespace-nowrap">
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className={`relative transition-colors ${isActive ? 'text-forge-cream' : 'text-forge-dim hover:text-forge-cream'}`}>
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
            <motion.a
              href="tel:+380935428302"
              aria-label="Зателефонувати +38 093 542 83 02"
              whileTap={{ scale: 0.97 }}
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2.5 whitespace-nowrap transition-colors"
            >
              <PhoneIcon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xl:inline">+38 093 542 83 02</span>
            </motion.a>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
            className="relative z-10 md:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10"
          >
            <motion.span className="block h-0.5 w-6 bg-current" animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} />
            <motion.span className="block h-0.5 w-6 bg-current" animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} />
          </button>
        </div>
      </div>

      {/* Reading progress */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-brand-light"
        style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden overflow-hidden bg-forge-black"
            initial={{ height: 0 }}
            animate={{ height: 'calc(100dvh - 61px)' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <motion.div
              className="page-wrap flex h-full flex-col pt-6 pb-8"
              initial="hidden"
              animate="shown"
              exit="hidden"
              variants={{ shown: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } }, hidden: {} }}
            >
              {NAV_LINKS.map(({ to, label }) => (
                <motion.div
                  key={to}
                  variants={{ hidden: { opacity: 0, y: 24 }, shown: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-2.5 font-display text-4xl font-medium tracking-[-0.02em] ${isActive ? 'text-brand-light' : 'text-forge-cream'}`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
              <a href="tel:+380935428302" onClick={() => setOpen(false)} className="btn-primary mt-auto">
                <PhoneIcon className="w-4 h-4" />
                +38 093 542 83 02
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
