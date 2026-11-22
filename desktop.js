const track = document.querySelector('.camera-track');
const stage = track.querySelector('.opening');
const art = stage.querySelector('.workbench');
const intro = stage.querySelector('.opening-copy');
const desktop = stage.querySelector('.screen-ui');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = value => Math.max(0, Math.min(1, value));
let pendingFrame = 0;
function paintCamera() {
  pendingFrame = 0;
  if (!track.classList.contains('active')) return;
  const width = stage.clientWidth, height = stage.clientHeight;
  const distance = track.offsetHeight - height;
  const progress = clamp((66 - track.getBoundingClientRect().top) / (distance * .76));
  const t = progress * progress * (3 - 2 * progress);
  const start = Math.max(width / 1672, height / 941);
  // Aim the camera at the painted screen in the source illustration.
  const end = Math.max(desktop.offsetWidth / 214, desktop.offsetHeight / 142);
  const scale = start * Math.pow(end / start, t);
  const fromX = (width - 1672 * start) * (width < 621 ? .81 : .5);
  const fromY = (height - 941 * start) * .5;
  const centerX = (1-t)*(fromX+1396*start) + t*width/2;
  const centerY = (1-t)*(fromY+527*start) + t*height/2;
  art.style.transform = 'translate('+(centerX-1396*scale)+'px,'+(centerY-527*scale)+'px) scale('+scale+')';
  const visibility = clamp((progress - .62) / .34);
  art.style.opacity = 1 - .94 * clamp((progress - .80) / .20);
  desktop.style.left = centerX+'px';
  desktop.style.top = centerY+'px';
  stage.style.setProperty('--desktop',visibility);
  stage.style.setProperty('--screen-scale',scale/end);
  stage.style.setProperty('--copy',1-clamp(progress/.38));
  desktop.inert = visibility < .96;
  intro.inert = progress > .39;
}
function scheduleCamera(){if(!pendingFrame) pendingFrame=requestAnimationFrame(paintCamera)}
function configureCamera(){
  track.classList.toggle('active',!motion.matches);
  if(motion.matches){desktop.inert=false;intro.inert=false;art.style.transform='';art.style.opacity=''}
  scheduleCamera();
}
intro.querySelector('.browse').addEventListener('click',event=>{
  if(!track.classList.contains('active')) return;
  event.preventDefault();
  const top = scrollY + track.getBoundingClientRect().top - 66 + (track.offsetHeight-stage.clientHeight)*.78;
  window.scrollTo({top,behavior:'instant'});
  paintCamera();
  desktop.querySelector('a').focus({preventScroll:true});
});
window.addEventListener('scroll',scheduleCamera,{passive:true});
new ResizeObserver(scheduleCamera).observe(stage);
motion.addEventListener('change',configureCamera);
configureCamera();
