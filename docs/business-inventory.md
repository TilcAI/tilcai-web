# Inventario de empresas y permisos de publicación

La web no tiene perfiles empresariales aprobados al iniciar WEB-06/WEB-02. Los contactos mencionados en la documentación de producto sirven para explorar pilotos; no acreditan una alianza ni autorizan publicar nombre, identidad visual o servicios de una empresa.

| Empresa | Categoría | Responsable interno de revisión | Nombre y servicio autorizados | Logo autorizado | Banner autorizado | Relación comercial | Conexión técnica | Publicación | Última revisión |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pendiente de identificar | — | Pendiente | No | No | No | Sin verificar | Sin verificar | No | — |

No guardar nombres ni datos personales de contacto en este archivo público sin consentimiento. Mantener la evidencia de autorización fuera del repositorio y registrar aquí solo un responsable interno y fecha de revisión cuando exista una empresa concreta.

## Alta de un perfil público

1. Confirmar con la empresa su nombre público, categoría, ubicación o modalidad y texto del servicio. Registrar el contacto responsable de revisar esos datos en un sistema privado.
2. Obtener aprobación explícita para publicar el perfil y registrar fecha, alcance y responsable de la aprobación. Solo entonces establecer `publicationApproved: true`.
3. Registrar por separado permiso de uso web para cada logo y banner: titular/origen, versión, recorte admitido y fecha. Subir los archivos a `public/assets/businesses/` solo con permiso; establecer `mediaApproved: true` únicamente si los recursos incluidos están autorizados.
4. Verificar por separado `relationship` (`participant` o `partner`) y `connection` (`planned`, `pilot`, `testnet` o `live`). Un contacto o acuerdo comercial no demuestra conexión técnica.
5. Crear `profileHref` real. Enlazar escenario solo si existe uno asociado; consulta solo si su ruta funciona; compra solo después de validar el flujo operativo completo. Registrar la evidencia de cada promoción de estado.
6. Elegir la categoría entre `BusinessCategoryKey` (`digital`, `booking`, `commerce`, `experience`). Añadir una clave nueva a `BusinessServiceKey` en `src/lib/i18n/types.ts` y su texto en `businesses.services` de **ambos** diccionarios; usarla como `serviceSummaryKey`. Como los tipos son cerrados, olvidar una traducción es un error de compilación y la card nunca muestra una clave sin traducir.
7. Ejecutar `npm test` (o `pnpm test`). Las pruebas comprueban que el perfil es coherente (`businessProblems`: slug válido, destinos seguros, recursos en `/assets/businesses/`, `mediaApproved` con logo y banner, flujo de compra solo con conexión `live`) y que los ejemplos nunca llegan a la cuadrícula pública.

`src/lib/content/businesses.preview.ts` contiene cuatro ejemplos genéricos con `previewOnly: true`, sin aprobación ni imágenes. Cada uno ejercita un caso: nombre largo, texto largo y una acción pedida que degrada a la que sí funciona. Solo se muestran en `/en/business-preview` y `/es/business-preview` durante desarrollo local; la ruta responde 404 en producción. La cuadrícula pública filtra siempre los ejemplos y los perfiles sin aprobación de publicación. La card oculta logo y banner cuando `mediaApproved` es falso.

## Qué acción muestra una card

`action` es la acción más fuerte que la empresa quiere. `businessAction` ofrece la más fuerte que además es operativa, bajando por esta lista y sin subir nunca: comprar → consultar → explorar caso → perfil.

| Acción | Requisitos |
| --- | --- |
| Comprar | `connection: "live"`, `purchaseFlowOperational: true` y `purchaseHref` |
| Consultar servicio | `connection` distinta de `planned`, `inquiryOperational: true` y `inquiryHref` |
| Explorar caso | `scenarioHref` |
| Conocer empresa | `profileHref` (obligatorio) |

Pedir «comprar» sin un flujo validado muestra la consulta, el caso o el perfil según lo que exista; nunca «Comprar».
