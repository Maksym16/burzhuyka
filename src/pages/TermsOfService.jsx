import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'

export default function TermsOfService() {
  return (
    <div>
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

      <PageHeader crumbs={[{ label: 'Умови надання послуг' }]} title="Умови надання послуг" />

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="page-wrap">
          <div className="max-w-3xl">

            <p className="text-steel text-[15px] mb-10">Дата набрання чинності: 27 травня 2026 р.</p>

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
                  <p className="text-steel text-sm mb-1">Монтаж</p>
                  <a href="tel:+380935428302" className="text-ink hover:text-brand-primary transition-colors font-semibold">
                    +38 (093) 542-83-02
                  </a>
                </div>
                <div>
                  <p className="text-steel text-sm mb-1">Продаж</p>
                  <div className="space-y-1">
                    <a href="tel:+380688429412" className="block text-ink hover:text-brand-primary transition-colors font-semibold">
                      +38 (068) 842-94-12
                    </a>
                    <a href="tel:+380951420814" className="block text-ink hover:text-brand-primary transition-colors font-semibold">
                      +38 (095) 142-08-14
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-steel text-sm mb-1">Email</p>
                  <a href="mailto:burzhuyka.montazh@gmail.com" className="text-ink hover:text-brand-primary transition-colors font-semibold underline">
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
    <div className={`${last ? '' : 'mb-10 pb-10 border-b border-flue'}`}>
      <h2 className="heading-md mb-4">
        {title}
      </h2>
      <div className="text-steel leading-relaxed">
        {children}
      </div>
    </div>
  )
}

function Item({ children }) {
  return (
    <li className="flex items-start gap-2.5 text-steel">
      <span className="w-1 h-1 rounded-full bg-steel flex-shrink-0 mt-2.5" />
      <span>{children}</span>
    </li>
  )
}

Section.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
  last: PropTypes.bool,
}

Item.propTypes = {
  children: PropTypes.node,
}
