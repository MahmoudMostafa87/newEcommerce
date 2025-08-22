
//التكلفة الكليه للاسعار فى الكارت كدة كدة هجبها من عندي من الbackend 
//GET /cart/   [{item product_id,name product,price product,image product,item quantity}]

//(بطه مش ليك يامرزوق)
//بترجع المنتجات الى فى الكارت
async function getProductsInCard(){
  const res=await fetch("http://127.0.0.1:4000/cart",{
    method:"GET",
    credentials: "include",
    headers:{
      "Content-Type":"application/json"
    },
  });
  if(!res.ok)return [];
    const products=await res.json();
  return products;
};


//(بطه مش ليك يامرزوق)
//بترجع السعر الكلي للكارت
async function getTotalPrice(){
 const products=await getProductsInCard();
  let total=0;

    products= products.forEach(product=>
            total+=(product.price * product.quantity)
    );

    return total;
}



//(بطه مش ليك يامرزوق)
//بيحسب عدد العناصر فى السله الصغيرة
async function updateCartCount() {
    const products=await getProductsInCard();

    const cartCountElement = document.getElementById("cart-count");
  
    if (cartCountElement) {
      cartCountElement.textContent = products.length;
    }
}

async function get_saved_product(){
let res=await fetch("http://127.0.0.1:4000/saved_product",{
    method:"GET",
    headers:{
          "Content-Type":"application/json"
    },
    credentials:"include"
  });
  const saved_products=await res.json();

  return saved_products;
}

async function saved_product(productId){
  const saved_products=await get_saved_product();

  let foundIt=false;
  for(let product of saved_products){
    if(product.id===productId){
      const  res=await fetch(`http://127.0.0.1:4000/saved_product/${productId}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include"
      });
      foundIt=true;
      const message=await res.json();
      showNotification(message.message);
    }
  }

  if(!foundIt){
      const res =await fetch(`http://127.0.0.1:4000/saved_product`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({productId})
      });

      const message=await res.json();
      
      showNotification(message.message);
  }
}


//(بطة مش ليك يامرزوق)
//لم بضيف عنص فى السله بيعرض على جنب انه تم اضافة العنصر
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}


//(بطة مش ليك يامرزوق)
// هضيف عنصر فى السله 
//POST cart/addProdcut
async function addToCart(productId, quantity = 1) {
  console.log(productId,quantity);
  // 1. جلب قائمة المنتجات في السلة
  const products = await getProductsInCard();
  

  // 2. بحث سريع عمّا إذا كان المنتج موجود
  let foundIt = false;
  for (const product of products) {
    if (product.id === productId) {
      // عدّل الكمية في الـ API المختص
      await updateQuantity(productId, product.quantity + quantity);
      foundIt = true;
      break;  // للخروج من اللوب فوراً
    }
  }
  
  // 3. إذا لم يكن موجوداً، ضعه في السلة
  if (!foundIt) {
    try{

      const res = await fetch("http://127.0.0.1:4000/cart/addProduct", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productid:productId, quantity })
      });
      const message=await res.json();
      if(!res.ok)
        showNotification(message.message);
      else
        showNotification(message);

    }catch(ex){
      showNotification(ex);
    }
  }
  
  // 4. حدّث عدّاد السلة وأظهر رسالة نجاح عامة
  updateCartCount();
  showNotification("تم إضافة المنتج إلى السلة بنجاح!");
}



//(بطة مش ليك يامرزوق)
//هنعدل المنتج لو بالسالب يبقى ينقص والعكس
//فى الباك أند بيشوف لو المنتج موجود ولا الكمية بصفر وبيشيله لوحده
async function updateQuantity(productid,quantitiy) {
   const res=await fetch("http://127.0.0.1:4000/cart",{
    method:"PATCH",
    credentials: "include",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({productid,quantitiy})
  });
  
  if(!res.ok)return 0;
  const message=await res.json();
  showNotification(message);
  
  updateCartCount();
  renderCartItems();
}


///////////////////////////////////////راندر المنتجات فى الصفحه السله
//محتاج تعديل تاني وفهم تاني
async function renderCartItems() {

  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const subtotalElement = document.getElementById("subtotal");
  const savingsElement = document.getElementById("savings");
  const emptyCartElement = document.getElementById("empty-cart");
  const products=await getProductsInCard();


  if (!cartItemsContainer) {
    console.log("cartItemsContainer not found");
    return;
  }

  cartItemsContainer.innerHTML = "";

  if (products.length === 0) {
    console.log("Cart is empty");

    if (emptyCartElement) {
      emptyCartElement.classList.remove("hidden");
    }
    const tableElement = cartItemsContainer.closest("table");
    if (tableElement) {
      tableElement.style.display = "none";
    }
    if (cartTotalElement) cartTotalElement.textContent = "0.00";
    if (subtotalElement) subtotalElement.textContent = "0.00";
    if (savingsElement) savingsElement.textContent = "0.00";
    return;
  }

  console.log("Cart has items, rendering...");
  if (emptyCartElement) {
    emptyCartElement.classList.add("hidden");
  }
  const tableElement = cartItemsContainer.closest("table");
  if (tableElement) {
    tableElement.style.display = "table";
  }

  products.forEach((product) => {

    const itemElement = document.createElement("tr");
    itemElement.className = "border-b border-gray-200";
    itemElement.innerHTML = `
            <td class="py-4 px-2">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        <i class="fas fa-book"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-sm">${product.name}</h3>
                        <button class="text-red-500 hover:text-red-700 text-sm" onclick="removeFromCart(${product.product_id})">حذف</button>
                    </div>
                </div>
            </td>
            <td class="text-center py-4 px-2">
                <div class="text-sm">
                    <span class="font-bold">${product.price}</span>
                    ${
                      itemOriginalPrice !== itemPrice
                        ? `<br><span class="text-gray-500 line-through text-xs">${itemOriginalPrice.toFixed(
                            2
                          )} ر.س</span>`
                        : ""
                    }
                </div>
            </td>
            <td class="text-center py-4 px-2">
                <div class="flex items-center justify-center space-x-2 space-x-reverse">
                    <button class="quantity-btn bg-gray-200 text-gray-700 hover:bg-gray-300" onclick="updateQuantity(${product.product_id}, ${-1})">-</button>
                    <span class="w-8 text-center font-semibold">${product.quantity}</span>
                    <button class="quantity-btn bg-blue-500 text-white hover:bg-blue-600" onclick="updateQuantity(${product.product_id}, ${1})">+</button>
                </div>
            </td>
            <td class="text-center py-4 px-2 font-bold">
                ${product.quantity*product.price}
            </td>
        `;
    cartItemsContainer.appendChild(itemElement);
  });



//دة اية
  if (cartTotalElement)
    cartTotalElement.textContent = `${subtotal.toFixed(2)} ر.س`;
  if (subtotalElement)
    subtotalElement.textContent = `${(subtotal + totalSavings).toFixed(2)} ر.س`;
  if (savingsElement)
    savingsElement.textContent = `${totalSavings.toFixed(2)} ر.س`;

  console.log("Finished rendering cart items");
}





/////////////////////////مسح المنتج من الكارت
//(بطه مش ليك يامرزوق)
//امسح باستخدام الid
async function removeFromCart(productid) {
  //مسح المنتج من الكارت بستخدام الباك
  await fetch("http://127.0.0.1:4000/cart/",{
    method:"DELETE",
    credentials: "include",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({productid})
  });

  updateCartCount();
  showNotification(`تم حذف المنتج من السلة.`);
  renderCartItems();
}



//دول بياخد الid الخاص بعنصر الhtml وبيعرضه بشكل مش بتعتك يعني 
//(بطة مش ليك يا مرزوق)
// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}




////////////////////////////////////////بوابة الدفع
// استبدال وظيفة الدفع الحالية بوظيفة Stripe
async function proceedToStripeCheckout() {
  
  const cart=await getProductsInCard();

  // 1. التحقق من أن السلة غير فارغة (اختياري)
  //هفحص دة من عندي انا فى الدالة الى بتجيب منتجات الكارت
  if (cart.length === 0) {
    alert("سلة التسوق فارغة!");
    return;
  }

  try {
    // 2. إنشاء جلسة دفع في الخادم
    const response = await fetch("http://127.0.0.1:4000/transactions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: cart[0].id }),
      credentials: "include"
    });

    if (!response.ok) throw new Error("فشل في إنشاء جلسة الدفع");

    // 3. الحصول على session.id من الخادم
    const { sessionId } = await response.json();

    // 4. تهيئة Stripe بالمفتاح العام
    const stripe = stripe('pk_test_51RC0YFRsvRA3oogMw86284miHBloGW40FdY6vCPvdYCEFYzQZTZu32zOltGloQbHEPucQhTBc1OedTezHTW1TRRU009SorrIpF'); // استبدله بمفتاحك الفعلي

    // 5. التوجيه إلى صفحة الدفع
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw error;
    }

    confirm(cart[0].id);    
  
  } catch (error) {
    console.error("خطأ في الدفع:", error);
    alert(`حدث خطأ: ${error.message}`);
  }
}
// 6. ربط الدالة بالزر
// document.getElementById("checkout-btn").addEventListener("click", proceedToStripeCheckout);


async function confirm(cardId){
    const response = await fetch("http://127.0.0.1:4000/transactions/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId }),
      credentials: "include"
    });

    if (!response.ok) throw new Error("فشل في استكمال جلسة الدفع");

}



//(بطة مش ليك يا مرزوق)
//دة مش محتاج اجي جنبه خالص
// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("hidden");
      mainNav.classList.toggle("flex");
    });
  }



  //دة الخاص بتسجيل الدخول سيبه فى الاخر
  // Login/Register modal handlers
  const loginLink = document.getElementById("login-link");
  const closeLoginModal = document.getElementById("close-login-modal");
  const closeRegisterModal = document.getElementById("close-register-modal");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("login-modal");
    });
  }

  if (closeLoginModal) {
    closeLoginModal.addEventListener("click", () => closeModal("login-modal"));
  }

  if (closeRegisterModal) {
    closeRegisterModal.addEventListener("click", () =>
      closeModal("register-modal")
    );
  }

  if (showRegister) {
    showRegister.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal("login-modal");
      openModal("register-modal");
    });
  }

  if (showLogin) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal("register-modal");
      openModal("login-modal");
    });
  }

  // Close modals when clicking outside
  //(بطة مش ليك يا مرزوق)
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("fixed") &&
      e.target.classList.contains("inset-0")
    ) {
      closeModal("login-modal");
      closeModal("register-modal");
    }
  });

  // Form submissions
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      showNotification(`تم إرسال رابط الدخول إلى ${email}`);
      closeModal("login-modal");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      showNotification(`تم تسجيل حساب جديد باسم ${name}`);
      closeModal("register-modal");
    });
  }


  // Update cart count on page load
  updateCartCount();

  // Render cart items if on cart page
  if (document.getElementById("cart-items")) {
    renderCartItems();
  }
});







///////////////////////////////زرار عرض الاقسام
//(بطه مش ليك يا مرزوق)
//دة لعرض الاقسام فى الشريط فوق
document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtn = document.getElementById("dropdown-toggle");
  const dropdownMenu = document.getElementById("dropdown-menu");

  dropdownBtn.addEventListener("click", function (e) {
 
  //  if (!dropdownMenu.classList.contains("hidden")) {
  //     dropdownMenu.classList.add("hidden");
  //     return;
  //   }

      dropdownMenu.innerHTML = '';
    //تجميع الاقسام من الباك وعرضها فى الفرونت
    const ul = document.createElement('ul');
    ul.classList.add("text-sm", "text-right", "p-2", "space-y-1");

  getCategory().then(categories => {
    categories.forEach(category => {
      const li = document.createElement("li");
      
      li.innerHTML = `
        <button
          onclick="getSpcificCategory(${category.id})"
          class="block px-3 py-1 hover:bg-gray-100 rounded"
        >
          ${category.name}
        </button>
      `;
      
      ul.appendChild(li);
    });

    dropdownMenu.appendChild(ul); // إضافة القائمة إلى القائمة المنسدلة
    e.stopPropagation(); // منع إغلاق القائمة فورًا
    dropdownMenu.classList.toggle("hidden");
  });
});

// إغلاق القائمة لو المستخدم ضغط خارجها
document.addEventListener("click", function () {
  dropdownMenu.classList.add("hidden");
});
});



async function getCategory() {
  try{
    const res=await fetch("http://127.0.0.1:4000/category",{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
      credentials:"include"
    });
    if(!res.ok)throw new Error("server internal error");

    const categorys=await res.json();

    return categorys;
  }catch(ex){
    alert(ex.stack);
  }
}

function getSpcificCategory(id) {
  localStorage.setItem("categoryid",id);
  const paths=location.pathname.split("/");

  if(paths[2]==='products')
    location.href="./index.html";
  else if(paths[2]==='profile')
    location.href="../products/index.html";
  else
    location.href="./products/index.html";
}