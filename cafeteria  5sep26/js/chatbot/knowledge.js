/**
 * AURA Café - Chatbot Knowledge Base & NLP-Lite Matching Engine
 * Diccionario de preguntas frecuentes, productos, categorías y detector semántico
 */

const ChatbotKnowledge = {
  data: null,

  async init() {
    try {
      const res = await fetch('/api/chatbot/config');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.data = json.data;
          console.log('✅ Base de conocimiento del chatbot cargada desde el servidor');
          return;
        }
      }
    } catch (e) {
      console.warn('Cargando fallback local para el chatbot...');
    }
  },

  /**
   * Normaliza texto para comparación semántica (remueve tildes, signos, mayúsculas)
   */
  normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita acentos
      .replace(/[¿?¡!.,;:()\-_"']/g, '') // quita signos de puntuación
      .trim();
  },

  /**
   * Obtiene todos los productos organizados o por categoría
   */
  getProductsByCategory(categoryId) {
    if (!this.data || !this.data.menu || !this.data.menu.products) {
      return (typeof PRODUCTS_DATA !== 'undefined') ? PRODUCTS_DATA : [];
    }
    if (!categoryId || categoryId === 'all') {
      return this.data.menu.products;
    }
    return this.data.menu.products.filter(p => p.category === categoryId);
  },

  /**
   * Encuentra un producto por su ID
   */
  getProductById(productId) {
    if (!this.data || !this.data.menu || !this.data.menu.products) return null;
    return this.data.menu.products.find(p => p.id === productId) || null;
  },

  /**
   * Obtiene las categorías disponibles
   */
  getCategories() {
    if (this.data && this.data.menu && this.data.menu.categories) {
      return this.data.menu.categories;
    }
    return [
      { id: "hot_coffee", name: "☕ Café Caliente" },
      { id: "cold_drinks", name: "🧋 Bebidas Frías" },
      { id: "tea_infusions", name: "🍵 Té e Infusiones" },
      { id: "bakery", name: "🥐 Panadería" },
      { id: "desserts", name: "🍰 Postres" },
      { id: "food", name: "🥪 Alimentos & Brunch" }
    ];
  },

  /**
   * Obtiene las promociones activas
   */
  getPromotions() {
    if (this.data && this.data.promotions) {
      return this.data.promotions.filter(p => p.active !== false);
    }
    return [];
  },

  /**
   * Analiza una consulta en lenguaje natural del cliente y determina la mejor respuesta
   * @param {string} rawInput 
   * @returns {{ type: string, payload: any }}
   */
  matchIntent(rawInput) {
    const text = this.normalizeText(rawInput);
    if (!text) return { type: 'empty' };

    // 1. Saludos
    if (/^(hola|buen dia|buenas|que tal|hello|hi|hey|buenos dias|buenas tardes)/.test(text)) {
      return { type: 'greeting' };
    }

    // 2. Pedidos / Comprar
    if (/(quiero pedir|hacer pedido|ordenar|comprar|pedir para llevar|quiero comprar|hacer una orden|delivery|takeaway)/.test(text)) {
      return { type: 'start_order' };
    }

    // 3. Recomendaciones / "¿Qué se te antoja?"
    if (/(recomienda|recomendacion|sugerencia|que me recomiendas|que pedir|se me antoja|cual es bueno)/.test(text)) {
      return { type: 'recommendations_quiz' };
    }

    // 4. Menú General
    if (/(ver menu|el menu|carta|que tienen|catalogo|muestrame el menu|productos)/.test(text)) {
      return { type: 'show_menu_categories' };
    }

    // 5. Categorías específicas
    if (/(cafe caliente|espresso|americano|latte|capuchino|cappuccino|mocha|macchiato|caliente)/.test(text) && !/frio/.test(text)) {
      return { type: 'show_category', categoryId: 'hot_coffee', title: '☕ Café Caliente de Especialidad' };
    }
    if (/(frio|fria|bebidas frias|frappe|frape|iced|cold brew|nitro|malteada|te helado)/.test(text)) {
      return { type: 'show_category', categoryId: 'cold_drinks', title: '🧋 Bebidas Frías & Cold Brew' };
    }
    if (/(te|infusion|infusiones|matcha|chai|manzanilla|te verde)/.test(text)) {
      return { type: 'show_category', categoryId: 'tea_infusions', title: '🍵 Té de Origen e Infusiones' };
    }
    if (/(pan|panaderia|croissant|pan dulce|concha|rol|galleta|cookie)/.test(text)) {
      return { type: 'show_category', categoryId: 'bakery', title: '🥐 Panadería Artesanal' };
    }
    if (/(postre|postres|pastel|cheesecake|tarta|brownie|dulce)/.test(text)) {
      return { type: 'show_category', categoryId: 'desserts', title: '🍰 Repostería & Postres de Autor' };
    }
    if (/(alimento|alimentos|comida|comer|desayuno|brunch|sandwich|panini|toast|avocado)/.test(text)) {
      return { type: 'show_category', categoryId: 'food', title: '🥪 Alimentos & Brunch' };
    }

    // 6. Precios
    if (/(precio|precios|cuanto cuesta|costo|cuanto vale|tarifa|carta de precios)/.test(text)) {
      return { type: 'show_pricing_guide' };
    }

    // 7. Horarios y días
    if (/(horario|horarios|a que hora|que hora|estan abiertos|abierto|cerrado|abren|cierran|domingo)/.test(text)) {
      return { type: 'show_schedule' };
    }

    // 8. Ubicación y mapa
    if (/(donde|ubicacion|direccion|como llegar|donde estan|queda|calle|mapa|sucursal)/.test(text)) {
      return { type: 'show_location' };
    }

    // 9. Promociones
    if (/(promocion|promociones|descuento|descuentos|combo|oferta|cupon|rebaja)/.test(text)) {
      return { type: 'show_promotions' };
    }

    // 10. Métodos de pago y facturación
    if (/(pago|pagar|metodos de pago|tarjeta|efectivo|apple pay|google pay|transferencia|factura|facturacion)/.test(text)) {
      return { type: 'show_payment_methods' };
    }

    // 11. Hablar con humano / contacto
    if (/(hablar con alguien|humano|empleado|persona|atencion|queja|llamar|barista|telefono|whatsapp)/.test(text)) {
      return { type: 'human_support' };
    }

    // 12. Búsqueda en FAQs de la base de conocimiento
    if (this.data && this.data.faq) {
      for (const item of this.data.faq) {
        const matchesKeyword = item.keywords.some(kw => text.includes(this.normalizeText(kw)));
        if (matchesKeyword) {
          return { type: 'faq_match', item };
        }
      }
    }

    // 13. Sin coincidencia directa -> Fallback
    return { type: 'unknown', originalText: rawInput };
  }
};
