const inputCuenta = document.querySelector("#cuenta");
const inputPersonas = document.querySelector("#personas");
const inputCustom = document.querySelector("#propina");
const btnsPropina = document.querySelectorAll(".propina-btns button");
const propinaSpan = document.querySelector(".propina-persona .cantidad");
const totalSpan = document.querySelector(".total-persona .cantidad");
const btnReiniciar = document.querySelector(".btn-reset");

document.addEventListener("DOMContentLoaded", () => {
    deshabilitar();
})

const datos = {
    cuenta: "",
    personas: "",
    propina: "",
}

inputCuenta.addEventListener("input", validar);
inputPersonas.addEventListener("input", validar);
inputCustom.addEventListener("input", validar);
btnReiniciar.addEventListener("click", () => {
    deshabilitar(true);
});

function validar(e) {
    if(e.target.value.trim() === "") {
        deshabilitar();
        if(e.target.id === "propina") { // Como su estructura html del input propina no es igual a los de los otros 2, llamamos a la funcion pasandole otro div padre para que pueda colocar el error al lado del label
            mostrarAlerta("It cannot be empty", e.target.parentElement.parentElement, e.target);
            return;
        }

        mostrarAlerta("It cannot be empty", e.target.parentElement, e.target);

        return;
    } else if(isNaN(e.target.value)) { 
        deshabilitar();
        if(e.target.id === "propina") {
            mostrarAlerta("It's not a number", e.target.parentElement.parentElement, e.target);
            return;
        }

        mostrarAlerta("It's not a number", e.target.parentElement, e.target);

        return;
    } else if(e.target.value === 0 || e.target.value <= 0 || e.target.value[0] === ".") {
        deshabilitar();
        if(e.target.id === "propina") {
            mostrarAlerta("It cannot be 0 or less", e.target.parentElement.parentElement, e.target);
            return;
        }

        mostrarAlerta("It cannot be 0 or less", e.target.parentElement, e.target);

        return;
    } else if(e.target.id === "personas" && e.target.value.includes(".")) {
        deshabilitar();
        mostrarAlerta("Invalid Number", e.target.parentElement, e.target);


        return;
    } else if(e.target.id === "propina" && e.target.value.includes(".")) {
        deshabilitar();
        mostrarAlerta("Invalid Number", e.target.parentElement.parentElement, e.target);


        return;
    }
    
    // Verificamos cuando se ejecuta el evento input en el input que tenga como id "propina" para eliminar la clase de los botones
    if(e.target.id === "propina") {
        btnsPropina.forEach(btn => btn.classList.remove("activo"));
    }
    // Cuando la validación sea correcta
    datos[e.target.id] = Number(e.target.value);
    // console.log(datos);
    calcularPropina();
}

function mostrarAlerta(mensaje, divPadre, input) {
    eliminarAlerta(divPadre);

    input.classList.add("error");

    const pError = document.createElement("span");
    pError.classList.add("errorMensaje");
    pError.textContent = mensaje;

    divPadre.querySelector("label").appendChild(pError);

    setTimeout(() => {
        pError.remove();
        input.classList.remove("error");
    }, 2000)
}

function eliminarAlerta(divPadre) {
    if(divPadre.querySelector(".errorMensaje")) {
        divPadre.querySelector(".errorMensaje").remove();
    }
}

btnsPropina.forEach(btn => {
    btn.addEventListener("click", e => {
        
        btnsPropina.forEach(btn => btn.classList.remove("activo"));

        btn.classList.add("activo");

        // Reiniciamos el valor del input custom porque se va a usar algun boton
        inputCustom.value = "";
        datos.propina = Number(e.target.value);
        calcularPropina();

    });
});

function calcularPropina() {
    // Hace los calculos una vez que no haya ningun "" en las propiedades de los objetos
    if(!Object.values(datos).includes("")) {
        btnReiniciar.disabled = false;
        btnReiniciar.style.cursor = "";
        btnReiniciar.classList.remove("deshabilitado");
        propinaSpan.textContent = porPersona();
        totalSpan.textContent = totalPersona();
        
    }

}

function porPersona() {
    const {cuenta, personas, propina} = datos;
    const propinaCantidad = (cuenta * propina) / 100;
    const propinaPorCadaUno = propinaCantidad / personas;
    return propinaPorCadaUno.toFixed(2);
}

function totalPersona() {
    const {cuenta, personas, propina} = datos;
    const montoTotal = ((cuenta * propina) / 100) + cuenta;
    const montoPorPersona = montoTotal / personas;
    return montoPorPersona.toFixed(2);
}

function deshabilitar(condicion) {
    propinaSpan.textContent = "0.00";
    totalSpan.textContent = "0.00"
    btnReiniciar.disabled = true;
    btnReiniciar.style.cursor = "not-allowed";
    btnReiniciar.classList.add("deshabilitado");

    // Si la condicion es true, ejecuta lo siguiente (solo va a ser true cuando se de click en el boton RESET)
    if(condicion) {
        datos.cuenta = "";
        datos.personas = "";
        datos.propina = "";
        inputCuenta.value = "";
        inputPersonas.value = "";
        inputCustom.value = "";
        btnsPropina.forEach(btn => {
            btn.classList.remove("activo");
        })
    }
}