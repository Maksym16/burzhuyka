import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';

const NAV = [
  ['/catalog', 'Каталог товарів'],
  ['/gallery', 'Галерея робіт'],
  ['/montazh-saun-ta-ban', 'Монтаж саун та бань'],
  ['/contacts', 'Контакти'],
];

const linkClass = 'hover:text-forge-cream transition-colors';

export default function Footer() {
  const wordmarkRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: wordmarkRef, offset: ['start end', 'end end'] });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['45%', '0%']);

  return (
    <footer className="overflow-hidden bg-forge-dark text-forge-dim font-normal">
      <div className="page-wrap pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-14 text-[15px]">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 text-forge-cream">
              <img src="/logo/logo3.png" alt="" className="h-8 w-auto object-contain" />
              <span className="font-display text-lg font-medium">Буржуйка</span>
            </Link>
            <p className="leading-relaxed max-w-xs">
              Монтаж та продаж печей, камінів і обладнання для бань та лазні. Київ та область.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-forge-muted text-sm font-normal mb-4">Сайт</h2>
            <ul className="space-y-2.5">
              {NAV.map(([to, label]) => (
                <li key={to}><Link to={to} className={linkClass}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-forge-muted text-sm font-normal mb-4">Монтаж</h2>
              <a href="tel:+380935428302" className={`block whitespace-nowrap ${linkClass}`}>+38 093 542 83 02</a>
              <h2 className="text-forge-muted text-sm font-normal mt-6 mb-4">Продаж</h2>
              <a href="tel:+380688429412" className={`block mb-2.5 whitespace-nowrap ${linkClass}`}>+38 068 842 94 12</a>
              <a href="tel:+380951420814" className={`block whitespace-nowrap ${linkClass}`}>+38 095 142 08 14</a>
            </div>
            <div className="min-w-0">
              <h2 className="text-forge-muted text-sm font-normal mb-4">Написати</h2>
              <a href="https://t.me/burzhuyka_montazh" target="_blank" rel="noopener noreferrer" className={`block mb-2.5 ${linkClass}`}>Telegram</a>
              <a href="viber://chat?number=%2B380688429412" className={`block mb-2.5 ${linkClass}`}>Viber</a>
              <a href="mailto:burzhuyka.montazh@gmail.com" className={`block ${linkClass}`}>Email</a>
            </div>
          </div>
        </div>

        <div className="border-t border-forge-border pt-6 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 text-sm text-forge-muted">
          <p className="sm:mr-auto">© {new Date().getFullYear()} Буржуйка</p>
          <Link to="/polityka-konfidencijnosti" className={linkClass}>Політика конфіденційності</Link>
          <Link to="/umovy-nadannia-posluh" className={linkClass}>Умови надання послуг</Link>
          <Link to="/admin/login" className={linkClass} aria-label="Адміністрування" title="Адмін">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline w-3.5 h-3.5 -mt-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3zm0 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Oversized wordmark rising out of the page edge */}
      <div ref={wordmarkRef} aria-hidden="true" className="select-none overflow-hidden">
        <motion.p
          style={{ y: wordmarkY }}
          className="m-0 pb-[0.06em] text-center font-display text-[20.5vw] font-semibold leading-[1.02] tracking-[-0.045em] bg-gradient-to-b from-forge-border to-brand-primary/70 bg-clip-text text-transparent"
        >
          Буржуйка
        </motion.p>
      </div>
    </footer>
  );
}
