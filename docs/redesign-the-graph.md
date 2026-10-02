# Rediseño TilcAI web · sistema visual The Graph + oficina de agentes

Fecha: 2026-10-02 · Estado: maquetado aprobado para implementación

## 1. Sistema visual (extraído de thegraph.com)

Valores leídos del CSS público de thegraph.com (tokens `--gds-*` y `--theme-ui-colors-*`) el 2026-10-02.

### Colores

| Token TilcAI | Valor | Origen en The Graph | Uso |
| --- | --- | --- | --- |
| `--bg` | `#0C0A1D` | Midnight / Background | Fondo general |
| `--bg-deep` | `#080618` | space-1800 | Fondo del lienzo y pie |
| `--pane` | `#1A172F` | Panes | Tarjetas y paneles |
| `--pane-2` | `#222037` | Tooltip | Paneles elevados, bocadillos |
| `--surface` / `-2` / `-3` | `#161426` / `#201E30` / `#2A2739` | white-4 / 8 / 12 | Capas sobre el fondo |
| `--line` | `#3A374D` | space-1200 | Borde de botón secundario |
| `--text-bright` | `#FFFFFF` | TextBright | Titulares |
| `--text` | `rgba(255,255,255,.88)` | Text | Texto principal |
| `--text-2` | `rgba(255,255,255,.64)` | TextDim | Texto secundario |
| `--muted` | `rgba(255,255,255,.48)` | TextDimmer | Notas |
| `--purple` | `#6F4CFF` | Purple (marca) | Acento principal, botón primario, Núcleo |
| `--purple-400` / `-300` | `#8C70FF` / `#A994FF` | purple-400 / 300 | Bordes, hover, enlaces |
| `--blue` | `#4C66FF` | Blue / astro-500 | Hub de intenciones |
| `--turquoise` | `#66D8FF` | Turquoise | Riel Stellar / Bóveda |
| `--green` | `#4BCA81` | Green / starfield-500 | ALLOW, recibos |
| `--yellow` | `#FFA801` | Yellow / solar-500 | REQUIRE_APPROVAL |
| `--red` | `#ED4A6D` | Red / sonja-500 | DENY, kill switch |
| `--pink` | `#FF79C6` | Pink | Agentes de empresa |

Degradado de cabecera (hero de The Graph): `linear-gradient(200deg, #FFCEB0 -2%, rgba(112,35,195,.5) 50%, transparent 70%)` sobre `linear-gradient(#211253, transparent)`.

### Tipografía

The Graph usa **Euclid Circular A** (fuente comercial con licencia, alojada por ellos). Para no usar sus archivos sin licencia, la web carga **Plus Jakarta Sans** (Google Fonts, OFL), la alternativa libre más parecida en proporciones geométricas. Cambiar a Euclid Circular A con licencia propia es reemplazar `--font-display` en `layout.tsx`.

| Rol | The Graph | TilcAI |
| --- | --- | --- |
| Display (h1) | 64/67 · 500 · −2px | 64/67 · 500 · −2px (clamp en móvil) |
| H2 | 40/45.6 · 500 · −1.2px; segunda línea al 48 % de blanco | igual |
| H3 | 24/31 · 500 · −0.4px | igual |
| Cuerpo | 16/28 · 400 | igual |
| Botón / nav | 14–16 · 500 | igual |
| Cifras / código | ui-monospace | JetBrains Mono |

### Componentes

- Botón primario: alto 48 (40 compacto), radio 8, fondo `#6F4CFF`, borde 0.8px `#8C70FF`.
- Botón secundario: fondo `#242236`, borde 0.8px `#3A374D`.
- Tarjetas: fondo `--pane`, borde `rgba(255,255,255,.08)`, radio 16; paneles flotantes con `backdrop-filter: blur`.
- Cabecera: 80 px escritorio / 64 px móvil, contenedor con 32/16 px de margen.

### Marca TilcAI

`TilcAI_logo.png` (blanco sobre negro) → logotipo transparente blanco, isotipo del gato (gato + “i”), favicon 32, apple-touch 180 y og-image 1200×630 sobre Midnight con el degradado de cabecera.

## 2. Vista principal: oficina de agentes a pantalla completa (100svh)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [logo TilcAI]   Qué es · Cómo funciona · Simulación · Empresas · …  EN/ES Docs│  cabecera transparente
│ ┌Volumen hoy┐┌Operaciones┐┌ALLOW %┐┌DENY┐┌Presupuesto raíz┐ ●Stellar Testnet ● Relayer  [SIMULACIÓN] │
│                                                                    ┌───────────┐│
│            OFICINA ISOMÉTRICA (canvas, ocupa todo el fondo)        │ Stream A2A││
│   Empresas · Presupuesto · Bóveda Stellar                          │ mensajes  ││
│   Hub de intenciones · Núcleo de políticas · Recibos               │ en vivo   ││
│   Aprobación humana · Café                                         │      »    ││
│ ┌───────────────────────────┐                                      └───────────┘│
│ │ eyebrow                   │  bocadillos sobre los agentes                     │
│ │ H1 (única)                │                                                   │
│ │ lead · [Explorar] [Empresas]                                                  │
│ └───────────────────────────┘                                                   │
│     [Nueva compra][Inyección][Reintento][Sobre límite][Pausar mandato][Kill switch] | − + ⤢ ⏸ │
│                                   ↓ Desliza para conocer TilcAI                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Salas (datos en `office/layout.ts`)

| Sala | Color | Agentes | Qué representa |
| --- | --- | --- | --- |
| Hub de intenciones | blue | compradores | Asistentes de usuarios que llegan por MCP con una intención |
| Empresas | pink | vendedores | Agentes de negocio que responden con cotización firmada |
| Presupuesto compartido | purple-300 | tesorero | Árbol de mandatos: retiene y descuenta del presupuesto raíz |
| Núcleo de políticas | purple | motor | Reglas deterministas: ALLOW / DENY / REQUIRE_APPROVAL |
| Aprobación humana | yellow | principal / guardián | Revisión de la compra exacta, pausa y revocación |
| Bóveda · Riel Stellar | turquoise | Soroban, Relayer | Firma delegada, payload x402 y liquidación en testnet |
| Recibos y conciliación | green | conciliador | Recibo de cada decisión (también rechazos) y entrega |
| Café | neutral | — | Descanso de los agentes |

### Ciclo de una operación simulada

1. Hub: el comprador recibe una intención (servicio, tope).
2. Camina a Empresas: el vendedor emite `quoteId`, importe y vigencia.
3. Camina al Núcleo: el motor evalúa proveedor, servicio, importe, presupuesto, duplicado y estado del mandato.
4. `DENY` → ⛔ sobre el agente, recibo de rechazo, vuelve al Hub. `REQUIRE_APPROVAL` → pasa por Aprobación. `ALLOW` → Presupuesto retiene.
5. Bóveda: `__check_auth`, x402 y ledger simulado.
6. Recibos: recibo de pago y confirmación de entrega; vuelve al Hub o al Café.

Comandos: forzar compra correcta, inyección de prompt (destinatario cambiado), reintento duplicado, importe sobre umbral (aprobación), pausar mandato (herencia a subagentes) y kill switch (congela todo). Todo es simulación local sin fondos ni red.

Técnica: Canvas 2D, proyección 2:1, A* en rejilla 4-vecinos con puertas, simulación a 4 Hz y render a 60 fps, pausa fuera de pantalla, `prefers-reduced-motion` arranca en pausa. Importes en enteros de centésimas de USDC.

## 3. Resto de la página (scroll)

1. Qué es TilcAI (3 tarjetas)
2. Cómo leer la oficina (leyenda de salas, nueva)
3. Cómo funciona (flujo)
4. Simulación de políticas
5. Empresas / capacidades
6. Asistentes (carrusel)
7. Avance
8. Preguntas frecuentes
9. Detalles técnicos plegables (contratos, comparación, stack)
10. CTA y pie

Encabezados centrados al estilo The Graph, segunda frase del H2 atenuada, tarjetas `--pane`, acentos morados y estados semánticos (verde/rojo/amarillo/turquesa).
