import { LanguageCode, ToolDefinition } from '../types';

interface LocalizedToolInfo {
  name: string;
  tagline: string;
}

const toolTranslationsMap: Record<string, Record<Exclude<LanguageCode, 'en'>, LocalizedToolInfo>> = {
  'pdf-organizer': {
    ar: { name: 'منظم صفحات PDF المرئي', tagline: 'ترتيب، تدوير، وحذف الصفحات بأسلوب مرئي' },
    es: { name: 'Organizador de Páginas PDF', tagline: 'Gestión visual y reordenamiento de páginas' },
    fr: { name: 'Organiseur de Pages PDF', tagline: 'Gestion visuelle et réorganisation des pages' },
  },
  'merge-pdf': {
    ar: { name: 'دمج ملفات PDF', tagline: 'دمج عدة ملفات PDF في مستند واحد' },
    es: { name: 'Unir PDF', tagline: 'Combina varios PDF en un solo documento' },
    fr: { name: 'Fusionner PDF', tagline: 'Combinez plusieurs fichiers PDF en un seul' },
  },
  'split-pdf': {
    ar: { name: 'تقسيم ملفات PDF', tagline: 'استخراج الصفحات أو تقسيم المستندات' },
    es: { name: 'Dividir PDF', tagline: 'Extrae páginas o divide en documentos separados' },
    fr: { name: 'Diviser PDF', tagline: 'Extrayez des pages ou divisez des documents' },
  },
  'compress-pdf': {
    ar: { name: 'ضغط ملفات PDF', tagline: 'تقليل حجم الملف مع الحفاظ على الجودة' },
    es: { name: 'Comprimir PDF', tagline: 'Reduce el tamaño sin perder calidad' },
    fr: { name: 'Compresser PDF', tagline: 'Réduisez la taille en conservant la qualité' },
  },
  'pdf-rotate': {
    ar: { name: 'تدوير PDF', tagline: 'تدوير الصفحات 90°، 180°، أو 270°' },
    es: { name: 'Rotar PDF', tagline: 'Gira páginas a 90°, 180° o 270°' },
    fr: { name: 'Pivoter PDF', tagline: 'Faites pivoter vos pages à 90°, 180° ou 270°' },
  },
  'pdf-watermark': {
    ar: { name: 'إضافة علامة مائية', tagline: 'طباعة علامات مائية نصية على المستند' },
    es: { name: 'Añadir Marca de Agua', tagline: 'Añade textos sobre tus páginas de PDF' },
    fr: { name: 'Ajouter un Filigrane', tagline: 'Inscrivez du texte en filigrane sur votre PDF' },
  },
  'pdf-page-numbers': {
    ar: { name: 'ترقيم الصفحات', tagline: 'إضافة أرقام صفحات أنيقة لمستندات PDF' },
    es: { name: 'Números de Página', tagline: 'Añade numeración personalizada a tus PDF' },
    fr: { name: 'Numéroter les Pages', tagline: 'Numérotez facilement vos documents PDF' },
  },
  'images-to-pdf': {
    ar: { name: 'تحويل الصور إلى PDF', tagline: 'تحويل الصور إلى مستند PDF واحد' },
    es: { name: 'Imágenes a PDF', tagline: 'Convierte tus fotos en un libro PDF' },
    fr: { name: 'Images en PDF', tagline: 'Convertissez vos images et photos en PDF' },
  },
  'pdf-to-images': {
    ar: { name: 'تحويل PDF إلى صور', tagline: 'تصدير صفحات PDF كصور JPG أو PNG فائقة الجودة' },
    es: { name: 'PDF a Imágenes', tagline: 'Exporta páginas PDF como imágenes JPG o PNG' },
    fr: { name: 'PDF en Images', tagline: 'Exportez des pages PDF en images JPG ou PNG' },
  },
  'pdf-metadata': {
    ar: { name: 'بيانات PDF الوصفية', tagline: 'عرض وتعديل خصائص ومعلومات المستند' },
    es: { name: 'Metadatos de PDF', tagline: 'Ver y editar propiedades del documento' },
    fr: { name: 'Métadonnées PDF', tagline: 'Consultez et modifiez les propriétés du document' },
  },
  'pdf-flatten': {
    ar: { name: 'تسطيح وقفل PDF', tagline: 'قفل الحقول التفاعلية والتوقيعات دائماً' },
    es: { name: 'Aplanar PDF', tagline: 'Bloquea formularios e interacciones en el PDF' },
    fr: { name: 'Aplatir PDF', tagline: 'Verrouillez définitivement les formulaires PDF' },
  },
  'pdf-redact-sanitize': {
    ar: { name: 'تنظيف وتنقيح PDF', tagline: 'إزالة النصوص الحساسة والبيانات الخفية' },
    es: { name: 'Redactar y Limpiar PDF', tagline: 'Elimina texto confidencial y metadatos ocultos' },
    fr: { name: 'Caviarder et Assainir PDF', tagline: 'Masquez les données sensibles de vos PDF' },
  },
  'text-to-pdf': {
    ar: { name: 'تحويل النص إلى PDF', tagline: 'تحويل النصوص والمسودات إلى مستند PDF منسق' },
    es: { name: 'Texto a PDF', tagline: 'Convierte texto plano o notas a documentos PDF' },
    fr: { name: 'Texte en PDF', tagline: 'Convertissez du texte brut en documents PDF' },
  },
  'image-compressor': {
    ar: { name: 'ضغط الصور', tagline: 'تقليل حجم JPG، PNG، و WebP حتى 80%' },
    es: { name: 'Comprimir Imagen', tagline: 'Reduce JPG, PNG y WebP hasta un 80%' },
    fr: { name: 'Compresser une Image', tagline: 'Réduisez vos JPG, PNG et WebP jusqu’à 80%' },
  },
  'image-resizer': {
    ar: { name: 'تغيير حجم الصور', tagline: 'تعديل الأبعاد بالبكسل أو النسبة المئوية' },
    es: { name: 'Redimensionar Imagen', tagline: 'Ajusta dimensiones en píxeles o porcentaje' },
    fr: { name: 'Redimensionner une Image', tagline: 'Modifiez les dimensions en pixels ou %' },
  },
  'image-converter': {
    ar: { name: 'تحويل صيغ الصور', tagline: 'التحويل بين JPG، PNG، WebP، و SVG' },
    es: { name: 'Convertir Imagen', tagline: 'Convierte entre JPG, PNG, WebP y SVG' },
    fr: { name: 'Convertir une Image', tagline: 'Convertissez entre JPG, PNG, WebP et SVG' },
  },
  'image-crop': {
    ar: { name: 'قص الصور', tagline: 'قص الصور بنسب أبعاد مخصصة أو حرة' },
    es: { name: 'Recortar Imagen', tagline: 'Recorta fotos con proporciones cuadradas o libres' },
    fr: { name: 'Régler le Cadrage / Rogner', tagline: 'Roguez vos photos avec des ratios prédéfinis' },
  },
  'image-rotate-flip': {
    ar: { name: 'تدوير وقلب الصور', tagline: 'تدوير بزوايا مخصصة وقلب أفقي وعمودي' },
    es: { name: 'Rotar y Voltear Imagen', tagline: 'Gira y voltea fotos horizontal o verticalmente' },
    fr: { name: 'Faire Pivoter et Retourner', tagline: 'Pivotez et retournez vos images librement' },
  },
  'image-filter': {
    ar: { name: 'فلاتر وتأثيرات الصور', tagline: 'تطبيق فلاتر وتعديل السطوع والتباين والتشبع' },
    es: { name: 'Filtros y Efectos de Imagen', tagline: 'Ajusta brillo, contraste, saturación y filtros' },
    fr: { name: 'Filtres et Effets d’Image', tagline: 'Ajustez luminosité, contraste et effets visuels' },
  },
  'image-color-palette': {
    ar: { name: 'استخراج لوحة ألوان الصور', tagline: 'استخراج الألوان الأساسية ورموز HEX بدقة' },
    es: { name: 'Extractor de Paleta de Colores', tagline: 'Extrae colores dominantes y códigos HEX' },
    fr: { name: 'Palette de Couleurs d’Image', tagline: 'Extrayez les couleurs dominantes et codes HEX' },
  },
  'image-strip-exif': {
    ar: { name: 'إزالة بيانات EXIF', tagline: 'حذف بيانات الكاميرا والموقع الجغرافي من الصور' },
    es: { name: 'Eliminar Metadatos EXIF', tagline: 'Elimina datos de cámara y ubicación de fotos' },
    fr: { name: 'Supprimer Métadonnées EXIF', tagline: 'Effacez la géolocalisation et données caméra' },
  },
  'batch-processor': {
    ar: { name: 'معالجة الدفعات (ZIP)', tagline: 'معالجة وضغط عشرات الملفات وتنزيلها كملف ZIP' },
    es: { name: 'Procesador por Lotes (ZIP)', tagline: 'Procesa múltiples archivos y descarga en ZIP' },
    fr: { name: 'Traitement par Lot (ZIP)', tagline: 'Traitez plusieurs fichiers et téléchargez en ZIP' },
  },
  'pdf-extract-text': {
    ar: { name: 'استخراج النصوص من PDF', tagline: 'استخراج الكلمات والفقرات وتصديرها بصيغة TXT أو JSON' },
    es: { name: 'Extraer Texto de PDF', tagline: 'Extrae texto y palabras con exportación a TXT o JSON' },
    fr: { name: 'Extraire le Texte du PDF', tagline: 'Extrayez le texte et les mots au format TXT ou JSON' },
  },
  'pdf-sign': {
    ar: { name: 'توقيع مستند PDF', tagline: 'رسم أو كتابة أو رفع التوقيع ووضعه على صفحات المستند' },
    es: { name: 'Firmar Documento PDF', tagline: 'Dibuja, escribe o sube tu firma electrónica al PDF' },
    fr: { name: 'Signer un Document PDF', tagline: 'Dessinez, écrivez ou importez votre signature sur PDF' },
  },
  'image-watermark': {
    ar: { name: 'إضافة علامة مائية للصور', tagline: 'إضافة نصوص وشعارات لحماية الصور مع التحكم بالشفافية والتدوير' },
    es: { name: 'Marca de Agua para Imágenes', tagline: 'Añade textos o logos a tus fotos con control de opacidad' },
    fr: { name: 'Filigrane sur Image', tagline: 'Ajoutez du texte ou un logo avec contrôle d’opacité' },
  },
  'image-base64': {
    ar: { name: 'تحويل الصور إلى Base64', tagline: 'تحويل الصور إلى Data URI وCSS وHTML أو فك تشفيرها' },
    es: { name: 'Conversor Imagen a Base64', tagline: 'Convierte imágenes a Data URI, CSS, HTML o decodifica' },
    fr: { name: 'Convertisseur Image vers Base64', tagline: 'Encodez en Data URI, CSS, HTML ou décodez en image' },
  },
  'image-border-round': {
    ar: { name: 'إطارات وتدوير حواف الصور', tagline: 'إضافة إطارات ملونة وتدوير الحواف وإنشاء صور رمزية دائرية' },
    es: { name: 'Bordes y Esquinas Redondeadas', tagline: 'Añade marcos, bordes y crea avatares circulares' },
    fr: { name: 'Bordures et Coins Arrondis', tagline: 'Ajoutez des cadres et créez des avatars circulaires' },
  },
};

export function getLocalizedTool(
  tool: ToolDefinition,
  lang: LanguageCode
): { name: string; tagline: string } {
  if (lang === 'en' || !toolTranslationsMap[tool.id]) {
    return { name: tool.name, tagline: tool.tagline };
  }
  const langEntry = toolTranslationsMap[tool.id][lang as Exclude<LanguageCode, 'en'>];
  if (!langEntry) {
    return { name: tool.name, tagline: tool.tagline };
  }
  return langEntry;
}
