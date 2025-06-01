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

// SECCIÓN DE FUNCIONES

function renderProduct(product) {
  let imgURL;
  if (product.image === "") {
    imgURL = "https://placehold.co/600x400";
  } else {
    imgURL = product.image;
  }

  let isOnCart = false;
  for (const item of shoppingCart) {
    if (item.id === product.id) {
      isOnCart = true;
    }
  }

  let buttonText;
  if (isOnCart) {
    buttonText = "Delete";
  } else {
    buttonText = "Buy";
  }

  let buttonClass;
  if (isOnCart) {
    buttonClass = "btn-delete";
  } else {
    buttonClass = "btn-buy";
  }

  return `<li><div class="product-card"><img src="${imgURL}" style="width: 200px;"/>
    <p>${product.title}</p><p class="product-price">${product.price} €</p>
    <button class="js_btn-store ${buttonClass}" id="${product.id}">${buttonText}</button></div></li>`;
}

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

function renderShoppingCartProduct(product) {
  let imgURL;
  if (product.image === "") {
    imgURL = "https://placehold.co/600x400";
  } else {
    imgURL = product.image;
  }
  return `<li><div><img class="cart-img" src="${imgURL}" style="width: 200px;"/>
    <p>${product.title}</p><p class="product-price">${product.price} €</p><button class="js_btn-shopping" id="${product.id}">X</button>
    </div></li>`;
}

function renderAllShoppingCartProducts(productList) {
  ulShopping.innerHTML = "";
  for (const product of productList) {
    ulShopping.innerHTML += renderShoppingCartProduct(product);
  }

  if (shoppingCart.length >= 1) {
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

  // Almacenar información en el localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
}

function getProducts() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      storeProducts = data;

      // Local storage shoping cart restore
      if (localStorage.getItem("shoppingCart") !== null) {
        shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
      }

      renderAllProducts(storeProducts);

      renderAllShoppingCartProducts(shoppingCart);
    });
}

// Sección de funciones de eventos

function handleSearch(event) {
  event.preventDefault();
  let valueSearch = inputSearch.value;
  const filteredProducts = storeProducts.filter((product) =>
    product.title.toLowerCase().includes(valueSearch.toLowerCase())
  );
  renderAllProducts(filteredProducts);
}

function handleAddToCart(event) {
  event.preventDefault();
  const clickedId = parseInt(event.currentTarget.id);
  const foundProduct = storeProducts.find(
    (product) => product.id === clickedId
  );
  if (!shoppingCart.find((item) => item.id === foundProduct.id)) {
    shoppingCart.push(foundProduct);
  } else {
    shoppingCart = shoppingCart.filter((item) => item.id !== foundProduct.id);
  }
  renderAllProducts(currentProductList);
  renderAllShoppingCartProducts(shoppingCart);
}

function handleDeleteFromCart(event) {
  const deleteProductId = parseInt(event.currentTarget.id);
  shoppingCart = shoppingCart.filter(
    (product) => product.id !== deleteProductId
  );
  renderAllProducts(currentProductList);
  renderAllShoppingCartProducts(shoppingCart);
}

function handleClearCart(event) {
  shoppingCart = [];
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  renderAllProducts(currentProductList);
  renderAllShoppingCartProducts(shoppingCart);
}

// Sección de eventos // desde el botón // va a parte.
btnSearch.addEventListener("click", handleSearch);

// Sección de código a ejecutar cuando carga la página
getProducts();
