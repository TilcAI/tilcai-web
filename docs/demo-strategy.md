# /demo · modelo de negocio, go-to-market y roadmap

Debajo del video, `/demo` (`/en/demo`) muestra tres secciones animadas e interactivas con navegación
fija y scroll-spy. El contenido cambiará: este documento explica de dónde sale y cómo actualizarlo.

## Fuente

Sección de Notion **«Instawards · Paso 2 · Borradores TilcAI»** (espacio *Negocios*), leída el
**2026-11-08**:

| Sección de /demo | Página de Notion |
| --- | --- |
| 01 Modelo de negocio (`business`) | 01 Modelo de negocio |
| 02 Go-to-market (`gtm`) | 02 GTM y validación comercial |
| 03 Roadmap (`roadmap`) | 03 Roadmap de producto y sprint |

Ninguna rama del repositorio tenía estas secciones antes de este cambio (revisado el 2026-11-08;
la landing y `/roadmap` muestran solo el estado de construcción por capacidad).

## Archivos

| Archivo | Qué contiene |
| --- | --- |
| `src/lib/content/strategy.ts` | **Todo el texto**, en español e inglés, tipado (`StrategyCopy`). Es lo único que hay que tocar cuando cambia Notion. |
| `src/components/demo/BusinessModel.tsx` | Recorrido de un cobro (paquete animado) + selector de actor que resalta su papel, entregables de la integración, alternador de modalidades de ingreso con barra animada, economía unitaria y señales del mercado con contadores. |
| `src/components/demo/GoToMarket.tsx` | Posicionamiento con alternador comprador/empresa, cliente inicial, canales en orden, pestañas de eventos (teclado: flechas, Inicio, Fin), alianzas y embudo de validación de 8 pasos con detalle por paso. |
| `src/components/demo/StrategyRoadmap.tsx` | Punto de partida, entregables D1–D3 con dependencias al pasar el cursor o enfocar, sprint de 30 días que se reproduce solo al entrar en pantalla (pausable, clic en cada semana), fases posteriores con su condición para avanzar. |
| `src/components/demo/LiquiditySim.tsx` | Explicador de liquidez prefondeada: cada «Pagar» descuenta del vault en Stellar; al cruzar el mínimo, una reposición por lotes vía CCTP lo devuelve al objetivo. Las cantidades son porcentajes del saldo objetivo, no montos. |
| `src/components/demo/DemoNav.tsx` | Navegación fija Video · Modelo · GTM · Roadmap con la sección visible marcada. |
| `src/components/demo/CountUp.tsx` | Cifra que cuenta al entrar en pantalla (el servidor ya pinta el valor final). |
| `src/components/demo/strategy.module.css` | Estilos de las tres secciones; misma paleta noche/violeta que `/aliados`. |
| `test/demo-strategy.test.ts` | Comprueba las reglas de abajo. |

## Reglas del texto (página pública)

1. **Nunca** usar términos de borrador o de dato no comprobado: preliminar, hipótesis, borrador,
   ficticio, falso, sin verificar, por confirmar, pendiente, ilustrativo, provisional, estimado,
   placeholder, draft, mock… El test `test/demo-strategy.test.ts` falla si aparecen (en `es` y `en`).
   Si Notion marca algo como hipótesis, se redacta como lo que TilcAI hace o mide («comparamos»,
   «medimos», «avanza cuando…»), o se deja fuera.
2. **No inventar** cifras, clientes, logos, contratos, ingresos ni fechas de calendario. Las únicas
   cifras son las de `business.signals`, cada una con su fuente externa enlazada (el test exige https).
3. Fuera de la página: presupuesto de la postulación, Chapter Lead, wallet/KYC y pendientes internos.
4. El sprint se cuenta en días 1–30 desde el inicio, sin huecos (el test lo comprueba).
5. Ambos idiomas con la misma estructura (el test lo comprueba).

## Cómo actualizar

1. Leer las tres páginas de Notion y comparar con `src/lib/content/strategy.ts`.
2. Editar solo `strategy.ts` (`es` y `en`). Para añadir un campo nuevo, ampliar `StrategyCopy` y el
   componente que lo pinta.
3. `npm test` y revisar `/demo` y `/en/demo` en escritorio y móvil, con y sin movimiento reducido.
4. Actualizar la fecha de «leída el» arriba y en el comentario de `strategy.ts`.
5. Mantener alineado el pitch (`tilcai-pitch/content/deck.ts`, ver su `docs/fuentes-notion.md`).
