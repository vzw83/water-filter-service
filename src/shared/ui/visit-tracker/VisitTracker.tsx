"use client";

import { useEffect } from "react";
import { getSupabaseClient } from "@/src/shared/lib/supabase/client";

const SESSION_KEY = "light-water-visit-session";

export function VisitTracker() {
  useEffect(() => {
    if (window.location.pathname.includes("/reviews/admin")) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    let sessionId: string;
    try {
      const existingSessionId = window.sessionStorage.getItem(SESSION_KEY);
      if (existingSessionId) return;

      sessionId = window.crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, sessionId);
    } catch {
      return;
    }

    void supabase.from("site_visits").insert({ session_id: sessionId }).then(({ error }) => {
      if (error && error.code !== "23505") {
        clearSessionMarker(sessionId);
      }
    }).catch(() => {
      clearSessionMarker(sessionId);
    });
  }, []);

  return null;
}

function clearSessionMarker(sessionId: string) {
  try {
    if (window.sessionStorage.getItem(SESSION_KEY) === sessionId) {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Storage can be disabled by the browser; visit tracking is best-effort.
  }
}
