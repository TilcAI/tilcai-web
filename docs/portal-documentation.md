# TilcAI Docs · portal de documentación

Revisión: 20 de octubre de 2026. Rama de trabajo: main. Referencias locales: infrastructure 58066a7, web f59551d; SDK 0.1.0 y MCP 0.2.0.

## Experiencia de lectura

- Portada en /es/docs y /en/docs; 19 artículos por idioma en /[lang]/docs/[slug].
- Navegación por grupos, artículo activo, índice de encabezados y anterior/siguiente.
- Búsqueda local de títulos y contenido, sin servicios externos. Ctrl/Cmd+K, flechas, Enter y Escape. Estado sin resultados y retorno de foco.
- Ejemplos copiables con confirmación visible y alternativa manual si el navegador rechaza el portapapeles.
- Cambio de idioma del encabezado conserva el artículo. Los enlaces antiguos /docs#status, #architecture, #limits y demás ids se resuelven a artículos; payments, interface y compare tienen alias.
- Menú de documentación desplegable en pantallas estrechas; tablas con etiquetas por celda; bloques de código con scroll propio. Sin animación esencial; reglas prefers-reduced-motion.

## Contenido y mantenimiento

Contenido bilingüe: src/lib/content/docs-content.ts. Los diccionarios docs.es.ts y docs.en.ts aportan metadatos y etiquetas. El HTML es contenido de confianza del repositorio: nunca interpolar datos de usuario.

Renderizado: src/components/DocsPage.tsx. Interacciones aisladas: src/components/docs/. Tipografía, superficies y breakpoints: src/app/docs.css. Generación estática y metadatos: src/app/[lang]/docs/[slug]/page.tsx.

La portada usa fondo grafito, acentos violeta, Plus Jakarta Sans y JetBrains Mono existentes. La ilustración es conceptual; los diagramas de arquitectura y rutas usan HTML/SVG y texto seleccionable. El diagrama de rutas permite alternar testnet/mainnet sin realizar llamadas a la API ni transacciones.

## Estado técnico que se documenta

- Avalanche C-Chain → Stellar Public Network: evidencia de mainnet y demo de 1 USDC; acreditación disponible en Vaquita como acción posterior distinta de CCTP.
- Monad Testnet: selección por API y SDK; pruebas de pagos, cuentas y vault registradas en AGENT_HISTORY.md de infraestructura, 13 de octubre.
- MCP 0.2.0 mantiene Avalanche → Stellar; no se anuncia selección de Monad por MCP.
- Ethereum, Base y Arbitrum se distinguen como trabajo del laboratorio CCTP, no orígenes activos del backend actual.
- Contratos adicionales mainnet: desplegados según confirmación del equipo, con direcciones/hashes y activación aún por verificar públicamente.
- Banco Económico y Diaconía: acceso a APIs y pruebas QR reportadas por el equipo; variables BANECO_* aún no consumidas en el backend. El mock QR Simple no acredita cobros bancarios reales.
- x402 por red, reputación, delegación y comercio completo tienen sus límites explícitos. Sin auditoría independiente.

## Recursos visuales

- public/docs/infrastructure-editorial.webp: derivado optimizado 960 × 640, ~25 KB, de la ilustración producida con image_gen integrado. Revisión visual realizada: tres planos, materiales coherentes, sin texto ni logos inventados.
- public/docs/infrastructure-editorial.png: original de la ilustración, conservado como fuente.
- public/docs/vaquita-mainnet-demo.jpg: fotograma real ya extraído para la demo, reutilizado con pie que distingue saldo disponible y depósito DeFi.
- Logos TilcAI, Avalanche y Stellar: activos existentes del proyecto. Monad se representa con una M esquemática, no con un logo oficial inventado.

### Prompt de la ilustración — image_gen integrado

Use case: stylized-concept. Create a wide 3:2 editorial illustration for the TilcAI developer documentation homepage. Subject: an elegant physical model of programmable infrastructure: three slim stacked square ceramic platforms, precise violet interconnects passing through a central hollow square core, small modular ports connecting the stack. An architectural model photographed at a three-quarter isometric angle, on a seamless very dark graphite-plum background (#111017). Milky white ceramic, a few satin lavender components and a single vivid violet (#6F4CFF) central rail; realistic soft studio lighting, subtle contact shadows, precise bevels, no glass glare. Quiet, technical, approachable, premium industrial design, generous negative space around model, whole object within frame for mobile cropping. Horizontal composition. This is conceptual illustration, not a technical schematic. No text, no letters, no logos, no UI, no crypto coins, no globe, no neon cyberpunk, no exaggerated glow, no random cables, no extra decorative objects.

## Referencias de diseño consultadas

- https://supabase.com/docs
- https://docs.expo.dev/
- https://vite.dev/guide/
- https://developers.stellar.org/docs

Se toman como referencia la separación por guías, el índice, la búsqueda y la orientación a integradores. La identidad visual sigue siendo la de TilcAI.

## Verificación

- TypeScript: comprobación sin errores.
- Suite: 108 pruebas pasan, 0 fallos.
- Se añadieron comprobaciones de enlaces internos bilingües, ejemplos iniciales sin pagos y anclas únicas con acentos.
- Se adaptó la prueba de alcance al contenido centralizado; se corrigió una lectura de tests que dependía de LF y fallaba con CRLF en Windows, sin normalizar archivos masivamente.
- ESLint: bloqueado antes de analizar el código por incompatibilidad de TypeScript 7.0.2 con typescript-eslint 8.70.1. No se cambiaron dependencias.
- Navegador: inspección a 1440 × 900, 900 × 900 y 390 × 844. Portada, inicio rápido, arquitectura, Monad y tabla API revisados; búsqueda, vacío, copia, idiomas, menú móvil y alternancia de redes ejercitados. El salto de anclas se ajustó para respetar cabeceras fijas.
- La versión compilada se sirvió con next start y se comprobó en navegador: portada a 1440 × 900 sin desbordamiento, evidencia mainnet, ausencia de errores/warnings en el log consultado y compatibilidad de /docs#payments hacia /docs/rails. El título destino queda a 175,7 px y la barra fija termina a 144 px.
- Capturas: docs/qa-portal/. Son evidencia de vistas concretas, no una auditoría exhaustiva de accesibilidad.
- No se ejecutan pagos, despliegues de contratos ni llamadas a APIs bancarias para esta revisión.

Build de producción: completado correctamente con Next.js 16.3.8. Se generaron las 54 páginas estáticas del sitio, incluidas las 38 páginas de artículos (19 por idioma), sin errores de TypeScript.

### Ajuste de densidad · 20 de octubre de 2026

Se compactó el espaciado antes de preparar los commits manuales: subtítulos de 40/16 px a 28/12 px (arriba/abajo), breadcrumb de escritorio de 32 a 24 px, cabecera de artículo de 30 a 22 px y separaciones entre bloques de portada de 40–42 a 28 px. El área de lectura en escritorio pasa de 32/72 a 24/48 px (padding superior/inferior). Se conservan los espacios necesarios para legibilidad y las cabeceras fijas.

Build repetido correctamente. Portada revisada a 1440 × 900 y guía de inicio rápido a 390 × 844: sin solapamientos ni desbordamiento horizontal en esas vistas. La medición del subtítulo móvil devuelve 28px 0px 12px. Captura: qa-portal/mobile-quickstart-compact.jpg. Se prepararon 20 bloques manuales de add/commit y un push final; no se ejecutaron operaciones de commit o push.

