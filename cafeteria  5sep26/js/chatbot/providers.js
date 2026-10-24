/**
 * AURA Café - Chatbot Architecture Providers
 * Desacoplamiento modular: RuleBasedProvider (activo), AIProvider (futuro), HumanSupportProvider
 */

/**
 * Clase Base de Proveedor de Conversación
 */
class BaseBotProvider {
  constructor(name) {
    this.name = name;
  }

  async getResponse(userInput, sessionContext) {
    throw new Error(`El método getResponse debe ser implementado por ${this.name}`);
  }
}

/**
 * 1. RuleBasedProvider (ACTIVO EN V1)
 * Opera mediante respuestas predefinidas, menús categorizados, FAQs y motor de palabras clave
 */
class RuleBasedProvider extends BaseBotProvider {
  constructor() {
    super('RuleBasedProvider');
  }

  async getResponse(userInput, sessionContext) {
    const match = ChatbotKnowledge.matchIntent(userInput);

    switch (match.type) {
      case 'greeting':
        return {
          text: "¡Hola! ☕ ¡Qué gusto saludarte! Bienvenido a AURA Specialty Coffee.\n\n¿En qué podemos ayudarte hoy? Puedes explorar nuestro menú, revisar precios, descubrir promociones o iniciar un pedido para llevar.",
          chips: [
            { label: "☕ Ver Menú", action: "cmd_menu" },
            { label: "💲 Consultar Precios", action: "cmd_prices" },
            { label: "🛵 Pedido para Llevar", action: "cmd_order" },
            { label: "📍 Ubicación & Horario", action: "cmd_location" },
            { label: "🎁 Promociones", action: "cmd_promos" }
          ]
        };

      case 'show_menu_categories':
        return this.renderMenuCategories();

      case 'show_category':
        return this.renderCategoryProducts(match.categoryId, match.title);

      case 'show_pricing_guide':
        return this.renderPricingGuide();

      case 'show_schedule':
        return this.renderSchedule();

      case 'show_location':
        return this.renderLocation();

      case 'show_promotions':
        return this.renderPromotions();

      case 'show_payment_methods':
        return this.renderPaymentMethods();

      case 'recommendations_quiz':
        return this.renderRecommendationsQuiz();

      case 'start_order':
        return {
          text: "🛵 **¡Genial! Vamos a preparar tu pedido para llevar.**\n\nElige una categoría para comenzar a agregar productos a tu comanda:",
          chips: ChatbotKnowledge.getCategories().map(cat => ({
            label: cat.name,
            action: `flow_cat_${cat.id}`
          }))
        };

      case 'human_support':
        return HumanSupportProvider.renderOptions();

      case 'faq_match':
        return {
          text: match.item.answer,
          chips: [
            { label: "☕ Ver Menú", action: "cmd_menu" },
            { label: "🛵 Hacer un Pedido", action: "cmd_order" },
            { label: "👨‍💼 Hablar con Barista", action: "cmd_human" },
            { label: "🏠 Menú Principal", action: "cmd_home" }
          ]
        };

      case 'unknown':
      default:
        return {
          text: "Disculpa, todavía no tengo una respuesta exacta para esa pregunta. 😊\n\nPuedes elegir una opción de nuestro menú guiado o contactar directamente con nuestro personal en barra:",
          chips: [
            { label: "☕ Consultar Menú", action: "cmd_menu" },
            { label: "💲 Consultar Precios", action: "cmd_prices" },
            { label: "👨‍💼 Hablar con un Empleado", action: "cmd_human" },
            { label: "🏠 Menú Principal", action: "cmd_home" }
          ]
        };
    }
  }

  renderMenuCategories() {
    const cats = ChatbotKnowledge.getCategories();
    return {
      text: "📋 **Carta Digital AURA Specialty Coffee**\n\nSelecciona una categoría para ver los productos, ingredientes y notas de cata:",
      chips: cats.map(c => ({
        label: c.name,
        action: `view_cat_${c.id}`
      })).concat([
        { label: "💲 Guía de Precios", action: "cmd_prices" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ])
    };
  }

  renderCategoryProducts(categoryId, title) {
    const prods = ChatbotKnowledge.getProductsByCategory(categoryId);
    if (prods.length === 0) {
      return {
        text: `Por el momento no tenemos productos registrados en esta sección.`,
        chips: [{ label: "⬅️ Volver a Categorías", action: "cmd_menu" }]
      };
    }

    return {
      text: `**${title || 'Productos Disponibles'}**\n\nSelecciona cualquier producto para agregarlo a tu pedido o conocer sus detalles:`,
      products: prods,
      chips: [
        { label: "⬅️ Otras Categorías", action: "cmd_menu" },
        { label: "🛒 Ver Carrito", action: "cmd_view_cart" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ]
    };
  }

  renderPricingGuide() {
    return {
      text: "💲 **Lista de Precios Oficial AURA Café**\n\n" +
        "• **Espresso Doble:** $3.60\n" +
        "• **Americano Artesanal:** $3.80\n" +
        "• **Cappuccino Italiano:** $4.50\n" +
        "• **Flat White Velvet (Más Vendido):** $4.80\n" +
        "• **Caffè Latte Clásico:** $4.70\n" +
        "• **Nitro Cold Brew Infusion:** $5.50\n" +
        "• **Iced Pistachio Latte:** $5.90\n" +
        "• **Matcha Ceremonial Uji:** $5.60\n" +
        "• **Croissant Francés de Almendras:** $4.20\n" +
        "• **Concha Artesanal:** $2.90\n" +
        "• **Cheesecake Vasco Caramelizado:** $5.40\n" +
        "• **Avocado Toast Masa Madre:** $7.80\n" +
        "• **Panini Rústico de Pavo & Pesto:** $8.20\n\n" +
        "💡 *Extra por Leche de Avena o Almendra: +$0.60*",
      chips: [
        { label: "☕ Ver Carta Completa", action: "cmd_menu" },
        { label: "🛵 Ordenar Ahora", action: "cmd_order" },
        { label: "🎁 Ver Promociones", action: "cmd_promos" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ]
    };
  }

  renderSchedule() {
    const status = ChatbotConfig.getLiveStatus();
    let text = `⏰ **Horarios de AURA Specialty Coffee**\n\n` +
      `• **Lunes a Viernes:** 7:00 AM – 9:00 PM\n` +
      `• **Sábados y Domingos:** 8:00 AM – 9:30 PM\n\n` +
      `🟢 **Estado Actual:** ${status.statusText}\n\n`;

    if (!status.isOpen) {
      text += `_${status.closedNotice}_\n`;
    } else {
      text += `_¡Nuestros baristas están activos y las máquinas a punto! Puedes visitarnos o solicitar tu pedido para recoger._\n`;
    }

    return {
      text,
      chips: [
        { label: "📍 ¿Cómo llegar? (Ubicación)", action: "cmd_location" },
        { label: "🛵 Pedir para Llevar", action: "cmd_order" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ]
    };
  }

  renderLocation() {
    return {
      text: "📍 **Ubicación AURA Specialty Coffee**\n\n" +
        "🏢 **Dirección:**\n" +
        "Av. Paseo de la Reforma 412, Cuauhtémoc, Ciudad de México (justo frente a la Glorieta de la Palma / Ahuehuete).\n\n" +
        "🚲 **Bicicletas:** Estacionamiento interno seguro.\n" +
        "🚗 **Automóviles:** Estacionamiento techado a 50m con 1h de cortesía en consumos mayores a $15.\n" +
        "🌿 **Espacio:** Terraza al aire libre, mesas con conexión eléctrica y Wi-Fi de 300 Mbps.",
      chips: [
        { label: "🗺️ Abrir en Google Maps", url: ChatbotConfig.mapsUrl },
        { label: "⏰ Consultar Horarios", action: "cmd_schedule" },
        { label: "🛵 Armar Pedido", action: "cmd_order" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ]
    };
  }

  renderPromotions() {
    const promos = ChatbotKnowledge.getPromotions();
    let text = "🎁 **Promociones Activas en AURA Café**\n\n";

    if (promos.length === 0) {
      text += "Por el momento no tenemos promociones publicadas. ¡Pero puedes consultar nuestras especialidades de la casa!";
    } else {
      promos.forEach((p, idx) => {
        text += `**${p.title}**\n${p.desc}\n_${p.validity}_\n\n`;
      });
    }

    return {
      text,
      chips: [
        { label: "🛵 Aprovechar y Pedir", action: "cmd_order" },
        { label: "☕ Ver Menú", action: "cmd_menu" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ]
    };
  }

  renderPaymentMethods() {
    return {
      text: "💳 **Métodos de Pago Habilitados**\n\n" +
        "• **Efectivo:** Moneda nacional en barra.\n" +
        "• **Tarjetas de Débito y Crédito:** Visa, Mastercard y American Express con terminal sin contacto.\n" +
        "• **Google Pay & Apple Pay:** Pago instantáneo desde tu celular o reloj inteligente.\n" +
        "• **Transferencias SPEI:** Para pedidos anticipados o eventos.\n\n" +
        "🧾 **Facturación CFDI:** Puedes solicitar tu factura electrónica enviando tu ticket a facturacion@aura.cafe o directo por WhatsApp.",
      chips: [
        { label: "🛵 Iniciar Pedido", action: "cmd_order" },
        { label: "👨‍💼 Contactar por Factura", action: "cmd_human" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ]
    };
  }

  renderRecommendationsQuiz() {
    return {
      text: "🍰 **¿Qué se te antoja disfrutar hoy?**\n\nCuéntanos tu preferencia para sugerirte la bebida o postre perfecto:",
      chips: [
        { label: "🔥 Algo caliente y reconfortante", action: "quiz_hot" },
        { label: "❄️ Algo frío y refrescante", action: "quiz_cold" },
        { label: "🍫 Algo dulce / Postre", action: "quiz_sweet" },
        { label: "🥑 Para desayunar / Brunch", action: "quiz_breakfast" },
        { label: "🍵 Algo sin café / Té", action: "quiz_no_coffee" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ]
    };
  }
}

/**
 * 2. AIProvider (STUB PREPARADO PARA FUTURA INTEGRACIÓN DE IA EN V2)
 * Diseñado para conectarse con OpenAI / Gemini / Claude a través del backend sin exponer API Keys en el cliente
 */
class AIProvider extends BaseBotProvider {
  constructor() {
    super('AIProvider');
    this.endpoint = '/api/chatbot/ai-query'; // Endpoint futuro del backend seguro
    this.enabled = false; // Desactivado en v1 según requerimiento explícito
  }

  async getResponse(userInput, sessionContext) {
    if (!this.enabled) {
      console.warn('AIProvider invocado pero actualmente inactivo en v1. Delegando a RuleBasedProvider.');
      return null;
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userInput,
          context: sessionContext,
          cafeConfig: ChatbotConfig
        })
      });

      if (!response.ok) throw new Error('Error al conectar con el backend de IA');
      return await response.json();
    } catch (err) {
      console.error('Fallo en AIProvider:', err);
      // Fallback transparente a RuleBasedProvider si el servicio de IA falla
      return null;
    }
  }
}

/**
 * 3. HumanSupportProvider (ATENCIÓN HUMANA & CONTACTO)
 */
const HumanSupportProvider = {
  renderOptions() {
    const status = ChatbotConfig.getLiveStatus();

    let text = "👨‍💼 **Atención del Personal AURA**\n\n";
    if (status.isOpen) {
      text += "Nuestros baristas y encargados están en el local listos para atenderte.";
    } else {
      text += "En este momento estamos fuera de horario presencial, pero puedes enviarnos un mensaje y te responderemos a primera hora al abrir.";
    }

    return {
      text,
      chips: [
        { label: "💬 Enviar WhatsApp Directo", url: `https://wa.me/${ChatbotConfig.whatsappNumber}?text=${encodeURIComponent('Hola equipo AURA, tengo una consulta:')}` },
        { label: "📞 Llamar al Local", url: `tel:${ChatbotConfig.phoneDisplay.replace(/[^0-9+]/g, '')}` },
        { label: "📝 Dejar Mensaje en el Chat", action: "cmd_contact_form" },
        { label: "🏠 Menú Principal", action: "cmd_home" }
      ]
    };
  },

  async submitContactMessage(payload) {
    try {
      const res = await fetch('/api/chatbot/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (e) {
      console.error('Error enviando mensaje:', e);
      return { success: false, message: 'No se pudo enviar el mensaje. Intenta por WhatsApp.' };
    }
  }
};
