const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');

// Asegurar existencia de directorio data
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp'
};

// Sesiones en memoria: token -> { userId, role, expiresAt }
const ACTIVE_SESSIONS = new Map();

// Helper para leer archivos JSON de forma segura
function readJsonFile(filename, defaultValue) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error leyendo ${filename}:`, err);
    return defaultValue;
  }
}

// Helper para guardar archivos JSON
function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error escribiendo ${filename}:`, err);
    return false;
  }
}

// Helper para hashear contraseñas
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper para parsear JSON body de peticiones HTTP
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB límite
        req.destroy();
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

// Enviar respuesta JSON estandarizada
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

// Obtener usuario autenticado por token en cabecera
function getAuthenticatedUser(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const session = ACTIVE_SESSIONS.get(token);
  if (!session) return null;

  const users = readJsonFile('users.json', []);
  return users.find(u => u.id === session.userId) || null;
}

// Manejador del Servidor HTTP
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(urlObj.pathname);
  const method = req.method.toUpperCase();

  // Responder preflight OPTIONS para CORS
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // ==========================================
  // RUTAS DE LA API REST (/api/*)
  // ==========================================
  if (pathname.startsWith('/api/')) {
    try {
      // 1. REGISTRO DE CLIENTES
      if (pathname === '/api/auth/register' && method === 'POST') {
        const body = await parseBody(req);
        const { name, email, password, phone } = body;

        if (!name || !email || !password) {
          return sendJson(res, 400, { success: false, message: 'Nombre, email y contraseña requeridos' });
        }

        const users = readJsonFile('users.json', []);
        const cleanEmail = email.trim().toLowerCase();

        if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
          return sendJson(res, 409, { success: false, message: 'El correo electrónico ya está registrado' });
        }

        const newUser = {
          id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: name.trim(),
          email: cleanEmail,
          passwordHash: hashPassword(password),
          role: 'client',
          phone: phone ? phone.trim() : '',
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        writeJsonFile('users.json', users);

        // Crear token de sesión
        const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
        ACTIVE_SESSIONS.set(token, { userId: newUser.id, role: newUser.role });

        const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone };
        return sendJson(res, 201, { success: true, user: safeUser, token });
      }

      // 2. INICIO DE SESIÓN (CLIENTES Y ADMIN)
      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseBody(req);
        const { email, password } = body;

        if (!email || !password) {
          return sendJson(res, 400, { success: false, message: 'Email y contraseña requeridos' });
        }

        const users = readJsonFile('users.json', []);
        const cleanEmail = email.trim().toLowerCase();
        const pwdHash = hashPassword(password);

        const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.passwordHash === pwdHash);

        if (!user) {
          return sendJson(res, 401, { success: false, message: 'Credenciales incorrectas' });
        }

        // Crear token de sesión
        const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
        ACTIVE_SESSIONS.set(token, { userId: user.id, role: user.role });

        const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
        return sendJson(res, 200, { success: true, user: safeUser, token });
      }

      // 3. CONSULTAR SESIÓN ACTUAL
      if (pathname === '/api/auth/me' && method === 'GET') {
        const user = getAuthenticatedUser(req);
        if (!user) {
          return sendJson(res, 401, { success: false, message: 'No autenticado' });
        }
        const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
        return sendJson(res, 200, { success: true, user: safeUser });
      }

      // 4. CONFIGURACIÓN PÚBLICA DE GOOGLE PAY (PARA CHECKOUT DE CLIENTE)
      if (pathname === '/api/settings/google-pay' && method === 'GET') {
        const settings = readJsonFile('settings.json', {});
        const gpay = settings.googlePay || { enabled: true, environment: 'TEST', merchantName: 'AURA Coffee Co.' };
        // Devolvemos solo datos seguros para el frontend de compra
        return sendJson(res, 200, {
          success: true,
          googlePay: {
            enabled: gpay.enabled !== false,
            environment: gpay.environment || 'TEST',
            merchantId: gpay.merchantId || '12345678901234567890',
            merchantName: gpay.merchantName || 'AURA Coffee Co.',
            gateway: gpay.gateway || 'example',
            gatewayMerchantId: gpay.gatewayMerchantId || 'aura_coffee_production_gw'
          }
        });
      }

      // 5. CONFIGURACIÓN COMPLETA DE GOOGLE PAY Y LLAVES API (ADMIN)
      if (pathname === '/api/admin/settings/google-pay') {
        if (method === 'GET') {
          // El admin puede ver la configuración actual incluyendo su API key
          const settings = readJsonFile('settings.json', {});
          return sendJson(res, 200, { success: true, googlePay: settings.googlePay || {} });
        }
        if (method === 'POST') {
          const body = await parseBody(req);
          const settings = readJsonFile('settings.json', {});
          
          settings.googlePay = {
            enabled: body.enabled !== false,
            environment: body.environment === 'PRODUCTION' ? 'PRODUCTION' : 'TEST',
            merchantId: body.merchantId ? body.merchantId.trim() : '',
            merchantName: body.merchantName ? body.merchantName.trim() : 'AURA Coffee Co.',
            gateway: body.gateway ? body.gateway.trim() : 'example',
            gatewayMerchantId: body.gatewayMerchantId ? body.gatewayMerchantId.trim() : '',
            apiKey: body.apiKey ? body.apiKey.trim() : ''
          };

          writeJsonFile('settings.json', settings);
          console.log('✅ Credenciales de Google Pay actualizadas en Admin:', settings.googlePay.environment);
          return sendJson(res, 200, { success: true, message: 'Credenciales guardadas con éxito', googlePay: settings.googlePay });
        }
      }

      // 6. CREAR O CONSULTAR ÓRDENES DE COMPRA
      if (pathname === '/api/orders') {
        // GET: Listar pedidos (filtrados por usuario o todos si es admin)
        if (method === 'GET') {
          const orders = readJsonFile('orders.json', []);
          const authUser = getAuthenticatedUser(req);
          const userEmailQuery = urlObj.searchParams.get('email');
          const userIdQuery = urlObj.searchParams.get('userId');

          // Si es admin o se pide sin filtro de usuario (para la vista admin)
          if ((authUser && authUser.role === 'admin') || urlObj.searchParams.get('all') === 'true') {
            return sendJson(res, 200, { success: true, orders });
          }

          // Si es cliente, filtrar por sus identificadores
          let filtered = orders;
          if (authUser) {
            filtered = orders.filter(o => o.userId === authUser.id || o.customerEmail === authUser.email);
          } else if (userEmailQuery) {
            filtered = orders.filter(o => o.customerEmail === userEmailQuery);
          } else if (userIdQuery) {
            filtered = orders.filter(o => o.userId === userIdQuery);
          }

          return sendJson(res, 200, { success: true, orders: filtered });
        }

        // POST: Procesar nueva compra / orden
        if (method === 'POST') {
          const body = await parseBody(req);
          const {
            userId,
            customerName,
            customerPhone,
            customerEmail,
            items,
            subtotal,
            discount,
            total,
            coupon,
            deliveryMode,
            paymentMethod,
            paymentDetails
          } = body;

          if (!items || !Array.isArray(items) || items.length === 0) {
            return sendJson(res, 400, { success: false, message: 'La orden no contiene productos' });
          }

          const orders = readJsonFile('orders.json', []);
          const orderId = `ORD-${Date.now().toString().slice(-6)}`;

          const newOrder = {
            id: orderId,
            userId: userId || null,
            customerName: customerName || 'Cliente AURA',
            customerPhone: customerPhone || '',
            customerEmail: customerEmail || '',
            items: items,
            subtotal: Number(subtotal || 0),
            discount: Number(discount || 0),
            total: Number(total || 0),
            coupon: coupon || null,
            deliveryMode: deliveryMode || 'pickup',
            paymentMethod: paymentMethod || 'google_pay',
            paymentStatus: paymentMethod === 'google_pay' || paymentMethod === 'apple_pay' ? 'paid' : 'pending',
            paymentDetails: paymentDetails || null,
            orderStatus: 'preparando', // Pasa a cocina de inmediato
            createdAt: new Date().toISOString()
          };

          orders.unshift(newOrder); // Las más recientes primero
          writeJsonFile('orders.json', orders);
          console.log(`🛍️ Nueva orden creada: ${orderId} (${newOrder.customerName}) - $${newOrder.total}`);

          return sendJson(res, 201, { success: true, order: newOrder });
        }
      }

      // 7. ACTUALIZAR ESTADO DE LA ORDEN (ADMIN)
      if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && (method === 'PATCH' || method === 'POST')) {
        const parts = pathname.split('/');
        const orderId = parts[3];
        const body = await parseBody(req);
        const { status } = body;

        const validStatuses = ['pendiente', 'preparando', 'listo', 'entregado', 'completado', 'cancelado'];
        if (!validStatuses.includes(status)) {
          return sendJson(res, 400, { success: false, message: 'Estado no válido' });
        }

        const orders = readJsonFile('orders.json', []);
        const order = orders.find(o => o.id === orderId);
        if (!order) {
          return sendJson(res, 404, { success: false, message: 'Orden no encontrada' });
        }

        order.orderStatus = status;
        order.updatedAt = new Date().toISOString();
        writeJsonFile('orders.json', orders);

        return sendJson(res, 200, { success: true, order });
      }

      // 8. ESTADÍSTICAS PARA EL DASHBOARD ADMINISTRATIVO
      if (pathname === '/api/admin/stats' && method === 'GET') {
        const orders = readJsonFile('orders.json', []);
        const users = readJsonFile('users.json', []);

        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const totalOrders = orders.length;
        const totalClients = users.filter(u => u.role === 'client').length;
        
        // Métricas de métodos de pago
        const paymentCounts = {};
        orders.forEach(o => {
          const pm = o.paymentMethod || 'otro';
          paymentCounts[pm] = (paymentCounts[pm] || 0) + 1;
        });

        // Pedidos activos (preparando o listo)
        const activeOrders = orders.filter(o => o.orderStatus === 'preparando' || o.orderStatus === 'listo');

        return sendJson(res, 200, {
          success: true,
          stats: {
            totalRevenue,
            totalOrders,
            totalClients,
            activeOrdersCount: activeOrders.length,
            averageTicket: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
            paymentCounts
          }
        });
      }

      // 9. CONFIGURACIÓN Y BASE DE CONOCIMIENTO DEL CHATBOT
      if (pathname === '/api/chatbot/config' && method === 'GET') {
        const knowledge = readJsonFile('chatbot-knowledge.json', {});
        return sendJson(res, 200, { success: true, data: knowledge });
      }

      // 10. MENSAJES DE CONTACTO / ATENCIÓN HUMANA DESDE EL CHATBOT
      if (pathname === '/api/chatbot/messages') {
        if (method === 'GET') {
          const messages = readJsonFile('contact-messages.json', []);
          return sendJson(res, 200, { success: true, messages });
        }
        if (method === 'POST') {
          const body = await parseBody(req);
          const { name, contact, subject, message } = body;

          if (!message || !message.trim()) {
            return sendJson(res, 400, { success: false, message: 'El mensaje no puede estar vacío.' });
          }

          const messages = readJsonFile('contact-messages.json', []);
          const newMsg = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: name ? name.trim() : 'Cliente Anónimo',
            contact: contact ? contact.trim() : 'Sin contacto especificado',
            subject: subject ? subject.trim() : 'Consulta desde Chatbot',
            message: message.trim(),
            status: 'pending',
            createdAt: new Date().toISOString()
          };

          messages.unshift(newMsg);
          writeJsonFile('contact-messages.json', messages);
          console.log(`📩 Mensaje para barista/humano recibido de: ${newMsg.name}`);

          return sendJson(res, 201, {
            success: true,
            message: 'Mensaje recibido con éxito. Nuestro personal se comunicará contigo.',
            data: newMsg
          });
        }
      }

      return sendJson(res, 404, { success: false, message: 'Endpoint no encontrado' });
    } catch (apiError) {
      console.error('Error procesando API:', apiError);
      return sendJson(res, 500, { success: false, message: 'Error interno del servidor', error: apiError.message });
    }
  }

  // ==========================================
  // SERVIDOR DE ARCHIVOS ESTÁTICOS (HTML, CSS, JS)
  // ==========================================
  let safePath = pathname;
  if (safePath === '/') {
    safePath = '/index.html';
  } else if (safePath === '/admin') {
    safePath = '/admin.html';
  }

  const filePath = path.join(BASE_DIR, safePath);

  // Evitar directory traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Prohibido');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Archivo no encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`☕ AURA Café - Servidor y REST API en ejecución`);
  console.log(`🚀 Tienda Cliente:        http://localhost:${PORT}`);
  console.log(`⚙️ Panel de Administración: http://localhost:${PORT}/admin.html`);
  console.log(`💳 Google Pay Endpoint:   http://localhost:${PORT}/api/settings/google-pay`);
  console.log(`====================================================`);
});
