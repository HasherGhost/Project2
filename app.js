// ===== DATA =====
let menuData = [
  {id:1,name:"Masala Dosa",price:60,category:"meals",emoji:"🥞",desc:"Crispy dosa with potato filling",available:true},
  {id:2,name:"Idli Sambar",price:40,category:"meals",emoji:"🍚",desc:"Steamed idli with hot sambar",available:true},
  {id:3,name:"Chole Bhature",price:80,category:"meals",emoji:"🍛",desc:"Spicy chole with fluffy bhature",available:true},
  {id:4,name:"Veg Biryani",price:110,category:"meals",emoji:"🍚",desc:"Fragrant rice with mixed veggies",available:true},
  {id:5,name:"Paneer Butter Masala",price:130,category:"meals",emoji:"🧀",desc:"Rich creamy paneer curry",available:true},
  {id:6,name:"Rajma Chawal",price:70,category:"meals",emoji:"🍛",desc:"Kidney beans curry with rice",available:true},
  {id:7,name:"Samosa",price:20,category:"snacks",emoji:"🥟",desc:"Crispy fried with spicy filling",available:true},
  {id:8,name:"Vada Pav",price:25,category:"snacks",emoji:"🍔",desc:"Mumbai style spicy burger",available:true},
  {id:9,name:"Pav Bhaji",price:60,category:"snacks",emoji:"🍞",desc:"Buttery pav with mixed veg bhaji",available:true},
  {id:10,name:"Aloo Tikki",price:30,category:"snacks",emoji:"🥔",desc:"Crispy potato patties with chutney",available:true},
  {id:11,name:"Spring Roll",price:40,category:"snacks",emoji:"🌯",desc:"Crispy rolls with veggie filling",available:true},
  {id:12,name:"Masala Chai",price:15,category:"beverages",emoji:"☕",desc:"Traditional Indian spiced tea",available:true},
  {id:13,name:"Filter Coffee",price:20,category:"beverages",emoji:"☕",desc:"South Indian filter coffee",available:true},
  {id:14,name:"Mango Lassi",price:45,category:"beverages",emoji:"🥭",desc:"Creamy mango yogurt drink",available:true},
  {id:15,name:"Fresh Lime Soda",price:30,category:"beverages",emoji:"🍋",desc:"Refreshing lime with soda",available:true},
  {id:16,name:"Cold Coffee",price:50,category:"beverages",emoji:"🧊",desc:"Chilled blended coffee",available:true},
  {id:17,name:"Gulab Jamun",price:35,category:"desserts",emoji:"🍩",desc:"Soft milk balls in sugar syrup",available:true},
  {id:18,name:"Rasgulla",price:30,category:"desserts",emoji:"⚪",desc:"Spongy cottage cheese balls",available:true},
  {id:19,name:"Kheer",price:40,category:"desserts",emoji:"🍮",desc:"Creamy rice pudding",available:true},
  {id:20,name:"Jalebi",price:25,category:"desserts",emoji:"🌀",desc:"Crispy sweet spirals",available:true},
];

let cart = [];
let orders = [];
let walletBalance = 500;
let currentRole = null;
let orderCounter = 1000;
let currentFilter = 'all';
let seats = Array.from({length:40}, (_,i) => ({id:i+1, occupied: Math.random() < 0.3}));
let nextDishId = 21;

// ===== CLOCK =====
function updateClocks() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  document.querySelectorAll('.live-clock').forEach(el => el.textContent = timeStr);
}
setInterval(updateClocks, 1000);
updateClocks();

// ===== LOGIN =====
function login(role) {
  currentRole = role;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(role + 'Screen').classList.add('active');
  if (role === 'student') { renderMenu(); renderSeats(); renderStudentOrders(); }
  if (role === 'staff') { renderStaffOrders(); renderStaffMenu(); }
  if (role === 'admin') { renderAdminDashboard(); renderAdminMenu(); }
  showToast(`Welcome, ${role.charAt(0).toUpperCase()+role.slice(1)}!`);
}

function logout() {
  currentRole = null;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('loginScreen').classList.add('active');
}

// ===== TABS =====
function switchStudentTab(tab) {
  document.querySelectorAll('#studentScreen .nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`#studentScreen .nav-tab[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('#studentScreen .tab-content').forEach(t => t.classList.remove('active'));
  const tabMap = {menu:'studentMenuTab',orders:'studentOrdersTab',seats:'studentSeatsTab'};
  document.getElementById(tabMap[tab]).classList.add('active');
  if(tab==='orders') renderStudentOrders();
  if(tab==='seats') renderSeats();
}
function switchStaffTab(tab) {
  document.querySelectorAll('#staffScreen .nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`#staffScreen .nav-tab[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('#staffScreen .tab-content').forEach(t => t.classList.remove('active'));
  const tabMap = {sorders:'staffOrdersTab',smenu:'staffMenuTab'};
  document.getElementById(tabMap[tab]).classList.add('active');
}
function switchAdminTab(tab) {
  document.querySelectorAll('#adminScreen .nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`#adminScreen .nav-tab[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('#adminScreen .tab-content').forEach(t => t.classList.remove('active'));
  const tabMap = {dashboard:'adminDashboardTab',amenu:'adminMenuTab'};
  document.getElementById(tabMap[tab]).classList.add('active');
  if(tab==='dashboard') renderAdminDashboard();
}

// ===== MENU RENDERING =====
function filterMenu(cat) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderMenu();
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const items = currentFilter === 'all' ? menuData : menuData.filter(i => i.category === currentFilter);
  grid.innerHTML = items.map(item => `
    <div class="menu-item ${item.available ? '' : 'unavailable'}" id="mi-${item.id}">
      <span class="emoji">${item.emoji}</span>
      <div class="item-name">${item.name}</div>
      <div class="item-desc">${item.desc}</div>
      <div class="item-bottom">
        <span class="item-price">₹${item.price}</span>
        ${item.available ? `<button class="btn-add" onclick="addToCart(${item.id})"><i class="fas fa-plus"></i></button>` : '<span style="font-size:12px;color:var(--danger)">Unavailable</span>'}
      </div>
    </div>
  `).join('');
}

// ===== CART =====
function addToCart(itemId) {
  const item = menuData.find(i => i.id === itemId);
  if (!item || !item.available) return;
  const existing = cart.find(c => c.id === itemId);
  if (existing) existing.qty++;
  else cart.push({...item, qty: 1});
  updateCartUI();
  showToast(`${item.name} added to cart`);
  // Animate button
  const btn = document.querySelector(`#mi-${itemId} .btn-add`);
  if(btn){btn.style.transform='scale(1.3)';setTimeout(()=>btn.style.transform='',200);}
}

function updateCartUI() {
  const count = cart.reduce((s,c) => s + c.qty, 0);
  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = total;
  const container = document.getElementById('cartItems');
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text2);padding:40px 0">Your cart is empty</p>';
    return;
  }
  container.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${c.emoji} ${c.name}</div>
        <div class="cart-item-price">₹${c.price} × ${c.qty} = ₹${c.price*c.qty}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${c.id},-1)">−</button>
        <span>${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.id},1)">+</button>
      </div>
    </div>
  `).join('');
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('active');
}

// ===== CHECKOUT =====
function showCheckoutModal() {
  if (cart.length === 0) { showToast('Cart is empty!'); return; }
  toggleCart();
  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  document.getElementById('checkoutSummary').innerHTML = `
    <div style="margin-bottom:16px">
      ${cart.map(c => `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px"><span>${c.emoji} ${c.name} × ${c.qty}</span><span>₹${c.price*c.qty}</span></div>`).join('')}
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:700;font-size:16px;border-top:1px solid var(--glass-border);margin-top:8px"><span>Total</span><span>₹${total}</span></div>
    </div>`;
  openModal('checkoutModal');
}

function placeOrder() {
  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  
  if (paymentMethod === 'wallet') {
    if (walletBalance < total) { showToast('Insufficient wallet balance!'); return; }
    walletBalance -= total;
    document.getElementById('walletBalance').textContent = walletBalance;
    document.getElementById('walletDispBal').textContent = walletBalance;
  }

  const order = {
    id: 'ORD-' + (++orderCounter),
    items: [...cart],
    total,
    payment: paymentMethod,
    paymentDone: paymentMethod !== 'offline',
    status: 'pending',
    time: new Date(),
    offlineDeadline: paymentMethod === 'offline' ? new Date(Date.now() + 10*60*1000) : null
  };
  orders.unshift(order);
  cart = [];
  updateCartUI();
  closeModal('checkoutModal');
  switchStudentTab('orders');
  showToast(`Order ${order.id} placed!`);
}

// ===== STUDENT ORDERS =====
function renderStudentOrders() {
  const el = document.getElementById('studentOrdersList');
  if (orders.length === 0) {
    el.innerHTML = '<div class="glass-card" style="text-align:center;padding:40px;color:var(--text2)"><i class="fas fa-receipt" style="font-size:36px;margin-bottom:12px;display:block"></i>No orders yet</div>';
    return;
  }
  el.innerHTML = orders.map(o => {
    let timerHTML = '';
    if (o.payment === 'offline' && !o.paymentDone && o.offlineDeadline) {
      const remaining = Math.max(0, o.offlineDeadline - Date.now());
      const min = Math.floor(remaining/60000); const sec = Math.floor((remaining%60000)/1000);
      timerHTML = remaining > 0 ? `<div class="pay-timer"><i class="fas fa-clock"></i> Pay at counter in ${min}:${sec.toString().padStart(2,'0')}</div>` : `<div class="pay-timer">⚠️ Payment time expired!</div>`;
    }
    return `<div class="order-card">
      <div class="order-top">
        <span class="order-id">${o.id}</span>
        <span class="order-time">${o.time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}</span>
        <span class="status-badge ${o.status}">${o.status === 'pending' ? 'Pending' : o.status === 'preparing' ? 'Under Preparation' : o.status === 'ready' ? 'Ready to Collect' : 'Delivered'}</span>
      </div>
      <div class="order-items-list">${o.items.map(i => `${i.emoji} ${i.name} × ${i.qty}`).join(' &nbsp;•&nbsp; ')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:700">₹${o.total}</span>
        <span style="font-size:12px;color:var(--text2)">${o.payment === 'wallet' ? '💳 Wallet' : o.payment === 'online' ? '📱 Online' : '💵 Pay at Counter'}</span>
      </div>
      ${timerHTML}
    </div>`;
  }).join('');
}
// Refresh student timers
setInterval(() => { if(currentRole === 'student') renderStudentOrders(); }, 5000);

// ===== STAFF =====
function renderStaffOrders() {
  const el = document.getElementById('staffOrdersList');
  if (orders.length === 0) {
    el.innerHTML = '<div class="glass-card" style="text-align:center;padding:40px;color:var(--text2)">No orders yet</div>';
    return;
  }
  el.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-top">
        <span class="order-id">${o.id}</span>
        <span class="order-time">${o.time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}</span>
        <span class="status-badge ${o.status}">${o.status === 'pending' ? 'Pending' : o.status === 'preparing' ? 'Under Preparation' : o.status === 'ready' ? 'Ready to Collect' : 'Delivered'}</span>
      </div>
      <div class="order-items-list">${o.items.map(i => `${i.emoji} ${i.name} × ${i.qty}`).join(' &nbsp;•&nbsp; ')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-weight:700">₹${o.total} <small style="color:var(--text2)">(${o.payment === 'wallet' ? 'Wallet' : o.payment === 'online' ? 'Online' : 'Counter'})</small></span>
        <div class="order-actions">
          ${o.status === 'pending' ? `<button class="btn-sm btn-prepare" onclick="updateOrderStatus('${o.id}','preparing')"><i class="fas fa-fire"></i> Start Preparation</button>` : ''}
          ${o.status === 'preparing' ? `<button class="btn-sm btn-ready" onclick="updateOrderStatus('${o.id}','ready')"><i class="fas fa-check"></i> Ready to Collect</button>` : ''}
          ${o.status === 'ready' ? `<button class="btn-sm btn-delivered" onclick="updateOrderStatus('${o.id}','delivered')"><i class="fas fa-check-double"></i> Delivered</button>` : ''}
          ${o.status === 'delivered' ? '<span style="font-size:12px;color:var(--success)">✓ Completed</span>' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function updateOrderStatus(orderId, status) {
  const order = orders.find(o => o.id === orderId);
  if (order) { order.status = status; renderStaffOrders(); showToast(`${orderId} → ${status.charAt(0).toUpperCase()+status.slice(1)}`); }
}

function renderStaffMenu() {
  document.getElementById('staffMenuList').innerHTML = menuData.map(item => `
    <div class="manage-item">
      <div class="manage-left"><span class="emoji">${item.emoji}</span><div><div class="manage-name">${item.name}</div><div class="manage-price">₹${item.price} • ${item.category}</div></div></div>
      <label class="toggle-switch"><input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleAvailability(${item.id})"><span class="toggle-slider"></span></label>
    </div>
  `).join('');
}

function toggleAvailability(id) {
  const item = menuData.find(i => i.id === id);
  if (item) { item.available = !item.available; showToast(`${item.name} ${item.available ? 'available' : 'unavailable'}`); }
}

// ===== ADMIN =====
function renderAdminDashboard() {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s,o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  
  document.getElementById('adminStats').innerHTML = [
    {label:'Total Orders',value:totalOrders,icon:'fa-receipt',color:'var(--accent2)'},
    {label:'Revenue',value:`₹${totalRevenue}`,icon:'fa-indian-rupee-sign',color:'var(--success)'},
    {label:'Pending',value:pendingOrders,icon:'fa-clock',color:'var(--warning)'},
    {label:'Avg Order',value:`₹${avgOrder}`,icon:'fa-chart-line',color:'var(--accent)'}
  ].map(s => `<div class="stat-card"><div class="stat-label"><i class="fas ${s.icon}" style="color:${s.color}"></i> ${s.label}</div><div class="stat-value">${s.value}</div></div>`).join('');

  // Pie Chart
  const itemCounts = {};
  orders.forEach(o => o.items.forEach(i => { itemCounts[i.name] = (itemCounts[i.name]||0) + i.qty; }));
  const labels = Object.keys(itemCounts).slice(0,6);
  const data = labels.map(l => itemCounts[l]);
  const colors = ['#6c63ff','#a78bfa','#22c55e','#f59e0b','#ef4444','#06b6d4'];

  const pieCtx = document.getElementById('pieChart');
  if (window.pieChartInstance) window.pieChartInstance.destroy();
  window.pieChartInstance = new Chart(pieCtx, {
    type:'doughnut',data:{labels,datasets:[{data:data.length?data:[1],backgroundColor:data.length?colors:['#333'],borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#8a8a9a',font:{size:11}}}}}
  });

  // Bar Chart
  const hours = {};
  orders.forEach(o => { const h = o.time.getHours(); hours[h] = (hours[h]||0) + 1; });
  const hLabels = Object.keys(hours).sort((a,b)=>a-b).map(h => `${h}:00`);
  const hData = Object.keys(hours).sort((a,b)=>a-b).map(h => hours[h]);
  
  const barCtx = document.getElementById('barChart');
  if (window.barChartInstance) window.barChartInstance.destroy();
  window.barChartInstance = new Chart(barCtx, {
    type:'bar',data:{labels:hLabels.length?hLabels:['No data'],datasets:[{data:hData.length?hData:[0],backgroundColor:'rgba(108,99,255,.5)',borderRadius:8,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#8a8a9a'},grid:{display:false}},y:{ticks:{color:'#8a8a9a'},grid:{color:'rgba(255,255,255,.05)'}}}}
  });

  // Orders table
  const tableEl = document.getElementById('adminOrdersList');
  if (orders.length === 0) { tableEl.innerHTML = '<p style="text-align:center;color:var(--text2);padding:20px">No orders yet</p>'; return; }
  tableEl.innerHTML = `<table><thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Time</th></tr></thead><tbody>
    ${orders.slice(0,15).map(o => `<tr><td>${o.id}</td><td>${o.items.map(i=>i.name).join(', ')}</td><td>₹${o.total}</td><td>${o.payment}</td><td><span class="status-badge ${o.status}">${o.status}</span></td><td>${o.time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}</td></tr>`).join('')}
  </tbody></table>`;
}

function renderAdminMenu() {
  document.getElementById('adminMenuList').innerHTML = menuData.map(item => `
    <div class="manage-item">
      <div class="manage-left"><span class="emoji">${item.emoji}</span><div><div class="manage-name">${item.name}</div><div class="manage-price">₹${item.price} • ${item.category}</div></div></div>
      <label class="toggle-switch"><input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleAvailability(${item.id})"><span class="toggle-slider"></span></label>
    </div>
  `).join('');
}

function showAddDishModal() { openModal('addDishModal'); }

function addNewDish() {
  const name = document.getElementById('newDishName').value.trim();
  const price = parseInt(document.getElementById('newDishPrice').value);
  const cat = document.getElementById('newDishCat').value;
  const emoji = document.getElementById('newDishEmoji').value || '🍽️';
  const desc = document.getElementById('newDishDesc').value.trim() || 'Delicious dish';
  if (!name || !price) { showToast('Please fill name and price'); return; }
  menuData.push({id:nextDishId++, name, price, category:cat, emoji, desc, available:true});
  closeModal('addDishModal');
  renderAdminMenu();
  showToast(`${name} added to menu!`);
  document.getElementById('newDishName').value = '';
  document.getElementById('newDishPrice').value = '';
  document.getElementById('newDishEmoji').value = '';
  document.getElementById('newDishDesc').value = '';
}

// ===== SEATS =====
function renderSeats() {
  const avail = seats.filter(s => !s.occupied).length;
  const occ = seats.filter(s => s.occupied).length;
  document.getElementById('totalSeats').textContent = seats.length;
  document.getElementById('availSeats').textContent = avail;
  document.getElementById('occSeats').textContent = occ;
  document.getElementById('seatingMap').innerHTML = seats.map(s =>
    `<div class="seat ${s.occupied ? 'taken' : 'free'}">${s.id}</div>`
  ).join('');
}
// Simulate seat changes
setInterval(() => {
  const idx = Math.floor(Math.random() * seats.length);
  seats[idx].occupied = !seats[idx].occupied;
  if(currentRole === 'student' && document.getElementById('studentSeatsTab').classList.contains('active')) renderSeats();
}, 8000);

// ===== WALLET =====
function showWalletModal() {
  document.getElementById('walletDispBal').textContent = walletBalance;
  openModal('walletModal');
}
function addMoney() {
  const amt = parseInt(document.getElementById('addMoneyAmt').value);
  if (!amt || amt <= 0) { showToast('Enter a valid amount'); return; }
  walletBalance += amt;
  document.getElementById('walletBalance').textContent = walletBalance;
  document.getElementById('walletDispBal').textContent = walletBalance;
  document.getElementById('addMoneyAmt').value = '';
  showToast(`₹${amt} added to wallet!`);
  closeModal('walletModal');
}

// ===== MODALS =====
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-toggle i, .theme-toggle-floating i');
  icons.forEach(icon => {
    if (theme === 'light') {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  });
}

// Initial Theme Selection
(function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);
})();

// ===== INIT =====
updateCartUI();
