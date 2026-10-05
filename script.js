// ---------- DATA ----------
const books = [
{ id: 1, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", price: 350, color: "#e67e22" },
{ id: 2, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", category: "Biography", price: 299, color: "#16a085"
},
{ id: 3, title: "Atomic Habits", author: "James Clear", category: "Self-Help", price: 499, color: "#2980b9" },
{ id: 4, title: "Sapiens", author: "Yuval Noah Harari", category: "History", price: 550, color: "#8e44ad" },
{ id: 5, title: "Clean Code", author: "Robert C. Martin", category: "Technology", price: 650, color: "#2c3e50" },
{ id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", price: 400, color: "#c0392b" },
{ id: 7, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Self-Help", price: 320, color: "#27ae60"
},
{ id: 8, title: "JavaScript Basics", author: "Jon Duckett", category: "Technology", price: 599, color: "#f39c12" },
{ id: 9, title: "Long Walk to Freedom", author: "Nelson Mandela", category: "Biography", price: 450, color:
"#7f8c8d" },
{ id: 10, title: "A Brief History of Time", author: "Stephen Hawking", category: "History", price: 380, color:
"#34495e" }
];
// ---------- HELPERS ----------
function getData(key, def) {
const v = localStorage.getItem(key);
return v ? JSON.parse(v) : def;
}
function setData(key, value) {
localStorage.setItem(key, JSON.stringify(value));
}
function setMsg(id, text) {
document.getElementById(id).innerText = text;
}
function getCurrentUser() {
const email = localStorage.getItem("currentUser");
return getData("users", []).find(u => u.email === email);
}
// simple book cover image (SVG) so no image files are needed
function bookImage(b) {
const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150'>" +
"<rect width='200' height='150' fill='" + b.color + "'/>" +
"<text x='100' y='70' font-size='40' text-anchor='middle'>📖</text>" +
"<text x='100' y='110' font-size='14' fill='white' text-anchor='middle'>" + b.category + "</text></svg>";
return "data:image/svg+xml," + encodeURIComponent(svg);
}
// ---------- NAVBAR ----------
function showNav() {
const cart = getData("cart", []);
let count = 0;
cart.forEach(c => count += c.qty);
const loggedIn = localStorage.getItem("currentUser");
let html = "<a class='logo' href='index.html'>📚 BookNest</a>" +
"<a href='index.html'>Home</a><a href='catalog.html'>Books</a>" +
"<a href='cart.html'>Cart (" + count + ")</a>";
if (loggedIn) {
html += "<a href='profile.html'>Profile</a><a href='#' onclick='logout()'>Logout</a>";
} else {
html += "<a href='login.html'>Login</a><a href='registration.html'>Register</a>";
}
document.getElementById("nav").innerHTML = html;
}
function logout() {
localStorage.removeItem("currentUser");
window.location = "index.html";
}
// ---------- BOOKS (home + catalog) ----------
function showBooks(list, elementId) {
const box = document.getElementById(elementId);
if (list.length === 0) {
box.innerHTML = "<p>No books found.</p>";
return;
}
let html = "";
list.forEach(b => {
html += "<div class='book'><img src=\"" + bookImage(b) + "\">" +
"<h4>" + b.title + "</h4><p>" + b.author + "</p><p>" + b.category + "</p>" +
"<p><b>₹" + b.price + "</b></p>" +
"<button onclick='addToCart(" + b.id + ")'>Add to Cart</button></div>";
});
box.innerHTML = html;
}
function addToCart(id) {
const cart = getData("cart", []);
const item = cart.find(c => c.id === id);
if (item) item.qty++;
else cart.push({ id: id, qty: 1 });
setData("cart", cart);
showNav();
alert("Book added to cart!");
}
// Home page
function homePage() {
showBooks(books.slice(0, 4), "featured");
const cats = [...new Set(books.map(b => b.category))];
let html = "";
cats.forEach(c => html += "<span onclick=\"goToCategory('" + c + "')\">" + c + "</span>");
document.getElementById("categories").innerHTML = html;
}
function goToCategory(c) {
window.location = "catalog.html?category=" + encodeURIComponent(c);
}
function homeSearch() {
const text = document.getElementById("homeSearch").value;
window.location = "catalog.html?search=" + encodeURIComponent(text);
}
// Catalog page
function catalogPage() {
const cats = [...new Set(books.map(b => b.category))];
let opts = "<option value=''>All Categories</option>";
cats.forEach(c => opts += "<option>" + c + "</option>");
document.getElementById("categoryFilter").innerHTML = opts;
const params = new URLSearchParams(window.location.search);
document.getElementById("searchBox").value = params.get("search") || "";
document.getElementById("categoryFilter").value = params.get("category") || "";
filterBooks();
}
function filterBooks() {
const text = document.getElementById("searchBox").value.toLowerCase();
const cat = document.getElementById("categoryFilter").value;
const result = books.filter(b =>
(b.title.toLowerCase().includes(text) || b.author.toLowerCase().includes(text)) &&
(cat === "" || b.category === cat));
showBooks(result, "bookList");
}
// ---------- REGISTRATION ----------
function registerUser(e) {
e.preventDefault();
const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const phone = document.getElementById("phone").value.trim();
const address = document.getElementById("address").value.trim();
const pass = document.getElementById("password").value;
const confirm = document.getElementById("confirm").value;
let ok = true;
setMsg("nameErr", ""); setMsg("emailErr", ""); setMsg("phoneErr", "");
setMsg("addressErr", ""); setMsg("passErr", ""); setMsg("confirmErr", ""); setMsg("result", "");
if (name.length < 3) { setMsg("nameErr", "Name must be at least 3 characters"); ok = false; }
if (!/^\S+@\S+\.\S+$/.test(email)) { setMsg("emailErr", "Enter a valid email"); ok = false; }
if (!/^[0-9]{10}$/.test(phone)) { setMsg("phoneErr", "Phone must be 10 digits"); ok = false; }
if (address === "") { setMsg("addressErr", "Address is required"); ok = false; }
if (pass.length < 6) { setMsg("passErr", "Password must be at least 6 characters"); ok = false; }
if (pass !== confirm) { setMsg("confirmErr", "Passwords do not match"); ok = false; }
if (!ok) return;
const users = getData("users", []);
if (users.find(u => u.email === email)) {
setMsg("emailErr", "This email is already registered");
return;
}
users.push({ name: name, email: email, phone: phone, address: address, password: pass });
setData("users", users);
setMsg("result", "Registration successful! Redirecting to login...");
setTimeout(() => window.location = "login.html", 1500);
}
// ---------- LOGIN ----------
function loginUser(e) {
e.preventDefault();
const email = document.getElementById("email").value.trim();
const pass = document.getElementById("password").value;
setMsg("emailErr", ""); setMsg("passErr", ""); setMsg("result", "");
if (!/^\S+@\S+\.\S+$/.test(email)) { setMsg("emailErr", "Enter a valid email"); return; }
if (pass === "") { setMsg("passErr", "Password is required"); return; }
const user = getData("users", []).find(u => u.email === email && u.password === pass);
if (!user) {
setMsg("result", "Invalid email or password");
document.getElementById("result").className = "error";
return;
}
localStorage.setItem("currentUser", email);
window.location = "profile.html";
}
// ---------- PROFILE ----------
function profilePage() {
const user = getCurrentUser();
if (!user) { window.location = "login.html"; return; }
document.getElementById("pName").innerText = user.name;
document.getElementById("pEmail").innerText = user.email;
document.getElementById("pPhone").innerText = user.phone;
document.getElementById("pAddress").innerText = user.address;
document.getElementById("name").value = user.name;
document.getElementById("phone").value = user.phone;
document.getElementById("address").value = user.address;
}
function updateProfile(e) {
e.preventDefault();
const name = document.getElementById("name").value.trim();
const phone = document.getElementById("phone").value.trim();
const address = document.getElementById("address").value.trim();
setMsg("nameErr", ""); setMsg("phoneErr", ""); setMsg("addressErr", ""); setMsg("result", "");
let ok = true;
if (name.length < 3) { setMsg("nameErr", "Name must be at least 3 characters"); ok = false; }
if (!/^[0-9]{10}$/.test(phone)) { setMsg("phoneErr", "Phone must be 10 digits"); ok = false; }
if (address === "") { setMsg("addressErr", "Address is required"); ok = false; }
if (!ok) return;
const users = getData("users", []);
const user = users.find(u => u.email === localStorage.getItem("currentUser"));
user.name = name; user.phone = phone; user.address = address;
setData("users", users);
profilePage();
setMsg("result", "Profile updated successfully!");
}
// ---------- CART ----------
function cartPage() {
const cart = getData("cart", []);
const box = document.getElementById("cartBox");
if (cart.length === 0) {
box.innerHTML = "<p>Your cart is empty. <a href='catalog.html'>Browse books</a></p>";
return;
}
let total = 0;
let html = "<table><tr><th>Book</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr>";
cart.forEach(c => {
const b = books.find(x => x.id === c.id);
const sub = b.price * c.qty;
total += sub;
html += "<tr><td>" + b.title + "</td><td>₹" + b.price + "</td>" +
"<td class='qty'><button onclick='changeQty(" + c.id + ",-1)'>-</button> " + c.qty +
" <button onclick='changeQty(" + c.id + ",1)'>+</button></td>" +
"<td>₹" + sub + "</td><td><button onclick='removeItem(" + c.id + ")'>Remove</button></td></tr>";
});
html += "</table><p class='total'><b>Total: ₹" + total + "</b></p>" +
"<p class='total'><button onclick='checkout()'>Proceed to Payment</button></p>";
box.innerHTML = html;
}
function changeQty(id, change) {
const cart = getData("cart", []);
const item = cart.find(c => c.id === id);
item.qty += change;
if (item.qty < 1) item.qty = 1;
setData("cart", cart);
showNav();
cartPage();
}
function removeItem(id) {
setData("cart", getData("cart", []).filter(c => c.id !== id));
showNav();
cartPage();
}
function getCartTotal() {
let total = 0;
return total;
getData("cart", []).forEach(c => total += books.find(b => b.id === c.id).price * c.qty);
}
function checkout() {
if (!localStorage.getItem("currentUser")) {
alert("Please login to continue");
window.location = "login.html";
return;
}
window.location = "payment.html";
}
// ---------- PAYMENT ----------
function paymentPage() {
if (!localStorage.getItem("currentUser")) { window.location = "login.html"; return; }
if (getData("cart", []).length === 0) { window.location = "cart.html"; return; }
document.getElementById("amount").innerText = "Amount to pay: ₹" + getCartTotal();
}
function payNow(e) {
e.preventDefault();
const name = document.getElementById("cardName").value.trim();
const number = document.getElementById("cardNumber").value.replace(/\s/g, "");
const expiry = document.getElementById("expiry").value.trim();
const cvv = document.getElementById("cvv").value.trim();
let ok = true;
setMsg("cardNameErr", ""); setMsg("cardNumberErr", ""); setMsg("expiryErr", ""); setMsg("cvvErr", "");
if (!/^[A-Za-z ]{3,}$/.test(name)) { setMsg("cardNameErr", "Enter a valid cardholder name (letters only)"); ok =
false; }
if (!/^[0-9]{16}$/.test(number)) { setMsg("cardNumberErr", "Card number must be 16 digits"); ok = false; }
// expiry format MM/YY and not in the past
const m = expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
if (!m) {
setMsg("expiryErr", "Use format MM/YY"); ok = false;
} else {
const now = new Date();
const expDate = new Date(2000 + Number(m[2]), Number(m[1]), 1); // first day after expiry month
if (expDate <= now) { setMsg("expiryErr", "Card has expired"); ok = false; }
}
if (!/^[0-9]{3}$/.test(cvv)) { setMsg("cvvErr", "CVV must be 3 digits"); ok = false; }
if (!ok) return;
// simulated payment - create the order
const user = getCurrentUser();
const items = getData("cart", []).map(c => {
const b = books.find(x => x.id === c.id);
return { title: b.title, qty: c.qty, price: b.price };
});
const order = {
id: "ORD" + Math.floor(100000 + Math.random() * 900000),
customer: user.name,
items: items,
total: getCartTotal(),
date: new Date().toLocaleString()
};
setData("lastOrder", order);
setData("cart", []);
window.location = "confirmation.html";
}
// ---------- CONFIRMATION ----------
function confirmationPage() {
const o = getData("lastOrder", null);
const box = document.getElementById("orderBox");
if (!o) { box.innerHTML = "<p>No order found.</p>"; return; }
let html = "<p class='success'>✅ Thank you! Your payment was successful and your order is confirmed.</p>" +
"<p><b>Order ID:</b> " + o.id + "</p>" +
"<p><b>Customer Name:</b> " + o.customer + "</p>" +
"<p><b>Order Date:</b> " + o.date + "</p>" +
"<table><tr><th>Book</th><th>Quantity</th><th>Price</th></tr>";
o.items.forEach(i => html += "<tr><td>" + i.title + "</td><td>" + i.qty + "</td><td>₹" + (i.price * i.qty) +
"</td></tr>");
html += "</table><p class='total'><b>Total Amount: ₹" + o.total + "</b></p>";
box.innerHTML = html;
}