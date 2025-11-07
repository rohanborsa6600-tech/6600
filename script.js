// script.js — simple projects list that opens submodule folders (relative)
const projects = [
  { name: "Gita-new", path: "./Gita-new/", desc: "Gita bhashy / explanation site" },
  { name: "Offline-Sthalpothi-", path: "./Offline-Sthalpothi-/", desc: "Sthalpothi offline reader" },
  { name: "Sumanmala1", path: "./Sumanmala1/", desc: "Sumanmala collection" },
  { name: "Geeta-", path: "./Geeta-/", desc: "Geeta path" },
  { name: "Sutrapath-", path: "./Sutrapath-/", desc: "Sutrapath reader" },
  { name: "ASHTAK", path: "./ASHTAK/", desc: "ASHTAK project" }
];

const grid = document.getElementById('projectsGrid');

function makeCard(p){
  const a = document.createElement('a');
  a.className = 'card';
  a.href = p.path;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.innerHTML = `
    <div class="meta">
      <div class="favicon" aria-hidden="true">${p.name.slice(0,2).toUpperCase()}</div>
      <div style="flex:1">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
      </div>
      <div class="chev">›</div>
    </div>
    <div class="row">
      <span class="tag">Local</span>
      <span class="tag">Submodule</span>
      <span class="tag">Open</span>
    </div>
  `;
  return a;
}

function render(){
  grid.innerHTML = '';
  projects.forEach(p => grid.appendChild(makeCard(p)));
}

// buttons
document.getElementById('refreshBtn').addEventListener('click', ()=>{
  render();
  // tiny feedback
  const b = document.getElementById('refreshBtn');
  b.textContent = '⟳';
  setTimeout(()=> b.textContent = '⟳', 550);
});

document.getElementById('openAll').addEventListener('click', ()=>{
  if (!projects.length) return;
  // open first project to keep it useful on small devices
  window.open(projects[0].path, '_blank');
});

// initial
render();
