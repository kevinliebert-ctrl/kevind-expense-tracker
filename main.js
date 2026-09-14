// Array transaksi
let transactions = [];

// Ambil elemen form dan daftar
const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");

// Ringkasan
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("incomeTotal");
const expenseEl = document.getElementById("expenseTotal");

// Pencarian
const searchInput = document.getElementById("search");

// Simpan & load localStorage
function saveToStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
function loadFromStorage() {
  const data = localStorage.getItem("transactions");
  if (data) {
    transactions = JSON.parse(data);
    dispatchUpdate();
  }
}

// Update ringkasan
function updateBalance() {
  let income = 0, expense = 0;
  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });
  balanceEl.textContent = `Saldo: Rp${income - expense}`;
  incomeEl.textContent = `Total Pemasukan: Rp${income}`;
  expenseEl.textContent = `Total Pengeluaran: Rp${expense}`;
}

// Render transaksi
function renderTransactions(list = transactions) {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  list.forEach((trx) => {
    const card = document.createElement("div");
    card.setAttribute("data-testid", "transactionItem");

    const titleEl = document.createElement("h3");
    titleEl.setAttribute("data-testid", "transactionItemTitle");
    titleEl.textContent = trx.title;

    const amountEl = document.createElement("p");
    amountEl.setAttribute("data-testid", "transactionItemAmount");
    amountEl.textContent = `Nominal: Rp${trx.amount}`;

    const dateEl = document.createElement("p");
    dateEl.setAttribute("data-testid", "transactionItemDate");
    dateEl.textContent = `Tanggal: ${trx.date}`;

    const typeEl = document.createElement("p");
    typeEl.setAttribute("data-testid", "transactionItemType");
    typeEl.textContent = `Tipe: ${trx.type === "income" ? "Pemasukan" : "Pengeluaran"}`;

    const editBtn = document.createElement("button");
    editBtn.setAttribute("data-testid", "transactionItemEditTypeButton");
    editBtn.textContent = "Ubah Tipe";
    editBtn.addEventListener("click", () => {
      trx.type = trx.type === "income" ? "expense" : "income";
      dispatchUpdate();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("data-testid", "transactionItemDeleteButton");
    deleteBtn.textContent = "Hapus";
    deleteBtn.addEventListener("click", () => {
      transactions = transactions.filter((t) => t.id !== trx.id);
      dispatchUpdate();
    });

    const editFormBtn = document.createElement("button");
    editFormBtn.textContent = "Edit";
    editFormBtn.addEventListener("click", () => {
      titleInput.value = trx.title;
      amountInput.value = trx.amount;
      dateInput.value = trx.date;
      typeInput.value = trx.type;
      form.dataset.editId = trx.id;
    });

    const btnContainer = document.createElement("div");
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    btnContainer.appendChild(editFormBtn);

    card.appendChild(titleEl);
    card.appendChild(amountEl);
    card.appendChild(dateEl);
    card.appendChild(typeEl);
    card.appendChild(btnContainer);

    if (trx.type === "income") incomeList.appendChild(card);
    else expenseList.appendChild(card);
  });

  updateBalance();
}

// Custom Event untuk update
function dispatchUpdate() {
  document.dispatchEvent(new Event("transactionsUpdated"));
}
document.addEventListener("transactionsUpdated", () => {
  renderTransactions();
  saveToStorage();
});

// Submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!titleInput.value || Number(amountInput.value) < 1) {
    alert("Judul tidak boleh kosong dan nominal minimal Rp1");
    return;
  }

  if (form.dataset.editId) {
    const id = Number(form.dataset.editId);
    const index = transactions.findIndex((t) => t.id === id);
    transactions[index] = {
      id,
      title: titleInput.value,
      amount: Number(amountInput.value),
      date: dateInput.value,
      type: typeInput.value,
    };
    form.dataset.editId = "";
  } else {
    transactions.push({
      id: +new Date(),
      title: titleInput.value,
      amount: Number(amountInput.value),
      date: dateInput.value,
      type: typeInput.value,
    });
  }

  form.reset();
  dispatchUpdate();
});

// Pencarian
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  if (keyword === "") {
    renderTransactions();
  } else {
    const filtered = transactions.filter((t) =>
      t.title.toLowerCase().includes(keyword)
    );
    renderTransactions(filtered);
  }
});

// Load data awal
window.addEventListener("DOMContentLoaded", loadFromStorage);
