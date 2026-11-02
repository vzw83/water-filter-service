import { Button } from "@/src/shared/ui/button";
import styles from "./HomeHero.module.css";

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.content}>
        <p className={styles.eyebrow}>Фильтры обратного осмоса · Москва и область</p>
        <h1 className={styles.title} id="hero-title">
          Чистая вода дома — <span>без лишних хлопот</span>
        </h1>
        <p className={styles.description}>
          Я Владимир. Подберу и установлю систему, проверю ваш фильтр,
          помогу с обслуживанием и ремонтом.
        </p>
        <Button as="link" variant="primary" className={styles.heroAction} href="/#contacts">
          Обсудить задачу <span aria-hidden="true">↗</span>
        </Button>
        <p className={styles.note}>
          Работаю по Москве и Московской области, чаще — на севере и северо-западе. Другие районы Москвы и Московской области уточняю)) и приезжаю
        </p>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.waterOrb}>
          <span className={styles.orbDrop}>вода</span>
          <span className={styles.orbCaption}>дома и под контролем</span>
        </div>
        <span className={styles.visualLabel}>ЛЁГКАЯ ВОДА</span>
      </div>
    </section>
  );
}
