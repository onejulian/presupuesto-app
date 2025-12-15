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
    
    // Formateo del input de valor
    const inputValor = document.getElementById('valor');
    inputValor.addEventListener('input', formatearInputValor);
    inputValor.addEventListener('focus', function(){
        if(this.value === ''){
            this.placeholder = '0';
        }
    });
    inputValor.addEventListener('blur', function(){
        this.placeholder = '$ Valor';
    });
    
    // Inicializar select personalizado
    inicializarSelectCustom();
    
    // Manejar shortcuts de la PWA
    manejarShortcuts();
    
    // Inicializar funcionalidad PWA
    inicializarPWA();
}

// Función para inicializar el select personalizado
const inicializarSelectCustom = ()=>{
    const customSelect = document.getElementById('tipo-custom');
    const dropdown = document.getElementById('tipo-dropdown');
    const selectOculto = document.getElementById('tipo');
    const opciones = dropdown.querySelectorAll('.custom-select-option');
    
    // Toggle dropdown al hacer clic en el select
    customSelect.addEventListener('click', (e)=>{
        e.stopPropagation();
        dropdown.classList.toggle('show');
        customSelect.classList.toggle('open');
    });
    
    // Manejar selección de opción
    opciones.forEach(opcion => {
        opcion.addEventListener('click', (e)=>{
            e.stopPropagation();
            const valor = opcion.getAttribute('data-value');
            const texto = opcion.querySelector('span').textContent;
            const iconName = opcion.querySelector('ion-icon').getAttribute('name');
            
            // Actualizar el select oculto
            selectOculto.value = valor;
            
            // Actualizar el texto e icono del select visual
            customSelect.querySelector('.select-text').textContent = texto;
            const iconoActual = customSelect.querySelector('.select-icon-current');
            iconoActual.setAttribute('name', iconName);
            
            // Actualizar el estilo según el tipo
            if(valor === 'egreso'){
                customSelect.setAttribute('data-type', 'egreso');
            } else {
                customSelect.removeAttribute('data-type');
            }
            
            // Cerrar el dropdown
            dropdown.classList.remove('show');
            customSelect.classList.remove('open');
        });
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', ()=>{
        dropdown.classList.remove('show');
        customSelect.classList.remove('open');
    });
    
    // Manejar teclado (Enter y Escape)
    customSelect.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            customSelect.click();
        } else if(e.key === 'Escape'){
            dropdown.classList.remove('show');
            customSelect.classList.remove('open');
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

// Función para formatear el input de valor con puntos de miles
const formatearInputValor = (e)=>{
    let input = e.target;
    let valor = input.value;
    
    // Remover todo excepto dígitos
    valor = valor.replace(/\D/g, '');
    
    // Si está vacío, limpiar
    if(valor === ''){
        input.value = '';
        return;
    }
    
    // Convertir a número y formatear con puntos de miles
    let numero = parseInt(valor, 10);
    input.value = numero.toLocaleString('es-CO');
    
    // Guardar la posición del cursor
    let cursorPos = input.selectionStart;
    let valorAnterior = input.value;
    
    // Ajustar la posición del cursor después del formateo
    setTimeout(() => {
        let puntosDespues = (input.value.match(/\./g) || []).length;
        let puntosAntes = (valorAnterior.match(/\./g) || []).length;
        if(puntosDespues > puntosAntes){
            input.setSelectionRange(cursorPos + 1, cursorPos + 1);
        }
    }, 0);
}

// Función para parsear el valor formateado y obtener el número
const parsearValor = (valorFormateado)=>{
    if(!valorFormateado || valorFormateado === ''){
        return 0;
    }
    // Remover todos los puntos de miles
    let valorSinPuntos = valorFormateado.replace(/\./g, '');
    // Convertir a número
    return parseFloat(valorSinPuntos) || 0;
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
        // Parsear el valor formateado
        let valorNumerico = parsearValor(valor.value);
        if(valorNumerico > 0){
            if(tipo.value === 'ingreso'){
                ingresos.push( new Ingreso(descripcion.value, valorNumerico));
                guardarEnLocalStorage();
                cargarCabecero();
                cargarIngresos();
            }
            else if(tipo.value === 'egreso'){
               egresos.push( new Egreso(descripcion.value, valorNumerico));
               guardarEnLocalStorage();
               cargarCabecero();
               cargarEgresos();
            }
            limpiarFormulario();
        }
    }
}

let limpiarFormulario = ()=>{
    document.getElementById('forma').reset();
}

// Función para manejar shortcuts de la PWA
const manejarShortcuts = () => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    const customSelect = document.getElementById('tipo-custom');
    const selectOculto = document.getElementById('tipo');
    
    if(action === 'add_income'){
        // Preseleccionar ingreso
        selectOculto.value = 'ingreso';
        customSelect.querySelector('.select-text').textContent = 'Ingreso';
        const iconoActual = customSelect.querySelector('.select-icon-current');
        iconoActual.setAttribute('name', 'trending-up-outline');
        customSelect.removeAttribute('data-type');
        document.getElementById('descripcion').focus();
    } else if(action === 'add_expense'){
        // Preseleccionar egreso
        selectOculto.value = 'egreso';
        customSelect.querySelector('.select-text').textContent = 'Egreso';
        const iconoActual = customSelect.querySelector('.select-icon-current');
        iconoActual.setAttribute('name', 'trending-down-outline');
        customSelect.setAttribute('data-type', 'egreso');
        document.getElementById('descripcion').focus();
    }
};

// Función para inicializar funcionalidad PWA
const inicializarPWA = () => {
    // Crear footer con opción de instalación
    crearFooterPWA();
    
    // Manejar instalación de PWA
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Mostrar el footer con opción de instalación
        const installSection = document.getElementById('install-section');
        if(installSection) {
            installSection.style.display = 'block';
        }
    });
    
    // Listener para el botón de instalación en el footer
    window.installPWA = async () => {
        if(deferredPrompt){
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuario eligió: ${outcome}`);
            if(outcome === 'accepted'){
                const installSection = document.getElementById('install-section');
                if(installSection) {
                    installSection.style.display = 'none';
                }
            }
            deferredPrompt = null;
        }
    };
    
    // Detectar si la app está instalada
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone || 
        document.referrer.includes('android-app://')) {
        console.log('App ejecutándose como PWA');
    }
    
    // Notificación de estado offline/online
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-all duration-300 z-50';
    notificationDiv.style.display = 'none';
    document.body.appendChild(notificationDiv);
    
    // Variable para rastrear si es la primera carga
    let primeraVez = true;
    
    window.addEventListener('online', () => {
        // Solo mostrar si no es la primera vez (si se perdió la conexión y volvió)
        if (!primeraVez) {
            notificationDiv.style.backgroundColor = '#10b981';
            notificationDiv.innerHTML = '<ion-icon name="wifi-outline"></ion-icon> Conexión restaurada';
            notificationDiv.style.display = 'flex';
            notificationDiv.style.alignItems = 'center';
            notificationDiv.style.gap = '8px';
            setTimeout(() => {
                notificationDiv.style.display = 'none';
            }, 3000);
        }
    });
    
    window.addEventListener('offline', () => {
        // No mostrar nada al usuario cuando está offline
        // La app seguirá funcionando con los datos en cache
        primeraVez = false; // Ya no es la primera vez, ha perdido conexión
        console.log('Modo offline activado - funcionando con cache');
    });
    
    // Sincronización en background
    if ('sync' in navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(registration => {
            return registration.sync.register('sync-data');
        });
    }
    
    
    // Exportar/Importar datos
    // agregarBotonesBackup();
};

// Crear footer elegante con opción de instalación PWA
const crearFooterPWA = () => {
    const footer = document.createElement('footer');
    footer.className = 'fixed bottom-0 left-0 right-0 z-30';
    footer.style.background = 'linear-gradient(to top, rgba(10, 14, 39, 0.98), rgba(10, 14, 39, 0.95))';
    footer.style.backdropFilter = 'blur(10px)';
    footer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
    
    footer.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 py-3">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <!-- Botones de Exportar/Importar (siempre visibles) -->
                <div class="flex items-center gap-2 sm:gap-3">
                    <button 
                        onclick="exportarDatos()"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 text-white text-sm shadow-md"
                        style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"
                    >
                        <ion-icon name="download-outline" class="text-lg"></ion-icon>
                        <span class="hidden sm:inline">Exportar</span>
                    </button>
                    <button 
                        onclick="abrirImportador()"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 text-white text-sm shadow-md"
                        style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);"
                    >
                        <ion-icon name="cloud-upload-outline" class="text-lg"></ion-icon>
                        <span class="hidden sm:inline">Importar</span>
                    </button>
                </div>
                
                <!-- Sección de instalación (oculta por defecto) -->
                <div id="install-section" style="display: none;">
                    <button 
                        onclick="window.installPWA()" 
                        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 text-white text-sm shadow-md"
                        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                    >
                        <ion-icon name="phone-portrait-outline" class="text-lg"></ion-icon>
                        <span class="hidden sm:inline">Instalar App</span>
                    </button>
                </div>
                
                <!-- Sección de actualización (oculta por defecto) -->
                <div id="update-section" style="display: none;">
                    <button 
                        onclick="window.updatePWA()" 
                        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 text-white text-sm shadow-md"
                        style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);"
                    >
                        <ion-icon name="refresh-outline" class="text-lg"></ion-icon>
                        <span class="hidden sm:inline">Actualizar</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(footer);
    
    // Detectar si la app ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone || 
        document.referrer.includes('android-app://')) {
        const installedInfo = document.getElementById('installed-info');
        if(installedInfo) {
            installedInfo.style.display = 'flex';
        }
    }
};

// ============================================
// FUNCIONALIDAD DE EXPORTAR / IMPORTAR DATOS
// ============================================

// Variable para almacenar temporalmente los datos a importar
let datosParaImportar = null;

// Función para exportar todos los datos del localStorage
const exportarDatos = () => {
    const datos = {
        version: '1.0',
        appName: 'presupuesto-app',
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
        contadorEgresos: Egreso.contadorEgresos,
        fechaExportacion: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presupuesto_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Notificación de éxito
    mostrarNotificacion('Datos exportados exitosamente', 'success');
};

// Función para abrir el selector de archivos
const abrirImportador = () => {
    const fileInput = document.getElementById('import-file-input');
    fileInput.value = ''; // Limpiar selección previa
    fileInput.click();
};

// Función para validar el formato del archivo JSON
const validarFormatoJSON = (datos) => {
    const errores = [];
    
    // Verificar que sea un objeto
    if (typeof datos !== 'object' || datos === null) {
        errores.push('El archivo no contiene un objeto JSON válido');
        return { valido: false, errores };
    }
    
    // Verificar estructura básica
    if (!datos.hasOwnProperty('ingresos')) {
        errores.push('Falta el campo "ingresos"');
    } else if (!Array.isArray(datos.ingresos)) {
        errores.push('El campo "ingresos" debe ser un array');
    } else {
        // Validar cada ingreso
        datos.ingresos.forEach((ing, idx) => {
            if (typeof ing.descripcion !== 'string') {
                errores.push(`Ingreso ${idx + 1}: falta "descripcion" o no es texto`);
            }
            if (typeof ing.valor !== 'number' || ing.valor < 0) {
                errores.push(`Ingreso ${idx + 1}: "valor" debe ser un número positivo`);
            }
        });
    }
    
    if (!datos.hasOwnProperty('egresos')) {
        errores.push('Falta el campo "egresos"');
    } else if (!Array.isArray(datos.egresos)) {
        errores.push('El campo "egresos" debe ser un array');
    } else {
        // Validar cada egreso
        datos.egresos.forEach((eg, idx) => {
            if (typeof eg.descripcion !== 'string') {
                errores.push(`Egreso ${idx + 1}: falta "descripcion" o no es texto`);
            }
            if (typeof eg.valor !== 'number' || eg.valor < 0) {
                errores.push(`Egreso ${idx + 1}: "valor" debe ser un número positivo`);
            }
        });
    }
    
    return {
        valido: errores.length === 0,
        errores
    };
};

// Función que se ejecuta al seleccionar un archivo
const validarArchivoImportacion = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            // Intentar parsear el JSON
            const datos = JSON.parse(e.target.result);
            
            // Validar el formato
            const validacion = validarFormatoJSON(datos);
            
            if (!validacion.valido) {
                // Mostrar errores de validación
                let mensajeError = 'El archivo tiene un formato inválido:\n\n';
                mensajeError += validacion.errores.slice(0, 5).join('\n');
                if (validacion.errores.length > 5) {
                    mensajeError += `\n... y ${validacion.errores.length - 5} error(es) más`;
                }
                mostrarNotificacion(mensajeError, 'error');
                return;
            }
            
            // Guardar datos temporalmente y mostrar modal de confirmación
            datosParaImportar = datos;
            mostrarModalConfirmacion(datos);
            
        } catch (error) {
            mostrarNotificacion('Error: El archivo no es un JSON válido', 'error');
            console.error('Error parseando JSON:', error);
        }
    };
    
    reader.readAsText(file);
};

// Función para mostrar el modal de confirmación
const mostrarModalConfirmacion = (datos) => {
    const modal = document.getElementById('modal-importar');
    
    // Actualizar conteos de datos a importar
    document.getElementById('import-ingresos-count').textContent = datos.ingresos ? datos.ingresos.length : 0;
    document.getElementById('import-egresos-count').textContent = datos.egresos ? datos.egresos.length : 0;
    
    // Actualizar conteos de datos actuales
    document.getElementById('current-ingresos-count').textContent = ingresos.length;
    document.getElementById('current-egresos-count').textContent = egresos.length;
    
    // Mostrar modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
};

// Función para cerrar el modal
const cerrarModalImportar = () => {
    const modal = document.getElementById('modal-importar');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    datosParaImportar = null;
};

// Función para confirmar y ejecutar la importación
const confirmarImportacion = () => {
    if (!datosParaImportar) {
        cerrarModalImportar();
        return;
    }
    
    const datos = datosParaImportar;
    
    // Limpiar datos actuales
    ingresos.length = 0;
    egresos.length = 0;
    
    // Restaurar contadores
    if (datos.contadorIngresos !== undefined) {
        Ingreso.contadorIngresos = datos.contadorIngresos;
    } else {
        Ingreso.contadorIngresos = 0;
    }
    
    if (datos.contadorEgresos !== undefined) {
        Egreso.contadorEgresos = datos.contadorEgresos;
    } else {
        Egreso.contadorEgresos = 0;
    }
    
    // Importar ingresos
    if (datos.ingresos && Array.isArray(datos.ingresos)) {
        datos.ingresos.forEach(item => {
            const ingreso = new Ingreso(item.descripcion, item.valor);
            if (item.id !== undefined) {
                ingreso._id = item.id;
                if (item.id > Ingreso.contadorIngresos) {
                    Ingreso.contadorIngresos = item.id;
                }
            }
            ingresos.push(ingreso);
        });
    }
    
    // Importar egresos
    if (datos.egresos && Array.isArray(datos.egresos)) {
        datos.egresos.forEach(item => {
            const egreso = new Egreso(item.descripcion, item.valor);
            if (item.id !== undefined) {
                egreso._id = item.id;
                if (item.id > Egreso.contadorEgresos) {
                    Egreso.contadorEgresos = item.id;
                }
            }
            egresos.push(egreso);
        });
    }
    
    // Guardar y actualizar interfaz
    guardarEnLocalStorage();
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
    
    // Cerrar modal y mostrar notificación
    cerrarModalImportar();
    mostrarNotificacion('Datos importados exitosamente', 'success');
};

// Función para mostrar notificaciones
const mostrarNotificacion = (mensaje, tipo = 'info') => {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl text-white font-medium z-50 max-w-md text-center transition-all duration-300 backdrop-blur-sm`;
    
    // Aplicar estilos según el tipo
    if (tipo === 'success') {
        notificacion.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        notificacion.innerHTML = `<div class="flex items-center gap-3"><ion-icon name="checkmark-circle-outline" class="text-2xl"></ion-icon><span>${mensaje}</span></div>`;
    } else if (tipo === 'error') {
        notificacion.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        notificacion.innerHTML = `<div class="flex items-start gap-3"><ion-icon name="alert-circle-outline" class="text-2xl flex-shrink-0"></ion-icon><span class="text-left text-sm whitespace-pre-line">${mensaje}</span></div>`;
    } else {
        notificacion.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        notificacion.innerHTML = `<div class="flex items-center gap-3"><ion-icon name="information-circle-outline" class="text-2xl"></ion-icon><span>${mensaje}</span></div>`;
    }
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    notificacion.style.opacity = '0';
    notificacion.style.transform = 'translate(-50%, -20px)';
    
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    // Auto-cerrar después de un tiempo (más largo para errores)
    const duracion = tipo === 'error' ? 6000 : 3000;
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, duracion);
};