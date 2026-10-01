# Revisión visual y estructura compacta

Fecha: 2026-09-30. Solicitud de Omar: reducir espacios y scroll, incorporar
profundidad visual, utilizar las mascotas locales y sacar la guía del catálogo
a un panel derecho. Esta revisión amplía la presentación de WEB-07; no modifica
los contratos de `tilcai-core` ni habilita conexiones, compras o solicitudes de piloto.

## Referencias revisadas

- [Kernel Code](https://motionsites.ai/?prompt=kernel-code): vista pública con
  volumen y textura de puntos. Inspiración para superficies holográficas y profundidad.
- [Anchor AI](https://motionsites.ai/?prompt=anchor-ai): vista pública con título
  protagonista, geometría luminosa y módulos compactos.
- [Vertex](https://motionsites.ai/?prompt=vertex): vista pública y prompt accesible
  mediante su botón de copia. Inspiración para tarjetas en perspectiva y borde luminoso.

Los prompts completos de Kernel Code y Anchor AI requieren un plan de pago;
se revisaron sus vistas públicas. El código fuente de las referencias no se
descargó ni copió. Se construyó una composición propia en el proyecto Next.js.

## Composición implementada

1. Portada: tres frases con jerarquía tipográfica, CTA de exploración y escena
   de intención, empresa, autoridad y condiciones alrededor de TilcAI. El logo
   grande con fondo blanco deja de ocupar la mitad de la portada; la marca actual
   permanece en el encabezado hasta su sustitución.
2. Ritmo: contenedor máximo de 1280px, secciones con 36px de separación vertical
   en móvil y 48px en escritorio, encabezados con 24px de separación al contenido.
3. Flujo: explicación accesible junto a cuatro láminas holográficas apiladas.
   Se separan con el scroll dentro de la altura natural de la sección. No hay
   scroll bloqueado, sección extendida para animar ni canvas WebGL. Las láminas
   decorativas se omiten por debajo de 960px para evitar más altura en móvil.
4. Asistentes: carrusel horizontal con perspectiva, mascotas, estado y superficie.
   La explicación y configuración están en el diálogo lateral. Añadir los seis
   clientes adicionales amplía la fila, sin crear otra fila ni un panel inline.
5. Detalle técnico: contratos, comparación y tecnologías utilizan desplegables
   nativos. Se conserva el contenido y los anchors `#interface`, `#compare` y `#stack`.
6. Preguntas frecuentes: dos columnas en escritorio y una en móvil.

El diálogo mide 25vw en escritorio, con límites de 360–480px; en móvil ocupa el
ancho disponible. Tiene encabezado y acción final fijos, cuerpo con scroll propio,
fondo inerte, bloqueo de scroll, cierre con Escape/botón/fondo y retorno del foco.
Tab y Shift+Tab recorren sus controles sin salir al contenido del fondo.

## Movimiento y recursos

`useDepthMotion.ts` actualiza variables CSS mediante eventos y un frame pendiente
como máximo. El paralaje solo se actualiza cuando la escena es visible. No hay
un bucle permanente, dependencia de animación nueva ni cambios de lockfile.
El carrusel usa scroll nativo y snap; admite gestos, botones, Tab y flechas/Home/End.
No avanza automáticamente y cada cliente aparece una sola vez en el DOM.

Se respeta `prefers-reduced-motion`: escenas estáticas, cards planas, sin entrada
animada del panel y desplazamiento instantáneo desde los controles del carrusel.
El reveal comienza al entrar al viewport para evitar contenido visible todavía oculto.
El layout utiliza el script de mejora progresiva de Next.js y declara su scroll
suave para que los cambios de ruta no hereden una animación de desplazamiento.

Los PNG proporcionados por Omar se conservan sin editar:

| Archivo | Uso |
| --- | --- |
| `public/assets/codex.png` | Codex CLI |
| `public/assets/claude.png` | Claude Code y Claude Desktop, con guías separadas |

Para otros clientes se utiliza un monograma con icono y base luminosa. La imagen
es decorativa: el nombre y la superficie siguen siendo texto accesible.
No hizo falta generar nuevas imágenes para esta estructura.

Para sustituir una mascota, modificar `asset` en `src/lib/content/agents.ts`:

```ts
asset: {
  src: "/assets/mascot.gif",
  poster: "/assets/mascot.png",
  alt: { es: "Mascota del cliente", en: "Client mascot" },
  accent: "cool", // "cool" o "warm"
  scale: 1,
}
```

Un GIF se sirve sin optimización. Con movimiento reducido se muestra el poster
estático; si no existe, se muestra el monograma. Una imagen que falla también
recupera el monograma. Revisar duración, peso y legibilidad al incorporar los GIFs.

## Puntos de extensión para el equipo

| Área | Dónde continuar | Información necesaria |
| --- | --- | --- |
| Empresas | `components/sections/CapabilitiesSection.tsx`, composición en `HomePage.tsx`, diccionarios `businesses`/`capabilities` | Perfiles aprobados, servicios, estado verificable y assets |
| Clientes y guías | `lib/content/agents.ts` | Versión/superficie, servidor, transporte, autenticación y pruebas |
| Mascotas y GIFs | `public/assets/` + campo `asset` | Recursos restantes y posters estáticos |
| Nueva marca | Assets de marca + `SiteHeader.tsx` | Logo definitivo y variantes/favicon/social |
| Arquitectura | Diccionarios docs y contratos compartidos | Revisión técnica del equipo |

Los componentes consumen datos y textos ES/EN; no dependen de condicionales por
nombre de cliente. Mantener los anchors, la separación entre estado y entorno y
la distinción entre permiso MCP y autoridad financiera. Los CTAs siguen siendo
de exploración hasta que haya un canal público y backend de pilotos.

## Verificación local

| Comprobación | Resultado |
| --- | --- |
| TypeScript y build de producción | Correctos; rutas `/es`, `/en` y ambas docs |
| Datos | 12 slugs únicos, seis principales; preparación/simulación en todos |
| Recursos actuales | PNGs de Codex y Claude cargan; tres clientes tienen mascota |
| Semántica del documento | Sin IDs duplicados ni controles interactivos anidados |
| Panel | 360px a 1440px; altura propia, documento sin crecimiento al abrir |
| Teclado del panel | Tab/Shift+Tab contenidos; Escape y botón cierran y restauran foco |
| Catálogo | 6→12→6 sin aumento de altura; End enfoca Claude Desktop; Enter abre su guía específica |
| Idiomas y móvil | ES a 375px y EN a 320px; sin overflow horizontal; menú y guía operables |
| Desplegables técnicos | Apertura con ratón/Enter; cinco filas de comparación y seis tecnologías conservadas |
| Contratos | Flecha derecha cambia Intent a DecisionReceipt tras abrir el desplegable |

Medición de la presentación compacta a 1440×900, con FAQ y detalles técnicos
cerrados: documento de 11.491px antes y aproximadamente 6.750px después (~41%
menos). El catálogo pasa de ~1.446px a ~769px. Abrir detalle incrementa altura
de forma deliberada; abrir una guía lateral no lo hace.

Movimiento reducido y el recurso para futuros GIFs se revisaron en código;
la preferencia del sistema no se emuló en el navegador disponible. Los GIFs
futuros, fallback de fallo de red y guías validadas requieren comprobarse cuando
se incorporen esos recursos/datos. Los datos actuales no incluyen recetas copiables.

ESLint sigue detenido antes de analizar las fuentes: `typescript-eslint` instalado
rechaza TypeScript 7.0.2. Esta limitación es previa; se conservan las dependencias.

## Commits sugeridos para Omar

No se crearon commits ni se preparó el índice. Ejecutar cada grupo desde
`tilcai-web`, revisar y registrar antes de pasar al siguiente:

```powershell
git add -- public/assets/codex.png public/assets/claude.png src/lib/content/agents.ts src/lib/i18n/en.ts src/lib/i18n/es.ts src/lib/i18n/types.ts
git commit -m "feat(web): add mascot assets and bilingual carousel copy"
```

```powershell
git add -- src/app/globals.css src/app/landing.css src/app/agents.css 'src/app/[lang]/layout.tsx' src/components/HomePage.tsx src/components/CommerceScene.tsx src/components/useDepthMotion.ts src/components/AgentCard.tsx src/components/AgentCatalog.tsx src/components/AgentGuidePanel.tsx src/components/SiteHeader.tsx src/components/RevealObserver.tsx
git commit -m "feat(web): compact landing with holographic scenes and agent drawer"
```

```powershell
git add -- README.md docs/agent-catalog.md docs/qa-agent-catalog.md docs/visual-structure.md
git commit -m "docs(web): record visual structure and redesign validation"
```

## Integración del PR #11 — 2026-09-30

Se integra `origin/main` en el trabajo local de Omar sin reemplazar el rediseño.
Se conserva la separación por secciones y los iconos del PR #11 de Jhamil.
`HomePage.tsx` compone esos módulos; la portada conserva `CommerceScene`, el flujo
conserva `FlowLayers` y los tres módulos técnicos utilizan `TechnicalSection`
compartido. El carrusel, las mascotas, el panel derecho y los estilos compactos
permanecen. Los textos de la escena importada se conservan como datos; la portada
actual no presenta sus precios de ejemplo.

Los tres commits locales originales se mantienen en el historial. El merge
queda pendiente del commit y push de Omar; esta integración no crea un commit.

Validación de la integración: build de producción con TypeScript correcto para
las cuatro rutas; a 1440×900 se mantiene la altura de 6.750px y un catálogo de
~769px. Se comprobaron las cuatro láminas, las seis cards iniciales, apertura
del panel de Claude Code a 360px, cierre con Escape y desbloqueo del scroll,
comparación desplegable con cinco filas y cambio a EN a 375px sin overflow.
