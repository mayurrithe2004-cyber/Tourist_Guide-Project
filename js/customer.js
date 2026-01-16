const LS = 'tg_pro_v4';
let state = JSON.parse(localStorage.getItem(LS)) || null;
if(!state){ alert('No demo data found. Open index.html and seed demo'); location.href='index.html'; }

let currentUser = JSON.parse(sessionStorage.getItem('tg_user')) || null;

function renderAuthArea(){
  const el = document.getElementById('authArea');
  if(!currentUser){
    el.innerHTML = `<div style="display:flex;gap:10px;align-items:center;justify-content:space-between">
      <div><strong>Welcome — please login</strong><div class="muted">Use demo user: user@demo.com / pass123</div></div>
      <div style="display:flex;gap:8px">
        <button class="btn" onclick="openLogin()">Login</button>
        <button class="btn" onclick="openRegister()">Register</button>
      </div></div>`;
  } else {
    el.innerHTML = `<div style="display:flex;gap:12px;align-items:center;justify-content:space-between">
      <div><strong>Hi, ${currentUser.name}</strong><div class="muted">${currentUser.email}</div></div>
      <div style="display:flex;gap:8px"><button class="btn" onclick="logout()">Logout</button></div>
    </div>`;
  }
}

function renderDestList(){
  const grid = document.getElementById('destList'); grid.innerHTML='';
  state.destinations.forEach(d=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<img src="${d.img||''}" style="width:100%;height:140px;object-fit:cover;border-radius:8px"><h4 style="margin:8px 0">${d.name} <span style="float:right;font-weight:700">₹${d.price}</span></h4><p class="muted">${d.location}</p><div style="margin-top:10px"><button class="btn" onclick="book('${d.id}')">Book</button> <button style="margin-left:8px" onclick="toWishlist(${d.id})">Wishlist</button></div>`;
    grid.appendChild(card);
  });
}

function renderBookings(){
  const el = document.getElementById('bookingList'); el.innerHTML='';
  if(!currentUser){ el.innerHTML = '<div class="muted">Login to see your bookings</div>'; return; }
  const bookings = state.bookings.filter(b=>b.touristId===currentUser.id);
  if(bookings.length===0) el.innerHTML='<div class="muted">No bookings</div>';
  else bookings.forEach(b=>{
    const d = state.destinations.find(x=>x.id===b.destinationId);
    const row = document.createElement('div'); row.style.marginBottom='8px';
    row.innerHTML = `<strong>${d.name}</strong><div class="muted">${b.travelDate} • ₹${b.amount}</div><div style="margin-top:6px"><button onclick="cancel(${b.id})" class="btn">Cancel</button></div>`;
    el.appendChild(row);
  });
}

function renderProfile(){
  const el = document.getElementById('profileArea'); el.innerHTML='';
  if(!currentUser){ el.innerHTML = '<div class="muted">Not signed in</div>'; return; }
  el.innerHTML = `<p><strong>${currentUser.name}</strong></p><p class="muted">${currentUser.email}</p><p class="muted">Bookings: ${currentUser.bookings.length}</p>`;
}

function renderWishlist(){
  const el = document.getElementById('wishArea'); el.innerHTML='';
  if(!currentUser){ el.innerHTML = '<div class="muted">Login to save wishlist</div>'; return; }
  const list = currentUser.wishlist || [];
  if(list.length===0) el.innerHTML = '<div class="muted">Wishlist empty</div>';
  else {
    list.forEach(id=>{
      const d = state.destinations.find(x=>x.id===id);
      const w = document.createElement('div'); w.style.marginBottom='8px';
      w.innerHTML = `<strong>${d.name}</strong><div class="muted">${d.location}</div><div style="margin-top:6px"><button class="btn" onclick="book(${d.id})">Book</button> <button style="margin-left:8px" onclick="removeWish(${d.id})">Remove</button></div>`;
      el.appendChild(w);
    });
  }
}

/* actions */
function openLogin(){
  const email = prompt('Email','user@demo.com'); if(!email) return;
  const pass = prompt('Password','pass123'); if(!pass) return;
  if(email===state.admin.email && pass===state.admin.pass){ alert('Admin login: redirecting'); location.href='admin.html'; return; }
  const u = state.users.find(x=>x.email===email && x.pass===pass);
  if(!u){ alert('Invalid credentials'); return; }
  currentUser = u; sessionStorage.setItem('tg_user', JSON.stringify(u));
  renderAll();
}
function openRegister(){
  const name = prompt('Full name'); if(!name) return;
  const email = prompt('Email'); if(!email) return;
  const pass = prompt('Password'); if(!pass) return;
  if(state.users.find(x=>x.email===email)){ alert('User exists'); return;}
  const id = Math.max(0,...state.users.map(x=>x.id))+1;
  const user = {id,name,email,pass,bookings:[],wishlist:[]};
  state.users.push(user); localStorage.setItem(LS, JSON.stringify(state));
  alert('Registered — please login'); openLogin();
}
function logout(){ sessionStorage.removeItem('tg_user'); currentUser = null; renderAll(); }
function book(destId){
  if(!currentUser){ alert('Please login to book'); openLogin(); return; }
  const date = prompt('Travel date (YYYY-MM-DD)'); if(!date) return;
  const qty = +prompt('Travelers (1)','1') || 1;
  const dest = state.destinations.find(x=>x.id===+destId);
  const id = Math.max(0,...state.bookings.map(x=>x.id||0))+1;
  const b = {id, touristId:currentUser.id, destinationId:dest.id, packageName:dest.name, bookingDate:new Date().toISOString().slice(0,10), travelDate:date, amount:dest.price*qty, qty};
  state.bookings.push(b);
  const u = state.users.find(x=>x.id===currentUser.id); u.bookings.push(id);
  localStorage.setItem(LS, JSON.stringify(state));
  sessionStorage.setItem('tg_user', JSON.stringify(u));
  currentUser = u;
  alert('Booked successfully'); renderAll();
}
function cancel(id){ if(!confirm('Cancel booking?')) return; state.bookings = state.bookings.filter(b=>b.id!==id); state.users.forEach(u=>u.bookings=u.bookings.filter(x=>x!==id)); localStorage.setItem(LS, JSON.stringify(state)); sessionStorage.setItem('tg_user', JSON.stringify(state.users.find(x=>x.id===currentUser.id))); currentUser = JSON.parse(sessionStorage.getItem('tg_user')); renderAll(); }
function toWishlist(id){ if(!currentUser){ alert('Please login'); openLogin(); return; } const u = state.users.find(x=>x.id===currentUser.id); u.wishlist = u.wishlist || []; if(!u.wishlist.includes(id)) u.wishlist.push(id); localStorage.setItem(LS, JSON.stringify(state)); sessionStorage.setItem('tg_user', JSON.stringify(u)); currentUser = u; renderAll(); }
function removeWish(id){ const u = state.users.find(x=>x.id===currentUser.id); u.wishlist = u.wishlist.filter(x=>x!==id); localStorage.setItem(LS, JSON.stringify(state)); sessionStorage.setItem('tg_user', JSON.stringify(u)); currentUser = u; renderAll(); }

function renderAll(){ renderAuthArea(); renderDestList(); renderBookings(); renderProfile(); renderWishlist(); }
renderAll();