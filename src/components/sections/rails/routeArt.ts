/** Las piezas de la escena de «Rutas de pago» (PNG con transparencia, 1254 × 1254). Sin imagen de fondo: la escena va sobre el fondo de la sección. */
const dir = "/assets/img/rutas";

export const routeArt = {
  buyer: `${dir}/ruta-p1-img1.png`, // comprador sobre su plataforma
  tilcai: `${dir}/ruta-p1-img2.png`, // el cubo de TilcAI
  business: `${dir}/ruta-p1-img3.png`, // el negocio
  x402: `${dir}/ruta-p1-img4.png`, // x402 + Stellar
  cctp: `${dir}/ruta-p1-img5.png`, // USDC entre redes
  coin: `${dir}/ruta-p1-img6.png`, // la moneda que viaja
  verified: `${dir}/ruta-p1-img8.png`, // check de resultado
} as const;

export type Route = "x402" | "cctp";
