// ESTADO DE LA APLICACIÓN
const MAX_CUPOS = 25;
const STORAGE_KEY_FERIANTES = 'feria_las_lilas_feriantes_v1';

// Credenciales de demostración para Organizadores
const ADMIN_DNI = '12345678';
const ADMIN_PASS = 'lilas2026';
let organizadorAutenticado = false;

const feriantesIniciales = [
    { id: 1, nombre: 'Marta Pérez', telefono: '11-4567-8901', rubro: 'Artesanías', estado: 'Confirmado', puesto: 'Puesto 1', sector: 'Artesanías (velas)' },
    { id: 2, nombre: 'Carlos Juárez', telefono: '11-3456-7890', rubro: 'Alimentos', estado: 'Confirmado', puesto: 'Puesto 2', sector: 'Panificados' },
    { id: 3, nombre: 'Rosa Gómez', telefono: '11-2345-6789', rubro: 'Perfumes', estado: 'Confirmado', puesto: 'Puesto 3', sector: 'Fragancias' },
    { id: 4, nombre: 'Lucas Silva', telefono: '11-6789-0123', rubro: 'Indumentaria', estado: 'Confirmado', puesto: 'Puesto 4', sector: 'Ropa / Accesorios' },
    { id: 5, nombre: 'Elena Maidana', telefono: '11-7890-1234', rubro: 'Plantas', estado: 'Confirmado', puesto: 'Puesto 5', sector: 'Cactus y Macetas' },
    { id: 6, nombre: 'Jorge Peralta', telefono: '11-8901-2345', rubro: 'Alimentos', estado: 'Pendiente', puesto: '-', sector: '-' },
    { id: 7, nombre: 'Lucía Fernández', telefono: '11-9012-3456', rubro: 'Artesanías', estado: 'Pendiente', puesto: '-', sector: '-' },
    { id: 8, nombre: 'Esteban Quito', telefono: '11-0123-4567', rubro: 'Perfumes', estado: 'Pendiente', puesto: '-', sector: '-' },
];

let feriantes = JSON.parse(localStorage.getItem(STORAGE_KEY_FERIANTES)) || feriantesIniciales;

function guardarFeriantesLocal() {
    localStorage.setItem(STORAGE_KEY_FERIANTES, JSON.stringify(feriantes));
}

// Habilita o bloquea el botón "Org." de la barra inferior según el login
function actualizarEstadoBotonOrg() {
    const btnOrg = document.getElementById('nav-organizadores');
    if (!btnOrg) return;

    const screenOrg = document.getElementById('screen-organizadores');
    const estaEnOrg = screenOrg ? !screenOrg.classList.contains('hidden') : false;

    if (organizadorAutenticado) {
        btnOrg.disabled = false;
        btnOrg.setAttribute('aria-disabled', 'false');
        btnOrg.className = estaEnOrg
            ? "flex flex-col items-center text-brand-600 p-1 min-w-0 font-bold cursor-pointer"
            : "flex flex-col items-center text-purple-700 hover:text-brand-600 p-1 min-w-0 font-semibold cursor-pointer";
    } else {
        btnOrg.disabled = true;
        btnOrg.setAttribute('aria-disabled', 'true');
        btnOrg.className = "flex flex-col items-center text-slate-400 opacity-50 cursor-not-allowed p-1 min-w-0 font-medium";
    }
}

// Control de vista Login vs Panel Organizadores
function actualizarVistaOrganizadores() {
    const loginView = document.getElementById('admin-login-view');
    const panelView = document.getElementById('admin-panel-view');
    const btnSalir = document.getElementById('btn-cerrar-sesion-org');
    const errorMsg = document.getElementById('login-error');

    if (!loginView || !panelView) return;

    if (organizadorAutenticado) {
        loginView.classList.add('hidden');
        panelView.classList.remove('hidden');
        if (btnSalir) btnSalir.classList.remove('hidden');
    } else {
        loginView.classList.remove('hidden');
        panelView.classList.add('hidden');
        if (btnSalir) btnSalir.classList.add('hidden');
        if (errorMsg) errorMsg.classList.add('hidden');
    }

    actualizarEstadoBotonOrg();
}

function handleAdminLogin(e) {
    e.preventDefault();
    const dniIngresado = document.getElementById('login-dni').value.trim();
    const passIngresada = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');

    if (dniIngresado === ADMIN_DNI && passIngresada === ADMIN_PASS) {
        organizadorAutenticado = true;
        if (errorMsg) errorMsg.classList.add('hidden');
        actualizarVistaOrganizadores();
        renderAllViews();
        showToast("🔐 Sesión iniciada como Organización.");
    } else {
        if (errorMsg) errorMsg.classList.remove('hidden');
        showToast("⚠️ DNI o contraseña incorrectos.");
    }
}

function cerrarSesionOrganizador() {
    organizadorAutenticado = false;
    document.getElementById('login-dni').value = ADMIN_DNI;
    document.getElementById('login-password').value = ADMIN_PASS;
    actualizarVistaOrganizadores();
    navigateTo('screen-inicio');
    showToast("Sesión de organización cerrada.");
}

// Navegación entre pantallas principales
function navigateTo(screenId) {
    if (screenId === 'screen-organizadores') {
        const screenOrg = document.getElementById('screen-organizadores');
        const yaEstaEnOrg = screenOrg ? !screenOrg.classList.contains('hidden') : false;
        if (!organizadorAutenticado && yaEstaEnOrg) {
            return;
        }
    }

    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');

    const navButtons = {
        'screen-inicio': 'nav-inicio',
        'screen-inscripcion': 'nav-inscripcion',
        'screen-novedades': 'nav-novedades',
        'screen-puestos': 'nav-puestos',
        'screen-organizadores': 'nav-organizadores'
    };

    Object.keys(navButtons).forEach(id => {
        const btn = document.getElementById(navButtons[id]);
        if (!btn || id === 'screen-organizadores') return;

        if (id === screenId) {
            btn.className = "flex flex-col items-center text-brand-600 p-1 min-w-0 font-bold";
        } else {
            btn.className = "flex flex-col items-center text-slate-400 p-1 min-w-0 font-medium";
        }
    });

    if (screenId === 'screen-organizadores') {
        actualizarVistaOrganizadores();
    } else {
        actualizarEstadoBotonOrg();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderAllViews();
}

// Switch de pestañas en pantalla de admin
function switchAdminTab(tabName) {
    const tabSol = document.getElementById('admin-tab-solicitudes');
    const tabCom = document.getElementById('admin-tab-comunicados');
    const btnSol = document.getElementById('btn-tab-solicitudes');
    const btnCom = document.getElementById('btn-tab-comunicados');

    if (tabName === 'solicitudes') {
        tabSol.classList.remove('hidden');
        tabCom.classList.add('hidden');
        btnSol.className = "flex-1 py-2.5 text-center border-b-2 border-brand-600 text-brand-600 font-bold";
        btnCom.className = "flex-1 py-2.5 text-center border-b-2 border-transparent text-slate-500 hover:text-brand-600";
    } else {
        tabSol.classList.add('hidden');
        tabCom.classList.remove('hidden');
        btnCom.className = "flex-1 py-2.5 text-center border-b-2 border-brand-600 text-brand-600 font-bold";
        btnSol.className = "flex-1 py-2.5 text-center border-b-2 border-transparent text-slate-500 hover:text-brand-600";
    }
}

// Manejar envío de formulario de inscripción
function handleInscripcionSubmit(e) {
    e.preventDefault();
    const nombre = document.getElementById('input-nombre').value;
    const telefono = document.getElementById('input-telefono').value;
    const rubro = document.getElementById('input-rubro').value;

    const nuevoFeriante = {
        id: Date.now(),
        nombre: nombre,
        telefono: telefono,
        rubro: rubro,
        estado: 'Pendiente',
        puesto: '-',
        sector: '-'
    };

    feriantes.push(nuevoFeriante);
    guardarFeriantesLocal();
    e.target.reset();

    showToast("✅ Solicitud enviada en estado PENDIENTE.");
    navigateTo('screen-inscripcion');
}

// Función para verificar estado por Teléfono/WhatsApp
function verEstadoInscripcion() {
    const telInput = document.getElementById('consulta-telefono').value.trim();
    const resDiv = document.getElementById('resultado-estado');

    if (!telInput) {
        showToast("⚠️ Ingrese un teléfono para consultar.");
        return;
    }

    const limpioInput = telInput.replace(/\D/g, '');
    const encontrado = feriantes.find(f => f.telefono.replace(/\D/g, '').includes(limpioInput) && limpioInput.length >= 4);

    resDiv.classList.remove('hidden', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-900', 'bg-amber-50', 'border-amber-200', 'text-amber-900', 'bg-blue-50', 'border-blue-200', 'text-blue-900', 'bg-rose-50', 'border-rose-200', 'text-rose-900', 'bg-slate-100', 'border-slate-300', 'text-slate-800');

    if (!encontrado) {
        resDiv.classList.add('bg-slate-100', 'border-slate-300', 'text-slate-800');
        resDiv.innerHTML = `<p class="font-bold">No se encontró solicitud</p><p class="text-[11px] mt-1">Verifica el número o completa la inscripción arriba.</p>`;
        return;
    }

    if (encontrado.estado === 'Confirmado') {
        resDiv.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-900');
        resDiv.innerHTML = `
            <div class="flex items-center space-x-2 font-bold text-emerald-700 mb-1">
                <span>✅ ¡SOLICITUD CONFIRMADA!</span>
            </div>
            <p class="font-semibold text-sm">Puesto Asignado: <span class="text-brand-700">${encontrado.puesto}</span></p>
            <p class="text-[11px] text-slate-600 mt-1"><strong>Nombre:</strong> ${encontrado.nombre} | <strong>Rubro:</strong> ${encontrado.rubro}</p>
        `;
    } else if (encontrado.estado === 'Lista de Espera') {
        resDiv.classList.add('bg-blue-50', 'border-blue-200', 'text-blue-900');
        resDiv.innerHTML = `
            <p class="font-bold">📋 Estado: LISTA DE ESPERA</p>
            <p class="text-[11px] text-blue-800 mt-1">Tu solicitud para <strong>${encontrado.nombre}</strong> (${encontrado.rubro}) está guardada. Te contactaremos si se libera un vacante.</p>
        `;
    } else if (encontrado.estado === 'Rechazado') {
        resDiv.classList.add('bg-rose-50', 'border-rose-200', 'text-rose-900');
        resDiv.innerHTML = `
            <p class="font-bold">❌ Estado: NO CONFIRMADA / RECHAZADA</p>
            <p class="text-[11px] text-rose-800 mt-1">La solicitud de <strong>${encontrado.nombre}</strong> no pudo ser asignada por falta de cupo o requisitos.</p>
        `;
    } else {
        resDiv.classList.add('bg-amber-50', 'border-amber-200', 'text-amber-900');
        resDiv.innerHTML = `
            <p class="font-bold">⏳ Estado: PENDIENTE DE REVISIÓN</p>
            <p class="text-[11px] text-amber-800 mt-1">Tu solicitud de <strong>${encontrado.nombre}</strong> (${encontrado.rubro}) fue recibida y está siendo evaluada por la organización.</p>
        `;
    }
}

// Acciones de Organizadora sobre Solicitudes
function cambiarEstadoFeriante(id, nuevoEstado) {
    const index = feriantes.findIndex(f => f.id === id);
    if (index !== -1) {
        feriantes[index].estado = nuevoEstado;

        if (nuevoEstado === 'Confirmado') {
            const confirmados = feriantes.filter(f => f.estado === 'Confirmado').length;
            feriantes[index].puesto = `Puesto ${confirmados}`;
            feriantes[index].sector = feriantes[index].rubro;
            showToast(`Puesto asignado a ${feriantes[index].nombre}`);
        } else {
            feriantes[index].puesto = '-';
            feriantes[index].sector = '-';
            showToast(`Solicitud actualizada: ${nuevoEstado}`);
        }

        guardarFeriantesLocal();
        renderAllViews();
    }
}

// Publicar Comunicados
function publicarComunicado() {
    const titulo = document.getElementById('comunicado-titulo').value;
    const tipo = document.getElementById('comunicado-tipo').value;
    const detalle = document.getElementById('comunicado-detalle').value;

    if (!titulo || !detalle) {
        showToast("⚠️ Por favor completa el título y detalle.");
        return;
    }

    const container = document.getElementById('novedades-container');
    const card = document.createElement('div');
    card.className = "bg-white/95 p-4 rounded-2xl border border-purple-200 shadow-sm space-y-1.5 border-l-4 border-l-purple-600";
    card.innerHTML = `
        <div class="flex items-center space-x-2 text-brand-600 font-bold text-xs">
            <span class="w-2 h-2 rounded-full bg-purple-600"></span>
            <h4>${titulo}</h4>
        </div>
        <p class="text-xs text-slate-600">${detalle}</p>
        <span class="inline-block text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-semibold">${tipo}</span>
    `;

    container.prepend(card);
    document.getElementById('comunicado-titulo').value = '';
    document.getElementById('comunicado-detalle').value = '';

    showToast("📢 Novedad publicada en la vista pública");
    navigateTo('screen-novedades');
}

// Renderizar vistas con datos actualizados
function renderAllViews() {
    const confirmados = feriantes.filter(f => f.estado === 'Confirmado');
    const pendientes = feriantes.filter(f => f.estado === 'Pendiente' || f.estado === 'Lista de Espera');

    const ocupadosCount = confirmados.length;
    const disponiblesCount = Math.max(0, MAX_CUPOS - ocupadosCount);

    // 1. Actualizar métricas públicas
    document.getElementById('metric-total').innerText = MAX_CUPOS;
    document.getElementById('metric-ocupados').innerText = ocupadosCount;
    document.getElementById('metric-disponibles').innerText = disponiblesCount;

    // 2. Actualizar métricas admin
    document.getElementById('org-count-pendientes').innerText = pendientes.length;
    document.getElementById('org-count-confirmados').innerText = ocupadosCount;
    document.getElementById('org-count-libres').innerText = disponiblesCount;
    document.getElementById('badge-pendientes').innerText = pendientes.length;
    document.getElementById('total-reg-count').innerText = feriantes.length;

    // 3. Renderizar listado público de puestos
    const puestosPublicosContainer = document.getElementById('puestos-publicos-list');
    puestosPublicosContainer.innerHTML = '';
    
    confirmados.forEach((f, idx) => {
        const div = document.createElement('div');
        div.className = "bg-white/95 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs shadow-sm gap-2";
        div.innerHTML = `
            <div class="font-medium text-slate-800 truncate">
                <span class="font-bold text-brand-700">${f.puesto}</span> · N.° 0${idx+1}
            </div>
            <div class="text-[11px] bg-purple-50 text-purple-800 font-medium px-2.5 py-1 rounded-lg border border-purple-100 shrink-0">
                ${f.rubro} (${f.nombre.split(' ')[0]})
            </div>
        `;
        puestosPublicosContainer.appendChild(div);
    });

    if (confirmados.length === 0) {
        puestosPublicosContainer.innerHTML = '<p class="text-xs text-slate-400 text-center py-4">No hay puestos confirmados aún.</p>';
    }

    // 4. Renderizar lista de administración de solicitudes
    const solicitudesAdminContainer = document.getElementById('solicitudes-admin-list');
    solicitudesAdminContainer.innerHTML = '';

    feriantes.forEach(f => {
        const div = document.createElement('div');
        let borderBadgeColor = "border-amber-200 bg-amber-50 text-amber-800";
        if (f.estado === 'Confirmado') borderBadgeColor = "border-emerald-200 bg-emerald-50 text-emerald-800";
        if (f.estado === 'Lista de Espera') borderBadgeColor = "border-blue-200 bg-blue-50 text-blue-800";
        if (f.estado === 'Rechazado') borderBadgeColor = "border-rose-200 bg-rose-50 text-rose-800";

        div.className = "bg-white/95 p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5";
        div.innerHTML = `
            <div class="flex justify-between items-start gap-2">
                <div class="min-w-0">
                    <h5 class="font-bold text-xs text-slate-800 truncate">${f.nombre}</h5>
                    <p class="text-[11px] text-slate-500 break-words">📞 ${f.telefono} | Rubro: <span class="font-semibold text-slate-700">${f.rubro}</span></p>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${borderBadgeColor}">${f.estado}</span>
            </div>

            ${f.estado === 'Confirmado' ? `<p class="text-[11px] text-purple-700 font-medium bg-purple-50 p-1.5 rounded-lg">📍 Asignado: <strong>${f.puesto}</strong> (${f.sector})</p>` : ''}

            <div class="flex items-center space-x-1.5 pt-1">
                ${f.estado !== 'Confirmado' ? `
                    <button onclick="cambiarEstadoFeriante(${f.id}, 'Confirmado')" class="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition">
                        Confirmar
                    </button>
                ` : ''}
                
                ${f.estado !== 'Lista de Espera' ? `
                    <button onclick="cambiarEstadoFeriante(${f.id}, 'Lista de Espera')" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold py-1.5 rounded-lg transition">
                        En Espera
                    </button>
                ` : ''}

                ${f.estado !== 'Rechazado' ? `
                    <button onclick="cambiarEstadoFeriante(${f.id}, 'Rechazado')" class="px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-semibold py-1.5 rounded-lg transition">
                        Rechazar
                    </button>
                ` : ''}
            </div>
        `;
        solicitudesAdminContainer.appendChild(div);
    });
}

// Toast Modal
function showToast(msg) {
    const toast = document.getElementById('toast-modal');
    document.getElementById('toast-message').innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function closeToast() {
    document.getElementById('toast-modal').classList.add('hidden');
}

// Inicialización al cargar la ventana
window.onload = function() {
    actualizarVistaOrganizadores();
    renderAllViews();
};