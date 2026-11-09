import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'

export default function PrivacyPolicy() {
  return (
    <div>
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

      <PageHeader crumbs={[{ label: 'Політика конфіденційності' }]} title="Політика конфіденційності" />

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="page-wrap">
          <div className="max-w-3xl">

            <p className="text-steel text-[15px] mb-10">Дата набрання чинності: 27 травня 2026 р.</p>

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
                  <a href="tel:+380935428302" className="text-ink hover:text-brand-primary transition-colors font-semibold">
                    +38 (093) 542-83-02
                  </a>
                </div>
                <div>
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
                  <a href="mailto:burzhuyka.montazh@gmail.com" className="text-ink hover:text-brand-primary transition-colors font-semibold underline">
                    burzhuyka.montazh@gmail.com
                  </a>
                </div>
              </div>
              <p className="mt-4 text-steel">
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

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  last: PropTypes.bool,
}

function Item({ children }) {
  return (
    <li className="flex items-start gap-2.5 text-steel">
      <span className="w-1 h-1 rounded-full bg-steel flex-shrink-0 mt-2.5" />
      <span>{children}</span>
    </li>
  )
}

Item.propTypes = {
  children: PropTypes.node.isRequired,
}
