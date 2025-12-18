const END = new Date('2025-12-27T23:59:00Z');

const drivers = [
  'rose','tzuyu','jay','bang chan','winter','chaewon','sullyoon','lisa',
  'sana','mingyu','mina','nayeon','jungwon','karina','vernon','jihyo',
  'ning ning','jeongyeon','dino','felix'
];

let selected = null;

const grid = document.getElementById('grid');
const countdown = document.getElementById('countdown');
const towerCountdown = document.getElementById('towerCountdown');
const towerData = document.getElementById('towerData');

/* GRID */
drivers.forEach(name => {
  const d = document.createElement('div');
  d.className = 'card';
  d.innerHTML = `<img src="media/driver-photos/${name}.png">`;
  d.onclick = () => {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    d.classList.add('selected');
    selected = name;
    document.getElementById('voteBtn').style.display = 'block';
  };
  grid.appendChild(d);
});

/* COUNTDOWN */
function renderCountdown() {
  const t = END - new Date();
  if (t <= 0) {
    countdown.innerHTML = 'VOTING CLOSED';
    towerCountdown.innerHTML = 'VOTING CLOSED';
    return;
  }

  const d = Math.floor(t / 86400000);
  const h = Math.floor(t / 3600000) % 24;
  const m = Math.floor(t / 60000) % 60;
  const s = Math.floor(t / 1000) % 60;

  const towerHtml = `${d}d : ${h}h : ${m}m : ${s}s`;
  towerCountdown.innerHTML = towerHtml;

  countdown.innerHTML = html;
  towerCountdown.innerHTML = html;
}

setInterval(renderCountdown, 1000);
renderCountdown();

/* VOTE */
document.getElementById('voteBtn').onclick = async () => {
  if (!selected) return;

  await fetch('/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driver: selected })
  });

  document.getElementById('overlayImg').src = `media/completion-photos/${selected}.png`;
  document.getElementById('overlay').style.display = 'flex';
  loadStats();
};

function closeOverlay() {
  document.getElementById('overlay').style.display = 'none';
}

shareBtn.onclick = async () => {
  if (!selected) return;

  const imageUrl = `media/completion-photos/${selected}.png`;
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  const file = new File([blob], `${selected}.png`, { type: blob.type });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      text: `I voted for ${selected}! Vote now at totallyascientist.com/vote`,
      url: 'https://totallyascientist.com/vote'
    });
  } else {
    alert('Sharing images is not supported on this device.');
  }
};


/* TOWER */
async function loadStats() {
  const res = await fetch('/stats', { cache: 'no-store' });
  const votes = await res.json();
  renderTower(votes);
}

function renderTower(votes) {
  towerData.innerHTML = '';

  let entries = Object.entries(votes);

  const allZero = entries.every(e => e[1] === 0);
  if (allZero) entries.sort(() => Math.random() - 0.5);
  else entries.sort((a,b) => b[1] - a[1]);

  entries.forEach((e,i) => {
    const row = document.createElement('div');
    row.className = 'towerRow';
    row.style.top = `${95 + i * 26}px`; // +15px start, proper spacing
    row.innerHTML = `
      <img src="media/driver-names/${e[0]}.png">
      <span>${e[1].toFixed(2)}%</span>
    `;
    towerData.appendChild(row);
  });
}

loadStats();
setInterval(loadStats, 3000);

