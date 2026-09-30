// Imports
import {db} from "./guitarras.js";
console.log(db)
// Variables
const container = document.querySelector('h2 + div')
const divCarrito = document.querySelector('#carrito')
const header = document.querySelector('.header')
let carrito = []

// Funciones
function createCard(guitar){
    const div = document.createElement('div')
    div.classList = 'col-md-6 col-lg-4 my-4 row align-items-center'
    const html = `<div class="col-4">
                    <img class="img-fluid" src="./public/img/${guitar.imagen}.jpg" alt="${guitar.nombre}">
                </div>
                <div class="col-8">
                    <h3 class="text-black fs-4 fw-bold text-uppercase">${guitar.nombre}</h3>
                    <p>${guitar.descripcion}</p>
                    <p class="fw-black text-primary fs-3">${guitar.precio}</p>
                    <button 
                    data-id="${guitar.id}"
                        type="button"
                        class="btn btn-dark w-100 "
                    >Agregar al Carrito</button>
                </div>`
    div.innerHTML = html
    return div
}

function drawCar(){
    const div = document.createElement('div')
    if(carrito.length === 0){
        div.innerHTML = `<p class="text-center">El carrito esta vacio</p>`
    }else{
        let html = `<table class="w-100 table">
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>`
        carrito.forEach(guitar => {
            html += `<tr>
                                        <td>
                                            <img class="img-fluid" src="./public/img/${guitar.imagen}.jpg" alt="${guitar.nombre}">
                                        </td>
                                        <td>${guitar.nombre}</td>
                                        <td class="fw-bold">
                                                $${guitar.precio}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                class="btn btn-dark"
                                                data-action="decrement"
                                                data-id="${guitar.id}"
                                            >
                                                -
                                            </button>
                                                ${guitar.cantidad}
                                            <button
                                                type="button"
                                                class="btn btn-dark"
                                                data-action="increment"
                                                data-id="${guitar.id}"
                                            > 
                                                +
                                            </button>
                                           
                                        </td>
                                        <td>
                                            <button
                                                class="btn btn-danger"
                                                type="button"
                                                data-action="remove"
                                                data-id="${guitar.id}"
                                            >
                                                X
                                            </button>
                                           
                                        </td>
                                    </tr>`
        })

        html += `</tbody>
                            </table>

                            <p class="text-end">Total pagar: <span class="fw-bold">$${carrito.reduce((total, guitar) => total + (guitar.precio * guitar.cantidad), 0).toFixed(2)}</span></p>
                            <button class="btn btn-dark w-100 mt-3 p-2" type="button" data-action="clear">Vaciar Carrito
                            </button>
                            `
        div.innerHTML = html
    }
     divCarrito.innerHTML = ''
     divCarrito.appendChild(div)                      
}

function getGuitar(e){
    if(e.target.closest('#carrito')) return
    if(e.target.classList.contains('btn')) {
        const id = e.target.getAttribute('data-id')
        const idselected = db.findIndex(g => g.id == Number(id))
        const idInCart = carrito
                        .findIndex(gInCart => gInCart.id == Number(id))
        if( idInCart === -1){
             carrito.push({
                ...db[idselected], 
                cantidad: 1
            })
        }else{
            
            carrito[idInCart].cantidad++
        }

        writeStorage()
       drawCar()
       
    }
    
}

function updateCart(e){
    const button = e.target.closest('button[data-action]')

    if(!button) return

    e.stopPropagation()

    const id = Number(button.dataset.id)
    const index = carrito.findIndex(guitar => guitar.id === id)

    if(button.dataset.action === 'clear'){
        carrito.length = 0
        writeStorage()
        drawCar()
        return
    }

    if(index === -1) return

    if(button.dataset.action === 'increment'){
        carrito[index].cantidad++
    }

    if(button.dataset.action === 'decrement'){
        carrito[index].cantidad--

        if(carrito[index].cantidad <= 0){
            carrito.splice(index, 1)
        }
    }

    if(button.dataset.action === 'remove'){
        carrito.splice(index, 1)
    }

    writeStorage()
    drawCar()
}

function readStorage(){
    const data = localStorage.getItem('carrito')
    carrito = data? JSON.parse(data) : []
    
}

function writeStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

db.forEach(guitar => {
    container.appendChild(createCard(guitar))
})

readStorage()
drawCar()
// Listeners
container.addEventListener('click', getGuitar)
header.addEventListener('click', getGuitar)
divCarrito.addEventListener('click', updateCart)