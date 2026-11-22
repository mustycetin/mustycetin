// Add a YouTube watch or Shorts URL under its product ID when a trailer is ready.
const trailerUrls = {};
for (const product of document.querySelectorAll('.app-detail')) {
  const reel = document.createElement('div');
  reel.className = 'reel poster';
  const link = trailerUrls[product.id];
  if (link) {
    const url = new URL(link);
    const id = url.searchParams.get('v') || url.pathname.split('/').pop();
    const player = document.createElement('iframe');
    player.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id);
    player.loading = 'lazy';
    player.title = product.querySelector('h2').textContent + ' trailer';
    player.allowFullscreen = true;
    reel.classList.remove('poster');
    reel.append(player);
  } else continue; // The portrait screenshot gallery occupies this space until a trailer exists.
  product.querySelector('.shots').prepend(reel);
}
const mascot = document.querySelector('#mascot');
const productLinks = [...document.querySelectorAll('.picker a')];
function selectProduct(hash) {
  const active = productLinks.find(link => link.hash === hash);
  if (!active) return;
  for (const link of productLinks) {
    const selected = link === active;
    document.getElementById(link.hash.slice(1)).hidden = !selected;
    link.setAttribute('aria-current', String(selected));
  }
}
selectProduct(productLinks.some(link => link.hash === location.hash) ? location.hash : productLinks[0].hash);
for (const link of productLinks) {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.replaceState(null, '', link.hash);
    selectProduct(link.hash);
  });
}
window.addEventListener('hashchange', () => selectProduct(location.hash));
document.querySelector('.pitch').append(mascot);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let x = -60, y = -60, targetX, targetY, frame;
function follow() {
  x += (targetX - x) * .18;
  y += (targetY - y) * .18;
  const tilt = Math.max(-14, Math.min(14, (targetX - x) * .18));
  mascot.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + tilt + 'deg)';
  frame = Math.abs(targetX-x) + Math.abs(targetY-y) > .7 ? requestAnimationFrame(follow) : 0;
}
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || reduced.matches || !matchMedia('(pointer:fine)').matches) return;
  targetX = Math.min(innerWidth - 46, event.clientX + 18);
  targetY = Math.min(innerHeight - 46, event.clientY + 18);
  if (!frame) follow();
}, {passive:true});
window.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || reduced.matches) return;
  const host = event.target.closest('.portfolio-card,.app-detail,.feature,.pitch');
  if (!host) return;
  host.append(mascot);
  mascot.animate([{scale:'.75',rotate:'-12deg'},{scale:'1.15',rotate:'10deg'},{scale:'1'}],{duration:360});
}, {passive:true});
const studioWindow = document.querySelector('.studio-window');
function updateWindow() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  studioWindow.dataset.period = hour < 6 || hour >= 21 ? 'night' : hour < 10 ? 'morning' : hour < 17 ? 'day' : 'evening';
  const arc = Math.cos((hour - 13) * Math.PI / 15);
  studioWindow.style.setProperty('--altitude', (22 - 12 * arc) + '%');
}
updateWindow();
setInterval(updateWindow, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateWindow(); });
