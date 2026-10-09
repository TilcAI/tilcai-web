# WEB-01 — mapa de mensajes ES/EN

Estado: contenido de Fase 1 para revisión de Jhamil. Responsable: Omar.
Base: documentos de producto y web del 2026-09-29, §§5.4, 7 y 15 del plan web.
El idioma de cada ruta procede de los diccionarios tipados; los componentes
consumen sus claves y no mantienen otra copia del texto.

## Mensaje y recorridos

TilcAI conecta agentes de personas y empresas con condiciones verificables,
autoridad limitada y evidencia de decisión, pago y cumplimiento. Stellar es el
riel inicial del producto en construcción. La web presenta y simula el flujo;
una simulación no demuestra una compra operativa.

| Bloque / clave | Mensaje ES | Equivalente EN | Acción / límite |
| --- | --- | --- | --- |
| Hero / `hero` | Tu agente compra. Tu empresa responde. Tú mantienes el control. | Your agent buys. Your business responds. You stay in control. | Explorar el flujo; no iniciar una compra |
| Qué es TilcAI / `problem` | Una conexión entre tu intención y la operación del negocio | A connection between your intent and the business operation | Tres actores: tu agente, TilcAI y la empresa |
| Empresas / `businesses`, `capabilities` | Preparar servicios para atender solicitudes de agentes | Prepare services to respond to agents | Catálogo, condiciones, disponibilidad, órdenes y cumplimiento |
| Asistentes / `agents` | Usar el asistente con el que ya trabajas | Use the assistant you already work with | Cliente/superficie concreta; seleccionarlo no autoriza gasto |
| Flujo / `flow` | Pide, consulta, comprueba, autoriza, ejecuta y confirma | Ask, inquire, verify, authorize, execute and confirm | Flujo propuesto; separar política, firma, pago y entrega |
| Simulación / `demo` | Mira qué cambia cuando hay reglas | See what changes when rules apply | Puede continuar / bloqueado; sin movimientos de fondos |
| Control / `control`, `flow` | Delegas una tarea. No el control total de tu dinero. | Delegate a task. Keep control of your money. | Proveedores, límites, aprobación, vigencia y revocación |
| Roadmap / `roadmap`, `stageLabels` | Construimos por capacidades, no por promesas | We build around capabilities, not promises | Base disponible, en integración, siguiente evolución |
| FAQ / `faq` | Responder dudas de uso, autoridad y operación | Explain use, authority and operation | Ocho respuestas de 40–80 palabras por idioma |

`problem` y `#problem` se conservan por compatibilidad, pero ahora contienen el
overview de los tres actores. Las demás rutas y anchors existentes se mantienen.
Se reutilizan los componentes actuales: la composición del hero, grid empresarial
y control visual corresponden a los issues de Jhamil y Jose.

## Estados, entorno y evidencia

Son dimensiones distintas, con etiquetas únicas en cada diccionario:

| Dimensión | Claves / tratamiento |
| --- | --- |
| Avance de construcción | `stageLabels`: `available`, `integration`, `next` |
| Integración de asistentes | `integrationLabels`: `preparation`, `guide`, `pilot`, `enabled` |
| Entorno | `environmentLabels`: `simulation`, `testnet`, `production` |

Un piloto puede ejecutarse en Testnet. Una guía no implica integración probada.
Producción es una etiqueta disponible para futuras capacidades verificadas,
no el estado actual de la web ni del flujo de compra.

La base local comprobable incluye el evaluador y los contratos de `tilcai-core`,
además de la simulación visual de esta web. El informe declara un riel x402/Relayer
existente; su conexión a compra/autorización/cumplimiento continúa siendo trabajo
de integración. No se anuncia un servicio de compra habilitado sin evidencia.
Saul mantiene el estado financiero y el roadmap operativo (issue de estados).

`ALLOW` se explica como elegibilidad de política; no es permiso de firma ni pago
confirmado. El resultado visible de la demo se traduce como «Puede continuar» /
«Can continue». `DENY` se presenta como bloqueo. `REQUIRE_APPROVAL` describe una
aprobación pendiente, coherente con el contrato compartido del core.
Pago incierto: mantener retención y conciliar la misma operación; no pagar otra vez.
Un pago liquidado no prueba entrega; revocar no revierte una liquidación anterior.

## FAQ y equivalencia

El orden de las preguntas se define una sola vez en `FAQ_IDS`; ambos idiomas
deben completar el mismo `Record<FaqId, FaqItem>`.

| ID | Pregunta ES | Pregunta EN | Punto que debe conservarse |
| --- | --- | --- | --- |
| `assistant` | ¿Necesito cambiar de asistente? | Do I need to switch assistants? | Cliente y superficie; guías/integración por etapas |
| `wallet` | ¿TilcAI crea una wallet para cada agente? | Does TilcAI create a wallet for every agent? | Cuenta del principal; conexión no es autoridad de gasto |
| `authority` | ¿Mi agente puede gastar sin preguntarme? | Can my agent spend without asking me? | Aprobación inicial y delegación limitada futura |
| `business` | ¿Cómo se conecta una empresa? | How does a business connect? | Adaptador y fuente de verdad; no alta automática |
| `today` | ¿Qué funciona hoy? | What works today? | Web/simulación, evaluador/contratos; compra completa en integración |
| `simulation` | ¿La simulación realiza pagos? | Does the simulation make payments? | Sin wallet/transacción; tres variantes actuales de política |
| `stellar` | ¿Por qué Stellar? | Why Stellar? | Riel inicial y autorización programable; comprobar flujo completo |
| `fulfillment` | ¿Qué pasa si el pago se confirma pero el servicio no se entrega? | What if payment is confirmed but the service is not delivered? | Pago/entrega separados; soporte y resolución comercial |

Las marcas y códigos técnicos permanecen iguales. Se traduce la intención del
mensaje, no palabra por palabra. Los importes ilustrativos de la demo son iguales
en ambos idiomas; cambia únicamente el separador decimal visible.

## CTAs y contenido pendiente

Decisión del usuario: mantener botones de exploración por ahora.
Hero principal → `#flow`; hero secundario → `#capabilities` para empresas.
CTA final → docs y simulación. No se publica correo personal, canal inventado,
formulario sin backend ni un botón que simule haber solicitado un piloto.
La sección `businesses` muestra una invitación para explorar el piloto que lleva a
`#capabilities`; no envía una solicitud. `agents.pilot` permanece pendiente de un
canal operativo. Las acciones empresariales dependen del estado y la ruta verificados.

- WEB-05/06 (Jhamil): composición del hero/overview y perfiles empresariales.
- WEB-07 (Omar): catálogo/guías de asistentes; consume `agents` y etiquetas comunes.
- WEB-09/10 (Jose): tres casos de uso y sección visual de control. Esta tarea
  mantiene las tres variantes actuales de política; no implementa esos casos.
- WEB-11 (Saul): migrar `docs.es.ts`/`docs.en.ts`. Se conservan sus contenidos
  actuales como documentación del diseño anterior; no se reescriben en WEB-01.
- WEB-14: nueva marca, recursos OG y favicon. Aquí solo cambia metadata textual.
- Contacto: falta canal público y/o backend para habilitar solicitud de piloto.

No se necesitan imágenes nuevas para este entregable. Logo y assets existentes
se conservan; marca, banners y animaciones tienen tareas independientes.

## Revisión

- [ ] Jhamil: revisar copy y coherencia de CTAs/recorrido.
- [ ] Saul: validar estado de capacidades y texto de pago/conciliación.
- [ ] Jose: validar explicación de cuenta, límites, aprobación y revocación.
- [ ] Equipo: comprobar el mismo significado ES/EN antes de publicar.

## Verificación local — 2026-09-30

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit --incremental false`, correcto.
- Producción: `node node_modules/next/dist/bin/next build`, correcto; genera
  `/en`, `/es`, `/en/docs` y `/es/docs`.
- Diccionarios: 263 claves de texto coincidentes, sin valores vacíos. Ocho FAQ
  por idioma: ES 46–52 palabras; EN 47–53 palabras por respuesta.
- Navegador: ES/EN a 375 y 1440 px, sin desbordamiento horizontal del documento.
  Se comprobaron las tres decisiones de la demo ES, FAQ con Enter en ambos
  idiomas, destinos de exploración y anchors existentes.
- Corrección de navegación: al cambiar de idioma se restaura la clase `js` y se
  observan los nodos de la nueva ruta. El menú móvil conserva su presentación;
  abrir y cerrar con Escape se comprobó en EN tras ES→EN.
- Lint: `node node_modules/eslint/bin/eslint.js src` no llega a analizar el
  código. El `typescript-eslint` instalado rechaza TypeScript 7.0.2.
  Queda pendiente resolver esa compatibilidad en una tarea de dependencias.

Estas comprobaciones cubren el cambio de contenido, no sustituyen el QA completo
de WEB-15 ni la revisión humana. No se modifica el stack ni el lockfile.
El PR y la revisión de Jhamil siguen pendientes: GitHub CLI no tiene una sesión
autenticada disponible en este entorno. Los commits locales permiten revisar
el entregable sin declarar el issue cerrado.

## Actualización 2026-10-09: de Empresas hacia abajo

Base: contexto oficial (8–9 oct), «Secuencia recomendada de la página» del flujo integrado (§9) y la issue TIL-07
(web #24). Objetivo: un recorrido comprensible de arriba abajo que distinga lo verificado de lo propuesto.

| Bloque / ancla | Qué explica | Estado que declara |
| --- | --- | --- |
| Empresas / `#businesses` | No hace falta agente ni sitio web. Cuatro caminos (consola gestionada, archivo, API o POS, agente propio) y qué conserva cada parte | Propuesta de incorporación · en preparación |
| Flujo / `#flow` | Una operación en seis pasos (pedido, oferta, reglas, aprobación, pago, dos recibos), cada uno con responsable y estado | Recorrido ilustrativo, importes de prueba |
| Rutas de pago / `#rails` | Dos rutas alternativas (x402 directo, CCTP desde otra red), mapa de ocho redes, límites y evidencia | Fuji → Stellar «verificado»; seis redes «laboratorio»; x402 «prueba aislada» |
| Evidencia / `#evidence` | Dos pagos de testnet con enlaces a Snowtrace y Stellar Expert | Pago técnico, no una orden comercial |
| Avance / `#roadmap` | Estado por capacidad con entorno (simulación/testnet) y responsable cuando existe | Sin fechas; nada en producción; sin métricas del piloto |
| Entradas del comprador / `#entrances` | WhatsApp, MCP y API como tres puertas a la misma infraestructura | Reportado / contrato definido / disponible en testnet |
| Tecnología / `#stack` | Añade CCTP y deja de describir Stellar como «riel inicial» | Estado de cada pieza en «Avance» |
| FAQ / `#faq` | «¿Qué funciona hoy?» actualizada; nueva «¿cualquier dinero o red?» | Coherente con el contexto oficial |

Reglas que se mantienen (y que `test/landing-explain.test.ts` vigila): una sola red «verificada»; ningún texto promete
«cualquier red» ni conversión de bolivianos; ninguna cifra de adopción; el pago nunca se presenta como entrega; la evidencia
dice que no es una orden comercial; ningún elemento del avance afirma «producción».

Cómo se explica «crosschain»: `#rails` abre con una definición en lenguaje llano («tienes USDC en una blockchain y el negocio
lo recibe en otra; no es un cambio de moneda ni un token envuelto»), el término aparece también en la etiqueta de la ruta
CCTP y cada paso del recorrido (retirar, confirmar, emitir) lleva su término técnico al lado (burn, atestación, mint). La
página de arquitectura ya no descarta «bridges entre cadenas» en bloque: distingue los puentes de activos envueltos del pago
entre redes con CCTP.

Decisiones para revisar: el caso del flujo pasa de «reporte digital» a «20 bolsas de cemento» (el caso de la demo oficial); la
evidencia usa los hashes de la reproducción del 8 de octubre (issue de QA de la fase 1) y puede sustituirse en
`src/lib/content/rails.ts`; `rails`, `roadmap` y `entrances` se suman a la navegación de la portada.
