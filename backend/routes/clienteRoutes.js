// backend/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// 1. POST /clientes/registrar
router.post('/registrar', clienteController.registrarCliente);

// 2. POST /clientes/login
router.post('/login', clienteController.loginCliente);

module.exports = router;