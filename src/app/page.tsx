import {Header} from "@/src/widgets/header/ui/Header";

const services = [
  {
    number: "01",
    title: "Обслуживание фильтров",
    description:
        "Плановая замена картриджей и обслуживание систем обратного осмоса.",
  },
  {
    number: "02",
    title: "Установка фильтра",
    description:
        "Подключение фильтра под мойкой и проверка герметичности соединений.",
  },
  {
    number: "03",
    title: "Ремонт и диагностика",
    description:
        "Поиск неисправностей, устранение протечек и проверка работы системы.",
  },
];

export default function Home() {
  return (
      <main className="min-h-screen bg-white text-slate-900">
        <Header/>

        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-cyan-700">
                Обратный осмос · Фильтры для воды
              </p>

              <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Чистая вода у вас дома — без лишних хлопот
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                Установка, обслуживание и ремонт бытовых фильтров для воды
                в Москве и Московской области.
              </p>

              <a
                  href="#contacts"
                  className="mt-8 inline-flex rounded-full bg-cyan-700 px-7 py-4 font-semibold text-white transition hover:bg-cyan-800"
              >
                Обсудить обслуживание
              </a>

              <p className="mt-4 text-sm text-slate-500">
                Стоимость и сроки уточняются до начала работ.
              </p>
            </div>

            <div className="flex min-h-72 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-100 via-sky-50 to-slate-100 p-10">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                  <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-12 w-12 text-cyan-700"
                      aria-hidden="true"
                  >
                    <path
                        d="M12 3C9 7.5 5.5 11 5.5 15a6.5 6.5 0 0 0 13 0c0-4-3.5-7.5-6.5-12Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 15.5a3 3 0 0 0 3 3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-xl font-semibold">Фильтры для воды</p>
                <p className="mt-2 leading-7 text-slate-600">
                  Установка и обслуживание бытовых систем очистки
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Чем могу помочь
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Услуги по фильтрам обратного осмоса
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Помогаю поддерживать систему очистки воды в исправном состоянии.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
                <article
                    key={service.number}
                    className="rounded-2xl border border-slate-200 p-7 transition hover:border-cyan-300 hover:shadow-sm"
                >
                  <p className="text-sm font-bold text-cyan-700">
                    {service.number}
                  </p>
                  <h3 className="mt-5 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {service.description}
                  </p>
                </article>
            ))}
          </div>
        </section>

        <section id="contacts" className="bg-slate-900 text-white">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Контакты
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
              Нужно установить фильтр или провести обслуживание?
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              Свяжитесь со мной, расскажите о своей системе — обсудим задачу,
              стоимость и удобное время.
            </p>
            <p className="mt-6 text-sm text-slate-400">
              Контактные данные добавим следующим шагом.
            </p>
          </div>
        </section>

        <footer className="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-500">
          Установка и обслуживание фильтров для воды · Москва и Московская область
        </footer>
      </main>
  );
}
