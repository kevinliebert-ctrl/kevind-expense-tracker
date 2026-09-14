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
  balanceEl.textContent = `Saldo: Rp${(income - expense).toLocaleString("id-ID")}`;
  incomeEl.textContent = `Total Pemasukan: Rp${income.toLocaleString("id-ID")}`;
  expenseEl.textContent = `Total Pengeluaran: Rp${expense.toLocaleString("id-ID")}`;
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
    amountEl.textContent = `Nominal: Rp${trx.amount.toLocaleString("id-ID")}`;

    const dateEl = document.createElement("p");
    dateEl.setAttribute("data-testid", "transactionItemDate");
    dateEl.textContent = `Tanggal: ${trx.date}`;

    const typeEl = document.createElement("p");
    typeEl.setAttribute("data-testid", "transactionItemType");
    typeEl.textContent = `Tipe: ${trx.type === "income" ? "Pemasukan" : "Pengeluaran"}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Ubah Tipe";
    editBtn.addEventListener("click", () => {
      trx.type = trx.type === "income" ? "expense" : "income";
      dispatchUpdate();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Hapus";
    deleteBtn.addEventListener("click", () => {
