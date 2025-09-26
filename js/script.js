
// Basic interactivity: nav toggle, years, and member search/local registration storage
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if(navToggle) navToggle.addEventListener('click', ()=>{ navList.style.display = navList.style.display === 'block' ? 'none' : 'block'; });

  // set years in footers
  const y = new Date().getFullYear();
  for(let i=1;i<10;i++){
    const el = document.getElementById('year'+i);
    if(el) el.textContent = y;
  }

  // dummy members dataset stored in localStorage if not present
  const key = 'rapi_members_v1';
  if(!localStorage.getItem(key)){
    const dummy = [
      {callsign:'YB1ABC', name:'Slamet', status:'Aktif', expires:'2026-08-01'},
      {callsign:'YB1XYZ', name:'Budi', status:'Non-aktif', expires:'2022-12-31'},
      {callsign:'YB1KDR', name:'Ani', status:'Akan Habis', expires:'2025-11-30'}
    ];
    localStorage.setItem(key, JSON.stringify(dummy));
  }

  // Populate members table on anggota.html
  const membersTable = document.querySelector('#membersTable tbody');
  const members = JSON.parse(localStorage.getItem(key) || '[]');
  if(membersTable){
    membersTable.innerHTML = members.map(m=>`<tr><td>${m.callsign}</td><td>${m.name}</td><td>${m.status}</td><td>${m.expires}</td></tr>`).join('');
  }

  // Search
  const searchBtn = document.getElementById('searchBtn');
  if(searchBtn){
    searchBtn.addEventListener('click', ()=>{
      const q = (document.getElementById('searchInput').value || '').trim().toUpperCase();
      const res = document.getElementById('result');
      const mem = members;
      const found = mem.filter(m => m.callsign.toUpperCase() === q);
      if(found.length){
        res.innerHTML = `<div class="card"><strong>${found[0].callsign}</strong> — ${found[0].name}<br>Status: ${found[0].status}<br>Masa berlaku: ${found[0].expires}</div>`;
      } else {
        res.innerHTML = `<div class="card">Callsign tidak ditemukan.</div>`;
      }
    });
  }

  // Registration form (stores to localStorage list 'rapi_registrations')
  const regForm = document.getElementById('regForm');
  if(regForm){
    regForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(regForm).entries());
      const regs = JSON.parse(localStorage.getItem('rapi_registrations') || '[]');
      data.submitted = new Date().toISOString();
      regs.push(data);
      localStorage.setItem('rapi_registrations', JSON.stringify(regs));
      alert('Pendaftaran tersimpan secara lokal. Untuk produksi, hubungkan form ini ke backend.');
      regForm.reset();
    });
  }
});
