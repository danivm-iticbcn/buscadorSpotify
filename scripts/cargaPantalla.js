const numElementos = document.querySelector('#num-elementos-busqueda');

const elementosArray = [8, 12, 16, 20, 24];

for (let num of elementosArray){
    const elemento = document.createElement('option');
    elemento.value = num;
    elemento.textContent = num;
    numElementos.appendChild(elemento);
}