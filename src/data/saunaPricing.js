// Price packages for the "Монтаж саун та бань" page.
// Edit the numbers below to update prices shown on the site —
// nothing else in the page needs to change.
export const SAUNA_PACKAGES = [
  {
    id: 'compact',
    title: 'Компакт',
    size: '2000 × 1400 × 2000 мм',
    persons: '2–3 особи',
    included: [
      'Електрокам\'янка 4,5–6 кВт',
      'Скляні двері',
      'Утеплення та пароізоляція',
      'Вагонка',
      'Полиці у 2 рівні',
      'Вентиляція',
      '1 світильник',
    ],
    priceFrom: 90000,
  },
  {
    id: 'standard',
    title: 'Стандарт',
    size: '2000 × 2000 × 2100 мм',
    persons: '3–4 особи',
    included: [
      'Усе з пакету «Компакт»',
      'Дерев\'яні трапи на підлогу',
      'LED-підсвітка полиць',
      '2 світильники',
    ],
    priceFrom: 105000,
  },
  {
    id: 'family',
    title: 'Сімейна',
    size: '3000 × 2400 × 2200 мм',
    persons: '5–6 осіб',
    included: [
      'Піч 9 кВт або дров\'яна піч з димоходом',
      'Полиці у 2–3 рівні',
      'Підсвітка',
      'Декоративне панно',
    ],
    priceFrom: 140000,
  },
]
