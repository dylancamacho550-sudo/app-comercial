/**
 * AURA Café - Chatbot Config & Schedule Engine
 * Control de horarios en tiempo real y configuración centralizada
 */

const ChatbotConfig = {
  cafeName: "AURA Specialty Coffee",
  whatsappNumber: "5215500000000",
  phoneDisplay: "+52 (55) 8900-2872",
  address: "Av. Paseo de la Reforma 412, Cuauhtémoc, CDMX",
  mapsUrl: "https://maps.google.com/?q=Paseo+de+la+Reforma+412+CDMX",

  // Horarios de servicio
  hours: {
    weekdays: { open: "07:00", close: "21:00", text: "Lunes a Viernes: 7:00 AM – 9:00 PM" },
    weekend: { open: "08:00", close: "21:30", text: "Sábados y Domingos: 8:00 AM – 9:30 PM" }
  },

  /**
   * Determina si el establecimiento está abierto en este momento
   * @returns {{ isOpen: boolean, statusText: string, detailText: string }}
   */
  getLiveStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const isWeekend = (day === 0 || day === 6);
    const schedule = isWeekend ? this.hours.weekend : this.hours.weekdays;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = schedule.open.split(':').map(Number);
    const [closeH, closeM] = schedule.close.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const isOpen = (currentMinutes >= openMinutes && currentMinutes < closeMinutes);

    return {
      isOpen,
      statusText: isOpen ? "Abierto ahora" : "Fuera de horario",
      scheduleText: schedule.text,
      closedNotice: "¡Gracias por contactarnos! ☕ En este momento estamos fuera de nuestro horario de atención. Puedes consultar el menú y dejar preparado tu pedido para solicitar confirmación cuando volvamos a atenderte."
    };
  }
};
