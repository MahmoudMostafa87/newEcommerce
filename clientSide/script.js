// script.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

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

function addToCart(productName, price, originalPrice = null) {
  const existingItem = cart.find((item) => item.name === productName);

  // تنظيف السعر وتحويله إلى رقم
  const cleanPrice = parseFloat(price.replace(/[^\d.]/g, ""));
  const cleanOriginalPrice = originalPrice
    ? parseFloat(originalPrice.replace(/[^\d.]/g, ""))
    : null;

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: productName,
      price: cleanPrice,
      originalPrice: cleanOriginalPrice,
      quantity: 1,
    });
  }

  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification(`تم إضافة "${productName}" إلى السلة بنجاح!`);
}

function updateQuantity(index, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(index);
    return;
  }

  cart[index].quantity = newQuantity;
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const subtotalElement = document.getElementById("subtotal");
  const savingsElement = document.getElementById("savings");
  const emptyCartElement = document.getElementById("empty-cart");

  console.log("renderCartItems called");
  console.log("cart:", cart);
  console.log("cartItemsContainer:", cartItemsContainer);

  if (!cartItemsContainer) {
    console.log("cartItemsContainer not found");
    return;
  }

  cartItemsContainer.innerHTML = "";
  let subtotal = 0;
  let totalSavings = 0;

  if (cart.length === 0) {
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

  cart.forEach((item, index) => {
    // التأكد من أن السعر والكمية أرقام صحيحة
    const itemPrice =
      typeof item.price === "number"
        ? item.price
        : parseFloat(item.price.toString().replace(/[^\d.]/g, "")) || 0;
    const itemQuantity = item.quantity || 1;
    const itemOriginalPrice =
      item.originalPrice && typeof item.originalPrice === "number"
        ? item.originalPrice
        : item.originalPrice
        ? parseFloat(item.originalPrice.toString().replace(/[^\d.]/g, ""))
        : itemPrice;

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

function removeFromCart(index) {
  const removedItem = cart.splice(index, 1);
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification(`تم حذف "${removedItem[0].name}" من السلة.`);
  renderCartItems();
}

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
