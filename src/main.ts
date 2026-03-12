import Webamp from 'webamp';
import butterchurn from 'butterchurn';
import basePresets from 'butterchurn-presets/base';
import extraPresets from 'butterchurn-presets/extra';
import md1Presets from 'butterchurn-presets/md1';
import imagePresets from 'butterchurn-presets/image';
import minimalPresets from 'butterchurn-presets/minimal';
import nonMinimalPresets from 'butterchurn-presets/nonMinimal';

/**
 * Función principal de inicialización de la aplicación.
 * Gestiona la carga de Webamp, selectores de Milkdrop, skins y reactividad de audio.
 */
async function bootstrap() {
    // Referencias a elementos del DOM
    const appContainer = document.getElementById('app');
    const skinSelect = document.getElementById('skin-select') as HTMLSelectElement;
    const presetSelect = document.getElementById('preset-select') as HTMLSelectElement;
    const favBtn = document.getElementById('fav-btn');
    const restoreBtn = document.getElementById('restore-player');
    
    // Verificación de seguridad: Asegurar que los elementos críticos existen
    if (!appContainer || !skinSelect || !presetSelect || !favBtn || !restoreBtn) {
        console.error("WebAmp: Elementos críticos de la interfaz no encontrados.");
        return;
    }

    // --- LÓGICA DE FAVORITOS (Milkdrop) ---
    // Persistencia simple mediante LocalStorage
    let favorites: string[] = JSON.parse(localStorage.getItem('milkdrop-favorites') || '[]');
    
    /** Actualiza el icono (estrella) según si el preset actual es favorito */
    const updateFavIcon = (name: string) => {
        if (favorites.includes(name)) {
            favBtn.textContent = '★';
            favBtn.classList.add('active');
        } else {
            favBtn.textContent = '☆';
            favBtn.classList.remove('active');
        }
    };

    // Evento de clic para añadir/quitar favoritos
    favBtn.addEventListener('click', () => {
        const currentPreset = presetSelect.value;
        if (!currentPreset) return;
        if (favorites.includes(currentPreset)) {
            favorites = favorites.filter(f => f !== currentPreset);
        } else {
            favorites.push(currentPreset);
        }
        localStorage.setItem('milkdrop-favorites', JSON.stringify(favorites));
        updateFavIcon(currentPreset);
        populatePresets(); // Recargar lista para mostrar estrellas en las opciones
    });

    // --- GESTIÓN DE PRESETS (MILKDROP) ---
    // Consolidación de todos los paquetes de presets disponibles
    const allPresetsDict: Record<string, any> = {
        ...basePresets, ...extraPresets, ...md1Presets, ...imagePresets, ...minimalPresets, ...nonMinimalPresets
    };
    const presetNames = Object.keys(allPresetsDict).sort();

    /** Rellena el elemento <select> con los nombres de los presets y marcas de favoritos */
    const populatePresets = () => {
        const current = presetSelect.value;
        presetSelect.innerHTML = presetNames.map(name => {
            const isFav = favorites.includes(name) ? '★ ' : '';
            return `<option value="${name}">${isFav}${name}</option>`;
        }).join('');
        // Mantener la selección actual tras el refresco
        if (current && presetNames.includes(current)) {
            presetSelect.value = current;
        }
    };
    populatePresets();

    // --- GESTIÓN DE SKINS (APARIENCIAS) ---
    // Lista de skins locales alojadas en /public/skins
    const availableSkins = [
        { name: "Base 2.91", url: "skins/base-2.91.wsz" },
        { name: "Dale Earnhardt", url: "skins/Dale_Earnhardt_Red_Taz_3_Car.wsz" },
        { name: "F-22 Raptor", url: "skins/F-22_Raptor_Amp.wsz" },
        { name: "Frutiger Aero", url: "skins/Frutiger Aero.wsz" },
        { name: "GTA San Andreas", url: "skins/GTA_San_Andreas.wsz" },
        { name: "Homer 3D", url: "skins/Homer_Simpson_Goes_3D.wsz" },
        { name: "Tupac rap", url: "skins/Tu_Pac_-_King_of_Rap.wsz" },
        { name: "WWE RAW", url: "skins/WWE_RAW_Skin.wsz" },
        { name: "Blink 182", url: "skins/blink_182_rock.wsz" },
        { name: "Ferrari F1", url: "skins/F1_2002_-_Ferrari.wsz" },
        { name: "Zerg Classic", url: "skins/zerg_winamp_classic_skin_by_ldaisuke_ddg5gfq.wsz" }
    ];
    skinSelect.innerHTML = availableSkins.map(skin => `<option value="${skin.url}">${skin.name}</option>`).join('');

    // --- CONFIGURACIÓN DE WEBAMP ---
    const webamp = new Webamp({
        initialTracks: [], // Empezar con lista vacía
        __aboutUrl: "https://skins.webamp.org/",
        initialSkin: { url: "skins/base-2.91.wsz" },
        __butterchurnOptions: {
            importButterchurn: () => Promise.resolve(butterchurn),
            getPresets: () => Promise.resolve(presetNames.map(name => ({ name, butterchurnPresetObject: allPresetsDict[name] }))),
            butterchurnOpen: true
        },
        // Layout centrado para simular experiencia de escritorio
        windowLayout: {
            main: { position: { top: 0, left: 0 } },
            equalizer: { position: { top: 116, left: 0 } },
            playlist: { position: { top: 232, left: 0 } },
            milkdrop: { position: { top: 0, left: 275 } }
        }
    } as any);

    // --- RESTAURACIÓN Y MONITORIZACIÓN DE VENTANAS ---
    /** Controla la visibilidad del botón de rescate cuando se cierra el reproductor */
    const updateRestoreBtnVisibility = () => {
        // @ts-ignore (Acceso al store interno de Redux de Webamp)
        if (webamp.store) {
            // @ts-ignore
            const state = webamp.store.getState();
            // Verificamos si la ventana principal está abierta
            const isMainOpen = state.windows.genWindows.main?.open;
            restoreBtn.style.display = isMainOpen ? 'none' : 'flex';
        }
    };

    /** Suscribe la interfaz a los cambios de estado de las ventanas */
    const monitorWindowState = () => {
        // @ts-ignore
        if (webamp.store) {
            // @ts-ignore
            webamp.store.subscribe(updateRestoreBtnVisibility);
            updateRestoreBtnVisibility();
        }
    };

    // Acción para re-abrir ventanas si el usuario las cierra
    restoreBtn.addEventListener('click', () => {
        // @ts-ignore
        if (webamp.store) {
            // @ts-ignore
            webamp.store.dispatch({ type: "OPEN_WINDOW", windowId: "main" });
            // @ts-ignore
            webamp.store.dispatch({ type: "OPEN_WINDOW", windowId: "milkdrop" });
        }
    });

    // --- REACTIVIDAD DE AUDIO (FONDO DINÁMICO) ---
    /** Inicializa el Analizador de Audio de la web para modificar el CSS en tiempo real */
    const initAudioReactivity = () => {
        // Intentamos obtener el elemento de audio interno de Webamp
        // @ts-ignore
        const audio = webamp._audio || (webamp as any).media?._audio;
        if (!audio) return;

        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(context.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        /** Loop de animación que ajusta variables CSS basadas en la intensidad del audio */
        const updateBackground = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < 10; i++) sum += dataArray[i]; // Analizar frecuencias bajas (bajos)
            const avg = sum / 10;
            const intensity = avg / 255;

            // Inyectar valores en variables CSS personalizadas del :root
            document.documentElement.style.setProperty('--bg-scale', `${1 + intensity * 0.05}`);
            document.documentElement.style.setProperty('--bg-brightness', `${0.8 + intensity * 0.4}`);
            document.documentElement.style.setProperty('--bg-hue', `${intensity * 10}deg`);

            requestAnimationFrame(updateBackground);
        };
        
        webamp.onPlay(() => {
            if (context.state === 'suspended') context.resume();
            updateBackground();
        });
    };

    // --- GESTIÓN DE EVENTOS DE INTERFAZ ---
    // Cambio manual de skins
    skinSelect.addEventListener('change', (e) => {
        try {
            webamp.setSkinFromUrl((e.target as HTMLSelectElement).value);
        } catch (err) {
            console.warn("WebAmp: Error al cambiar de skin.", err);
        }
    });

    /** Aplica un preset de Milkdrop por su índice en la lista global */
    const applyPresetByIndex = (index: number) => {
        // @ts-ignore - Despachamos acciones directamente al store para forzar el cambio inmediato
        if (webamp.store && index !== -1) {
            // @ts-ignore
            webamp.store.dispatch({ type: "SELECT_PRESET_AT_INDEX", index, transitionType: 1 });
            // @ts-ignore
            webamp.store.dispatch({ type: "PRESET_REQUESTED", index, addToHistory: true });
            if (presetNames[index]) updateFavIcon(presetNames[index]);
        }
    };

    // Cambio manual de presets de Milkdrop
    presetSelect.addEventListener('change', (e) => {
        const index = presetNames.indexOf((e.target as HTMLSelectElement).value);
        applyPresetByIndex(index);
    });

    // Cambio automático de preset con cada nueva canción (Variety Mode)
    webamp.onTrackDidChange(() => {
        const randomIndex = Math.floor(Math.random() * presetNames.length);
        const name = presetNames[randomIndex];
        if (name) {
            presetSelect.value = name;
            applyPresetByIndex(randomIndex);
        }
    });

    // Lógica del Modal de Ayuda (UI General)
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeModal = document.getElementById('close-modal');
    if (helpBtn && helpModal && closeModal) {
        helpBtn.addEventListener('click', () => helpModal.style.display = 'flex');
        closeModal.addEventListener('click', () => helpModal.style.display = 'none');
        helpModal.addEventListener('click', (e) => e.target === helpModal && (helpModal.style.display = 'none'));
    }

    // --- ARRANQUE FINAL ---
    try {
        // Renderizar en el contenedor #app cuando todo esté listo
        await webamp.renderWhenReady(appContainer);
        initAudioReactivity();
        monitorWindowState();
        
        // Limpieza de marca blanca: Ocultar enlaces externos de Webamp en menús contextuales
        setInterval(() => {
           document.querySelectorAll('.webamp-context-menu li').forEach(li => {
               const text = li.textContent?.toLowerCase() || '';
               if (text.includes('webamp') || text.includes('github') || text.includes('twitter')) {
                   (li as HTMLElement).style.display = 'none';
               }
           });
        }, 1000);
    } catch (e) {
        console.error("WebAmp Bootstrap Error:", e);
    }
}

// Asegurar que el DOM esté cargado antes de ejecutar la lógica
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', bootstrap) : bootstrap();
