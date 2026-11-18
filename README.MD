# 🚀 Impulsus

> *"Minima decisiones, magna incrementa."*
> *(Pequeñas decisiones, grandes avances).*

**Impulsus** es un planificador de tareas minimalista desarrollado con JavaScript, HTML5 y CSS3. Este proyecto está profundamente inspirado en la filosofía de uno de mis libros favoritos, **"El Efecto Compuesto" (*The Compound Effect*) de Darren Hardy**, diseñado bajo la premisa de que las metas extraordinarias no se alcanzan con cambios drásticos de la noche a la mañana, sino mediante la acumulación constante y silenciosa de pequeñas acciones diarias.

---

## 💡 Filosofía del Proyecto y Fuente de Inspiración

El nombre **Impulsus** proviene del latín (*empuje, estímulo, fuerza en movimiento*).Su propósito es visibilizar cada paso y tarea pequeña, permitiendo llevarla a la acción de forma inmediata y sin distracciones, mantener el control del progreso y transformar cada avance completado en un catalizador de inercia positiva.

Esta visión toma forma a partir de la filosofía del libro *El Efecto Compuesto*, partiendo de su premisa central: los resultados a largo plazo son el producto directo de una ecuación silenciosa donde las micro-decisiones cotidianas —aunque parezcan imperceptibles al principio, justo en el punto donde la mayoría abandona— generan con constancia una curva de crecimiento exponencial.

A partir de esta idea, la experiencia y el diseño de **Impulsus** se sostienen sobre **cuatro pilares fundamentales**:

1. **La fórmula fundamental del éxito:** Tus resultados a largo plazo responden directamente a la ecuación *Elecciones + Comportamiento + Hábitos + Tiempo = Resultados*. No son los eventos aislados los que definen tu camino, sino las pequeñas decisiones que sostienes todos los días.
2. **El interés compuesto aplicado a los hábitos:** Al igual que el capital en una cuenta de ahorros, las acciones diarias generan un rendimiento acumulativo con el tiempo. Cada pequeña casilla que marcas en Impulsus representa un interés ganado a tu favor que, a mediano y largo plazo, transforma tu progreso.
3. **La superación de la gratificación instantánea:** El mayor obstáculo para avanzar es la trampa cultural de buscar resultados mágicos inmediatos y subestimar el valor de los pasos pequeños. Impulsus te ayuda a anclarte en el presente y a disfrutar la constancia del proceso.
4. **Responsabilidad radical:** Todo lo que logras o dejas de lograr es el reflejo acumulado de tus propias elecciones pasadas. Al hacer visible cada tarea y asumir el control de tus rutinas, recuperas el poder de rediseñar tu futuro paso a paso.

---

## ✨ Características Principales

- 🎯 **Gestión de Tareas Eficiente:** Crea, edita, organiza y elimina tareas de forma rápida y sencilla.
- ⚡ **Efecto Inercia:** Retroalimentación visual interactiva al completar tareas para reforzar la sensación de progreso.
- 💾 **Persistencia de Datos:** Guarda tus tareas e historial automáticamente en el navegador utilizando `localStorage`.
- 🎨 **Diseño Minimalista & Responsive:** Interfaz limpia y enfocada, adaptable a dispositivos móviles y de escritorio.
- 🌙 **Modo Enfoque:** Interfaz optimizada para evitar distracciones y mantener la atención en el siguiente paso.

---

## 🗂️ Categorías y Áreas de Impacto

Bajo la premisa del *Efecto Compuesto*, cada pequeña decisión construye un resultado en un área específica de tu vida. **Impulsus** clasifica tus tareas en **8 categorías clave** para que identifiques de un vistazo en qué dimensión personal estás generando inercia y dónde estás invirtiendo tu energía diaria:

- 🌱 **Hábitos y Mentalidad:** Rutinas ancla y entrenamiento mental diario que construyen disciplina a través de pequeñas acciones constantes.
- 👔 **Maestría y Carrera:** Objetivos profesionales, estudio técnico profundo, bootcamps y desarrollo de habilidades clave.
- 🏋️ **Vitalidad y Cuerpo:** Entrenamiento físico, ejercicio diario, deportes, artes marciales y cuidado activo de la salud corporal.
- 🪧 **Hitos de Vida:** Metas trascendentales y de largo aliento que marcan un antes y un después personal.
- 💰 **Necesidades e Inversión:** Gastos prioritarios, compras indispensables para el bienestar o herramientas que sostienen tu día a día.
- 🎭 **Esparcimiento y Hobbies:** Talleres artísticos, actividades creativas y tiempo libre con propósito.
- 🎁 **Deseos y Gustos:** Recompensas y compras no urgentes planificadas para disfrutar sin culpa.
- ⚡ **Acción Transitoria:** Tareas puntuales, diligencias o imprevistos del día a día que se resuelven una vez y liberan espacio mental.

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

## ⚙️ Estrategias Técnicas del Proyecto

Sin framework ni backend, Impulsus tuvo que resolver a mano varios problemas que en otros proyectos resuelven las librerías. Estas son las estrategias adoptadas, qué problema resuelve cada una y dónde están en el código. La reactividad de datos (`subscribe`/`notify`) y el arranque diferido con `MutationObserver` ya se explican en **Arquitectura Reactiva**; aquí se cubren las demás.

### 1. Componentes reutilizables sin framework

El proyecto no usa ningún framework de front-end. Para no repetir código, imita dos patrones de componentes reutilizables.

#### Inyección por `fetch()` de HTML externo

`src/index.html` es un *shell*: no contiene el markup de los componentes, solo contenedores vacíos donde se inyectan —`#sidebar`, `#header`, `#taskColumnsStatus`, `#taskFormModalMount`— y una única secuencia que los pide al servidor (`src/js/app.js:6-12`):

```js
await renderPartial("#sidebar", "sidebar/bar/index.html");
await renderPartial("#header", "header/index.html");
await renderPartial("#taskColumnsStatus", "task-columns-status/index.html");
await renderPartial("#taskFormModalMount", "task-form/index.html");
await renderPartial("#taskCommentsPanel", "task-comments/index.html");
```

`renderPartial(selector, name)` (`src/js/ui.js:31-41`) resuelve el nombre contra `componentsBase` (`ui.js:7`), trae el fragmento con `fetch()` e inyecta el HTML en el contenedor. El orden importa: `#taskCommentsPanel` vive dentro del partial de la modal, por eso se inyecta después.

Esta técnica es el patrón de **plantillas parciales** (*partials*): un fragmento de HTML que se escribe una vez y se incluye donde hace falta. Si mañana cambia el sidebar, se edita un archivo y los contenedores que lo montan quedan actualizados; copiar y pegar el markup sería repetirlo en cada lugar y multiplicar las oportunidades de que alguna copia quede desactualizada (**DRY**: *Don't Repeat Yourself*).

El patrón no es invento de ningún framework moderno: es tan viejo como el `include` de PHP, y cada tecnología lo trae con otro nombre:

| Entorno | Cómo incluye un partial |
|---|---|
| PHP puro | `<?php include 'partials/header.php'; ?>` |
| Laravel (PHP) | Blade: `@include('partials.header')` |
| Symfony (PHP) | Twig: `{{ include('partials/header.html.twig') }}` |
| Ruby on Rails | `render partial: "header"` — de aquí viene el nombre "partial" |
| Handlebars | `{{> header }}` |

La diferencia es **quién hace el include**: en PHP, Rails, Blade o Twig lo hace el servidor antes de enviar la página; Impulsus no tiene servidor, así que lo hace el navegador con `fetch()`.

A diferencia de otros setups, `renderPartial` no inyecta CSS ni `<script>`: los estilos y scripts de los componentes se declaran una sola vez en `index.html:23-37` y `index.html:70-92`. Lo que sí hace es reescribir las rutas relativas del fragmento (`resolveLinks`, `ui.js:17-29`), y los componentes con comportamiento propio se enlazan cuando su markup ya existe, esperándolo con `MutationObserver` (ver **Arquitectura Reactiva**).

⚠️ Como usa `fetch()`, el sitio **debe servirse por HTTP**; abrirlo con `file://` deja los contenedores vacíos.

#### Template strings (componentes con datos dinámicos)

Cuando el HTML depende de datos, cada componente expone una función que devuelve un *template string* y el consumidor lo pinta con `innerHTML`. Ejemplos:

- `taskCardTemplate(card)` → `src/components/task-card/card/task-card.js:19`.
- `statusChipTemplate`, `tagChipTemplate`, `tagsRowTemplate` → `src/components/task-card/chip/chip.js:19`, `:29`, `:33`.
- `taskCategoryAvatarTemplate` / `taskCategorySlotTemplate` → `src/components/task-category/task-category.js:52`, `:63`.
- `metricCardTemplate` → `src/components/metric-card/metric-card.js:30`.
- `teamCardTemplate` → `src/components/task-card/team/team-card.js:1`.
- `userAvatarTemplate` → `src/components/user-avatar/user-avatar.js:1`.
- `commentItemTemplate` / `emptyStateTemplate` → `src/components/task-comments/task-comments.js:51`, `:85`.
- `navItemTemplate` → `src/components/sidebar/item/sidebar-item.js:17`.
- `tooltipButtonTemplate` / `optionsTooltipTemplate` → `src/components/task-card/tooltip/tooltip.js:1`, `:11`.

El patrón se repite: la función recibe el dato, arma los fragmentos condicionales antes del template (por ejemplo `commentsCountHtml`, `assigneeHtml` y `dueDateHtml` en `task-card.js:32-77`) y devuelve el HTML completo. `renderTaskCards()` pinta cada columna con `.map().join("")` (`task-card.js:112-121`):

```js
tasks.map(taskCardTemplate).join("")
```

#### Cuándo usar cada técnica

| Estrategia | Cuándo usarla | Dónde vive |
|---|---|---|
| `fetch()` + HTML externo | Markup compartido y estático (sidebar, header, columnas, modal de tarea) | `src/components/` con `index.html`, inyectado desde `src/js/ui.js` |
| Template strings | HTML que depende de datos (cards, chips, métricas, comentarios) | `src/components/` con `.js`, pintado por quien consume el dato |

### 2. Rutas ancladas al script, no a la página

Los partials se piden con `fetch()` y los enlaces se escriben una sola vez, relativos a la carpeta del script. Si cada script resolviera sus rutas contra la página actual (`location.href`), el resultado cambiaría según desde dónde se sirva la app.

La solución está en `src/js/ui.js:1-7`: la base se calcula a partir de **la URL del propio script** (`document.currentScript.src`), y de ahí derivan todas las demás:

```js
const appBase = new URL("../", document.currentScript.src).href;  // src/
const componentsBase = new URL("components/", appBase).href;      // src/components/
```

`renderPartial` usa `componentsBase` para pedir los partials, y `resolveLinks` (`ui.js:17-29`) reescribe los `<a href>` e `<img src>` relativos del fragmento contra `appBase`, saltándose los que ya son ancla (`#`), absolutos (`/`, `//`) o con protocolo. Resultado: la base vive en un solo archivo y el markup de cada partial se escribe relativo a `src/`, sin saber en qué contenedor se va a montar.

> Nota: el proyecto no usa módulos ES, así que no hay `import.meta.url`. Todos los scripts son clásicos y se cargan en orden desde `index.html`; si se migrara a módulos, el mismo principio se aplica con `import.meta.url`.

### 3. Una sola fuente de verdad: el singleton `taskManager`

Los datos no viven en cada componente: existe **una única instancia** de `TaskManager`, creada en `src/js/app.js:1` y expuesta en `window.taskManager` solo para depurar (`app.js:4`):

```js
const taskManager = new TaskManager();
window.taskManager = taskManager;
```

Todos los componentes leen y mutan a través de esa instancia (`getTasksWithStatus`, `addTask`, `updateTask`, `addComment`...), y nadie fuera de `TaskManager` toca `localStorage`. La persistencia y el repintado quedan centralizados: cada mutación guarda y llama a `notify()` (ver **Arquitectura Reactiva**).

Esto también resuelve el orden de carga: `index.html:70-74` carga `users.js`, `task.js`, `taskManager.js`, `ui.js` y `app.js` antes que los componentes (`index.html:75-92`). Como la instancia es global y síncrona, ningún componente necesita un event bus ni esperar un evento para saber que el `taskManager` existe.

### 4. localStorage como entrada no confiable

Las tareas viven en `localStorage` bajo la clave `impulsus.tasks` (`taskManager.js:1`), que es texto editable por cualquiera: el usuario, otra pestaña, una extensión. Tratarlo como fuente confiable rompería la app con un JSON corrupto.

Por eso `loadFromStorage()` (`taskManager.js:11-21`) nunca usa el contenido tal cual:

```js
const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)); // dentro de try/catch
if (!Array.isArray(stored)) return [];                        // debe ser un array
return stored.map((task) =>
  Array.isArray(task?.comments) ? task : { ...task, comments: [] }
);
```

Si el JSON está roto o tiene una forma inesperada, se devuelve una lista vacía y la app arranca normal. Además:

- `idTask` se recalcula con `Math.max` sobre los ids cargados (`taskManager.js:8`), así los ids siguen siendo monotónicos aunque el storage se haya editado.
- `saveToStorage()` (`taskManager.js:23-29`) también está protegido con `try/catch`, por si el almacenamiento está lleno o deshabilitado.

> Límite honesto: se valida la forma (array, `comments` como arreglo) y la monotonía de los ids, no cada campo de negocio.

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
- [x] 🗂️ **Categorización por Áreas de Impacto:** Clasifica cada tarea en 8 dimensiones clave para visualizar rápidamente en qué área de tu vida estás acumulando progreso.
- [ ] Selector de temas (Modo Claro / Modo Oscuro).
- [ ] Exportación e importación de datos en formato JSON.

---