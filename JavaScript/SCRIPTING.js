// ==========================================
// 1. MODO OSCURO / CLARO (Global)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (toggleButton) {
        // Cargar preferencia guardada o la del sistema al iniciar
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Aplicar el tema inicial
        htmlElement.setAttribute('data-theme', savedTheme);
        toggleButton.textContent = (savedTheme === 'dark') ? '☀️' : '🌙';

        // Evento para alternar modo al hacer clic
        toggleButton.addEventListener('click', () => {
            let currentTheme = htmlElement.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                toggleButton.textContent = '🌙';
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                toggleButton.textContent = '☀️';
            }
        });
    }



    // ==========================================
    // 2. INICIALIZAR REGISTRO DE GASTOS
    // ==========================================
    mostrarGastosGuardados();
    actualizarTotal();
});


// ==========================================
// 3. LÓGICA DE REGISTRO DE GASTOS
// ==========================================
const btnAgregar = document.getElementById('btnAgregar');
const listaRegistros = document.getElementById('listaGastos');
const montoRegistroInput = document.getElementById('montoRegistroInput');
const descripcionRegistroInput = document.getElementById('descripcionRegistroInput');
const btnReiniciar = document.getElementById('btnReiniciar'); 

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
    if (!listaRegistros) return;
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
    if (!listaRegistros) return;
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


// ==========================================
// 4. LÓGICA DE LA CALCULADORA 50/30/20
// ==========================================
const btnCalcular = document.getElementById('btnCalcular'); 
const montoInput = document.getElementById('montoInput'); 

const txtNecesidades = document.getElementById('txtNecesidades'); 
const txtGustos = document.getElementById('txtGustos');             
const txtAhorro = document.getElementById('txtAhorro'); 

if (btnCalcular && montoInput) {
    btnCalcular.addEventListener('click', () => {                                 
        // Leemos el número que puso el usuario (si está vacío, vale 0)
        let cantidadDinero = parseFloat(montoInput.value) || 0;       
        if (cantidadDinero < 0) {
            alert("Por favor, ingrese un monto válido (mayor o igual a 0).");
            cantidadDinero = 0; // Reiniciamos a 0 si es negativo
            montoInput.value = 0; // Actualizamos el input a 0
        }

        // Hacemos la matemática exacta del 50/30/20
        let necesidades = (cantidadDinero * 50) / 100;                               
        let gustos = (cantidadDinero * 30) / 100;                                 
        let ahorro = (cantidadDinero * 20) / 100;                                 

        // Imprimimos los resultados en pantalla con 2 decimales (si existen los elementos)
        if (txtNecesidades) txtNecesidades.textContent = necesidades.toFixed(2);          
        if (txtGustos) txtGustos.textContent = gustos.toFixed(2);                                 
        if (txtAhorro) txtAhorro.textContent = ahorro.toFixed(2);                                 
        
        // Animamos las barras superpuestas con un respiro de 10ms
        setTimeout(() => {
            const barraAhorro = document.getElementById('barraAhorro');
            const barraGustos = document.getElementById('barraGustos');
            const barraNecesidades = document.getElementById('barraNecesidades');

            if (cantidadDinero === 0) {
                if (barraAhorro) barraAhorro.style.width = '0%'; 
                if (barraGustos) barraGustos.style.width = '0%';  
                if (barraNecesidades) barraNecesidades.style.width = '0%'; 
            } else {    
                if (barraAhorro) barraAhorro.style.width = '100%'; 
                if (barraGustos) barraGustos.style.width = '70%';  
                if (barraNecesidades) barraNecesidades.style.width = '50%'; 
            }
        }, 10);
    });
}