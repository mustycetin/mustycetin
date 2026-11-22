const board = document.querySelector('.demo-board');
const action = document.querySelector('.clear-row');
const initialLabel = action.textContent;
let cleared = false;
for (let i = 0; i < 81; i++) {
  const cell = document.createElement('i');
  if (i >= 54 && i < 62) cell.className = 'row';
  else if (i === 62) cell.className = 'gap';
  else if ([67,68,69,76,78,79,80,45,46,47,36].includes(i)) cell.className = 'filled';
  board.append(cell);
}
function toggleRow() {
  cleared = !cleared;
  board.classList.toggle('cleared', cleared);
  action.textContent = cleared ? (document.documentElement.lang === 'tr' ? 'Tekrar dene' : 'Try again') : initialLabel;
}
action.onclick = toggleRow;
board.querySelector('.gap').onclick = toggleRow;
