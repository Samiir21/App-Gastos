const descripcionEl = document.getElementById('descripcion');
const montoEl = document.getElementById('monto');
const listaEl = document.getElementById('lista');
const totalEl = document.getElementById('total');
const agregarBtn = document.getElementById('agregar');

let gastos = [];

function calcularTotal() {
  const total = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);
  totalEl.innerText = total.toFixed(2);
}

function renderizarGastos() {
  listaEl.innerHTML = '';
  gastos.forEach((gasto, idx) => {
    const item = document.createElement('div');
    item.className = 'gasto-item';
    item.innerHTML = `
      <span>${gasto.descripcion}</span> 
      <span>$${gasto.monto.toFixed(2)}</span>
      <button data-index="${idx}" class="eliminar">X</button>
    `;
    listaEl.appendChild(item);
  });
}

function agregarGasto() {
  const descripcion = descripcionEl.value.trim();
  const monto = parseFloat(montoEl.value);

  if (!descripcion || isNaN(monto) || monto <= 0) {
    alert('Ingresa descripción y monto válidos');
    return;
  }

  gastos.push({ descripcion, monto });
  descripcionEl.value = '';
  montoEl.value = '';

  renderizarGastos();
  calcularTotal();
}

function eliminarGasto(index) {
  gastos.splice(index, 1);
  renderizarGastos();
  calcularTotal();
}

listaEl.addEventListener('click', (event) => {
  if (event.target.matches('.eliminar')) {
    eliminarGasto(Number(event.target.dataset.index));
  }
});

agregarBtn.addEventListener('click', agregarGasto);
