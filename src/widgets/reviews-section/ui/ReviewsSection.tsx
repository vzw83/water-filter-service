"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/src/shared/ui/button";
import { ReviewForm, type NewReview } from "@/src/features/submit-review";
import masterPortrait from "@/src/photo/photo_2026-11-03_11-33-15.jpg";
import { deleteReview, getReviewStorageMode, getReviews, saveReview, setReviewStatus, type Review } from "./reviewsRepository";
import { VisitStats } from "./VisitStats";
import styles from "./ReviewsSection.module.css";

type ReviewsSectionProps = {
  mode?: "public" | "admin";
};

export function ReviewsSection({ mode = "public" }: ReviewsSectionProps) {
  const isAdmin = mode === "admin";
  const [reviews, setReviews] = useState<Review[]>([]);
  const localPhotoUrls = useRef(new Set<string>());
  const [expandedPhoto, setExpandedPhoto] = useState<{ url: string; alt: string } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const storageMode = getReviewStorageMode();

  const refresh = useCallback(async () => {
    try {
      const loadedReviews = await getReviews(isAdmin);
      localPhotoUrls.current.forEach((url) => URL.revokeObjectURL(url));
      localPhotoUrls.current = new Set(loadedReviews.flatMap((review) =>
        review.storage === "local" && review.photoUrl ? [review.photoUrl] : [],
      ));
      setReviews(loadedReviews);
      setStorageError(false);
    } catch {
      setStorageError(true);
    } finally {
      setLoaded(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    const refreshId = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(refreshId);
  }, [refresh]);

  useEffect(() => () => {
    localPhotoUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    if (!expandedPhoto) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setExpandedPhoto(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedPhoto]);

  async function submitReview(review: NewReview): Promise<"local" | "cloud"> {
    const mode = await saveReview(review);
    await refresh();
    return mode;
  }

  async function moderate(review: Review, status: Review["status"]) {
    await setReviewStatus(review, status);
    await refresh();
  }

  async function removeReview(review: Review) {
    await deleteReview(review);
    await refresh();
  }

  const published = useMemo(() => reviews.filter((review) => review.status === "approved"), [reviews]);
  const pending = useMemo(() => reviews.filter((review) => review.status === "pending"), [reviews]);
  const average = published.length
    ? (published.reduce((sum, review) => sum + review.rating, 0) / published.length).toFixed(1)
    : null;

  return (
    <main className={styles.page}>
      <section className={styles.profile} aria-labelledby="reviews-title">
        <div className={styles.masterPhoto}>
          <Image
            className={styles.masterPortrait}
            src={masterPortrait}
            alt="Владимир, мастер по установке и обслуживанию фильтров"
            fill
            sizes="(max-width: 650px) 220px, 220px"
            priority
          />
        </div>
        <div className={styles.profileCopy}>
          <p className={styles.eyebrow}>Лёгкая вода</p>
          <h1 className={styles.title} id="reviews-title">{isAdmin ? "Проверка отзывов" : "Отзывы клиентов"}</h1>
          <p className={styles.description}>
            {isAdmin
              ? "Здесь можно проверить новые отзывы и решить, какие из них опубликовать."
              : "Я Владимир — мастер по установке, обслуживанию и ремонту фильтров обратного осмоса. Буду благодарен, если вы поделитесь впечатлением о моей работе."}
          </p>
          {!isAdmin && <p className={styles.ratingSummary}>
              {average ? (
                <>
                  <strong className={styles.averageValue}>{average}</strong>
                  <span className={styles.averageStars} aria-label={`${average} из 10 звёзд`}>{"★".repeat(10)}</span>
                  <span className={styles.reviewCount}>{published.length} {published.length === 1 ? "отзыв" : published.length < 5 ? "отзыва" : "отзывов"}</span>
                </>
              ) : "Пока нет опубликованных оценок"}
            </p>}
        </div>
      </section>

      {isAdmin ? (
        <div className={styles.localNotice} role="note">
          {storageMode === "local"
            ? "Локальный тестовый режим: отзывы доступны только в этом браузере и на этом устройстве."
            : "Ты вошёл в режим администратора. Изменения отзывов сохраняются в общей базе сайта."}
        </div>
      ) : (
        <div className={styles.localNotice}>
          {storageMode === "local"
            ? "Тестовый режим: отзыв сохранится только в этом браузере. Для реальных отзывов подключи Supabase."
            : "Отзывы публикуются после проверки. Регистрация для отправки отзыва не нужна."}
        </div>
      )}

      {isAdmin && <VisitStats />}

      <div className={styles.content}>
        {!isAdmin && <ReviewForm onSubmit={submitReview} />}
        <section className={styles.published} aria-labelledby="published-title">
          {!isAdmin && <p className={styles.eyebrow}>Ваши впечатления помогают другим</p>}
          {isAdmin ? (
            <div className={styles.queueHeader}>
              <h2 className={styles.publishedTitle} id="published-title">Ожидают проверки ({pending.length})</h2>
              <Button variant="text" onClick={() => void refresh()}>Обновить</Button>
            </div>
          ) : (
            <h2 className={styles.publishedTitle} id="published-title">Отзывы о работе</h2>
          )}
          {storageError && <p className={styles.emptyState} role="alert">Не удалось загрузить отзывы. Проверь настройки Supabase и подключение к интернету.</p>}
          {!loaded && <p className={styles.emptyState}>Загружаем сохранённые отзывы…</p>}
          {loaded && (isAdmin ? pending.length === 0 : published.length === 0) && !storageError && (
            <p className={styles.emptyState}>{isAdmin ? "Новых отзывов на проверку нет." : "Одобренные отзывы появятся здесь."}</p>
          )}
          <div className={styles.reviewList}>
            {(isAdmin ? pending : published).map((review) => (
              <article className={styles.reviewCard} key={review.id}>
                <div className={styles.reviewHeading}>
                  <h3>{review.authorName}</h3>
                  <span className={styles.reviewStars} aria-label={`${review.rating} из 10 звёзд`}>{"★".repeat(review.rating)}{"☆".repeat(10 - review.rating)}</span>
                </div>
                <time className={styles.reviewDate} dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString("ru-RU")}</time>
                <p className={styles.reviewComment}>{review.comment}</p>
                {review.photoUrl && <button className={styles.photoButton} type="button" onClick={() => setExpandedPhoto({ url: review.photoUrl!, alt: `Фото к отзыву ${review.authorName}` })} aria-label={`Открыть фото к отзыву ${review.authorName}`}><img className={styles.reviewPhoto} src={review.photoUrl} alt={`Фото к отзыву ${review.authorName}`} /></button>}
                {isAdmin && <div className={styles.actions}>
                  <Button className={styles.reviewAction} variant="secondary" onClick={() => void moderate(review, "approved")}>Опубликовать</Button>
                  <Button className={styles.reviewAction} variant="text" onClick={() => void removeReview(review)}>Удалить</Button>
                </div>}
              </article>
            ))}
          </div>

          {isAdmin && <section className={styles.moderation} aria-labelledby="published-admin-title">
            <h2 className={styles.publishedTitle} id="published-admin-title">Опубликованные отзывы ({published.length})</h2>
            {loaded && published.length === 0 && <p className={styles.emptyState}>Пока нет опубликованных отзывов.</p>}
            <div className={styles.reviewList}>
              {published.map((review) => (
                <article className={styles.reviewCard} key={review.id}>
                  <div className={styles.reviewHeading}>
                    <h3>{review.authorName}</h3>
                    <span className={styles.reviewStars} aria-label={`${review.rating} из 10 звёзд`}>{"★".repeat(review.rating)}{"☆".repeat(10 - review.rating)}</span>
                  </div>
                  <time className={styles.reviewDate} dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString("ru-RU")}</time>
                  <p className={styles.reviewComment}>{review.comment}</p>
                  {review.photoUrl && <button className={styles.photoButton} type="button" onClick={() => setExpandedPhoto({ url: review.photoUrl!, alt: `Фото к отзыву ${review.authorName}` })} aria-label={`Открыть фото к отзыву ${review.authorName}`}><img className={styles.reviewPhoto} src={review.photoUrl} alt={`Фото к отзыву ${review.authorName}`} /></button>}
                  <Button className={styles.reviewAction} variant="text" onClick={() => void removeReview(review)}>Снять с публикации</Button>
                </article>
              ))}
            </div>
          </section>}
        </section>
      </div>
      {expandedPhoto && (
        <div className={styles.photoViewer} role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={() => setExpandedPhoto(null)}>
          <button className={styles.photoClose} type="button" aria-label="Закрыть фото" onClick={() => setExpandedPhoto(null)}>×</button>
          <img className={styles.expandedPhoto} src={expandedPhoto.url} alt={expandedPhoto.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
