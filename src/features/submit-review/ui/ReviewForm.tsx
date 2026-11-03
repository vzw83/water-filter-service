"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/src/shared/ui/button";
import styles from "./ReviewForm.module.css";

const ratings = Array.from({ length: 10 }, (_, index) => index + 1);

export type NewReview = {
  authorName: string;
  rating: number;
  comment: string;
  photo: Blob | null;
};

type ReviewFormProps = {
  onSubmit: (review: NewReview) => Promise<void>;
};

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const highlightedRating = hoveredRating || selectedRating;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("photo");
    setIsSaving(true);
    setMessage("");

    try {
      await onSubmit({
        authorName: String(data.get("authorName")).trim(),
        rating: Number(data.get("rating")),
        comment: String(data.get("comment")).trim(),
        photo: file instanceof File && file.size ? file : null,
      });
      form.reset();
      setMessage("Отзыв отправлен и ожидает проверки.");
    } catch {
      setMessage("Не удалось сохранить отзыв. Попробуй ещё раз.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="review-form-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Ваш опыт важен</p>
        <h2 className={styles.title} id="review-form-title">Оставить отзыв</h2>
        <p className={styles.intro}>
          Расскажите о работе Владимира и приложите фото результата, если хотите.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.ratingField} onMouseLeave={() => setHoveredRating(0)}>
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
                  onChange={() => setSelectedRating(rating)}
                  required
                />
                <label
                  className={`${styles.star} ${rating <= highlightedRating ? styles.starActive : ""}`}
                  htmlFor={`review-rating-${rating}`}
                  onMouseEnter={() => setHoveredRating(rating)}
                >
                  <span className={styles.visuallyHidden}>{rating} из 10 звёзд</span>
                  <span aria-hidden="true">★</span>
                </label>
              </span>
            ))}
          </div>
        </fieldset>

        <label className={styles.field}>
          Ваше имя
          <input autoComplete="name" name="authorName" placeholder="Например, Анна" maxLength={80} required />
        </label>

        <label className={styles.field}>
          Отзыв
          <textarea
            name="comment"
            placeholder="Как прошла установка или обслуживание?"
            rows={5}
            maxLength={2000}
            required
          />
        </label>

        <label className={styles.field}>
          Фото результата <span className={styles.optional}>(необязательно, до 5 МБ)</span>
          <input className={styles.fileInput} type="file" name="photo" accept="image/jpeg,image/png,image/webp" />
        </label>

        <div className={styles.submitArea}>
          <Button as="button" type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Сохраняем…" : "Отправить отзыв"}
          </Button>
          <p>Тестовые отзывы и фотографии хранятся только в этом браузере на этом компьютере.</p>
          {message && <p role="status">{message}</p>}
        </div>
      </form>
    </section>
  );
}
