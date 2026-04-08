// ===== DATA =====
let menuData = [
  {id:1,  name:"Masala Dosa",       price:60,  category:"meals",     emoji:"🥞", desc:"Crispy dosa with potato filling",           available:true},
  {id:2,  name:"Idli Sambar",       price:40,  category:"meals",     emoji:"🍚", desc:"Steamed idli with hot sambar",              available:true},
  {id:3,  name:"Chole Bhature",     price:80,  category:"meals",     emoji:"🍛", desc:"Spicy chole with fluffy bhature",           available:true},
  {id:4,  name:"Veg Biryani",       price:110, category:"meals",     emoji:"🍚", desc:"Fragrant rice with mixed veggies",          available:true},
  {id:5,  name:"Paneer Butter Masala",price:130,category:"meals",    emoji:"🧀", desc:"Rich creamy paneer curry",                  available:true},
  {id:6,  name:"Rajma Chawal",      price:70,  category:"meals",     emoji:"🍛", desc:"Kidney beans curry with rice",              available:true},
  {id:7,  name:"Samosa",            price:20,  category:"snacks",    emoji:"🥟", desc:"Crispy fried with spicy filling",           available:true},
  {id:8,  name:"Vada Pav",          price:25,  category:"snacks",    emoji:"🍔", desc:"Mumbai style spicy burger",                 available:true},
  {id:9,  name:"Pav Bhaji",         price:60,  category:"snacks",    emoji:"🍞", desc:"Buttery pav with mixed veg bhaji",          available:true},
  {id:10, name:"Aloo Tikki",        price:30,  category:"snacks",    emoji:"🥔", desc:"Crispy potato patties with chutney",        available:true},
  {id:11, name:"Spring Roll",       price:40,  category:"snacks",    emoji:"🌯", desc:"Crispy rolls with veggie filling",          available:true},
  {id:12, name:"Masala Chai",       price:15,  category:"beverages", emoji:"☕", desc:"Traditional Indian spiced tea",             available:true},
  {id:13, name:"Filter Coffee",     price:20,  category:"beverages", emoji:"☕", desc:"South Indian filter coffee",                available:true},
  {id:14, name:"Mango Lassi",       price:45,  category:"beverages", emoji:"🥭", desc:"Creamy mango yogurt drink",                 available:true},
  {id:15, name:"Fresh Lime Soda",   price:30,  category:"beverages", emoji:"🍋", desc:"Refreshing lime with soda",                 available:true},
  {id:16, name:"Cold Coffee",       price:50,  category:"beverages", emoji:"🧊", desc:"Chilled blended coffee",                    available:true},
  {id:17, name:"Gulab Jamun",       price:35,  category:"desserts",  emoji:"🍩", desc:"Soft milk balls in sugar syrup",            available:true},
  {id:18, name:"Rasgulla",          price:30,  category:"desserts",  emoji:"⚪", desc:"Spongy cottage cheese balls",               available:true},
  {id:19, name:"Kheer",             price:40,  category:"desserts",  emoji:"🍮", desc:"Creamy rice pudding",                       available:true},
  {id:20, name:"Jalebi",            price:25,  category:"desserts",  emoji:"🌀", desc:"Crispy sweet spirals",                      available:true},
];

let cart = [];
let orders = [];
let walletBalance = 500;
let currentRole = null;
let orderCounter = 1000;
let currentFilter = 'all';
let seats = Array.from({length:40}, (_,i) => ({id:i+1, occupied: Math.random() < 0.3}));
let nextDishId = 21;
let selectedRole = 'student';
let searchQuery = '';

// ===== CANTEEN CONFIG =====
let canteenConfig = { name: "SmartCanteen", tagline: "Your campus dining, reimagined" };

function loadCanteenConfig() {
  const saved = localStorage.getItem('canteenConfig');
  if (saved) canteenConfig = JSON.parse(saved);
  applyCanteenConfig();
}
function applyCanteenConfig() {
  document.getElementById('canteenNameLogin').textContent = canteenConfig.name;
  document.getElementById('canteenTaglineLogin').textContent = canteenConfig.tagline;
  document.getElementById('canteenNameNav').textContent = canteenConfig.name;
  if (currentRole === 'admin') {
    document.getElementById('cfgCanteenName').value = canteenConfig.name;
    document.getElementById('cfgCanteenTagline').value = canteenConfig.tagline;
  }
}
function updateCanteenConfig() {
  canteenConfig.name = document.getElementById('cfgCanteenName').value || "SmartCanteen";
  canteenConfig.tagline = document.getElementById('cfgCanteenTagline').value || "Your campus dining, reimagined";
  localStorage.setItem('canteenConfig', JSON.stringify(canteenConfig));
  applyCanteenConfig();
  showToast("Branding updated!");
}

// ===== CLOCK =====
function updateClocks() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true});
  document.querySelectorAll('.live-clock').forEach(el => el.textContent = timeStr);
}
setInterval(updateClocks, 1000);
updateClocks();

// ===== GREETING =====
function updateGreeting(username) {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  const el = document.getElementById('greetingTime');
  const nameEl = document.getElementById('studentName');
  if (el) el.textContent = greet;
  if (nameEl) nameEl.textContent = username || 'Student';
}

// ===== LOGIN PARTICLES =====
function spawnParticles() {
  const container = document.getElementById('loginParticles');
  if (!container) return;
  container.innerHTML = '';
  const emojis = ['🍛','☕','🥟','🍩','🍞','🌯','🥭','🍮','🔥','🧀','⭐','🍋'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (12 + Math.random() * 18) + 's';
    el.style.animationDelay = (Math.random() * -20) + 's';
    el.style.fontSize = (20 + Math.random() * 20) + 'px';
    container.appendChild(el);
  }
}

// ===== ROLE TAB SELECT =====
function selectRoleTab(btn) {
  document.querySelectorAll('.role-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedRole = btn.dataset.role;
}

// ===== LOGIN =====
function performLogin(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) { showToast('Please fill in all fields'); return; }

  // Animate btn
  const btn = document.getElementById('loginBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
    btn.disabled = false;
    login(selectedRole, username);
  }, 700);
}

function login(role, username) {
  try {
    currentRole = role || 'student';
    const screenId = currentRole + 'Screen';
    const targetScreen = document.getElementById(screenId);
    
    if (!targetScreen) {
      console.error(`Screen not found: ${screenId}`);
      showToast('Error: Screen not found');
      return;
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    targetScreen.classList.add('active');

    if (currentRole === 'student') {
      updateGreeting(username);
      renderMenu(); renderSeats(); renderStudentOrders();
      updateHeroStats();
    }
    if (currentRole === 'staff')  { renderStaffOrders(); renderStaffMenu(); renderStaffSeats(); }
    if (currentRole === 'admin')  { renderAdminDashboard(); renderAdminMenu(); applyCanteenConfig(); }
    showToast(`Welcome, ${username || currentRole}! 🎉`);
  } catch (err) {
    console.error("Login Error:", err);
    showToast("Something went wrong during login");
  }
}

function logout() {
  currentRole = null;
  selectedRole = 'student';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('loginPage').classList.add('active');
  // Reset role tabs
  document.querySelectorAll('.role-tab-btn').forEach(b => b.classList.remove('active'));
  const firstTab = document.querySelector('.role-tab-btn');
  if (firstTab) firstTab.classList.add('active');
  // Clear form
  const uEl = document.getElementById('loginUsername');
  const pEl = document.getElementById('loginPassword');
  if (uEl) uEl.value = '';
  if (pEl) pEl.value = '';
}

// ===== HERO STATS =====
function updateHeroStats() {
  const avail = seats.filter(s => !s.occupied).length;
  const el = document.getElementById('heroAvailSeats');
  const walletEl = document.getElementById('heroWallet');
  const itemEl = document.getElementById('heroTotalItems');
  const menuAvail = document.getElementById('menuAvailCount');
  if (el) el.textContent = avail;
  if (walletEl) walletEl.textContent = '₹' + walletBalance;
  const avC = menuData.filter(m => m.available).length;
  if (itemEl) itemEl.textContent = avC;
  if (menuAvail) menuAvail.textContent = avC + ' items';
}

// ===== TABS =====
function switchStudentTab(tab) {
  document.querySelectorAll('#studentScreen .nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`#studentScreen .nav-tab[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('#studentScreen .tab-content').forEach(t => t.classList.remove('active'));
  const tabMap = {menu:'studentMenuTab', orders:'studentOrdersTab', seats:'studentSeatsTab'};
  document.getElementById(tabMap[tab]).classList.add('active');
  if (tab === 'orders') renderStudentOrders();
  if (tab === 'seats') renderSeats();
}
function switchStaffTab(tab) {
  document.querySelectorAll('#staffScreen .nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`#staffScreen .nav-tab[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('#staffScreen .tab-content').forEach(t => t.classList.remove('active'));
  const tabMap = {sorders:'staffOrdersTab', smenu:'staffMenuTab', sseats:'staffSeatsTab'};
  document.getElementById(tabMap[tab]).classList.add('active');
  if (tab === 'sseats') renderStaffSeats();
}
function switchAdminTab(tab) {
  document.querySelectorAll('#adminScreen .nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`#adminScreen .nav-tab[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('#adminScreen .tab-content').forEach(t => t.classList.remove('active'));
  const tabMap = {dashboard:'adminDashboardTab', amenu:'adminMenuTab'};
  document.getElementById(tabMap[tab]).classList.add('active');
  if (tab === 'dashboard') renderAdminDashboard();
}

// ===== MENU RENDERING =====
function filterMenu(cat, btnEl) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderMenu();
}

function searchMenu() {
  searchQuery = document.getElementById('menuSearch').value.toLowerCase();
  renderMenu();
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  let items = currentFilter === 'all' ? menuData : menuData.filter(i => i.category === currentFilter);
  
  if (searchQuery) {
    items = items.filter(i => 
      i.name.toLowerCase().includes(searchQuery) || 
      i.desc.toLowerCase().includes(searchQuery)
    );
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; padding: 60px; text-align: center;">
        <i class="fas fa-search" style="font-size: 48px; opacity:0.1; display: block; margin-bottom: 16px;"></i>
        <p style="color: var(--text2);">No dishes found matches your search.</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map((item, index) => {
    const qty = getCartQty(item.id);
    return `
    <div class="menu-item ${item.available ? '' : 'unavailable'}" id="mi-${item.id}" style="animation-delay: ${index * 0.05}s">
      <span class="menu-item-emoji">${item.emoji}</span>
      <div class="item-category-tag">${item.category}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-desc">${item.desc}</div>
      <div class="item-bottom">
        <span class="item-price">₹${item.price}</span>
        <div class="item-actions">
          ${item.available ? (qty > 0 ? `
            <div class="qty-control-main">
              <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
              <span class="qty-label">${qty}</span>
              <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
            </div>
          ` : `<button class="btn-add" onclick="addToCart(${item.id})"><i class="fas fa-plus"></i></button>`) : '<span class="status-out">Out of Stock</span>'}
        </div>
      </div>
    </div>`;
  }).join('');
}

function getCartQty(id) {
  const item = cart.find(c => c.id === id);
  return item ? item.qty : 0;
}

// ===== CART =====
function addToCart(itemId) {
  const item = menuData.find(i => i.id === itemId);
  if (!item || !item.available) return;
  const existing = cart.find(c => c.id === itemId);
  if (existing) existing.qty++;
  else cart.push({...item, qty: 1});
  updateCartUI();
  updateMenuItemUI(itemId);
  showToast(`${item.emoji} ${item.name} added!`);
}

function updateCartUI() {
  const count = cart.reduce((s,c) => s + c.qty, 0);
  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.classList.remove('bump');
    void badge.offsetWidth; // Force reflow
    badge.classList.add('bump');
  }

  // Update hero wallet too
  updateHeroStats();
  const container = document.getElementById('cartItems');
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="ec-icon"><i class="fas fa-shopping-basket"></i></div>
        <p>Your basket is empty</p>
        <button class="btn-primary" onclick="toggleCart()" style="margin-top:20px; font-size:12px;">Start Shopping</button>
      </div>`;
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
        <span style="font-weight:700;min-width:20px;text-align:center;">${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.id},1)">+</button>
      </div>
    </div>
  `).join('');
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
    showToast("Item removed from cart");
  } else {
    showToast(delta > 0 ? "Quantity increased" : "Quantity decreased");
  }
  updateCartUI();
  updateMenuItemUI(id);
}

function updateMenuItemUI(id) {
  const item = menuData.find(m => m.id === id);
  if (!item) return;
  const qty = getCartQty(id);
  const itemEl = document.getElementById(`mi-${id}`);
  if (!itemEl) return;
  
  const actionsWrap = itemEl.querySelector('.item-actions');
  if (item.available) {
    if (qty > 0) {
      actionsWrap.innerHTML = `
        <div class="qty-control-main animate-pop">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-label">${qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>`;
    } else {
      actionsWrap.innerHTML = `<button class="btn-add animate-pop" onclick="addToCart(${item.id})"><i class="fas fa-plus"></i></button>`;
    }
  }
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('active');
}

// ===== CHECKOUT =====
function showCheckoutModal() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }
  toggleCart();
  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  document.getElementById('checkoutSummary').innerHTML = `
    <div style="background:var(--surface);border-radius:14px;padding:16px;margin-bottom:20px;">
      ${cart.map(c => `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">
        <span>${c.emoji} ${c.name} × ${c.qty}</span><span style="font-weight:600;">₹${c.price*c.qty}</span></div>`).join('')}
      <div style="display:flex;justify-content:space-between;padding:10px 0 0;font-weight:800;font-size:16px;color:var(--accent2);">
        <span>Total</span><span>₹${total}</span></div>
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
    id: 'ORD-' + Date.now().toString().slice(-4) + Math.floor(Math.random()*100),
    items: [...cart], total, payment: paymentMethod,
    paymentDone: paymentMethod !== 'offline',
    status: 'pending', time: new Date(),
    offlineDeadline: paymentMethod === 'offline' ? new Date(Date.now() + 10*60*1000) : null
  };
  orders.unshift(order);
  cart = [];
  updateCartUI();
  closeModal('checkoutModal');
  switchStudentTab('orders');
  showToast(`✅ ${order.id} placed successfully!`);
  shootConfetti();
}

// ===== STUDENT ORDERS =====
function renderStudentOrders() {
  const el = document.getElementById('studentOrdersList');
  if (orders.length === 0) {
    el.innerHTML = '<div class="glass-card" style="text-align:center;padding:48px;color:var(--text2);"><i class="fas fa-receipt" style="font-size:40px;margin-bottom:14px;display:block;opacity:0.25;"></i><p>No orders yet. Start ordering!</p></div>';
    return;
  }
  el.innerHTML = orders.map(o => {
    let timerHTML = '';
    if (o.payment === 'offline' && !o.paymentDone && o.offlineDeadline) {
      const remaining = Math.max(0, o.offlineDeadline - Date.now());
      const min = Math.floor(remaining/60000); const sec = Math.floor((remaining%60000)/1000);
      timerHTML = remaining > 0 ? `<div class="pay-timer"><i class="fas fa-clock"></i> Pay at counter in ${min}:${sec.toString().padStart(2,'0')}</div>` : `<div class="pay-timer">⚠️ Payment time expired!</div>`;
    }
    const statusLabel = {pending:'Pending',preparing:'Under Preparation',ready:'Ready to Collect',delivered:'Delivered'}[o.status] || o.status;
    return `<div class="order-card">
      <div class="order-top">
        <span class="order-id">${o.id}</span>
        <span class="order-time">${o.time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}</span>
        <span class="status-badge ${o.status}">${statusLabel}</span>
      </div>
      <div class="order-items-list">${o.items.map(i => `${i.emoji} ${i.name} × ${i.qty}`).join(' &nbsp;•&nbsp; ')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:700;font-size:16px;color:var(--accent2);">₹${o.total}</span>
        <span style="font-size:12px;color:var(--text2);">${o.payment === 'wallet' ? '💳 Wallet' : o.payment === 'online' ? '📱 Online' : '💵 Counter'}</span>
      </div>
      ${timerHTML}
    </div>`;
  }).join('');
}
setInterval(() => { if(currentRole === 'student') renderStudentOrders(); }, 5000);

// ===== STAFF =====
function renderStaffOrders() {
  const el = document.getElementById('staffOrdersList');
  if (orders.length === 0) {
    el.innerHTML = '<div class="glass-card" style="text-align:center;padding:40px;color:var(--text2);">No orders yet</div>';
    return;
  }
  const statusLabel = {pending:'Pending',preparing:'Under Preparation',ready:'Ready to Collect',delivered:'Delivered'};
  el.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-top">
        <span class="order-id">${o.id}</span>
        <span class="order-time">${o.time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}</span>
        <span class="status-badge ${o.status}">${statusLabel[o.status]||o.status}</span>
      </div>
      <div class="order-items-list">${o.items.map(i => `${i.emoji} ${i.name} × ${i.qty}`).join(' &nbsp;•&nbsp; ')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <span style="font-weight:700;">₹${o.total} <small style="color:var(--text2)">(${o.payment})</small></span>
        <div class="order-actions">
          ${o.status === 'pending'    ? `<button class="btn-sm btn-prepare"  onclick="updateOrderStatus('${o.id}','preparing')"><i class="fas fa-fire"></i> Start Prep</button>` : ''}
          ${o.status === 'preparing' ? `<button class="btn-sm btn-ready"    onclick="updateOrderStatus('${o.id}','ready')"><i class="fas fa-check"></i> Ready</button>` : ''}
          ${o.status === 'ready'     ? `<button class="btn-sm btn-delivered" onclick="updateOrderStatus('${o.id}','delivered')"><i class="fas fa-check-double"></i> Delivered</button>` : ''}
          ${o.status === 'delivered' ? '<span style="font-size:12px;color:var(--success)">✓ Completed</span>' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function updateOrderStatus(orderId, status) {
  const order = orders.find(o => o.id === orderId);
  if (order) { order.status = status; renderStaffOrders(); showToast(`${orderId} → ${status}`); }
}

function renderStaffMenu() {
  document.getElementById('staffMenuList').innerHTML = menuData.map(item => `
    <div class="manage-item">
      <div class="manage-left"><span class="emoji">${item.emoji}</span>
        <div><div class="manage-name">${item.name}</div><div class="manage-price">₹${item.price} • ${item.category}</div></div>
      </div>
      <label class="toggle-switch"><input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleAvailability(${item.id})"><span class="toggle-slider"></span></label>
    </div>
  `).join('');
}

function toggleAvailability(id) {
  const item = menuData.find(i => i.id === id);
  if (item) { item.available = !item.available; showToast(`${item.name} ${item.available ? '✅ available' : '❌ unavailable'}`); }
}

// ===== ADMIN =====
function renderAdminDashboard() {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s,o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  document.getElementById('adminStats').innerHTML = [
    {label:'Total Orders', value:totalOrders,    icon:'fa-receipt',            color:'var(--accent2)'},
    {label:'Revenue',      value:`₹${totalRevenue}`, icon:'fa-indian-rupee-sign', color:'var(--success)'},
    {label:'Pending',      value:pendingOrders,  icon:'fa-clock',              color:'var(--warning)'},
    {label:'Avg Order',    value:`₹${avgOrder}`, icon:'fa-chart-line',         color:'var(--accent3)'}
  ].map(s => `<div class="stat-card"><div class="stat-label"><i class="fas ${s.icon}" style="color:${s.color}"></i> ${s.label}</div><div class="stat-value">${s.value}</div></div>`).join('');

  // Pie Chart
  const itemCounts = {};
  orders.forEach(o => o.items.forEach(i => { itemCounts[i.name] = (itemCounts[i.name]||0) + i.qty; }));
  const labels = Object.keys(itemCounts).slice(0,6);
  const data = labels.map(l => itemCounts[l]);
  const colors = ['#6c63ff','#a78bfa','#22d3a4','#f59e0b','#f87171','#38bdf8'];

  const pieCtx = document.getElementById('pieChart');
  if (window.pieChartInstance) window.pieChartInstance.destroy();
  window.pieChartInstance = new Chart(pieCtx, {
    type:'doughnut',
    data:{labels, datasets:[{data: data.length ? data : [1], backgroundColor: data.length ? colors : ['#333'], borderWidth:0, hoverOffset:8}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#8888aa',font:{size:11}}}},cutout:'65%'}
  });

  // Bar Chart
  const hours = {};
  orders.forEach(o => { const h = o.time.getHours(); hours[h] = (hours[h]||0) + 1; });
  const hLabels = Object.keys(hours).sort((a,b)=>a-b).map(h => `${h}:00`);
  const hData   = Object.keys(hours).sort((a,b)=>a-b).map(h => hours[h]);

  const barCtx = document.getElementById('barChart');
  if (window.barChartInstance) window.barChartInstance.destroy();
  window.barChartInstance = new Chart(barCtx, {
    type:'bar',
    data:{labels: hLabels.length ? hLabels : ['No data'], datasets:[{data: hData.length ? hData:[0], backgroundColor:'rgba(108,99,255,0.5)', borderRadius:8, borderSkipped:false, hoverBackgroundColor:'rgba(167,139,250,0.75)'}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#8888aa'},grid:{display:false}},y:{ticks:{color:'#8888aa'},grid:{color:'rgba(255,255,255,0.04)'}}}}
  });

  // Orders table
  const tableEl = document.getElementById('adminOrdersList');
  if (orders.length === 0) { tableEl.innerHTML = '<p style="text-align:center;color:var(--text2);padding:20px;">No orders yet</p>'; return; }
  tableEl.innerHTML = `<table><thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Time</th></tr></thead><tbody>
    ${orders.slice(0,15).map(o => `<tr><td>${o.id}</td><td>${o.items.map(i=>i.name).join(', ')}</td><td>₹${o.total}</td><td>${o.payment}</td><td><span class="status-badge ${o.status}">${o.status}</span></td><td>${o.time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}</td></tr>`).join('')}
  </tbody></table>`;
}

function renderAdminMenu() {
  document.getElementById('adminMenuList').innerHTML = menuData.map(item => `
    <div class="manage-item">
      <div class="manage-left"><span class="emoji">${item.emoji}</span>
        <div><div class="manage-name">${item.name}</div><div class="manage-price">₹${item.price} • ${item.category}</div></div>
      </div>
      <label class="toggle-switch"><input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleAvailability(${item.id})"><span class="toggle-slider"></span></label>
    </div>
  `).join('');
}

function showAddDishModal() { openModal('addDishModal'); }

function addNewDish() {
  const name  = document.getElementById('newDishName').value.trim();
  const price = parseInt(document.getElementById('newDishPrice').value);
  const cat   = document.getElementById('newDishCat').value;
  const emoji = document.getElementById('newDishEmoji').value || '🍽️';
  const desc  = document.getElementById('newDishDesc').value.trim() || 'Delicious dish';
  if (!name || !price) { showToast('Please fill name and price'); return; }
  menuData.push({id:nextDishId++, name, price, category:cat, emoji, desc, available:true});
  closeModal('addDishModal');
  renderAdminMenu();
  showToast(`${emoji} ${name} added to menu!`);
  ['newDishName','newDishPrice','newDishEmoji','newDishDesc'].forEach(id => document.getElementById(id).value = '');
}

// ===== SEATS =====
function renderSeats() {
  const avail = seats.filter(s => !s.occupied).length;
  const occ   = seats.filter(s => s.occupied).length;
  document.getElementById('totalSeats').textContent = seats.length;
  document.getElementById('availSeats').textContent = avail;
  document.getElementById('occSeats').textContent   = occ;
  document.getElementById('seatingMap').innerHTML   = seats.map(s => `<div class="seat ${s.occupied ? 'taken' : 'free'}">${s.id}</div>`).join('');
  updateHeroStats();
}

function renderStaffSeats() {
  const avail = seats.filter(s => !s.occupied).length;
  const occ   = seats.filter(s => s.occupied).length;
  document.getElementById('staffTotalSeats').textContent = seats.length;
  document.getElementById('staffAvailSeats').textContent = avail;
  document.getElementById('staffOccSeats').textContent   = occ;
  document.getElementById('staffSeatingMap').innerHTML   = seats.map(s => `<div class="seat ${s.occupied ? 'taken' : 'free'}" onclick="toggleSeat(${s.id})">${s.id}</div>`).join('');
}

function toggleSeat(id) {
  const seat = seats.find(s => s.id === id);
  if (seat) { seat.occupied = !seat.occupied; renderStaffSeats(); showToast(`Seat ${id} → ${seat.occupied ? 'Occupied' : 'Available'}`); }
}

setInterval(() => {
  if (Math.random() > 0.8) {
    const idx = Math.floor(Math.random() * seats.length);
    seats[idx].occupied = !seats[idx].occupied;
    if (currentRole === 'student' && document.getElementById('studentSeatsTab').classList.contains('active')) renderSeats();
    if (currentRole === 'staff' && document.getElementById('staffSeatsTab').classList.contains('active')) renderStaffSeats();
  }
}, 12000);

// ===== WALLET =====
function showWalletModal() {
  document.getElementById('walletDispBal').textContent = walletBalance;
  openModal('walletModal');
}
function setAddAmount(amt) {
  document.getElementById('addMoneyAmt').value = amt;
}
function addMoney() {
  const amt = parseInt(document.getElementById('addMoneyAmt').value);
  if (!amt || amt <= 0) { showToast('Enter a valid amount'); return; }
  if (amt > 10000) { showToast('Max ₹10,000 at a time'); return; }
  walletBalance += amt;
  document.getElementById('walletBalance').textContent = walletBalance;
  document.getElementById('walletDispBal').textContent = walletBalance;
  document.getElementById('addMoneyAmt').value = '';
  updateHeroStats();
  showToast(`💰 ₹${amt} added to wallet!`);
  closeModal('walletModal');
}

// ===== MODALS =====
function openModal(id)  { document.getElementById(id).classList.add('active'); }
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
  const current = body.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcons(next);
}

function updateThemeIcons(theme) {
  document.querySelectorAll('.theme-toggle i, #themeIconFloating').forEach(icon => {
    if (theme === 'light') icon.classList.replace('fa-moon','fa-sun');
    else icon.classList.replace('fa-sun','fa-moon');
  });
}

// ===== CONFETTI =====
function shootConfetti() {
  const colors = ['#6c63ff', '#a78bfa', '#38bdf8', '#22d3a4', '#fbbf24'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = (Math.random() * 8 + 4) + 'px';
    el.style.height = el.style.width;
    el.style.animationDuration = (Math.random() * 2 + 1) + 's';
    el.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

// ===== INIT =====
(function initApp() {
  try {
    // Initial theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
    
    // Initial config
    loadCanteenConfig();
    
    // UI Setup
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        spawnParticles();
        updateCartUI();
      });
    } else {
      spawnParticles();
      updateCartUI();
    }
  } catch (err) {
    console.warn("Init Warning:", err);
  }
})();
