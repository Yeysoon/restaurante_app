// frontend/js/api.js
const API_BASE_URL = window.location.origin; // Usar la URL base donde se sirve el frontend

const API = {
    // 1. POST /clientes/registrar
    registrarCliente: (data) => fetch(`${API_BASE_URL}/clientes/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // 2. POST /clientes/login
    loginCliente: (data) => fetch(`${API_BASE_URL}/clientes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // 3. POST /ordenes/registrar
    registrarOrden: (data) => fetch(`${API_BASE_URL}/ordenes/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // 4. GET /ordenes/:clienteId
    listarOrdenes: (clienteId) => fetch(`${API_BASE_URL}/ordenes/${clienteId}`),

    // 5. PUT /ordenes/:id/estado
    actualizarEstado: (orderId) => fetch(`${API_BASE_URL}/ordenes/${orderId}/estado`, {
        method: 'PUT'
    }).then(res => res.json()),
};