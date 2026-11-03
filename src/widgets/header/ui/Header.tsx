import { Button } from "@/src/shared/ui/button";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Button as="link" href="/#top" variant="brand" className={styles.logo} aria-label="Лёгкая вода — на главную">
            Лёгкая вода<span className={styles.logoAccent}>.</span>
          </Button>
          <Button as="link" href="/#contacts" variant="primary" className={styles.contactButton}>
            Связаться
          </Button>
        </div>

        <nav className={styles.navigation} aria-label="Основная навигация">
          <Button as="link" href="/#services" variant="nav" className={styles.navLink}>Услуги</Button>
          <Button as="link" href="/prices" variant="nav" className={`${styles.navLink} ${styles.pricesLink}`}>
            Прайс
          </Button>
          <Button as="link" href="/reviews" variant="nav" className={`${styles.navLink} ${styles.reviewsLink}`}>
            Отзывы
          </Button>
          <Button as="link" href="/#contacts" variant="nav" className={styles.navLink}>Контакты</Button>
        </nav>
      </div>
    </header>
  );
};
