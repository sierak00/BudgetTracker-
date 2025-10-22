const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const listEl = document.getElementById("list");
const form = document.getElementById("transaction-form");
const textEl = document.getElementById("text");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(a => a < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balanceEl.textContent = `$${total}`;
  incomeEl.textContent = `$${income}`;
  expenseEl.textContent = `$${expense}`;
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount > 0 ? "+" : "-";
  const li = document.createElement("li");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");
  li.innerHTML = `
    <span>${transaction.text}</span>
    <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  listEl.appendChild(li);
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
  listEl.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}
init();

form.addEventListener("submit", e => {
  e.preventDefault();

  const text = textEl.value.trim();
  const amount = +amountEl.value;

  if (text === "" || amount === 0) {
    alert("Please enter valid data!");
    return;
  }

  const transaction = { id: Date.now(), text, amount };
  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  textEl.value = "";
  amountEl.value = "";
});