
//التكلفة الكليه للاسعار فى الكارت كدة كدة هجبها من عندي من الbackend 
//GET /cart/   [{name product,price product,image product,item quantity}]


//بترجع المنتجات الى فى الكارت
async function getProductsInCard(){
  const res=await fetch("http://localhost:4000/cart",{
    method:"GET",
    credentials: "include",
    headers:{
      "Content-Type":"application/json"
    },
  });
  if(!res.ok)return 0;
    const products=await res.json();
  return products;
};

//بترجع السعر الكلي للكارت
async function getTotalPrice(){
 const products=await getProductsInCard();
  let total=0;

    products= products.forEach(product=>
            total+=(product.price * product.quantity)
    );

    return total;
}


// let cart = JSON.parse(localStorage.getItem("cart")) || [];
// let cartCount = cart.reduce((total, item) => total + item.quantity, 0);


//بيحسب عدد العناصر فى السله الصغيرة
async function updateCartCount() {
  
    const res=await fetch("http://localhost:4000/cart",{
    method:"GET",  
    credentials: "include",
    headers:{
      "Content-Type":"application/json"
    },
    });
  
    if(!res.ok)return 0;

    const products=await res.json();

    const cartCountElement = document.getElementById("cart-count");
  
    if (cartCountElement) {
      cartCountElement.textContent = products.length;
    }
}


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

// هضيف عنصر فى السله 
//POST cart/addProdcut
async function addToCart(productid, quantitiy=1) {
  //بشوف لو المنتج موجود ولا لا
  const products= await getProductsInCard();

  //بعمل لووب عشان اعرف المنتج موجود ولا لا
  //لو موجود هينادي فى الدالة تعديل الكمية الى فيها الapi
  //الخاص بتعديل الكمية
  let foundit;
  products.forEach(product=>{
    if(product.id==productid){
      updateQuantity(productid,quantitiy);
      foundit=true;

    return;
    }
  });

  //لو المنتج مش موجود هيروح على الendpoint
  //الى بيضيف العنصر فى الCard الجدول
  if(!foundit){

    const res=await fetch("http://localhost:4000/cart/addProduct",{
      method:"POST",
      credentials: "include",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({productid,quantitiy})
    });

    const message=await res.json();
    showNotification(message);
  }

  // const existingItem = cart.find((item) => item.name === productName);

  // تنظيف السعر وتحويله إلى رقم
  // const cleanPrice = parseFloat(price.replace(/[^\d.]/g, ""));
  // const cleanOriginalPrice = originalPrice
  //   ? parseFloat(originalPrice.replace(/[^\d.]/g, ""))
  //   : null;

  // if (existingItem) {
  //   existingItem.quantity++;
  // } else {
  //   cart.push({
  //     name: productName,
  //     price: cleanPrice,
  //     originalPrice: cleanOriginalPrice,
  //     quantity: 1,
  //   });
  // }

//هتعدل الرقم الى بيظهر فى السله وهتعرض فوق على اليمين الرسالة الخاصة بأضافة العنصر
  updateCartCount();
  showNotification(`تم إضافة "${productName}" إلى السلة بنجاح!`);
}

//هنعدل المنتج لو بالسالب يبقى ينقص والعكس
//فى الباك أند بيشوف لو المنتج موجود ولا الكمية بصفر وبيشيله لوحده
async function updateQuantity(productid,quantitiy) {
   const res=await fetch("http://localhost:4000/cart",{
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


//الدالة دي وظيفتها اية
async function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const subtotalElement = document.getElementById("subtotal");
  const savingsElement = document.getElementById("savings");
  const emptyCartElement = document.getElementById("empty-cart");
  const products=await getProductsInCard();

  // console.log("renderCartItems called");
  // console.log("cart:", cart);
  // console.log("cartItemsContainer:", cartItemsContainer);

  //دى اية
  if (!cartItemsContainer) {
    console.log("cartItemsContainer not found");
    return;
  }

  //دي لي؟
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;
  let totalSavings = 0;

//دي كلها بتعمل اية؟
  if (products.length === 0) {
    console.log("Cart is empty");

    if (emptyCartElement) {
      emptyCartElement.classList.remove("hidden");
    }
    const tableElement = cartItemsContainer.closest("table");
    if (tableElement) {
      tableElement.style.display = "none";
    }
    if (cartTotalElement) cartTotalElement.textContent = "0.00 ر.س";
    if (subtotalElement) subtotalElement.textContent = "0.00 ر.س";
    if (savingsElement) savingsElement.textContent = "0.00 ر.س";
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

  products.forEach((item, index) => {
    // التأكد من أن السعر والكمية أرقام صحيحة
    // const itemPrice =
    //   typeof item.price === "number"
    //     ? item.price
    //     : parseFloat(item.price.toString().replace(/[^\d.]/g, "")) || 0;
    // const itemQuantity = item.quantity || 1;
    // const itemOriginalPrice =
    //   item.originalPrice && typeof item.originalPrice === "number"
    //     ? item.originalPrice
    //     : item.originalPrice
    //     ? parseFloat(item.originalPrice.toString().replace(/[^\d.]/g, ""))
    //     : itemPrice;

    //دي بتعمل اية
    const itemTotal = itemPrice * itemQuantity;
    const originalTotal = itemOriginalPrice * itemQuantity;
    const itemSavings = originalTotal - itemTotal;

    subtotal += itemTotal;
    totalSavings += itemSavings;

    const itemElement = document.createElement("tr");
    itemElement.className = "border-b border-gray-200";
    itemElement.innerHTML = `
            <td class="py-4 px-2">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        <i class="fas fa-book"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-sm">${item.name}</h3>
                        <button class="text-red-500 hover:text-red-700 text-sm" onclick="removeFromCart(${index})">حذف</button>
                    </div>
                </div>
            </td>
            <td class="text-center py-4 px-2">
                <div class="text-sm">
                    <span class="font-bold">${itemPrice.toFixed(2)} ر.س</span>
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
                    <button class="quantity-btn bg-gray-200 text-gray-700 hover:bg-gray-300" onclick="updateQuantity(${index}, ${
      itemQuantity - 1
    })">-</button>
                    <span class="w-8 text-center font-semibold">${itemQuantity}</span>
                    <button class="quantity-btn bg-blue-500 text-white hover:bg-blue-600" onclick="updateQuantity(${index}, ${
      itemQuantity + 1
    })">+</button>
                </div>
            </td>
            <td class="text-center py-4 px-2 font-bold">
                ${itemTotal.toFixed(2)} ر.س
            </td>
        `;
    cartItemsContainer.appendChild(itemElement);
    console.log(
      "Added item to cart:",
      item.name,
      "Price:",
      itemPrice,
      "Quantity:",
      itemQuantity
    );
  });

  if (cartTotalElement)
    cartTotalElement.textContent = `${subtotal.toFixed(2)} ر.س`;
  if (subtotalElement)
    subtotalElement.textContent = `${(subtotal + totalSavings).toFixed(2)} ر.س`;
  if (savingsElement)
    savingsElement.textContent = `${totalSavings.toFixed(2)} ر.س`;

  console.log("Finished rendering cart items");
}

//امسح باستخدام الid
//DELETE /cart/
async function removeFromCart(productid) {
  //مسح المنتج من الكارت بستخدام الباك
  await fetch("http://localhost:4000/cart/",{
    method:"DELETE",
    credentials: "include",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({productid})
  });

  // const removedItem = cart.splice(index, 1);
  // cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  // localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  showNotification(`تم حذف "${removedItem[0].name}" من السلة.`);
  renderCartItems();
}

//كل دول بيعملوا اية
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

// Payment method selection
function selectPaymentMethod(method) {
  document.querySelectorAll(".payment-method").forEach((el) => {
    el.classList.remove("selected");
  });

  const selectedMethod = document.querySelector(`[data-method="${method}"]`);
  if (selectedMethod) {
    selectedMethod.classList.add("selected");
  }

  updateCheckoutButton();
}

function updateCheckoutButton() {
  const termsChecked = document.getElementById("terms-checkbox")?.checked;
  const paymentSelected = document.querySelector(
    'input[name="payment"]:checked'
  );
  const checkoutBtn = document.getElementById("checkout-btn");

  if (checkoutBtn) {
    if (termsChecked && paymentSelected && cart.length > 0) {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove("bg-gray-600", "hover:bg-gray-700");
      checkoutBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
    } else {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
      checkoutBtn.classList.add("bg-gray-600", "hover:bg-gray-700");
    }
  }
}

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

  // Payment method selection
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.addEventListener("click", () => {
      const radio = method.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectPaymentMethod(radio.value);
      }
    });
  });

  // Terms checkbox and payment selection
  const termsCheckbox = document.getElementById("terms-checkbox");
  if (termsCheckbox) {
    termsCheckbox.addEventListener("change", updateCheckoutButton);
  }

  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", updateCheckoutButton);
  });

  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!checkoutBtn.disabled) {
        const selectedPayment = document.querySelector(
          'input[name="payment"]:checked'
        );
        showNotification(
          `تم تأكيد الطلب! سيتم التوجه لصفحة الدفع عبر ${selectedPayment.value}`
        );
      }
    });
  }

  // Add to cart buttons
  document.querySelectorAll(".product-card button").forEach((button) => {
    if (button.textContent.includes("اضف للسلة")) {
      button.addEventListener("click", function () {
        const productCard = this.closest(".product-card");
        const productName = productCard.querySelector("h3").textContent.trim();
        const priceElement = productCard.querySelector(".text-red-500");
        const originalPriceElement = productCard.querySelector(".line-through");
        const price = priceElement
          ? priceElement.textContent.trim()
          : "0.00 ر.س";
        const originalPrice = originalPriceElement
          ? originalPriceElement.textContent.trim()
          : null;
        addToCart(productName, price, originalPrice);
      });
    }
  });

  // Update cart count on page load
  updateCartCount();

  // Render cart items if on cart page
  if (document.getElementById("cart-items")) {
    renderCartItems();
    updateCheckoutButton();
  }
});

// Make functions global for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtn = document.getElementById("dropdown-toggle");
  const dropdownMenu = document.getElementById("dropdown-menu");

  dropdownBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // منع إغلاق القائمة فورًا
    dropdownMenu.classList.toggle("hidden");
  });

  // إغلاق القائمة لو المستخدم ضغط خارجها
  document.addEventListener("click", function () {
    dropdownMenu.classList.add("hidden");
  });
});
