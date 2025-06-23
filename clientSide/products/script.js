// صفحة المنتجات
if (window.location.pathname.includes("index.html")) {
  const container = document.getElementById("products-container");

  fetch("https://your-api.com/products")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((product) => {
        const card = document.createElement("div");
        card.className = "bg-white shadow rounded p-2";
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded">
          <h2 class="text-lg font-bold mt-2">${product.name}</h2>
          <p class="text-green-600">السعر: ${product.price} جنيه</p>
          <p class="text-red-500">الخصم: ${product.discount}%</p>
          <a href="product.html?id=${product.id}" class="text-blue-500 underline block mt-2">عرض التفاصيل</a>
        `;
        container.appendChild(card);
      });
    })
    .catch((err) => {
      container.innerHTML = `<p class='text-red-500'>حدث خطأ أثناء تحميل المنتجات.</p>`;
      console.error(err);
    });
}

// صفحة تفاصيل المنتج
if (window.location.pathname.includes("product.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const container = document.getElementById("product-details");

  fetch(`https://your-api.com/products/${id}`)
    .then((response) => response.json())
    .then((product) => {
      container.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-full rounded">
        <div class="space-y-4">
          <h1 class="text-2xl font-bold">${product.name}</h1>
          <p class="text-green-600 text-xl">السعر: ${product.price} جنيه</p>
          <p class="text-red-500">الخصم: ${product.discount}%</p>
          <p class="text-gray-600">عدد المشاهدات: ${product.views}</p>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            أضف إلى السلة
          </button>
        </div>
      `;
    })
    .catch((err) => {
      container.innerHTML = `<p class='text-red-500'>لم يتم العثور على المنتج.</p>`;
      console.error(err);
    });
}
