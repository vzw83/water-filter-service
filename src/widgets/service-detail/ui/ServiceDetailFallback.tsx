import styles from "./ServiceDetail.module.css";

export function ServiceDetailFallback() {
  return (
    <main className={styles.page}>
      <section className={styles.detail}>
        <p className={styles.loading} role="status">Загружаем страницу услуги…</p>
      </section>
    </main>
  );
}
