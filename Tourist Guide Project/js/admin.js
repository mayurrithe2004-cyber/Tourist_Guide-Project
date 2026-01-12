// Admin check
let state = JSON.parse(localStorage.getItem('tg_pro_v4'));
if(!state){ alert('No demo data found. Open index.html first'); location.href='index.html'; }

// Simple admin login prompt
(function auth(){
  const email = prompt('Admin email','admin@admin.com');
  const pass = prompt('Password','admin123');
  if(email!==state.admin.email || pass!==state.admin.pass){
    alert('Invalid admin — returning'); location.href='index.html';
  }
  render('dashboard');
})();

// Save state
function save(){ localStorage.setItem('tg_pro_v4', JSON.stringify(state)); }

// Menu active
function clearActive(){ document.querySelectorAll('.menu a').forEach(a=>a.classList.remove('active')); }

function render(page){
  clearActive();
  document.getElementById('mDash').classList.toggle('active', page==='dashboard');
  document.getElementById('mUsers').classList.toggle('active', page==='users');
  document.getElementById('mBookings').classList.toggle('active', page==='bookings');
  document.getElementById('mDests').classList.toggle('active', page==='destinations');
  
  const main = document.getElementById('main'); main.innerHTML='';

  if(page==='dashboard'){
    const revenue = state.bookings.reduce((s,b)=>s+b.totalPrice,0);
    main.innerHTML=`
      <h2>Dashboard</h2>
      <div class="stats">
        <div class="stat"><h3>Users</h3><p>${state.users.length}</p></div>
        <div class="stat"><h3>Bookings</h3><p>${state.bookings.length}</p></div>
        <div class="stat"><h3>Revenue</h3><p>₹${revenue.toLocaleString()}</p></div>
      </div>
    `;
  }

  if(page==='users'){
    let html = `<h2>Users</h2><div class="card"><table>
      <thead><tr><th>Name</th><th>Email</th><th>Bookings</th><th>Actions</th></tr></thead><tbody>`;
    state.users.forEach(u=>{
      html+=`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.bookings.length}</td>
      <td><button class="btn" onclick="viewUser(${u.id})">View</button></td></tr>`;
    });
    html+='</tbody></table></div>';
    main.innerHTML=html;
  }

  if(page==='bookings'){
    let html = `<h2>Bookings</h2><div class="card"><table>
      <thead><tr><th>Tourist</th><th>Package</th><th>Travel</th><th>Amount</th><th>Action</th></tr></thead><tbody>`;
    state.bookings.forEach(b=>{
      const u = state.users.find(x=>x.id===b.touristId) || {name:'-'};
      html+=`<tr>
        <td>${u.name}</td><td>${b.packageName}</td><td>${b.travelDate}</td><td>₹${b.totalPrice}</td>
        <td><button class="btn" onclick="deleteBooking(${b.id})">Delete</button></td>
      </tr>`;
    });
    html+='</tbody></table></div>';
    main.innerHTML=html;
  }

  if(page==='destinations'){
    let html=`<h2>Destinations</h2><div class="card"><table>
      <thead><tr><th>Name</th><th>Location</th><th>Price</th><th>Action</th></tr></thead><tbody>`;
    state.destinations.forEach(d=>{
      html+=`<tr>
        <td>${d.name}</td><td>${d.location}</td><td>₹${d.price}</td>
        <td><button class="btn" onclick="deleteDest(${d.id})">Delete</button></td>
      </tr>`;
    });
    html+=`</tbody></table>
      <button class="btn" onclick="addDest()">Add Destination</button>
    </div>`;
    main.innerHTML=html;
  }
}

// Admin actions
function viewUser(id){ alert(JSON.stringify(state.users.find(u=>u.id===id),null,2)); }
function deleteBooking(id){ if(!confirm('Delete booking?')) return;
  state.bookings = state.bookings.filter(b=>b.id!==id);
  state.users.forEach(u=>u.bookings=u.bookings.filter(bid=>bid!==id));
  save(); render('bookings');
}
function deleteDest(id){ if(!confirm('Delete destination & related bookings?')) return;
  state.destinations = state.destinations.filter(d=>d.id!==id);
  state.bookings = state.bookings.filter(b=>b.destinationId!==id);
  state.users.forEach(u=>u.bookings=u.bookings.filter(bid=>state.bookings.find(bb=>bb.id===bid)));
  save(); render('destinations');
}
function addDest(){
  const name = prompt('Place name'); if(!name) return;
  const location = prompt('Location'); if(!location) return;
  const price = +prompt('Price')||0;
  const id = Math.max(0,...state.destinations.map(d=>d.id))+1;
  state.destinations.push({id,name,location,price,img:''});
  save(); render('destinations');
}
function seedDemo(){ if(!confirm('Reset and seed demo data?')) return; localStorage.removeItem('tg_pro_v4'); alert('Reloading'); location.href='index.html'; }
function logout(){ location.href='index.html'; }
