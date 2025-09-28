// backend/routes/ordenRoutes.js
const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenController');

// 3. POST /ordenes/registrar
router.post('/registrar', ordenController.registrarOrden);

// 4. GET /ordenes/:clienteId
router.get('/:clienteId', ordenController.listarOrdenesCliente);

// 5. PUT /ordenes/:id/estado
router.put('/:id/estado', ordenController.actualizarEstadoOrden);

module.exports = router;