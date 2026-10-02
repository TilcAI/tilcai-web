# Tokens de diseño y componentes base — WEB-04

Estado: implementado en `src/app/globals.css`, pendiente de revisión del equipo.
Referencia: plan web §5.1–5.3 y §16.2. Paleta obsidiana + cian glacial, Geist Sans y
Geist Mono. La verificación de contraste es ejecutable:
`node scripts/check-contrast.mjs` (sin dependencias; sale con código 1 si falla un par).

Los tokens son una sola fuente de verdad: los componentes leen estos nombres. No
sustituyen ningún logo; la marca nueva sigue sin aprobarse
([exploración del isotipo](brand-exploration.md)).

## Color (§5.1)

| Token | Valor | Uso |
| --- | --- | --- |
| `--background` | `#080c12` | Fondo general |
| `--background-alt` | `#0c131d` | Alternancia de secciones |
| `--surface` | `#121c29` | Cards y paneles |
| `--surface-raised` | `#192638` | Panel seleccionado o elevado |
| `--text-primary` | `#f4f8fc` | Títulos y texto principal |
| `--text-secondary` | `#b7c6d8` | Texto explicativo |
| `--text-muted` | `#91a3b8` | Metadatos |
| `--brand` | `#35d6ed` | Conexión, selección, acciones, enlaces |
| `--brand-hover` | `#6be3f4` | Estado hover de la acción principal y de los enlaces |
| `--brand-deep` | `#127fa0` | **Solo decorativo**: profundidad, bordes de acento. No usar como texto pequeño sobre oscuro |
| `--on-brand` | `#05161c` | Texto oscuro sobre fondo cian (botón principal) |
| `--heritage-amber` | `#dcaa66` | Firma de marca y foco puntual (eyebrow, anillo de foco) |
| `--positive` | `#74d6b0` | Permitido o confirmado |
| `--attention` | `#e7c37d` | Requiere revisión |
| `--negative` | `#ee969f` | Bloqueo o error |

Canales para tintes translúcidos: `--brand-rgb`, `--brand-deep-rgb`, `--amber-rgb`,
`--positive-rgb`, `--attention-rgb`, `--negative-rgb`, `--white-rgb`. Se usan como
`rgb(var(--brand-rgb) / .12)`. Distribución orientativa del plan: 75 % superficies
oscuras, 18 % texto y neutros, 6 % cian y 1 % ámbar; los bordes no son neón.

Estos colores son propios de TilcAI; no declaran pertenencia a la identidad de Stellar.

## Tipografía (§5.2)

| Token | Valor | Plan |
| --- | --- | --- |
| `--font`, `--mono` | Geist Sans / Geist Mono con alternativas del sistema | Mono solo para montos, ids y estados técnicos |
| `--fs-hero` | `clamp(2.25rem, 4.2vw, 3.75rem)` (36–60 px) | **Desviación**: el plan indica 38–46 px en móvil y 64–76 px en escritorio; se conserva el tamaño del hero compacto del rediseño |
| `--fs-section` | `clamp(1.75rem, 1.2rem + 1.4vw, 3rem)` (28–48 px) | Definido; las secciones aún usan su tamaño propio |
| `--fs-card-title` | `clamp(1.25rem, 1.15rem + .4vw, 1.5rem)` (20–24 px) | Aplicado a `.card h3` |
| `--fs-body` | `clamp(1.0625rem, 1rem + .25vw, 1.25rem)` (17–20 px) | Definido |
| `--fs-small` | `clamp(.9375rem, .9rem + .15vw, 1rem)` (15–16 px) | Aplicado a `.card p` |
| `--fs-label` | `clamp(.75rem, .72rem + .12vw, .875rem)` (12–14 px) | Aplicado a `.tag` |

## Radios, bordes y espaciado (§5.3)

| Token | Valor | Uso |
| --- | --- | --- |
| `--radius-card` | 22 px | Cards (plan: 20–24 px) |
| `--radius-panel` | 20 px | Paneles, tablas, FAQ; alimenta el alias `--radius` |
| `--radius-control` | 12 px | Botones y controles (plan: 12–14 px) |
| `--radius-pill` | 999 px | Badges |
| `--border`, `--border-strong` | blanco al 10 % y 16 % | Bordes de 1 px |
| `--focus-ring` | `--heritage-amber` | Anillo de foco global |
| `--space-1 … --space-24` | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px | Múltiplos de 4 y 8 |

El espaciado entre secciones **no se modificó**: el rediseño compacto usa 36 px en móvil
y 48 px en escritorio, frente a los 56–80 px y 88–120 px del plan.

## Componentes base

| Componente | Clases | Reglas |
| --- | --- | --- |
| Botón | `.btn`, `.btn-primary`, `.btn-ghost` | Alto mínimo 46 px (objetivo táctil ≥ 44 px), radio 12 px. Primario: texto oscuro (`--on-brand`) sobre cian; fantasma: contorno de 1 px |
| Badge | `.tag` + `.tag-brand`, `.tag-positive`, `.tag-attention`, `.tag-negative`, `.tag-neutral` | Pastilla mono con tinte al 12 %. El estado se comunica siempre también con texto. Los nombres de etapa (`.tag-available`, `.tag-integration`, `.tag-next`, y los antiguos `elite`, `meridian`, `vision`) siguen funcionando como alias |
| Card | `.card` | Superficie, borde de 1 px, radio 22 px, relleno 24 px, título de 20–24 px |

`.badge` (la ficha de tecnología de la sección de stack) no es el badge de estado y no se
modificó.

## Alias heredados

Las reglas anteriores siguen funcionando porque los nombres antiguos apuntan a los nuevos.
No añadir reglas nuevas contra ellos; migrarlos gradualmente.

| Antiguo | Nuevo |
| --- | --- |
| `--bg`, `--bg-alt`, `--surface-2` | `--background`, `--background-alt`, `--surface-raised` |
| `--text`, `--text-2`, `--muted` | `--text-primary`, `--text-secondary`, `--text-muted` |
| `--teal`, `--teal-2`, `--teal-soft` | `--brand`, `--brand-deep`, `--brand` al 12 % |
| `--amber`, `--amber-2`, `--amber-soft` | `--heritage-amber`, su versión oscura, `--heritage-amber` al 12 % |
| `--allow`, `--deny`, `--human` | `--positive`, `--negative`, `--attention` |
| `--radius` | `--radius-panel` |

Los colores literales del teal y el ámbar antiguos en `globals.css`, `landing.css` y
`agents.css` (32 apariciones) se sustituyeron por tokens, de modo que no conviven dos
paletas. Los reflejos claros decorativos de las escenas holográficas (`#5adee8`,
`#a3faff`…) se dejaron como están.

## Contraste verificado (WCAG 2.x)

`node scripts/check-contrast.mjs` lee los tokens reales y evalúa 48 pares: **48/48 pasan**.

| Grupo | Mínimo exigido | Peor caso medido |
| --- | --- | --- |
| Texto principal sobre las 4 superficies | 4,5 : 1 | 14,31 : 1 |
| Texto secundario | 4,5 : 1 | 8,78 : 1 |
| Texto atenuado | 4,5 : 1 | 5,91 : 1 (sobre `--surface-raised`) |
| Cian en enlaces y acentos | 4,5 : 1 | 8,72 : 1 |
| Ámbar (eyebrow) | 4,5 : 1 | 8,16 : 1 |
| Positivo, atención y negativo | 4,5 : 1 | 6,90 : 1 |
| Botón principal (`--on-brand` sobre `--brand`) | 4,5 : 1 | 10,54 : 1 (hover 12,23 : 1) |
| Badges (texto sobre su tinte al 12 %) | 4,5 : 1 | 6,30 : 1 |
| Anillo de foco e iconos | 3 : 1 | 8,16 : 1 |

`--brand-deep` mide 4,26 : 1 sobre el fondo y 3,73 : 1 sobre la superficie: por eso es
solo decorativo. El script se probó con tres errores introducidos a propósito (un texto
atenuado demasiado oscuro, un texto claro sobre el botón cian y un token eliminado) y
los detectó todos.

## Antes y después (build de producción, 1440 px, `/es`)

| Propiedad | Antes | Después |
| --- | --- | --- |
| Fondo | `rgb(10, 14, 15)` | `rgb(8, 12, 18)` |
| Cian de acentos y botón | `rgb(44, 195, 205)` | `rgb(53, 214, 237)` |
| Radio de botón | 10 px | 12 px |
| Radio de card | 14 px | 22 px |
| Título de card | 17 px | 24 px |
| Superficie de card | `rgb(17, 24, 26)` | `rgb(18, 28, 41)` |
| Borde de card | `rgba(214, 236, 238, .09)` | `rgba(255, 255, 255, .10)` |

Altura del hero y tamaño del H1 son idénticos a 360, 768 y 1440 px, sin desbordes
horizontales y con un solo H1.

## Pendiente

- `businesses.css` (rama de empresas) y `ControlSection.module.css` (rama de control)
  tienen colores literales del teal antiguo: migrarlos a tokens tras su merge.
- Panel claro opcional (§5.3) y modo claro: no definidos.
- Sincronizar `docs/visual-structure.md` si cambia la paleta de las escenas.
- El resto de reglas puede migrar de alias a nombres nuevos poco a poco.
