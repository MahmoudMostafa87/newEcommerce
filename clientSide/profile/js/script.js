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
    window.location.href = '../password.html';
  });
  // //////////////////////
document.getElementById('go-to-address')?.addEventListener('click', function () {
  window.location.href = '../address-details.html';
});

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







//if go to transiation will render this function to reload this data

//page my transiation
async function renderTransiation(){
    try {
        const response = await fetch("http://127.0.0.1:4000/transactions/my-transaction",{
            method:"GET",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            }
        });
        const data = await response.json();

        if (!Array.isArray(data)) return alert("لم يتم العثور على بيانات.");

        let totalWithdrawn = 0;
        let totalProfits = 0;
        let totalDeductions = 0;
        let totalIncoming = 0;

        data.forEach(tx => {
            const row = `
                <tr>
                    <td>${new Date(tx.created_at).toLocaleDateString("ar-EG")}</td>
                    <td>${tx.amount}</td>
                    <td>${tx.description}</td>
                </tr>
            `;

            if (tx.type === "withdrawal") {
                document.getElementById("withdrawals").innerHTML += row;
                totalWithdrawn += parseFloat(tx.amount);
            } else if (tx.type === "profit") {
                document.getElementById("profits").innerHTML += row;
                totalProfits += parseFloat(tx.amount);
            } else if (tx.type === "deduction") {
                document.getElementById("deductions").innerHTML += row;
                totalDeductions += parseFloat(tx.amount);
            } else if (tx.type === "incoming") {
                totalIncoming += parseFloat(tx.amount);
            }
        });

        document.getElementById("total-withdrawn").innerText = totalWithdrawn.toFixed(2);
        document.getElementById("total-profits").innerText = totalProfits.toFixed(2);
        document.getElementById("total-deductions").innerText = totalDeductions.toFixed(2);

        // إنشاء عنصر للدخل لو مش موجود
        if (!document.getElementById("total-incoming")) {
            const p = document.createElement("p");
            p.innerHTML = `الدخل الإجمالي: <span id="total-incoming">${totalIncoming.toFixed(2)}</span> (بالعملة)`;
            document.querySelector(".container").insertBefore(p, document.querySelector("h2"));
        } else {
            document.getElementById("total-incoming").innerText = totalIncoming.toFixed(2);
        }

        calculateFinalBalance();
    } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("فشل في تحميل البيانات.");
    }
};

function calculateFinalBalance() {
    const totalIncoming = parseFloat(document.getElementById('total-incoming').innerText || "0");
    const totalWithdrawn = parseFloat(document.getElementById('total-withdrawn').innerText || "0");
    const totalProfits = parseFloat(document.getElementById('total-profits').innerText || "0");
    const totalDeductions = parseFloat(document.getElementById('total-deductions').innerText || "0");

    const finalBalance = totalIncoming - totalWithdrawn + totalProfits - totalDeductions;
    document.getElementById('final-balance').innerText = finalBalance.toFixed(2);
}




// if go to index will render my profile data


//index page profile
function main(){
  fetch("http://127.0.0.1:4000/profile/myProfile",
          {
            method:"GET",
            headers:{
              "Content-Type":"application/json"
            },
            credentials:"include"
          }).then(res=>{
            if(!res.ok){
            alert("sorry not found data")
            location.href="../../indexx.html";
      }
      return res.json();
        }).then(data=>{
            document.getElementById("image-profile").innerHTML=`
            <img src="${data.profile_image}" alt="صورة الحساب"
                        class="w-24 h-24 rounded-full border-4 border-indigo-200 shadow mb-2 object-cover">  
            `;
            document.getElementById('email').textContent = data.email;
            document.getElementById('name').textContent = data.name;
            document.getElementById('phone_number').textContent =data.phone_number;
            document.getElementById('address').textContent = data.address;
        
        });
    }



//if go for reset password do not need render any thing but when clicked on button passwordForm will do this thing

//reset password page
document.getElementById('passwordForm').addEventListener('submit', async function(e) {
      e.preventDefault();

      const oldPassword = document.getElementById('current-password').value;
      const newpassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      try {
        const response = await fetch('http://127.0.0.1:4000/profile/resetPassword', {
          method: 'PATCH',
          credentials: 'include', // 🔒 هذا مهم جدًا لإرسال الكوكيز مع الطلب
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldPassword,
            newpassword,
            confirmPassword
          })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || 'حدث خطأ أثناء تغيير كلمة المرور');
        } else {
          alert('✅ تم تغيير كلمة المرور بنجاح!');
          this.reset();
        }

      } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
        alert('فشل الاتصال بالسيرفر');
      }
    });




//if go for page my products will render function renderMyProducts 

  //منتجاتي 
    async function getMyproduct(){
      const res=await fetch("http://127.0.0.1:4000/product/myProduct",
        {
            method:"GET",
            headers:{
              "Content-Type":"application/json"
            },
            credentials:"include"
          }
      );

      if(!res.ok) throw new Error(`code : ${res.status}, message : ${res.statusText}`);

      const products=await res.json();
      
      return products;
    }
    
async function renderMyProducts() {
  const myProducts=await getMyproduct();

  const container = document.getElementById('my-products-list');
  if (!myProducts.length) {
    container.innerHTML = '<p class="text-gray-500 text-center">لا توجد منتجات.</p>';
    return;
  }

  container.innerHTML = myProducts.map((product) => `
    <div class="flex items-center gap-4 bg-indigo-50 rounded-lg border p-4">
      <img src="${product.image_url}" alt="${product.name}" class="w-20 h-20 rounded shadow border object-cover">
      <div class="flex-1">
        <div class="font-bold text-gray-800 text-lg">${product.name}</div>
        <div class="text-gray-600 mt-1">السعر: <span class="font-semibold">${product.price} ج.م</span></div>
      </div>
      <button onclick="editProduct(${product.id})" class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm">تعديل</button>
      <button onclick="deleteProduct(${product.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">حذف</button>
    </div>
  `).join('');
}



// حذف 
async function deleteProduct(id) {
  try {
    const res = await fetch(`http://127.0.0.1:4000/product/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "فشل في حذف المنتج");
      return;
    }

    renderMyProducts();
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء حذف المنتج");
  }
}


function editProduct(id){
  sessionStorage.setItem("id",id);
  location.href="../product_update.html";
}

// إظهار 
function showAddProductForm() {
  document.getElementById('add-product-form').classList.remove('hidden');
}

// إخفاء 
function hideAddProductForm() {
  document.getElementById('add-product-form').classList.add('hidden');
}

// إضافة 
document.getElementById('add-product-form').onsubmit = function(e) {
  e.preventDefault();

  const form = document.getElementById('add-product-form');

  const body = new FormData(form);

  fetch(`http://127.0.0.1:4000/product/`, {
    method: "POST",
    credentials: "include",
    body
  })
  .then(async res => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "فشل في إضافة المنتج");
      return;
    }
    renderMyProducts();
    hideAddProductForm();
    form.reset();
  })
  .catch(err => {
    console.error("Error:", err);
    alert("حدث خطأ أثناء الاتصال بالسيرفر");
  });
};






//page product_update.html
  async function loadProduct(id) {
    sessionStorage.clear();

      const res = await fetch(`http://127.0.0.1:4000/product/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        alert("لم يتم العثور على المنتج");
        return;
      }
      const data = await res.json();

      document.getElementById("edit-product-form").innerHTML=
      `<div>
        <label class="block mb-1 font-semibold text-gray-700">اسم المنتج</label>
        <input id="product-name" name="name" type="text" value=${data.name} class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block mb-1 font-semibold text-gray-700">وصف المنتج</label>
        <input id="product-description" name="description" value=${data.description} type="text" class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block mb-1 font-semibold text-gray-700">اسم القسم</label>
        <input id="product-categoryname" name="Categoryname" value=${data.Categoryname} type="text" class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block mb-1 font-semibold text-gray-700">السعر</label>
        <input id="product-price" name="price" type="number" value=${data.price} class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block mb-1 font-semibold text-gray-700">الكمية</label>
        <input id="product-stock" name="stock" type="number" value=${data.stock} class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block mb-1 font-semibold text-gray-700">صورة جديدة (اختياري)</label>
        <input id="product-image" name="image" type="file" accept="image/*" class="w-full rounded border px-3 py-2" />
      </div>
      <button onclick="updateProduct(${data.id})" class="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
        حفظ التعديلات
      </button>`
    }


    async function updateProduct(id){

      const form = document.getElementById("edit-product-form");
      const body = new FormData(form);

      const res = await fetch(`http://127.0.0.1:4000/product/${id}`, {
        method: "PUT",
        credentials: "include",
        body
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "فشل في تعديل المنتج");
        return;
      }

      alert("✅ تم تعديل المنتج بنجاح");
      location.href = "../../index.html"; // رجوع إلى صفحة المنتجات
    }









//watch later.html
    async function getProductSavedIt() {
      try {
        const res = await fetch("http://127.0.0.1:4000/saved_product", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!res.ok) throw new Error(`خطأ: ${res.status} - ${res.statusText}`);
        const products = await res.json();
        return products;
      } catch (err) {
        console.error(err.message);
        return [];
      }
    }

    async function renderWatchLater() {
      const watchLater = await getProductSavedIt();
      const container = document.getElementById('watch-later-list');

      if (watchLater.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500">لا توجد منتجات في المفضلة.</p>';
        return;
      }

      container.innerHTML = watchLater.map(product => `
        <div class="flex items-center gap-4 bg-indigo-50 rounded-lg border p-4">
          <img src="${product.image_url}" alt="${product.name}" class="w-20 h-20 rounded shadow border object-cover">
          <div class="flex-1">
            <div class="font-bold text-gray-800 text-lg">${product.name}</div>
            <div class="text-gray-600 mt-1">السعر: <span class="font-semibold">${product.price} ج.م</span></div>
          </div>
          <button onclick="removeWatchLater(${product.saved_id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">حذف</button>
        </div>
      `).join('');
    }

    async function removeWatchLater(id) {
      try {
        const res = await fetch(`http://127.0.0.1:4000/saved_product/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!res.ok) throw new Error(`فشل الحذف: ${res.statusText}`);
        renderWatchLater();
      } catch (err) {
        alert("حدث خطأ أثناء حذف المنتج");
        console.error(err);
      }
    }

  

//profile-update
async function renderMyProfile(){

  try {
    const res = await fetch("http://127.0.0.1:4000/profile/myProfile", {
        method: "GET",
        credentials:"include"
      });

      const data = await res.json();
      
      if (!res.ok) return alert("حدث خطأ في تحميل البيانات: " + data.message);
      
      // ✅ تعبئة البيانات في الحقول
      document.getElementById("first-name").value = data.email || "";
      document.getElementById("text").value = data.name || "";
      document.getElementById("street-address").value = data.address || "";
      document.getElementById("phone_number").value = data.phone_number || "";
      
      // ✅ عرض صورة الملف الشخصي
      if (data.image_url) {
        document.getElementById("photo-preview").src = data.image_url;
      }

    } catch (err) {
      console.error("فشل تحميل البيانات:", err);
      alert("فشل الاتصال بالخادم");
    }
  }


  
  document.getElementById("save-changes").addEventListener("click", async () => {

    const formData = new FormData(document.getElementById("form-input"));

    try {
      const res = await fetch(`http://127.0.0.1:4000/profile/`, {
        method: "PUT",
        credentials:"include",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert("تم تحديث الملف بنجاح");
      } else {
        alert("حدث خطأ: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("فشل الاتصال بالسيرفر");
    }
  });

  // تغيير الصورة عند الضغط على زر "Change"
  document.getElementById("change-photo-btn").addEventListener("click", () => {
    document.getElementById("photo-input").click();
  });


  document.getElementById("delete-account").addEventListener("click", async () => {
    const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف الحساب؟ هذا الإجراء لا يمكن التراجع عنه.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://127.0.0.1:4000/profile/`, {
        method: "DELETE",
        credentials:"include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("تم حذف الحساب بنجاح");
        location.href = "../../indexx.html";
      } else {
        alert("فشل الحذف: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("فشل الاتصال بالسيرفر");
    }
  });



    // /clientSide/profile/index or any
let page=location.href.split("/profile")[1];
switch(page){
  
  case "/index.html":
    main();
    break;
  
  case "/address-details.html" :
    renderTransiation();
    break;
  
  case "/product_update.html" :
    const id=sessionStorage.getItem("id");
    loadProduct(id);
    break;
 
  case "/profile-update.html" :
    renderMyProfile();
    break;

  case "/watch-later.html" :
    renderWatchLater();
    break;
  
  case "/منتجاتي.html" :
    renderMyProducts();
    break;
  
  default:
    location.href="../../indexx.html";
}    