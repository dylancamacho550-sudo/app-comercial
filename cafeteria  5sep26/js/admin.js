/**
 * AURA Café - Lógica del Panel de Administración
 * Gestión de Google Pay API Keys, Métricas en Vivo y Estados de Comandas
 */

const AdminApp = {
  token: localStorage.getItem('aura_token') || null,
  orders: [],
  googlePayConfig: {},

  async init() {
    await this.checkAuth();
    await this.loadStats();
    await this.loadGooglePayConfig();
    await this.loadOrders();
    await this.loadChatbotMessages();
    this.setupEventListeners();

    // Auto-refresco de pedidos y mensajes cada 15 segundos
    setInterval(() => {
      this.loadOrders(false);
      this.loadStats(false);
      this.loadChatbotMessages(false);
    }, 15000);
  },

  async checkAuth() {
    const cachedUser = JSON.parse(localStorage.getItem('aura_user') || 'null');
    
    // Si no hay sesión o no es admin, intentar auto-autenticar al admin predeterminado para facilidad de uso local
    if (!cachedUser || cachedUser.role !== 'admin') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@aura.cafe', password: '123456' })
        });
        const data = await res.json();
        if (data.success && data.user.role === 'admin') {
          this.token = data.token;
          localStorage.setItem('aura_token', data.token);
          localStorage.setItem('aura_user', JSON.stringify(data.user));
          document.getElementById('admin-user-name').textContent = data.user.name;
          return;
        }
      } catch (e) {
        console.warn('Auto-login admin fallback:', e);
      }
    } else {
      document.getElementById('admin-user-name').textContent = cachedUser.name;
    }
  },

  async loadStats(showSpinner = true) {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
      });
      const data = await res.json();
      if (!data.success) return;

      const stats = data.stats;
      document.getElementById('kpi-revenue').textContent = `$${stats.totalRevenue.toFixed(2)}`;
      document.getElementById('kpi-orders').textContent = stats.totalOrders;
      document.getElementById('kpi-active').textContent = stats.activeOrdersCount;
      document.getElementById('kpi-clients').textContent = stats.totalClients;
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  },

  async loadGooglePayConfig() {
    try {
      const res = await fetch('/api/admin/settings/google-pay', {
        headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
      });
      const data = await res.json();
      if (!data.success) return;

      const cfg = data.googlePay || {};
      this.googlePayConfig = cfg;

      document.getElementById('cfg-enabled').value = cfg.enabled !== false ? 'true' : 'false';
      document.getElementById('cfg-environment').value = cfg.environment || 'TEST';
      document.getElementById('cfg-gateway').value = cfg.gateway || 'example';
      document.getElementById('cfg-merchant-id').value = cfg.merchantId || '';
      document.getElementById('cfg-merchant-name').value = cfg.merchantName || 'AURA Coffee Co.';
      document.getElementById('cfg-gateway-merchant-id').value = cfg.gatewayMerchantId || '';
      document.getElementById('cfg-api-key').value = cfg.apiKey || '';

      this.updateGooglePayStatusBadge(cfg.enabled !== false, cfg.environment);
    } catch (err) {
      console.error('Error cargando configuración de Google Pay:', err);
    }
  },

  updateGooglePayStatusBadge(enabled, env) {
    const badge = document.getElementById('gpay-status-badge');
    if (!badge) return;

    if (enabled) {
      badge.className = 'flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400';
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Google Pay Activo (${env || 'TEST'})</span>
      `;
    } else {
      badge.className = 'flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-red-400';
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-red-400"></span>
        <span>Google Pay Desactivado</span>
      `;
    }
  },

  async loadOrders(showSpinner = true) {
    const tbody = document.getElementById('admin-orders-tbody');
    if (showSpinner) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-[#A1A1A6]">
            <i class="ph ph-spinner animate-spin text-xl text-amber-400 mb-2 block"></i>
            Actualizando comanda en tiempo real...
          </td>
        </tr>
      `;
    }

    try {
      const res = await fetch('/api/orders?all=true', {
        headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
      });
      const data = await res.json();
      if (!data.success) return;

      this.orders = data.orders || [];
      this.renderOrdersTable();
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  },

  renderOrdersTable() {
    const tbody = document.getElementById('admin-orders-tbody');
    const filterStatus = document.getElementById('orders-filter-status').value;

    let filtered = this.orders;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.orderStatus === filterStatus);
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-[#A1A1A6]">
            <i class="ph ph-check-circle text-2xl text-emerald-400 mb-2 block"></i>
            No hay órdenes registradas con este criterio.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('es-MX', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const itemsSummary = order.items.map(it => {
        let details = [];
        if (it.size) details.push(it.size);
        if (it.milk) details.push(it.milk);
        const sub = details.length > 0 ? ` <span class="text-white/40">(${details.join(', ')})</span>` : '';
        return `<div class="truncate max-w-xs"><strong class="text-white">${it.quantity}x</strong> ${it.name}${sub}</div>`;
      }).join('');

      // Badge de pago
      const isGPay = order.paymentMethod === 'google_pay';
      const paymentBadge = isGPay 
        ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-black"><i class="ph-bold ph-google-logo"></i> Google Pay</span>`
        : `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white">${order.paymentMethod}</span>`;

      // Modalidad
      const modeText = order.deliveryMode === 'pickup' 
        ? '<span class="text-amber-300 font-semibold"><i class="ph ph-tote"></i> Pick-up</span>'
        : '<span class="text-blue-300 font-semibold"><i class="ph ph-chair"></i> En Mesa</span>';

      return `
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
            ${order.id}
            <span class="block text-[10px] text-[#A1A1A6] font-normal font-sans">${dateStr}</span>
          </td>
          <td class="py-3 px-4">
            <span class="font-bold text-white block">${order.customerName}</span>
            <span class="text-[10px] text-[#A1A1A6] block">${order.customerPhone || order.customerEmail || 'Sin contacto'}</span>
          </td>
          <td class="py-3 px-4 text-stone-300 text-[11px] leading-relaxed">
            ${itemsSummary}
          </td>
          <td class="py-3 px-4 font-extrabold text-amber-400 text-sm whitespace-nowrap">
            $${order.total.toFixed(2)}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            ${paymentBadge}
          </td>
          <td class="py-3 px-4 whitespace-nowrap text-[11px]">
            ${modeText}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            <select 
              onchange="AdminApp.updateOrderStatus('${order.id}', this.value)"
              class="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold focus:outline-none transition-all ${
                order.orderStatus === 'preparando' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                order.orderStatus === 'listo' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                order.orderStatus === 'completado' || order.orderStatus === 'entregado' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                'bg-white/10 text-white border-white/15'
              }"
            >
              <option value="preparando" ${order.orderStatus === 'preparando' ? 'selected' : ''}>☕ En Preparación</option>
              <option value="listo" ${order.orderStatus === 'listo' ? 'selected' : ''}>✨ Listo para Entrega</option>
              <option value="completado" ${order.orderStatus === 'completado' || order.orderStatus === 'entregado' ? 'selected' : ''}>✓ Completado</option>
              <option value="pendiente" ${order.orderStatus === 'pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        this.showToast(`Orden ${orderId} actualizada a: ${newStatus}`, 'ph-check');
        const ord = this.orders.find(o => o.id === orderId);
        if (ord) ord.orderStatus = newStatus;
        this.loadStats(false);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (e) {
      console.error('Error actualizando comanda:', e);
    }
  },

  async loadChatbotMessages(showSpinner = true) {
    const tbody = document.getElementById('admin-chatbot-messages-tbody');
    if (!tbody) return;

    try {
      const res = await fetch('/api/chatbot/messages', {
        headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
      });
      const data = await res.json();
      if (!data.success) return;

      this.renderChatbotMessagesTable(data.messages || []);
    } catch (err) {
      console.error('Error cargando mensajes del chatbot:', err);
    }
  },

  renderChatbotMessagesTable(messages) {
    const tbody = document.getElementById('admin-chatbot-messages-tbody');
    if (!tbody) return;

    if (!messages || messages.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="py-6 text-center text-[#A1A1A6]">
            No hay mensajes registrados por el momento.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = messages.map(msg => {
      const dateStr = new Date(msg.createdAt).toLocaleDateString('es-MX', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="py-3 px-4 font-mono text-[11px] text-[#A1A1A6] whitespace-nowrap">${dateStr}</td>
          <td class="py-3 px-4 font-bold text-white">${msg.name}</td>
          <td class="py-3 px-4 text-amber-300 font-mono text-[11px]">${msg.contact}</td>
          <td class="py-3 px-4 text-stone-300 max-w-md">${msg.message}</td>
        </tr>
      `;
    }).join('');
  },

  setupEventListeners() {
    // Submit Configuración Google Pay
    const form = document.getElementById('google-pay-config-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin"></i> Guardando...';

        const payload = {
          enabled: document.getElementById('cfg-enabled').value === 'true',
          environment: document.getElementById('cfg-environment').value,
          gateway: document.getElementById('cfg-gateway').value,
          merchantId: document.getElementById('cfg-merchant-id').value,
          merchantName: document.getElementById('cfg-merchant-name').value,
          gatewayMerchantId: document.getElementById('cfg-gateway-merchant-id').value,
          apiKey: document.getElementById('cfg-api-key').value
        };

        try {
          const res = await fetch('/api/admin/settings/google-pay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
            },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="ph ph-floppy-disk text-base"></i> <span>Guardar Credenciales en Servidor</span>';

          if (data.success) {
            this.updateGooglePayStatusBadge(payload.enabled, payload.environment);
            const feedback = document.getElementById('cfg-save-feedback');
            feedback.classList.remove('hidden');
            setTimeout(() => feedback.classList.add('hidden'), 4000);
            this.showToast('Credenciales de Google Pay actualizadas', 'ph-google-logo');
          }
        } catch (err) {
          submitBtn.disabled = false;
          alert('Error al guardar credenciales');
        }
      });
    }

    // Toggle visibilidad de API Key
    const toggleKeyBtn = document.getElementById('toggle-api-key-visibility');
    if (toggleKeyBtn) {
      toggleKeyBtn.addEventListener('click', () => {
        const input = document.getElementById('cfg-api-key');
        if (input.type === 'password') {
          input.type = 'text';
          toggleKeyBtn.innerHTML = '<i class="ph ph-eye-slash"></i>';
        } else {
          input.type = 'password';
          toggleKeyBtn.innerHTML = '<i class="ph ph-eye"></i>';
        }
      });
    }

    // Botón refrescar
    const refreshBtn = document.getElementById('refresh-data-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadOrders(true);
        this.loadStats(true);
        this.loadChatbotMessages(true);
        this.showToast('Datos actualizados', 'ph-arrows-clockwise');
      });
    }

    // Filtro estado órdenes
    const filterSelect = document.getElementById('orders-filter-status');
    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.renderOrdersTable());
    }

    // Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('aura_token');
        localStorage.removeItem('aura_user');
        window.location.href = '/';
      });
    }
  },

  showToast(message, icon = 'ph-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="ph-bold ${icon} text-amber-400 text-lg"></i>
      <span class="font-medium text-xs sm:text-sm leading-snug">${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
