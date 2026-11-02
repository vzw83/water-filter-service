import { Button } from "@/src/shared/ui/button";
import styles from "./ReviewForm.module.css";

const ratings = [5, 4, 3, 2, 1];

export function ReviewForm() {
  return (
    <section className={styles.section} aria-labelledby="review-form-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Ваш опыт важен</p>
        <h2 className={styles.title} id="review-form-title">Оставить отзыв</h2>
        <p className={styles.intro}>
          Расскажите о работе Владимира и приложите фото результата, если хотите.
        </p>
      </div>

      <form className={styles.form}>
        <fieldset className={styles.ratingField}>
          <legend>Ваша оценка</legend>
          <div className={styles.rating}>
            {ratings.map((rating) => (
              <span className={styles.ratingOption} key={rating}>
                <input
                  className={styles.ratingInput}
                  id={`review-rating-${rating}`}
                  name="rating"
                  type="radio"
                  value={rating}
                  required
                />
                <label className={styles.star} htmlFor={`review-rating-${rating}`}>
                  <span className={styles.visuallyHidden}>{rating} из 5 звёзд</span>
                  <span aria-hidden="true">★</span>
                </label>
              </span>
            ))}
          </div>
        </fieldset>

        <label className={styles.field}>
          Ваше имя
          <input autoComplete="name" name="authorName" placeholder="Например, Анна" required />
        </label>

        <label className={styles.field}>
          Отзыв
          <textarea
            name="comment"
            placeholder="Как прошла установка или обслуживание?"
            rows={5}
            required
          />
        </label>

        <label className={styles.field}>
          Фото результата <span className={styles.optional}>(необязательно)</span>
          <input className={styles.fileInput} type="file" name="photo" accept="image/*" />
        </label>

        <div className={styles.submitArea}>
          <Button as="button" type="submit" variant="primary" disabled>
            Отправить отзыв
          </Button>
          <p>Отправку и публикацию отзывов подключим вместе с серверной частью сайта.</p>
        </div>
      </form>
    </section>
  );
}
