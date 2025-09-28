// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' }); // Cargar variables

// Importar el Pool de la DB (inicializa la conexión)
const db = require('./backend/config/db'); 

// Importar rutas
const clienteRoutes = require('./backend/routes/clienteRoutes');
const ordenRoutes = require('./backend/routes/ordenRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permitir peticiones de origen cruzado (importante para el frontend)
app.use(express.json()); // Habilitar la lectura de JSON en el cuerpo de la petición

// Servir archivos estáticos del Frontend
// Esto permite que el backend sirva el frontend desde la ruta raíz /
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de la API
app.use('/clientes', clienteRoutes);
app.use('/ordenes', ordenRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
    res.json({ message: 'API de Restaurante funcionando.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
    console.log(`Accede al frontend en http://localhost:${PORT}`);
});