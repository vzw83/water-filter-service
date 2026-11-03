import styles from "./page.module.css";

export const metadata = {
  title: "Статьи о ремонте фильтров — Лёгкая вода",
  description:
    "Справочная информация по ремонту, обслуживанию и выбору фильтров для воды.",
};

export default function ArticlesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.intro} aria-labelledby="articles-title">
        <p className={styles.eyebrow}>Лёгкая вода · справочная информация</p>
        <h1 className={styles.title} id="articles-title">
          Статьи о фильтрах для воды
        </h1>
        <p className={styles.description}>
          Практические советы по ремонту и обслуживанию фильтров, подбору
          комплектующих и качеству воды.
        </p>
      </section>

      <section className={styles.emptyState} aria-label="Статьи скоро появятся">
        <span className={styles.icon} aria-hidden="true">✎</span>
        <h2 className={styles.emptyTitle}>Материалы готовятся</h2>
        <p className={styles.emptyDescription}>
          Скоро здесь появятся полезные статьи и ответы на частые вопросы о
          ремонте фильтров.
        </p>
      </section>
    </main>
  );
}
