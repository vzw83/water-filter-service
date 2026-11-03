"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/src/shared/lib/supabase/client";
import { Button } from "@/src/shared/ui/button";
import styles from "./AdminGate.module.css";

type AuthMode = "login" | "register";

export function AdminGate({ children }: { children: ReactNode }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setChecking(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsAdmin(false);
      setChecking(false);
      setMessage("");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session) {
      setIsAdmin(false);
      return;
    }

    let active = true;
    setChecking(true);
    void supabase.rpc("is_admin").then(({ data, error }) => {
      if (!active) return;
      setIsAdmin(!error && data === true);
      setChecking(false);
      if (error) setMessage("Не удалось проверить права администратора. Примени SQL-настройку из папки supabase.");
    });

    return () => {
      active = false;
    };
  }, [session, supabase]);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    setBusy(true);
    setMessage("");

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` },
        });
        if (error) throw error;
        setMessage(data.session
          ? "Аккаунт создан. Теперь добавь его email в список администраторов по инструкции Supabase."
          : "Аккаунт создан. Подтверди email, затем войди и назначь его администратором через SQL-инструкцию.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("Вход выполнен. Проверяем права администратора…");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось выполнить вход.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(error.message);
  }

  if (!supabase) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <h1>Админ-панель</h1>
          <p>Сначала добавь URL и публичный ключ Supabase в файл <code>.env.local</code>.</p>
          <p>Инструкция и шаблон переменных находятся в <code>SUPABASE_SETUP.md</code> и <code>.env.example</code>.</p>
        </section>
      </main>
    );
  }

  if (checking) {
    return <main className={styles.page}><p role="status">Проверяем вход…</p></main>;
  }

  if (session && isAdmin) {
    return (
      <>
        <div className={styles.signedIn}>
          <span>Вошли как {session.user.email}</span>
          <Button variant="text" onClick={() => void signOut()}>Выйти</Button>
        </div>
        {children}
      </>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="admin-auth-title">
        <p className={styles.eyebrow}>Только владелец сайта</p>
        <h1 id="admin-auth-title">{mode === "login" ? "Вход администратора" : "Создать аккаунт администратора"}</h1>
        <p>Клиентам регистрация не нужна. Новый аккаунт получит доступ к отзывам только после назначения администратором.</p>
        <form className={styles.form} onSubmit={handleAuth}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Пароль
            <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required />
          </label>
          <Button as="button" type="submit" disabled={busy}>
            {busy ? "Подожди…" : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>
        <button className={styles.modeLink} type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>
          {mode === "login" ? "Первый раз? Создать аккаунт владельца" : "Уже зарегистрирован? Войти"}
        </button>
        {message && <p className={styles.message} role="status">{message}</p>}
        {session && !isAdmin && <p className={styles.message} role="alert">Этот аккаунт ещё не назначен администратором.</p>}
      </section>
    </main>
  );
}
