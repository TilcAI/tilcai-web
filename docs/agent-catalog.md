# WEB-07 — catálogo de clientes y guías

Responsable: Omar. Referencia: plan web §§7.4 y 9. Fuentes revisadas: 2026-09-30.

El catálogo contiene aplicaciones/superficies, no modelos. Sus enlaces describen
MCP en el cliente; no acreditan una integración TilcAI. Todas las entradas empiezan
**en preparación**, con entorno de **simulación** para explorar la web. No hay
servidor MCP TilcAI operativo ni configuración probada para publicar todavía.

## Matriz de superficies y referencias

| Grupo | Cliente | Superficie delimitada | Documentación oficial |
| --- | --- | --- | --- |
| Principal | Codex | Codex CLI | [MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) |
| Principal | Claude Code | CLI | [MCP](https://code.claude.com/docs/en/mcp) |
| Principal | OpenCode | Terminal | [Servidores MCP](https://opencode.ai/docs/mcp-servers/) |
| Principal | Gemini CLI | Terminal | [Servidores MCP](https://geminicli.com/docs/tools/mcp-server/) |
| Principal | Cursor | Editor | [MCP](https://cursor.com/docs/mcp) |
| Principal | GitHub Copilot | VS Code | [Servidores MCP](https://code.visualstudio.com/docs/agent-customization/mcp-servers) |
| Adicional | Cline | Extensión de editor | [MCP](https://docs.cline.bot/mcp/mcp-overview) |
| Adicional | Continue | Extensión de IDE | [Servidores MCP](https://docs.continue.dev/customize/mcp-tools) |
| Adicional | Cascade | Agente legado en Devin Desktop | [Integración MCP](https://docs.devin.ai/desktop/cascade/mcp) |
| Adicional | Kiro | IDE | [Herramientas MCP](https://kiro.dev/docs/mcp/usage/) |
| Adicional | Amazon Q Developer | IDE | [Configuración MCP para IDE](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/mcp-ide.html) |
| Adicional | Claude Desktop | Aplicación de escritorio | [Servidores MCP locales](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop) |

La referencia actual de Cascade distingue el agente legado de Devin Local; la
entrada conserva esa distinción. Amazon Q Developer se delimita al IDE para no
duplicar ni reutilizar recetas de Kiro CLI. Claude Desktop no hereda la guía de
Claude Code. Codex CLI no representa una configuración universal de ChatGPT.

## Datos y estados

`src/lib/content/agents.ts` es la fuente de entradas: slug, nombre, grupo,
superficie, textos ES/EN, documentación, fecha de consulta, estado TilcAI,
entorno, guía y recurso visual/fallback. Las etiquetas comunes vienen de los
diccionarios tipados de WEB-01; no se repiten por cliente.

El tipo une estado y guía: `preparation` solo tiene una guía de preparación.
`guide`, `pilot` y `enabled` exigen una guía validada con fecha, transporte,
autenticación, herramientas, pasos y desconexión. El compilador exige los campos;
la evidencia y los permisos de publicación requieren revisión humana.

- **En preparación:** requisitos y referencia del proveedor; no receta operativa.
- **Guía disponible:** configuración probada para versión/superficie descritas.
- **Piloto:** recorrido limitado probado con TilcAI en el entorno indicado.
- **Habilitado:** servicio realmente accesible en esa superficie y entorno.

Simulación/Testnet/producción y avance de integración son dimensiones distintas.
Publicar una guía no prueba un piloto y Testnet no es producción.

## Interacción y accesibilidad

La sección `#agents` muestra un carrusel horizontal con seis clientes y un botón
que añade otros seis a la misma fila, sin aumentar la altura de la sección.
Se navega con desplazamiento táctil, controles anterior/siguiente, Tab y
flechas/Home/End desde una card. No tiene reproducción automática ni slides
duplicados. Las tarjetas usan perspectiva; con movimiento reducido quedan planas.

Cada card contiene un botón que cubre su superficie, sin enlaces anidados, con
`aria-haspopup="dialog"` y `aria-expanded`. Al seleccionar se abre un `dialog`
modal a la derecha: 25vw (mínimo 360px, máximo 480px) en escritorio y ancho
completo en móvil. Recibe foco el título, contiene el foco y bloquea el fondo.
Cerrar, Escape o pulsar el fondo devuelve el foco a la card. La acción de explorar
cierra el panel antes de navegar a la simulación. El cuerpo del panel tiene scroll
propio; su apertura no aumenta la altura del documento.

El panel separa la referencia del proveedor de la preparación TilcAI e informa
requisitos, transporte, autenticación, herramientas, aprobación y desconexión.
Solo una guía validada puede renderizar pasos/configuración copiable. Los datos
actuales no contienen comandos de conexión, endpoint inventado ni credenciales.
No se instala software, inicia una app ni otorga permiso financiero al seleccionar.
La acción disponible es explorar la simulación, conforme a la decisión de Omar.

## Recursos visuales y extensión

La revisión visual solicitada por Omar incorpora las imágenes locales
`public/assets/codex.png` y `public/assets/claude.png`. Claude Code y Claude Desktop
comparten mascota, pero conservan guías y superficies distintas. Son recursos
visuales de esta web; no acreditan una alianza. Los demás clientes conservan
monogramas holográficos. Si falla una imagen, se muestra ese recurso provisional
sin ocultar nombre ni estado.

`asset` admite `src`, textos alternativos ES/EN, `accent` (cool/warm), `scale`
para compensar márgenes transparentes y `poster` estático opcional. Un GIF local
se sirve sin optimización de Next/Image. Con movimiento reducido se utiliza
`poster`, o el monograma si no hay poster. No se generaron imágenes adicionales
ni se modificaron los PNG originales. Véase [estructura visual](visual-structure.md).

Para añadir un cliente:

1. Añadir una entrada con slug único y ambos idiomas; elegir `primary` o
   `additional`. El carrusel y el panel no contienen condicionales por producto.
2. Comprobar nombre, superficie y URL oficial; registrar fecha de consulta.
3. Mantener `preparation` hasta validar servidor, transporte y autenticación.
4. Para promover el estado, adjuntar registro de versión/OS, prueba de
   descubrimiento y consulta, rechazo sin autoridad, aprobación exacta y
   desconexión/revocación. Validar el entorno declarado y los límites.
5. Publicar configuración solo con valores públicos/referencias de entorno:
   nunca tokens, claves privadas, rutas personales ni credenciales embebidas.

## Elementos pendientes para habilitar guías

El equipo debe aportar el servidor/conector MCP, endpoint o launcher real,
transporte y autenticación, versiones soportadas y pruebas por superficie.
La autoridad de compra, el riel y el cumplimiento deben verificarse por separado.
La conexión MCP y una aprobación de herramienta no sustituyen aprobación financiera.
Desconectar el cliente tampoco revierte pagos liquidados ni revoca por sí solo un
mandato. Un canal público sigue siendo necesario para solicitar pilotos; por ahora
las acciones son de exploración.
