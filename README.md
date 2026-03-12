# 🎶 WebAmp + Butterchurn: Classic Music Visualizer XP

![Versión](https://img.shields.io/badge/Versi%C3%B3n-1.2.0-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)
![Aesthetics](https://img.shields.io/badge/Est%C3%A9tica-Frutiger%20Aero-cyan)

Una experiencia musical retro definitiva que combina el legendario **Webamp** (Winamp 2.9) con el potente motor de visualización **Milkdrop (Butterchurn)**, todo envuelto en una interfaz premium inspirada en la era de **Windows XP y Frutiger Aero**.

## 🌟 Características Destacadas

### 1. Reproductor Winamp 2.9 (Webamp)
*   **Fidelidad Total**: Motor de audio preciso con soporte para MP3 y otros formatos mediante arrastre (Drag & Drop).
*   **Soporte de Skins**: Incluye 11 skins locales (GTA San Andreas, Tupac, Ferrari, etc.) y soporte para cargar archivos `.wsz` externos.
*   **Layout Optimizado**: Ventanas posicionadas inteligentemente para maximizar el área visual de Milkdrop.

### 2. Motor de Visualización Milkdrop (Butterchurn)
*   **Variedad Infinita**: Integración de más de 600 presets (estilos) categorizados (Base, Extra, MD1, Image, Minimal).
*   **Modo Aleatorio Automático**: El visualizador cambia de estilo automáticamente con cada pista para una experiencia siempre fresca.
*   **Sistema de Favoritos**: Marca tus efectos favoritos con una estrella (★) para que se guarden en tu navegador (LocalStorage).

### 3. Interfaz Premium & Reactiva
*   **Fondo Dinámico Bliss**: El icónico fondo de Windows XP reacciona al ritmo de la música (brillo, escala y tono) mediante el análisis de frecuencias en tiempo real.
*   **Estética Frutiger Aero**: Controles con efecto **Dynamic Glass** (cristal dinámico) y reflejos interactivos al pasar el ratón.

## 🛠️ Stack Tecnológico

*   **Core**: [Webamp](https://github.com/captbaritone/webamp) & [Butterchurn](https://github.com/jordaneldredge/butterchurn)
*   **Entorno**: [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Diseño**: CSS3 (Vanilla) con técnicas de Glassmorphism.
*   **Visualización**: Web Audio API & WebGL.

## 📁 Estructura del Proyecto

```text
/
├── public/                # Activos estáticos
│   ├── skins/             # Colección de archivos .wsz
│   └── *.jpg/*.png        # Fondos y recursos de branding
├── src/
│   ├── main.ts            # Lógica central, eventos y Webamp bootstrap
│   └── style.css          # Diseño completo (Aero Theme + Animaciones)
├── index.html             # Esqueleto de la App y contenedores UI
└── package.json           # Dependencias y scripts
```

## 🚀 Instalación y Desarrollo

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. **Clonar el repositorio**:
   ```bash
   git clone [url-del-repo]
   cd Proyecto3
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## 📖 Guía de Uso Académico/Desarrollo

### Añadir Nuevas Skins
Para añadir una skin, copia el archivo `.wsz` en `public/skins/` y añádela al array `availableSkins` en `src/main.ts`:
```typescript
{ name: "Nombre Visual", url: "skins/tu_archivo.wsz" }
```

### Reactividad de Audio
La lógica del fondo dinámico utiliza el `AnalyserNode` de la Web Audio API. Las variables CSS `--bg-scale` y `--bg-brightness` se actualizan a 60fps basándose en la intensidad de los bajos detectados.

### Persistencia de Favoritos
Los favoritos de Milkdrop se almacenan serializados en el `localStorage` del navegador bajo la clave `milkdrop-favorites`, asegurando que tus preferencias se mantengan incluso tras cerrar la pestaña.

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Las librerías Webamp y Butterchurn pertenecen a sus respectivos creadores. El fondo "Bliss" es propiedad de Microsoft.

---
*Hecho con ❤️ por **PelayoHer** para los amantes de la música y la nostalgia de los 2000.*
