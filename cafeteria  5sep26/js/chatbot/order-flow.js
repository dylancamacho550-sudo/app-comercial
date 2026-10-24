/**
 * AURA Café - Chatbot Interactive Order Flow Engine
 * Máquina de estados para armado de pedidos guiados dentro del chat
 */

const ChatbotOrderFlow = {
  // Estado actual del flujo de pedido
  cart: [],
  activeDraft: null, // Producto en proceso de personalización
  deliveryMode: 'pickup', // 'pickup' o 'table'
  customerName: '',

  resetFlow() {
    this.activeDraft = null;
  },

  clearCart() {
    this.cart = [];
    this.activeDraft = null;
  },

  startNewProduct(product) {
    this.activeDraft = {
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      selectedSize: (product.sizes && product.sizes.length > 0) ? product.sizes[0] : null,
      selectedMilk: (product.milks && product.milks.length > 0) ? product.milks[0] : null,
      quantity: 1,
      image: product.image,
      extraPrice: 0
    };
  },

  setSize(sizeName) {
    if (!this.activeDraft) return;
    const prod = ChatbotKnowledge.getProductById(this.activeDraft.productId);
    if (!prod || !prod.sizes) return;

    const foundSize = prod.sizes.find(s => s.name === sizeName || s === sizeName);
    if (foundSize) {
      this.activeDraft.selectedSize = (typeof foundSize === 'object') ? foundSize.name : foundSize;
      this.activeDraft.extraPrice = (typeof foundSize === 'object' && foundSize.extra) ? foundSize.extra : 0;
    }
  },

  setMilk(milkName) {
    if (!this.activeDraft) return;
    this.activeDraft.selectedMilk = milkName;
  },

  setQuantity(qty) {
    if (!this.activeDraft) return;
    this.activeDraft.quantity = Math.max(1, parseInt(qty, 10) || 1);
  },

  confirmDraftToCart() {
    if (!this.activeDraft) return null;

    const unitPrice = this.activeDraft.basePrice + (this.activeDraft.extraPrice || 0);
    const cartItem = {
      cartItemId: `cb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      id: this.activeDraft.productId,
      name: this.activeDraft.name,
      unitPrice: unitPrice,
      quantity: this.activeDraft.quantity,
      size: this.activeDraft.selectedSize || null,
      milk: this.activeDraft.selectedMilk || null,
      image: this.activeDraft.image
    };

    this.cart.push(cartItem);
    this.activeDraft = null;

    // Sincronizar opcionalmente con el carrito principal de la web si existe
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.cart)) {
      AppState.cart.push(cartItem);
      if (typeof saveCart === 'function') saveCart();
      if (typeof updateCartUI === 'function') updateCartUI();
    }

    return cartItem;
  },

  removeItem(cartItemId) {
    this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.cart)) {
      AppState.cart = AppState.cart.filter(item => item.cartItemId !== cartItemId);
      if (typeof saveCart === 'function') saveCart();
      if (typeof updateCartUI === 'function') updateCartUI();
    }
  },

  updateQuantity(cartItemId, delta) {
    const item = this.cart.find(it => it.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(cartItemId);
    } else {
      if (typeof AppState !== 'undefined' && Array.isArray(AppState.cart)) {
        const mainIt = AppState.cart.find(it => it.cartItemId === cartItemId);
        if (mainIt) mainIt.quantity = item.quantity;
        if (typeof saveCart === 'function') saveCart();
        if (typeof updateCartUI === 'function') updateCartUI();
      }
    }
  },

  calculateTotals() {
    const subtotal = this.cart.reduce((sum, it) => sum + (it.unitPrice * it.quantity), 0);
    // Aplicar descuento AURA15 si está activo
    const discount = (subtotal > 0 && typeof AppState !== 'undefined' && AppState.appliedCoupon === 'AURA15') 
      ? (subtotal * 0.15) 
      : 0;
    const total = Math.max(0, subtotal - discount);

    return {
      itemCount: this.cart.reduce((sum, it) => sum + it.quantity, 0),
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    };
  },

  generateWhatsAppOrderMessage(clientName, mode = 'pickup') {
    const totals = this.calculateTotals();
    const guest = clientName || this.customerName || 'Cliente AURA';
    const modeLabel = (mode === 'pickup') 
      ? '🛍️ Para Llevar (Pick-up en Barra - 10 min)' 
      : '☕ Consumo en Mesa / Local';

    let msg = `✨ *NUEVO PEDIDO DESDE CHATBOT - AURA Specialty Coffee*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Cliente:* ${guest}\n`;
    msg += `📍 *Modalidad:* ${modeLabel}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `📋 *DETALLE DEL PEDIDO:*\n`;

    this.cart.forEach((it, idx) => {
      msg += `\n${idx + 1}. *${it.quantity}x ${it.name}* - $${(it.unitPrice * it.quantity).toFixed(2)}\n`;
      if (it.size) msg += `   • Tamaño: ${it.size}\n`;
      if (it.milk) msg += `   • Opción: ${it.milk}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Subtotal: $${totals.subtotal}\n`;
    if (parseFloat(totals.discount) > 0) {
      msg += `Descuento (AURA15): -$${totals.discount}\n`;
    }
    msg += `*TOTAL A CONFIRMAR:* $${totals.total}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `☕ _Hola equipo AURA, por favor confírmenme si mi pedido fue recibido y el tiempo estimado de entrega._`;

    return encodeURIComponent(msg);
  }
};
