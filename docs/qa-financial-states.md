# WEB-10 (estados) y WEB-11 — revisión de estados financieros y docs

Fecha: 2026-09-30. Responsable: Saul. Alcance: sección de estado y roadmap
(`RoadmapSection`), docs ES/EN (`/[lang]/docs`) y revisión de los textos de toda la
web para que ninguna interfaz confunda **permitido, aprobado, enviado, liquidado y entregado**.

## Qué cambió

| Área | Cambio |
| --- | --- |
| Roadmap | `RoadmapSection` con tres columnas (base disponible, en integración, siguiente evolución), once ítems y responsable de mantenimiento por ítem. Datos tipados en `src/lib/content/roadmap.ts`; textos en `roadmap.items` de ambos diccionarios, alineados por `ROADMAP_IDS`. Sin fechas. |
| Base x402 / Relayer | Redactada con lo verificado en `tilcai-core` ([payment-rail-environment.md](https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md)): riel en Testnet con pago confirmado en cadena, sin doble pago al repetir un payload, **sin conexión aún** a cotizaciones, aprobación ni órdenes, y prueba hecha con el activo nativo, no USDC. |
| Docs | Reestructuradas en ocho secciones: estado y alcance, arquitectura, integración empresarial, MCP y asistentes, permisos y pagos, extensiones previstas, modelo de seguridad y glosario. Diagrama compacto MCP/adaptador → gateway → identidad y política → autorización → x402/Stellar → conciliación. A2A y ERC-8004 marcados como extensión prevista. |
| Enlace | «Read the full architecture» / «Leer la arquitectura completa» en la sección de tecnología, hacia `/[lang]/docs`. |
| Seguridad del HTML | El contenido de docs sigue siendo HTML de confianza del repositorio. No hay formularios ni campos de entrada en la web, y ningún valor externo se interpola en esas cadenas (comentario de aviso en ambos archivos). |

## Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| TypeScript (`node node_modules/typescript/bin/tsc --noEmit --incremental false`) | Correcto. El tipo `Copy` exige las mismas claves en ES y EN, incluidos los once ítems del roadmap |
| Build de producción (`node node_modules/next/dist/bin/next build`) | Correcto; `/en`, `/es`, `/en/docs`, `/es/docs` |
| Secciones de docs | Ocho por idioma, con los mismos `id` en ES y EN |
| Roadmap en navegador (EN/ES a 360, 768 y 1440 px) | Tres columnas, once ítems, once responsables; sin desbordamiento horizontal |
| Docs en navegador (EN/ES a 360, 768 y 1440 px) | Sin desbordamiento; ocho entradas en el índice; tablas y diagrama legibles en móvil |
| Consola del navegador | Sin errores ni advertencias en ninguna de las seis combinaciones |
| Enlace «Leer la arquitectura completa» | Navega a `/en/docs` y `/es/docs` |
| Dependencias | Sin cambios en `package.json` ni en `pnpm-lock.yaml` |

No se ejecutó `lint`: sigue bloqueado por la incompatibilidad conocida entre
`typescript-eslint` y TypeScript 7.0.2 (ver README). No se cambió el stack.
No se repitió la prueba con teclado del menú ni del catálogo; esta tarea no los modificó.

## Checklist «Interacción y seguridad» (§19) para los estados

| Criterio | Estado | Evidencia |
| --- | --- | --- |
| Seleccionar agente no concede permiso financiero | Cumple | `agents.permissionNote`, `agents.panel.approvalNote`; docs «MCP y asistentes»: *Conectar no es gastar* |
| Guías no contienen secretos | Cumple | Las 12 entradas del catálogo están en `preparation`; ninguna define `configuration` ni pasos; el panel dice que no pide tokens ni claves |
| No se pide seed phrase | Cumple | Sin campos de entrada en el código; solo aparece la negación en docs y en el panel |
| Simulación rotulada en todas sus variantes | Cumple | `demo.eyebrow` («sin movimiento de fondos») y `demo.caveat` visibles siempre; cada variante repite «ilustrativa» o «en este escenario» |
| ALLOW no equivale a pago liquidado | Cumple | `flow.decisions`, resultado de la demo («Puede continuar» / «Can continue»), `roadmap.items.evaluator`, docs «Permisos y pagos» (tabla de cinco estados) |
| Firma válida no basta para autorización | Cumple | `roadmap.signatureNote`, docs «Integración empresarial» y «Permisos y pagos» |
| Presupuesto y autorización figuran en el recorrido | Cumple | `flow.steps`/`after`, `control.panels`, `flow.vision`, ítems `approval` y `reconciliation` |
| Pago y entrega aparecen como estados distintos | Cumple | `flow.receiptNote`, FAQ `fulfillment`, `signatureNote`, docs (tabla: liquidado ≠ entregado) |
| Contacto tiene un canal de envío verdadero | No aplica todavía | No existe formulario ni botón de solicitud de piloto; la invitación de `businesses` lleva a `#capabilities`. Depende de WEB-13 |
| Perfil de empresa distingue colaboración y conexión | Cumple en el componente | `BusinessProfile.relationship` y `connection` se muestran por separado; no hay perfiles publicados hasta contar con aprobación. |

## Hallazgos de la revisión de textos

No hubo que reescribir copy ajeno: los diccionarios existentes ya separan decisión, pago y
entrega en ES y EN. Puntos a vigilar:

1. **`businesses.actions.purchase` («Buy» / «Comprar») y `agents.pilot` («Request pilot access»)**
   La tarjeta solo muestra «Comprar» con conexión `live`, ruta de compra y flujo operativo confirmado.
   `agents.pilot` sigue sin mostrarse como solicitud hasta disponer de un canal real.
2. **Importes en USDC de la simulación** son ilustrativos y están rotulados así; la prueba real del
   riel usó el activo nativo de Testnet. No presentar esos importes como resultado del riel.
3. **`stack.badges` incluye USDC** con el rol «según red y configuración». Mantener ese matiz hasta
   probar el riel con USDC.
4. **Responsables del roadmap.** La asignación sigue la tabla del §17 del plan web (propuesta del
   equipo). Se muestran por nombre de pila en la web pública; si el equipo prefiere no publicarlos,
   basta con no renderizar `entry.maintainer` en `RoadmapSection.tsx`, sin tocar los datos.
5. **Docs técnicas del riel.** Enlazan al repositorio público `tilcai-core`. El repositorio
   `documentation` es privado y no se enlaza desde la web.

## Mantenimiento

Mover un ítem de etapa exige evidencia en su entorno indicado. Al promover `reconciliation` o
`approval` a disponible, actualizar también `flow.firstCase`, el FAQ `today` y las docs «Permisos y pagos».
