import { Button } from "@/src/shared/ui/button";
import { services } from "@/src/entities/service";
import styles from "./PriceList.module.css";

export function PriceList() {
  return (
    <main className={styles.page}>
      <section className={styles.intro} aria-labelledby="price-title">
        <p className={styles.eyebrow}>Лёгкая вода · услуги</p>
        <h1 className={styles.title} id="price-title">Прайс услуг</h1>
        <p className={styles.description}>
          Подробности по каждой услуге и её стоимость. Актуальные цены добавим перед запуском сайта.
        </p>
      </section>

      <div className={styles.list}>
        {services.map((service) => (
          <article className={styles.item} key={service.slug}>
            <div className={styles.itemCopy}>
              <h2 className={styles.itemTitle}>{service.title}</h2>
              <p className={styles.itemDescription}>{service.description}</p>
              <Button as="link" href={`/services/${service.slug}`} variant="text">
                Подробнее <span aria-hidden="true">→</span>
              </Button>
            </div>
            <p className={styles.price}>
              {service.price ?? "Цена будет добавлена перед запуском"}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
