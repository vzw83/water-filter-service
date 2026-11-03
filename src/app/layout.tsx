import type { Metadata } from "next";
import { Header } from "@/src/widgets/header";
import { SiteFooter } from "@/src/widgets/site-footer";
import { VisitTracker } from "@/src/shared/ui/visit-tracker/VisitTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Лёгкая вода — фильтры обратного осмоса",
  description:
    "Владимир: продажа и установка систем обратного осмоса, обслуживание и ремонт фильтров в Москве и Московской области.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>
        <VisitTracker />
        <Header />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
