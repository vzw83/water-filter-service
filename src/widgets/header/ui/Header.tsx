import { Button } from "@/src/shared/ui/button";
import { CONTACT_PHONE } from "@/src/shared/lib/contactLinks";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Button as="link" href="/#top" variant="brand" className={styles.logo} aria-label="Лёгкая вода — на главную">
            Лёгкая вода<span className={styles.logoAccent}>.</span>
          </Button>
          <Button
            as="link"
            href={`tel:${CONTACT_PHONE}`}
            variant="primary"
            className={styles.contactButton}
            aria-label="Связаться с Владимиром"
            title="Связаться с Владимиром"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.contactIcon}>
              <path d="M7.2 3.5h2.5c.5 0 .9.3 1 .8l1 3.4c.1.4 0 .8-.3 1.1l-1.7 1.7a14.2 14.2 0 0 0 5.8 5.8l1.7-1.7c.3-.3.7-.4 1.1-.3l3.4 1c.5.1.8.5.8 1v2.5c0 .7-.6 1.3-1.3 1.3C11.7 20.1 3.9 12.3 3.9 4.8c0-.7.6-1.3 1.3-1.3h2Z" />
            </svg>
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
          <Button as="link" href="/articles" variant="nav" className={styles.navLink}>
            Статьи
          </Button>
          <Button as="link" href="/#contacts" variant="nav" className={styles.navLink}>Контакты</Button>
        </nav>
      </div>
    </header>
  );
};
