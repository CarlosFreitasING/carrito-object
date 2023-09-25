console.log("CONECTADO");

/* <li class="list-group-item d-flex justify-content-between align-items-center">
    <span class="lead">Frutilla</span>
    <span class="badge bg-primary rounded-pill">12</span>
</li> */

const carrito = document.getElementById('carrito');
const template = document.getElementById('template');
const fragment = document.createDocumentFragment();
const btnBotones = document.querySelectorAll('.card .btn');

const carritoObjeto = {};

const agregarAlCarrito = (e) => {
    //console.log(e.target.dataset.fruta); 
    const producto = {
        titulo: e.target.dataset.fruta,
        id: e.target.dataset.fruta,
        cantidad: 1
    };

    if(carritoObjeto.hasOwnProperty(producto.titulo)){
        producto.cantidad = carritoObjeto[producto.titulo].cantidad + 1;
    };
    
    carritoObjeto[producto.titulo] = producto; //carrito = {fresa = {titulo: fresa, id: fresa, cantidad: 1} }

    pintarCarrito();
};

const pintarCarrito = () => {
    carrito.textContent =""; //recetea el ul
    //Object.values(carrito) devuelve un array con todas las propiedades del objeto carrito. [titulo: fresa, id: fresa, cantidad:1],[...] = [0],[1]
    Object.values(carritoObjeto).forEach(item => { 
        const clone = template.content.firstElementChild.cloneNode(true); //creo el clon del template
        clone.querySelector('.lead').textContent = item.titulo; //inserto el titulo en el clon del template
        clone.querySelector('.badge').textContent = item.cantidad; //inserto la cantidad del clon del template

        fragment.appendChild(clone); //agrego el template clon editado al fragment para evitar reflow
    });
    carrito.appendChild(fragment); //cuando termina ahora si agredo el fragmento al carrito del DOM 
}

btnBotones.forEach((btn) => btn.addEventListener("click",agregarAlCarrito)); //agrego un adeventlistener a cada boton

