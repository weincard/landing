import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description: string;
  /** Canonical path, e.g. "/planes" — defaults to no canonical tag */
  path?: string;
}

const SITE_NAME = "Weincard";
const BASE_URL = "https://weincard.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-weincard.png`;

export function PageMeta({ title, description, path }: PageMetaProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const canonical = path ? `${BASE_URL}${path}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
