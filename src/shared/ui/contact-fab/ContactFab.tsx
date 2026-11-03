"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_METHODS } from "@/src/shared/lib/contactLinks";
import { ContactMethodIcon } from "@/src/shared/ui/contact-method-icon/ContactMethodIcon";
import styles from "./ContactFab.module.css";

export function ContactFab() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div className={styles.widget} ref={containerRef}>
      {isOpen && (
        <nav className={styles.menu} id="floating-contact-menu" aria-label="Способы связи">
          <p className={styles.menuTitle}>Связаться с Владимиром</p>
          {CONTACT_METHODS.map((method) => (
            <a
              className={styles.contactLink}
              href={method.href}
              key={method.id}
              target={method.id === "phone" ? undefined : "_blank"}
              rel={method.id === "phone" ? undefined : "noreferrer"}
            >
              <ContactMethodIcon method={method.id} />
              <span className={styles.contactCopy}>
                <span>{method.label}</span>
                {"hint" in method && <span className={styles.contactHint}>{method.hint}</span>}
              </span>
            </a>
          ))}
        </nav>
      )}

      <button
        className={styles.toggle}
        type="button"
        aria-label={isOpen ? "Закрыть способы связи" : "Показать способы связи"}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "floating-contact-menu" : undefined}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.4-.8L4 20l1.4-4.1a7.5 7.5 0 1 1 14.6-4.4Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></svg>
        )}
      </button>
    </div>
  );
}
