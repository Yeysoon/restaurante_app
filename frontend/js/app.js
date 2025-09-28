// frontend/js/app.js

const app = {
    cliente: null,
    
    // Función para manejar el registro de cliente
    async handleRegister() {
        const nombre = document.getElementById('reg-nombre').value;
        const email = document.getElementById('reg-email').value;
        const telefono = document.getElementById('reg-telefono').value;
        const message = document.getElementById('auth-message');
        message.textContent = '';

        try {
            const result = await API.registrarCliente({ nombre, email, telefono });
            
            if (result.error) {
                message.textContent = `Error: ${result.error}`;
                message.style.color = 'red';
            } else {
                message.textContent = `Registro exitoso para ${result.cliente.nombre}. ¡Ahora puedes iniciar sesión!`;
                message.style.color = 'green';
                // Limpiar formulario de registro
                document.getElementById('reg-nombre').value = '';
                document.getElementById('reg-email').value = '';
                document.getElementById('reg-telefono').value = '';
            }
        } catch (error) {
            message.textContent = 'Error de conexión con el servidor.';
            message.style.color = 'red';
        }
    },

    // Función para manejar el inicio de sesión
    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const telefono = document.getElementById('login-telefono').value;
        const message = document.getElementById('auth-message');
        message.textContent = '';

        try {
            const response = await API.loginCliente({ email, telefono });

            if (response.error) {
                message.textContent = `Error: ${response.error}`;
                message.style.color = 'red';
                this.cliente = null;
            } else {
                this.cliente = response.cliente;
                this.renderApp();
            }
        } catch (error) {
            message.textContent = 'Error de conexión con el servidor.';
            message.style.color = 'red';
        }
    },

    // Función para manejar la creación de una orden
    async handleCreateOrder() {
        if (!this.cliente) return;

        const platillo_nombre = document.getElementById('order-platillo').value;
        const notes = document.getElementById('order-notes').value;
        const message = document.getElementById('order-message');
        message.textContent = '';

        if (!platillo_nombre) {
            message.textContent = 'Por favor, ingrese el nombre del platillo.';
            message.style.color = 'red';
            return;
        }

        try {
            const result = await API.registrarOrden({ 
                cliente_id: this.cliente.id, 
                platillo_nombre, 
                notes 
            });

            if (result.error) {
                message.textContent = `Error al crear orden: ${result.error}`;
                message.style.color = 'red';
            } else {
                message.textContent = `Orden #${result.orden.id} creada como 'pendiente'.`;
                message.style.color = 'green';
                document.getElementById('order-platillo').value = '';
                document.getElementById('order-notes').value = '';
                this.loadOrders(); // Recargar la lista de órdenes
            }
        } catch (error) {
            message.textContent = 'Error al intentar crear la orden.';
            message.style.color = 'red';
        }
    },

    // Función para manejar el avance del estado de una orden
    async handleStatusUpdate(orderId) {
        if (!confirm(`¿Desea cambiar el estado de la orden #${orderId}?`)) return;

        try {
            const result = await API.actualizarEstado(orderId);
            
            if (result.error) {
                alert(`Error: ${result.error}`);
            } else {
                alert(result.message);
                this.loadOrders(); // Recargar la lista de órdenes
            }
        } catch (error) {
            alert('Error al intentar actualizar el estado.');
        }
    },

    // Cargar y mostrar las órdenes del cliente actual
    async loadOrders() {
        if (!this.cliente) return;
        const tableBody = document.querySelector('#orders-table tbody');
        const listMessage = document.getElementById('list-message');
        tableBody.innerHTML = '';
        listMessage.textContent = 'Cargando...';

        try {
            const response = await API.listarOrdenes(this.cliente.id);
            const orders = await response.json();
            
            if (orders.error) {
                listMessage.textContent = `Error: ${orders.error}`;
            } else if (orders.length === 0) {
                listMessage.textContent = 'No tiene órdenes registradas.';
            } else {
                listMessage.textContent = '';
                orders.forEach(order => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = order.id;
                    row.insertCell().textContent = order.platillo_nombre;
                    row.insertCell().textContent = order.estado;
                    row.insertCell().textContent = new Date(order.creado).toLocaleDateString();

                    const actionCell = row.insertCell();
                    if (order.estado !== 'delivered') {
                        const button = document.createElement('button');
                        button.textContent = order.estado === 'pendiente' ? 'A Preparación' : 'A Entregado';
                        button.onclick = () => this.handleStatusUpdate(order.id);
                        actionCell.appendChild(button);
                    } else {
                        actionCell.textContent = 'Finalizado';
                    }
                });
            }
        } catch (error) {
            listMessage.textContent = 'Error al cargar las órdenes.';
        }
    },

    // Manejar el cierre de sesión
    handleLogout() {
        this.cliente = null;
        this.renderApp();
    },

    // Renderizar la interfaz según el estado de autenticación
    renderApp() {
        const authSection = document.getElementById('auth-section');
        const appSection = document.getElementById('app-section');
        const welcomeName = document.getElementById('welcome-name');

        if (this.cliente) {
            authSection.style.display = 'none';
            appSection.style.display = 'block';
            welcomeName.textContent = this.cliente.nombre;
            this.loadOrders();
        } else {
            authSection.style.display = 'block';
            appSection.style.display = 'none';
            document.getElementById('auth-message').textContent = '';
        }
    }
};

// Inicializar la aplicación al cargar
window.onload = () => {
    app.renderApp(); 
};