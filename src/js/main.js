"use strict";

// SECCIÓN DE VARIANLES GLOBALES (DATOS)
let url = "https://fakestoreapi.com/products";
let storeProducts = [];
let shoppingCart = [];
let currentProductList = [];

// Sección de query-selectors (elementos que usamos de la página)
const ulList = document.querySelector(".js_list");
const inputSearch = document.querySelector(".js_input-search");
const btnSearch = document.querySelector(".js_btn-search");
const ulShopping = document.querySelector(".js_shopping-cart");
const emptyMessage = document.querySelector(".empty-cart-message");

// FUNCIONALIDAD: Mostrar u ocultar el mensaje del carrito vacío
function toggleEmptyCartMessage() {
  if (shoppingCart.length === 0) {
    emptyMessage.style.display = "flex";
  } else {
    emptyMessage.style.display = "none";
  }
}

// Función para renderizar un producto
function renderProduct(product) {
  let imgURL = product.image || "https://placehold.co/600x400";

  const isOnCart = shoppingCart.some(item => item.id === product.id);

  const buttonText = isOnCart ? "Delete" : "Buy";
  const buttonClass = isOnCart ? "btn-delete" : "btn-buy";

  return `<li><div class="product-card">
    <img src="${imgURL}" />
    <p>${product.title}</p>
    <p class="product-price">${product.price} €</p>
    <button class="js_btn-store ${buttonClass}" id="${product.id}">${buttonText}</button>
  </div></li>`;
}

// Pintar todos los productos
function renderAllProducts(productList) {
  currentProductList = productList;
  ulList.innerHTML = "";
  for (const product of productList) {
    ulList.innerHTML += renderProduct(product);
  }

  const btnsStore = document.querySelectorAll(".js_btn-store");
  for (const btn of btnsStore) {
    btn.addEventListener("click", handleAddToCart);
  }
}

// Pintar un producto en el carrito
function renderShoppingCartProduct(product) {
  let imgURL = product.image || "https://placehold.co/600x400";

  return `<li><div>
    <img class="cart-img" src="${imgURL}" style="width: 200px;" />
    <p>${product.title}</p>
    <p class="product-price">${product.price} €</p>
    <button class="js_btn-shopping" id="${product.id}">X</button>
  </div></li>`;
}

// Pintar todo el carrito
function renderAllShoppingCartProducts(productList) {
  ulShopping.innerHTML = "";

  for (const product of productList) {
    ulShopping.innerHTML += renderShoppingCartProduct(product);
  }

  if (shoppingCart.length > 0) {
    ulShopping.innerHTML += `<button class="js_clear-cart">Clear cart</button>`;
  }

  const buttonClear = document.querySelector(".js_clear-cart");
  if (buttonClear) {
    buttonClear.addEventListener("click", handleClearCart);
  }

  const btnShopping = document.querySelectorAll(".js_btn-shopping");
  for (const btn of btnShopping) {
    btn.addEventListener("click", handleDeleteFromCart);
  }

  // Guardar carrito en localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

  // Mostrar u ocultar mensaje del carrito vacío
  toggleEmptyCartMessage();
}

// Obtener productos de la API
function getProducts() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      storeProducts = data;

      // Restaurar carrito desde localStorage
      if (localStorage.getItem("shoppingCart") !== null) {
        shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
      }

      renderAllProducts(storeProducts);
      renderAllShoppingCartProducts(shoppingCart);
    });
}

// EVENTOS

function handleSearch(event) {
  event.preventDefault();
  const valueSearch = inputSearch.value;
  const filteredProducts = storeProducts.filter((product) =>
    product.title.toLowerCase().includes(valueSearch.toLowerCase())
  );
  renderAllProducts(filteredProducts);
}

function handleAddToCart(event) {
  event.preventDefault();
  const clickedId = parseInt(event.currentTarget.id);
  const foundProduct = storeProducts.find(product => product.id === clickedId);

  const alreadyInCart = shoppingCart.find(item => item.id === foundProduct.id);

  if (!alreadyInCart) {
    shoppingCart.push(foundProduct);
  } else {
    shoppingCart = shoppingCart.filter(item => item.id !== foundProduct.id);
  }

  renderAllProducts(currentProductList);
  renderAllShoppingCartProducts(shoppingCart);
}

function handleDeleteFromCart(event) {
  const deleteProductId = parseInt(event.currentTarget.id);
  shoppingCart = shoppingCart.filter(product => product.id !== deleteProductId);

  renderAllProducts(currentProductList);
  renderAllShoppingCartProducts(shoppingCart);
}

function handleClearCart() {
  shoppingCart = [];
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  renderAllProducts(currentProductList);
  renderAllShoppingCartProducts(shoppingCart);
}

// Lanzar búsqueda
btnSearch.addEventListener("click", handleSearch);

// Iniciar todo al cargar la página
getProducts();
