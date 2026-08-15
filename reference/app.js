/**
 * BINDU PREMIUM - E-commerce Storefront Redesign
 * Core Minimalist Store Application Logic
 */

// ==========================================
// GLOBALS & STATE
// ==========================================
let cart = [];
const SHIPPING_FREE_LIMIT = 2000;
const DELIVERY_FEE_INSIDE = 60;
const DELIVERY_FEE_OUTSIDE = 120;
const WHATSAPP_NUMBER = '8801725556272'; 

// ==========================================
// DOM READY INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  initCountdown();
  initSizeCalculator();
  initEventListeners();
});

// ==========================================
// EVENT LISTENERS INITIALIZATION
// ==========================================
function initEventListeners() {
  // Mobile Hamburger Toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Close Mobile Menu on Link Click
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
      if (hamburger) hamburger.classList.remove('active');
    });
  });

  // Cart Drawer
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawerClose = document.getElementById('cart-drawer-close');

  if (cartToggleBtn && cartDrawerOverlay) {
    cartToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  if (cartDrawerClose && cartDrawerOverlay) {
    cartDrawerClose.addEventListener('click', () => {
      closeCartDrawer();
    });
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) {
        closeCartDrawer();
      }
    });
  }

  // Checkout Modal
  const checkoutDrawerBtn = document.getElementById('checkout-drawer-btn');
  const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
  const checkoutModalClose = document.getElementById('checkout-modal-close');

  if (checkoutDrawerBtn && checkoutModalOverlay) {
    checkoutDrawerBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  if (checkoutModalClose && checkoutModalOverlay) {
    checkoutModalClose.addEventListener('click', () => {
      closeCheckoutModal();
    });
    checkoutModalOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutModalOverlay) {
        closeCheckoutModal();
      }
    });
  }

  // Mobile Sticky Order Bar Button
  const mobileStickyBtn = document.getElementById('mobile-sticky-btn');
  if (mobileStickyBtn) {
    mobileStickyBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Add products to cart first!');
        document.getElementById('products-grid-section').scrollIntoView({ behavior: 'smooth' });
      } else {
        openCheckoutModal();
      }
    });
  }

  // Filter Categories Grid
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      productCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Delivery Zone Selector in Checkout Form
  const checkoutAreaSelect = document.getElementById('checkout-area');
  if (checkoutAreaSelect) {
    checkoutAreaSelect.addEventListener('change', () => {
      updateCheckoutInvoice();
    });
  }

  // Submit Order COD Form
  const checkoutForm = document.getElementById('cod-checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      processCheckoutOrder(e.target);
    });
  }
}

// ==========================================
// CART STATE MANAGEMENT
// ==========================================
function initCart() {
  const cachedCart = localStorage.getItem('bindu_premium_cart');
  if (cachedCart) {
    try {
      cart = JSON.parse(cachedCart);
    } catch (e) {
      cart = [];
    }
  }
  updateCartBadge();
  renderCartDrawer();
}

function saveCart() {
  localStorage.setItem('bindu_premium_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge-count');
  if (badge) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? 'flex' : 'none';
  }
}

function openCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.add('active');
}

function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.remove('active');
}

// Add Item to Cart
function addToCart(id, title, price, image, category) {
  // Try to find size selectors in standard templates
  const sizeSelectorGrid = document.getElementById(`size-select-${id}-grid`);
  const sizeSelectorSale = document.getElementById(`size-select-${id}`);
  
  let selectedSize = 'M';
  if (sizeSelectorGrid && sizeSelectorGrid.offsetWidth > 0) {
    selectedSize = sizeSelectorGrid.value;
  } else if (sizeSelectorSale) {
    selectedSize = sizeSelectorSale.value;
  }

  const cartItemId = `${id}-${selectedSize}`;
  const existingItemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty += 1;
  } else {
    cart.push({
      id: id,
      cartItemId: cartItemId,
      title: title,
      price: price,
      image: image,
      size: selectedSize,
      category: category,
      qty: 1
    });
  }

  saveCart();
  showToast(`Added ${title} (${selectedSize}) to cart!`);
  openCartDrawer();
}

// Update Cart Quantity
function updateCartQty(cartItemId, change) {
  const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
  if (itemIndex > -1) {
    cart[itemIndex].qty += change;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
  }
}

// Remove Item from Cart Completely
function removeCartItem(cartItemId) {
  cart = cart.filter(item => item.cartItemId !== cartItemId);
  saveCart();
  showToast('Product removed from cart.');
}

// Render Cart Drawer
function renderCartDrawer() {
  const cartContainer = document.getElementById('cart-drawer-items');
  const cartSubtotal = document.getElementById('cart-drawer-subtotal');
  const shippingMeterFill = document.getElementById('shipping-meter-fill');
  const shippingMeterText = document.getElementById('shipping-meter-text');

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty-message">
        <p>Your cart is empty.</p>
        <p style="font-size:11px; margin-top: 6px;">Add premium items to get started!</p>
      </div>
    `;
    if (cartSubtotal) cartSubtotal.textContent = '৳0';
    if (shippingMeterFill) shippingMeterFill.style.width = '0%';
    if (shippingMeterText) {
      shippingMeterText.innerHTML = `Shop for <span>৳${SHIPPING_FREE_LIMIT}</span> more to get FREE shipping!`;
    }
    return;
  }

  // Render items
  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.title}" class="cart-item-image">
      <div class="cart-item-details">
        <h4>${item.title}</h4>
        <div class="cart-item-meta">Size: ${item.size} | Code: BD-${item.id}</div>
        <div class="cart-item-qty-row">
          <div class="qty-adjuster">
            <button onclick="updateCartQty('${item.cartItemId}', -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="updateCartQty('${item.cartItemId}', 1)">+</button>
          </div>
          <div class="cart-item-price">৳${item.price * item.qty}</div>
        </div>
      </div>
      <button class="cart-item-delete" onclick="removeCartItem('${item.cartItemId}')">✕</button>
    </div>
  `).join('');

  // Calculate Subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (cartSubtotal) cartSubtotal.textContent = `৳${subtotal}`;

  // Update Free Shipping Progress Bar
  if (shippingMeterFill && shippingMeterText) {
    const progress = Math.min((subtotal / SHIPPING_FREE_LIMIT) * 100, 100);
    shippingMeterFill.style.width = `${progress}%`;

    if (subtotal >= SHIPPING_FREE_LIMIT) {
      shippingMeterText.innerHTML = `<span style="color: #28A745; font-weight:700;">🎉 Unlocked FREE shipping!</span>`;
    } else {
      const remaining = SHIPPING_FREE_LIMIT - subtotal;
      shippingMeterText.innerHTML = `Shop for <span>৳${remaining}</span> more to get FREE shipping!`;
    }
  }
}

// ==========================================
// FLASH SALE COUNTDOWN TIMER
// ==========================================
function initCountdown() {
  let flashSaleEndTime = localStorage.getItem('bindu_flash_sale_end');
  
  if (!flashSaleEndTime) {
    const twoDaysFromNow = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
    localStorage.setItem('bindu_flash_sale_end', twoDaysFromNow.toString());
    flashSaleEndTime = twoDaysFromNow;
  } else {
    flashSaleEndTime = parseInt(flashSaleEndTime);
    if (new Date().getTime() > flashSaleEndTime) {
      const resetTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
      localStorage.setItem('bindu_flash_sale_end', resetTime.toString());
      flashSaleEndTime = resetTime;
    }
  }

  const daysNum = document.getElementById('cd-days');
  const hoursNum = document.getElementById('cd-hours');
  const minsNum = document.getElementById('cd-mins');
  const secsNum = document.getElementById('cd-secs');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = flashSaleEndTime - now;

    if (distance < 0) {
      const nextTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
      localStorage.setItem('bindu_flash_sale_end', nextTime.toString());
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysNum) daysNum.textContent = days.toString().padStart(2, '0');
    if (hoursNum) hoursNum.textContent = hours.toString().padStart(2, '0');
    if (minsNum) minsNum.textContent = minutes.toString().padStart(2, '0');
    if (secsNum) secsNum.textContent = seconds.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ==========================================
// INTERACTIVE SIZE RECOMMENDATION CALCULATOR
// ==========================================
function initSizeCalculator() {
  const calcInput = document.getElementById('calc-chest-input');
  const calcResultBox = document.getElementById('calc-result-box');
  const calcResultVal = document.getElementById('calc-result-value');

  if (!calcInput) return;

  calcInput.addEventListener('input', (e) => {
    const valueStr = e.target.value.trim();
    if (valueStr === '') {
      if (calcResultBox) calcResultBox.classList.remove('active');
      return;
    }

    const chestInches = parseFloat(valueStr);
    if (isNaN(chestInches) || chestInches <= 0) {
      if (calcResultVal) calcResultVal.textContent = 'Invalid size';
      if (calcResultBox) calcResultBox.classList.add('active');
      return;
    }

    let recommendedSize = '';
    if (chestInches < 35) {
      recommendedSize = 'XS';
    } else if (chestInches >= 35 && chestInches < 37) {
      recommendedSize = 'S';
    } else if (chestInches >= 37 && chestInches < 39) {
      recommendedSize = 'M';
    } else if (chestInches >= 39 && chestInches < 41) {
      recommendedSize = 'L';
    } else if (chestInches >= 41 && chestInches < 43) {
      recommendedSize = 'XL';
    } else if (chestInches >= 43 && chestInches < 46) {
      recommendedSize = 'XXL';
    } else {
      recommendedSize = '3XL';
    }

    if (calcResultVal) calcResultVal.textContent = recommendedSize;
    if (calcResultBox) calcResultBox.classList.add('active');
  });
}

// ==========================================
// CHECKOUT MODAL FLOW
// ==========================================
function openCheckoutModal() {
  const overlay = document.getElementById('checkout-modal-overlay');
  const regularForm = document.getElementById('cod-checkout-form');
  const successScreen = document.getElementById('checkout-success-screen');

  if (overlay) {
    overlay.classList.add('active');
  }
  if (regularForm) {
    regularForm.style.display = 'block';
  }
  if (successScreen) {
    successScreen.classList.remove('active');
  }

  renderCheckoutSummary();
  updateCheckoutInvoice();
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-summary-items');
  if (!container) return;

  container.innerHTML = cart.map(item => `
    <div class="summary-item-row">
      <span class="summary-item-name">${item.title} (${item.size}) <span style="color: var(--text-muted)">x${item.qty}</span></span>
      <span class="summary-item-price">৳${item.price * item.qty}</span>
    </div>
  `).join('');
}

function updateCheckoutInvoice() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const areaSelect = document.getElementById('checkout-area');
  const invoiceSubtotal = document.getElementById('invoice-subtotal');
  const invoiceShipping = document.getElementById('invoice-shipping');
  const invoiceTotal = document.getElementById('invoice-total');

  if (!invoiceSubtotal || !invoiceShipping || !invoiceTotal) return;

  invoiceSubtotal.textContent = `৳${subtotal}`;

  let shippingCost = 0;
  if (subtotal < SHIPPING_FREE_LIMIT) {
    const area = areaSelect ? areaSelect.value : 'inside';
    shippingCost = area === 'inside' ? DELIVERY_FEE_INSIDE : DELIVERY_FEE_OUTSIDE;
    invoiceShipping.textContent = `৳${shippingCost}`;
  } else {
    invoiceShipping.textContent = 'FREE';
  }

  const finalTotal = subtotal + shippingCost;
  invoiceTotal.textContent = `৳${finalTotal}`;
}

// Form validations
function validateCheckoutForm(form) {
  const name = form.querySelector('[name="customer_name"]').value.trim();
  const phone = form.querySelector('[name="customer_phone"]').value.trim();
  const address = form.querySelector('[name="customer_address"]').value.trim();

  if (name.length < 2) {
    showToast('Please enter your full name.');
    return false;
  }

  const bdMobileRegex = /^(?:\+88)?01[3-9]\d{8}$/;
  if (!bdMobileRegex.test(phone)) {
    showToast('Please enter a valid 11-digit mobile number.');
    return false;
  }

  if (address.length < 5) {
    showToast('Please specify a detailed address.');
    return false;
  }

  return true;
}

// Process and submit COD Order
function processCheckoutOrder(form) {
  if (!validateCheckoutForm(form)) return;

  const name = form.querySelector('[name="customer_name"]').value.trim();
  const phone = form.querySelector('[name="customer_phone"]').value.trim();
  const address = form.querySelector('[name="customer_address"]').value.trim();
  const area = form.querySelector('[name="checkout_area"]').value;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal >= SHIPPING_FREE_LIMIT ? 0 : (area === 'inside' ? DELIVERY_FEE_INSIDE : DELIVERY_FEE_OUTSIDE);
  const total = subtotal + shipping;

  const orderId = 'BP-' + Math.floor(100000 + Math.random() * 900000);

  document.getElementById('success-order-id').textContent = orderId;
  document.getElementById('success-customer-name').textContent = name;
  document.getElementById('success-total').textContent = `৳${total}`;

  document.getElementById('cod-checkout-form').style.display = 'none';
  document.getElementById('checkout-success-screen').classList.add('active');

  cart = [];
  saveCart();
}

// WhatsApp Order Direct message generator
function triggerWhatsAppOrder(form) {
  const name = form.querySelector('[name="customer_name"]').value.trim();
  const phone = form.querySelector('[name="customer_phone"]').value.trim();
  const address = form.querySelector('[name="customer_address"]').value.trim();
  const area = form.querySelector('[name="checkout_area"]').value;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal >= SHIPPING_FREE_LIMIT ? 0 : (area === 'inside' ? DELIVERY_FEE_INSIDE : DELIVERY_FEE_OUTSIDE);
  const total = subtotal + shipping;

  let message = `*NEW ORDER - BINDU PREMIUM*\n`;
  message += `-----------------------------\n`;
  message += `*Customer:* ${name}\n`;
  message += `*Mobile:* ${phone}\n`;
  message += `*Address:* ${address}\n`;
  message += `*Area:* ${area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}\n\n`;
  message += `*Items Ordered:*\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.title} (${item.size}) x ${item.qty} - ৳${item.price * item.qty}\n`;
  });

  message += `\n-----------------------------\n`;
  message += `*Subtotal:* ৳${subtotal}\n`;
  message += `*Delivery Charge:* ৳${shipping === 0 ? 'FREE' : shipping}\n`;
  message += `*Grand Total:* ৳${total}\n\n`;
  message += `*Method:* Cash on Delivery (COD)\n`;
  message += `Please confirm my order. Thank you!`;

  const encodedText = encodeURIComponent(message);
  const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;

  window.open(waUrl, '_blank');
}

// ==========================================
// DYNAMIC TOAST ALERT SYSTEM
// ==========================================
function showToast(message) {
  const container = document.getElementById('toast-notification-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>✅</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('active');
  }, 50);

  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

// Export functions to global window
window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.removeCartItem = removeCartItem;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
