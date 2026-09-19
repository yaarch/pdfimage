import { LanguageCode } from '../types';

export interface SeoPageMetadata {
  route: string;
  title: string;
  description: string;
  keywords?: string[];
}

export const MULTILINGUAL_STATIC_SEO: Record<string, Record<LanguageCode, { title: string; description: string; keywords?: string[] }>> = {
  '/': {
    en: {
      title: 'PDF Image Studio — Private Browser File Tools',
      description: 'Convert, compress, organize, edit and optimize your PDF and image files directly in your browser. Fast, 100% private client-side processing, zero server uploads.',
      keywords: ['pdf tools', 'image editor', 'compress pdf', 'merge pdf', 'image converter', 'client-side file tools'],
    },
    ar: {
      title: 'PDF Image Studio — أدوات معالجة الـ PDF والصور في المتصفح بخصوصية تامة',
      description: 'تحويل، ضغط، تنظيم، وتعديل مستندات PDF والصور مباشرة في متصفحك. معالجة محلية 100% بسرعة فائقة وبدون أي رفع للخوادم.',
      keywords: ['أدوات pdf', 'تعديل الصور', 'ضغط pdf', 'دمج pdf', 'تحويل الصور', 'أدوات خصوصية محلية'],
    },
    es: {
      title: 'PDF Image Studio — Herramientas Privadas para PDF e Imágenes',
      description: 'Convierte, comprime, organiza, edita y optimiza archivos PDF e imágenes directamente en tu navegador sin subidas a servidores externos.',
      keywords: ['herramientas pdf', 'editor de fotos', 'comprimir pdf', 'unir pdf', 'convertir imagenes'],
    },
    fr: {
      title: 'PDF Image Studio — Outils PDF et Images Privés dans le Navigateur',
      description: 'Convertissez, compressez, organisez, modifiez et optimisez vos PDF et images directement dans votre navigateur sans téléversement.',
      keywords: ['outils pdf', 'éditeur photo', 'compresser pdf', 'fusionner pdf', 'convertir image'],
    },
    de: {
      title: 'PDF Image Studio — Private Datei-Tools direkt im Browser',
      description: 'Konvertieren, komprimieren, organisieren, bearbeiten und optimieren Sie Ihre PDF- und Bilddateien direkt im Browser. Schnell, 100% lokal, ohne Server-Uploads.',
      keywords: ['pdf tools', 'bildbearbeitung', 'pdf komprimieren', 'pdf zusammenfügen', 'bild konverter', 'dateien im browser bearbeiten'],
    },
  },
  '/all-tools': {
    en: {
      title: 'All Browser File Tools Catalog — PDF Image Studio',
      description: 'Explore our complete suite of 100% private, client-side PDF and image tools. Compress, convert, organize, sign, extract, and edit files right in your browser.',
      keywords: ['all pdf tools', 'all image tools', 'free file utilities', 'online document editor catalog'],
    },
    ar: {
      title: 'دليل جميع أدوات ملفات PDF والصور — PDF Image Studio',
      description: 'استكشف الدليل الكامل لأدوات PDF وتعديل الصور المجانية والخاصة 100%. معالجة سريعة وآمنة بدون تسجيل أو تثبيت.',
      keywords: ['جميع أدوات pdf', 'جميع أدوات الصور', 'دليل الأدوات المجانية', 'محرر مستندات مجاني'],
    },
    es: {
      title: 'Catálogo de Todas las Herramientas — PDF Image Studio',
      description: 'Explora nuestra suite completa de herramientas para PDF e imágenes de ejecución local. Comprime, convierte y organiza con total privacidad.',
      keywords: ['todas las herramientas pdf', 'utilidades de imagen', 'catalogo de herramientas'],
    },
    fr: {
      title: 'Catalogue de Tous les Outils — PDF Image Studio',
      description: 'Découvrez notre collection complète d\'outils PDF et image exécutés 100% en local dans votre navigateur.',
      keywords: ['tous les outils pdf', 'outils image en ligne', 'catalogue utilitaires gratuits'],
    },
    de: {
      title: 'Katalog aller Browser-Datei-Tools — PDF Image Studio',
      description: 'Entdecken Sie unsere vollständige Suite privater PDF- und Bildwerkzeuge. Komprimieren, konvertieren, organisieren, signieren und bearbeiten Sie Dateien direkt im Browser.',
      keywords: ['alle pdf tools', 'alle bild tools', 'kostenlose datei tools', 'online dokumenteneditor'],
    },
  },
  '/batch-processor': {
    en: {
      title: 'Batch File Processing Online — Compress & Convert | PDF Image Studio',
      description: 'Batch process multiple PDF and image files in parallel right in your browser. Download all processed items in a single ZIP file.',
      keywords: ['batch file processing', 'bulk pdf compress', 'bulk image converter', 'zip download'],
    },
    ar: {
      title: 'معالجة الدفعات المتعددة وتنزيل ZIP — PDF Image Studio',
      description: 'عالج عشرات ملفات PDF والصور دفعة واحدة بالضغط والتحويل السريع ونزل كافة الملفات في أرشيف ZIP مريح.',
      keywords: ['معالجة الدفعات', 'ضغط بالجملة', 'تحويل ملفات مجمعة', 'تنزيل zip'],
    },
    es: {
      title: 'Procesamiento por Lotes de Archivos (ZIP) — PDF Image Studio',
      description: 'Procesa múltiples archivos PDF e imágenes en paralelo directamente en tu navegador y descarga en ZIP.',
      keywords: ['procesamiento por lotes', 'comprimir varios pdf', 'convertir fotos en lote'],
    },
    fr: {
      title: 'Traitement par Lot de Fichiers (ZIP) — PDF Image Studio',
      description: 'Traitez simultanément plusieurs documents et photos dans votre navigateur avec téléchargement groupé en ZIP.',
      keywords: ['traitement par lot', 'compression multiple pdf', 'convertisseur par lot'],
    },
    de: {
      title: 'Stapelverarbeitung von Dateien online — Komprimieren & Konvertieren | PDF Image Studio',
      description: 'Verarbeiten Sie mehrere PDF- und Bilddateien parallel direkt im Browser. Laden Sie alle verarbeiteten Dateien in einer einzigen ZIP-Datei herunter.',
      keywords: ['stapelverarbeitung', 'mehrere pdf komprimieren', 'bilder im stapel konvertieren', 'zip download'],
    },
  },
  '/privacy': {
    en: {
      title: 'Privacy Architecture & Confidentiality Guarantee — PDF Image Studio',
      description: 'Learn about PDF Image Studio\'s 100% client-side privacy architecture. Your files never leave your device because processing happens entirely in your browser memory.',
      keywords: ['client-side privacy', 'zero upload guarantee', 'gdpr compliant pdf', 'browser sandbox security'],
    },
    ar: {
      title: 'معمارية الخصوصية وضمان السرية المطلقة — PDF Image Studio',
      description: 'تعرف على البنية الأمنية لمنصة PDF Image Studio التي تعمل بنسبة 100% داخل جهازك دون إرسال أي ملفات للخوادم.',
      keywords: ['أمان المستندات', 'حماية الخصوصية', 'معالجة محلية', 'بدون رفع ملفات'],
    },
    es: {
      title: 'Arquitectura de Privacidad y Garantía — PDF Image Studio',
      description: 'Conoce nuestra arquitectura 100% en el navegador. Tus archivos nunca salen de tu ordenador ni se guardan en la nube.',
      keywords: ['privacidad de archivos', 'seguridad sin subidas', 'garantia de confidencialidad'],
    },
    fr: {
      title: 'Architecture de Confidentialité et Sécurité — PDF Image Studio',
      description: 'Découvrez notre architecture 100% locale dans votre navigateur. Vos données ne sont jamais transmises à des tiers.',
      keywords: ['confidentialité client-side', 'sécurité documents', 'garantie zéro upload'],
    },
    de: {
      title: 'Datenschutzarchitektur & Vertraulichkeitsgarantie — PDF Image Studio',
      description: 'Erfahren Sie mehr über die 100% clientseitige Datenschutzarchitektur von PDF Image Studio. Ihre Dateien verlassen niemals Ihr Gerät.',
      keywords: ['lokaler datenschutz', 'kein server upload', 'dsgvo konforme pdf bearbeitung', 'browser sandbox sicherheit'],
    },
  },
  '/terms': {
    en: {
      title: 'Terms of Service — PDF Image Studio',
      description: 'Read the terms of service for PDF Image Studio, the free, private, client-side browser file utility platform.',
      keywords: ['terms of service', 'usage terms', 'client side tools terms'],
    },
    ar: {
      title: 'شروط الاستخدام والخدمة — PDF Image Studio',
      description: 'شروط استخدام منصة PDF Image Studio المجانية لأدوات معالجة المستندات والصور محلياً في المتصفح.',
      keywords: ['شروط الاستخدام', 'سياسة الخدمة', 'حقوق الملكية للملفات'],
    },
    es: {
      title: 'Términos de Servicio — PDF Image Studio',
      description: 'Términos y condiciones de uso de la plataforma de herramientas privadas PDF Image Studio.',
      keywords: ['terminos de servicio', 'condiciones de uso', 'propiedad de archivos'],
    },
    fr: {
      title: 'Conditions d\'Utilisation — PDF Image Studio',
      description: 'Consultez les conditions d\'utilisation de la plateforme d\'outils de fichiers privés PDF Image Studio.',
      keywords: ['conditions d utilisation', 'mentions légales', 'propriété des données'],
    },
    de: {
      title: 'Nutzungsbedingungen — PDF Image Studio',
      description: 'Lesen Sie die Nutzungsbedingungen für PDF Image Studio, die kostenlose, private Datei-Plattform für Ihren Browser.',
      keywords: ['nutzungsbedingungen', 'terms of service', 'dateibearbeitung bedingungen'],
    },
  },
  '/about': {
    en: {
      title: 'About PDF Image Studio — Private Browser File Tools',
      description: 'Discover PDF Image Studio, built to provide secure, lightning-fast, and 100% private PDF and image editing tools directly in your browser without cloud uploads.',
      keywords: ['about pdf image studio', 'client side architecture', 'webassembly file tools'],
    },
    ar: {
      title: 'حول منصة PDF Image Studio — أدوات المستندات الخاصة',
      description: 'تعرف على رؤية ومحركات PDF Image Studio لتوفير أدوات تعديل وتنظيم ملفات PDF والصور بأمان وسرعة فائقة في المتصفح.',
      keywords: ['عن المنصة', 'من نحن', 'تطوير أدوات الويب', 'webassembly pdf'],
    },
    es: {
      title: 'Acerca de PDF Image Studio — Herramientas en Navegador',
      description: 'Descubre cómo PDF Image Studio revoluciona la edición de archivos mediante computación privada en el navegador.',
      keywords: ['sobre pdf image studio', 'herramientas seguras', 'edicion local'],
    },
    fr: {
      title: 'À Propos de PDF Image Studio — Utilitaires Sécurisés',
      description: 'Apprenez-en davantage sur PDF Image Studio et notre mission pour un traitement de fichiers ultra-rapide et privé.',
      keywords: ['a propos', 'outils webassembly', 'traitement local sécurisé'],
    },
    de: {
      title: 'Über PDF Image Studio — Private Datei-Tools im Browser',
      description: 'Erfahren Sie mehr über PDF Image Studio und unsere Mission für sichere, blitzschnelle und 100% private PDF- und Bildwerkzeuge ohne Cloud-Uploads.',
      keywords: ['über pdf image studio', 'clientseitige architektur', 'webassembly datei werkzeuge'],
    },
  },
  '/pdf-tools': {
    en: {
      title: 'PDF Utilities & Tools Suite — PDF Image Studio',
      description: 'Free online PDF utilities including merge, split, compress, organize, watermark, and convert. 100% private and secure in your browser.',
      keywords: ['pdf tools suite', 'online pdf editor', 'merge pdf free', 'compress pdf online'],
    },
    ar: {
      title: 'حزمة أدوات ومحرر مستندات PDF — PDF Image Studio',
      description: 'مجموعة متكاملة من أدوات PDF المجانية: دمج، تقسيم، ضغط، ترتيب، ترقيم، توقيع، واستخراج نصوص بأمان تام.',
      keywords: ['حزمة أدوات pdf', 'محرر pdf أونلاين', 'ضغط وتقسيم pdf', 'توقيع وترقيم pdf'],
    },
    es: {
      title: 'Suite de Herramientas PDF — PDF Image Studio',
      description: 'Herramientas PDF gratuitas: unir, dividir, comprimir, organizar, firmar y convertir de forma 100% privada.',
      keywords: ['suite de pdf', 'herramientas pdf gratis', 'organizar y unir pdf'],
    },
    fr: {
      title: 'Suite d\'Outils PDF Gratuits — PDF Image Studio',
      description: 'Toute la boîte à outils PDF : fusionner, diviser, compresser, organiser, signer et numéroter en local.',
      keywords: ['suite outils pdf', 'boîte à outils pdf', 'modifier pdf gratuitement'],
    },
    de: {
      title: 'PDF-Werkzeuge Suite — PDF Image Studio',
      description: 'Kostenlose Online-PDF-Tools: Zusammenfügen, Teilen, Komprimieren, Organisieren, Signieren, Wasserzeichen und Konvertieren. 100% privat im Browser.',
      keywords: ['pdf werkzeuge', 'pdf editor online', 'pdf zusammenfügen kostenlos', 'pdf komprimieren'],
    },
  },
  '/image-tools': {
    en: {
      title: 'Image Editing & Conversion Tools Suite — PDF Image Studio',
      description: 'Free online image editing tools to compress, resize, crop, convert, and filter photos privately in your browser.',
      keywords: ['image tools suite', 'photo editor online', 'compress image', 'convert jpg to webp'],
    },
    ar: {
      title: 'حزمة أدوات وتعديل الصور الشاملة — PDF Image Studio',
      description: 'مجموعة شاملة لمعالجة الصور: ضغط ذكي، تغيير مقاسات، تحويل صيغ، قص، تدوير، فلاتر، واستخراج ألوان بدقة.',
      keywords: ['أدوات الصور', 'تعديل الصور أونلاين', 'ضغط الصور وتصغيرها', 'تحويل صيغ الصور'],
    },
    es: {
      title: 'Suite de Herramientas de Imagen — PDF Image Studio',
      description: 'Herramientas de imagen online: comprime, redimensiona, recorta, convierte y aplica filtros de forma privada.',
      keywords: ['suite de imagenes', 'editor de fotos online', 'comprimir y redimensionar fotos'],
    },
    fr: {
      title: 'Suite d\'Outils d\'Édition d\'Images — PDF Image Studio',
      description: 'Optimisez, redimensionnez, découpez, convertissez et filtrez vos images instantanément dans votre navigateur.',
      keywords: ['suite image', 'éditeur de photos en ligne', 'compresser et recadrer image'],
    },
    de: {
      title: 'Bildbearbeitungs- & Konvertierungs-Suite — PDF Image Studio',
      description: 'Kostenlose Online-Tools zur Bildbearbeitung: Komprimieren, Größe anpassen, zuschneiden, konvertieren und Filter anwenden – privat im Browser.',
      keywords: ['bild tools', 'foto editor online', 'bild komprimieren', 'jpg in webp umwandeln'],
    },
  },
  '/blog': {
    en: {
      title: 'Guides & Tutorials — PDF Image Studio Knowledge Base',
      description: 'Read expert guides and tutorials on how to manage, compress, and edit PDF documents and images securely in your web browser.',
      keywords: ['pdf tutorials', 'image optimization guides', 'browser security articles', 'file format comparison'],
    },
    ar: {
      title: 'دليل المقالات والشروحات التقنية — PDF Image Studio',
      description: 'مقالات وأدلة إرشادية حول أسرار ضغط الملفات، مقارنة صيغ الصور، وحماية سرية المستندات في المتصفح.',
      keywords: ['مقالات تقنية', 'دليل ضغط pdf', 'مقارنة صيغ الصور webp', 'شروحات أمان المستندات'],
    },
    es: {
      title: 'Guías y Artículos — Base de Conocimiento PDF Image Studio',
      description: 'Artículos expertos sobre compresión de documentos, formatos de imagen modernos y seguridad en el navegador.',
      keywords: ['guias de pdf', 'articulos de optimizacion de imagen', 'tutoriales de formato'],
    },
    fr: {
      title: 'Guides et Tutoriels — Base de Connaissances PDF Image Studio',
      description: 'Consultez nos articles et conseils d\'experts sur la compression, les formats modernes et la sécurité des données.',
      keywords: ['guides pdf', 'tutoriels compression', 'optimisation webp et jpg'],
    },
    de: {
      title: 'Anleitungen & Artikel — PDF Image Studio Wissensdatenbank',
      description: 'Lesen Sie Experten-Anleitungen und Tipps zur sicheren Verwaltung, Kompression und Bearbeitung von PDF-Dokumenten und Bildern im Browser.',
      keywords: ['pdf anleitungen', 'bildoptimierung tipps', 'browser sicherheit artikel', 'dateiformate vergleich'],
    },
  },
  '/sitemap.xml': {
    en: {
      title: 'XML Sitemap — PDF Image Studio',
      description: 'XML sitemap of all PDF & Image tools across English, Arabic, Spanish, French, and German.',
      keywords: ['sitemap', 'xml sitemap', 'all tool links'],
    },
    ar: {
      title: 'خريطة الموقع XML — PDF Image Studio',
      description: 'خريطة الموقع لكافة أدوات PDF والصور باللغات العربية والإنجليزية والإسبانية والفرنسية والألمانية.',
      keywords: ['خريطة الموقع', 'sitemap xml', 'فهرس الأدوات'],
    },
    es: {
      title: 'Mapa del Sitio XML — PDF Image Studio',
      description: 'Mapa del sitio XML con todas las herramientas en inglés, español, árabe, francés y alemán.',
      keywords: ['mapa del sitio', 'sitemap xml'],
    },
    fr: {
      title: 'Plan du Site XML — PDF Image Studio',
      description: 'Plan du site XML répertoriant tous les outils PDF et image dans toutes les cinq langues.',
      keywords: ['plan du site', 'sitemap xml'],
    },
    de: {
      title: 'XML Sitemap — PDF Image Studio',
      description: 'XML-Sitemap aller PDF- & Bild-Tools auf Deutsch, Englisch, Arabisch, Spanisch und Französisch.',
      keywords: ['sitemap', 'xml sitemap', 'alle tool links'],
    },
  },
};

export function getStaticSeo(purePath: string, lang: LanguageCode): { title: string; description: string; keywords?: string[] } {
  const clean = purePath.startsWith('/') ? purePath : `/${purePath}`;
  const pageEntry = MULTILINGUAL_STATIC_SEO[clean];

  if (pageEntry && pageEntry[lang]) {
    return pageEntry[lang];
  }
  if (pageEntry && pageEntry.en) {
    return pageEntry.en;
  }

  return {
    title: 'PDF Image Studio — Private Browser File Tools',
    description: 'Convert, compress, organize, edit and optimize your PDF and image files directly in your browser. Fast, 100% private client-side processing, zero server uploads.',
    keywords: ['pdf tools', 'image editor', 'compress pdf', 'merge pdf'],
  };
}

export const STATIC_SEO_PAGES: Record<string, SeoPageMetadata> = Object.entries(MULTILINGUAL_STATIC_SEO).reduce(
  (acc, [route, translations]) => {
    acc[route] = {
      route,
      title: translations.en.title,
      description: translations.en.description,
      keywords: translations.en.keywords,
    };
    return acc;
  },
  {} as Record<string, SeoPageMetadata>
);
