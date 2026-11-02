import { Button } from "@/src/shared/ui/button";
import type { Service } from "@/src/entities/service";
import styles from "./ServiceDetail.module.css";

type ServiceDetailProps = {
  service: Service;
};

export function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <main className={styles.page}>
      <section className={styles.detail} aria-labelledby="service-title">
        <Button as="link" variant="text" className={styles.backAction} href="/#services">
          <span aria-hidden="true">←</span> Все услуги
        </Button>
        <p className={styles.eyebrow}>Услуги · Фильтры обратного осмоса</p>
        <h1 className={styles.title} id="service-title">{service.title}</h1>
        <p className={styles.description}>{service.description}</p>

        <div className={styles.contentGrid}>
          <section className={styles.included} aria-labelledby="included-title">
            <h2 className={styles.subtitle} id="included-title">Что входит</h2>
            <ul className={styles.list}>
              {service.details.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          {service.price && (
            <aside className={styles.price} aria-label="Стоимость услуги">
              <span className={styles.priceLabel}>Стоимость</span>
              <strong>{service.price}</strong>
            </aside>
          )}
        </div>

        <div className={styles.contact}>
          <div>
            <h2 className={styles.contactTitle}>Хотите обсудить эту услугу?</h2>
            <p className={styles.contactText}>Свяжитесь с Владимиром удобным способом.</p>
          </div>
          <Button as="link" variant="primary" href="/#contacts">Связаться</Button>
        </div>
      </section>
    </main>
  );
}
