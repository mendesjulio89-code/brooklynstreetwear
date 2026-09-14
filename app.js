/**
 * BROOKLYN STREETWEAR - E-COMMERCE ENGINE
 * Totalmente funcional com persistência em localStorage.
 */

// --- DADOS INICIAIS DA LOJA (SEED) ---
const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Camiseta Oversized Brooklyn",
    category: "Camisetas",
    price: 129.90,
    oldPrice: 159.90,
    sizes: ["P", "M", "G", "GG"],
    stock: 16,
    badge: "Mais Vendido",
    description: "Corte oversized autêntico com caimento pesado e estruturado. Confeccionada em algodão penteado 260g/m², gola canelada de 3cm e estampa minimalista Brooklyn.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-2",
    name: "Camiseta Acid Wash 'No Rules'",
    category: "Camisetas",
    price: 149.90,
    oldPrice: 179.90,
    sizes: ["P", "M", "G", "GG"],
    stock: 8,
    badge: "Drop Limitado",
    description: "Lavagem vintage acid wash marmorizada em cinza grafite. Cada peça possui padrão único, costuras reforçadas ombro a ombro e visual distressed.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-3",
    name: "Tênis Street Runner Low",
    category: "Calçados",
    price: 389.90,
    oldPrice: 429.90,
    sizes: ["38", "39", "40", "41", "42"],
    stock: 12,
    badge: "Destaque",
    description: "Solado vulcanizado em borracha de alta abrasão, cabedal em camurça premium e tecido respirável. Máximo conforto e amortecimento para o lifestyle urbano.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-4",
    name: "Tênis Chunky Skate High",
    category: "Calçados",
    price: 449.90,
    oldPrice: null,
    sizes: ["39", "40", "41", "42", "43"],
    stock: 7,
    badge: "Novo",
    description: "Visual robusto inspirado no skate dos anos 90. Cano médio almofadado, costuras quádruplas e sola tratorada com aderência para qualquer terreno.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-5",
    name: "Boné 5-Panel Street Club",
    category: "Acessórios",
    price: 89.90,
    oldPrice: 109.90,
    sizes: ["Único"],
    stock: 24,
    badge: "Essencial",
    description: "Modelagem 5-Panel em ripstop de alta durabilidade com fecho regulador strapback de nylon e etiqueta frontal emborrachada de alta definição.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-6",
    name: "Shoulder Bag Tactical Urban",
    category: "Acessórios",
    price: 119.90,
    oldPrice: 139.90,
    sizes: ["Único"],
    stock: 15,
    badge: "Tendência",
    description: "Shoulder bag modular com fita tiracolo ajustável, 3 compartimentos com zíperes selados resistentes à água e mosquetão de metal reforçado.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
  }
];

const INITIAL_SETTINGS = {
  shippingCost: 19.90,
  freeShippingThreshold: 299.00
};

const INITIAL_COUPONS = [
  { code: "BROOKLYN10", discountPercent: 10, active: true },
  { code: "STREET15", discountPercent: 15, active: true },
  { code: "VIP20", discountPercent: 20, active: true }
];

// --- ESTADO GLOBAL DA APLICAÇÃO ---
class StoreState {
  constructor() {
    this.loadState();
  }

  loadState() {
    // Produtos
    const savedProds = localStorage.getItem("brooklyn_products");
    this.products = savedProds ? JSON.parse(savedProds) : [...INITIAL_PRODUCTS];

    // Configurações
    const savedSettings = localStorage.getItem("brooklyn_settings");
    this.settings = savedSettings ? JSON.parse(savedSettings) : { ...INITIAL_SETTINGS };

    // Cupons
    const savedCoupons = localStorage.getItem("brooklyn_coupons");
    this.coupons = savedCoupons ? JSON.parse(savedCoupons) : [...INITIAL_COUPONS];

    // Usuário atual
    const savedUser = localStorage.getItem("brooklyn_user");
    this.currentUser = savedUser ? JSON.parse(savedUser) : null;

    // Carrinho
    const savedCart = localStorage.getItem("brooklyn_cart");
    this.cart = savedCart ? JSON.parse(savedCart) : [];

    // Cupom aplicado no carrinho
    this.appliedCoupon = null;

    // Filtros atuais
    this.selectedCategory = "todos";
    this.searchQuery = "";
  }

  saveProducts() {
    localStorage.setItem("brooklyn_products", JSON.stringify(this.products));
  }

  saveSettings() {
    localStorage.setItem("brooklyn_settings", JSON.stringify(this.settings));
  }

  saveCoupons() {
    localStorage.setItem("brooklyn_coupons", JSON.stringify(this.coupons));
  }

  saveCart() {
    localStorage.setItem("brooklyn_cart", JSON.stringify(this.cart));
  }

  saveUser() {
    if (this.currentUser) {
      localStorage.setItem("brooklyn_user", JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem("brooklyn_user");
    }
  }

  resetToDefaults() {
    this.products = [...INITIAL_PRODUCTS];
    this.settings = { ...INITIAL_SETTINGS };
    this.coupons = [...INITIAL_COUPONS];
    this.cart = [];
    this.appliedCoupon = null;
    this.saveProducts();
    this.saveSettings();
    this.saveCoupons();
    this.saveCart();
  }
}

const state = new StoreState();

// --- ELEMENTOS DO DOM ---
const DOM = {
  // Top bar
  topBarFreteGratis: document.getElementById("topBarFreteGratis"),
  // Search & Filter
  searchInput: document.getElementById("searchInput"),
  categoryButtons: document.querySelectorAll(".category-btn"),
  productsGrid: document.getElementById("productsGrid"),
  // User nav
  userNavSection: document.getElementById("userNavSection"),
  userMenuBtn: document.getElementById("userMenuBtn"),
  userNameLabel: document.getElementById("userNameLabel"),
  adminQuickBtn: document.getElementById("adminQuickBtn"),
  // Cart Trigger
  openCartBtn: document.getElementById("openCartBtn"),
  cartBadge: document.getElementById("cartBadge"),
  // Cart Drawer
  cartDrawer: document.getElementById("cartDrawer"),
  cartBackdrop: document.getElementById("cartBackdrop"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartItemsList: document.getElementById("cartItemsList"),
  cartEmptyState: document.getElementById("cartEmptyState"),
  cartFooter: document.getElementById("cartFooter"),
  drawerItemCount: document.getElementById("drawerItemCount"),
  couponInput: document.getElementById("couponInput"),
  applyCouponBtn: document.getElementById("applyCouponBtn"),
  couponAppliedBadge: document.getElementById("couponAppliedBadge"),
  couponAppliedText: document.getElementById("couponAppliedText"),
  removeCouponBtn: document.getElementById("removeCouponBtn"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  cartDiscountRow: document.getElementById("cartDiscountRow"),
  cartDiscount: document.getElementById("cartDiscount"),
  cartFrete: document.getElementById("cartFrete"),
  freteInfoTip: document.getElementById("freteInfoTip"),
  cartTotal: document.getElementById("cartTotal"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  emptyCartShopBtn: document.getElementById("emptyCartShopBtn"),
  // Product Detail Modal
  productModal: document.getElementById("productModal"),
  closeProductModalBtn: document.getElementById("closeProductModalBtn"),
  modalProductImg: document.getElementById("modalProductImg"),
  modalProductBadge: document.getElementById("modalProductBadge"),
  modalProductCategory: document.getElementById("modalProductCategory"),
  modalProductName: document.getElementById("modalProductName"),
  modalProductPrice: document.getElementById("modalProductPrice"),
  modalProductOldPrice: document.getElementById("modalProductOldPrice"),
  modalProductStock: document.getElementById("modalProductStock"),
  modalProductStockText: document.getElementById("modalProductStockText"),
  modalProductDesc: document.getElementById("modalProductDesc"),
  modalSizeButtons: document.getElementById("modalSizeButtons"),
  sizeErrorMsg: document.getElementById("sizeErrorMsg"),
  modalQtyMinus: document.getElementById("modalQtyMinus"),
  modalQtyPlus: document.getElementById("modalQtyPlus"),
  modalQtyDisplay: document.getElementById("modalQtyDisplay"),
  modalAddToCartBtn: document.getElementById("modalAddToCartBtn"),
  // Checkout Modal
  checkoutModal: document.getElementById("checkoutModal"),
  closeCheckoutBtn: document.getElementById("closeCheckoutBtn"),
  checkoutForm: document.getElementById("checkoutForm"),
  chkName: document.getElementById("chkName"),
  chkEmail: document.getElementById("chkEmail"),
  chkPhone: document.getElementById("chkPhone"),
  chkCpf: document.getElementById("chkCpf"),
  chkCep: document.getElementById("chkCep"),
  chkAddress: document.getElementById("chkAddress"),
  chkNeighborhood: document.getElementById("chkNeighborhood"),
  chkCity: document.getElementById("chkCity"),
  chkState: document.getElementById("chkState"),
  paymentRadios: document.querySelectorAll("input[name='paymentMethod']"),
  pixDetails: document.getElementById("pixDetails"),
  cardDetails: document.getElementById("cardDetails"),
  boletoDetails: document.getElementById("boletoDetails"),
  chkItemsCount: document.getElementById("chkItemsCount"),
  chkFreteVal: document.getElementById("chkFreteVal"),
  chkPixDiscountRow: document.getElementById("chkPixDiscountRow"),
  chkPixDiscountVal: document.getElementById("chkPixDiscountVal"),
  chkFinalTotal: document.getElementById("chkFinalTotal"),
  confirmOrderBtn: document.getElementById("confirmOrderBtn"),
  // Order Success Modal
  orderSuccessModal: document.getElementById("orderSuccessModal"),
  closeSuccessBtn: document.getElementById("closeSuccessBtn"),
  successOrderId: document.getElementById("successOrderId"),
  successPaymentMethod: document.getElementById("successPaymentMethod"),
  successTotal: document.getElementById("successTotal"),
  successAddress: document.getElementById("successAddress"),
  pixQrContainer: document.getElementById("pixQrContainer"),
  pixCodeCopy: document.getElementById("pixCodeCopy"),
  copyPixBtn: document.getElementById("copyPixBtn"),
  // Auth Modal
  authModal: document.getElementById("authModal"),
  closeAuthBtn: document.getElementById("closeAuthBtn"),
  tabClientAuth: document.getElementById("tabClientAuth"),
  tabAdminAuth: document.getElementById("tabAdminAuth"),
  clientLoginForm: document.getElementById("clientLoginForm"),
  adminLoginForm: document.getElementById("adminLoginForm"),
  clientNameInput: document.getElementById("clientNameInput"),
  clientEmailInput: document.getElementById("clientEmailInput"),
  clientPasswordInput: document.getElementById("clientPasswordInput"),
  adminEmailInput: document.getElementById("adminEmailInput"),
  adminPasswordInput: document.getElementById("adminPasswordInput"),
  // Profile Modal
  userProfileModal: document.getElementById("userProfileModal"),
  closeProfileBtn: document.getElementById("closeProfileBtn"),
  profileAvatarLetter: document.getElementById("profileAvatarLetter"),
  profileName: document.getElementById("profileName"),
  profileEmail: document.getElementById("profileEmail"),
  profileRoleBadge: document.getElementById("profileRoleBadge"),
  profileAdminBtn: document.getElementById("profileAdminBtn"),
  profileLogoutBtn: document.getElementById("profileLogoutBtn"),
  // Admin Modal
  adminPanelModal: document.getElementById("adminPanelModal"),
  closeAdminPanelBtn: document.getElementById("closeAdminPanelBtn"),
  adminTabProducts: document.getElementById("adminTabProducts"),
  adminTabCoupons: document.getElementById("adminTabCoupons"),
  adminTabShipping: document.getElementById("adminTabShipping"),
  adminSectionProducts: document.getElementById("adminSectionProducts"),
  adminSectionCoupons: document.getElementById("adminSectionCoupons"),
  adminSectionShipping: document.getElementById("adminSectionShipping"),
  adminToggleAddProductBtn: document.getElementById("adminToggleAddProductBtn"),
  adminNewProductForm: document.getElementById("adminNewProductForm"),
  adminCancelNewProd: document.getElementById("adminCancelNewProd"),
  adminProductsTableBody: document.getElementById("adminProductsTableBody"),
  adminNewCouponForm: document.getElementById("adminNewCouponForm"),
  adminCouponsList: document.getElementById("adminCouponsList"),
  adminShippingForm: document.getElementById("adminShippingForm"),
  adminShippingCost: document.getElementById("adminShippingCost"),
  adminFreeShippingMin: document.getElementById("adminFreeShippingMin"),
  // Toast
  toast: document.getElementById("toast"),
  toastMsg: document.getElementById("toastMsg"),
  // Footer helpers
  footerAdminSwitch: document.getElementById("footerAdminSwitch"),
  footerResetStore: document.getElementById("footerResetStore")
};

// --- HELPER FORMATADOR DE MOEDA ---
const formatCurrency = (val) => {
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// --- NOTIFICAÇÕES TOAST ---
let toastTimeout;
function showToast(message) {
  if (toastTimeout) clearTimeout(toastTimeout);
  DOM.toastMsg.textContent = message;
  DOM.toast.classList.remove("translate-y-20", "opacity-0");
  DOM.toast.classList.add("translate-y-0", "opacity-100");
  toastTimeout = setTimeout(() => {
    DOM.toast.classList.add("translate-y-20", "opacity-0");
    DOM.toast.classList.remove("translate-y-0", "opacity-100");
  }, 2800);
}

// --- RENDERIZAÇÃO DO CATÁLOGO DE PRODUTOS ---
function renderProducts() {
  const filtered = state.products.filter(prod => {
    const matchesCategory = state.selectedCategory === "todos" || prod.category.toLowerCase() === state.selectedCategory.toLowerCase();
    const matchesSearch = prod.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    DOM.productsGrid.innerHTML = `
      <div class="col-span-full py-16 text-center text-zinc-500">
        <i data-lucide="package-search" class="w-12 h-12 mx-auto mb-2 text-zinc-600"></i>
        <p class="text-sm font-semibold">Nenhum produto encontrado para sua busca.</p>
        <button onclick="clearFilters()" class="mt-3 px-3 py-1.5 bg-zinc-800 text-yellow-400 text-xs font-bold rounded">
          Limpar Filtros
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  DOM.productsGrid.innerHTML = filtered.map(prod => {
    const hasDiscount = prod.oldPrice && prod.oldPrice > prod.price;
    const isOutOfStock = prod.stock <= 0;

    return `
      <div class="product-card group relative bg-[#121216] border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between">
        
        <!-- Image Area -->
        <div class="relative aspect-square overflow-hidden bg-zinc-950 cursor-pointer" onclick="openProductModal('${prod.id}')">
          <img src="${prod.image}" alt="${prod.name}" class="product-img w-full h-full object-cover">
          
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            ${prod.badge ? `<span class="bg-yellow-400 text-black font-extrabold text-[10px] px-2 py-0.5 uppercase tracking-wider rounded">${prod.badge}</span>` : ''}
            ${hasDiscount ? `<span class="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 uppercase tracking-wider rounded">OFERTA</span>` : ''}
          </div>

          ${isOutOfStock ? `
            <div class="absolute inset-0 bg-black/75 flex items-center justify-center">
              <span class="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded">Esgotado</span>
            </div>
          ` : ''}
        </div>

        <!-- Info Area -->
        <div class="p-5 flex flex-col flex-grow justify-between">
          <div>
            <div class="flex items-center justify-between text-[11px] font-bold text-yellow-400 uppercase tracking-wider mb-1">
              <span>${prod.category}</span>
              <span class="text-zinc-500 font-mono">${prod.stock} em estoque</span>
            </div>

            <h3 class="font-heading text-lg font-bold text-white group-hover:text-yellow-400 transition-colors cursor-pointer line-clamp-1" onclick="openProductModal('${prod.id}')">
              ${prod.name}
            </h3>

            <!-- Sizes Display -->
            <div class="flex flex-wrap gap-1 mt-2">
              ${prod.sizes.map(s => `
                <span class="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
                  ${s}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Price & Purchase Action -->
          <div class="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div>
              ${hasDiscount ? `<span class="block text-[11px] text-zinc-500 line-through">${formatCurrency(prod.oldPrice)}</span>` : ''}
              <span class="text-xl font-black text-yellow-400">${formatCurrency(prod.price)}</span>
            </div>

            <button onclick="openProductModal('${prod.id}')" ${isOutOfStock ? 'disabled' : ''}
              class="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition-transform active:scale-95">
              <span>COMPRAR</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

window.clearFilters = () => {
  state.selectedCategory = "todos";
  state.searchQuery = "";
  DOM.searchInput.value = "";
  DOM.categoryButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === "todos");
  });
  renderProducts();
};

// --- CONTROLE DO MODAL DE DETALHES DO PRODUTO ---
let currentModalProduct = null;
let currentSelectedSize = null;
let currentModalQty = 1;

window.openProductModal = function(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  currentModalProduct = prod;
  currentSelectedSize = prod.sizes.length > 0 ? prod.sizes[0] : null;
  currentModalQty = 1;

  DOM.modalProductImg.src = prod.image;
  DOM.modalProductImg.alt = prod.name;
  DOM.modalProductBadge.textContent = prod.badge || "Brooklyn";
  DOM.modalProductCategory.textContent = prod.category;
  DOM.modalProductName.textContent = prod.name;
  DOM.modalProductPrice.textContent = formatCurrency(prod.price);
  
  if (prod.oldPrice && prod.oldPrice > prod.price) {
    DOM.modalProductOldPrice.textContent = formatCurrency(prod.oldPrice);
    DOM.modalProductOldPrice.classList.remove("hidden");
  } else {
    DOM.modalProductOldPrice.classList.add("hidden");
  }

  DOM.modalProductDesc.textContent = prod.description;

  // Estoque
  if (prod.stock > 0) {
    DOM.modalProductStockText.textContent = `Em estoque (${prod.stock} unidades disponíveis)`;
    DOM.modalProductStock.className = "mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5";
    DOM.modalAddToCartBtn.disabled = false;
    DOM.modalAddToCartBtn.classList.remove("opacity-50", "cursor-not-allowed");
  } else {
    DOM.modalProductStockText.textContent = "Produto temporariamente esgotado";
    DOM.modalProductStock.className = "mt-2 text-xs font-semibold text-red-400 flex items-center gap-1.5";
    DOM.modalAddToCartBtn.disabled = true;
    DOM.modalAddToCartBtn.classList.add("opacity-50", "cursor-not-allowed");
  }

  // Renderizar Tamanhos
  DOM.modalSizeButtons.innerHTML = prod.sizes.map((s, idx) => `
    <button type="button" class="size-btn ${idx === 0 ? 'selected' : ''}" onclick="selectModalSize(this, '${s}')">
      ${s}
    </button>
  `).join('');
  DOM.sizeErrorMsg.classList.add("hidden");

  // Reset Quantidade
  DOM.modalQtyDisplay.textContent = "1";

  // Exibir Modal
  DOM.productModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  lucide.createIcons();
};

window.selectModalSize = function(btnElement, size) {
  document.querySelectorAll("#modalSizeButtons .size-btn").forEach(b => b.classList.remove("selected"));
  btnElement.classList.add("selected");
  currentSelectedSize = size;
  DOM.sizeErrorMsg.classList.add("hidden");
};

DOM.closeProductModalBtn.addEventListener("click", () => {
  DOM.productModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
});

DOM.modalQtyMinus.addEventListener("click", () => {
  if (currentModalQty > 1) {
    currentModalQty--;
    DOM.modalQtyDisplay.textContent = currentModalQty;
  }
});

DOM.modalQtyPlus.addEventListener("click", () => {
  if (!currentModalProduct) return;
  if (currentModalQty < currentModalProduct.stock) {
    currentModalQty++;
    DOM.modalQtyDisplay.textContent = currentModalQty;
  } else {
    showToast(`Limite de estoque atingido (${currentModalProduct.stock} disponíveis)`);
  }
});

DOM.modalAddToCartBtn.addEventListener("click", () => {
  if (!currentModalProduct) return;
  if (!currentSelectedSize) {
    DOM.sizeErrorMsg.classList.remove("hidden");
    return;
  }

  addToCart(currentModalProduct, currentSelectedSize, currentModalQty);
  DOM.productModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
  openCartDrawer();
  showToast(`"${currentModalProduct.name}" adicionado ao carrinho!`);
});

// --- LÓGICA DO CARRINHO DE COMPRAS ---
function addToCart(product, size, qty) {
  const existingIndex = state.cart.findIndex(item => item.id === product.id && item.size === size);

  if (existingIndex > -1) {
    const newQty = state.cart[existingIndex].quantity + qty;
    if (newQty <= product.stock) {
      state.cart[existingIndex].quantity = newQty;
    } else {
      state.cart[existingIndex].quantity = product.stock;
      showToast(`Ajustado para o estoque máximo (${product.stock})`);
    }
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      quantity: Math.min(qty, product.stock),
      stock: product.stock
    });
  }

  state.saveCart();
  updateCartUI();
}

window.updateCartItemQty = function(index, delta) {
  const item = state.cart[index];
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    state.cart.splice(index, 1);
  } else if (newQty > item.stock) {
    showToast(`Limite máximo de estoque (${item.stock})`);
    return;
  } else {
    item.quantity = newQty;
  }

  state.saveCart();
  updateCartUI();
};

window.removeCartItem = function(index) {
  state.cart.splice(index, 1);
  state.saveCart();
  updateCartUI();
  showToast("Item removido do carrinho");
};

function calculateCartTotals() {
  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (state.appliedCoupon && subtotal > 0) {
    discount = (subtotal * state.appliedCoupon.discountPercent) / 100;
  }

  let frete = 0;
  if (subtotal > 0) {
    if (subtotal >= state.settings.freeShippingThreshold) {
      frete = 0;
    } else {
      frete = state.settings.shippingCost;
    }
  }

  const total = Math.max(0, subtotal - discount + frete);
  const totalItemsCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  return { subtotal, discount, frete, total, totalItemsCount };
}

function updateCartUI() {
  const { subtotal, discount, frete, total, totalItemsCount } = calculateCartTotals();

  // Atualizar Badges
  DOM.cartBadge.textContent = totalItemsCount;
  DOM.drawerItemCount.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'itens'}`;

  // Se vazio
  if (state.cart.length === 0) {
    DOM.cartItemsList.classList.add("hidden");
    DOM.cartFooter.classList.add("hidden");
    DOM.cartEmptyState.classList.remove("hidden");
    return;
  }

  DOM.cartItemsList.classList.remove("hidden");
  DOM.cartFooter.classList.remove("hidden");
  DOM.cartEmptyState.classList.add("hidden");

  // Renderizar Lista de Itens no Drawer
  DOM.cartItemsList.innerHTML = state.cart.map((item, index) => `
    <div class="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg bg-zinc-900 shrink-0">
      
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-white truncate">${item.name}</h4>
        <div class="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
          <span>Tam: <strong class="text-yellow-400">${item.size}</strong></span>
          <span>•</span>
          <span>${formatCurrency(item.price)}</span>
        </div>

        <!-- Quantity buttons -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center border border-zinc-800 rounded bg-zinc-900">
            <button onclick="updateCartItemQty(${index}, -1)" class="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white font-bold">
              -
            </button>
            <span class="w-7 text-center text-xs font-bold text-white">${item.quantity}</span>
            <button onclick="updateCartItemQty(${index}, 1)" class="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white font-bold">
              +
            </button>
          </div>

          <button onclick="removeCartItem(${index})" class="text-zinc-500 hover:text-red-400 p-1">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Atualizar Valores
  DOM.cartSubtotal.textContent = formatCurrency(subtotal);

  if (discount > 0) {
    DOM.cartDiscountRow.classList.remove("hidden");
    DOM.cartDiscount.textContent = `- ${formatCurrency(discount)}`;
  } else {
    DOM.cartDiscountRow.classList.add("hidden");
  }

  if (frete === 0) {
    DOM.cartFrete.innerHTML = `<span class="text-emerald-400 font-extrabold uppercase text-[11px]">GRÁTIS</span>`;
    DOM.freteInfoTip.textContent = "(Acima de R$ " + state.settings.freeShippingThreshold.toFixed(0) + ")";
  } else {
    DOM.cartFrete.textContent = formatCurrency(frete);
    DOM.freteInfoTip.textContent = `(Padrão)`;
  }

  DOM.cartTotal.textContent = formatCurrency(total);

  // Cupom Badge
  if (state.appliedCoupon) {
    DOM.couponAppliedBadge.classList.remove("hidden");
    DOM.couponAppliedText.textContent = `Cupom ${state.appliedCoupon.code} aplicado (-${state.appliedCoupon.discountPercent}%)`;
  } else {
    DOM.couponAppliedBadge.classList.add("hidden");
  }

  lucide.createIcons();
}

// Cupom Handlers
DOM.applyCouponBtn.addEventListener("click", () => {
  const code = DOM.couponInput.value.trim().toUpperCase();
  if (!code) return;

  const found = state.coupons.find(c => c.code.toUpperCase() === code && c.active);
  if (found) {
    state.appliedCoupon = found;
    DOM.couponInput.value = "";
    updateCartUI();
    showToast(`Cupom ${found.code} aplicado com sucesso!`);
  } else {
    showToast("Cupom inválido ou expirado.");
  }
});

DOM.removeCouponBtn.addEventListener("click", () => {
  state.appliedCoupon = null;
  updateCartUI();
  showToast("Cupom removido.");
});

// Abertura / Fechamento do Carrinho
function openCartDrawer() {
  updateCartUI();
  DOM.cartDrawer.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeCartDrawer() {
  DOM.cartDrawer.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

DOM.openCartBtn.addEventListener("click", openCartDrawer);
DOM.closeCartBtn.addEventListener("click", closeCartDrawer);
DOM.cartBackdrop.addEventListener("click", closeCartDrawer);
DOM.emptyCartShopBtn.addEventListener("click", () => {
  closeCartDrawer();
  const destaques = document.getElementById("destaques");
  if (destaques) destaques.scrollIntoView({ behavior: "smooth" });
});

// --- CHECKOUT & FORMAS DE PAGAMENTO ---
DOM.checkoutBtn.addEventListener("click", () => {
  if (state.cart.length === 0) return;
  closeCartDrawer();
  openCheckoutModal();
});

function openCheckoutModal() {
  // Preencher dados se usuário estiver logado
  if (state.currentUser) {
    DOM.chkName.value = state.currentUser.name || "";
    DOM.chkEmail.value = state.currentUser.email || "";
  }

  updateCheckoutTotals();
  DOM.checkoutModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  lucide.createIcons();
}

function closeCheckoutModal() {
  DOM.checkoutModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

DOM.closeCheckoutBtn.addEventListener("click", closeCheckoutModal);

// Alternar detalhes de pagamento
DOM.paymentRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    const val = radio.value;
    DOM.pixDetails.classList.toggle("hidden", val !== "pix");
    DOM.cardDetails.classList.toggle("hidden", val !== "card");
    DOM.boletoDetails.classList.toggle("hidden", val !== "boleto");
    updateCheckoutTotals();
  });
});

function getSelectedPaymentMethod() {
  const selected = document.querySelector("input[name='paymentMethod']:checked");
  return selected ? selected.value : "pix";
}

function updateCheckoutTotals() {
  const { total, frete, totalItemsCount } = calculateCartTotals();
  const paymentMethod = getSelectedPaymentMethod();

  DOM.chkItemsCount.textContent = `${totalItemsCount} itens`;
  DOM.chkFreteVal.textContent = frete === 0 ? "GRÁTIS" : formatCurrency(frete);

  let finalTotal = total;
  if (paymentMethod === "pix") {
    const pixDiscount = total * 0.05;
    finalTotal = total - pixDiscount;
    DOM.chkPixDiscountRow.classList.remove("hidden");
    DOM.chkPixDiscountVal.textContent = `- ${formatCurrency(pixDiscount)}`;
  } else {
    DOM.chkPixDiscountRow.classList.add("hidden");
  }

  DOM.chkFinalTotal.textContent = formatCurrency(finalTotal);
}

// Submissão do Checkout
DOM.checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const paymentMethod = getSelectedPaymentMethod();
  const { total, frete } = calculateCartTotals();
  let finalAmount = total;
  if (paymentMethod === "pix") finalAmount = total * 0.95;

  const orderId = `#BK-${Math.floor(10000 + Math.random() * 90000)}`;

  // Reduzir estoque dos produtos
  state.cart.forEach(cartItem => {
    const prod = state.products.find(p => p.id === cartItem.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - cartItem.quantity);
    }
  });
  state.saveProducts();
  renderProducts();

  // Limpar carrinho
  state.cart = [];
  state.appliedCoupon = null;
  state.saveCart();
  updateCartUI();

  // Fechar checkout e abrir sucesso
  closeCheckoutModal();
  openSuccessModal(orderId, paymentMethod, finalAmount, DOM.chkAddress.value);
});

function openSuccessModal(orderId, paymentMethod, total, address) {
  DOM.successOrderId.textContent = orderId;
  DOM.successPaymentMethod.textContent = paymentMethod.toUpperCase();
  DOM.successTotal.textContent = formatCurrency(total);
  DOM.successAddress.textContent = address;

  if (paymentMethod === "pix") {
    DOM.pixQrContainer.classList.remove("hidden");
    DOM.pixCodeCopy.value = `00020126580014br.gov.bcb.pix0136brooklyn-${orderId}-pay520400005303986540${total.toFixed(2)}5802BR5920BROOKLYN STREETWEAR6009SAO PAULO`;
  } else {
    DOM.pixQrContainer.classList.add("hidden");
  }

  DOM.orderSuccessModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  lucide.createIcons();
}

DOM.closeSuccessBtn.addEventListener("click", () => {
  DOM.orderSuccessModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
});

DOM.copyPixBtn.addEventListener("click", () => {
  DOM.pixCodeCopy.select();
  navigator.clipboard.writeText(DOM.pixCodeCopy.value);
  showToast("Chave Pix copiada!");
});

// --- SISTEMA DE AUTENTICAÇÃO (CLIENTE vs DONO/ADMIN) ---
function updateUserHeader() {
  if (state.currentUser) {
    DOM.userNameLabel.textContent = state.currentUser.name.split(" ")[0];
    DOM.userMenuBtn.classList.add("border-yellow-400", "text-yellow-400");
    
    if (state.currentUser.role === "admin") {
      DOM.adminQuickBtn.classList.remove("hidden");
      DOM.adminQuickBtn.classList.add("flex");
    } else {
      DOM.adminQuickBtn.classList.add("hidden");
      DOM.adminQuickBtn.classList.remove("flex");
    }
  } else {
    DOM.userNameLabel.textContent = "Entrar";
    DOM.userMenuBtn.classList.remove("border-yellow-400", "text-yellow-400");
    DOM.adminQuickBtn.classList.add("hidden");
    DOM.adminQuickBtn.classList.remove("flex");
  }
}

DOM.userMenuBtn.addEventListener("click", () => {
  if (state.currentUser) {
    openProfileModal();
  } else {
    openAuthModal();
  }
});

function openAuthModal() {
  DOM.authModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  lucide.createIcons();
}

function closeAuthModal() {
  DOM.authModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

DOM.closeAuthBtn.addEventListener("click", closeAuthModal);

// Alternar abas do Login
DOM.tabClientAuth.addEventListener("click", () => {
  DOM.tabClientAuth.classList.add("bg-zinc-800", "text-white");
  DOM.tabClientAuth.classList.remove("text-zinc-400");
  DOM.tabAdminAuth.classList.remove("bg-zinc-800", "text-white");
  DOM.tabAdminAuth.classList.add("text-zinc-400");
  DOM.clientLoginForm.classList.remove("hidden");
  DOM.adminLoginForm.classList.add("hidden");
});

DOM.tabAdminAuth.addEventListener("click", () => {
  DOM.tabAdminAuth.classList.add("bg-zinc-800", "text-white");
  DOM.tabAdminAuth.classList.remove("text-zinc-400");
  DOM.tabClientAuth.classList.remove("bg-zinc-800", "text-white");
  DOM.tabClientAuth.classList.add("text-zinc-400");
  DOM.adminLoginForm.classList.remove("hidden");
  DOM.clientLoginForm.classList.add("hidden");
});

// Login Cliente
DOM.clientLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  state.currentUser = {
    name: DOM.clientNameInput.value.trim(),
    email: DOM.clientEmailInput.value.trim(),
    role: "client"
  };
  state.saveUser();
  updateUserHeader();
  closeAuthModal();
  showToast(`Bem-vindo, ${state.currentUser.name}!`);
});

// Login Administrador
DOM.adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = DOM.adminEmailInput.value.trim();
  const pass = DOM.adminPasswordInput.value.trim();

  if (email === "admin@brooklyn.com" && pass === "admin123") {
    state.currentUser = {
      name: "Administrador Chefe",
      email: email,
      role: "admin"
    };
    state.saveUser();
    updateUserHeader();
    closeAuthModal();
    openAdminPanel();
    showToast("Acesso Administrador concedido!");
  } else {
    showToast("E-mail ou senha de administrador incorretos.");
  }
});

// Perfil Modal
function openProfileModal() {
  if (!state.currentUser) return;
  DOM.profileAvatarLetter.textContent = state.currentUser.name.charAt(0).toUpperCase();
  DOM.profileName.textContent = state.currentUser.name;
  DOM.profileEmail.textContent = state.currentUser.email;
  
  if (state.currentUser.role === "admin") {
    DOM.profileRoleBadge.textContent = "Dono / Administrador";
    DOM.profileRoleBadge.className = "inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800";
    DOM.profileAdminBtn.classList.remove("hidden");
  } else {
    DOM.profileRoleBadge.textContent = "Cliente";
    DOM.profileRoleBadge.className = "inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-yellow-400";
    DOM.profileAdminBtn.classList.add("hidden");
  }

  DOM.userProfileModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

DOM.closeProfileBtn.addEventListener("click", () => {
  DOM.userProfileModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
});

DOM.profileLogoutBtn.addEventListener("click", () => {
  state.currentUser = null;
  state.saveUser();
  updateUserHeader();
  DOM.userProfileModal.classList.add("hidden");
  DOM.adminPanelModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
  showToast("Você saiu da conta.");
});

DOM.profileAdminBtn.addEventListener("click", () => {
  DOM.userProfileModal.classList.add("hidden");
  openAdminPanel();
});

// --- PAINEL DO ADMINISTRADOR / DONO ---
DOM.adminQuickBtn.addEventListener("click", openAdminPanel);

function openAdminPanel() {
  if (!state.currentUser || state.currentUser.role !== "admin") {
    showToast("Acesso restrito ao administrador!");
    openAuthModal();
    DOM.tabAdminAuth.click();
    return;
  }

  renderAdminProductsTable();
  renderAdminCoupons();
  renderAdminShipping();

  DOM.adminPanelModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  lucide.createIcons();
}

DOM.closeAdminPanelBtn.addEventListener("click", () => {
  DOM.adminPanelModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
});

// Alternar abas do painel admin
function setAdminTab(activeTab) {
  const tabs = [
    { btn: DOM.adminTabProducts, section: DOM.adminSectionProducts },
    { btn: DOM.adminTabCoupons, section: DOM.adminSectionCoupons },
    { btn: DOM.adminTabShipping, section: DOM.adminSectionShipping }
  ];

  tabs.forEach(t => {
    if (t.btn === activeTab) {
      t.btn.className = "admin-tab active py-3 border-b-2 border-yellow-400 text-yellow-400";
      t.section.classList.remove("hidden");
    } else {
      t.btn.className = "admin-tab py-3 border-b-2 border-transparent text-zinc-400 hover:text-white";
      t.section.classList.add("hidden");
    }
  });
  lucide.createIcons();
}

DOM.adminTabProducts.addEventListener("click", () => setAdminTab(DOM.adminTabProducts));
DOM.adminTabCoupons.addEventListener("click", () => setAdminTab(DOM.adminTabCoupons));
DOM.adminTabShipping.addEventListener("click", () => setAdminTab(DOM.adminTabShipping));

// Toggle formulário novo produto
DOM.adminToggleAddProductBtn.addEventListener("click", () => {
  DOM.adminNewProductForm.classList.toggle("hidden");
});
DOM.adminCancelNewProd.addEventListener("click", () => {
  DOM.adminNewProductForm.classList.add("hidden");
});

// Submissão do novo produto pelo admin
DOM.adminNewProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("newProdName").value.trim();
  const category = document.getElementById("newProdCategory").value;
  const price = parseFloat(document.getElementById("newProdPrice").value);
  const oldPriceVal = document.getElementById("newProdOldPrice").value;
  const oldPrice = oldPriceVal ? parseFloat(oldPriceVal) : null;
  const stock = parseInt(document.getElementById("newProdStock").value, 10);
  const sizesStr = document.getElementById("newProdSizes").value;
  const image = document.getElementById("newProdImage").value.trim();
  const desc = document.getElementById("newProdDesc").value.trim();

  const sizes = sizesStr.split(",").map(s => s.trim()).filter(Boolean);

  const newProd = {
    id: `prod-${Date.now()}`,
    name,
    category,
    price,
    oldPrice,
    sizes: sizes.length ? sizes : ["Único"],
    stock,
    badge: "Novo",
    description: desc,
    image: image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
  };

  state.products.unshift(newProd);
  state.saveProducts();
  renderProducts();
  renderAdminProductsTable();

  DOM.adminNewProductForm.reset();
  DOM.adminNewProductForm.classList.add("hidden");
  showToast("Produto adicionado ao estoque!");
});

// Renderizar tabela de produtos no painel admin
function renderAdminProductsTable() {
  DOM.adminProductsTableBody.innerHTML = state.products.map(prod => `
    <tr class="hover:bg-zinc-900/50 transition-colors">
      <td class="p-3">
        <img src="${prod.image}" alt="${prod.name}" class="w-10 h-10 object-cover rounded bg-zinc-900">
      </td>
      <td class="p-3">
        <span class="font-bold text-white block">${prod.name}</span>
        <span class="text-[10px] text-zinc-500">${prod.sizes.join(", ")}</span>
      </td>
      <td class="p-3 font-semibold text-zinc-300">${prod.category}</td>
      <td class="p-3 font-bold text-yellow-400">${formatCurrency(prod.price)}</td>
      <td class="p-3">
        <div class="flex items-center gap-1.5">
          <input type="number" value="${prod.stock}" min="0" 
            onchange="updateProductStock('${prod.id}', this.value)"
            class="w-16 bg-zinc-900 border border-zinc-700 text-white text-xs px-2 py-1 rounded font-mono font-bold focus:border-yellow-400">
          <span class="text-[10px] text-zinc-500">unid.</span>
        </div>
      </td>
      <td class="p-3 text-right">
        <button onclick="deleteProduct('${prod.id}')" class="p-1.5 text-zinc-500 hover:text-red-400 rounded transition-colors" title="Excluir Produto">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');

  lucide.createIcons();
}

window.updateProductStock = function(prodId, newStock) {
  const prod = state.products.find(p => p.id === prodId);
  if (prod) {
    prod.stock = Math.max(0, parseInt(newStock, 10) || 0);
    state.saveProducts();
    renderProducts();
    showToast(`Estoque de "${prod.name}" atualizado para ${prod.stock}!`);
  }
};

window.deleteProduct = function(prodId) {
  if (confirm("Tem certeza que deseja remover este produto do estoque?")) {
    state.products = state.products.filter(p => p.id !== prodId);
    state.saveProducts();
    renderProducts();
    renderAdminProductsTable();
    showToast("Produto removido.");
  }
};

// Cupons Admin
function renderAdminCoupons() {
  DOM.adminCouponsList.innerHTML = state.coupons.map(coupon => `
    <div class="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
      <div>
        <span class="font-mono font-bold text-sm text-yellow-400">${coupon.code}</span>
        <span class="block text-xs text-zinc-400 font-semibold">${coupon.discountPercent}% de desconto</span>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="toggleCoupon('${coupon.code}')" 
          class="px-2.5 py-1 rounded text-[10px] font-bold uppercase ${coupon.active ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'}">
          ${coupon.active ? 'Ativo' : 'Inativo'}
        </button>
        <button onclick="deleteCoupon('${coupon.code}')" class="text-zinc-600 hover:text-red-400 p-1">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

DOM.adminNewCouponForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.getElementById("newCouponCode").value.trim().toUpperCase();
  const discount = parseInt(document.getElementById("newCouponDiscount").value, 10);

  if (state.coupons.some(c => c.code === code)) {
    showToast("Este cupom já existe!");
    return;
  }

  state.coupons.push({ code, discountPercent: discount, active: true });
  state.saveCoupons();
  renderAdminCoupons();
  DOM.adminNewCouponForm.reset();
  showToast(`Cupom ${code} (${discount}%) criado com sucesso!`);
});

window.toggleCoupon = function(code) {
  const c = state.coupons.find(cp => cp.code === code);
  if (c) {
    c.active = !c.active;
    state.saveCoupons();
    renderAdminCoupons();
    showToast(`Cupom ${code} ${c.active ? 'ativado' : 'desativado'}.`);
  }
};

window.deleteCoupon = function(code) {
  state.coupons = state.coupons.filter(cp => cp.code !== code);
  state.saveCoupons();
  renderAdminCoupons();
  showToast(`Cupom ${code} excluído.`);
};

// Frete Admin
function renderAdminShipping() {
  DOM.adminShippingCost.value = state.settings.shippingCost;
  DOM.adminFreeShippingMin.value = state.settings.freeShippingThreshold;
  DOM.topBarFreteGratis.textContent = formatCurrency(state.settings.freeShippingThreshold);
}

DOM.adminShippingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  state.settings.shippingCost = parseFloat(DOM.adminShippingCost.value) || 0;
  state.settings.freeShippingThreshold = parseFloat(DOM.adminFreeShippingMin.value) || 0;
  state.saveSettings();

  DOM.topBarFreteGratis.textContent = formatCurrency(state.settings.freeShippingThreshold);
  updateCartUI();
  showToast("Valores de frete atualizados com sucesso!");
});

// --- EVENTOS GERAIS & FOOTER DEMO SHORTCUTS ---
// Filtros de Categoria
DOM.categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    DOM.categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.selectedCategory = btn.dataset.category;
    renderProducts();
  });
});

// Busca em Tempo Real
DOM.searchInput.addEventListener("input", (e) => {
  state.searchQuery = e.target.value.trim();
  renderProducts();
});

// Footer Shortcuts
DOM.footerAdminSwitch.addEventListener("click", () => {
  state.currentUser = {
    name: "Administrador Chefe",
    email: "admin@brooklyn.com",
    role: "admin"
  };
  state.saveUser();
  updateUserHeader();
  openAdminPanel();
  showToast("Logado como Administrador!");
});

DOM.footerResetStore.addEventListener("click", () => {
  if (confirm("Deseja restaurar os produtos e configurações iniciais da loja?")) {
    state.resetToDefaults();
    renderProducts();
    updateCartUI();
    renderAdminShipping();
    showToast("Loja restaurada para os padrões!");
  }
});

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
function initApp() {
  renderProducts();
  updateCartUI();
  updateUserHeader();
  renderAdminShipping();
  lucide.createIcons();
}

// Inicializar quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", initApp);
