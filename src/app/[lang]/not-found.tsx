import Link from "next/link";
import { getCopy } from "@/lib/i18n";

// Rendered inside the [lang] layout. The layout does not pass params to not-found,
// so the message is shown in both languages to avoid guessing.
export default function NotFound() {
  const en = getCopy("en");
  const es = getCopy("es");
  return (
    <main id="main" className="container not-found">
      <h1>{en.notFound.title}</h1>
      <p className="lead">{en.notFound.body}</p>
      <p className="not-found-links">
        <Link href="/en">{en.notFound.back}</Link>
        <span aria-hidden="true"> · </span>
        <Link href="/es" lang="es">
          {es.notFound.back}
        </Link>
      </p>
    </main>
  );
}
