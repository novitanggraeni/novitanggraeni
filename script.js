
import {
  db,
  collection,
  addDoc,
  serverTimestamp
} from "./firebase.js";

// ELEMENT HTML
const form = document.getElementById("reviewForm");
const status = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

// KIRIM ULASAN
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const produk = document.getElementById("produk").value;
  const komentar = document.getElementById("komentar").value.trim();

  const rating = document.querySelector(
    'input[name="rating"]:checked'
  );

  // VALIDASI FORM
  if (!nama || !produk || !komentar || !rating) {
    status.textContent = "Mohon lengkapi semua formulir terlebih dahulu.";
    status.style.color = "red";
    return;
  }

  // TOMBOL LOADING
  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim ulasan...";

  try {
    // SIMPAN KE FIRESTORE
    await addDoc(collection(db, "ulasan"), {
      nama: nama,
      produk: produk,
      rating: Number(rating.value),
      komentar: komentar,
      tanggal: serverTimestamp()
    });

    // PESAN BERHASIL
    status.textContent =
      "Terima kasih! Ulasan kamu berhasil dikirim. ♡";
    status.style.color = "green";

    // KOSONGKAN FORM
    form.reset();

  } catch (error) {
    console.error("FIREBASE ERROR:", error);

    status.textContent =
      "Ulasan gagal dikirim. Silakan coba kembali.";
    status.style.color = "red";

  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Kirim Ulasan <span>→</span>';
  }
});
