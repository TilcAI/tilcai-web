import Image from "next/image";

/** Decorative illustration: the cat at its desk, orbited by the ring/icons art behind it. */
export function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <div className="hero-ring-art hero-depth" data-depth="1.1">
        <div className="hero-float">
          <Image src="/assets/img/inicio/orbita.webp" alt="" fill sizes="(max-width: 800px) 90vw, 50vw" />
        </div>
      </div>
      <div className="hero-cat hero-depth" data-depth="1.3">
        <div className="hero-float">
          <Image src="/assets/img/inicio/gato inicio.svg" alt="" fill priority sizes="(max-width: 800px) 65vw, 34vw" className="hero-cat-image" />
        </div>
      </div>
    </div>
  );
}
