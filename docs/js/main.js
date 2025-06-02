let f="https://fakestoreapi.com/products",i=[],e=[],l=[];const u=document.querySelector(".js_list"),h=document.querySelector(".js_input-search"),m=document.querySelector(".js_btn-search"),d=document.querySelector(".js_shopping-cart"),p=document.querySelector(".empty-cart-message");function S(){e.length===0?p.style.display="flex":p.style.display="none"}function b(t){let r=t.image||"https://placehold.co/600x400";const n=e.some(g=>g.id===t.id),o=n?"Delete":"Buy",c=n?"btn-delete":"btn-buy";return`<li><div class="product-card">
    <img src="${r}" />
    <p>${t.title}</p>
    <p class="product-price">${t.price} €</p>
    <button class="js_btn-store ${c}" id="${t.id}">${o}</button>
  </div></li>`}function s(t){l=t,u.innerHTML="";for(const n of t)u.innerHTML+=b(n);const r=document.querySelectorAll(".js_btn-store");for(const n of r)n.addEventListener("click",j)}function y(t){return`<li><div>
    <img class="cart-img" src="${t.image||"https://placehold.co/600x400"}" style="width: 200px;" />
    <p>${t.title}</p>
    <p class="product-price">${t.price} €</p>
    <button class="js_btn-shopping" id="${t.id}">X</button>
  </div></li>`}function a(t){d.innerHTML="";for(const o of t)d.innerHTML+=y(o);e.length>0&&(d.innerHTML+='<button class="js_clear-cart">Clear cart</button>');const r=document.querySelector(".js_clear-cart");r&&r.addEventListener("click",I);const n=document.querySelectorAll(".js_btn-shopping");for(const o of n)o.addEventListener("click",v);localStorage.setItem("shoppingCart",JSON.stringify(e)),S()}function C(){fetch(f).then(t=>t.json()).then(t=>{i=t,localStorage.getItem("shoppingCart")!==null&&(e=JSON.parse(localStorage.getItem("shoppingCart"))),s(i),a(e)})}function L(t){t.preventDefault();const r=h.value,n=i.filter(o=>o.title.toLowerCase().includes(r.toLowerCase()));s(n)}function j(t){t.preventDefault();const r=parseInt(t.currentTarget.id),n=i.find(c=>c.id===r);e.find(c=>c.id===n.id)?e=e.filter(c=>c.id!==n.id):e.push(n),s(l),a(e)}function v(t){const r=parseInt(t.currentTarget.id);e=e.filter(n=>n.id!==r),s(l),a(e)}function I(){e=[],localStorage.setItem("shoppingCart",JSON.stringify(e)),s(l),a(e)}m.addEventListener("click",L);C();
//# sourceMappingURL=main.js.map
