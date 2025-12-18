const endTime = new Date(
  new Date().getFullYear(),
  11, // December (0-indexed)
  27,
  23,
  59,
  0
);

const drivers = [
'rose','tzuyu','jay','bang chan','winter','chaewon','sullyoon','lisa','sana','mingyu','mina','nayeon','jungwon','karina','vernon','jihyo','ning ning','jeongyeon','dino','felix'
];


// Build grid
drivers.forEach(name=>{
 const d=document.createElement('div');
 d.className='card';
 d.innerHTML=`<img src="media/driver-photos/${name}.png">`;
 d.onclick=()=>{
  document.querySelectorAll('.card').forEach(c=>c.classList.remove('selected'));
  d.classList.add('selected'); selected=name;
  document.getElementById('voteBtn').style.display='block';
 };
 
 grid.appendChild(d);
});

// Countdown
setInterval(()=>{
const t = END - new Date();
if(t <= 0){
countdown.innerHTML = 'VOTING CLOSED';
return;
}
const d = Math.floor(t / 86400000);
const h = Math.floor(t / 3600000) % 24;
const m = Math.floor(t / 60000) % 60;
const s = Math.floor(t / 1000) % 60;


countdown.innerHTML = `
<span class='countdown-unit'><div class='countdown-value'>${d}</div><div class='countdown-label'>days</div></span>:
<span class='countdown-unit'><div class='countdown-value'>${h}</div><div class='countdown-label'>hours</div></span>:
<span class='countdown-unit'><div class='countdown-value'>${m}</div><div class='countdown-label'>minutes</div></span>:
<span class='countdown-unit'><div class='countdown-value'>${s}</div><div class='countdown-label'>seconds</div></span>
`;
},1000);
// Vote
document.getElementById('voteBtn').onclick=async()=>{
 await fetch('/vote',{method:'POST',body:JSON.stringify({driver:selected})});
 document.getElementById('overlayImg').src=`media/completion-photos/${selected}.png`;
 document.getElementById('overlay').style.display='flex';
};

document.getElementById('towerCountdown').innerHTML =
  document.getElementById('countdown').innerHTML;

function closeOverlay(){ overlay.style.display='none' }

shareBtn.onclick=()=>{
 navigator.share({
  text:`I voted for ${selected}! Vote now at totallyascientist.com/vote`,
  url:'https://totallyascientist.com/vote'
 });
}

// Live tower
async function loadStats() {
  const res = await fetch('/stats', { cache: 'no-store' });
  const votes = await res.json();
  renderTower(votes);
}

function renderTower(stats) {
  if (!stats || typeof stats !== 'object') return;

  const entries = Object.entries(stats);

  entries.sort((a, b) => b[1] - a[1]);

  // render loop
}
function renderTower(votes) {
  const total = Object.values(votes).reduce((a,b)=>a+b,0) || 1;

  let entries = Object.keys(votes).map(id => ({
    id,
    pct: ((votes[id]/total)*100).toFixed(2)
  }));

  // Random order if all zero
  if (Object.values(votes).every(v=>v===0)) {
    entries.sort(()=>Math.random()-0.5);
  } else {
    entries.sort((a,b)=>b.pct - a.pct);
  }

  const list = document.getElementById('towerList');
  list.innerHTML = '';

  entries.forEach((e,i)=>{
    const row = document.createElement('div');
    row.className = 'tower-row';
    row.style.top = `${80 + i*24}px`;

    row.innerHTML = `
      <img src="/media/driver names/${e.id}.png" class="tower-name">
      <span class="tower-pct">${e.pct}%</span>
    `;
    list.appendChild(row);
  });
}

loadStats();

setInterval(loadStats, 3000);
