const REVIEWS = [
  {
    name: "Аружан Қ.",
    result: "IELTS 7.5 · Nazarbayev University гранты",
    quote:
      "Жеке ментор апта сайын жазу бөлімін тексерді. Екі айда Writing 5.5-тен 7.0-ге көтерілді.",
  },
  {
    name: "Дастан М.",
    result: "Инфо-Мат · ҰБТ 135 балл",
    quote:
      "Интерактивті сабақтар мен прогресс картасы әлсіз тақырыптарымды анық көрсетті. Грантқа түстім.",
  },
  {
    name: "Мәдина С.",
    result: "Био-Хим · Медицина гранты",
    quote:
      "Химия мен биологияны бір жүйеде өткенің пайдасы зор болды. Түсініксіз жерлерді дереу пысықтадық.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="reviews" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--teal-deep)] sm:text-4xl">
            Түлектер пікірі
          </h2>
          <p className="mt-3 text-base text-[var(--ink-soft)] sm:text-lg">
            Нақты баллдар, гранттар және оқушылардың өз сөздері.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <blockquote key={review.name} className="border-t-2 border-[var(--coral)] pt-5">
              <p className="text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
                “{review.quote}”
              </p>
              <footer className="mt-5">
                <p className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--ink)]">
                  {review.name}
                </p>
                <p className="mt-1 text-sm text-[var(--teal-mid)]">
                  {review.result}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
