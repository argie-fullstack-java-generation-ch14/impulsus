# 🚀 Impulsus

> *"Minima decisiones, magna incrementa."*
> *(Pequeñas decisiones, grandes avances).*

**Impulsus** es un planificador de tareas minimalista desarrollado con JavaScript, HTML5 y CSS3. Este proyecto está profundamente inspirado en la filosofía de uno de mis libros favoritos, **"El Efecto Compuesto" (*The Compound Effect*) de Darren Hardy**, diseñado bajo la premisa de que las metas extraordinarias no se alcanzan con cambios drásticos de la noche a la mañana, sino mediante la acumulación constante y silenciosa de pequeñas acciones diarias.

---

## 💡 Filosofía del Proyecto y Premisa del Libro

El nombre **Impulsus** proviene del latín (*empuje, estímulo, fuerza en movimiento*).Su propósito es visibilizar cada paso y tarea pequeña, permitiendo llevarla a la acción de forma inmediata y sin distracciones, mantener el control del progreso y transformar cada avance completado en un catalizador de inercia positiva..

Nuestra arquitectura conceptual y diseño adoptan los **cuatro pilares fundamentales** de la filosofía del *Efecto Compuesto*:

1. **La fórmula fundamental del éxito:** Tus resultados a largo plazo son el producto directo de la ecuación: *Elecciones + Comportamiento + Hábitos + Tiempo = Resultados*. No son los golpes de suerte ni los eventos aislados los que definen tu camino, sino las micro-decisiones que tomas todos los días.
2. **El interés compuesto aplicado a los hábitos:** Al igual que el dinero en una cuenta de ahorros, las acciones cotidianas generan un rendimiento exponencial con el tiempo. A corto plazo los cambios parecen imperceptibles (lo que hace que muchos abandonen), pero a largo plazo crean una curva de crecimiento masiva. Cada pequeña casilla que marcas en Impulsus es un interés acumulado a tu favor.
3. **La superación de la gratificación instantánea:** El mayor obstáculo del progreso es la trampa cultural de buscar resultados mágicos inmediatos y subestimar el poder de los pequeños pasos diarios. Impulsus te ayuda a anclarte en el presente y valorar el proceso constante.
4. **Responsabilidad radical:** Todo lo que logras o dejas de lograr es el acumulado de tus propias elecciones pasadas. Al entender que tú tienes el control absoluto de tus rutinas, recuperas el poder de rediseñar tu futuro paso a paso.

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

## 🧩 Arquitectura Reactiva

La board se mantiene sincronizada con los datos gracias a dos "observadores" con roles distintos.

### TaskManager: `subscribe()` y `notify()` (patrón Observer)

`src/js/taskManager.js` implementa el patrón **Observer** para que la UI reaccione a los cambios de datos sin que nadie la llame manualmente:

- El constructor guarda los suscriptores en `this.listeners` (un `Set`).
- Cada método que muta la lista (`addTask`, `deleteTask`, `updateTask`) termina llamando a `this.notify()`.
- `subscribe(listener)`: registra una función que se ejecutará en cada cambio y devuelve otra función para cancelar la suscripción.
- `notify()`: recorre `listeners` y ejecuta cada uno pasándole `this.taskList`.

El flujo real de la app cuando creas una tarea desde el formulario:

```text
task-form (submit) → taskManager.addTask(newTask) → notify() → renderTaskCards() → board actualizada
```

`src/components/task-card/task-card.js` es quien se suscribe al final de su script:

```js
taskManager.subscribe(renderTaskCards);
```

Así, cualquier `addTask`/`deleteTask`/`updateTask` (de hoy o de un módulo futuro) repinta la board sola. Si nunca más quieres recibir notificaciones, guarda el retorno y llámalo:

```js
const unsubscribe = taskManager.subscribe(renderTaskCards);
// ... más adelante
unsubscribe();
```

### MutationObserver (API nativa del navegador)

`MutationObserver` observa cambios en el **DOM** (elementos añadidos/quitados, atributos, texto). En este proyecto se usa como espera del bootstrapping: los componentes se inyectan con `fetch` (asíncrono), así que cuando `task-card.js` se ejecuta todavía **no existen** los `<div id="taskColumnPending">...` donde irían las cards.

```js
if (!renderTaskCards()) {
  const observer = new MutationObserver(() => {
    if (renderTaskCards()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
```

- `renderTaskCards()` devuelve `false` si los contenedores de las columnas aún no están; el primer intento falla y se activa el observer.
- `{ childList: true, subtree: true }`: avísame si en cualquier punto del `body` entran/salen nodos.
- Cada vez que `renderPartial` inyecta los partials, el callback reintenta; cuando el render finalmente pinta, `observer.disconnect()` lo apaga.

### ¿Quién hace qué?

| Observador | Observa | Vida útil | Rol |
|---|---|---|---|
| `MutationObserver` (navegador) | Cambios del DOM | Hasta el primer render exitoso | Esperar a que existan las columnas inyectadas con `fetch` |
| `subscribe`/`notify` (TaskManager) | Cambios en `taskList` (datos JS) | Permanente | Repintar la board cada vez que cambian los datos |

> ⚠️ Un `MutationObserver` no puede vigilar un array de JavaScript: solo ve el DOM. Por eso la reactividad de datos vive en el TaskManager.

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