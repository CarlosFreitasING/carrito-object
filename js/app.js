console.log("CONECTADO");

/* <li class="list-group-item d-flex justify-content-between align-items-center">
    <span class="lead">Frutilla</span>
    <span class="badge bg-primary rounded-pill">12</span>
</li> */

const carrito = document.getElementById('carrito');
const template = document.getElementById('template');
const footer = document.getElementById('footer')
const templateFooter = document.getElementById('templateFooter')
const fragment = document.createDocumentFragment();
const btnBotones = document.querySelectorAll('#main .card .btn');

let carritoObjeto = {};

const agregarAlCarrito = (e) => { //e es el elemento que clikie, e.target su html
    //Creo el Obj. producto
    const producto = {
        titulo: e.target.dataset.fruta,
        id: e.target.dataset.fruta,
        cantidad: 1,
        precio: parseInt(e.target.dataset.precio)
    };

    //Confirmo si ya esta en el carrito.
    //Si esta compruebo cuanta cantidad hay y se la sumo +1 al producto. 
    if(carritoObjeto.hasOwnProperty(producto.titulo)){
        producto.cantidad = carritoObjeto[producto.titulo].cantidad + 1;
    };
    
    //Meto Obj. Producto en Obj. Carrito. (si el obj. ya esta dentro se sobreescribe)
    carritoObjeto[producto.titulo] = producto; 
    //carrito = {fresa = {titulo: fresa, id: fresa, cantidad: 1} }

    //Mando a pintar en el HTML el carrito.
    pintarCarrito();
};

const pintarCarrito = () => {
    carrito.textContent =""; //Receteo el ul
    
    //Recorro el objCarrito para pintar un li con su información:
    //Object.values(carrito) devuelve un array con todas las propiedades del objeto carrito. [titulo: fresa, id: fresa, cantidad:1],[...] = [0],[1]
    Object.values(carritoObjeto).forEach(item => { 
        const clone = template.content.cloneNode(true); //creo el clon del template
        clone.querySelector('.lead').textContent = item.titulo; //inserto el titulo en el clon del template
        clone.querySelector('.badge').textContent = item.cantidad; //inserto la cantidad del clon del template
        clone.querySelector('div .lead span').textContent = item.precio * item.cantidad;

        clone.querySelector(".btn-success").dataset.id = item.id; //agrego un dataset-id al boton
        clone.querySelector(".btn-danger").dataset.id = item.id;  //agrego un dataset-id al boton

        fragment.appendChild(clone); //agrego el template clon editado al fragment para evitar reflow
    });
    carrito.appendChild(fragment); //cuando termina ahora si agredo el fragmento al carrito del DOM 

    //Mando a pintar el footer que acompañara al carrito
    pintarFooter();
};

    const pintarFooter = () => {
        footer.textContent = ""; //Receteo el footer

        let total = 0;
        //Recorro el objCarrito para pintar la info del footer
        //Object.values(carrito) devuelve un array con todas las propiedades del objeto carrito. [titulo: fresa, id: fresa, cantidad:1],[...] = [0],[1]
        Object.values(carritoObjeto).forEach((item) => {
            total = total + (item.cantidad * item.precio)
        });
        
        if(total === 0){ //Cuando el monto sea 0 no hay porque mostrar el footer
            footer.textContent = ""; //Receteo el footer
        }else{ //Si no es 0 agrego los valores al footer
            const clone = templateFooter.content.cloneNode(true); //creo el clon del templatefooter
            clone.querySelector('span').textContent = total;  //agrego el total al templatefooter
            
            footer.appendChild(clone); //empujo directo al footer porque no es un ciclo repetitivo y no vale la pena usar fragment
        };
    };

    //FUNCIONES DE LOS BOTONES: 

    const btnAumentar = ((e)=>{
        //Creo un array de objetos "copia" del objCarrito que dentro tiene obj.Productos
        carritoArray = (Object.values(carritoObjeto)); //[{F}][{M}][{P}] = Object.values({{F},{M},{P}}) 
        // (Me aprovecho de que js no copia el valor de objetos complejos como array, obj o funciones
        // entonces, el nuevo array contiene referencias a los objetos originales. 
        //Esto significa que si editas un objeto en el nuevo array, también se modificará el objeto original.)
        
        //Recorro el arreglo de objetos buscando el que presiono el usuario para sumarle +1
        carritoArray = carritoArray.map((item => { //map itera sobre un array y devuelve un array nuevo editado como tu quieras
            if(item.id === e.target.dataset.id){
                item.cantidad ++;
            };
            return item; 
        }));
        //Actualizo el carrito
        pintarCarrito();
    });

    const btnDisminuir = ((e) => {
        //Creo un array de objetos "copia" del objCarrito que dentro tiene obj.Productos
        carritoArray = (Object.values(carritoObjeto));
        //(me aprovecho igual que arriba).

        //Recorreo el arreglo de objetos buscando el que presiono el usuario para restarle -1 y si es 0 eliminarlo
        carritoArray = carritoArray.filter(item => {
            if(item.id === e.target.dataset.id){
                if(item.cantidad > 0){
                    item.cantidad --;
                    if(item.cantidad === 0){
                        delete carritoObjeto[item.id]; //eliminar del array referencia no elimina del obj padre. 
                        return;                        //Por lo que lo borro directamente con el id del item
                    }else{
                        return item;
                    };
                }
            }else{
                return item;
            };
        });
        //Actualizo el carrito
        pintarCarrito();
    });

    const btnCompra = ((e) => {
        //Receteo el objeto carrito para vaciarlo
        carritoObjeto = {};
        //Mando a actualizar el carrito y el footer para que se borren
        pintarCarrito();
    });

//Como estos botones ya existen puedo capturarlos y crear un evento para cada uno. 
btnBotones.forEach((btn) => btn.addEventListener("click",agregarAlCarrito)); //agrego un adeventlistener a cada boton

//Pero Agregar y Eliminar son de TEMPLATE y Finalizar compra de TEMPLATEFOOTER.
//No puedo capturarlos tan facil antes de que se pinten en el html.
//Por eso hago uso de DELEGACIÓN DE EVENTOS.
document.addEventListener('click', e => {
    //(1) Detectar con matches si el target cuadra con una especificacion css: 
    //console.log(e.target.matches(".list-group-item .btn-success")); retorna true si cuadra / false si no
    if(e.target.matches("#carrito .list-group-item .btn-success")){
        btnAumentar(e);
    };
    //(2) Detectar si el target tiene un dataset espesifico. 
    if(e.target.dataset["boton"] === "quitarbtn"){ //if(e.target.matches("#carrito .list-group-item .btn-danger")){}
        btnDisminuir(e);
    };
    //(3) Detectar el ID del target:
    if(e.target.id === "finalizarCompra"){ //if(e.target.matches("#footer .btn-outline-info")){}
        btnCompra(e);
    };
});
