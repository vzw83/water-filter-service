import styles from "./ContactSection.module.css";

const contactChannels = ["Звонок", "WhatsApp", "Telegram", "MAX"];

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
        {contactChannels.map((channel) => <span key={channel}>{channel}</span>)}
        <p>Контактные ссылки добавим перед запуском сайта.</p>
      </div>
    </section>
  );
}
