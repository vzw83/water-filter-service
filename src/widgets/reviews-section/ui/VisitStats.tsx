"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/src/shared/lib/supabase/client";
import styles from "./VisitStats.module.css";

type Period = "day" | "week" | "month" | "year";
type VisitBucket = { bucket_start: string; visits: number };

const periodLabels: Record<Period, string> = {
  day: "По дням",
  week: "По неделям",
  month: "По месяцам",
  year: "По годам",
};

function bucketCount(period: Period) {
  if (period === "day") return 14;
  if (period === "year") return 5;
  return 12;
}

function formatBucket(value: string, period: Period) {
  const date = new Date(value);
  if (period === "day") return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit" }).format(date);
  if (period === "week") return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(date);
  if (period === "month") return new Intl.DateTimeFormat("ru-RU", { month: "short", year: "2-digit" }).format(date);
  return new Intl.DateTimeFormat("ru-RU", { year: "numeric" }).format(date);
}

export function VisitStats() {
  const [period, setPeriod] = useState<Period>("day");
  const [buckets, setBuckets] = useState<VisitBucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      setError(true);
      return;
    }

    let active = true;
    setLoading(true);
    void supabase.rpc("admin_visit_stats", {
      p_period: period,
      p_bucket_count: bucketCount(period),
    }).then(({ data, error: requestError }) => {
      if (!active) return;
      setBuckets((data ?? []) as VisitBucket[]);
      setError(Boolean(requestError));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [period]);

  const total = buckets.reduce((sum, bucket) => sum + Number(bucket.visits), 0);
  const maximum = Math.max(1, ...buckets.map((bucket) => Number(bucket.visits)));

  return (
    <section className={styles.section} aria-labelledby="visit-stats-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Аналитика сайта</p>
          <h2 id="visit-stats-title">Посещения</h2>
        </div>
        <label className={styles.periodControl}>
          Период
          <select value={period} onChange={(event) => setPeriod(event.target.value as Period)}>
            {Object.entries(periodLabels).map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className={styles.message} role="alert">Не удалось загрузить статистику. Проверь, что применена миграция для учёта посещений.</p>}
      {loading ? <p className={styles.message}>Загружаем статистику…</p> : !error && (
        <>
          <p className={styles.total}><strong>{total}</strong> визитов за выбранный период</p>
          <div className={styles.chart} role="list" aria-label={`${periodLabels[period]}, ${total} визитов`}>
            {buckets.map((bucket) => {
              const visits = Number(bucket.visits);
              const height = visits === 0 ? 2 : Math.max(6, (visits / maximum) * 100);
              const label = formatBucket(bucket.bucket_start, period);
              return (
                <div className={styles.column} role="listitem" key={bucket.bucket_start} aria-label={`${label}: ${visits} визитов`}>
                  <span className={styles.value}>{visits || ""}</span>
                  <div className={styles.barArea}>
                    <span className={styles.bar} style={{ height: `${height}%` }} />
                  </div>
                  <span className={styles.label}>{label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
      <p className={styles.footnote}>Один визит учитывается один раз за вкладку браузера. IP-адреса не сохраняются.</p>
    </section>
  );
}
