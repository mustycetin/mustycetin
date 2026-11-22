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
  } else {
    const icon = product.querySelector('.detail-title img').cloneNode();
    icon.alt = '';
    reel.append(icon);
  }
  product.querySelector('.shots').prepend(reel);
}
const mascot = document.querySelector('#mascot');
document.querySelector('.pitch').append(mascot);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let x = -60, y = -60, targetX, targetY, frame;
function follow() {
  x += (targetX - x) * .18;
  y += (targetY - y) * .18;
  mascot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  frame = Math.abs(targetX-x) + Math.abs(targetY-y) > .7 ? requestAnimationFrame(follow) : 0;
}
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || reduced.matches || !matchMedia('(pointer:fine)').matches) return;
  targetX = Math.min(innerWidth - 30, event.clientX + 18);
  targetY = Math.min(innerHeight - 28, event.clientY + 18);
  if (!frame) follow();
}, {passive:true});
window.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || reduced.matches) return;
  const host = event.target.closest('.portfolio-card,.app-detail,.feature,.pitch');
  if (!host) return;
  host.style.position = 'relative';
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
