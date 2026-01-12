document.getElementById('searchInput').addEventListener('keyup', function(e){
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('.place-card').forEach(card=>{
    const name = card.dataset.name.toLowerCase();
    card.style.display = name.includes(q) ? 'block' : 'none';
  });
});

document.getElementById('searchBtn').addEventListener('click', function(){
  const q = document.getElementById('searchInput').value.trim();
  alert('Search preview: ' + q + '\n(Open console to implement full search behaviour)');
});
