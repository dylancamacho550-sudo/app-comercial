// Catálogo de Productos para AURA Café (Bilingüe ES / EN)
const PRODUCTS_DATA = [
  {
    id: "prod-1",
    name: "Flat White Velvet",
    name_en: "Velvet Flat White",
    category: "espresso",
    price: 4.80,
    badge: "Más Vendido",
    badge_en: "Bestseller",
    rating: 4.9,
    reviewsCount: 142,
    description: "Doble shot de espresso de origen etíope con microespuma de leche sedosa y texturizada a 65°C.",
    description_en: "Double shot of Ethiopian espresso with silky textured microfoam steamed to 65°C.",
    tastingNotes: ["Chocolate blanco", "Avellana tostada", "Caramelo"],
    tastingNotes_en: ["White chocolate", "Roasted hazelnut", "Caramel"],
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80",
    customizable: true,
    sizes: [
      { name: "Regular (8 oz)", name_en: "Regular (8 oz)", extra: 0 },
      { name: "Grande (12 oz)", name_en: "Large (12 oz)", extra: 0.80 }
    ],
    milks: ["Leche Entera Cremosa", "Avena Barista (+0.60)", "Almendra Tostada (+0.60)", "Deslactosada"],
    milks_en: ["Creamy Whole Milk", "Barista Oat Milk (+0.60)", "Roasted Almond (+0.60)", "Lactose-Free"],
    roast: "Tueste Medio Artesanal",
    roast_en: "Artisanal Medium Roast"
  },
  {
    id: "prod-2",
    name: "Nitro Cold Brew Infusion",
    name_en: "Nitro Cold Brew Infusion",
    category: "cold",
    price: 5.50,
    badge: "Destacado",
    badge_en: "Featured",
    rating: 5.0,
    reviewsCount: 98,
    description: "Macerado en frío por 20 horas e infusionado con microburbujas de nitrógeno puro para una textura similar a la cerveza artesanal stout.",
    description_en: "Cold-steeped for 20 hours and infused with pure nitrogen microbubbles for a velvety stout-like texture.",
    tastingNotes: ["Cacao puro", "Frutos rojos", "Acabado cremoso"],
    tastingNotes_en: ["Pure cocoa", "Red berries", "Creamy finish"],
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    customizable: true,
    sizes: [
      { name: "Grande (12 oz)", name_en: "Large (12 oz)", extra: 0 },
      { name: "Vaso XL (16 oz)", name_en: "XL Cup (16 oz)", extra: 1.00 }
    ],
    milks: ["Sin leche (Original)", "Cloud Foam de Vainilla (+0.75)", "Toque de Avena"],
    milks_en: ["Black (Original)", "Vanilla Cloud Foam (+0.75)", "Splash of Oat"],
    roast: "Tueste Ligero Kenia",
    roast_en: "Kenya Light Roast"
  },
  {
    id: "prod-3",
    name: "Iced Pistachio Latte",
    name_en: "Iced Pistachio Latte",
    category: "cold",
    price: 5.90,
    badge: "Temporada",
    badge_en: "Seasonal",
    rating: 4.9,
    reviewsCount: 87,
    description: "Crema de pistacho siciliano 100% natural, shot de espresso ristretto, leche de avena y lluvia de pistachos caramelizados.",
    description_en: "100% natural Sicilian pistachio cream, ristretto shot, oat milk and a sprinkle of crushed caramelized pistachios.",
    tastingNotes: ["Pistacho de Sicilia", "Miel de flor", "Espresso dulce"],
    tastingNotes_en: ["Sicilian pistachio", "Wildflower honey", "Sweet espresso"],
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    customizable: true,
    sizes: [
      { name: "Grande (12 oz)", name_en: "Large (12 oz)", extra: 0 },
      { name: "Vaso XL (16 oz)", name_en: "XL Cup (16 oz)", extra: 0.90 }
    ],
    milks: ["Avena Barista (Recomendada)", "Almendra", "Leche Entera"],
    milks_en: ["Barista Oat (Recommended)", "Almond", "Whole Milk"],
    roast: "Tueste Medio",
    roast_en: "Medium Roast"
  },
  {
    id: "prod-4",
    name: "Espresso Doble Origen",
    name_en: "Single Origin Double Espresso",
    category: "espresso",
    price: 3.60,
    badge: "Firma",
    badge_en: "Signature",
    rating: 4.8,
    reviewsCount: 165,
    description: "Extracción precisa a 9 bares de presión con ratio 1:2. Notas balanceadas con crema densa color avellana.",
    description_en: "Precise 9-bar pressure extraction at a 1:2 ratio. Balanced profile with dense hazelnut-toned crema.",
    tastingNotes: ["Flor de jazmín", "Cítrico brillante", "Panela"],
    tastingNotes_en: ["Jasmine flower", "Bright citrus", "Panela cane"],
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80",
    customizable: false,
    sizes: [{ name: "Doble Shot (60 ml)", name_en: "Double Shot (60 ml)", extra: 0 }],
    roast: "Tueste Especial Geisha Panamá",
    roast_en: "Panama Geisha Special Roast"
  },
  {
    id: "prod-5",
    name: "V60 Pour Over Artesanal",
    name_en: "Artisanal V60 Pour Over",
    category: "filtro",
    price: 5.20,
    badge: "De Autor",
    badge_en: "Specialty",
    rating: 5.0,
    reviewsCount: 76,
    description: "Filtrado manual gota a gota frente a ti utilizando agua a 92°C mineralizada con perfil específico para resaltar pureza.",
    description_en: "Manual pour over hand-brewed at 92°C with tailored mineral profile water to unlock origin brightness and sweet florals.",
    tastingNotes: ["Bergamota", "Durazno maduro", "Té negro floral"],
    tastingNotes_en: ["Bergamot", "Ripe peach", "Floral black tea"],
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    customizable: true,
    sizes: [
      { name: "Jarrita 300 ml", name_en: "300 ml Carafe", extra: 0 },
      { name: "Jarrita 500 ml (Para 2)", name_en: "500 ml Carafe (Serves 2)", extra: 2.20 }
    ],
    milks: ["Se sugiere degustar negro"],
    milks_en: ["Best enjoyed black"],
    roast: "Geisha / Huila Colombia",
    roast_en: "Geisha / Huila Colombia"
  },
  {
    id: "prod-6",
    name: "Croissant Francés de Almendras",
    name_en: "French Almond Croissant",
    category: "bakery",
    price: 4.20,
    badge: "Horneado Hoy",
    badge_en: "Fresh Baked",
    rating: 4.9,
    reviewsCount: 210,
    description: "Masa laminada con mantequilla pura de Normandía, relleno de frangipane casero y cubierto de almendras tostadas crujientes.",
    description_en: "Laminated pastry made with pure Normandy butter, filled with house frangipane and topped with toasted sliced almonds.",
    tastingNotes: ["Mantequilla dorada", "Almendra dulce", "Hojaldre crujiente"],
    tastingNotes_en: ["Golden butter", "Sweet almond", "Crisp flaky pastry"],
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    customizable: true,
    sizes: [
      { name: "Porción Individual", name_en: "Single Serving", extra: 0 }
    ],
    milks: [],
    milks_en: []
  },
  {
    id: "prod-7",
    name: "Avocado Toast con Masa Madre",
    name_en: "Sourdough Avocado Toast",
    category: "brunch",
    price: 7.80,
    badge: "Favorito Brunch",
    badge_en: "Brunch Favorite",
    rating: 4.8,
    reviewsCount: 114,
    description: "Pan de masa madre de fermentación natural (48 hrs), crema de aguacate hass, huevo pochado de libre pastoreo, dukkah y brotes orgánicos.",
    description_en: "48-hr slow-fermented artisan sourdough, crushed Hass avocado, free-range poached egg, Egyptian dukkah, and microgreens.",
    tastingNotes: ["Cremoso", "Toque cítrico de lima", "Semillas tostadas"],
    tastingNotes_en: ["Creamy", "Lime zest", "Toasted seeds"],
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    customizable: true,
    sizes: [
      { name: "Porción Completa", name_en: "Full Serving", extra: 0 }
    ]
  },
  {
    id: "prod-8",
    name: "Matcha Ceremonial Uji Latte",
    name_en: "Ceremonial Uji Matcha Latte",
    category: "cold",
    price: 5.60,
    badge: "100% Orgánico",
    badge_en: "100% Organic",
    rating: 4.9,
    reviewsCount: 130,
    description: "Matcha japonés Grado Ceremonial de primera cosecha de Kyoto, batido con chasen de bambú y leche emulsionada.",
    description_en: "First-harvest ceremonial grade Japanese matcha from Uji, Kyoto, whisked with a bamboo chasen and steamed microfoam milk.",
    tastingNotes: ["Umami suave", "Dulzor vegetal", "Final aterciopelado"],
    tastingNotes_en: ["Smooth umami", "Natural sweetness", "Velvety finish"],
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    customizable: true,
    sizes: [
      { name: "Caliente (10 oz)", name_en: "Hot (10 oz)", extra: 0 },
      { name: "Iced Frío (14 oz)", name_en: "Iced (14 oz)", extra: 0.50 }
    ],
    milks: ["Avena Barista", "Almendra", "Leche de Coco", "Entera"],
    milks_en: ["Barista Oat", "Almond", "Coconut Milk", "Whole Milk"]
  },
  {
    id: "prod-9",
    name: "Bolsa de Café en Grano - Huila Supremo (250g)",
    name_en: "Whole Bean Coffee Bag - Huila Supremo (250g)",
    category: "granos",
    price: 16.50,
    badge: "Edición Limitada",
    badge_en: "Limited Edition",
    rating: 5.0,
    reviewsCount: 64,
    description: "Café de origen único cosechado a 1,850 msnm. Beneficio lavado con fermentación prolongada. Tostado semanalmente en nuestro taller.",
    description_en: "Single-origin specialty coffee grown at 1,850 MASL. Fully washed with extended fermentation. Freshly roasted weekly in our roastery.",
    tastingNotes: ["Mandarina", "Miel de maple", "Chocolate 70%"],
    tastingNotes_en: ["Mandarin orange", "Maple syrup", "70% Dark chocolate"],
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80",
    customizable: true,
    sizes: [
      { name: "Bolsa 250 gramos", name_en: "250g Bag", extra: 0 },
      { name: "Bolsa 1 Kilogramo", name_en: "1 kg Bag", extra: 24.00 }
    ]
  }
];

// Sugerencias para Upselling en el Carrito (Bilingüe)
const UPSELL_PRODUCTS = [
  {
    id: "upsell-1",
    name: "Cookie de Chocolate Belga & Flor de Sal",
    name_en: "Belgian Chocolate & Sea Salt Cookie",
    price: 2.80,
    category: "bakery",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "upsell-2",
    name: "Shot Extra de Espresso Geisha",
    name_en: "Extra Shot of Geisha Espresso",
    price: 1.20,
    category: "espresso",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80"
  }
];

// Configuración general del negocio
const CAFE_CONFIG = {
  name: "AURA Specialty Coffee",
  tagline: "El arte del café, perfeccionado.",
  currency: "$",
  whatsappNumber: "5215500000000",
  phoneDisplay: "+52 (55) 8900-AURA",
  address: "Av. Paseo de la Reforma 412, Cuauhtémoc, CDMX",
  hours: "Lun - Dom: 7:00 AM – 9:00 PM",
  hours_en: "Mon - Sun: 7:00 AM – 9:00 PM",
  promoCode: "AURA15",
  promoDiscount: 0.15
};
