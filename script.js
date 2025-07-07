// Envuelve todo el código JavaScript en un evento 'DOMContentLoaded'
// para asegurar que el DOM esté completamente cargado antes de interactuar con él.
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM completamente cargado. Inicializando la aplicación...');

        // Referencias a elementos del DOM para una gestión eficiente
        const moduleDirecciones = document.getElementById('module-direcciones');
        const moduleCalculadora = document.getElementById('module-calculadora');
        const moduleEvaluarRut = document.getElementById('module-evaluar-rut');
        const moduleCondicionesComerciales = document.getElementById('module-condiciones-comerciales');
        const moduleFactibilidad = document.getElementById('module-factibilidad');
        const btnIngresoVentaMain = document.getElementById('btn-ingreso-venta-main');
        const floatingDeployButton = document.getElementById('floating-deploy-button');

        // Elementos de la barra de navegación
        const navBar = document.querySelector('.nav-bar');
        const navItems = document.querySelectorAll('.nav-item');
        const navHome = document.getElementById('nav-home');
        const navContact = document.getElementById('nav-contact');
        const navAdd = document.getElementById('nav-add');
        const navAdmin = document.getElementById('nav-admin');
        const navProfile = document.getElementById('nav-profile');
        const navReports = document.getElementById('nav-reports');
        const navSettings = document.getElementById('nav-settings');
        const navMessages = document.getElementById('nav-messages');
        const navCalendar = document.getElementById('nav-calendar');
        const navDocs = document.getElementById('nav-docs');

        // Variables para controlar el estado de inicio de sesión del administrador
        let isAdminLoggedIn = false;

        // Configuración de WhatsApp para el administrador
        const adminWhatsappNumber = '56927372611';
        const generalWhatsappMessage = 'Hola, necesito ayuda con la aplicación.';

        // Variables para almacenar los valores (usando localStorage para Canvas)
        let correctUniqueCode = localStorage.getItem('correctUniqueCode') || '123456';
        let lastCodeChangeTimestamp = parseInt(localStorage.getItem('lastCodeChangeTimestamp')) || Date.now();
        const adminPassword = 'admin123'; // Contraseña de admin fija para Canvas

        const CODE_EXPIRATION_DAYS = 15 * 24 * 60 * 60 * 1000; 
        // const CODE_EXPIRATION_DAYS = 10 * 1000; // Para pruebas: 10 segundos

        // Referencias a elementos del modal de acceso inicial
        const initialAccessModal = document.getElementById('initial-access-modal');
        const initialModalTitle = document.getElementById('initial-modal-title');
        const initialModalMessage = document.getElementById('initial-modal-message');
        const initialAccessSection = document.getElementById('initial-access-section');
        const requestDetailsSection = document.getElementById('request-details-section');
        
        const uniqueCodeInput = document.getElementById('unique-code');
        const accessButton = document.getElementById('access-button');
        const requestNewCodeButton = document.getElementById('request-new-code-button');

        const userNameInput = document.getElementById('user-name');
        const userPhoneInput = document.getElementById('user-phone');
        const sendRequestButton = document.getElementById('send-request-button');
        const backToCodeEntryButton = document.getElementById('back-to-code-entry-button');

        // Referencias a elementos de los modales de administrador
        const adminLoginModal = document.getElementById('admin-login-modal');
        const adminLoginMessage = document.getElementById('admin-login-message');
        const adminLoginForm = document.getElementById('admin-login-form');
        const adminPasswordInput = document.getElementById('admin-password');
        const rememberMeCheckbox = document.getElementById('remember-me');
        const forgotPasswordLink = document.getElementById('forgot-password-link');

        const adminPanelModal = document.getElementById('admin-panel-modal');
        const currentUniqueCodeDisplay = document.getElementById('current-unique-code');
        const updateCodeForm = document.getElementById('update-code-form');
        const newUniqueCodeInput = document.getElementById('new-unique-code');
        const adminPanelCloseButton = document.getElementById('admin-panel-close-button');

        const forcedAdminUpdateModal = document.getElementById('forced-admin-update-modal');

        const loadingOverlay = document.getElementById('loading-overlay');

        /**
         * Muestra la sección para ingresar el código o solicitar uno nuevo.
         */
        function showInitialAccessSection() {
            console.log('Mostrando sección de acceso inicial.');
            initialModalTitle.textContent = 'Acceso a Consola WOM Venta';
            initialModalMessage.textContent = 'Ingresa tu código único o solicita uno nuevo.';
            initialModalMessage.style.display = 'none'; // Asegura que el mensaje esté oculto por defecto
            initialAccessSection.style.display = 'block';
            requestDetailsSection.style.display = 'none';
            uniqueCodeInput.value = '';
        }

        /**
         * Muestra la sección para ingresar nombre y teléfono para solicitar código.
         */
        function showRequestDetailsSection() {
            console.log('Mostrando sección de detalles de solicitud.');
            initialModalTitle.textContent = 'Solicitar Nuevo Código';
            initialModalMessage.textContent = 'Por favor, ingresa tus datos para que el administrador te envíe un código.';
            initialModalMessage.style.display = 'none'; // Asegura que el mensaje esté oculto por defecto
            initialAccessSection.style.display = 'none';
            requestDetailsSection.style.display = 'block';
            userNameInput.value = '';
            userPhoneInput.value = '';
        }

        /**
         * Inicializa la aplicación, cargando propiedades y decidiendo qué modal mostrar.
         */
        function initializeApp() {
            console.log('Iniciando initializeApp()...');
            const hasAccessedBefore = localStorage.getItem('hasAccessedBefore') === 'true';
            lastCodeChangeTimestamp = parseInt(localStorage.getItem('lastCodeChangeTimestamp')) || Date.now();
            correctUniqueCode = localStorage.getItem('correctUniqueCode') || '123456';
            isAdminLoggedIn = localStorage.getItem('adminRemembered') === 'true';

            console.log("--- Estado de Carga de la Aplicación (Canvas Preview) ---");
            console.log("localStorage 'hasAccessedBefore':", hasAccessedBefore);
            console.log("localStorage 'lastCodeChangeTimestamp':", new Date(lastCodeChangeTimestamp));
            console.log("localStorage 'correctUniqueCode':", correctUniqueCode);
            console.log("localStorage 'adminRemembered':", isAdminLoggedIn);
            console.log("Tiempo Actual:", new Date(Date.now()));
            console.log("Umbral de Expiración del Código (ms):", CODE_EXPIRATION_DAYS);
            console.log("Tiempo transcurrido desde el último cambio de código:", (Date.now() - lastCodeChangeTimestamp), "ms");

            const currentTime = Date.now();
            const timeElapsed = currentTime - lastCodeChangeTimestamp;

            if (!hasAccessedBefore) {
                console.log("El usuario NO ha accedido antes. Mostrando modal de acceso inicial.");
                initialAccessModal.classList.add('show');
                showInitialAccessSection();
            } else {
                if (timeElapsed >= CODE_EXPIRATION_DAYS) {
                    console.log("El código ha EXPIRADO. Mostrando modal de actualización forzada del administrador.");
                    forcedAdminUpdateModal.classList.add('show');
                    localStorage.removeItem('hasAccessedBefore'); // Elimina para forzar reautenticación
                } else {
                    console.log("El código sigue siendo VÁLIDO. Procediendo al contenido de la aplicación.");
                    initialAccessModal.classList.remove('show');
                    forcedAdminUpdateModal.classList.remove('show');
                    adminLoginModal.classList.remove('show');
                    adminPanelModal.classList.remove('show');
                }
            }

            // Ocultar overlay de carga
            if (loadingOverlay) { // Asegurarse de que el elemento existe antes de interactuar
                loadingOverlay.style.opacity = '0';
                loadingOverlay.addEventListener('transitionend', function handler() {
                    console.log('Loading overlay transition ended. Removing overlay.');
                    loadingOverlay.remove();
                    loadingOverlay.removeEventListener('transitionend', handler); // Limpiar el listener
                });
            } else {
                console.warn('loadingOverlay no encontrado.');
            }

            // Aplicación inicial del efecto del dock
            if (navItems.length > 0) {
                // Intenta desplazar al primer elemento del dock para centrarlo visualmente
                navItems[0].scrollIntoView({ behavior: 'smooth', inline: 'center' });
                setTimeout(applyDockEffect, 300); // Pequeño retraso para que el scroll termine
            }
            console.log('initializeApp() finalizado.');
        }

        /**
         * Valida el formato de un número de teléfono chileno.
         * @param {string} phone - El número de teléfono a validar.
         * @returns {boolean} - True si el formato es válido, false en caso contrario.
         */
        function isValidChileanPhoneNumber(phone) {
            const regex = /^(?:\+?56)?9\d{8}$/; // Permite +56 o no, seguido de 9 y 8 dígitos
            return regex.test(phone);
        }

        // --- Manejadores de Eventos para el Modal de Acceso Inicial ---
        if (requestNewCodeButton) {
            requestNewCodeButton.addEventListener('click', () => {
                console.log('Botón "Solicitar Nuevo Código" clickeado.');
                showRequestDetailsSection();
            });
            console.log('Listener para requestNewCodeButton adjunto.');
        } else { console.warn('requestNewCodeButton no encontrado.'); }

        if (backToCodeEntryButton) {
            backToCodeEntryButton.addEventListener('click', () => {
                console.log('Botón "Volver" clickeado en solicitud.');
                showInitialAccessSection();
            });
            console.log('Listener para backToCodeEntryButton adjunto.');
        } else { console.warn('backToCodeEntryButton no encontrado.'); }

        if (sendRequestButton) {
            sendRequestButton.addEventListener('click', () => {
                console.log('Botón "Enviar Solicitud por WhatsApp" clickeado.');
                const userName = userNameInput.value.trim();
                const userPhone = userPhoneInput.value.trim();

                if (!userName || !userPhone) {
                    showCustomMessageBox('Por favor, completa todos los campos para solicitar acceso.', 'error');
                    return;
                }

                if (!isValidChileanPhoneNumber(userPhone)) {
                    showCustomMessageBox('Por favor, ingresa un número de teléfono válido (ej: 56912345678).', 'error');
                    return;
                }

                const messageForAdmin = `Solicitud de acceso a Consola WOM Venta:\n\nNombre: ${userName}\nTeléfono: ${userPhone}\n\nPor favor, envíame un código único de acceso.`;
                
                const whatsappUrl = `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(messageForAdmin)}`;
                window.open(whatsappUrl, '_blank');

                showInitialAccessSection(); // Vuelve a la sección de ingreso de código después de enviar la solicitud
                initialModalMessage.textContent = '¡Solicitud enviada! Espera el código único que te enviaremos por WhatsApp.';
                initialModalMessage.style.display = 'block'; // Muestra el mensaje de éxito
                showCustomMessageBox('¡Solicitud enviada! Espera el código por WhatsApp.', 'info');
            });
            console.log('Listener para sendRequestButton adjunto.');
        } else { console.warn('sendRequestButton no encontrado.'); }

        if (accessButton) {
            accessButton.addEventListener('click', () => {
                console.log('Botón "LOGIN" clickeado en modal de acceso.');
                const enteredCode = uniqueCodeInput.value.trim();
                console.log(`Depuración de Login: Código ingresado "${enteredCode}", Código correcto (almacenado) "${correctUniqueCode}"`);

                if (enteredCode === correctUniqueCode) {
                    console.log('Código correcto. Acceso concedido.');
                    initialAccessModal.classList.remove('show');
                    showCustomMessageBox('¡Acceso concedido! Bienvenido.', 'success');
                    localStorage.setItem('hasAccessedBefore', 'true'); // Guarda el estado de acceso
                    uniqueCodeInput.value = ''; // Limpia el campo de entrada
                    initialModalMessage.style.display = 'none'; // Oculta el mensaje si estaba visible
                } else {
                    console.log('Código incorrecto.');
                    showCustomMessageBox('Código incorrecto. Inténtalo de nuevo.', 'error');
                    initialModalMessage.textContent = 'Código incorrecto. Inténtalo de nuevo.';
                    initialModalMessage.style.display = 'block'; // Muestra el mensaje de error
                }
            });
            console.log('Listener para accessButton adjunto.');
        } else { console.warn('accessButton no encontrado.'); }


        // --- Manejadores de Eventos para el Modal de Acceso de Administrador ---
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                console.log('Formulario de login de administrador enviado.');

                const enteredAdminPassword = adminPasswordInput.value.trim();
                console.log("Contraseña de Administrador Ingresada:", enteredAdminPassword);

                if (enteredAdminPassword === adminPassword) {
                    console.log('Contraseña de administrador correcta.');
                    isAdminLoggedIn = true;
                    adminLoginModal.classList.remove('show');
                    adminLoginMessage.textContent = '';
                    adminLoginMessage.style.display = 'none'; // Oculta el mensaje
                    showCustomMessageBox('Acceso de administrador concedido.', 'success');
                    if (rememberMeCheckbox.checked) {
                        localStorage.setItem('adminRemembered', 'true');
                    } else {
                        localStorage.removeItem('adminRemembered');
                    }
                } else {
                    console.log('Contraseña de administrador incorrecta.');
                    adminLoginMessage.textContent = 'Contraseña incorrecta.';
                    adminLoginMessage.style.display = 'block'; // Muestra el mensaje de error
                    showCustomMessageBox('Contraseña de administrador incorrecta.', 'error');
                }
            });
            console.log('Listener para adminLoginForm adjunto.');
        } else { console.warn('adminLoginForm no encontrado.'); }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (event) => {
                event.preventDefault();
                console.log('Enlace "¿Olvidaste tu contraseña?" clickeado.');
                showCustomMessageBox('Por favor, contacta al administrador para restablecer tu contraseña.', 'info');
            });
            console.log('Listener para forgotPasswordLink adjunto.');
        } else { console.warn('forgotPasswordLink no encontrado.'); }

        // --- Manejador de Eventos para el Formulario de Actualización de Código (Panel de Admin) ---
        if (updateCodeForm) {
            updateCodeForm.addEventListener('submit', (event) => {
                event.preventDefault();
                console.log('Formulario de actualización de código enviado.');

                const newCode = newUniqueCodeInput.value.trim();
                if (newCode) {
                    correctUniqueCode = newCode;
                    localStorage.setItem('correctUniqueCode', newCode);
                    
                    lastCodeChangeTimestamp = Date.now(); // Reinicia el timestamp de cambio
                    localStorage.setItem('lastCodeChangeTimestamp', lastCodeChangeTimestamp.toString());

                    currentUniqueCodeDisplay.textContent = newCode;
                    showCustomMessageBox('Código único actualizado correctamente.', 'success');
                    console.log("Nuevo Código Único guardado:", newCode);
                    console.log("Nuevo Timestamp de Último Cambio de Código:", new Date(lastCodeChangeTimestamp));

                    forcedAdminUpdateModal.classList.remove('show');
                    adminPanelModal.classList.remove('show');
                    
                    // Fuerza a los usuarios a reautenticarse con el nuevo código
                    localStorage.removeItem('hasAccessedBefore');
                    initialAccessModal.classList.add('show');
                    showInitialAccessSection();
                } else {
                    showCustomMessageBox('El nuevo código no puede estar vacío.', 'error');
                }
            });
            console.log('Listener para updateCodeForm adjunto.');
        } else { console.warn('updateCodeForm no encontrado.'); }

        // --- Funcionalidad de Cierre de Modales ---
        if (adminPanelCloseButton) {
            adminPanelCloseButton.addEventListener('click', () => {
                console.log('Botón de cierre del panel de administración clickeado.');
                adminPanelModal.classList.remove('show');
            });
            console.log('Listener para adminPanelCloseButton adjunto.');
        } else { console.warn('adminPanelCloseButton no encontrado.'); }

        // Cierra modales al hacer clic fuera de su contenido (excepto forced-admin-update-modal)
        if (initialAccessModal) {
            initialAccessModal.addEventListener('click', (event) => {
                if (event.target === initialAccessModal) {
                    console.log('Clic fuera del modal de acceso inicial. Cerrando.');
                    initialAccessModal.classList.remove('show');
                }
            });
            console.log('Listener para initialAccessModal (cerrar al clic fuera) adjunto.');
        } else { console.warn('initialAccessModal no encontrado para listener de cierre.'); }

        if (adminLoginModal) {
            adminLoginModal.addEventListener('click', (event) => {
                if (event.target === adminLoginModal) {
                    console.log('Clic fuera del modal de login de administrador. Cerrando.');
                    adminLoginModal.classList.remove('show');
                }
            });
            console.log('Listener para adminLoginModal (cerrar al clic fuera) adjunto.');
        } else { console.warn('adminLoginModal no encontrado para listener de cierre.'); }

        if (adminPanelModal) {
            adminPanelModal.addEventListener('click', (event) => {
                if (event.target === adminPanelModal) {
                    console.log('Clic fuera del modal del panel de administración. Cerrando.');
                    adminPanelModal.classList.remove('show');
                }
            });
            console.log('Listener para adminPanelModal (cerrar al clic fuera) adjunto.');
        } else { console.warn('adminPanelModal no encontrado para listener de cierre.'); }
        // forcedAdminUpdateModal no tiene listener para cerrar al hacer clic fuera (es un bloqueo informativo)


        // --- Manejadores de Clic para Módulos y Botones Principales ---
        function handleModuleClick(moduleName) {
            console.log(`Módulo "${moduleName}" clickeado.`);
            showCustomMessageBox(`Abriendo ${moduleName}...`);

            switch (moduleName) {
                case 'Buscador de Direcciones':
                    window.open('https://www.google.com/maps', '_blank');
                    break;
                case 'Calculadora Boleta':
                    window.open('https://sites.google.com/view/ciclofacturacionwom/p%C3%Aágina-principal', '_blank');
                    break;
                case 'Evaluar RUT':
                    window.open('https://www.wom.cl/paga-aqui/', '_blank');
                    break;
                case 'Condiciones Comerciales':
                    window.open('https://www.ejemplo.com/condiciones-comerciales', '_blank');
                    break;
                case 'Factibilidad':
                    window.open('https://www.ejemplo.com/factibilidad', '_blank');
                    break;
                default:
                    console.log(`No hay URL definida para ${moduleName}`);
                    break;
            }
        }

        function handleIngresoVentaMainClick() {
            console.log('Botón "Ingreso de Venta" principal clickeado.');
            showCustomMessageBox('Abriendo formulario de ingreso de venta...');

            const url = 'https://sites.google.com/view/ciclowom/p%C3%Aágina-principal';

            const width = 800;
            const height = 600;
            const left = (screen.width / 2) - (width / 2);
            const top = (screen.height / 2) - (height / 2);

            const features = `
                width=${width},
                height=${height},
                left=${left},
                top=${top},
                toolbar=no,
                location=no,
                menubar=no,
                scrollbars=yes,
                resizable=yes
            `;
            window.open(url, '_blank', features);
        }

        function handleWhatsAppContactClick() {
            console.log('Botón "Contactar Administrador" clickeado.');
            const url = `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(generalWhatsappMessage)}`;
            window.open(url, '_blank');
            showCustomMessageBox('Abriendo WhatsApp para contactar al administrador...');
        }

        function handleDeployButtonClick() {
            console.log('Botón "DESPLIEGUE" clickeado.');
            showCustomMessageBox('Desplegando herramientas...', 'info');

            const urlsToOpen = [
                'https://www.google.com/maps', // Buscador de Direcciones
                'https://sites.google.com/view/ciclofacturacionwom/p%C3%Aágina-principal', // Calculadora Boleta
                'https://www.wom.cl/paga-aqui/', // Evaluar RUT
                'https://www.ejemplo.com/condiciones-comerciales', // Condiciones Comerciales
                'https://www.ejemplo.com/factibilidad', // Factibilidad
                'https://sites.google.com/view/ciclowom/p%C3%Aágina-principal', // Ingreso de Venta
                'https://www.google.com' // Ejemplo adicional
            ];

            urlsToOpen.forEach(url => {
                window.open(url, '_blank');
            });
        }

        /**
         * Aplica el efecto de magnificación "fisheye" a los ítems del dock
         * basado en su proximidad al centro de la barra de navegación.
         */
        function applyDockEffect() {
            // console.log("applyDockEffect ejecutado."); // Descomentar para depurar el efecto del dock
            if (!navBar) {
                console.warn('navBar no encontrado para applyDockEffect.');
                return;
            }
            const navBarRect = navBar.getBoundingClientRect();
            const navBarCenter = navBarRect.left + navBarRect.width / 2;
            const maxDistanceEffect = navBarRect.width / 2.5; 

            navItems.forEach(item => {
                const icon = item.querySelector('i');
                const textSpan = item.querySelector('span');
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;

                const distance = Math.abs(navBarCenter - itemCenter);
                let scale = 1;
                let textOpacity = 0;
                let textTranslateY = -20; 
                let textScale = 0.9; 

                if (item.classList.contains('active')) {
                    scale = 1.5; 
                    textOpacity = 1;
                    textTranslateY = -60; 
                    textScale = 1; 
                } else if (distance < maxDistanceEffect) {
                    const normalizedDistance = distance / maxDistanceEffect; 
                    scale = 1 + (0.5 * (1 - normalizedDistance * normalizedDistance)); 
                    
                    textOpacity = 1 - normalizedDistance; 
                    textTranslateY = -45 - (scale - 1) * 30; 
                    textScale = 0.9 + (0.1 * (1 - normalizedDistance)); 
                    
                } else {
                    scale = 1;
                    textOpacity = 0;
                    textTranslateY = -20;
                    textScale = 0.9;
                }

                if (icon) icon.style.transform = `scale(${scale})`;
                if (textSpan) {
                    textSpan.style.opacity = textOpacity;
                    textSpan.style.transform = `translateY(${textTranslateY}px) scale(${textScale})`;
                }
            });
        }

        // Debounce para la función de actualización del ítem centrado
        let scrollTimeout;
        if (navBar) {
            navBar.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(applyDockEffect, 50); 
            });
        } else { console.warn('navBar no encontrado para listener de scroll.'); }

        // Llama a applyDockEffect al redimensionar la ventana para ajustar los efectos
        window.addEventListener('resize', applyDockEffect);

        /**
         * Maneja los clics en los elementos de la barra de navegación.
         * Desplaza el ítem clicado al centro y actualiza el estado activo.
         * Incluye verificación de acceso de administrador.
         * @param {Event} event - El evento de clic.
         */
        function handleNavItemClick(event) {
            const clickedItem = event.currentTarget;
            const isAdminRequired = clickedItem.dataset.adminRequired === 'true';
            const navId = clickedItem.id;

            console.log(`Ítem de navegación "${navId}" clickeado. ¿Requiere Admin?: ${isAdminRequired}, ¿Admin Logueado?: ${isAdminLoggedIn}`);

            if (isAdminRequired && !isAdminLoggedIn) {
                showCustomMessageBox('Acceso denegado. Se requiere acceso de administrador.', 'error');
                if (adminLoginModal) adminLoginModal.classList.add('show'); 
                if (adminPasswordInput) adminPasswordInput.value = ''; 
                if (adminLoginMessage) {
                    adminLoginMessage.textContent = ''; 
                    adminLoginMessage.style.display = 'none';
                }
                if (rememberMeCheckbox) rememberMeCheckbox.checked = false; 
                return; 
            }

            navItems.forEach(item => {
                item.classList.remove('active');
            });
            clickedItem.classList.add('active');
            
            clickedItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

            setTimeout(applyDockEffect, 300); 

            switch (navId) {
                case 'nav-home':
                    showCustomMessageBox('Navegando a Inicio...');
                    break;
                case 'nav-contact':
                    showCustomMessageBox('Navegando a Contacto...');
                    handleWhatsAppContactClick();
                    break;
                case 'nav-add':
                    showCustomMessageBox('Navegando a Añadir...');
                    break;
                case 'nav-profile':
                    showCustomMessageBox('Navegando a Perfil...');
                    break;
                case 'nav-admin':
                    showCustomMessageBox('Abriendo Panel de Administrador...');
                    if (adminPanelModal) adminPanelModal.classList.add('show'); 
                    if (currentUniqueCodeDisplay) currentUniqueCodeDisplay.textContent = correctUniqueCode; 
                    if (newUniqueCodeInput) newUniqueCodeInput.value = correctUniqueCode; 
                    break;
                case 'nav-reports':
                    showCustomMessageBox('Navegando a Reportes...');
                    break;
                case 'nav-settings':
                    showCustomMessageBox('Navegando a Configuración...');
                    break;
                case 'nav-messages':
                    showCustomMessageBox('Navegando a Mensajes...');
                    break;
                case 'nav-calendar':
                    showCustomMessageBox('Navegando a Calendario...');
                    break;
                case 'nav-docs':
                    showCustomMessageBox('Navegando a Documentos...');
                    break;
                default:
                    break;
            }
        }

        // Asignación de Event Listeners a los elementos interactivos
        if (moduleDirecciones) moduleDirecciones.addEventListener('click', () => handleModuleClick('Buscador de Direcciones'));
        if (moduleCalculadora) moduleCalculadora.addEventListener('click', () => handleModuleClick('Calculadora Boleta'));
        if (moduleEvaluarRut) moduleEvaluarRut.addEventListener('click', () => handleModuleClick('Evaluar RUT'));
        if (moduleCondicionesComerciales) moduleCondicionesComerciales.addEventListener('click', () => handleModuleClick('Condiciones Comerciales'));
        if (moduleFactibilidad) moduleFactibilidad.addEventListener('click', () => handleModuleClick('Factibilidad'));

        if (btnIngresoVentaMain) btnIngresoVentaMain.addEventListener('click', handleIngresoVentaMainClick);
        if (floatingDeployButton) floatingDeployButton.addEventListener('click', handleDeployButtonClick); 

        navItems.forEach(item => {
            item.addEventListener('click', handleNavItemClick);
        });

        // Inicializa la aplicación
        initializeApp();

        /**
         * Muestra mensajes personalizados (reemplazo de alert()).
         * @param {string} message - El mensaje a mostrar.
         * @param {string} type - El tipo de mensaje ('success', 'error', 'info').
         */
        function showCustomMessageBox(message, type = 'success') {
            let msgBox = document.getElementById('custom-message-box');
            if (!msgBox) {
                msgBox = document.createElement('div');
                msgBox.id = 'custom-message-box';
                document.body.appendChild(msgBox);
            }

            const rootStyles = getComputedStyle(document.documentElement);
            const successColor = rootStyles.getPropertyValue('--message-box-success').trim();
            const errorColor = rootStyles.getPropertyValue('--message-box-error').trim();
            const infoColor = rootStyles.getPropertyValue('--message-box-info').trim();

            if (type === 'success') {
                msgBox.style.backgroundColor = successColor;
            } else if (type === 'error') {
                msgBox.style.backgroundColor = errorColor;
            } else {
                msgBox.style.backgroundColor = infoColor;
            }

            msgBox.textContent = message;
            setTimeout(() => {
                msgBox.style.opacity = '1';
                msgBox.style.transform = 'translateY(0)';
            }, 10);

            setTimeout(() => {
                msgBox.style.opacity = '0';
                msgBox.style.transform = 'translateY(-20px)';
                msgBox.addEventListener('transitionend', function handler() {
                    if (msgBox.style.opacity === '0') {
                        msgBox.remove();
                    }
                    msgBox.removeEventListener('transitionend', handler);
                });
            }, 3000);
        }

        console.log('Scripts cargados y listeners de eventos adjuntos.');
    } catch (error) {
        console.error("Error crítico en la inicialización de la aplicación:", error);
        // Muestra un mensaje de error si algo sale mal durante la carga de la aplicación.
        let errorMsgBox = document.createElement('div');
        errorMsgBox.id = 'critical-error-message';
        errorMsgBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #F44336; /* Rojo de error */
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            z-index: 9999;
            text-align: center;
            font-family: 'Inter', sans-serif;
            font-size: 1.2em;
        `;
        errorMsgBox.textContent = `Error al cargar la aplicación: ${error.message}. Por favor, recarga la página.`;
        document.body.appendChild(errorMsgBox);
    }
});
