// app.js
import { db } from './guitarras.js';

document.addEventListener('DOMContentLoaded', () => {
    const 
        carritoContenedor = document.querySelector('#carrito tbody'),
        totalPagarHTML = document.querySelector('.text-end .fw-bold'),
        totalPagarContenedor = document.querySelector('.text-end'),
        tablaCarrito = document.querySelector('#carrito table'),
        vaciarCarritoBtn = document.querySelector('#vaciar-carrito'),
        mensajeVacio = document.querySelector('#carrito > p'),
        btnLukather = document.querySelector('#btn-lukather');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificamos que el botón exista antes de agregarle el evento
    if (btnLukather) {
        btnLukather.addEventListener('click', (e) => {
            e.preventDefault();
            agregarGuitarraLukather();
        });
    }

    sincronizarCarrito();

    function agregarGuitarraLukather() {
        // Buscamos la guitarra Lukather en la base de datos (id 1)
        const guitarraLukather = db.find(g => g.id === 1);
        
        if (!guitarraLukather) return;

        const existe = carrito.some(guitarra => guitarra.id === guitarraLukather.id);
        
        if (existe) {
            carrito = carrito.map(guitarra => {
                if (guitarra.id === guitarraLukather.id) {
                    guitarra.cantidad++;
                }
                return guitarra;
            });
        } else {
            const nuevaGuitarra = { ...guitarraLukather, cantidad: 1 };
            carrito.push(nuevaGuitarra);
        }

        sincronizarCarrito();
    }

    function sincronizarCarrito() {
        limpiarHTML();
        
        if (carrito.length === 0) {
            mensajeVacio.style.display = 'block';
            if (tablaCarrito) tablaCarrito.style.display = 'none';
            if (totalPagarContenedor) totalPagarContenedor.style.display = 'none';
            if (vaciarCarritoBtn) vaciarCarritoBtn.style.display = 'none';
        } else {
            mensajeVacio.style.display = 'none';
            if (tablaCarrito) tablaCarrito.style.display = 'table';
            if (totalPagarContenedor) totalPagarContenedor.style.display = 'block';
            if (vaciarCarritoBtn) vaciarCarritoBtn.style.display = 'block';

            let total = 0;

            carrito.forEach(guitarra => {
                const { id, imagen, nombre, precio, cantidad } = guitarra;
                total += precio * cantidad;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img class="img-fluid" src="./public/img/${imagen}.jpg" alt="imagen guitarra" width="60">
                    </td>
                    <td>${nombre}</td>
                    <td class="fw-bold">$${precio}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <button type="button" class="btn btn-dark btn-sm restar" data-id="${id}">-</button>
                            <span>${cantidad}</span>
                            <button type="button" class="btn btn-dark btn-sm sumar" data-id="${id}">+</button>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm borrar" type="button" data-id="${id}">X</button>
                    </td>
                `;
                carritoContenedor.appendChild(row);
            });

            if (totalPagarHTML) totalPagarHTML.textContent = `$${total}`;
        }

        sincronizarStorage();
        agregarEventosAccionesCarrito();
    }

    function sincronizarStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function limpiarHTML() {
        while (carritoContenedor.firstChild) {
            carritoContenedor.removeChild(carritoContenedor.firstChild);
        }
    }

    function agregarEventosAccionesCarrito() {
        // Botones Sumar (+)
        document.querySelectorAll('.sumar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                carrito = carrito.map(item => {
                    if (item.id === id) item.cantidad++;
                    return item;
                });
                sincronizarCarrito();
            });
        });

        // Botones Restar (-)
        document.querySelectorAll('.restar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                carrito = carrito.map(item => {
                    if (item.id === id && item.cantidad > 1) {
                        item.cantidad--;
                    }
                    return item;
                });
                sincronizarCarrito();
            });
        });

        // Botón Borrar individual (X)
        document.querySelectorAll('.borrar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                carrito = carrito.filter(item => item.id !== id);
                sincronizarCarrito();
            });
        });
    }

    // Vaciar Carrito completo
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener('click', () => {
            carrito = [];
            sincronizarCarrito();
        });
    }
});