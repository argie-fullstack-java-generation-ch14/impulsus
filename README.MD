# 🚀 Impulsus

> *"Minima decisiones, magna incrementa."*  
> *(Pequeñas decisiones, grandes avances).*

**Impulsus** es un planificador de tareas minimalista desarrollado con JavaScript, HTML5 y CSS3. Inspirado en la filosofía del **Efecto Compuesto**, la aplicación está diseñada bajo la premisa de que las metas extraordinarias no se alcanzan de golpe, sino mediante la acumulación constante de pequeñas acciones y decisiones diarias.

---

## 💡 Filosofía del Proyecto

El nombre **Impulsus** proviene del latín (*empuje, estímulo, fuerza en movimiento*). 

A diferencia de las listas de tareas convencionales que generan abrumación, **Impulsus** busca transformar cada tarea completada en un catalizador de inercia positiva. Cada pequeña casilla marcada es un paso que reduce la distancia entre tu estado actual y tus metas a largo plazo.

---

## ✨ Características Principales

- 🎯 **Gestión de Tareas Eficiente:** Crea, edita, organiza y elimina tareas de forma rápida y sencilla.
- ⚡ **Efecto Inercia:** Retroalimentación visual interactiva al completar tareas para reforzar la sensación de progreso.
- 💾 **Persistencia de Datos:** Guarda tus tareas e historial automáticamente en el navegador utilizando `localStorage`.
- 🎨 **Diseño Minimalista & Responsive:** Interfaz limpia y enfocada, adaptable a dispositivos móviles y de escritorio.
- 🌙 **Modo Enfoque:** Interfaz optimizada para evitar distracciones y mantener la atención en el siguiente paso.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica y accesible.
- **CSS3:** Estilos personalizados, variables CSS, Flexbox/Grid y animaciones para la experiencia de usuario.
- **JavaScript (ES6+):** Lógica de la aplicación, manipulación del DOM y gestión del almacenamiento local (`localStorage`).

---

## 🚀 Instalación y Uso Local

No requiere dependencias ni gestores de paquetes. El proyecto es 100% estático, pero necesita un servidor local porque los componentes se cargan con `fetch` (no funciona abriendo el HTML con `file://`).

1. Clona este repositorio:
   ```bash
   git clone https://github.com/argie-fullstack-java-generation-ch14/impulsus.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd impulsus
   ```
3. Abre el proyecto en VS Code con la extensión **Live Server**
   instalada, haz clic derecho sobre
   `src/index.html` → **Open with Live Server**
4. El tablero se abre en:
   ```
   http://127.0.0.1:5500/src/index.html
   ```

> 💡 El prototipo original en Tailwind quedó guardado en `src/old-index.html`.

---

## 📈 Próximos Pasos (Roadmap)

- [ ] Contador de racha (*Streak tracker*) para medir días consecutivos en movimiento.
- [ ] Categorización de tareas por áreas de vida (Salud, Trabajo, Proyectos).
- [ ] Selector de temas (Modo Claro / Modo Oscuro).
- [ ] Exportación e importación de datos en formato JSON.

---