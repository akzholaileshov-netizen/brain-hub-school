/**
 * Brain Hub тарифтері (лендинг «Бағалар» панелі).
 *
 * >>> НАҚТЫ БАҒАНЫ ОСЫ ЖЕРДЕ ӨЗГЕРТІҢІЗ <<<
 * >>> CHANGE REAL PRICES HERE BEFORE PUBLISH <<<
 *
 * Төмендегі `priceLabel` мәндері — үлгі (placeholder). Нақты тарифтер
 * бекітілгенше экранда «Баға байланыс арқылы нақтыланады» ескертуі тұрады.
 */

export type PricingPlan = {
  id: string;
  nameKk: string;
  nameRu: string;
  blurbKk: string;
  blurbRu: string;
  featuresKk: string[];
  featuresRu: string[];
  /** Placeholder display string, e.g. "₸ 45 000 / ай" — not a verified real price. */
  priceLabel: string;
  highlight?: boolean;
};

export const PRICING_META = {
  titleKk: "Бағалар",
  titleRu: "Цены",
  subtitleKk:
    "Brain Hub бағыттарына сай тариф үлгілері. Баға байланыс арқылы нақтыланады.",
  subtitleRu:
    "Примерные тарифы по направлениям Brain Hub. Итоговая цена уточняется при связи.",
  disclaimerKk:
    "Баға байланыс арқылы нақтыланады. Төмендегі сомалар — үлгі (placeholder), нақты тариф емес.",
  disclaimerRu:
    "Цена уточняется при связи. Суммы ниже — примеры (placeholder), а не утверждённый тариф.",
  ctaKk: "Тіркелу",
  ctaRu: "Зарегистрироваться",
  perMonthHintKk: "ай сайынғы үлгі",
  perMonthHintRu: "примерная помесячная сумма",
} as const;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "core-track",
    nameKk: "Негізгі бағыт",
    nameRu: "Базовое направление",
    blurbKk:
      "Бір бейіндік пән бойынша топтық сабақтар және апталық прогресс қадағалау.",
    blurbRu:
      "Групповые занятия по одному профильному предмету и еженедельный контроль прогресса.",
    featuresKk: [
      "Аптасына 3 онлайн-сабақ",
      "Үй жұмысы және кері байланыс",
      "Прогресс картасы",
    ],
    featuresRu: [
      "3 онлайн-занятия в неделю",
      "Домашние задания и обратная связь",
      "Карта прогресса",
    ],
    // PLACEHOLDER — нақты бағаны осы жерде өзгертіңіз
    priceLabel: "₸ 45 000 / ай",
  },
  {
    id: "subject-group",
    nameKk: "Бейіндік топ",
    nameRu: "Профильная группа",
    blurbKk:
      "Инфо-Мат, Био-Хим, Физ-Мат, Гео-Мат немесе Құқық — бір пәндік топ + ментор сағаттары.",
    blurbRu:
      "Инфо-Мат, Био-Хим, Физ-Мат, Гео-Мат или Право — профильная группа + часы с ментором.",
    featuresKk: [
      "Таңдалған бағыт бойынша тереңдетілген бағдарлама",
      "Ай сайынғы mock / бақылау",
      "Жеке ментормен 2 сессия / ай",
    ],
    featuresRu: [
      "Углублённая программа по выбранному направлению",
      "Ежемесячный mock / контроль",
      "2 сессии с ментором в месяц",
    ],
    // PLACEHOLDER — нақты бағаны осы жерде өзгертіңіз
    priceLabel: "₸ 55 000 / ай",
    highlight: true,
  },
  {
    id: "vip-ielts",
    nameKk: "VIP IELTS",
    nameRu: "VIP IELTS",
    blurbKk:
      "IELTS 7.5+ мақсатына арналған жекеленген трек: Writing/Speaking кері байланысы.",
    blurbRu:
      "Индивидуальный трек к IELTS 7.5+: обратная связь по Writing/Speaking.",
    featuresKk: [
      "Жеке оқу жоспары",
      "Апталық Writing / Speaking тексеру",
      "Толық mock-тесттер",
    ],
    featuresRu: [
      "Индивидуальный учебный план",
      "Еженедельная проверка Writing / Speaking",
      "Полные mock-тесты",
    ],
    // PLACEHOLDER — нақты бағаны осы жерде өзгертіңіз
    priceLabel: "₸ 75 000 / ай",
  },
  {
    id: "combo",
    nameKk: "Бейін + IELTS",
    nameRu: "Профиль + IELTS",
    blurbKk:
      "Бейіндік пән мен IELTS дайындығын бір пакетте — грантқа кешенді дайындық.",
    blurbRu:
      "Профильный предмет и IELTS в одном пакете — комплексная подготовка к гранту.",
    featuresKk: [
      "Бейіндік топ + IELTS модульдері",
      "Кураторлық қолдау",
      "Құжат / грант кеңесі (үлгі)",
    ],
    featuresRu: [
      "Профильная группа + модули IELTS",
      "Кураторская поддержка",
      "Консультация по документам / гранту (пример)",
    ],
    // PLACEHOLDER — нақты бағаны осы жерде өзгертіңіз
    priceLabel: "₸ 95 000 / ай",
  },
];
