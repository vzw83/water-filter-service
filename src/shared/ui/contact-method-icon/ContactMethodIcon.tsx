type ContactMethodId = "phone" | "whatsapp" | "telegram" | "max";

export function ContactMethodIcon({ method }: { method: ContactMethodId }) {
  if (method === "phone") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.5h2.5c.5 0 .9.3 1 .8l1 3.4c.1.4 0 .8-.3 1.1l-1.7 1.7a14.2 14.2 0 0 0 5.8 5.8l1.7-1.7c.3-.3.7-.4 1.1-.3l3.4 1c.5.1.8.5.8 1v2.5c0 .7-.6 1.3-1.3 1.3C11.7 20.1 3.9 12.3 3.9 4.8c0-.7.6-1.3 1.3-1.3h2Z" /></svg>;
  }

  if (method === "whatsapp") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.6 13.8L3.2 21l4.4-1.2A9 9 0 1 0 12 3Zm0 16.2a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.6.7.7-2.5-.2-.3A7.2 7.2 0 1 1 12 19.2Zm4-5.4-1.6-.8c-.2-.1-.4-.1-.5.1l-.7.8a.4.4 0 0 1-.5.1 6.4 6.4 0 0 1-2.9-2.5.4.4 0 0 1 .1-.5l.5-.6c.1-.2.2-.3.1-.5l-.7-1.7a.5.5 0 0 0-.5-.3h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.6 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.1-1.3 0-.2-.2-.3-.5-.4Z" /></svg>;
  }

  if (method === "telegram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21.7 4.2-3.3 15.5c-.2 1.1-.8 1.4-1.7.9l-4.7-3.5-2.3 2.2c-.2.2-.4.4-.8.4l.3-4.8 8.8-8c.4-.3-.1-.5-.6-.2L6.5 13.6 1.9 12.2c-1-.3-1-1 .2-1.5L20 3.8c.8-.3 1.9.2 1.7.4Z" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5h16v12H10l-6 3.5v-15.5Z" /><path d="m7.5 13 2-5 2.5 5 2.5-5 2 5" /></svg>;
}
