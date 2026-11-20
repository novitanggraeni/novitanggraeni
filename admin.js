
import {
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
  collection,
  getDocs
} from "./firebase.js";

const ADMIN_EMAIL = "nanggraeni582@gmail.com";

const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");
const ulasanList = document.getElementById("ulasanList");
const logoutButton = document.getElementById("logoutButton");
const filterProduk = document.getElementById("filterProduk");

let semuaUlasan = [];

// LOGIN ADMIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    loginStatus.textContent = "Email bukan akun admin.";
    return;
  }

  try {
    loginStatus.textContent = "Sedang login...";

    await signInWithEmailAndPassword(auth, email, password);

    loginSection.style.display = "none";
    dashboard.style.display = "block";

    await tampilkanUlasan();

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    loginStatus.textContent = "Login gagal: " + error.code;
  }
});

// AMBIL DATA DARI FIREBASE
async function tampilkanUlasan() {
  ulasanList.innerHTML = "<p>Memuat ulasan pelanggan...</p>";

  try {
    const snapshot = await getDocs(collection(db, "ulasan"));

    semuaUlasan = snapshot.docs.map((dokumen) => ({
      id: dokumen.id,
      ...dokumen.data()
    }));

    semuaUlasan.sort((a, b) => {
      const tanggalA = a.tanggal?.toDate
        ? a.tanggal.toDate().getTime()
        : 0;

      const tanggalB = b.tanggal?.toDate
        ? b.tanggal.toDate().getTime()
        : 0;

      return tanggalB - tanggalA;
    });

    perbaruiStatistik();
    renderTabel();

  } catch (error) {
    console.error("FIRESTORE ERROR:", error);

    ulasanList.textContent =
      "Gagal mengambil data: " + error.code;
  }
}

// STATISTIK DASHBOARD
function perbaruiStatistik() {
  const total = semuaUlasan.length;

  const rata = total
    ? semuaUlasan.reduce(
        (jumlah, item) => jumlah + (Number(item.rating) || 0), 0
      ) / total
    : 0;

  const produk = new Set(
    semuaUlasan.map(item => item.produk).filter(Boolean)
  );

  document.getElementById("totalUlasan").textContent = total;
  document.getElementById("rataRating").textContent = rata.toFixed(1);
  document.getElementById("jumlahProduk").textContent = produk.size;
}

// MEMBUAT TABEL SEPERTI EXCEL
function renderTabel() {
  const pilihanProduk = filterProduk.value;

  const dataTampil = pilihanProduk
    ? semuaUlasan.filter(item => item.produk === pilihanProduk)
    : semuaUlasan;

  ulasanList.innerHTML = "";

  if (dataTampil.length === 0) {
    ulasanList.textContent = "Belum ada ulasan pelanggan.";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";

  const table = document.createElement("table");
  table.className = "review-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const judulKolom = [
    "No.",
    "Nama Pelanggan",
    "Produk",
    "Rating",
    "Komentar",
    "Tanggal"
  ];

  judulKolom.forEach((judul) => {
    const th = document.createElement("th");
    th.textContent = judul;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  dataTampil.forEach((data, index) => {
    const tr = document.createElement("tr");

    const tanggal = data.tanggal?.toDate
      ? data.tanggal.toDate().toLocaleString("id-ID")
      : "-";

    const isiKolom = [
      index + 1,
      data.nama || "Anonim",
      data.produk || "-",
      (Number(data.rating) || 0) + "/5",
      data.komentar || "-",
      tanggal
    ];

    isiKolom.forEach((isi) => {
      const td = document.createElement("td");
      td.textContent = isi;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  ulasanList.appendChild(wrapper);
}

// FILTER PRODUK
filterProduk.addEventListener("change", renderTabel);

// LOGOUT
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    location.reload();
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    alert("Gagal logout.");
  }
});
