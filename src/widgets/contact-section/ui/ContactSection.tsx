import styles from "./ContactSection.module.css";
import { CONTACT_METHODS } from "@/src/shared/lib/contactLinks";
import { ContactMethodIcon } from "@/src/shared/ui/contact-method-icon/ContactMethodIcon";

export function ContactSection() {
  return (
    <section className={styles.section} id="contacts" aria-labelledby="contact-title">
      <div>
        <p className={styles.eyebrow}>Связаться с Владимиром</p>
        <h2 className={styles.title} id="contact-title">
          Расскажите, что случилось с фильтром
        </h2>
        <p className={styles.description}>
          Позвоните или напишите — вместе разберёмся, что нужно сделать.
        </p>
      </div>
      <div className={styles.channels} aria-label="Способы связи">
        {CONTACT_METHODS.map((method) => (
          <a
            href={method.href}
            key={method.id}
            target={method.id === "phone" ? undefined : "_blank"}
            rel={method.id === "phone" ? undefined : "noreferrer"}
          >
            <ContactMethodIcon method={method.id} />
            <span className={styles.linkCopy}>
              <span>{method.label}</span>
              {"hint" in method && <span className={styles.linkHint}>{method.hint}</span>}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
