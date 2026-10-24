/**
 * AURA Café - Módulo de Autenticación y Perfil de Usuario
 * Gestión de Clientes, Administrador, Sesiones e Historial de Pedidos
 */

const AuthManager = {
  currentUser: null,
  token: localStorage.getItem('aura_token') || null,

  async init() {
    this.setupEventListeners();
    if (this.token) {
      await this.verifySession();
    } else {
      this.updateNavUI();
    }
  },

  async verifySession() {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
        localStorage.setItem('aura_user', JSON.stringify(data.user));
      } else {
        this.logout(false);
      }
    } catch (e) {
      console.warn('Error verificando sesión en servidor:', e);
      // Fallback a localStorage si offline
      const cached = localStorage.getItem('aura_user');
      if (cached) {
        this.currentUser = JSON.parse(cached);
      }
    }
    this.updateNavUI();
  },

  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      this.currentUser = data.user;
      this.token = data.token;
      localStorage.setItem('aura_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));

      this.updateNavUI();
      this.closeAuthModal();

      if (typeof showToast === 'function') {
        const isEn = typeof AppState !== 'undefined' && AppState.lang === 'en';
        showToast(
          isEn ? `Welcome back, ${data.user.name}!` : `¡Bienvenido de vuelta, ${data.user.name}!`,
          'ph-user-check'
        );
      }

      // Si es Admin, redirigir o avisar para ir al Dashboard
      if (data.user.role === 'admin') {
        setTimeout(() => {
          if (confirm('Eres Administrador. ¿Deseas ir al Panel de Control de Administración?')) {
            window.location.href = '/admin.html';
          }
        }, 500);
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async register(name, email, password, phone) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al crear cuenta');
      }

      this.currentUser = data.user;
      this.token = data.token;
      localStorage.setItem('aura_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));

      this.updateNavUI();
      this.closeAuthModal();

      if (typeof showToast === 'function') {
        const isEn = typeof AppState !== 'undefined' && AppState.lang === 'en';
        showToast(
          isEn ? `Account created! Welcome, ${data.user.name}` : `¡Cuenta creada con éxito! Bienvenido, ${data.user.name}`,
          'ph-sparkle'
        );
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  logout(showNotification = true) {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    this.updateNavUI();
    this.closeProfileModal();

    if (showNotification && typeof showToast === 'function') {
      const isEn = typeof AppState !== 'undefined' && AppState.lang === 'en';
      showToast(isEn ? 'Session closed' : 'Sesión cerrada', 'ph-sign-out');
    }
  },

  async fetchUserOrders() {
    if (!this.currentUser) return [];
    try {
      const headers = {};
      if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
      const res = await fetch(`/api/orders?email=${encodeURIComponent(this.currentUser.email)}&userId=${encodeURIComponent(this.currentUser.id)}`, { headers });
      const data = await res.json();
      return data.orders || [];
    } catch (e) {
      console.error('Error obteniendo pedidos del usuario:', e);
      return [];
    }
  },

  updateNavUI() {
    const navBtn = document.getElementById('nav-auth-btn');
    if (!navBtn) return;

    const isEn = typeof AppState !== 'undefined' && AppState.lang === 'en';

    if (this.currentUser) {
      const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const isAdmin = this.currentUser.role === 'admin';

      navBtn.innerHTML = `
        <div class="flex items-center gap-2 cursor-pointer group">
          <div class="w-8 h-8 rounded-full ${isAdmin ? 'bg-gradient-to-tr from-amber-600 to-amber-300 text-black' : 'bg-white/20 text-white'} border border-white/20 flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
            ${isAdmin ? '<i class="ph-bold ph-shield-check text-sm"></i>' : initials}
          </div>
          <div class="hidden md:flex flex-col text-left leading-none">
            <span class="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">${this.currentUser.name.split(' ')[0]}</span>
            <span class="text-[10px] text-[#A1A1A6] font-medium">${isAdmin ? (isEn ? 'Admin' : 'Administrador') : (isEn ? 'My Orders' : 'Mis Pedidos')}</span>
          </div>
        </div>
      `;
      navBtn.onclick = () => {
        if (isAdmin) {
          this.openProfileModal(); // Mostrar modal con opción de ir al dashboard
        } else {
          this.openProfileModal();
        }
      };
    } else {
      navBtn.innerHTML = `
        <div class="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white px-2 py-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
          <i class="ph ph-user text-base"></i>
          <span class="hidden sm:inline">${isEn ? 'Sign In' : 'Ingresar'}</span>
        </div>
      `;
      navBtn.onclick = () => this.openAuthModal('login');
    }
  },

  openAuthModal(defaultTab = 'login') {
    const modal = document.getElementById('auth-modal');
    const backdrop = document.getElementById('auth-modal-backdrop');
    if (!modal || !backdrop) return;

    this.switchAuthTab(defaultTab);
    backdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      const box = modal.querySelector('.max-w-md');
      if (box) {
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
      }
    }, 10);
  },

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    const backdrop = document.getElementById('auth-modal-backdrop');
    if (!modal || !backdrop) return;

    backdrop.classList.add('opacity-0');
    const box = modal.querySelector('.max-w-md');
    if (box) {
      box.classList.remove('scale-100');
      box.classList.add('scale-95');
    }
    setTimeout(() => {
      backdrop.classList.add('hidden');
      modal.classList.add('hidden');
    }, 200);
  },

  switchAuthTab(tab) {
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    const errorEl = document.getElementById('auth-error-msg');
    if (errorEl) errorEl.classList.add('hidden');

    if (tab === 'login') {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
    } else {
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
    }
  },

  async openProfileModal() {
    const modal = document.getElementById('profile-modal');
    const backdrop = document.getElementById('profile-modal-backdrop');
    if (!modal || !backdrop || !this.currentUser) return;

    const isEn = typeof AppState !== 'undefined' && AppState.lang === 'en';

    // Rellenar datos de usuario
    document.getElementById('profile-name').textContent = this.currentUser.name;
    document.getElementById('profile-email').textContent = this.currentUser.email;
    document.getElementById('profile-phone').textContent = this.currentUser.phone || (isEn ? 'Not specified' : 'No especificado');

    // Botón de Admin si aplica
    const adminLink = document.getElementById('profile-admin-link');
    if (adminLink) {
      if (this.currentUser.role === 'admin') {
        adminLink.classList.remove('hidden');
      } else {
        adminLink.classList.add('hidden');
      }
    }

    // Cargar historial de pedidos
    const ordersContainer = document.getElementById('profile-orders-list');
    ordersContainer.innerHTML = `
      <div class="py-8 text-center text-[#A1A1A6] text-xs">
        <i class="ph ph-spinner animate-spin text-xl text-amber-400 mb-2 block"></i>
        ${isEn ? 'Loading your orders...' : 'Cargando tus pedidos...'}
      </div>
    `;

    backdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      const box = modal.querySelector('.max-w-lg');
      if (box) {
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
      }
    }, 10);

    const orders = await this.fetchUserOrders();
    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="py-8 text-center text-[#A1A1A6] text-xs">
          <i class="ph ph-receipt text-3xl mb-2 text-white/30 block"></i>
          <p class="font-medium text-white">${isEn ? 'No orders yet' : 'Aún no tienes pedidos registrados'}</p>
          <p class="mt-1">${isEn ? 'Your purchases made with Google Pay or in-store will appear here.' : 'Tus compras con Google Pay o en tienda aparecerán aquí con seguimiento en tiempo real.'}</p>
        </div>
      `;
    } else {
      ordersContainer.innerHTML = orders.map(ord => {
        let statusBadge = '';
        switch(ord.orderStatus) {
          case 'preparando':
            statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">☕ ${isEn ? 'Brewing / Preparing' : 'En Preparación'}</span>`;
            break;
          case 'listo':
            statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✨ ${isEn ? 'Ready for Pickup' : 'Listo en Barra'}</span>`;
            break;
          case 'entregado':
          case 'completado':
            statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">✓ ${isEn ? 'Completed' : 'Entregado'}</span>`;
            break;
          default:
            statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/70 border border-white/15">⏳ ${ord.orderStatus}</span>`;
        }

        const dateStr = new Date(ord.createdAt).toLocaleDateString(isEn ? 'en-US' : 'es-MX', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const itemsList = ord.items.map(it => `${it.quantity}x ${it.name}`).join(', ');

        return `
          <div class="bg-[#1c1c1f] p-3.5 rounded-2xl border border-white/10 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-white">${ord.id}</span>
                <span class="text-[10px] text-[#A1A1A6]">${dateStr}</span>
              </div>
              ${statusBadge}
            </div>

            <div class="text-[11px] text-[#A1A1A6] line-clamp-2">
              ${itemsList}
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span class="text-[10px] text-stone-400">
                ${ord.paymentMethod === 'google_pay' ? '<span class="inline-flex items-center gap-1 text-white"><i class="ph-bold ph-google-logo text-amber-400"></i> Google Pay</span>' : ord.paymentMethod}
              </span>
              <span class="font-extrabold text-amber-400">$${ord.total.toFixed(2)}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  },

  closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    const backdrop = document.getElementById('profile-modal-backdrop');
    if (!modal || !backdrop) return;

    backdrop.classList.add('opacity-0');
    const box = modal.querySelector('.max-w-lg');
    if (box) {
      box.classList.remove('scale-100');
      box.classList.add('scale-95');
    }
    setTimeout(() => {
      backdrop.classList.add('hidden');
      modal.classList.add('hidden');
    }, 200);
  },

  setupEventListeners() {
    // Manejo de tabs en modal de login/registro
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    if (tabLogin) tabLogin.addEventListener('click', () => this.switchAuthTab('login'));
    if (tabRegister) tabRegister.addEventListener('click', () => this.switchAuthTab('register'));

    // Botones de cierre
    const closeAuthBtn = document.getElementById('close-auth-modal-btn');
    const authBackdrop = document.getElementById('auth-modal-backdrop');
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', () => this.closeAuthModal());
    if (authBackdrop) authBackdrop.addEventListener('click', () => this.closeAuthModal());

    const closeProfileBtn = document.getElementById('close-profile-modal-btn');
    const profileBackdrop = document.getElementById('profile-modal-backdrop');
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => this.closeProfileModal());
    if (profileBackdrop) profileBackdrop.addEventListener('click', () => this.closeProfileModal());

    // Submit Login
    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('auth-error-msg');

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin"></i> Entrando...';

        const res = await this.login(email, password);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Iniciar Sesión';

        if (!res.success) {
          errorEl.textContent = res.message;
          errorEl.classList.remove('hidden');
        }
      });
    }

    // Submit Registro
    const registerForm = document.getElementById('auth-register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const errorEl = document.getElementById('auth-error-msg');

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin"></i> Creando cuenta...';

        const res = await this.register(name, email, password, phone);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Crear Cuenta';

        if (!res.success) {
          errorEl.textContent = res.message;
          errorEl.classList.remove('hidden');
        }
      });
    }

    // Botón Cerrar Sesión en perfil
    const logoutBtn = document.getElementById('profile-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  AuthManager.init();
});
