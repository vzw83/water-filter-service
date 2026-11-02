import type { Metadata } from "next";
import { Header } from "@/src/widgets/header";
import { SiteFooter } from "@/src/widgets/site-footer";
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
        <Header />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
