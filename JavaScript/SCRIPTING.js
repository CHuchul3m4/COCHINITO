// Capturamos los elementos del HTML
const btnCalcular = document.getElementById('btnCalcular'); 
const montoInput = document.getElementById('montoInput'); 

const txtNecesidades = document.getElementById('txtNecesidades'); 
const txtGustos = document.getElementById('txtGustos');           
const txtAhorro = document.getElementById('txtAhorro'); 



// Cuando den clic en calcular... (¡UNA SOLA VEZ!)
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

    // Imprimimos los resultados en pantalla con 2 decimales
    txtNecesidades.textContent = necesidades.toFixed(2);          
    txtGustos.textContent = gustos.toFixed(2);                    
    txtAhorro.textContent = ahorro.toFixed(2);                    
    
    // Animamos las barras superpuestas con un respiro de 10ms
    setTimeout(() => {
        if (cantidadDinero === 0) {
            document.getElementById('barraAhorro').style.width = '0%'; 
            document.getElementById('barraGustos').style.width = '0%';  
            document.getElementById('barraNecesidades').style.width = '0%'; 
        } else {    
        document.getElementById('barraAhorro').style.width = '100%'; 
        document.getElementById('barraGustos').style.width = '70%';  
        document.getElementById('barraNecesidades').style.width = '50%'; 
        }
    }, 10);
    

});

