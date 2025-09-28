// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

// Configuración de la conexión a PostgreSQL
// Usa la DATABASE_URL provista por Render (o en .env local)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Opciones SSL requeridas para conexiones externas (Render)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
    console.log('✅ Conectado exitosamente a PostgreSQL.');
});

pool.on('error', (err) => {
    console.error('❌ Error fatal al conectar con PostgreSQL:', err);
});

module.exports = pool;