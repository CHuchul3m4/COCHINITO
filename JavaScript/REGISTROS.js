const btnAgregar = document.getElementById('btnAgregar');
const listaRegistros = document.getElementById('listaGastos');
const montoRegistroInput = document.getElementById('montoRegistroInput');
const descripcionRegistroInput = document.getElementById('descripcionRegistroInput');
const btnReiniciar = document.getElementById('btnReiniciar'); 

// 1. Al cargar la página, recuperamos los gastos guardados y calculamos el total
document.addEventListener('DOMContentLoaded', () => {
    mostrarGastosGuardados();
    actualizarTotal();
});

if (btnAgregar && listaRegistros && montoRegistroInput && descripcionRegistroInput) {
    btnAgregar.addEventListener('click', () => {    
        let descripcion = descripcionRegistroInput.value.trim();
        let monto = parseFloat(montoRegistroInput.value);

        // Validamos que no esté vacío y que sea mayor a 0
        if (descripcion === "" || isNaN(monto) || monto <= 0) {
            alert("Por favor, ingrese una descripción y un monto válido (mayor a 0).");
            return; 
        }

        // Convertimos automáticamente el monto a negativo
        let gastoNegativo = -Math.abs(monto);

        // Creamos el objeto del gasto
        let gasto = {
            descripcion: descripcion,
            monto: gastoNegativo
        };

        // Guardamos en LocalStorage
        guardarGastoEnStorage(gasto);

        // Lo mostramos en pantalla
        agregarGastoAlDOM(gasto);

        // Actualizamos el total abajo
        actualizarTotal();

        // Limpiamos los inputs
        descripcionRegistroInput.value = '';
        montoRegistroInput.value = '';
        descripcionRegistroInput.focus();
    });
}

// Botón para reiniciar / borrar todo
if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
        if (confirm("¿Estás seguro de que quieres borrar todos los registros?")) {
            localStorage.removeItem('misGastos');
            listaRegistros.innerHTML = ''; 
            actualizarTotal(); // Reiniciamos el total a 0
        }
    });
}

// Función para pintar el gasto en la pantalla
function agregarGastoAlDOM(gasto) {
    const nuevoLi = document.createElement('li');
    
    nuevoLi.textContent = `${gasto.descripcion}: -$${Math.abs(gasto.monto).toFixed(2)}`;
    nuevoLi.style.color = "#d9534f"; // Color rojo para los gastos
    
    listaRegistros.appendChild(nuevoLi);
}

// Función para guardar en LocalStorage
function guardarGastoEnStorage(gasto) {
    let gastos = JSON.parse(localStorage.getItem('misGastos')) || [];
    gastos.push(gasto);
    localStorage.setItem('misGastos', JSON.stringify(gastos));
}

// Función para cargar los datos al iniciar la web
function mostrarGastosGuardados() {
    let gastos = JSON.parse(localStorage.getItem('misGastos')) || [];
    listaRegistros.innerHTML = ''; 
    gastos.forEach(gasto => {
        agregarGastoAlDOM(gasto);
    });
}

// Función para calcular y mostrar el total de los gastos abajo
function actualizarTotal() {
    let gastos = JSON.parse(localStorage.getItem('misGastos')) || [];
    let total = gastos.reduce((suma, g) => suma + g.monto, 0);
    
    const txtTotal = document.getElementById('txtTotalGastos');
    if (txtTotal) {
        txtTotal.textContent = Math.abs(total).toFixed(2);
    }
}