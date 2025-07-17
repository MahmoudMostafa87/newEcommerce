document.getElementById('menu-toggle')?.addEventListener('click', function () {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('hidden');
});
// //////////////
document.getElementById('products-btn')?.addEventListener('click', function (e) {
  e.preventDefault();
  const menu = document.getElementById('products-menu');
  menu.classList.toggle('hidden');
});
// //////////////
document.getElementById('change-photo-btn')?.addEventListener('click', function () {
  document.getElementById('photo-input').click();
});
// //////////////////
 document.getElementById('go-to-password')?.addEventListener('click', function () {
    window.location.href = 'password.html';
  });
  // //////////////////////
document.getElementById('go-to-address')?.addEventListener('click', function () {
  window.location.href = 'address-details.html';
});
// //////////////////////
function addToWatchLater(id, name) {
  let products = JSON.parse(localStorage.getItem('watchLater')) || [];
  
  products.push({ id, name });
  
  localStorage.setItem('watchLater', JSON.stringify(products));
  alert('تمت إضافة المنتج إلى قائمة المشاهدة لاحقاً!');
}
///////////////////////////////////////////////////////////////
const products2 = JSON.parse(localStorage.getItem('watchLater')) || [];
const container = document.getElementById('watch-later-list');
if (products.length === 0) {
  container.innerHTML = '<p class="text-gray-500">لا توجد منتجات محفوظة.</p>';
} else {
  container.innerHTML = products.map(p =>
    `<div class="p-4 border-b">${p.name}</div>`
  ).join('');
}
// //////////////////////////////////////////////////////////
 

























  
   