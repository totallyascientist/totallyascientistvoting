const END = new Date('2025-12-27T23:59:00Z');
const TOWER_END = new Date('2025-12-27T23:59:00Z');

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

  const html = `
    <span class="countdown-unit"><div class="countdown-value">${d}</div><div class="countdown-label">days</div></span> :
    <span class="countdown-unit"><div class="countdown-value">${h}</div><div class="countdown-label">hours</div></span> :
    <span class="countdown-unit"><div class="countdown-value">${m}</div><div class="countdown-label">minutes</div></span> :
    <span class="countdown-unit"><div class="countdown-value">${s}</div><div class="countdown-label">seconds</div></span>
  `;

  countdown.innerHTML = html;
}

setInterval(renderCountdown, 1000);
renderCountdown();

const towerCountdownEl = document.getElementById('towerCountdownSimple');

function updateTowerCountdown() {
  const now = new Date();
  let diff = TOWER_END - now;

  if (diff <= 0) {
    towerCountdownEl.textContent = 'VOTING CLOSED';
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  towerCountdownEl.innerHTML = `
    <div class="countdown-line">
      <span>${days}</span><span class="label">days</span> :
      <span>${hours}</span><span class="label">hours</span>
    </div>
    <div class="countdown-line">
      <span>${minutes}</span><span class="label">minutes</span> :
      <span>${seconds}</span><span class="label">seconds</span>
    </div>
`;

}

updateTowerCountdown();
setInterval(updateTowerCountdown, 1000);



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


function closeOverlay() {
  document.getElementById('overlay').style.display = 'none';
}

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
    row.style.top = `${142+ i * 54.6}px`;
    row.innerHTML = `
      <img src="media/driver-names/${e[0]}.png">
      <span>${e[1].toFixed(2)}%</span>
    `;
    towerData.appendChild(row);
  });
}

loadStats();
setInterval(loadStats, 3000);

















