//الصفحه دى بروح من اي مكان ليها بيعرض كل المنتجات الخاصة بقسم معين ولم بدوس على المنتج بيوديني على صفحته

// صفحة المنتجات
const id=localStorage.getItem("categoryid");
if(!id)
    alert("not found any category");


//section
  const container = document.getElementById("products-container");

//عرض كل المنتجات فى الصفحه الرئيسه
//get all data in main for category all product this image , name and price and can add it in card and show details
  fetch(`http://127.0.0.1:4000/category/${id}/products`,{
    method:"GET",
    credentials:"include"
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((product) => {
        const card = document.createElement("div");
        card.className = "bg-white shadow rounded p-2";
        card.innerHTML = `
          <img src="${product.image_url}" alt="${product.name}" class="w-full h-40 object-cover rounded">
          <h2 class="text-lg font-bold mt-2">${product.name}</h2>
          <p class="text-green-600">${product.price}</p>
          <button onclick="getSpcificProduct(${product.id})" class="text-blue-500 underline block mt-2">عرض التفاصيل</button>
          <button onclick="addToCart(${product.id})" class="text-blue-500 underline block mt-2">أضف للسلة</button>
          <button onclick="saved_product(${product.id})" class="text-blue-500 underline block mt-2">أضف للمفضل</button>
          `;
          container.appendChild(card);
        });
    })
    .catch((err) => {
      container.innerHTML = `<p class='text-red-500'>حدث خطأ أثناء تحميل المنتجات.</p>`;
      console.error(err);
    });



//الصفه الي جوة الى بدوس علي تفصيل المنتج فا بيخش هنا
// صفحة تفاصيل المنتج
async function getSpcificProduct(id){
  // localStorage.clear();
  localStorage.setItem("id",id);
  location.href="./product.html";
}



