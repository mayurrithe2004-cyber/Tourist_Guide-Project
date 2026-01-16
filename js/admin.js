/* Admin guards + state */
const LS = 'tg_pro_v4';
let state = JSON.parse(localStorage.getItem(LS)) || null;
if(!state){ alert('No demo data: please open index.html first to seed sample data.'); location.href='index.html'; }
(function auth(){
  // simple admin login prompt
  const email = prompt('Admin (demo) email','admin@admin.com');
  const pass = prompt('Password','admin123');
  if(email !== state.admin.email || pass !== state.admin.pass){ alert('Invalid admin — returning to site'); location.href='index.html'; }
  render('dashboard');
})();

function save(){localStorage.setItem(LS, JSON.stringify(state))}

function clearActive(){document.querySelectorAll('.menu a').forEach(a=>a.classList.remove('active'))}
function render(page){
  clearActive(); document.getElementById('mDash').classList.toggle('active', page==='dashboard');
  document.getElementById('mUsers').classList.toggle('active', page==='users');
  document.getElementById('mBookings').classList.toggle('active', page==='bookings');
  document.getElementById('mDests').classList.toggle('active', page==='destinations');
  const main = document.getElementById('main'); main.innerHTML = '';
  if(page==='dashboard'){
    const revenue = (state.bookings||[]).reduce((s,b)=>s+b.amount,0);
    main.innerHTML = `<div class="top"><h2>Dashboard</h2><div class="muted">Admin: ${state.admin.name}</div></div>
      <div class="stats">
        <div class="stat"><h3>Users</h3><p style="font-size:20px">${state.users.length}</p></div>
        <div class="stat"><h3>Bookings</h3><p style="font-size:20px">${state.bookings.length}</p></div>
        <div class="stat"><h3>Revenue</h3><p style="font-size:20px">₹${revenue.toLocaleString()}</p></div>
      </div>
      <div class="card"><h3>Recent Bookings</h3><div id="rb"></div></div>`;
    const recent = (state.bookings||[]).slice(-6).reverse();
    let t = '<table><thead><tr><th>Tourist</th><th>Package</th><th>Travel</th><th>Amount</th></tr></thead><tbody>';
    recent.forEach(b=>{
      const u = state.users.find(x=>x.id===b.touristId) || {name:'-'};
      t += `<tr><td>${u.name}</td><td>${b.packageName}</td><td>${b.travelDate}</td><td>₹${b.amount}</td></tr>`;
    });
    t += '</tbody></table>';
    document.getElementById('rb').innerHTML = t;
  }
  if(page==='users'){
    let html = '<h2>Users</h2><div class="card"><table><thead><tr><th>Name</th><th>Email</th><th>Bookings</th><th>Actions</th></tr></thead><tbody>';
    state.users.forEach(u=> html += `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.bookings.length}</td><td><button class="btn" onclick="viewUser(${u.id})">View</button></td></tr>`);
    html += '</tbody></table></div>'; main.innerHTML = html;
  }
  if(page==='bookings'){
    let html = '<h2>Bookings</h2><div class="card"><table><thead><tr><th>Tourist</th><th>Package</th><th>Travel</th><th>Amount</th><th>Action</th></tr></thead><tbody>';
    state.bookings.forEach(b=>{
      const u = state.users.find(x=>x.id===b.touristId) || {name:'-'};
      html += `<tr><td>${u.name}</td><td>${b.packageName}</td><td>${b.travelDate}</td><td>₹${b.amount}</td><td><button class="btn" onclick="deleteBooking(${b.id})">Delete</button></td></tr>`;
    });
    html += '</tbody></table></div>'; main.innerHTML = html;
  }
  if(page==='destinations'){
    let html = '<h2>Destinations</h2><div class="card"><table><thead><tr><th>Place</th><th>Location</th><th>Price</th><th>Action</th></tr></thead><tbody>';
    state.destinations.forEach(d=> html += `<tr><td>${d.name}</td><td>${d.location}</td><td>₹${d.price}</td><td><button class="btn" onclick="deleteDest(${d.id})">Delete</button></td></tr>`);
    html += '</tbody></table><div style="margin-top:12px"><button class="btn" onclick="addDest()">Add Destination</button></div></div>'; main.innerHTML = html;
  }
}

function viewUser(id){ const u = state.users.find(x=>x.id===id); alert(JSON.stringify(u,null,2)); }
function deleteBooking(id){ if(!confirm('Delete booking?')) return; state.bookings = state.bookings.filter(b=>b.id!==id); state.users.forEach(u=>u.bookings=u.bookings.filter(x=>x!==id)); save(); render('bookings'); }
function deleteDest(id){ if(!confirm('Delete destination (bookings removed)?')) return; state.destinations = state.destinations.filter(x=>x.id!==id); state.bookings = state.bookings.filter(b=>b.destinationId!==id); state.users.forEach(u=>u.bookings=u.bookings.filter(bid=>state.bookings.find(bb=>bb.id===bid))); save(); render('destinations'); }
function addDest(){ const name = prompt('Name'); if(!name) return; const loc = prompt('Location'); const price = +prompt('Price')||0; const id = Math.max(0,...state.destinations.map(x=>x.id))+1; state.destinations.push({id,name,location:loc,price,img:''}); save(); render('destinations'); }
function seedDemo(){ if(!confirm('Seed sample demo data? This resets local demo state.')) return; localStorage.removeItem(LS); alert('Reloading'); location.href='index.html'; }
function logout(){ location.href='index.html'; }