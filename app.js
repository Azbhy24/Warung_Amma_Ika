const routines = {
  mingguan: [
    {
      name: "Belanja Minggu Ini",
      items: ["Beras 5 kg", "Minyak 2 L", "Telur 1 rak", "Gula 1 kg"],
      price: 186000,
    },
    {
      name: "Ulang Pesanan Ibu Rina",
      items: ["Mie instan 10", "Teh celup 1 kotak", "Susu kental 2", "Sabun cuci"],
      price: 92000,
    },
  ],
  bulanan: [
    {
      name: "Stok Rumah Bulanan",
      items: ["Gas elpiji", "Tisu 6", "Deterjen 2", "Minyak 4 L"],
      price: 248000,
    },
    {
      name: "Belanja Awal Bulan",
      items: ["Beras 10 kg", "Kopi 2", "Gula 2 kg", "Saus sambal"],
      price: 276000,
    },
  ],
  "anak-kos": [
    {
      name: "Anak Kos Hemat",
      items: ["Mie instan 15", "Telur 10", "Kopi sachet 1", "Sabun mandi"],
      price: 78000,
    },
    {
      name: "Masak Praktis",
      items: ["Beras 2 kg", "Sarden 2", "Kecap", "Minyak 1 L"],
      price: 88000,
    },
  ],
};

const bundles = [
  {
    name: "Paket Dapur Mingguan",
    desc: "Untuk masak harian keluarga kecil selama seminggu.",
    items: 8,
    price: 145000,
    tone: "terracotta",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Paket Bulanan",
    desc: "Isi kebutuhan pokok rumah yang biasa dibeli tiap awal bulan.",
    items: 12,
    price: 318000,
    tone: "turmeric",
    image:
      "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Paket Anak Kos",
    desc: "Praktis, irit, dan cukup untuk stok makan sederhana.",
    items: 7,
    price: 69000,
    tone: "leaf",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
  },
];

const slots = ["Hari ini, 17.00", "Hari ini, 18.30", "Besok, 08.00", "Besok, 10.00"];

const state = {
  currentScreen: "home",
  selectedRoutine: "mingguan",
  selectedItems: [],
  selectedBundle: null,
  selectedSlot: slots[0],
  checkoutType: "Belanja Seperti Biasa",
};

const screens = [...document.querySelectorAll(".screen")];
const routineList = document.getElementById("routine-list");
const bundleGrid = document.getElementById("bundle-grid");
const slotGrid = document.getElementById("slot-grid");

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function navigate(target) {
  state.currentScreen = target;
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === target);
  });
}

function updateRepeatSummary() {
  const summary = document.getElementById("repeat-summary");
  const totalItems = state.selectedItems.length;
  summary.textContent = totalItems ? `${totalItems} pilihan siap dicek` : "0 item dipilih";
}

function renderRoutines() {
  const activeList = routines[state.selectedRoutine];
  routineList.innerHTML = activeList
    .map(
      (routine, index) => `
        <article class="routine-card">
          <div class="routine-top">
            <div>
              <strong>${routine.name}</strong>
              <p>${formatRupiah(routine.price)}</p>
            </div>
            <button class="mini-btn ${state.selectedItems.includes(routine.name) ? "active" : ""}" data-routine-name="${routine.name}">
              ${state.selectedItems.includes(routine.name) ? "Dipilih" : "Pilih"}
            </button>
          </div>
          <ul>
            ${routine.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <button class="primary-btn full quick-add" data-routine-index="${index}">Ulang Pesanan Ini</button>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-routine-name]").forEach((button) => {
    button.addEventListener("click", () => toggleRoutine(button.dataset.routineName));
  });

  document.querySelectorAll(".quick-add").forEach((button) => {
    button.addEventListener("click", () => {
      const routine = activeList[Number(button.dataset.routineIndex)];
      state.selectedItems = [routine.name];
      state.selectedBundle = null;
      state.checkoutType = "Belanja Seperti Biasa";
      updateRepeatSummary();
      openCheckout(routine.price, routine.items.join(", "));
    });
  });
}

function toggleRoutine(name) {
  const exists = state.selectedItems.includes(name);
  state.selectedItems = exists
    ? state.selectedItems.filter((item) => item !== name)
    : [...state.selectedItems, name];
  updateRepeatSummary();
  renderRoutines();
}

function renderBundles() {
  bundleGrid.innerHTML = bundles
    .map(
      (bundle, index) => `
        <article class="bundle-card ${bundle.tone}">
          <img src="${bundle.image}" alt="${bundle.name}" />
          <strong>${bundle.name}</strong>
          <small>${bundle.desc}</small>
          <p>${bundle.items} produk pilihan keluarga warung.</p>
          <div class="bundle-meta">
            <span>${formatRupiah(bundle.price)}</span>
            <button class="primary-btn" data-bundle-index="${index}">Pilih Paket</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-bundle-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const bundle = bundles[Number(button.dataset.bundleIndex)];
      state.selectedBundle = bundle;
      state.selectedItems = [bundle.name];
      state.checkoutType = "Paket Hemat";
      openCheckout(bundle.price, `${bundle.items} produk dalam ${bundle.name}`);
    });
  });
}

function renderSlots() {
  slotGrid.innerHTML = slots
    .map(
      (slot) => `
        <button class="slot-btn ${state.selectedSlot === slot ? "active" : ""}" data-slot="${slot}">
          ${slot}
        </button>
      `
    )
    .join("");

  document.querySelectorAll("[data-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedSlot = button.dataset.slot;
      renderSlots();
    });
  });
}

function openCheckout(total, itemsLabel) {
  document.getElementById("checkout-type").textContent = state.checkoutType;
  document.getElementById("checkout-items").textContent = itemsLabel;
  document.getElementById("checkout-slot").textContent = state.selectedSlot;
  document.getElementById("checkout-total").textContent = formatRupiah(total);
  navigate("checkout");
}

document.querySelectorAll("[data-nav-target]").forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.navTarget));
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    state.selectedRoutine = button.dataset.routine;
    renderRoutines();
  });
});

document.getElementById("repeat-checkout").addEventListener("click", () => {
  if (!state.selectedItems.length) {
    state.selectedItems = [routines[state.selectedRoutine][0].name];
  }

  const selectedRoutines = routines[state.selectedRoutine].filter((routine) =>
    state.selectedItems.includes(routine.name)
  );
  const total = selectedRoutines.reduce((sum, routine) => sum + routine.price, 0);
  const label = selectedRoutines.map((routine) => routine.name).join(", ");
  state.checkoutType = "Belanja Seperti Biasa";
  openCheckout(total, label);
});

document.getElementById("pickup-checkout").addEventListener("click", () => {
  state.checkoutType = "Pesan & Ambil";
  const note = document.getElementById("pickup-note").value.trim();
  openCheckout(54000, note || "Pesanan ambil di warung");
});

document.getElementById("place-order").addEventListener("click", () => {
  const pickupName = document.getElementById("pickup-name").value.trim() || "Pelanggan";
  document.getElementById(
    "success-copy"
  ).textContent = `${pickupName}, pesanan Anda siap untuk ${state.selectedSlot}. Pembayaran dapat dilakukan saat pengambilan.`;
  navigate("success");
});

renderRoutines();
renderBundles();
renderSlots();
updateRepeatSummary();
