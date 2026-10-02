# Exploración del isotipo Tilcayo — rutas A y B (WEB-03)

Estado: **dos propuestas para decisión del equipo.** Ninguna está aprobada y no se
reemplazó ningún logo existente: `public/assets/` queda intacto. Referencia: plan web
§4 (marca) y §5.1 (paleta). Responsables propuestos: Jhamil y Omar.

| Archivo | Contenido |
| --- | --- |
| `docs/brand/tilcai-symbol-a.svg`, `tilcai-symbol-a-small.svg` | Ruta A, maestro y variante pequeña |
| `docs/brand/tilcai-symbol-b.svg`, `tilcai-symbol-b-small.svg` | Ruta B, maestro y variante pequeña |
| `docs/brand/exploration.html` | Hoja de presentación autocontenida (ábrela en el navegador) |
| `docs/brand/exploration.png` | Captura de esa hoja, para compartir |
| `docs/brand/source/build_symbols.py` | Generador de las SVG (solo biblioteca estándar de Python) |

Las propuestas viven en `docs/` y no en `public/`: no se sirven en el sitio hasta que el
equipo elija. Al aprobar una ruta se mueve a `public/assets/brand/` (plan §14.1).

## Qué se conserva de la mascota

Del logo actual se tomaron los rasgos que identifican al tilcayo, simplificados a
formas geométricas de un solo color:

- **Orejas altas y puntiagudas**, con su muesca interior.
- **Las dos barras oscuras de la frente.**
- **La línea oscura bajo el ojo.**
- En la ruta A, la **órbita abierta con un nodo** del logo actual, aquí como anillo propio
  que se abre por donde salen las orejas. No copia el marco ni la silueta del oso de la
  referencia.

## Construcción

Cada marca es un único `<path>` en una cuadrícula de 64 × 64, sin raster, trazos,
degradados ni texto (465–868 bytes). Los contornos exteriores van en sentido horario y
los recortes en antihorario con `fill-rule="nonzero"`, de modo que el anillo y el nodo se
unen y los ojos, la nariz y las muescas son espacio negativo real. El color es
`currentColor`: un solo color, en negativo y sobre cualquier fondo. Cada ruta tiene una
**variante pequeña** (sin detalles finos, trazo del anillo más grueso) para 16 y 24 px.

## Ruta A — perfil felino en anillo abierto

Cabeza de perfil con orejas erguidas, hocico corto y mechón de mejilla, dentro de un
anillo con un nodo. Más dinámica y asociada a «conexión». Se rehízo varias veces porque las
primeras versiones se parecían a un zorro o a un lobo; la actual tiene el hocico corto y la
frente redondeada de un felino silvestre. Sigue siendo la ruta más difícil de acertar.

## Ruta B — rostro simétrico

Cara frontal con dos orejas, ojos y nariz en negativo y pocos planos, sin contenedor.
Se suavizaron las orejas y la inclinación de los ojos para que no resulte agresiva
(plan §3.2).

## Pruebas realizadas

Matriz completa en `exploration.html`, para cada ruta:

- Tamaños: **16, 24, 32, 64 y 256 px**.
- Tratamientos: negro sobre blanco, blanco sobre negro, cian sobre obsidiana y
  obsidiana sobre fondo claro (`#f4f8fc`).
- **Vista de píxeles**: render real a 16, 24 y 32 px ampliado ×8, maestro y pequeña.
- En contexto: lockup horizontal sobre ambos fondos, barra de navegación y favicon.

Lo observado:

| Tamaño | Ruta A | Ruta B |
| --- | --- | --- |
| 256 y 64 px | Se lee bien | Se lee bien |
| 32 px | Bien con la variante pequeña | Bien; ya se ven las barras de la frente |
| 24 px | Aceptable con la pequeña | Reconocible |
| 16 px | Débil: cabeza y anillo compiten, el anillo mide 0,75 px | Reconocible: orejas, ojos y nariz (5 formas) se mantienen |

## Comparación y recomendación de partida

| Criterio | A | B |
| --- | --- | --- |
| Reconocible a 16 px | Regular | Sí |
| Un solo color y negativo | Sí | Sí |
| Rasgos de la mascota | Orejas, barra, línea bajo el ojo, órbita con nodo | Orejas, dos barras, línea bajo cada ojo |
| Personalidad | Más dinámica | Más directa y cercana; no agresiva |
| Riesgo | Parecerse a un zorro o lobo; el anillo es un contenedor genérico | Confundirse con otras caras de gato |
| Mejor uso | Portadas, presentación, mascota expresiva | Navegación, favicon, interfaz, documentos |

**Recomendación de partida:** B como isotipo principal (interfaz y favicon) y A como
recurso expresivo. Es una propuesta, no una decisión: el plan pide elegir «por pruebas de
reconocimiento y reducción, no solo por la versión grande» (§4.3).

## Lo que esto no resuelve

- **Los trazados son bocetos hechos en código**, no un maestro de diseñador. Antes de
  aprobar hace falta ajuste óptico, revisión de similitud con marcas de terceros (no se
  hizo una búsqueda de marcas) y comprobar que se distingue de otros iconos de gato.
- **Wordmark:** los lockups usan texto con la fuente de la web como maqueta. El tratamiento
  gráfico propio del nombre «TilcAI» está pendiente.
- **Entregables de marca de §4.6** sin producir: lockups vectoriales, hoja de marca en PDF,
  `tilcai-logo-1024.png`, favicon y apple-touch-icon nuevos, portada social 1200 × 630.
  Se harán sobre la ruta elegida (WEB-14).
- **Presentación al equipo y elección de ruta:** pendientes de las personas.

## Registro de decisión

Ruta elegida: ______ · fecha: ______ · aprobada por: ______

## Regenerar

```sh
python docs/brand/source/build_symbols.py docs/brand
```

Reproduce exactamente las cuatro SVG. `exploration.html` es un artefacto estático: si cambian
los trazados hay que regenerarlo.
