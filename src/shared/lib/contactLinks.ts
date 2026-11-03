export const CONTACT_PHONE = "+79690373788";

export const CONTACT_METHODS = [
  { id: "phone", label: "Позвонить", href: `tel:${CONTACT_PHONE}` },
  { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/${CONTACT_PHONE.slice(1)}`, external: true },
  { id: "telegram", label: "Telegram", href: `https://t.me/+${CONTACT_PHONE.slice(1)}`, external: true },
  { id: "max", label: "MAX", hint: `Найти по номеру ${CONTACT_PHONE}`, href: "https://max.ru/", external: true },
] as const;
