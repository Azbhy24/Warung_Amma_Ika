const phoneNumber = "6285298585059";

const products = [
  {
    name: "Beras 5kg",
    price: "Rp 68.000",
    category: "Sembako",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Beras+5kg",
  },
  {
    name: "Beras 1kg",
    price: "Rp 14.000",
    category: "Sembako",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Beras+1kg",
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
    category: "Dapur",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Telur",
  },
  {
    name: "Kopi Sachet",
    price: "Rp 2.500",
    category: "Minuman",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Kopi+Sachet",
  },
  {
    name: "Teh",
    price: "Rp 8.000",
    category: "Minuman",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Teh",
  },
  {
    name: "Sabun",
    price: "Rp 5.000",
    category: "Rumah Tangga",
    image: "https://placehold.co/600x450/eaf7ee/1f8f4d?text=Sabun",
  },
];

const productList = document.getElementById("product-list");

productList.innerHTML = products
  .map(
    (product) => `
      <article class="product-card">
        <img class="product-image" src="${product.image}" alt="${product.name}" />
        <div class="product-badge">${product.category}</div>
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <button class="order-btn" data-product="${product.name}">Pesan via WhatsApp</button>
      </article>
    `
  )
  .join("");

document.querySelectorAll(".order-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.product;
    const message = `Halo, saya ingin pesan ${productName}, jumlah: 1`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });
});
