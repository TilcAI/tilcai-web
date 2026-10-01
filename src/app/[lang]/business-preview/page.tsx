import { notFound } from "next/navigation";
import { BusinessGrid } from "@/components/BusinessGrid";
import { PageShell } from "@/components/PageShell";
import { previewBusinesses } from "@/lib/content/businesses.preview";
import { getCopy, isLocale } from "@/lib/i18n";

/** Local-only card review. Production returns 404 even if this route is requested. */
export default async function BusinessPreview({ params }: { params: Promise<{ lang: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getCopy(lang);

  return (
    <PageShell t={t} page="home">
      <section id="businesses" className="section" aria-labelledby="preview-title">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">{t.businesses.previewOnly}</p>
            <h1 id="preview-title">BusinessCard</h1>
          </header>
          <BusinessGrid profiles={previewBusinesses} t={t} />
        </div>
      </section>
    </PageShell>
  );
}
