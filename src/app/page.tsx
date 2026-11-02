import { ContactSection } from "@/src/widgets/contact-section";
import { HomeHero } from "@/src/widgets/home-hero";
import { ServicesSection } from "@/src/widgets/services";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page} id="top">
      <HomeHero />
      <ServicesSection />
      <ContactSection />
    </main>
  );
}
