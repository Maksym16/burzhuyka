import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsOfService() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.tos-header', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      gsap.fromTo('.tos-content', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <Helmet>
        <title>Умови надання послуг — Буржуйка</title>
        <meta name="description" content="Умови надання послуг компанії Буржуйка: монтаж печей, камінів та димоходів у Києві. Порядок замовлення, гарантія, вирішення спорів." />
        <meta property="og:title" content="Умови надання послуг — Буржуйка" />
        <meta property="og:description" content="Умови надання послуг компанії Буржуйка: монтаж печей, камінів та димоходів у Києві." />
        <meta property="og:image" content="https://burzhuyka.com/burzuika_org_image.png" />
        <meta property="og:url" content="https://burzhuyka.com/umovy-nadannia-posluh" />
        <link rel="canonical" href="https://burzhuyka.com/umovy-nadannia-posluh" />
      </Helmet>

      <Navbar />

      {/* Dark header */}
      <section className="bg-forge-black pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="tos-header">
            <nav className="flex items-center gap-2 text-forge-muted text-sm mb-6">
              <Link to="/" className="hover:text-brand-primary transition-colors">Головна</Link>
              <span className="text-forge-border">/</span>
              <span className="text-forge-cream">Умови надання послуг</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
              <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                Правова інформація
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase text-forge-cream leading-none">
              Умови<br />надання послуг
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-14 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tos-content bg-white p-8 sm:p-12 relative">
            {/* Corner accent */}
            <div className="absolute top-0 left-0 h-0.5 w-24 bg-brand-primary" />
            <div className="absolute top-0 left-0 w-0.5 h-24 bg-brand-primary" />

            <p className="text-gray-400 text-sm mb-10">Дата набрання чинності: 27 травня 2026 р.</p>

            {/* 1 */}
            <Section title="1. Загальні положення">
              <p>
                Ці Умови надання послуг (далі — «Умови») регулюють відносини між компанією <strong>«Буржуйка»</strong> (далі — «Виконавець»), що здійснює діяльність у м. Київ, Україна, та будь-якою фізичною або юридичною особою (далі — «Замовник»), яка звертається за послугами через веб-сайт <strong>burzhuyka.com</strong> або будь-яким іншим способом.
              </p>
              <p className="mt-3">
                Подаючи заявку через контактну форму на сайті або зв&apos;язуючись із Виконавцем по телефону, Замовник підтверджує, що ознайомився з цими Умовами та погоджується з ними.
              </p>
              <p className="mt-3">
                Умови складені відповідно до Цивільного кодексу України, Закону України «Про захист прав споживачів» та інших чинних нормативно-правових актів.
              </p>
            </Section>

            {/* 2 */}
            <Section title="2. Перелік послуг">
              <p>Виконавець надає такі послуги:</p>
              <ul className="mt-3 space-y-2 list-none">
                <Item>Монтаж димоходів (цегляних, сандвіч-димоходів, керамічних систем).</Item>
                <Item>Встановлення та підключення камінів і камінних топок.</Item>
                <Item>Монтаж печей і обладнання для бань та саун.</Item>
                <Item>Встановлення опалювальних печей.</Item>
                <Item>Продаж печей, камінів, димохідних систем та супутнього обладнання.</Item>
                <Item>Технічні консультації щодо вибору та монтажу обладнання.</Item>
              </ul>
              <p className="mt-3">
                Конкретний перелік робіт, що входять до кожного замовлення, узгоджується індивідуально під час телефонної консультації.
              </p>
            </Section>

            {/* 3 */}
            <Section title="3. Порядок замовлення">
              <p>Процес оформлення замовлення:</p>
              <ul className="mt-3 space-y-2 list-none">
                <Item>Замовник залишає заявку через контактну форму на сайті або телефонує безпосередньо.</Item>
                <Item>Менеджер Виконавця зв&apos;язується із Замовником протягом 1-2 днів для уточнення деталей.</Item>
                <Item>Сторони погоджують обсяг робіт, вартість та строки виконання.</Item>
                <Item>Замовлення вважається прийнятим після усного або письмового підтвердження обома сторонами.</Item>
              </ul>
              <p className="mt-3">
                Виконавець має право відмовити у прийнятті замовлення, якщо воно технічно неможливе або суперечить вимогам безпеки.
              </p>
            </Section>

            {/* 4 */}
            <Section title="4. Вартість та оплата">
              <p>
                Вартість послуг розраховується індивідуально залежно від обсягу, складності та матеріалів, що використовуються. Ціна узгоджується із Замовником до початку виконання робіт.
              </p>
              <p className="mt-3">
                Сайт не здійснює онлайн-оплат. Розрахунок проводиться у спосіб, погоджений сторонами: після завершення робіт або частинами відповідно до домовленості.
              </p>
              <p className="mt-3">
                Вартість матеріалів, якщо вони закуповуються Виконавцем, включається до загальної суми або оплачується окремо — за домовленістю.
              </p>
            </Section>

            {/* 5 */}
            <Section title="5. Строки виконання">
              <p>
                Строки виконання кожного замовлення узгоджуються індивідуально і залежать від обсягу робіт, наявності матеріалів та графіку завантаження Виконавця.
              </p>
              <p className="mt-3">
                Виконавець зобов&apos;язується дотримуватись погоджених строків. У разі об&apos;єктивних обставин, що унеможливлюють виконання у визначений термін, Виконавець повідомляє Замовника завчасно та узгоджує нові строки.
              </p>
            </Section>

            {/* 6 */}
            <Section title="6. Гарантія">
              <p>
                На всі виконані монтажні роботи Виконавець надає <strong>гарантію терміном 1 рік</strong> з дня завершення робіт, якщо інше не обумовлено окремо.
              </p>
              <p className="mt-3">
                Гарантія поширюється на якість виконаного монтажу. Вона не покриває пошкодження, спричинені:
              </p>
              <ul className="mt-2 space-y-2 list-none">
                <Item>Неправильною експлуатацією Замовником.</Item>
                <Item>Механічними пошкодженнями, що виникли після завершення робіт.</Item>
                <Item>Самостійним втручанням у змонтовані конструкції третіми особами.</Item>
              </ul>
              <p className="mt-3">
                На товари, придбані у Виконавця, поширюється гарантія виробника відповідно до умов виробника.
              </p>
            </Section>

            {/* 7 */}
            <Section title="7. Вирішення спорів">
              <p>
                У разі виникнення будь-яких претензій або спорів Замовник спочатку звертається безпосередньо до Виконавця для вирішення питання в досудовому порядку.
              </p>
              <p className="mt-3">
                Якщо сторони не дійшли згоди протягом 30 календарних днів, спір вирішується у порядку, передбаченому чинним законодавством України, у тому числі відповідно до Закону України «Про захист прав споживачів».
              </p>
            </Section>

            {/* 8 */}
            <Section title="8. Контакти">
              <p>З будь-яких питань щодо послуг або цих Умов зв&apos;яжіться з нами:</p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-brand-primary text-xs uppercase tracking-[0.18em] font-medium mb-1">Монтаж</p>
                  <a href="tel:+380935428302" className="text-gray-800 hover:text-brand-primary transition-colors font-semibold">
                    +38 (093) 542-83-02
                  </a>
                </div>
                <div>
                  <p className="text-brand-primary text-xs uppercase tracking-[0.18em] font-medium mb-1">Продаж</p>
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
                  <p className="text-brand-primary text-xs uppercase tracking-[0.18em] font-medium mb-1">Email</p>
                  <a href="mailto:burzhuyka.montazh@gmail.com" className="text-gray-800 hover:text-brand-primary transition-colors font-semibold underline">
                    burzhuyka.montazh@gmail.com
                  </a>
                </div>
              </div>
            </Section>

            {/* 9 */}
            <Section title="9. Зміни до Умов" last>
              <p>
                Виконавець залишає за собою право вносити зміни до цих Умов. Актуальна версія завжди доступна за адресою{' '}
                <a href="https://burzhuyka.com/umovy-nadannia-posluh" className="text-brand-primary hover:underline">
                  burzhuyka.com/umovy-nadannia-posluh
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

function Item({ children }) {
  return (
    <li className="flex items-start gap-2 text-gray-600 text-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0 mt-1.5" />
      <span>{children}</span>
    </li>
  )
}
