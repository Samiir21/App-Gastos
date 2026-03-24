const STORAGE_KEY = 'appGastosData';

const descripcionEl = document.getElementById('descripcion');
const montoEl = document.getElementById('monto');
const listaEl = document.getElementById('lista');
const totalEl = document.getElementById('total');
const agregarBtn = document.getElementById('agregar');

let gastos = [];

function guardarGastos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gastos));
}

function cargarGastos() {
  const datos = localStorage.getItem(STORAGE_KEY);
  if (!datos) return;

  try {
    const parsed = JSON.parse(datos);
    if (Array.isArray(parsed)) {
      gastos = parsed.map((gasto) => ({
        descripcion: String(gasto.descripcion),
        monto: Number(gasto.monto),
      })).filter((g) => g.descripcion && !isNaN(g.monto));
    }
  } catch (error) {
    console.warn('No se pudo parsear localStorage:', error);
  }
}

function calcularTotal() {
  const total = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);
  totalEl.innerText = total.toFixed(2);
}

function renderizarGastos() {
  listaEl.innerHTML = '';

  if (gastos.length === 0) {
    const vacio = document.createElement('p');
    vacio.className = 'sin-gastos';
    vacio.innerText = 'No hay gastos registrados aún.';
    listaEl.appendChild(vacio);
    return;
  }

  gastos.forEach((gasto, idx) => {
    const item = document.createElement('div');
    item.className = 'gasto-item';

    const texto = document.createElement('span');
    texto.innerText = gasto.descripcion;

    const monto = document.createElement('span');
    monto.innerText = `$${gasto.monto.toFixed(2)}`;

    const eliminar = document.createElement('button');
    eliminar.className = 'eliminar';
    eliminar.dataset.index = String(idx);
    eliminar.innerText = 'Eliminar';

    item.appendChild(texto);
    item.appendChild(monto);
    item.appendChild(eliminar);

    listaEl.appendChild(item);
  });
}

function mostrarError(mensaje) {
  const existente = document.querySelector('.error-msg');
  if (existente) existente.remove();

  const errorEl = document.createElement('p');
  errorEl.className = 'error-msg';
  errorEl.innerText = mensaje;
  listaEl.parentElement.insertBefore(errorEl, listaEl);

  setTimeout(() => {
    if (errorEl.parentElement) errorEl.remove();
  }, 2500);
}

function agregarGasto() {
  const descripcion = descripcionEl.value.trim();
  const monto = parseFloat(montoEl.value);

  if (!descripcion || isNaN(monto) || monto <= 0) {
    mostrarError('Ingresa descripción y monto válidos mayor a 0.');
    return;
  }

  gastos.push({ descripcion, monto });
  descripcionEl.value = '';
  montoEl.value = '';

  guardarGastos();
  renderizarGastos();
  calcularTotal();
}

function eliminarGasto(index) {
  gastos.splice(index, 1);
  guardarGastos();
  renderizarGastos();
  calcularTotal();
}

listaEl.addEventListener('click', (event) => {
  if (event.target.matches('.eliminar')) {
    eliminarGasto(Number(event.target.dataset.index));
  }
});

agregarBtn.addEventListener('click', agregarGasto);

// Carga inicial
cargarGastos();
renderizarGastos();
calcularTotal();
