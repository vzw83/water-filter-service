import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/src/entities/service";
import { ServiceDetail, ServiceDetailFallback } from "@/src/widgets/service-detail";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Услуги — Лёгкая вода",
  description: "Подробности об установке, обслуживании и ремонте фильтров обратного осмоса.",
};

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export default function ServicePage({ params }: ServicePageProps) {
  return (
    <Suspense fallback={<ServiceDetailFallback />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

async function ServiceContent({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}
