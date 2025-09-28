// backend/controllers/ordenController.js
const pool = require('../config/db');
const DB_SCHEMA = process.env.DB_SCHEMA || 'restaurante';

// 3. POST /ordenes/registrar
exports.registrarOrden = async (req, res) => {
    const { cliente_id, platillo_nombre, notes } = req.body;

    if (!cliente_id || !platillo_nombre) {
        return res.status(400).json({ error: 'Faltan campos requeridos: cliente_id y platillo_nombre.' });
    }

    try {
        // El campo 'estado' tiene el valor DEFAULT 'pendiente' en la DB
        const result = await pool.query(
            `INSERT INTO ${DB_SCHEMA}.ordenes (cliente_id, platillo_nombre, notes) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [cliente_id, platillo_nombre, notes]
        );

        res.status(201).json({ 
            message: 'Orden registrada exitosamente', 
            orden: result.rows[0] 
        });

    } catch (error) {
        console.error('Error al registrar orden:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar la orden.' });
    }
};

// 4. GET /ordenes/:clienteId
exports.listarOrdenesCliente = async (req, res) => {
    const { clienteId } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM ${DB_SCHEMA}.ordenes WHERE cliente_id = $1 ORDER BY creado DESC`,
            [clienteId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al listar órdenes:', error);
        res.status(500).json({ error: 'Error interno del servidor al listar las órdenes.' });
    }
};

// 5. PUT /ordenes/:id/estado
exports.actualizarEstadoOrden = async (req, res) => {
    const { id } = req.params;

    try {
        const currentOrder = await pool.query(`SELECT estado FROM ${DB_SCHEMA}.ordenes WHERE id = $1`, [id]);
        
        if (currentOrder.rows.length === 0) {
            return res.status(404).json({ error: 'Orden no encontrada.' });
        }

        const currentState = currentOrder.rows[0].estado;
        let newState;

        // Lógica de transición de estado: pending -> preparing -> delivered
        switch (currentState) {
            case 'pendiente':
                newState = 'preparando';
                break;
            case 'preparando':
                newState = 'delivered';
                break;
            case 'delivered':
                return res.status(400).json({ message: 'La orden ya fue entregada, no se puede cambiar más el estado.' });
            default:
                return res.status(400).json({ error: 'Estado de orden desconocido.' });
        }

        const result = await pool.query(
            `UPDATE ${DB_SCHEMA}.ordenes SET estado = $1 WHERE id = $2 RETURNING *`,
            [newState, id]
        );

        res.json({ 
            message: `Estado actualizado a '${newState}'`, 
            orden: result.rows[0] 
        });

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el estado.' });
    }
};