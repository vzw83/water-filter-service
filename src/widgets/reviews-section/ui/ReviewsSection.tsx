import { ReviewForm } from "@/src/features/submit-review";
import styles from "./ReviewsSection.module.css";

export function ReviewsSection() {
  return (
    <main className={styles.page}>
      <section className={styles.profile} aria-labelledby="reviews-title">
        <div className={styles.masterPhoto} role="img" aria-label="Место для фотографии Владимира">
          <span aria-hidden="true">В</span>
        </div>
        <div className={styles.profileCopy}>
          <p className={styles.eyebrow}>Лёгкая вода</p>
          <h1 className={styles.title} id="reviews-title">Отзывы клиентов</h1>
          <p className={styles.description}>
            Я Владимир — мастер по установке, обслуживанию и ремонту фильтров обратного осмоса.
            Буду благодарен, если вы поделитесь впечатлением о моей работе.
          </p>
          <p className={styles.ratingSummary}>Пока нет опубликованных оценок</p>
        </div>
      </section>

      <div className={styles.content}>
        <ReviewForm />
        <section className={styles.published} aria-labelledby="published-title">
          <p className={styles.eyebrow}>Ваши впечатления помогают другим</p>
          <h2 className={styles.publishedTitle} id="published-title">Отзывы о работе</h2>
          <p className={styles.emptyState}>
            Здесь появятся отзывы клиентов и фотографии результатов работ.
          </p>
        </section>
      </div>
    </main>
  );
}
