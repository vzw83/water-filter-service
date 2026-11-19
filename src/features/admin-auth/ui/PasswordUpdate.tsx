"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSupabaseClient } from "@/src/shared/lib/supabase/client";
import { Button } from "@/src/shared/ui/button";
import styles from "./AdminGate.module.css";

export function PasswordUpdate() {
  const supabase = getSupabaseClient();
  const [checking, setChecking] = useState(Boolean(supabase));
  const [hasSession, setHasSession] = useState(false);
  const [busy, setBusy] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session) setHasSession(true);
      setChecking(false);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setHasSession(Boolean(data.session));
      setChecking(false);
      if (error) setMessage("Не удалось проверить ссылку. Запроси письмо для сброса ещё раз.");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !hasSession) return;

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirmation = String(form.get("confirmation"));
    if (password !== confirmation) {
      setMessage("Пароли не совпадают.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage(error.message);
        return;
      }
      setUpdated(true);
      setMessage("Пароль изменён. Теперь можно открыть админку.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось изменить пароль. Запроси новую ссылку.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="password-update-title">
        <p className={styles.eyebrow}>Вход администратора</p>
        <h1 id="password-update-title">Новый пароль</h1>
        {!supabase ? (
          <p className={styles.message} role="alert">Сброс пароля сейчас недоступен: Supabase не настроен.</p>
        ) : checking ? (
          <p className={styles.message} role="status">Проверяем ссылку…</p>
        ) : !hasSession ? (
          <>
            <p className={styles.message} role="alert">
              Ссылка недействительна или истекла. Запроси новую и открой её на этом устройстве.
            </p>
            <Button as="link" href="/reviews/admin/reset-password" variant="text" className={styles.modeLink}>
              Запросить новую ссылку
            </Button>
          </>
        ) : updated ? (
          <>
            <p className={styles.message} role="status">{message}</p>
            <Button as="link" href="/reviews/admin" className={styles.modeLink}>
              Перейти в админку
            </Button>
          </>
        ) : (
          <>
            <p>Придумай новый пароль длиной не менее 8 символов.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                Новый пароль
                <input name="password" type="password" autoComplete="new-password" minLength={8} required />
              </label>
              <label>
                Повтори пароль
                <input name="confirmation" type="password" autoComplete="new-password" minLength={8} required />
              </label>
              <Button as="button" type="submit" disabled={busy}>
                {busy ? "Сохраняем…" : "Сохранить пароль"}
              </Button>
            </form>
            {message && <p className={styles.message} role="alert">{message}</p>}
          </>
        )}
      </section>
    </main>
  );
}
