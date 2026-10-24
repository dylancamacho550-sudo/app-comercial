/**
 * AURA Café - Lógica Principal de la Aplicación
 * Sistema de Menú, Carrito Reactivo, Personalizador de Productos, Bilingüe (ES / EN) y Checkout
 */

// Diccionario de Traducciones (ES / EN)
const I18N = {
  es: {
    promo_banner: 'Disfruta <strong>15% OFF</strong> en tu primer pedido online con el código <span class="bg-white/15 px-2 py-0.5 rounded font-mono font-bold text-amber-300">AURA15</span>',
    banner_hours: 'Lun - Dom 7:00 - 21:00',
    nav_menu: 'Menú',
    nav_experience: 'La Experiencia',
    nav_reservations: 'Reservar Mesa',
    nav_location: 'Ubicación',
    nav_open_badge: 'Abierto ahora',
    nav_bag: 'Bolsa',

    // Hero Portada de Mañana
    hero_morning_badge: 'El cálido ritual que despierta tus mañanas',
    hero_rating_badge: '★ 4.9 en Google',
    hero_title: 'Tus mañanas merecen empezar con calma y buen café.',
    hero_subtitle: 'La luz dorada del amanecer entrando por la ventana, el aroma a granos recién tostados y el abrazo reconfortante de una taza preparada despacio, con pasión y a la temperatura perfecta.',
    hero_cta_menu: 'Comenzar mi Mañana • Ver Menú',
    hero_cta_table: 'Apartar Mesa Tranquila',
    hero_card_tag: 'Especial de Mañana',
    hero_card_title: 'Despierta sin prisas en AURA',
    hero_card_desc: 'Disfruta de nuestros panecillos franceses horneados a las 6:30 AM junto a un Flat White aterciopelado o un V60 de origen único.',
    hero_card_btn: 'Ordenar para Llevar',

    // Barra de Confianza
    trust_1_title: '100% Arábica de Finca',
    trust_1_sub: 'Trazabilidad por lote',
    trust_2_title: 'Pick-up Express (10 min)',
    trust_2_sub: 'Sin filas de espera',
    trust_3_title: 'Pedido por WhatsApp',
    trust_3_sub: 'Confirmación directa',
    trust_4_title: 'Espacio Tranquilo & WiFi',
    trust_4_sub: 'Fibra Óptica 300 Mbps',

    // Menú y Categorías
    menu_badge: 'Carta Digital Interactiva',
    menu_title: 'Nuestro Menú',
    menu_subtitle: 'Selecciona tus bebidas y platillos favoritos. Personaliza el tamaño, tipo de leche o extras a tu gusto.',
    cat_all: 'Todos',
    cat_espresso: 'Espresso Bar',
    cat_cold: 'Cold & Nitro',
    cat_filtro: 'Filtrados V60',
    cat_bakery: 'Repostería',
    cat_brunch: 'Brunch',
    cat_granos: 'Granos en Bolsa',
    search_placeholder: 'Buscar latte, cold brew, croissant...',
    btn_customize: 'Personalizar y Pedir',
    btn_add_direct: 'Añadir a la Bolsa',
    no_results_title: 'No encontramos coincidencias',
    no_results_sub: 'Prueba con otra palabra clave como "espresso", "croissant" o "cold brew".',

    // Bento Experiencia
    bento_badge: 'La Diferencia AURA',
    bento_title: 'Ingeniería y Pasión en Cada Detalle',
    bento_subtitle: 'Cada taza es el resultado de un riguroso estándar de calidad que une la ciencia del café con la hospitalidad más cálida.',
    bento_1_title: 'Micro-Tueste Semanal',
    bento_1_desc: 'Tostamos lotes pequeños de máximo 12 kg para garantizar que recibas los granos en su ventana óptima de desgasificación y aroma.',
    bento_1_tag: 'Perfil: Nórdico / Medio',
    bento_1_status: '100% Fresco',
    bento_2_badge: 'Precisión Absoluta',
    bento_2_title: 'Agua Mineralizada a Medida',
    bento_2_desc: 'Filtramos y remineralizamos el agua mediante ósmosis inversa para alcanzar 130-150 ppm, el ratio exacto para extraer la dulzura del grano.',
    bento_2_cert: 'Estándar SCA Certified',
    bento_3_title: 'Espacio para Crear',
    bento_3_desc: 'Mobiliario ergonómico en madera de roble, música acústica en volumen de conversación e iluminación natural para que disfrutes o trabajes a gusto.',
    bento_3_pet: 'Pet Friendly',
    bento_3_wifi: 'Fibra Óptica 300 Mbps',

    // Reservas
    res_badge: 'Visítanos',
    res_title: 'Aparta tu Mesa o Programa tu Visita',
    res_subtitle: '¿Vienes con tu laptop, una reunión de trabajo o con amigos? Reserva tu lugar con anticipación para asegurar tu mesa preferida y tener tu café servido a tiempo.',
    res_point_1: 'Confirmación instantánea vía WhatsApp y correo',
    res_point_2: 'Mesa reservada con tolerancia de 15 minutos',
    res_point_3: 'Opción de pre-ordenar tus bebidas y alimentos',
    res_lbl_name: 'Nombre completo',
    res_lbl_phone: 'Teléfono / WhatsApp',
    res_lbl_date: 'Fecha',
    res_lbl_time: 'Hora',
    res_lbl_people: 'Personas',
    res_lbl_notes: 'Notas especiales (Opcional)',
    res_btn_submit: 'Confirmar Reserva por WhatsApp',
    res_disclaimer: 'Te enviaremos la confirmación directa a tu WhatsApp en segundos.',

    // Testimonios
    test_badge: 'Comunidad AURA',
    test_title: 'Lo que Dicen Nuestros Clientes',
    test_1_quote: '"El Flat White con leche de avena es insuperable. El diseño del local es limpio, tranquilo y la opción de pedir por WhatsApp para recoger camino a la oficina me ahorra 15 minutos diarios."',
    test_1_role: 'Cliente Habitual • Google Local Guide',
    test_2_quote: '"El Pour Over V60 con grano Geisha fue una experiencia sensorial de otro nivel. Los baristas se toman el tiempo de explicarte el origen y las notas. Vale cada centavo."',
    test_2_role: 'Coffee Enthusiast',
    test_3_quote: '"El Croissant de almendra recién salido del horno con el Nitro Cold Brew es la combinación perfecta. El ambiente tipo Apple Store pero acogedor te invita a quedarte horas."',

    // Club VIP
    club_badge: 'AURA Coffee Club',
    club_title: 'Únete al Círculo de Catadores',
    club_subtitle: 'Recibe 15% de descuento en tu siguiente visita, invitaciones a nuestras catas sensoriales privadas y lanzamientos exclusivos de micro-lotes de café.',
    club_btn: 'Unirme',
    club_disclaimer: 'Sin spam. Solo buen café y beneficios reales. Puedes cancelar cuando quieras.',

    // Ubicación
    loc_badge: 'Visítanos',
    loc_title: 'Ubicación & Horario',
    loc_desc: 'Estamos ubicados en una de las zonas más vibrantes y arboladas de la ciudad, con terraza al aire libre y estacionamiento de bicicletas.',
    loc_address_title: 'Dirección:',
    loc_hours_title: 'Horarios de Servicio:',
    loc_hours_desc: 'Lunes a Viernes: 7:00 AM – 9:00 PM<br>Sábados y Domingos: 8:00 AM – 9:30 PM',
    loc_phone_title: 'Contacto Directo:',
    loc_maps_btn: 'Abrir en Google Maps',
    loc_call_btn: 'Llamar al Local',

    // Footer
    footer_tagline: '— Diseñado con precisión y calidez.',
    footer_about: 'Nosotros',
    footer_terms: 'Términos',
    footer_rights: '© 2026 AURA Café. Todos los derechos reservados.',

    // Carrito
    cart_title: 'Tu Pedido',
    cart_mode_label: 'Modalidad de Pedido:',
    cart_mode_pickup: 'Pick-up (10 min)',
    cart_mode_table: 'En Mesa / Local',
    cart_empty_title: 'Tu bolsa está vacía',
    cart_empty_desc: 'Agrega un café de especialidad o un postre recién horneado de nuestro menú.',
    cart_empty_btn: 'Explorar Menú',
    cart_upsell_title: 'Recomendado para acompañar:',
    cart_coupon_btn: 'Aplicar',
    cart_subtotal_label: 'Subtotal',
    cart_discount_label: 'Descuento Especial (15%)',
    cart_total_label: 'Total Estimado',
    cart_client_placeholder: 'Tu Nombre para la comanda (Ej. Ana)',
    cart_checkout_wa: 'Enviar Pedido por WhatsApp',
    cart_checkout_pay: 'Pagar con Apple Pay / Tarjeta',

    // Modal
    modal_tasting_title: 'Notas de cata:',
    modal_size_title: 'Selecciona el Tamaño:',
    modal_milk_title: 'Tipo de Leche / Bebida:',
    modal_notes_title: 'Instrucciones Especiales:',
    modal_notes_placeholder: 'Ej. Sin azúcar, leche extra caliente, para regalo...',
    modal_btn_add: 'Añadir a la Bolsa'
  },
  en: {
    promo_banner: 'Enjoy <strong>15% OFF</strong> your first online order with code <span class="bg-white/15 px-2 py-0.5 rounded font-mono font-bold text-amber-300">AURA15</span>',
    banner_hours: 'Mon - Sun 7:00 AM - 9:00 PM',
    nav_menu: 'Menu',
    nav_experience: 'The Experience',
    nav_reservations: 'Book a Table',
    nav_location: 'Location',
    nav_open_badge: 'Open now',
    nav_bag: 'Bag',

    // Hero Portada de Mañana
    hero_morning_badge: 'The warm ritual that awakens your mornings',
    hero_rating_badge: '★ 4.9 on Google',
    hero_title: 'Your mornings deserve to start with calm and great coffee.',
    hero_subtitle: 'Golden morning sunlight streaming through the window, the aroma of freshly roasted beans, and the comforting embrace of a cup brewed with slow care, passion, and precision.',
    hero_cta_menu: 'Start My Morning • View Menu',
    hero_cta_table: 'Reserve a Quiet Table',
    hero_card_tag: 'Morning Special',
    hero_card_title: 'Wake up unhurried at AURA',
    hero_card_desc: 'Enjoy artisanal French pastries baked fresh at 6:30 AM paired with a silky Flat White or single-origin V60 pour over.',
    hero_card_btn: 'Order for Pickup',

    // Barra de Confianza
    trust_1_title: '100% Farm-Direct Arabica',
    trust_1_sub: 'Full lot traceability',
    trust_2_title: 'Express Pickup (10 min)',
    trust_2_sub: 'Skip the line, ready upon arrival',
    trust_3_title: 'Order via WhatsApp',
    trust_3_sub: 'Instant confirmation',
    trust_4_title: 'Cozy Space & High-Speed WiFi',
    trust_4_sub: '300 Mbps Fiber Optics',

    // Menú y Categorías
    menu_badge: 'Interactive Digital Menu',
    menu_title: 'Our Menu',
    menu_subtitle: 'Select your favorite drinks and dishes. Customize size, milk type, or special extras to your liking.',
    cat_all: 'All',
    cat_espresso: 'Espresso Bar',
    cat_cold: 'Cold & Nitro',
    cat_filtro: 'V60 Brews',
    cat_bakery: 'Pastries & Bakery',
    cat_brunch: 'Brunch',
    cat_granos: 'Whole Bean Bags',
    search_placeholder: 'Search latte, cold brew, croissant...',
    btn_customize: 'Customize & Order',
    btn_add_direct: 'Add to Bag',
    no_results_title: 'No matching items found',
    no_results_sub: 'Try another keyword like "espresso", "croissant" or "cold brew".',

    // Bento Experiencia
    bento_badge: 'The AURA Difference',
    bento_title: 'Engineering & Passion in Every Detail',
    bento_subtitle: 'Every cup is the culmination of a rigorous craft combining coffee science with the warmest hospitality.',
    bento_1_title: 'Weekly Micro-Roasting',
    bento_1_desc: 'We roast small batches of max 12 kg to ensure beans reach you within their optimal degassing and peak aromatic curve.',
    bento_1_tag: 'Profile: Nordic / Medium',
    bento_1_status: '100% Fresh',
    bento_2_badge: 'Absolute Precision',
    bento_2_title: 'Custom Mineralized Water',
    bento_2_desc: 'We filter and remineralize water through reverse osmosis to 130-150 ppm, the exact ratio to extract origin sweetness.',
    bento_2_cert: 'SCA Certified Standard',
    bento_3_title: 'Space to Create',
    bento_3_desc: 'Ergonomic oak furniture, curated acoustic playlist at conversation volume, and gentle daylight for focused work or conversation.',
    bento_3_pet: 'Pet Friendly',
    bento_3_wifi: '300 Mbps Fiber Optics',

    // Reservas
    res_badge: 'Visit Us',
    res_title: 'Reserve Your Table or Plan Your Visit',
    res_subtitle: 'Coming with your laptop, a business meeting, or meeting friends? Book ahead to guarantee your favorite spot and have your coffee ready.',
    res_point_1: 'Instant confirmation via WhatsApp and email',
    res_point_2: 'Table held with 15-minute courtesy window',
    res_point_3: 'Option to pre-order your beverages and pastries',
    res_lbl_name: 'Full Name',
    res_lbl_phone: 'Phone / WhatsApp',
    res_lbl_date: 'Date',
    res_lbl_time: 'Time',
    res_lbl_people: 'Guests',
    res_lbl_notes: 'Special Requests (Optional)',
    res_btn_submit: 'Confirm Reservation on WhatsApp',
    res_disclaimer: 'We will send direct confirmation to your WhatsApp in seconds.',

    // Testimonios
    test_badge: 'AURA Community',
    test_title: 'What Our Guests Say',
    test_1_quote: '"The Flat White with oat milk is unmatched. The space is calm and spotless, and ordering ahead on WhatsApp saves me 15 minutes every morning."',
    test_1_role: 'Regular Guest • Google Local Guide',
    test_2_quote: '"The Geisha V60 pour over was a sensory experience on another level. The baristas gladly walk you through the terroir and tasting notes."',
    test_2_role: 'Coffee Enthusiast',
    test_3_quote: '"Warm almond croissant freshly baked out of the oven paired with Nitro Cold Brew is the ultimate combination. The Apple-like calm aesthetic invites you to stay for hours."',

    // Club VIP
    club_badge: 'AURA Coffee Club',
    club_title: 'Join the Tasters Circle',
    club_subtitle: 'Enjoy 15% off your next visit, private sensory tasting invitations, and exclusive access to limited micro-lots.',
    club_btn: 'Join Now',
    club_disclaimer: 'No spam. Just pure coffee joy and real perks. Unsubscribe anytime.',

    // Ubicación
    loc_badge: 'Visit Us',
    loc_title: 'Location & Hours',
    loc_desc: 'Located in the heart of the city along tree-lined walkways, featuring outdoor terrace seating and bike parking.',
    loc_address_title: 'Address:',
    loc_hours_title: 'Opening Hours:',
    loc_hours_desc: 'Monday to Friday: 7:00 AM – 9:00 PM<br>Saturday & Sunday: 8:00 AM – 9:30 PM',
    loc_phone_title: 'Direct Phone:',
    loc_maps_btn: 'Open in Google Maps',
    loc_call_btn: 'Call the Café',

    // Footer
    footer_tagline: '— Crafted with precision and warmth.',
    footer_about: 'About',
    footer_terms: 'Terms',
    footer_rights: '© 2026 AURA Café. All rights reserved.',

    // Carrito
    cart_title: 'Your Order',
    cart_mode_label: 'Order Mode:',
    cart_mode_pickup: 'Pickup (10 min)',
    cart_mode_table: 'Dine-In Table',
    cart_empty_title: 'Your bag is empty',
    cart_empty_desc: 'Add a specialty brew or freshly baked pastry from our menu.',
    cart_empty_btn: 'Explore Menu',
    cart_upsell_title: 'Perfect pairing suggestion:',
    cart_coupon_btn: 'Apply',
    cart_subtotal_label: 'Subtotal',
    cart_discount_label: 'Special Discount (15%)',
    cart_total_label: 'Estimated Total',
    cart_client_placeholder: 'Your Name for the ticket (e.g. Sarah)',
    cart_checkout_wa: 'Send Order via WhatsApp',
    cart_checkout_pay: 'Pay with Apple Pay / Card',

    // Modal
    modal_tasting_title: 'Tasting notes:',
    modal_size_title: 'Select Size:',
    modal_milk_title: 'Milk / Beverage Choice:',
    modal_notes_title: 'Special Instructions:',
    modal_notes_placeholder: 'e.g. Extra hot, no sugar, packaged as a gift...',
    modal_btn_add: 'Add to Bag'
  }
};

// Estado global de la aplicación
const AppState = {
  lang: localStorage.getItem('aura_lang') || 'es',
  currentCategory: 'all',
  searchQuery: '',
  cart: JSON.parse(localStorage.getItem('aura_cart') || '[]'),
  appliedCoupon: localStorage.getItem('aura_coupon') || null,
  deliveryMode: 'pickup', // 'pickup' o 'table'
  activeModalProduct: null,
  selectedSize: null,
  selectedMilk: null,
  modalQuantity: 1
};

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(AppState.lang);
  renderProducts();
  setupCategoryFilters();
  setupSearch();
  setupCartDrawer();
  setupProductModal();
  setupReservationForm();
  setupNewsletterForm();
  updateCartUI();
  setupDateDefault();
});

// ================= SISTEMA DE IDIOMA (ES / EN) =================
function switchLanguage(lang) {
  if (lang !== 'es' && lang !== 'en') return;
  AppState.lang = lang;
  localStorage.setItem('aura_lang', lang);
  applyLanguage(lang);
  renderProducts();
  updateCartUI();
  
  if (AppState.activeModalProduct) {
    openProductCustomizer(AppState.activeModalProduct.id);
  }

  showToast(lang === 'es' ? 'Idioma cambiado a Español' : 'Language switched to English', 'ph-globe');
}

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.es;

  // Actualizar botones de idioma en navbar
  const btnEs = document.getElementById('lang-btn-es');
  const btnEn = document.getElementById('lang-btn-en');
  if (btnEs && btnEn) {
    if (lang === 'es') {
      btnEs.classList.add('active');
      btnEn.classList.remove('active');
    } else {
      btnEn.classList.add('active');
      btnEs.classList.remove('active');
    }
  }

  // Actualizar todos los elementos con atributo data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Actualizar placeholders e inputs
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.placeholder = dict.search_placeholder;

  const clientNameInput = document.getElementById('checkout-client-name');
  if (clientNameInput) clientNameInput.placeholder = dict.cart_client_placeholder;

  const promoBanner = document.getElementById('promo-banner-text');
  if (promoBanner) promoBanner.innerHTML = dict.promo_banner;

  const bannerHours = document.getElementById('banner-hours');
  if (bannerHours) bannerHours.textContent = dict.banner_hours;

  const locHours = document.getElementById('loc-hours-desc');
  if (locHours) locHours.innerHTML = dict.loc_hours_desc;

  const modalNotes = document.getElementById('modal-notes');
  if (modalNotes) modalNotes.placeholder = dict.modal_notes_placeholder;
}

// ================= RENDERIZADO DE PRODUCTOS =================
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const isEn = AppState.lang === 'en';
  const dict = I18N[AppState.lang];

  // Filtrado por categoría y búsqueda
  const filtered = PRODUCTS_DATA.filter(prod => {
    const matchesCategory = AppState.currentCategory === 'all' || prod.category === AppState.currentCategory;
    const name = isEn && prod.name_en ? prod.name_en : prod.name;
    const desc = isEn && prod.description_en ? prod.description_en : prod.description;
    const notes = (isEn && prod.tastingNotes_en ? prod.tastingNotes_en : prod.tastingNotes) || [];

    const matchesSearch = name.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
                          desc.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
                          notes.some(n => n.toLowerCase().includes(AppState.searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center text-2xl text-gray-400 mb-3 border border-white/10">
          <i class="ph ph-magnifying-glass"></i>
        </div>
        <h4 class="text-lg font-bold text-white">${dict.no_results_title}</h4>
        <p class="text-sm text-[#86868B] mt-1">${dict.no_results_sub}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(prod => {
    const name = isEn && prod.name_en ? prod.name_en : prod.name;
    const desc = isEn && prod.description_en ? prod.description_en : prod.description;
    const badge = isEn && prod.badge_en ? prod.badge_en : prod.badge;
    const notes = isEn && prod.tastingNotes_en ? prod.tastingNotes_en : prod.tastingNotes;

    const tastingBadges = notes 
      ? notes.map(n => `<span class="text-[10px] bg-white/[0.08] text-stone-300 px-2 py-0.5 rounded-md font-medium border border-white/5">${n}</span>`).join('')
      : '';

    return `
      <article class="product-card overflow-hidden flex flex-col group" data-product-id="${prod.id}">
        <!-- Imagen y Badge -->
        <div class="relative h-56 overflow-hidden bg-stone-900 cursor-pointer" onclick="openProductCustomizer('${prod.id}')">
          <img 
            src="${prod.image}" 
            alt="${name}" 
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          >
          ${badge ? `
            <span class="absolute top-3 left-3 apple-badge bg-black/80 text-white backdrop-blur-md border border-white/10 shadow-xs">
              ${badge}
            </span>
          ` : ''}
          <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1 border border-white/10 shadow-xs">
            <i class="ph-fill ph-star text-amber-400"></i>
            <span>${prod.rating.toFixed(1)}</span>
            <span class="text-white/50 font-normal">(${prod.reviewsCount})</span>
          </div>
        </div>

        <!-- Información -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <h3 class="font-bold text-lg text-white tracking-tight group-hover:text-amber-400 transition-colors cursor-pointer" onclick="openProductCustomizer('${prod.id}')">
                ${name}
              </h3>
              <span class="font-extrabold text-base text-amber-400">${CAFE_CONFIG.currency}${prod.price.toFixed(2)}</span>
            </div>

            <p class="text-xs text-[#86868B] leading-relaxed line-clamp-2 mb-3">
              ${desc}
            </p>

            ${tastingBadges ? `
              <div class="flex flex-wrap gap-1 mb-4">
                ${tastingBadges}
              </div>
            ` : ''}
          </div>

          <!-- Acciones -->
          <div class="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button 
              onclick="openProductCustomizer('${prod.id}')" 
              class="w-full btn-apple-secondary py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white hover:text-black transition-all"
            >
              <i class="ph ph-sliders"></i>
              <span>${prod.customizable ? dict.btn_customize : dict.btn_add_direct}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ================= FILTROS Y BÚSQUEDA =================
function setupCategoryFilters() {
  const buttons = document.querySelectorAll('.segmented-option[data-category]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.currentCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });
}

function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', (e) => {
    AppState.searchQuery = e.target.value.trim();
    renderProducts();
  });
}

// ================= MODAL DE PERSONALIZACIÓN =================
function openProductCustomizer(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const isEn = AppState.lang === 'en';
  AppState.activeModalProduct = product;
  AppState.modalQuantity = 1;
  AppState.selectedSize = product.sizes ? product.sizes[0] : null;

  const milksList = isEn && product.milks_en ? product.milks_en : product.milks;
  AppState.selectedMilk = milksList && milksList.length > 0 ? milksList[0] : null;

  const name = isEn && product.name_en ? product.name_en : product.name;
  const desc = isEn && product.description_en ? product.description_en : product.description;
  const badge = isEn && product.badge_en ? product.badge_en : product.badge;
  const notes = isEn && product.tastingNotes_en ? product.tastingNotes_en : product.tastingNotes;

  // Llenar campos del modal
  document.getElementById('modal-product-img').src = product.image;
  document.getElementById('modal-product-name').textContent = name;
  document.getElementById('modal-product-base-price').textContent = `${CAFE_CONFIG.currency}${product.price.toFixed(2)}`;
  document.getElementById('modal-product-desc').textContent = desc;
  
  const badgeEl = document.getElementById('modal-product-badge');
  if (badge) {
    badgeEl.textContent = badge;
    badgeEl.classList.remove('hidden');
  } else {
    badgeEl.classList.add('hidden');
  }

  // Render notas de cata
  const notesContainer = document.getElementById('modal-tasting-notes-container');
  const notesList = document.getElementById('modal-tasting-notes');
  if (notes && notes.length > 0) {
    notesContainer.classList.remove('hidden');
    notesList.innerHTML = notes.map(n => `
      <span class="text-xs bg-white/10 px-2.5 py-1 rounded-md text-stone-200 font-medium border border-white/5">${n}</span>
    `).join('');
  } else {
    notesContainer.classList.add('hidden');
  }

  // Render Tamaños
  const sizesContainer = document.getElementById('modal-sizes-container');
  const sizesOptions = document.getElementById('modal-sizes-options');
  if (product.sizes && product.sizes.length > 0) {
    sizesContainer.classList.remove('hidden');
    sizesOptions.innerHTML = product.sizes.map((s, idx) => {
      const sizeLabel = isEn && s.name_en ? s.name_en : s.name;
      return `
        <button 
          type="button" 
          class="size-choice-btn p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${idx === 0 ? 'border-white bg-white text-black' : 'border-white/15 bg-[#1c1c1f] text-white/80 hover:border-white/30'}"
          onclick="selectModalSize(${idx})"
        >
          <div class="flex justify-between items-center">
            <span>${sizeLabel}</span>
            ${s.extra > 0 ? `<span class="opacity-80">+${CAFE_CONFIG.currency}${s.extra.toFixed(2)}</span>` : ''}
          </div>
        </button>
      `;
    }).join('');
  } else {
    sizesContainer.classList.add('hidden');
  }

  // Render Leches
  const milksContainer = document.getElementById('modal-milks-container');
  const milksOptions = document.getElementById('modal-milks-options');
  if (milksList && milksList.length > 0) {
    milksContainer.classList.remove('hidden');
    milksOptions.innerHTML = milksList.map((m, idx) => `
      <label class="flex items-center justify-between p-2.5 rounded-xl border border-white/15 bg-[#1c1c1f] text-xs cursor-pointer hover:border-white/35 transition-all">
        <span class="font-medium text-white">${m}</span>
        <input 
          type="radio" 
          name="modal-milk-choice" 
          value="${m}" 
          ${idx === 0 ? 'checked' : ''} 
          class="accent-amber-400 w-4 h-4"
          onchange="selectModalMilk('${m}')"
        >
      </label>
    `).join('');
  } else {
    milksContainer.classList.add('hidden');
  }

  document.getElementById('modal-notes').value = '';
  updateModalCalculatedPrice();

  // Mostrar modal
  const modal = document.getElementById('product-modal');
  const backdrop = document.getElementById('product-modal-backdrop');
  backdrop.classList.remove('hidden');
  modal.classList.remove('hidden');
  setTimeout(() => {
    backdrop.classList.remove('opacity-0');
    const modalBox = modal.querySelector('.max-w-lg');
    if (modalBox) {
      modalBox.classList.remove('scale-95');
      modalBox.classList.add('scale-100');
    }
  }, 10);
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  const backdrop = document.getElementById('product-modal-backdrop');
  if (!modal || !backdrop) return;
  backdrop.classList.add('opacity-0');
  const modalBox = modal.querySelector('.max-w-lg');
  if (modalBox) {
    modalBox.classList.remove('scale-100');
    modalBox.classList.add('scale-95');
  }
  setTimeout(() => {
    backdrop.classList.add('hidden');
    modal.classList.add('hidden');
    AppState.activeModalProduct = null;
  }, 200);
}

function selectModalSize(index) {
  if (!AppState.activeModalProduct || !AppState.activeModalProduct.sizes) return;
  AppState.selectedSize = AppState.activeModalProduct.sizes[index];
  
  const buttons = document.querySelectorAll('.size-choice-btn');
  buttons.forEach((btn, idx) => {
    if (idx === index) {
      btn.className = 'size-choice-btn p-2.5 rounded-xl border text-xs font-semibold text-left transition-all border-white bg-white text-black';
    } else {
      btn.className = 'size-choice-btn p-2.5 rounded-xl border text-xs font-semibold text-left transition-all border-white/15 bg-[#1c1c1f] text-white/80 hover:border-white/30';
    }
  });

  updateModalCalculatedPrice();
}

function selectModalMilk(milkName) {
  AppState.selectedMilk = milkName;
}

function updateModalCalculatedPrice() {
  if (!AppState.activeModalProduct) return;
  let unitPrice = AppState.activeModalProduct.price;
  if (AppState.selectedSize && AppState.selectedSize.extra) {
    unitPrice += AppState.selectedSize.extra;
  }
  const total = unitPrice * AppState.modalQuantity;
  document.getElementById('modal-qty-display').textContent = AppState.modalQuantity;
  document.getElementById('modal-total-price').textContent = `${CAFE_CONFIG.currency}${total.toFixed(2)}`;
}

function setupProductModal() {
  document.getElementById('close-modal-btn').addEventListener('click', closeProductModal);
  document.getElementById('product-modal-backdrop').addEventListener('click', closeProductModal);

  document.getElementById('modal-qty-plus').addEventListener('click', () => {
    AppState.modalQuantity++;
    updateModalCalculatedPrice();
  });

  document.getElementById('modal-qty-minus').addEventListener('click', () => {
    if (AppState.modalQuantity > 1) {
      AppState.modalQuantity--;
      updateModalCalculatedPrice();
    }
  });

  document.getElementById('modal-add-to-cart-btn').addEventListener('click', () => {
    if (!AppState.activeModalProduct) return;

    const isEn = AppState.lang === 'en';
    let unitPrice = AppState.activeModalProduct.price;
    if (AppState.selectedSize && AppState.selectedSize.extra) {
      unitPrice += AppState.selectedSize.extra;
    }

    const specialNotes = document.getElementById('modal-notes').value.trim();
    const productName = isEn && AppState.activeModalProduct.name_en ? AppState.activeModalProduct.name_en : AppState.activeModalProduct.name;
    const sizeName = AppState.selectedSize ? (isEn && AppState.selectedSize.name_en ? AppState.selectedSize.name_en : AppState.selectedSize.name) : null;

    const cartItem = {
      cartItemId: `${AppState.activeModalProduct.id}-${Date.now()}`,
      id: AppState.activeModalProduct.id,
      name: productName,
      image: AppState.activeModalProduct.image,
      unitPrice: unitPrice,
      quantity: AppState.modalQuantity,
      size: sizeName,
      milk: AppState.selectedMilk || null,
      notes: specialNotes || null
    };

    addToCart(cartItem);
    closeProductModal();
    showToast(isEn ? 'Added to your bag!' : '¡Agregado a tu bolsa!', 'ph-check-circle');
    openCartDrawer();
  });
}

// ================= GESTIÓN DEL CARRITO =================
function addToCart(item) {
  AppState.cart.push(item);
  saveCart();
  updateCartUI();
}

function removeCartItem(cartItemId) {
  AppState.cart = AppState.cart.filter(item => item.cartItemId !== cartItemId);
  saveCart();
  updateCartUI();
}

function updateCartItemQty(cartItemId, delta) {
  const item = AppState.cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeCartItem(cartItemId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('aura_cart', JSON.stringify(AppState.cart));
}

function updateCartUI() {
  const totalCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Actualizar badges
  document.getElementById('cart-badge-count').textContent = totalCount;
  document.getElementById('cart-header-count').textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const upsellSection = document.getElementById('cart-upsell-section');

  if (AppState.cart.length === 0) {
    container.innerHTML = '';
    container.appendChild(emptyState);
    emptyState.classList.remove('hidden');
    upsellSection.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    upsellSection.classList.remove('hidden');

    container.innerHTML = AppState.cart.map(item => `
      <div class="flex gap-3 bg-[#1a1a1d] p-3.5 rounded-2xl border border-white/10 items-center">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover">
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <h4 class="font-bold text-xs sm:text-sm text-white truncate">${item.name}</h4>
            <span class="font-extrabold text-xs sm:text-sm text-amber-400 ml-2">${CAFE_CONFIG.currency}${(item.unitPrice * item.quantity).toFixed(2)}</span>
          </div>

          <div class="text-[11px] text-[#A1A1A6] space-y-0.5 mt-0.5">
            ${item.size ? `<div>${AppState.lang === 'en' ? 'Size' : 'Tamaño'}: <span class="text-stone-300 font-medium">${item.size}</span></div>` : ''}
            ${item.milk ? `<div>${AppState.lang === 'en' ? 'Choice' : 'Opción'}: <span class="text-stone-300 font-medium">${item.milk}</span></div>` : ''}
            ${item.notes ? `<div class="italic text-[10px] text-amber-300/80">${AppState.lang === 'en' ? 'Note' : 'Nota'}: "${item.notes}"</div>` : ''}
          </div>

          <!-- Modificador de cantidad -->
          <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10">
            <div class="flex items-center gap-2 bg-[#141416] px-2 py-0.5 rounded-full border border-white/15">
              <button onclick="updateCartItemQty('${item.cartItemId}', -1)" class="text-gray-400 hover:text-white font-bold text-xs">-</button>
              <span class="text-xs font-semibold px-1 text-white">${item.quantity}</span>
              <button onclick="updateCartItemQty('${item.cartItemId}', 1)" class="text-gray-400 hover:text-white font-bold text-xs">+</button>
            </div>
            <button onclick="removeCartItem('${item.cartItemId}')" class="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    renderUpsellItems();
  }

  calculateTotals();
}

function renderUpsellItems() {
  const upsellContainer = document.getElementById('cart-upsell-items');
  if (!upsellContainer) return;

  const isEn = AppState.lang === 'en';

  upsellContainer.innerHTML = UPSELL_PRODUCTS.map(up => {
    const name = isEn && up.name_en ? up.name_en : up.name;
    const addText = isEn ? 'Add' : 'Agregar';

    return `
      <div class="flex items-center justify-between bg-[#1c1c1f] p-2.5 rounded-xl border border-amber-500/20 shadow-xs">
        <div class="flex items-center gap-2.5">
          <img src="${up.image}" alt="${name}" class="w-10 h-10 rounded-lg object-cover">
          <div>
            <h5 class="text-xs font-bold text-white">${name}</h5>
            <span class="text-[11px] text-amber-400 font-extrabold">+${CAFE_CONFIG.currency}${up.price.toFixed(2)}</span>
          </div>
        </div>
        <button 
          onclick="addUpsellToCart('${up.id}')"
          class="bg-white hover:bg-stone-200 text-black px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all"
        >
          <i class="ph ph-plus"></i>
          <span>${addText}</span>
        </button>
      </div>
    `;
  }).join('');
}

function addUpsellToCart(upsellId) {
  const up = UPSELL_PRODUCTS.find(u => u.id === upsellId);
  if (!up) return;

  const isEn = AppState.lang === 'en';
  const name = isEn && up.name_en ? up.name_en : up.name;

  const cartItem = {
    cartItemId: `${up.id}-${Date.now()}`,
    id: up.id,
    name: name,
    image: up.image,
    unitPrice: up.price,
    quantity: 1,
    size: null,
    milk: null,
    notes: isEn ? 'Order add-on' : 'Complemento de pedido'
  };

  addToCart(cartItem);
  showToast(isEn ? `${name} added to order!` : `¡${name} agregado al pedido!`, 'ph-sparkle');
}

function calculateTotals() {
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  let discount = 0;

  if (AppState.appliedCoupon === CAFE_CONFIG.promoCode) {
    discount = subtotal * CAFE_CONFIG.promoDiscount;
    document.getElementById('cart-discount-row').classList.remove('hidden');
    document.getElementById('cart-discount').textContent = `-${CAFE_CONFIG.currency}${discount.toFixed(2)}`;
  } else {
    document.getElementById('cart-discount-row').classList.add('hidden');
  }

  const total = Math.max(0, subtotal - discount);

  document.getElementById('cart-subtotal').textContent = `${CAFE_CONFIG.currency}${subtotal.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `${CAFE_CONFIG.currency}${total.toFixed(2)}`;
}

// ================= SLIDE-OVER DRAWER =================
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  backdrop.classList.remove('hidden');
  drawer.classList.remove('closed');
  drawer.classList.add('open');
  setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  backdrop.classList.add('opacity-0');
  drawer.classList.remove('open');
  drawer.classList.add('closed');
  setTimeout(() => backdrop.classList.add('hidden'), 350);
}

function setupCartDrawer() {
  document.getElementById('open-cart-btn').addEventListener('click', openCartDrawer);
  document.getElementById('close-cart-btn').addEventListener('click', closeCartDrawer);
  document.getElementById('cart-drawer-backdrop').addEventListener('click', closeCartDrawer);
  
  const browseBtn = document.getElementById('cart-browse-btn');
  if (browseBtn) {
    browseBtn.addEventListener('click', closeCartDrawer);
  }

  // Modalidad Pick-up vs Mesa
  const pickupBtn = document.getElementById('mode-pickup');
  const tableBtn = document.getElementById('mode-table');

  pickupBtn.addEventListener('click', () => {
    AppState.deliveryMode = 'pickup';
    pickupBtn.className = 'delivery-mode-btn active py-2 rounded-xl border border-white/20 bg-white font-semibold text-black shadow-xs flex items-center justify-center gap-1.5';
    tableBtn.className = 'delivery-mode-btn py-2 rounded-xl border border-white/10 bg-transparent font-medium text-white/70 flex items-center justify-center gap-1.5';
  });

  tableBtn.addEventListener('click', () => {
    AppState.deliveryMode = 'table';
    tableBtn.className = 'delivery-mode-btn active py-2 rounded-xl border border-white/20 bg-white font-semibold text-black shadow-xs flex items-center justify-center gap-1.5';
    pickupBtn.className = 'delivery-mode-btn py-2 rounded-xl border border-white/10 bg-transparent font-medium text-white/70 flex items-center justify-center gap-1.5';
  });

  // Cupones
  const applyBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-input');
  const feedback = document.getElementById('coupon-feedback');

  applyBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    const isEn = AppState.lang === 'en';
    if (code === CAFE_CONFIG.promoCode) {
      AppState.appliedCoupon = code;
      localStorage.setItem('aura_coupon', code);
      feedback.textContent = isEn ? '✓ Coupon AURA15 applied (15% OFF)!' : '✓ ¡Cupón AURA15 aplicado con éxito (15% OFF)!';
      feedback.className = 'text-[11px] mt-1 font-semibold text-emerald-600';
      feedback.classList.remove('hidden');
      calculateTotals();
      showToast(isEn ? '15% discount applied' : 'Descuento del 15% aplicado', 'ph-tag');
    } else {
      feedback.textContent = isEn ? '✕ Invalid coupon. Try AURA15' : '✕ Código no válido. Intenta con AURA15';
      feedback.className = 'text-[11px] mt-1 font-semibold text-red-500';
      feedback.classList.remove('hidden');
    }
  });

  // Checkout por WhatsApp
  document.getElementById('checkout-whatsapp-btn').addEventListener('click', handleWhatsAppCheckout);

  // Simulación Apple Pay
  document.getElementById('checkout-apple-pay-btn').addEventListener('click', handleApplePaySimulation);
}

// ================= CHECKOUT POR WHATSAPP =================
function handleWhatsAppCheckout() {
  const isEn = AppState.lang === 'en';

  if (AppState.cart.length === 0) {
    showToast(isEn ? 'Your coffee bag is empty' : 'Tu bolsa de café está vacía', 'ph-warning');
    return;
  }

  const clientName = document.getElementById('checkout-client-name').value.trim() || (isEn ? 'AURA Guest' : 'Cliente AURA');
  const modeText = AppState.deliveryMode === 'pickup' 
    ? (isEn ? '🛍️ Takeaway (Pickup in 10 min)' : '🛍️ Para Llevar (Pick-up en 10 min)')
    : (isEn ? '☕ Dine-In Table / Inside' : '☕ Consumo en Mesa / Local');

  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const discount = AppState.appliedCoupon === CAFE_CONFIG.promoCode ? subtotal * CAFE_CONFIG.promoDiscount : 0;
  const total = Math.max(0, subtotal - discount);

  let message = `✨ *${isEn ? 'NEW ORDER' : 'NUEVO PEDIDO'} - ${CAFE_CONFIG.name}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *${isEn ? 'Guest' : 'Cliente'}:* ${clientName}\n`;
  message += `📍 *${isEn ? 'Mode' : 'Modalidad'}:* ${modeText}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📋 *${isEn ? 'ORDER DETAILS' : 'DETALLE DEL PEDIDO'}:*\n`;

  AppState.cart.forEach((item, index) => {
    message += `\n${index + 1}. *${item.quantity}x ${item.name}* - ${CAFE_CONFIG.currency}${(item.unitPrice * item.quantity).toFixed(2)}\n`;
    if (item.size) message += `   • ${isEn ? 'Size' : 'Tamaño'}: ${item.size}\n`;
    if (item.milk) message += `   • ${isEn ? 'Choice' : 'Opción'}: ${item.milk}\n`;
    if (item.notes) message += `   • ${isEn ? 'Note' : 'Nota'}: _"${item.notes}"_\n`;
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `${isEn ? 'Subtotal' : 'Subtotal'}: ${CAFE_CONFIG.currency}${subtotal.toFixed(2)}\n`;
  if (discount > 0) {
    message += `${isEn ? 'Promo Discount (AURA15)' : 'Descuento (Cupón AURA15)'}: -${CAFE_CONFIG.currency}${discount.toFixed(2)}\n`;
  }
  message += `*${isEn ? 'TOTAL TO PAY' : 'TOTAL A PAGAR'}:* ${CAFE_CONFIG.currency}${total.toFixed(2)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `☕ _${isEn ? 'Thank you for ordering at AURA! Please confirm estimated pickup time.' : '¡Gracias por pedir en AURA! Por favor confírmenme el tiempo estimado.'}_`;

  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CAFE_CONFIG.whatsappNumber}?text=${encodedMsg}`;

  // Abrir WhatsApp en nueva pestaña
  window.open(whatsappUrl, '_blank');

  // Limpiar carrito tras finalizar
  AppState.cart = [];
  saveCart();
  updateCartUI();
  closeCartDrawer();
  showToast(isEn ? 'Order formatted and opened in WhatsApp!' : '¡Pedido generado y enviado a WhatsApp!', 'ph-check-circle');
}

// ================= SIMULACIÓN DE APPLE PAY =================
async function handleApplePaySimulation() {
  const isEn = AppState.lang === 'en';

  if (AppState.cart.length === 0) {
    showToast(isEn ? 'Your bag is empty' : 'Tu bolsa está vacía', 'ph-warning');
    return;
  }

  const currentUser = typeof AuthManager !== 'undefined' ? AuthManager.currentUser : null;
  const clientName = document.getElementById('checkout-client-name').value.trim() || (currentUser ? currentUser.name : (isEn ? 'Guest' : 'Cliente'));
  showToast(isEn ? 'Processing with Apple Pay...' : 'Procesando con Apple Pay...', 'ph-spinner');

  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const discount = AppState.appliedCoupon === CAFE_CONFIG.promoCode ? subtotal * CAFE_CONFIG.promoDiscount : 0;
  const total = Math.max(0, subtotal - discount);

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser ? currentUser.id : null,
        customerName: clientName,
        customerEmail: currentUser ? currentUser.email : '',
        customerPhone: currentUser ? currentUser.phone : '',
        items: AppState.cart,
        subtotal: subtotal,
        discount: discount,
        total: total,
        coupon: AppState.appliedCoupon || null,
        deliveryMode: AppState.deliveryMode || 'pickup',
        paymentMethod: 'apple_pay',
        paymentDetails: { gateway: 'apple_pay_simulated' }
      })
    });
    const data = await res.json();
    const order = data.order || { id: 'ORD-APPLE', total };

    AppState.cart = [];
    saveCart();
    updateCartUI();
    closeCartDrawer();

    showToast(
      isEn ? `Payment confirmed! Order ${order.id} generated for ${clientName}.` : `¡Pago confirmado! Orden ${order.id} para ${clientName}.`,
      'ph-check-circle'
    );

    if (typeof GooglePayService !== 'undefined' && GooglePayService.showOrderReceipt) {
      GooglePayService.showOrderReceipt(order);
    }
  } catch (err) {
    console.error('Error procesando Apple Pay:', err);
  }
}

// ================= FORMULARIO DE RESERVAS =================
function setupReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isEn = AppState.lang === 'en';
    const name = document.getElementById('res-name').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const people = document.getElementById('res-people').value;
    const notes = document.getElementById('res-notes').value.trim();

    let msg = `📅 *${isEn ? 'TABLE RESERVATION' : 'RESERVA DE MESA'} - ${CAFE_CONFIG.name}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *${isEn ? 'Name' : 'Nombre'}:* ${name}\n`;
    msg += `📱 *${isEn ? 'Phone' : 'Teléfono'}:* ${phone}\n`;
    msg += `🗓️ *${isEn ? 'Date' : 'Fecha'}:* ${date}\n`;
    msg += `⏰ *${isEn ? 'Time' : 'Hora'}:* ${time}\n`;
    msg += `👥 *${isEn ? 'Guests' : 'Personas'}:* ${people}\n`;
    if (notes) msg += `📝 *${isEn ? 'Special request' : 'Petición especial'}:* _${notes}_\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_${isEn ? 'Hello AURA team, please confirm table availability.' : 'Hola equipo AURA, solicito confirmar disponibilidad para esta reserva.'}_`;

    const url = `https://wa.me/${CAFE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    showToast(isEn ? 'Reservation sent! We will reach out shortly.' : '¡Reserva enviada! Te contactamos en breve', 'ph-calendar-check');
    form.reset();
    setupDateDefault();
  });
}

function setupDateDefault() {
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
}

// ================= NEWSLETTER / CLUB VIP =================
function setupNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isEn = AppState.lang === 'en';
    const email = document.getElementById('newsletter-email').value;
    showToast(
      isEn ? `Welcome to the Club! Code AURA15 unlocked for ${email}` : `¡Bienvenido al Club! Código AURA15 activado para ${email}`,
      'ph-sparkle'
    );
    form.reset();
  });
}

// ================= SISTEMA DE TOAST NOTIFICATIONS =================
function showToast(message, iconName = 'ph-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="ph-bold ${iconName} text-amber-400 text-lg"></i>
    <span class="font-medium text-xs sm:text-sm leading-snug">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
