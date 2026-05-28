import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pp-header', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      gsap.fromTo('.pp-content', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <Helmet>
        <title>Політика конфіденційності — Буржуйка</title>
        <meta name="description" content="Політика конфіденційності сайту burzhuyka.com. Як ми збираємо, використовуємо та захищаємо ваші персональні дані." />
        <meta property="og:title" content="Політика конфіденційності — Буржуйка" />
        <meta property="og:description" content="Політика конфіденційності сайту burzhuyka.com. Як ми збираємо, використовуємо та захищаємо ваші персональні дані." />
        <meta property="og:image" content="https://burzhuyka.com/burzuika_org_image.png" />
        <meta property="og:url" content="https://burzhuyka.com/polityka-konfidencijnosti" />
        <link rel="canonical" href="https://burzhuyka.com/polityka-konfidencijnosti" />
      </Helmet>

      <Navbar />

      {/* Dark header */}
      <section className="bg-forge-black pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="pp-header">
            <nav className="flex items-center gap-2 text-forge-muted text-sm mb-6">
              <Link to="/" className="hover:text-brand-primary transition-colors">Головна</Link>
              <span className="text-forge-border">/</span>
              <span className="text-forge-cream">Політика конфіденційності</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
              <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                Правова інформація
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase text-forge-cream leading-none">
              Політика<br />конфіденційності
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-14 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pp-content bg-white p-8 sm:p-12 relative">
            {/* Corner accent */}
            <div className="absolute top-0 left-0 h-0.5 w-24 bg-brand-primary" />
            <div className="absolute top-0 left-0 w-0.5 h-24 bg-brand-primary" />

            <p className="text-gray-400 text-sm mb-10">Дата набрання чинності: 27 травня 2026 р.</p>

            {/* 1 */}
            <Section title="1. Загальні положення">
              <p>
                Ця Політика конфіденційності описує, як ФОП / компанія <strong>«Буржуйка»</strong> (далі — «Компанія», «ми»), що здійснює діяльність за адресою: м. Київ, Україна, збирає, використовує та захищає персональні дані, які ви надаєте під час використання веб-сайту <strong>burzhuyka.com</strong> (далі — «Сайт»).
              </p>
              <p className="mt-3">
                Обробка персональних даних здійснюється відповідно до Закону України «Про захист персональних даних» від 01.06.2010 № 2297-VI та інших чинних нормативно-правових актів України.
              </p>
              <p className="mt-3">
                Використовуючи Сайт та заповнюючи контактні форми, ви даєте згоду на обробку ваших персональних даних на умовах, викладених у цій Політиці.
              </p>
            </Section>

            {/* 2 */}
            <Section title="2. Які персональні дані ми збираємо">
              <p>Ми збираємо лише ті дані, які ви самостійно надаєте нам через форму зворотного зв&apos;язку на сторінці «Контакти»:</p>
              <ul className="mt-3 space-y-2 list-none">
                <Item>Ваше ім&apos;я — для персонального звернення під час зв&apos;язку.</Item>
                <Item>Номер телефону — для здійснення зворотного дзвінка або консультації.</Item>
                <Item>Тип послуги (необов&apos;язково) — для попередньої підготовки до розмови.</Item>
                <Item>Повідомлення / коментар (необов&apos;язково) — для кращого розуміння вашого запиту.</Item>
              </ul>
              <p className="mt-3">
                Ми <strong>не збираємо</strong> паспортні дані, банківські реквізити, медичну чи іншу чутливу інформацію.
              </p>
            </Section>

            {/* 3 */}
            <Section title="3. Мета обробки даних">
              <p>Надані вами дані використовуються виключно з такою метою:</p>
              <ul className="mt-3 space-y-2 list-none">
                <Item>Зворотний зв&apos;язок — передзвонити або відповісти на ваш запит.</Item>
                <Item>Надання консультацій щодо монтажу печей, камінів і обладнання для лазні.</Item>
                <Item>Оформлення замовлення на послуги або товари.</Item>
              </ul>
              <p className="mt-3">
                Ваші дані <strong>не продаються</strong> та <strong>не передаються</strong> третім особам у комерційних цілях. Дані можуть бути розкриті лише на вимогу компетентних органів відповідно до чинного законодавства України.
              </p>
            </Section>

            {/* 4 */}
            <Section title="4. Зберігання та захист даних">
              <p>
                Персональні дані зберігаються на захищених серверах і доступні лише уповноваженим співробітникам Компанії, які безпосередньо опрацьовують запити клієнтів.
              </p>
              <p className="mt-3">
                Ми вживаємо технічних та організаційних заходів для захисту даних від несанкціонованого доступу, втрати або знищення: шифрування з&apos;єднань (HTTPS), обмежений доступ до систем обробки даних, регулярний перегляд прав доступу.
              </p>
              <p className="mt-3">
                Дані зберігаються протягом строку, необхідного для виконання зазначеної мети, але не довше ніж <strong>3 роки</strong> з моменту останнього контакту, якщо інше не вимагається законодавством.
              </p>
            </Section>

            {/* 5 */}
            <Section title="5. Файли cookie">
              <p>
                Сайт використовує технічні та аналітичні файли cookie — невеликі текстові файли, що зберігаються у вашому браузері. Вони допомагають:
              </p>
              <ul className="mt-3 space-y-2 list-none">
                <Item>Забезпечувати коректну роботу сайту (технічні cookie).</Item>
                <Item>Аналізувати відвідуваність і поведінку користувачів для покращення сайту (аналітичні cookie).</Item>
              </ul>
              <p className="mt-3">
                Ви можете вимкнути збереження cookie у налаштуваннях браузера. Зверніть увагу, що це може вплинути на коректну роботу деяких функцій Сайту.
              </p>
            </Section>

            {/* 6 */}
            <Section title="6. Права суб'єкта персональних даних">
              <p>Відповідно до Закону України «Про захист персональних даних» ви маєте право:</p>
              <ul className="mt-3 space-y-2 list-none">
                <Item><strong>Доступ</strong> — дізнатись, які ваші дані ми обробляємо.</Item>
                <Item><strong>Виправлення</strong> — вимагати уточнення або оновлення неточних даних.</Item>
                <Item><strong>Видалення</strong> — вимагати видалення ваших даних (якщо відсутні законні підстави для їх подальшого зберігання).</Item>
                <Item><strong>Відкликання згоди</strong> — відкликати раніше надану згоду на обробку даних.</Item>
                <Item><strong>Оскарження</strong> — звернутись до Уповноваженого Верховної Ради України з прав людини.</Item>
              </ul>
            </Section>

            {/* 7 */}
            <Section title="7. Контакти для запитів щодо персональних даних">
              <p>
                Якщо у вас є питання щодо обробки персональних даних або ви бажаєте скористатися своїми правами, зв&apos;яжіться з нами будь-яким зручним способом:
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <a href="tel:+380935428302" className="text-gray-800 hover:text-brand-primary transition-colors font-semibold">
                    +38 (093) 542-83-02
                  </a>
                </div>
                <div>
                  <div className="space-y-1">
                    <a href="tel:+380688429412" className="block text-gray-800 hover:text-brand-primary transition-colors font-semibold">
                      +38 (068) 842-94-12
                    </a>
                    <a href="tel:+380951420814" className="block text-gray-800 hover:text-brand-primary transition-colors font-semibold">
                      +38 (095) 142-08-14
                    </a>
                  </div>
                </div>
                <div>
                  <a href="mailto:burzhuyka.montazh@gmail.com" className="text-gray-800 hover:text-brand-primary transition-colors font-semibold underline">
                    burzhuyka.montazh@gmail.com
                  </a>
                </div>
              </div>
              <p className="mt-4 text-gray-500">
                Ми опрацюємо ваш запит протягом 30 календарних днів.
              </p>
            </Section>

            {/* 8 */}
            <Section title="8. Зміни до Політики конфіденційності" last>
              <p>
                Компанія залишає за собою право вносити зміни до цієї Політики. Актуальна версія завжди доступна за адресою{' '}
                <a href="https://burzhuyka.com/polityka-konfidencijnosti" className="text-brand-primary hover:underline">
                  burzhuyka.com/polityka-konfidencijnosti
                </a>
                . Дата останнього оновлення вказана на початку документа.
              </p>
            </Section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function Section({ title, children, last }) {
  return (
    <div className={`${last ? '' : 'mb-10 pb-10 border-b border-gray-100'}`}>
      <h2 className="font-display text-xl font-bold uppercase text-gray-900 mb-4 tracking-wide">
        {title}
      </h2>
      <div className="text-gray-600 text-sm leading-relaxed font-sans">
        {children}
      </div>
    </div>
  )
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  last: PropTypes.bool,
}

function Item({ children }) {
  return (
    <li className="flex items-start gap-2 text-gray-600 text-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0 mt-1.5" />
      <span>{children}</span>
    </li>
  )
}

Item.propTypes = {
  children: PropTypes.node.isRequired,
}
