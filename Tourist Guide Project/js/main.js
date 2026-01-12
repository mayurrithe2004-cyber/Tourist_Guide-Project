/* ----------------- Shared state (localStorage) ----------------- */

// FORCE reset localStorage for demo purposes
localStorage.removeItem('tg_pro_v4');
const LS = 'tg_pro_v4';
const sampleState = {
  admin:{email:'admin@admin.com',pass:'admin123',name:'Administrator'},
  users:[{id:1,name:'Demo User',email:'user@demo.com',pass:'pass123',mobile:'9876543210',bookings:[],wishlist:[]}],
  destinations:[
    {id:1,name:'Goa',location:'Goa, India',price:18000,desc:'Sandy beaches, nightlife & seafood',tags:['Beach','Relax'],img:'https://images.unsplash.com/photo-1548013146-72479768bada'},
  {id:2,name:'Taj Mahal',location:'Agra, India',price:8500,desc:'Iconic Mughal monument',tags:['Historical'],img:'https://images.unsplash.com/photo-1564507592333-c60657eea523'},
  {id:3,name:'Manali',location:'Himachal Pradesh',price:15000,desc:'Himalayan adventure & skiing',tags:['Mountains','Adventure'],img:'https://images.unsplash.com/photo-1501785888041-af3ef285b470'},
  {id:4,name:'Udaipur',location:'Rajasthan',price:12500,desc:'Palaces, lakes & royal heritage',tags:['Heritage','Romantic'],img:'https://images.unsplash.com/photo-1549880338-65ddcdfd017b'},
  {id:5,name:'Kerala Backwaters',location:'Kerala',price:22000,desc:'Houseboat cruises & spice tours',tags:['Cruise','Nature'],img:'https://images.unsplash.com/photo-1526772662000-3f88f10405ff'},
  {id:6,name:'Goa - North',location:'Goa',price:17000,desc:'Beaches & water sports',tags:['Beach','Adventure'],img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'},
  {id:7,name:'Shimla',location:'Himachal Pradesh, India',price:14000,desc:'Hill station, snow & trekking',tags:['Mountains','Adventure'],img:'https://images.unsplash.com/photo-1601758123927-215183b2c7c1'},
  {id:8,name:'Jaipur',location:'Rajasthan, India',price:13000,desc:'Pink city, forts & culture',tags:['Heritage','Culture'],img:'https://images.unsplash.com/photo-1595295514093-c935d66b98d1'},
  {id:9,name:'Darjeeling',location:'West Bengal, India',price:15000,desc:'Tea gardens & mountain views',tags:['Nature','Relax'],img:'https://images.unsplash.com/photo-1549880338-65ddcdfd017b'},
  {id:10,name:'Mysore',location:'Karnataka, India',price:9000,desc:'Palaces & historical spots',tags:['Heritage','Culture'],img:'https://images.unsplash.com/photo-1526772662000-3f88f10405ff'},
  {id:11,name:'Andaman Islands',location:'Andaman & Nicobar',price:25000,desc:'Beaches, scuba diving & nature',tags:['Beach','Adventure'],img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'},
  {id:12,name:'Coorg',location:'Karnataka, India',price:12000,desc:'Coffee plantations & trekking',tags:['Nature','Adventure'],img:'https://images.unsplash.com/photo-1501785888041-af3ef285b470'},
  {id:13,name:'Leh-Ladakh',location:'Jammu & Kashmir, India',price:30000,desc:'High mountains & biking',tags:['Mountains','Adventure'],img:'https://images.unsplash.com/photo-1564507592333-c60657eea523'},
  {id:14,name:'Rishikesh',location:'Uttarakhand, India',price:10000,desc:'River rafting & yoga',tags:['Adventure','Relax'],img:'https://images.unsplash.com/photo-1549880338-65ddcdfd017b'},
  {id:15,name:'Varanasi',location:'Uttar Pradesh, India',price:8000,desc:'Spiritual city & culture',tags:['Culture','Heritage'],img:'https://images.unsplash.com/photo-1526772662000-3f88f10405ff'}
  ],
  bookings:[]
};
let state = JSON.parse(localStorage.getItem(LS)) || sampleState;
localStorage.setItem(LS, JSON.stringify(state));

/* ----------------- Carousel ----------------- */
let cur = 0;
const slides = document.getElementById('slides');
const slideCount = slides.children.length;
const dots = document.getElementById('dots');
for(let i=0;i<slideCount;i++){
  const d = document.createElement('div'); d.className='dot'; if(i===0) d.classList.add('active');
  d.addEventListener('click',()=>goTo(i));
  dots.appendChild(d);
}
function goTo(i){cur=i;slides.style.transform=`translateX(-${i*100}%)`; updateDots()}
function updateDots(){[...dots.children].forEach((d,idx)=>d.classList.toggle('active', idx===cur))}
setInterval(()=>{cur=(cur+1)%slideCount;goTo(cur)},4500);

/* ----------------- Render Places ----------------- */
function renderPlaces(){
  const grid = document.getElementById('placesGrid'); grid.innerHTML='';
  state.destinations.forEach(d=>{
    const card = document.createElement('article'); card.className='place-card';
    card.innerHTML = `
      <img class="place-img" src="${d.img}" alt="${d.name}">
      <div class="place-body">
        <h3 style="margin:0">${d.name} <span style="float:right;font-weight:700">₹${d.price.toLocaleString()}</span></h3>
        <p class="muted" style="margin-top:6px">${d.location} • ${d.desc}</p>
        <div class="tags">${d.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="btn" onclick="quickBook(${d.id})">Book Now</button>
          <button style="background:#eef6ff;color:var(--accent-2)" onclick="toggleWishlist(${d.id})">Wishlist</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
renderPlaces();

/* ----------------- Search ----------------- */
function doSearch(){
  const q = document.getElementById('globalSearch').value.toLowerCase();
  document.querySelectorAll('.place-card').forEach(card=>{
    card.style.display = card.innerText.toLowerCase().includes(q) ? 'block' : 'none';
  });
}

/* ----------------- Modals ----------------- */
function openModal(name){document.getElementById(name+'Modal').style.display='flex'}
function closeModal(name){document.getElementById(name+'Modal').style.display='none'}

/* ----------------- Login / Register ----------------- */
function doLogin(){
  const e=document.getElementById('loginEmail').value.trim(),p=document.getElementById('loginPass').value.trim();
  if(e===state.admin.email && p===state.admin.pass){ alert('Admin login'); location.href='admin.html'; return;}
  const u=state.users.find(u=>u.email===e && u.pass===p);
  if(!u){ alert('Invalid credentials'); return; }
  sessionStorage.setItem('tg_user', JSON.stringify(u));
  alert('Login success'); location.href='customer.html';
}
function doRegister(){
  const name=document.getElementById('regName').value.trim();
  const email=document.getElementById('regEmail').value.trim();
  const pass=document.getElementById('regPass').value.trim();
  if(!name || !email || !pass){ alert('Please fill all fields'); return;}
  if(state.users.find(u=>u.email===email)){ alert('User exists'); return; }
  const id = Math.max(0,...state.users.map(u=>u.id))+1;
  const newUser={id,name,email,pass,bookings:[],wishlist:[]};
  state.users.push(newUser); localStorage.setItem(LS, JSON.stringify(state));
  alert('Registered — now login'); closeModal('register'); openModal('login');
}

/* ----------------- Quick Book / Wishlist ----------------- */
function quickBook(destId){
  const user=JSON.parse(sessionStorage.getItem('tg_user'));
  if(!user){ if(confirm('Login to book?')) location.href='customer.html'; return;}
  const date = prompt('Travel date (YYYY-MM-DD)'); if(!date) return;
  const qty = +prompt('Travelers (1)','1')||1;
  const dest = state.destinations.find(d=>d.id===destId);
  const id=Math.max(0, ...(state.bookings||[]).map(b=>b.id)) +1;
  const booking={id,touristId:user.id,destinationId:destId,packageName:dest.name,bookingDate:new Date().toISOString().slice(0,10),travelDate:date,travellers:qty,totalPrice:dest.price*qty,status:'Booked'};
  state.bookings.push(booking); localStorage.setItem(LS, JSON.stringify(state));
  alert(`Booked ${dest.name} for ${qty} traveler(s) on ${date}`);
}
function toggleWishlist(destId){
  const user=JSON.parse(sessionStorage.getItem('tg_user'));
  if(!user){ alert('Login to add to wishlist'); return; }
  user.wishlist = user.wishlist || [];
  if(user.wishlist.includes(destId)){ user.wishlist=user.wishlist.filter(id=>id!==destId); alert('Removed from wishlist'); }
  else{ user.wishlist.push(destId); alert('Added to wishlist'); }
  sessionStorage.setItem('tg_user', JSON.stringify(user));
}
