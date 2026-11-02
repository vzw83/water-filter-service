import { ServiceCard, services } from "@/src/entities/service";
import styles from "./ServicesSection.module.css";

export function ServicesSection() {
  return (
    <section className={styles.section} id="services" aria-labelledby="services-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Чем помогу</p>
        <h2 className={styles.title} id="services-title">
          Фильтр работает как надо — о воде можно не беспокоиться
        </h2>
        <p className={styles.description}>
          Можно установить новую систему или обратиться, если фильтр уже стоит и требует внимания.
        </p>
      </div>

      <div className={styles.grid}>
        {services.map((service) => (
          <ServiceCard key={service.number} service={service} />
        ))}
      </div>
    </section>
  );
}
