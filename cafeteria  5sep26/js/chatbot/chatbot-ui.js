/**
 * AURA Café - Chatbot UI Controller
 * Renderizado de ventana, burbujas, botones interactivos, pedidos y animaciones
 */

const ChatbotUI = {
  isOpen: false,
  isMinimized: false,
  provider: new RuleBasedProvider(), // Proveedor activo en v1
  isTyping: false,

  // Inicialización
  async init() {
    await ChatbotKnowledge.init();
    this.createDOM();
    this.bindEvents();
    this.updateLiveHeaderStatus();
    this.showWelcomeMessage();

    // Actualizar estado de horario cada 60 segundos
    setInterval(() => this.updateLiveHeaderStatus(), 60000);
  },

  createDOM() {
    // Si ya existe, no duplicar
    if (document.getElementById('cb-root')) return;

    const root = document.createElement('div');
    root.id = 'cb-root';
    root.innerHTML = `
      <!-- Launcher flotante -->
      <div class="cb-launcher-container" id="cb-launcher-container">
        <div class="cb-teaser-badge" id="cb-teaser-badge">
          <span>¡Hola! ☕ ¿Te ayudamos con tu pedido?</span>
          <i class="ph ph-chat-circle-dots text-base"></i>
        </div>
        <button class="cb-launcher-btn" id="cb-launcher-btn" aria-label="Abrir Asistente Virtual">
          <i class="ph-fill ph-coffee" id="cb-launcher-icon"></i>
          <span class="cb-online-badge"></span>
        </button>
      </div>

      <!-- Ventana del Chatbot -->
      <div class="cb-window" id="cb-window" role="dialog" aria-label="Chatbot AURA Café">
        <!-- Cabecera -->
        <header class="cb-header">
          <div class="cb-header-brand">
            <div class="cb-header-avatar">
              <i class="ph-bold ph-coffee"></i>
            </div>
            <div class="cb-header-info">
              <span class="cb-header-title">
                AURA Barista
                <span class="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">Virtual</span>
              </span>
              <span class="cb-header-status cb-status-open" id="cb-header-status">
                <span class="cb-status-dot"></span>
                <span id="cb-status-label">Abierto ahora</span>
              </span>
            </div>
          </div>

          <div class="cb-header-actions">
            <button class="cb-action-btn" id="cb-btn-restart" title="Reiniciar Conversación">
              <i class="ph ph-arrow-counter-clockwise"></i>
            </button>
            <button class="cb-action-btn" id="cb-btn-minimize" title="Minimizar">
              <i class="ph ph-minus"></i>
            </button>
            <button class="cb-action-btn" id="cb-btn-close" title="Cerrar">
              <i class="ph ph-x"></i>
            </button>
          </div>
        </header>

        <!-- Historial de Mensajes -->
        <div class="cb-messages-area" id="cb-messages-area">
          <!-- Inyectado dinámicamente -->
        </div>

        <!-- Barra de Atajos Rápidos (Dock) -->
        <div class="cb-quick-bar" id="cb-quick-bar">
          <button class="cb-quick-pill" data-action="cmd_menu">☕ Ver Menú</button>
          <button class="cb-quick-pill" data-action="cmd_prices">💲 Precios</button>
          <button class="cb-quick-pill" data-action="cmd_order">🛵 Pedido Express</button>
          <button class="cb-quick-pill" data-action="cmd_promos">🎁 Promos</button>
          <button class="cb-quick-pill" data-action="cmd_location">📍 Ubicación</button>
          <button class="cb-quick-pill" data-action="cmd_human">👨‍💼 Barista</button>
        </div>

        <!-- Entrada de Texto -->
        <footer class="cb-input-area">
          <button class="cb-home-btn" id="cb-btn-home" title="Ir al Menú Principal">
            <i class="ph ph-house"></i>
          </button>
          <input 
            type="text" 
            id="cb-input" 
            class="cb-input-field" 
            placeholder="Escribe tu pregunta o 'menú'..." 
            autocomplete="off"
          />
          <button class="cb-send-btn" id="cb-btn-send" aria-label="Enviar Mensaje">
            <i class="ph-bold ph-paper-plane-right"></i>
          </button>
        </footer>
      </div>
    `;

    document.body.appendChild(root);
  },

  bindEvents() {
    const launcherBtn = document.getElementById('cb-launcher-btn');
    const teaserBadge = document.getElementById('cb-teaser-badge');
    const closeBtn = document.getElementById('cb-btn-close');
    const minBtn = document.getElementById('cb-btn-minimize');
    const restartBtn = document.getElementById('cb-btn-restart');
    const homeBtn = document.getElementById('cb-btn-home');
    const sendBtn = document.getElementById('cb-btn-send');
    const input = document.getElementById('cb-input');
    const quickBar = document.getElementById('cb-quick-bar');

    if (launcherBtn) launcherBtn.addEventListener('click', () => this.toggleWindow());
    if (teaserBadge) teaserBadge.addEventListener('click', () => this.openWindow());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeWindow());
    if (minBtn) minBtn.addEventListener('click', () => this.toggleMinimize());
    if (restartBtn) restartBtn.addEventListener('click', () => this.restartConversation());
    if (homeBtn) homeBtn.addEventListener('click', () => this.showWelcomeMessage());

    if (sendBtn) sendBtn.addEventListener('click', () => this.handleUserSubmit());
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleUserSubmit();
        }
      });
    }

    if (quickBar) {
      quickBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.cb-quick-pill');
        if (btn) {
          const action = btn.getAttribute('data-action');
          this.handleAction(action, btn.textContent.trim());
        }
      });
    }
  },

  updateLiveHeaderStatus() {
    const statusEl = document.getElementById('cb-header-status');
    const labelEl = document.getElementById('cb-status-label');
    if (!statusEl || !labelEl) return;

    const status = ChatbotConfig.getLiveStatus();
    if (status.isOpen) {
      statusEl.className = 'cb-header-status cb-status-open';
      labelEl.textContent = 'Abierto ahora';
    } else {
      statusEl.className = 'cb-header-status cb-status-closed';
      labelEl.textContent = 'Fuera de horario';
    }
  },

  toggleWindow() {
    if (this.isOpen) {
      this.closeWindow();
    } else {
      this.openWindow();
    }
  },

  openWindow() {
    const win = document.getElementById('cb-window');
    const icon = document.getElementById('cb-launcher-icon');
    const teaser = document.getElementById('cb-teaser-badge');
    if (!win) return;

    win.classList.add('cb-open');
    this.isOpen = true;
    if (icon) icon.className = 'ph-bold ph-x';
    if (teaser) teaser.style.display = 'none';

    setTimeout(() => {
      const input = document.getElementById('cb-input');
      if (input && window.innerWidth > 640) input.focus();
      this.scrollToBottom();
    }, 150);
  },

  closeWindow() {
    const win = document.getElementById('cb-window');
    const icon = document.getElementById('cb-launcher-icon');
    if (!win) return;

    win.classList.remove('cb-open');
    this.isOpen = false;
    if (icon) icon.className = 'ph-fill ph-coffee';
  },

  toggleMinimize() {
    const win = document.getElementById('cb-window');
    const minBtn = document.getElementById('cb-btn-minimize');
    if (!win) return;

    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      win.classList.add('cb-minimized');
      if (minBtn) minBtn.innerHTML = '<i class="ph ph-plus"></i>';
    } else {
      win.classList.remove('cb-minimized');
      if (minBtn) minBtn.innerHTML = '<i class="ph ph-minus"></i>';
      this.scrollToBottom();
    }
  },

  restartConversation() {
    const area = document.getElementById('cb-messages-area');
    if (area) area.innerHTML = '';
    ChatbotOrderFlow.resetFlow();
    this.showWelcomeMessage();
  },

  // ================= RENDERIZADO DE MENSAJES =================

  showWelcomeMessage() {
    const welcomeText = 
      "¡Hola! ☕ ¡Bienvenido a nuestra cafetería!\n\n" +
      "Estamos aquí para ayudarte. Puedes consultar nuestro menú, conocer nuestros precios, resolver tus dudas o descubrir nuestras especialidades.\n\n" +
      "¿Qué te gustaría hacer hoy?";

    const welcomeChips = [
      { label: "☕ Ver menú", action: "cmd_menu" },
      { label: "💲 Consultar precios", action: "cmd_prices" },
      { label: "🥐 Panadería y postres", action: "cmd_bakery" },
      { label: "🧋 Bebidas frías", action: "cmd_cold" },
      { label: "🍰 Recomendaciones", action: "cmd_recommendations" },
      { label: "🛵 Pedidos para llevar", action: "cmd_order" },
      { label: "📍 Ubicación y horarios", action: "cmd_location_schedule" },
      { label: "🎁 Promociones", action: "cmd_promos" },
      { label: "💳 Métodos de pago", action: "cmd_payments" },
      { label: "👨‍💼 Hablar con un empleado", action: "cmd_human" },
      { label: "❓ Otras preguntas", action: "cmd_faq_menu" }
    ];

    this.addBotMessage({
      text: welcomeText,
      chips: welcomeChips
    });
  },

  addUserMessage(text) {
    const area = document.getElementById('cb-messages-area');
    if (!area) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgGroup = document.createElement('div');
    msgGroup.className = 'cb-msg-group cb-msg-user';
    msgGroup.innerHTML = `
      <div class="cb-bubble">${this.escapeHTML(text)}</div>
      <span class="cb-msg-time">${timeStr}</span>
    `;

    area.appendChild(msgGroup);
    this.scrollToBottom();
  },

  addBotMessage(data, withTyping = true) {
    const area = document.getElementById('cb-messages-area');
    if (!area) return;

    if (withTyping) {
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.renderBotMessageDOM(data);
        this.playNotificationSound();
      }, 500);
    } else {
      this.renderBotMessageDOM(data);
    }
  },

  renderBotMessageDOM(data) {
    const area = document.getElementById('cb-messages-area');
    if (!area) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgGroup = document.createElement('div');
    msgGroup.className = 'cb-msg-group cb-msg-bot';

    // Procesar texto Markdown básico
    const formattedText = this.formatMarkdown(data.text || '');

    let html = `<div class="cb-bubble">${formattedText}`;

    // Renderizar tarjetas de producto si están presentes
    if (data.products && Array.isArray(data.products)) {
      html += `<div class="space-y-2 mt-2">`;
      data.products.forEach(p => {
        html += `
          <div class="cb-product-card">
            <img src="${p.image}" alt="${this.escapeHTML(p.name)}" class="cb-product-img" loading="lazy">
            <div class="cb-product-body">
              <div class="flex justify-between items-start">
                <span class="cb-product-title">${this.escapeHTML(p.name)}</span>
                <span class="cb-product-price">$${p.price.toFixed(2)}</span>
              </div>
              <p class="cb-product-desc">${this.escapeHTML(p.description)}</p>
              <div class="cb-product-meta">
                ${p.prepTime ? `<span class="cb-meta-tag"><i class="ph ph-clock"></i> ${p.prepTime}</span>` : ''}
                ${p.allergens ? `<span class="cb-meta-tag"><i class="ph ph-shield-warning"></i> ${p.allergens}</span>` : ''}
              </div>
              <div class="cb-product-actions">
                <button 
                  class="cb-chip-btn cb-chip-primary w-full justify-center !py-2" 
                  onclick="ChatbotUI.handleAction('order_prod_${p.id}', 'Agregar ${this.escapeHTML(p.name)}')"
                >
                  <i class="ph-bold ph-plus"></i>
                  <span>Agregar a mi pedido ($${p.price.toFixed(2)})</span>
                </button>
              </div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    // Renderizar botones chips interactivos
    if (data.chips && Array.isArray(data.chips) && data.chips.length > 0) {
      html += `<div class="cb-chips-grid">`;
      data.chips.forEach(chip => {
        if (chip.url) {
          html += `
            <a href="${chip.url}" target="_blank" rel="noopener noreferrer" class="cb-chip-btn">
              <span>${this.escapeHTML(chip.label)}</span>
              <i class="ph ph-arrow-square-out text-xs"></i>
            </a>
          `;
        } else {
          html += `
            <button 
              type="button" 
              class="cb-chip-btn" 
              onclick="ChatbotUI.handleAction('${chip.action}', '${this.escapeHTML(chip.label)}')"
            >
              <span>${this.escapeHTML(chip.label)}</span>
            </button>
          `;
        }
      });
      html += `</div>`;
    }

    html += `</div><span class="cb-msg-time">${timeStr}</span>`;
    msgGroup.innerHTML = html;

    area.appendChild(msgGroup);
    this.scrollToBottom();
  },

  showTypingIndicator() {
    if (this.isTyping) return;
    this.isTyping = true;

    const area = document.getElementById('cb-messages-area');
    if (!area) return;

    const indicator = document.createElement('div');
    indicator.id = 'cb-typing-indicator';
    indicator.className = 'cb-typing-indicator';
    indicator.innerHTML = `
      <span class="cb-typing-dot"></span>
      <span class="cb-typing-dot"></span>
      <span class="cb-typing-dot"></span>
    `;

    area.appendChild(indicator);
    this.scrollToBottom();
  },

  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = document.getElementById('cb-typing-indicator');
    if (indicator) indicator.remove();
  },

  scrollToBottom() {
    const area = document.getElementById('cb-messages-area');
    if (area) {
      area.scrollTop = area.scrollHeight;
    }
  },

  // ================= MANEJO DE ENTRADAS Y ACCIONES =================

  async handleUserSubmit() {
    const input = document.getElementById('cb-input');
    if (!input) return;

    const raw = input.value.trim();
    if (!raw) return;

    input.value = '';
    this.addUserMessage(raw);

    // Obtener respuesta del proveedor de IA o Reglas
    const response = await this.provider.getResponse(raw, {
      cart: ChatbotOrderFlow.cart
    });

    if (response) {
      this.addBotMessage(response);
    }
  },

  async handleAction(actionKey, displayLabel) {
    if (displayLabel) {
      this.addUserMessage(displayLabel);
    }

    // 1. Acciones Principales del Menú de Bienvenida
    if (actionKey === 'cmd_menu') {
      const resp = this.provider.renderMenuCategories();
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_prices') {
      const resp = this.provider.renderPricingGuide();
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_bakery') {
      const resp = this.provider.renderCategoryProducts('bakery', '🥐 Panadería Artesanal');
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_cold') {
      const resp = this.provider.renderCategoryProducts('cold_drinks', '🧋 Bebidas Frías & Cold Brew');
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_recommendations') {
      const resp = this.provider.renderRecommendationsQuiz();
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_order') {
      this.addBotMessage({
        text: "🛵 **Pedidos para Llevar AURA Express**\n\nElige una categoría para seleccionar los productos que deseas ordenar:",
        chips: ChatbotKnowledge.getCategories().map(c => ({
          label: c.name,
          action: `flow_cat_${c.id}`
        })).concat([
          { label: "🛒 Ver mi Carrito Actual", action: "cmd_view_cart" },
          { label: "🏠 Menú Principal", action: "cmd_home" }
        ])
      });
      return;
    }

    if (actionKey === 'cmd_location_schedule') {
      const loc = this.provider.renderLocation();
      const sched = this.provider.renderSchedule();
      this.addBotMessage({
        text: `${sched.text}\n━━━━━━━━━━━━━━━━━━━━━\n${loc.text}`,
        chips: [
          { label: "🗺️ Abrir en Google Maps", url: ChatbotConfig.mapsUrl },
          { label: "🛵 Pedir para Llevar", action: "cmd_order" },
          { label: "🏠 Menú Principal", action: "cmd_home" }
        ]
      });
      return;
    }

    if (actionKey === 'cmd_schedule') {
      const resp = this.provider.renderSchedule();
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_location') {
      const resp = this.provider.renderLocation();
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_promos') {
      const resp = this.provider.renderPromotions();
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_payments') {
      const resp = this.provider.renderPaymentMethods();
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_human') {
      const resp = HumanSupportProvider.renderOptions();
      this.addBotMessage(resp);
      return;
    }

    if (actionKey === 'cmd_faq_menu') {
      this.addBotMessage({
        text: "❓ **Preguntas Frecuentes y Dudas Habituales**\n\nSelecciona el tema sobre el que deseas consultar:",
        chips: [
          { label: "📶 Wi-Fi y enchufes para trabajar", action: "faq_query_wifi" },
          { label: "🐾 ¿Aceptan mascotas? (Pet Friendly)", action: "faq_query_mascotas" },
          { label: "🥛 Leches vegetales y sin lactosa", action: "faq_query_leches" },
          { label: "🌿 Café descafeinado y sin azúcar", action: "faq_query_salud" },
          { label: "🚗 Estacionamiento y bicicletas", action: "faq_query_parking" },
          { label: "⭐ ¿Cuál es su café más vendido?", action: "faq_query_estrella" },
          { label: "🏠 Menú Principal", action: "cmd_home" }
        ]
      });
      return;
    }

    if (actionKey.startsWith('faq_query_')) {
      const key = actionKey.replace('faq_query_', '');
      const map = {
        'wifi': 'tienen wifi',
        'mascotas': 'aceptan perros',
        'leches': 'leche de avena',
        'salud': 'cafe descafeinado',
        'parking': 'estacionamiento',
        'estrella': 'mas vendido'
      };
      const query = map[key] || 'preguntas';
      const response = await this.provider.getResponse(query, {});
      this.addBotMessage(response);
      return;
    }

    if (actionKey === 'cmd_home') {
      this.showWelcomeMessage();
      return;
    }

    // 2. Navegación de Categorías del Menú
    if (actionKey.startsWith('view_cat_')) {
      const catId = actionKey.replace('view_cat_', '');
      const cat = ChatbotKnowledge.getCategories().find(c => c.id === catId);
      const resp = this.provider.renderCategoryProducts(catId, cat ? cat.name : 'Categoría');
      this.addBotMessage(resp);
      return;
    }

    // 3. Flujo de Pedidos Guiado (Paso a Paso)
    if (actionKey.startsWith('flow_cat_')) {
      const catId = actionKey.replace('flow_cat_', '');
      const cat = ChatbotKnowledge.getCategories().find(c => c.id === catId);
      const prods = ChatbotKnowledge.getProductsByCategory(catId);

      this.addBotMessage({
        text: `Elige el producto de **${cat ? cat.name : 'esta sección'}** que deseas ordenar:`,
        chips: prods.map(p => ({
          label: `${p.name} ($${p.price.toFixed(2)})`,
          action: `order_prod_${p.id}`
        })).concat([
          { label: "⬅️ Cambiar Categoría", action: "cmd_order" },
          { label: "🛒 Ver Carrito", action: "cmd_view_cart" }
        ])
      });
      return;
    }

    // Seleccionar producto en el pedido
    if (actionKey.startsWith('order_prod_')) {
      const prodId = actionKey.replace('order_prod_', '');
      const prod = ChatbotKnowledge.getProductById(prodId);
      if (!prod) return;

      ChatbotOrderFlow.startNewProduct(prod);

      // Si tiene tamaños, preguntar tamaño
      if (prod.sizes && prod.sizes.length > 1) {
        this.addBotMessage({
          text: `🥤 Has seleccionado **${prod.name}**.\n\nPor favor, elige el tamaño:`,
          chips: prod.sizes.map(s => {
            const sName = (typeof s === 'object') ? s.name : s;
            return {
              label: sName,
              action: `order_set_size_${encodeURIComponent(sName)}`
            };
          })
        });
        return;
      }

      // Si no tiene tamaños pero sí opciones de leche
      if (prod.milks && prod.milks.length > 0) {
        this.askMilkChoice(prod);
        return;
      }

      // De lo contrario confirmar al carrito
      this.finishProductAddition();
      return;
    }

    // Configurar Tamaño
    if (actionKey.startsWith('order_set_size_')) {
      const sizeName = decodeURIComponent(actionKey.replace('order_set_size_', ''));
      ChatbotOrderFlow.setSize(sizeName);

      const prod = ChatbotKnowledge.getProductById(ChatbotOrderFlow.activeDraft.productId);
      if (prod && prod.milks && prod.milks.length > 0) {
        this.askMilkChoice(prod);
      } else {
        this.finishProductAddition();
      }
      return;
    }

    // Configurar Leche
    if (actionKey.startsWith('order_set_milk_')) {
      const milkName = decodeURIComponent(actionKey.replace('order_set_milk_', ''));
      ChatbotOrderFlow.setMilk(milkName);
      this.finishProductAddition();
      return;
    }

    // Ver Carrito
    if (actionKey === 'cmd_view_cart') {
      this.renderCartSummary();
      return;
    }

    // Vaciar Carrito
    if (actionKey === 'cmd_clear_cart') {
      ChatbotOrderFlow.clearCart();
      this.addBotMessage({
        text: "🗑️ Se ha vaciado tu carrito de compras.",
        chips: [
          { label: "🛵 Agregar Nuevos Productos", action: "cmd_order" },
          { label: "🏠 Menú Principal", action: "cmd_home" }
        ]
      });
      return;
    }

    // Finalizar Pedido por WhatsApp
    if (actionKey.startsWith('checkout_mode_')) {
      const mode = actionKey.replace('checkout_mode_', '');
      ChatbotOrderFlow.deliveryMode = mode;

      const waMsg = ChatbotOrderFlow.generateWhatsAppOrderMessage('Cliente AURA', mode);
      const waUrl = `https://wa.me/${ChatbotConfig.whatsappNumber}?text=${waMsg}`;

      this.addBotMessage({
        text: "✅ **¡Tu pedido ha sido armado y formateado con éxito!**\n\n" +
          "Para solicitar confirmación al personal del local, haz clic en el siguiente botón. Se abrirá WhatsApp con el resumen listo para enviar:",
        chips: [
          { label: "💬 Enviar Pedido a WhatsApp", url: waUrl },
          { label: "💳 Pagar en Línea con Tarjeta / Google Pay", action: "cmd_open_web_cart" },
          { label: "🏠 Menú Principal", action: "cmd_home" }
        ]
      });
      return;
    }

    if (actionKey === 'cmd_open_web_cart') {
      this.closeWindow();
      if (typeof openCartDrawer === 'function') {
        openCartDrawer();
      }
      return;
    }

    // Cuestionario de Recomendaciones
    if (actionKey.startsWith('quiz_')) {
      const quizKey = actionKey.replace('quiz_', '');
      const quizItem = ChatbotKnowledge.data?.recommendations?.quiz?.find(q => q.id === quizKey);
      if (quizItem) {
        const prods = (quizItem.productIds || []).map(id => ChatbotKnowledge.getProductById(id)).filter(Boolean);
        this.addBotMessage({
          text: `✨ **Nuestra Sugerencia para ti:**\n\n${quizItem.text}`,
          products: prods,
          chips: [
            { label: "🔄 Probar Otra Recomendación", action: "cmd_recommendations" },
            { label: "🛵 Ordenar Ahora", action: "cmd_order" },
            { label: "🏠 Menú Principal", action: "cmd_home" }
          ]
        });
      }
      return;
    }

    // Formulario de Contacto Humano
    if (actionKey === 'cmd_contact_form') {
      this.renderContactForm();
      return;
    }
  },

  askMilkChoice(prod) {
    this.addBotMessage({
      text: `🥛 **¿Qué tipo de leche o preparación prefieres para tu ${prod.name}?**`,
      chips: prod.milks.map(m => ({
        label: m,
        action: `order_set_milk_${encodeURIComponent(m)}`
      }))
    });
  },

  finishProductAddition() {
    const item = ChatbotOrderFlow.confirmDraftToCart();
    if (!item) return;

    const totals = ChatbotOrderFlow.calculateTotals();

    this.addBotMessage({
      text: `✅ **¡${item.name} agregado al carrito!**\n\n` +
        `• Cantidad: 1\n` +
        (item.size ? `• Tamaño: ${item.size}\n` : '') +
        (item.milk ? `• Opción: ${item.milk}\n` : '') +
        `• Subtotal Carrito (${totals.itemCount} productos): **$${totals.total}**`,
      chips: [
        { label: "➕ Agregar Otro Producto", action: "cmd_order" },
        { label: "🛒 Ver Resumen y Finalizar", action: "cmd_view_cart" },
        { label: "💬 Enviar Pedido a WhatsApp Directo", action: "checkout_mode_pickup" }
      ]
    });
  },

  renderCartSummary() {
    if (ChatbotOrderFlow.cart.length === 0) {
      this.addBotMessage({
        text: "🛒 **Tu carrito está vacío.**\n\nExplora nuestro menú para agregar tu café de especialidad o pan recién horneado:",
        chips: [
          { label: "☕ Explorar Menú", action: "cmd_menu" },
          { label: "🛵 Armar Pedido", action: "cmd_order" },
          { label: "🏠 Menú Principal", action: "cmd_home" }
        ]
      });
      return;
    }

    const totals = ChatbotOrderFlow.calculateTotals();

    let text = `🛒 **Resumen de tu Pedido (${totals.itemCount} items)**\n\n`;
    ChatbotOrderFlow.cart.forEach((it, i) => {
      text += `${i + 1}. **${it.quantity}x ${it.name}** - $${(it.unitPrice * it.quantity).toFixed(2)}\n`;
      if (it.size) text += `   _${it.size}_\n`;
      if (it.milk) text += `   _${it.milk}_\n`;
    });

    text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Subtotal: **$${totals.subtotal}**\n`;
    if (parseFloat(totals.discount) > 0) {
      text += `Descuento (AURA15): **-$${totals.discount}**\n`;
    }
    text += `Total Estimado: **$${totals.total}**\n\n`;
    text += `¿Cómo prefieres recibir tu orden?`;

    this.addBotMessage({
      text,
      chips: [
        { label: "🛍️ Para Llevar (Pick-up en Barra 10 min)", action: "checkout_mode_pickup" },
        { label: "☕ Consumo en Mesa / Local", action: "checkout_mode_table" },
        { label: "➕ Agregar Más Productos", action: "cmd_order" },
        { label: "🗑️ Vaciar Carrito", action: "cmd_clear_cart" }
      ]
    });
  },

  renderContactForm() {
    const formId = `cb-form-${Date.now()}`;
    const area = document.getElementById('cb-messages-area');
    if (!area) return;

    const msgGroup = document.createElement('div');
    msgGroup.className = 'cb-msg-group cb-msg-bot';
    msgGroup.innerHTML = `
      <div class="cb-bubble">
        <p class="font-bold mb-2">📝 Déjanos un mensaje y te contactaremos:</p>
        <form id="${formId}" class="space-y-2 text-xs">
          <input type="text" name="name" required placeholder="Tu Nombre" class="w-full bg-[#141416] border border-white/15 rounded-lg px-2.5 py-1.5 text-white">
          <input type="text" name="contact" required placeholder="Teléfono o WhatsApp" class="w-full bg-[#141416] border border-white/15 rounded-lg px-2.5 py-1.5 text-white">
          <textarea name="message" required rows="2" placeholder="¿En qué te podemos ayudar?" class="w-full bg-[#141416] border border-white/15 rounded-lg px-2.5 py-1.5 text-white resize-none"></textarea>
          <button type="submit" class="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-lg transition-colors">
            Enviar Mensaje
          </button>
        </form>
      </div>
    `;

    area.appendChild(msgGroup);
    this.scrollToBottom();

    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        const formData = new FormData(form);
        const res = await HumanSupportProvider.submitContactMessage({
          name: formData.get('name'),
          contact: formData.get('contact'),
          message: formData.get('message')
        });

        form.innerHTML = `
          <div class="text-emerald-400 font-semibold p-2 bg-emerald-500/10 rounded-lg">
            ✓ ${res.message || 'Mensaje enviado. Nuestro personal te responderá a la brevedad.'}
          </div>
        `;
        ChatbotUI.addBotMessage({
          text: "¿Hay algo más en lo que podamos asistirte hoy?",
          chips: [
            { label: "☕ Ver Menú", action: "cmd_menu" },
            { label: "🏠 Menú Principal", action: "cmd_home" }
          ]
        }, false);
      });
    }
  },

  // ================= UTILIDADES DE FORMATO =================

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  },

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  playNotificationSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      // Audio autoplay restrictions or unsupported
    }
  }
};

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  ChatbotUI.init();
});
