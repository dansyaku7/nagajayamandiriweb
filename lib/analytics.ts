type GtagFunction = (...args: unknown[]) => void;

export const trackWhatsAppClick = (source: string) => {
  if (typeof window !== "undefined") {
    const win = window as unknown as { gtag?: GtagFunction };
    if (typeof win.gtag === "function") {
      win.gtag("event", "generate_lead", {
        event_category: "contact",
        event_label: source,
        transport_type: "beacon",
      });
    }
  }
};
