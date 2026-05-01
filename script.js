const phoneNumber = "6285298585059";
const cart = [];
let activeCategory = "Semua";
let searchTerm = "";
const defaultPreviewImage = "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Preview";

const products = [
  {
    name: "Beras 5kg",
    price: "Rp 68.000",
    category: "Sembako",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Beras+5kg",
    tag: "Best Seller",
  },
  {
    name: "Beras 1kg",
    price: "Rp 14.000",
    category: "Sembako",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Beras+1kg",
    tag: "Promo",
  },
  {
    name: "Gula",
    price: "Rp 14.000/kg",
    category: "Sembako",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Gula",
  },
  {
    name: "Minyak Goreng",
    price: "Rp 18.000/liter",
    category: "Sembako",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Minyak+Goreng",
  },
  {
    name: "Indomie Goreng",
    price: "Rp 3.500",
    category: "Makanan",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Indomie+Goreng",
    tag: "Best Seller",
  },
  {
    name: "Indomie Soto",
    price: "Rp 3.500",
    category: "Makanan",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Indomie+Soto",
  },
  {
    name: "Telur",
    price: "Rp 28.000/rak",
    category: "Sembako",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Telur",
  },
  {
    name: "Kopi Sachet",
    price: "Rp 2.500",
    category: "Minuman",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Kopi+Sachet",
    tag: "Promo",
  },
  {
    name: "Teh",
    price: "Rp 8.000",
    category: "Minuman",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Teh",
  },
  {
    name: "Keripik Singkong",
    price: "Rp 10.000",
    category: "Snack",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Keripik+Singkong",
  },
];

const productList = document.getElementById("product-list");
const productForm = document.getElementById("product-form");
const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productCategoryInput = document.getElementById("product-category");
const productImageFileInput = document.getElementById("product-image-file");
const productImageUrlInput = document.getElementById("product-image-url");
const imagePreview = document.getElementById("image-preview");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category-btn");
const cartList = document.getElementById("cart-list");
const cartSummary = document.getElementById("cart-summary");
const cartTotal = document.getElementById("cart-total");
const cartPriceTotal = document.getElementById("cart-price-total");
const clearCartButton = document.getElementById("clear-cart");
const sendOrderButton = document.getElementById("send-order");
const stickyItemCount = document.getElementById("sticky-item-count");
const stickyTotalPrice = document.getElementById("sticky-total-price");
const stickySendOrderButton = document.getElementById("sticky-send-order");
const floatingCartButton = document.getElementById("floating-cart");
const floatingCartBadge = document.getElementById("floating-cart-badge");
const cartPanel = document.getElementById("cart-panel");
const toast = document.getElementById("toast");

let toastTimer;
let uploadedImageData = "";

function getFilteredProducts() {
  return products.filter((product) => {
    const matchCategory =
      activeCategory === "Semua" || product.category === activeCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    productList.innerHTML = `
      <div class="empty-products">
        Produk tidak ditemukan. Coba kata kunci lain atau pilih kategori berbeda.
      </div>
    `;
    return;
  }

  productList.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          ${
            product.tag
              ? `<span class="product-flag ${
                  product.tag === "Promo"
                    ? "promo"
                    : product.tag === "Baru"
                      ? "new"
                      : "best"
                }">${product.tag}</span>`
              : ""
          }
          <img class="product-image" src="${product.image}" alt="${product.name}" />
          <div class="product-badge">${product.category}</div>
          <h3>${product.name}</h3>
          <p class="price">${product.price}</p>
          <div class="product-actions">
            <button class="add-btn" data-product="${product.name}">Tambah</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.product, button);
    });
  });
}

function getTotalItems() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function parsePrice(priceText) {
  const normalized = priceText.replace(/[^0-9]/g, "");
  return Number(normalized || 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function resetProductForm() {
  productForm.reset();
  uploadedImageData = "";
  imagePreview.src = defaultPreviewImage;
}

function getTotalPrice() {
  return cart.reduce((total, item) => total + item.unitPrice * item.qty, 0);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function updatePreviewFromUrl() {
  const imageUrl = productImageUrlInput.value.trim();
  if (imageUrl) {
    imagePreview.src = imageUrl;
  } else if (!uploadedImageData) {
    imagePreview.src = defaultPreviewImage;
  }
}

function renderCart() {
  if (!cart.length) {
    cartList.innerHTML = `<p class="empty-cart">Keranjang masih kosong.</p>`;
    cartSummary.textContent = "Belum ada produk dipilih.";
    cartTotal.textContent = "0";
    cartPriceTotal.textContent = "Rp 0";
    floatingCartBadge.textContent = "0";
    stickyItemCount.textContent = "0 item";
    stickyTotalPrice.textContent = "Rp 0";
    stickySendOrderButton.disabled = true;
    return;
  }

  cartList.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <div class="cart-item-meta">${item.price}</div>
          </div>
          <div class="cart-item-right">
            <span class="cart-qty">${item.qty}</span>
            <button class="remove-btn" data-remove="${item.name}" type="button">Hapus</button>
          </div>
        </div>
      `
    )
    .join("");

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  cartSummary.textContent = `${cart.length} jenis produk dalam keranjang.`;
  cartTotal.textContent = String(totalItems);
  cartPriceTotal.textContent = formatCurrency(totalPrice);
  floatingCartBadge.textContent = String(totalItems);
  stickyItemCount.textContent = `${totalItems} item`;
  stickyTotalPrice.textContent = formatCurrency(totalPrice);
  stickySendOrderButton.disabled = false;

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.remove);
    });
  });
}

function addToCart(productName, sourceButton) {
  const product = products.find((item) => item.name === productName);
  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.qty += 1;
  } else if (product) {
    cart.push({
      name: product.name,
      price: product.price,
      unitPrice: parsePrice(product.price),
      qty: 1,
    });
  }

  if (sourceButton) {
    sourceButton.classList.remove("bump");
    void sourceButton.offsetWidth;
    sourceButton.classList.add("bump");
  }

  renderCart();
  showToast("Produk ditambahkan");
}

function removeFromCart(productName) {
  const itemIndex = cart.findIndex((item) => item.name === productName);

  if (itemIndex === -1) {
    return;
  }

  if (cart[itemIndex].qty > 1) {
    cart[itemIndex].qty -= 1;
  } else {
    cart.splice(itemIndex, 1);
  }

  renderCart();
}

function clearCart() {
  cart.length = 0;
  renderCart();
}

function sendToWhatsApp() {
  if (!cart.length) {
    window.alert("Keranjang masih kosong.");
    return;
  }

  const lines = cart.map((item) => `- ${item.name} (${item.qty})`);
  const totalItems = getTotalItems();
  const message = `Halo, saya ingin pesan:\n${lines.join("\n")}\nTotal item: ${totalItems}`;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

productImageFileInput.addEventListener("change", () => {
  const [file] = productImageFileInput.files;

  if (!file) {
    uploadedImageData = "";
    updatePreviewFromUrl();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    uploadedImageData = reader.result;
    imagePreview.src = uploadedImageData;
  };
  reader.readAsDataURL(file);
});

productImageUrlInput.addEventListener("input", () => {
  if (productImageUrlInput.value.trim()) {
    uploadedImageData = "";
    productImageFileInput.value = "";
  }
  updatePreviewFromUrl();
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = productNameInput.value.trim();
  const price = productPriceInput.value.trim();
  const category = productCategoryInput.value;
  const image = uploadedImageData || productImageUrlInput.value.trim() || defaultPreviewImage;

  products.unshift({
    name,
    price,
    category,
    image,
    tag: "Baru",
  });

  renderProducts();
  resetProductForm();
  showToast("Produk baru ditambahkan");
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProducts();
  });
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

clearCartButton.addEventListener("click", clearCart);
sendOrderButton.addEventListener("click", sendToWhatsApp);
stickySendOrderButton.addEventListener("click", sendToWhatsApp);
floatingCartButton.addEventListener("click", () => {
  cartPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});
renderProducts();
renderCart();
