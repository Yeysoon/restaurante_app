// backend/controllers/clienteController.js
const pool = require('../config/db');
const DB_SCHEMA = process.env.DB_SCHEMA || 'restaurante';

// 1. POST /clientes/registrar
exports.registrarCliente = async (req, res) => {
    const { nombre, email, telefono } = req.body;

    if (!nombre || !email || !telefono) {
        return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email y teléfono.' });
    }

    try {
        // Validación de unicidad de email (aunque la DB lo hace, es mejor validar antes)
        const checkEmail = await pool.query(
            `SELECT id FROM ${DB_SCHEMA}.clientes WHERE email = $1`,
            [email]
        );

        if (checkEmail.rows.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado.' });
        }

        // Inserción del nuevo cliente
        const result = await pool.query(
            `INSERT INTO ${DB_SCHEMA}.clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING id, nombre, email`,
            [nombre, email, telefono]
        );

        res.status(201).json({ 
            message: 'Cliente registrado exitosamente', 
            cliente: result.rows[0] 
        });

    } catch (error) {
        console.error('Error al registrar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar.' });
    }
};

// 2. POST /clientes/login (Simulación de acceso)
exports.loginCliente = async (req, res) => {
    const { email, telefono } = req.body;

    if (!email || !telefono) {
        return res.status(400).json({ error: 'Debe proporcionar email y teléfono.' });
    }

    try {
        const result = await pool.query(
            `SELECT id, nombre, email FROM ${DB_SCHEMA}.clientes WHERE email = $1 AND telefono = $2`,
            [email, telefono]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Éxito: Retorna los datos del cliente, incluyendo el ID necesario para las órdenes.
        res.json({ 
            message: 'Acceso exitoso', 
            cliente: result.rows[0] 
        });

    } catch (error) {
        console.error('Error al intentar login:', error);
        res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
    }
};