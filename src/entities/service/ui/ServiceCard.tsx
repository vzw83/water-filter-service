import { Button } from "@/src/shared/ui/button";
import type { Service } from "../model/services";
import styles from "./ServiceCard.module.css";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Button as="link" href={`/services/${service.slug}`} variant="card">
      <span className={styles.number}>{service.number}</span>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.description}>{service.description}</p>
      <span className={styles.link}>
        Подробнее <span aria-hidden="true">→</span>
      </span>
    </Button>
  );
}
