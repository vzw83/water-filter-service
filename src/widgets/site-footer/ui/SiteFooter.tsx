import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>Лёгкая вода</span>
      <span>Установка, обслуживание и ремонт фильтров обратного осмоса</span>
    </footer>
  );
}
