
// Creas las variables del contenedor por ID
const contenedor = document.getElementById("container");
const carritoContainerDOM = document.getElementById("carrito-modal");
let total = 0;
let carrito = []; // Array vacío de carrito


/* Buscador */

const buscador = document.getElementById("buscador");
buscador.addEventListener("input", filtrarProductos);

function filtrarProductos() {
  const textoBusqueda = buscador.value.toLowerCase();

  const productosFiltrados = productos.filter((producto) => {
    const nombreProducto = producto.product.toLowerCase();
    return nombreProducto.includes(textoBusqueda);
  });

  contenedor.innerHTML = "";

  // Mostrar los productos filtrados
  productosFiltrados.forEach((producto, indice) => {
    const card = document.createElement("div");
    card.classList.add("card", "col-sm-12", "col-md-6", "col-lg-3", "gap-3","my-5","ml-3");
    card.innerHTML = `
      <img src="${producto.image}" class="card-img-top" alt="foto producto">
      <div class="card-body">
        <h5 class="card-title">${producto.product}</h5>
        <p class="card-text">Precio U$D ${producto.price}</p>
        <a href="#carrito-contenido" class="btn btn-secondary" onClick="addCart(${indice})">Agregar al carrito</a>
      </div>
    `;
    contenedor.appendChild(card);
  });
}


// Función para actualizar el storage
const refreshStorage = (carrito) => {
  localStorage.setItem("Carrito", JSON.stringify(carrito));
};

// Función para borrar producto
const removeProduct = (indice) => {
  const productoChosen = carrito[indice];
  if (productoChosen) {
    carrito.splice(indice, 1);
    refreshStorage(carrito);
    mostrarcarrito(carrito);
    const totalCompra = document.querySelector(".Total-content");
    if (totalCompra) {
      totalCompra.innerHTML = `Total a Pagar $ ${total}`;
    }
  }
};

// Función para incrementar cantidad en el carrito
const incrementQuantity = (indice) => {
  carrito[indice].cantidad++;
  refreshStorage(carrito);
  mostrarcarrito(carrito);
};

// Función para decrementar cantidad en el carrito
const decrementQuantity = (indice) => {
  if (carrito[indice].cantidad > 1) {
    carrito[indice].cantidad--;
    refreshStorage(carrito);
    mostrarcarrito(carrito);
  }
};

// Función para obtener los productos desde el archivo JSON
const obtenerProductos = async () => {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error al cargar los productos:', error);
    return [];
  }
};

// Función para mostrar el carrito en el DOM
const mostrarcarrito = (carrito) => {
  carritoContainerDOM.innerHTML = "";
  total = carrito.reduce((acc, el) => acc + el.price * el.cantidad, 0);

  carrito.forEach((producto, indice) => {
    const carritoItemContainer = document.createElement("div");
    carritoItemContainer.classList.add("card", "col-12", "col-md-6", "col-lg-4", "m-3");
    carritoItemContainer.innerHTML = `
      <div class="card-body">
        <h5 class="card-title mb-3">Producto: ${producto.product}</h5>
        <button class="btn btn-danger mx-1 cerrar" id="remove" onClick="removeProduct(${indice})">x</button>
        <div class="d-flex justify-content-between align-items-center">
          <p class="card-text mb-0">Cantidad: ${producto.cantidad}</p>
          <div>
            <button class="btn btn-secondary btn-sm menos" onClick="decrementQuantity(${indice})">-</button>
            <button class="btn btn-secondary btn-sm mas" onClick="incrementQuantity(${indice})">+</button>
          </div>
        </div>
        <p class="card-text mt-2 mb-0">Precio: $ ${producto.price}</p>
        <p class="card-text"><strong>Subtotal:</strong> $ ${producto.price * producto.cantidad}</p>
      </div>
    `;
    carritoContainerDOM.appendChild(carritoItemContainer);
  });
  

  const totalCompra = document.createElement("div");
  totalCompra.className = "Total-content";
  totalCompra.innerHTML = `<h3> Total a pagar $ ${total} </h3>`;
  carritoContainerDOM.append(totalCompra);
};

// Función para agregar producto al carrito
const addCart = (indice) => {
  const productoElegido = carrito.findIndex((e) => e.id === productos[indice].id);

  if (productoElegido === -1) {
    const productoAgregado = { ...productos[indice], cantidad: 1 };
    carrito.push(productoAgregado);
    refreshStorage(carrito);
    mostrarcarrito(carrito);
  } else {
    carrito[productoElegido].cantidad += 1;
    refreshStorage(carrito);
    mostrarcarrito(carrito);
  }
};

// Cargar los productos
obtenerProductos().then((data) => {
  productos = data; // Asignamos los productos al ámbito global

  // Guardar el carrito en el local storage, para que persista
  if (localStorage.getItem("Carrito")) {
    const carritoStorage = localStorage.getItem("Carrito");
    if (carritoStorage) {
      carrito = JSON.parse(carritoStorage);
    }
    mostrarcarrito(carrito);
  }

  productos.forEach((producto, indice) => {
    const card = document.createElement("div");
    card.classList.add("card", "col-sm-12", "col-md-6", "col-lg-3","d-flex","align-items-center","justify-content-center");
    card.innerHTML = `
      <img src="${producto.image}" class="card-img-top" alt="foto producto">
      <div class="card-body">
        <h5 class="card-title">${producto.product}</h5>
        <p class="card-text">Precio U$D ${producto.price}</p>
        <a href="#carrito-contenido" class="btn btn-secondary" onClick="addCart(${indice})">Agregar al carrito</a>
      </div>
    `;
    contenedor.appendChild(card);
  });
  
  

  const emailButton = document.getElementById("btn-comprar");
  emailButton.addEventListener("click", async () => {
    const { value: email } = await Swal.fire({
      
      title: 'Completar correo electrónico',
      input: 'email',
      inputLabel: 'Tu correo electrónico',
      inputPlaceholder: 'Ingrese tu correo electrónico',
    });

    if (email) {
      Swal.fire(`Factura enviada a: ${email}`);
    }
    carrito = [];
    mostrarcarrito(carrito)
    refreshStorage(carrito)
  });
  
}).catch((error) => {
  console.log('Error al cargar los productos:', error);
});




/* Modal boostrap */ 

const exampleModal = document.getElementById('exampleModal')
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

  })
}

/* Formulario login */

function mostrarValores(event) {
  // Obtener los valores de los campos de entrada
  let email = document.getElementById('email').value;
  let name = document.getElementById('name').value;
  
  // Mostrar los valores en el DOM
  let resultElement = document.getElementById('result');
  resultElement.innerHTML = 'Bienvenido ' + name +'!';
  resultElement.style.color = 'gray';
  
  // Ocultar el modal
  const exampleModal = document.getElementById('exampleModal');
  const bootstrapModal = bootstrap.Modal.getInstance(exampleModal);
  bootstrapModal.hide();

  event.preventDefault(); // Evita que el formulario se envíe y la página se recargue
}

const form = document.getElementById('myForm');
form.addEventListener("submit", mostrarValores);


