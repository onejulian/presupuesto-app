const ingresos = [];
const egresos = [];

// Funciones para manejar localStorage
const guardarEnLocalStorage = () => {
    const datos = {
        ingresos: ingresos.map(ing => ({
            id: ing.id,
            descripcion: ing.descripcion,
            valor: ing.valor
        })),
        egresos: egresos.map(eg => ({
            id: eg.id,
            descripcion: eg.descripcion,
            valor: eg.valor
        })),
        contadorIngresos: Ingreso.contadorIngresos,
        contadorEgresos: Egreso.contadorEgresos
    };
    localStorage.setItem('presupuestoApp', JSON.stringify(datos));
};

const cargarDesdeLocalStorage = () => {
    const datosGuardados = localStorage.getItem('presupuestoApp');
    if(datosGuardados){
        try {
            const datos = JSON.parse(datosGuardados);
            
            // Restaurar contadores
            if(datos.contadorIngresos !== undefined){
                Ingreso.contadorIngresos = datos.contadorIngresos;
            }
            if(datos.contadorEgresos !== undefined){
                Egreso.contadorEgresos = datos.contadorEgresos;
            }
            
            // Restaurar ingresos
            if(datos.ingresos && Array.isArray(datos.ingresos)){
                datos.ingresos.forEach(item => {
                    const ingreso = new Ingreso(item.descripcion, item.valor);
                    // Ajustar el id para que coincida con el guardado
                    ingreso._id = item.id;
                    ingresos.push(ingreso);
                    // Actualizar el contador si el id es mayor
                    if(item.id > Ingreso.contadorIngresos){
                        Ingreso.contadorIngresos = item.id;
                    }
                });
            }
            
            // Restaurar egresos
            if(datos.egresos && Array.isArray(datos.egresos)){
                datos.egresos.forEach(item => {
                    const egreso = new Egreso(item.descripcion, item.valor);
                    // Ajustar el id para que coincida con el guardado
                    egreso._id = item.id;
                    egresos.push(egreso);
                    // Actualizar el contador si el id es mayor
                    if(item.id > Egreso.contadorEgresos){
                        Egreso.contadorEgresos = item.id;
                    }
                });
            }
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }
};

let cargarApp = ()=>{
    cargarDesdeLocalStorage();
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
    
    // Event listener para detectar Enter en el formulario
    document.getElementById('forma').addEventListener('keypress', function(e){
        if(e.key === 'Enter'){
            agregarDato();
        }
    });
}

let totalIngresos = ()=>{
    let totalIngreso = 0;
    for(let ingreso of ingresos){
        totalIngreso += ingreso.valor;
    }
    return totalIngreso;
}

let totalEgresos = ()=>{
    let totalEgreso = 0;
    for(let egreso of egresos){
        totalEgreso += egreso.valor;
    }
    return totalEgreso;
}

let cargarCabecero = ()=>{
    let presupuesto = totalIngresos() - totalEgresos();
    let porcentajeEgreso = totalEgresos()/totalIngresos();
    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentajeEgreso);
    document.getElementById('ingresos').innerHTML = formatoMoneda(totalIngresos());
    document.getElementById('egresos').innerHTML = formatoMoneda(totalEgresos());
}

const formatoMoneda = (valor)=>{
    return valor.toLocaleString('es-CO',{style:'currency', currency:'COP', minimumFractionDigits:2});
}

const formatoPorcentaje = (valor)=>{
    if(isNaN(valor)){
        return '0.00%';
    }
    return valor.toLocaleString('en-US',{style:'percent', minimumFractionDigits:2});
}

const cargarIngresos = ()=>{
    let ingresosHTML = '';
    for(let ingreso of ingresos){
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML;
}

const crearIngresoHTML = (ingreso)=>{
    let ingresoHTML = `
    <div class="group py-4 px-5 rounded-lg flex justify-between items-center transition-all hover:bg-white/5 hover:shadow-lg border border-white/5 hover:border-emerald-500/30 backdrop-blur-sm">
        <div class="flex items-center gap-3 flex-1">
            <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div class="text-gray-200 font-light">${ingreso.descripcion}</div>
        </div>
        <div class="flex items-center gap-3">
            <div class="text-emerald-400 font-medium transition-all group-hover:scale-110 group-hover:text-emerald-300">+ ${formatoMoneda(ingreso.valor)}</div>
            <button class='flex md:hidden md:group-hover:flex w-8 h-8 items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer focus:outline-none active:scale-95'>
                <ion-icon name="trash-outline" onclick='eliminarIngreso(${ingreso.id})'></ion-icon>
            </button>
        </div>
    </div>
    `;
    return ingresoHTML;
}

const eliminarIngreso = (id)=>{
    let indiceEliminar = ingresos.findIndex( ingreso => ingreso.id === id);
    ingresos.splice(indiceEliminar, 1);
    guardarEnLocalStorage();
    cargarCabecero();
    cargarIngresos();
}

const cargarEgresos = ()=>{
    let egresosHTML = '';
    for(let egreso of egresos){
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
}

const crearEgresoHTML = (egreso)=>{
    let egresoHTML = `
    <div class="group py-4 px-5 rounded-lg flex justify-between items-center transition-all hover:bg-white/5 hover:shadow-lg border border-white/5 hover:border-red-500/30 backdrop-blur-sm">
        <div class="flex items-center gap-3 flex-1">
            <div class="w-2 h-2 rounded-full bg-red-500"></div>
            <div class="text-gray-200 font-light">${egreso.descripcion}</div>
        </div>
        <div class="flex items-center gap-3">
            <div class="text-red-400 font-medium transition-all group-hover:scale-110 group-hover:text-red-300">- ${formatoMoneda(egreso.valor)}</div>
            <div class="text-xs bg-red-500/20 text-red-300 py-1 px-2 rounded-md min-w-[3rem] text-center font-medium">${formatoPorcentaje(egreso.valor/totalIngresos())}</div>
            <button class='flex md:hidden md:group-hover:flex w-8 h-8 items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer focus:outline-none active:scale-95'>
                <ion-icon name="trash-outline" onclick='eliminarEgreso(${egreso.id})'></ion-icon>
            </button>
        </div>
    </div>
    `;
    return egresoHTML;
}

let eliminarEgreso = (id)=>{
    let indiceEliminar = egresos.findIndex(egreso => egreso.id === id);
    egresos.splice(indiceEliminar, 1);
    guardarEnLocalStorage();
    cargarCabecero();
    cargarEgresos();
}

let agregarDato = ()=>{
    let forma = document.forms['forma'];
    let tipo = forma['tipo'];
    let descripcion = forma['descripcion'];
    let valor = forma['valor'];
    if(descripcion.value !== '' && valor.value !== ''){
        if(tipo.value === 'ingreso'){
            ingresos.push( new Ingreso(descripcion.value, +valor.value));
            guardarEnLocalStorage();
            cargarCabecero();
            cargarIngresos();
        }
        else if(tipo.value === 'egreso'){
           egresos.push( new Egreso(descripcion.value, +valor.value));
           guardarEnLocalStorage();
           cargarCabecero();
           cargarEgresos();
        }
        limpiarFormulario();
    }
}

let limpiarFormulario = ()=>{
    document.getElementById('forma').reset();
}