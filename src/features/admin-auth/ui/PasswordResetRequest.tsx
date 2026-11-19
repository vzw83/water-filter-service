"use client";

import { useState, type FormEvent } from "react";
import { getSupabaseClient } from "@/src/shared/lib/supabase/client";
import { Button } from "@/src/shared/ui/button";
import styles from "./AdminGate.module.css";

export function PasswordResetRequest() {
  const supabase = getSupabaseClient();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setMessage("Сброс пароля сейчас недоступен: Supabase не настроен.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    setBusy(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reviews/admin/update-password`,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setSent(true);
      setMessage("Если для этого адреса есть аккаунт, Supabase отправит письмо со ссылкой для сброса пароля.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось отправить письмо. Попробуй ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="password-reset-title">
        <p className={styles.eyebrow}>Вход администратора</p>
        <h1 id="password-reset-title">Восстановление пароля</h1>
        <p>Укажи email, с которым регистрировался. Мы отправим ссылку для создания нового пароля.</p>
        {!sent && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <Button as="button" type="submit" disabled={busy}>
              {busy ? "Отправляем…" : "Отправить ссылку"}
            </Button>
          </form>
        )}
        {message && <p className={styles.message} role="status">{message}</p>}
        <Button as="link" href="/reviews/admin" variant="text" className={styles.modeLink}>
          Вернуться ко входу
        </Button>
      </section>
    </main>
  );
}
