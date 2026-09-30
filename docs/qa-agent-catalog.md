# WEB-07 — verificación local y commits sugeridos

Fecha: 2026-09-30. Entregable: catálogo ES/EN y panel de guías en preparación.

## Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| TypeScript (`node node_modules/typescript/bin/tsc --noEmit --incremental false`) | Correcto |
| Build de producción (`node node_modules/next/dist/bin/next build`) | Correcto; `/es`, `/en` y ambas páginas docs |
| Catálogo | 12 slugs únicos; seis principales y seis adicionales |
| Idiomas | 294 claves de texto coincidentes, sin valores vacíos; textos por cliente completos ES/EN |
| Estado y entorno actuales | Todas las entradas en preparación/simulación; sin recetas de conexión |
| Teclado ES | Enter abre Codex y enfoca título; Escape cierra y devuelve foco; Space expande el segundo grupo |
| Claude Desktop | Entrada y panel separados de Claude Code, con referencia propia |
| Teclado EN | Enter abre Claude Code; cerrar devuelve foco a la card |
| Colapso | De 12 a seis cards; selección adicional se cierra y el foco queda en «Ver más asistentes» |
| Semántica | Cero controles interactivos anidados; botones de cards de 46 px de alto |
| Responsive ES/EN | 360, 390, 768, 1024 y 1440 px; sin desbordamiento horizontal del documento |
| Responsive de cards ES | Sin elementos de cards fuera del viewport en los cinco anchos |
| Panel móvil ES | Sin desbordamiento a 390 px; foco visible y enlaces a docs oficiales / simulación |
| Guías no validadas | No muestran botón de copiar configuración, pasos operativos ni solicitudes de credenciales |
| Git diff | Sin errores de whitespace; sin cambios de dependencias o lockfile |

Lint vuelve a detenerse antes de analizar fuentes: `typescript-eslint` no admite
el TypeScript 7.0.2 instalado. No se cambió el stack para resolver este problema.
Las guías validadas y el copiado de configuraciones reales necesitan pruebas al
incorporar el servidor; no se declaran comprobados mediante este catálogo.
La revisión de versiones/OS, conexión MCP, autenticación, aprobación financiera
y compra completa no forma parte de estas comprobaciones de UI.

## Commits para Omar

No se han creado commits ni preparado el índice. Desde `tilcai-web`, estos son
grupos sugeridos, que pueden revisarse y registrarse por separado:

1. `feat(web): add typed assistant catalog and official references`
   - `src/lib/content/agents.ts`
   - `docs/agent-catalog.md`
2. `feat(web): add bilingual assistant cards and guide panel`
   - `src/components/AgentCatalog.tsx`, `AgentCard.tsx`, `AgentGuidePanel.tsx`
   - `src/components/HomePage.tsx`, `SiteHeader.tsx`
   - `src/lib/i18n/types.ts`, `es.ts`, `en.ts`
   - `src/app/globals.css`
3. `docs(web): record assistant catalog validation and prerequisites`
   - `README.md`
   - `docs/qa-agent-catalog.md`

El segundo grupo completa el recorrido visual; el primero fija datos y fuentes.
El tercero deja el registro de QA y mantenimiento. Sigue pendiente la revisión
del equipo antes de presentar integraciones como habilitadas.
