import { LanguageCode } from '../types';

export interface Translations {
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  chooseFile: string;
  exploreTools: string;
  dropFilesHere: string;
  dropSubtitle: string;
  processingLocal: string;
  processingLocalDesc: string;
  popularTools: string;
  pdfTools: string;
  imageTools: string;
  allTools: string;
  whyNuvio: string;
  howItWorks: string;
  privacyTitle: string;
  privacyDesc: string;
  faqTitle: string;
  faqSubtitle: string;
  recentTools: string;
  favorites: string;
  noFavorites: string;
  clearHistory: string;
  searchPlaceholder: string;
  searchTools: string;
  recommendedTools: string;
  supportedFormats: string;
  processFiles: string;
  download: string;
  downloadZip: string;
  reset: string;
  fileDetails: string;
  originalSize: string;
  outputSize: string;
  savings: string;
  dimensions: string;
  quality: string;
  rotation: string;
  pages: string;
  installApp: string;
  installIos: string;
  offlineNotice: string;
  language: string;
  theme: string;
  lightMode: string;
  darkMode: string;
  systemMode: string;
  proNotice: string;
  terms: string;
  about: string;
  contact: string;
  blog: string;
  readyToStart: string;
  noUploadsRequired: string;
  organize: string;
  optimize: string;
  convert: string;
  security: string;
  findTool: string;
  allToolsCategories: string;
  clientSidePrivacy: string;
  privacy: string;
  chooseFileBtn: string;
  orDropHere: string;
  secureNotice: string;
  freeUnlimited: string;
  zeroServerUploads: string;
  noRegistrationNeeded: string;
  featuredPdfSuite: string;
  pdfOrganizerTitle: string;
  pdfOrganizerDesc: string;
  launchPdfOrganizer: string;
  featuredImageSuite: string;
  imageSuiteTitle: string;
  imageSuiteDesc: string;
  launchImageSuite: string;
  allPdfImageUtilities: string;
  selectToolToProcess: string;
  openTool: string;
  backToHome: string;
  saved: string;
  favorite: string;
  share: string;
  copied: string;
  clientSideEngine: string;
  zeroUploadsNoServer: string;
  faqs: string;
  faqSub: string;
  relatedTools: string;
  relatedSub: string;
  viewAll: string;
  flagshipUtility: string;
  choosePdfToCompress: string;
  reducePdfDesc: string;
  choosePdfFile: string;
  selectedPdf: string;
  changeFile: string;
  selectCompressionProfile: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    tagline: 'Your files. Your way.',
    heroTitle: 'Powerful file tools. Private by design.',
    heroSubtitle: 'Convert, compress, organize, edit and optimize your files directly in your browser without uploading to foreign servers.',
    chooseFile: 'Choose a file',
    exploreTools: 'Explore all tools',
    dropFilesHere: 'Drop your files here to start',
    dropSubtitle: 'or click to browse from device. Supports PDF, JPG, PNG, WebP, SVG',
    processingLocal: '100% Client-Side Processing',
    processingLocalDesc: 'Your files never leave your computer or phone. Processing runs entirely in your local browser runtime.',
    popularTools: 'Popular Tools',
    pdfTools: 'PDF Toolbox',
    imageTools: 'Image Toolbox',
    allTools: 'All Tools',
    whyNuvio: 'Why Choose NUVIO?',
    howItWorks: 'How It Works',
    privacyTitle: 'Private by Architecture, Not Just Policy',
    privacyDesc: 'Most online file tools upload your sensitive contracts, photos, and records to remote cloud servers. NUVIO runs modern WebAssembly and Canvas engines directly in your browser sandbox.',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about NUVIO’s privacy-first architecture.',
    recentTools: 'Recently Used',
    favorites: 'Favorites',
    noFavorites: 'No favorites added yet. Star any tool to pin it here!',
    clearHistory: 'Clear history',
    searchPlaceholder: 'Search tools (e.g. compress pdf, resize image)...',
    searchTools: 'Search tools (Cmd+K)',
    recommendedTools: 'Recommended Actions for Your File',
    supportedFormats: 'Supports PDF, JPG, PNG, WebP & more',
    processFiles: 'Process Now',
    download: 'Download Result',
    downloadZip: 'Download All as ZIP',
    reset: 'Start Over',
    fileDetails: 'File Information',
    originalSize: 'Original Size',
    outputSize: 'Output Size',
    savings: 'Space Saved',
    dimensions: 'Dimensions',
    quality: 'Compression Quality',
    rotation: 'Rotation',
    pages: 'Pages',
    installApp: 'Install App',
    installIos: 'Install on iOS',
    offlineNotice: 'Offline Mode Active — Local browser utilities are available without internet.',
    language: 'Language',
    theme: 'Theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    systemMode: 'System',
    proNotice: 'Engineered for high speed, zero server costs, and global scalability.',
    terms: 'Terms of Use',
    about: 'About NUVIO',
    contact: 'Contact & Feedback',
    blog: 'Guides & Articles',
    readyToStart: 'Ready to optimize your files securely?',
    noUploadsRequired: 'Zero uploads. Zero signups. Zero waiting.',
    organize: 'Organize',
    optimize: 'Optimize',
    convert: 'Convert',
    security: 'Security',
    findTool: 'Find a tool...',
    allToolsCategories: 'ALL TOOLS & CATEGORIES',
    clientSidePrivacy: '100% Client-Side Privacy',
    privacy: 'Privacy',
    chooseFileBtn: 'Select PDF files',
    orDropHere: 'or drop PDFs & images here',
    secureNotice: '100% Secure & Private — Files processed locally in your browser',
    freeUnlimited: '100% Free & Unlimited',
    zeroServerUploads: 'Zero Server File Uploads',
    noRegistrationNeeded: 'No Registration Needed',
    featuredPdfSuite: 'Featured PDF Suite',
    pdfOrganizerTitle: 'Visual PDF Page Organizer',
    pdfOrganizerDesc: 'Reorder, rotate, delete, duplicate, and extract PDF pages visually with intuitive drag & drop. 100% private in-browser processing.',
    launchPdfOrganizer: 'Launch PDF Organizer',
    featuredImageSuite: 'Featured Image Suite',
    imageSuiteTitle: 'Image Optimizer & Converter',
    imageSuiteDesc: 'Compress photos up to 80%, resize dimensions, convert between JPG/PNG/WebP, crop, and apply photo filters with instant live rendering.',
    launchImageSuite: 'Launch Image Suite',
    allPdfImageUtilities: 'All PDF & Image Utilities',
    selectToolToProcess: 'Select a tool to process your files securely inside your browser memory.',
    openTool: 'Open Tool',
    backToHome: 'Back to Home',
    saved: 'Saved',
    favorite: 'Favorite',
    share: 'Share',
    copied: 'Copied',
    clientSideEngine: '100% Client-Side Engine',
    zeroUploadsNoServer: 'Zero uploads • No remote server storage',
    faqs: 'Frequently Asked Questions',
    faqSub: 'Detailed answers about tool mechanics and browser execution.',
    relatedTools: 'Related Tools',
    relatedSub: 'Continue organizing or transforming your documents seamlessly.',
    viewAll: 'View All',
    flagshipUtility: 'FLAGSHIP UTILITY',
    choosePdfToCompress: 'Choose a PDF to Compress',
    reducePdfDesc: 'Reduce PDF file size while preserving readability and document layout.',
    choosePdfFile: 'Choose PDF File',
    selectedPdf: 'Selected PDF',
    changeFile: 'Change File',
    selectCompressionProfile: 'Select Compression Profile',
  },
  ar: {
    tagline: 'ملفاتك. بطريقتك.',
    heroTitle: 'أدوات ملفات فائقة القوة. خصوصية تامة.',
    heroSubtitle: 'تحويل، ضغط، تنظيم، وتعديل ملفاتك وصورك مباشرة في متصفحك دون رفعها إلى أي خوادم خارجية.',
    chooseFile: 'اختر ملفاً',
    exploreTools: 'استكشف كافة الأدوات',
    dropFilesHere: 'أفلت ملفاتك هنا للبدء',
    dropSubtitle: 'أو انقر للتصفح من جهازك. يدعم PDF، JPG، PNG، WebP والمزيد',
    processingLocal: 'معالجة محلية 100% داخل المتصفح',
    processingLocalDesc: 'ملفاتك لا تغادر جهازك أو هاتفك أبداً. المعالجة تتم بالكامل داخل متصفحك.',
    popularTools: 'الأدوات الأكثر استخداماً',
    pdfTools: 'أدوات PDF',
    imageTools: 'أدوات الصور',
    allTools: 'جميع الأدوات',
    whyNuvio: 'لماذا NUVIO؟',
    howItWorks: 'كيف يعمل؟',
    privacyTitle: 'خصوصية عبر الهيكلية، وليس مجرد وعود',
    privacyDesc: 'معظم المواقع ترفع مستنداتك وصورك إلى خوادم بعيدة. NUVIO يعمل بالكامل محلياً داخل جهازك دون رفع أي بيانات.',
    faqTitle: 'الأسئلة الشائعة',
    faqSubtitle: 'كل ما ترغب بمعرفته حول الأمان والمعالجة المحلية الفورية.',
    recentTools: 'المستخدمة مؤخراً',
    favorites: 'المفضلة',
    noFavorites: 'لم تتم إضافة أي أدوات للمفضلة بعد. انقر على النجمة لإضافتها!',
    clearHistory: 'مسح السجل',
    searchPlaceholder: 'ابحث عن أداة (مثال: ضغط PDF، تغيير حجم الصورة)...',
    searchTools: 'بحث عن أداة',
    recommendedTools: 'الإجراءات المقترحة لملفك',
    supportedFormats: 'يدعم صيغ PDF، JPG، PNG، WebP',
    processFiles: 'معالجة الآن',
    download: 'تحميل النتيجة',
    downloadZip: 'تحميل الكل بصيغة ZIP',
    reset: 'البدء من جديد',
    fileDetails: 'تفاصيل الملف',
    originalSize: 'الحجم الأصلي',
    outputSize: 'الحجم بعد المعالجة',
    savings: 'نسبة التوفير',
    dimensions: 'الأبعاد',
    quality: 'جودة الضغط',
    rotation: 'التدوير',
    pages: 'الصفحات',
    installApp: 'تثبيت التطبيق',
    installIos: 'تثبيت على iOS',
    offlineNotice: 'وضع العمل بدون اتصال مفعّل — الأدوات المحلية تعمل بدون إنترنت.',
    language: 'اللغة',
    theme: 'المظهر',
    lightMode: 'فاتح',
    darkMode: 'داكن',
    systemMode: 'النظام',
    proNotice: 'مصمم لتحقيق أقصى سرعة وأعلى حماية دون تكاليف خوادم.',
    terms: 'شروط الاستخدام',
    about: 'عن NUVIO',
    contact: 'التواصل',
    blog: 'المقالات والأدلة',
    readyToStart: 'جاهز لتنظيم ملفاتك بكل أمان وسرعة؟',
    noUploadsRequired: 'بدون رفع، بدون تسجيل، بدون انتظار.',
    organize: 'تنظيم',
    optimize: 'تحسين',
    convert: 'تحويل',
    security: 'أمان',
    findTool: 'بحث عن أداة...',
    allToolsCategories: 'كافة الأدوات والتصنيفات',
    clientSidePrivacy: 'خصوصية محلية 100%',
    privacy: 'الخصوصية',
    chooseFileBtn: 'اختر ملفات PDF والصور',
    orDropHere: 'أو أفلت ملفات PDF والصور هنا',
    secureNotice: 'آمن وخاص 100% — تتم معالجة الملفات محلياً داخل متصفحك',
    freeUnlimited: 'مجاني 100% وغير محدود',
    zeroServerUploads: 'بدون رفع أي ملفات للخوادم',
    noRegistrationNeeded: 'لا يلزم تسجيل حساب',
    featuredPdfSuite: 'مجموعة أدوات PDF المميزة',
    pdfOrganizerTitle: 'منظم صفحات PDF المرئي',
    pdfOrganizerDesc: 'إعادة ترتيب، تدوير، حذف، وتكرار واستخراج صفحات PDF بأسلوب مرئي وسهل. معالجة خاصة 100% داخل المتصفح.',
    launchPdfOrganizer: 'تشغيل منظم PDF',
    featuredImageSuite: 'مجموعة أدوات الصور المميزة',
    imageSuiteTitle: 'مُحسن ومُحول الصور الفائق',
    imageSuiteDesc: 'ضغط الصور حتى 80%، تغيير الأبعاد، التحويل بين JPG/PNG/WebP، القص، وتطبيق المؤثرات مع معاينة مباشرة.',
    launchImageSuite: 'تشغيل أدوات الصور',
    allPdfImageUtilities: 'جميع أدوات الـ PDF والصور',
    selectToolToProcess: 'اختر أداة لمعالجة ملفاتك بأمان تام داخل ذاكرة متصفحك.',
    openTool: 'فتح الأداة',
    backToHome: 'العودة للرئيسية',
    saved: 'محفوظ',
    favorite: 'المفضلة',
    share: 'مشاركة',
    copied: 'تم النسخ',
    clientSideEngine: 'محرك محلي 100%',
    zeroUploadsNoServer: 'بدون رفع • لا يتم التخزين على خوادم بعيدة',
    faqs: 'الأسئلة الشائعة',
    faqSub: 'إجابات تفصيلية حول كيفية تشغيل الأداة وآلية تنفيذها داخل المتصفح.',
    relatedTools: 'أدوات ذات صلة',
    relatedSub: 'واصل تنظيم أو تحويل مستنداتك بكل سهولة.',
    viewAll: 'عرض الكل',
    flagshipUtility: 'أداة رئيسية',
    choosePdfToCompress: 'اختر ملف PDF للضغط',
    reducePdfDesc: 'تقليل حجم ملف PDF مع الحفاظ على وضوح النص وتنسيق المستند.',
    choosePdfFile: 'اختر ملف PDF',
    selectedPdf: 'ملف PDF المحدد',
    changeFile: 'تغيير الملف',
    selectCompressionProfile: 'اختر مستوى الضغط',
  },
  es: {
    tagline: 'Tus archivos. A tu manera.',
    heroTitle: 'Herramientas potentes. Privadas por diseño.',
    heroSubtitle: 'Convierte, comprime, organiza, edita y optimiza tus archivos directamente en tu navegador sin subirlos a ningún servidor.',
    chooseFile: 'Elegir un archivo',
    exploreTools: 'Explorar herramientas',
    dropFilesHere: 'Arrastra tus archivos aquí para comenzar',
    dropSubtitle: 'o haz clic para explorar en tu dispositivo. Soporta PDF, JPG, PNG, WebP',
    processingLocal: 'Procesamiento 100% en el navegador',
    processingLocalDesc: 'Tus archivos nunca salen de tu ordenador o teléfono. Todo se procesa localmente.',
    popularTools: 'Herramientas populares',
    pdfTools: 'Herramientas PDF',
    imageTools: 'Herramientas de imagen',
    allTools: 'Todas las herramientas',
    whyNuvio: '¿Por qué NUVIO?',
    howItWorks: 'Cómo funciona',
    privacyTitle: 'Privacidad por arquitectura, no solo promesa',
    privacyDesc: 'La mayoría de servicios suben tus contratos y fotos a la nube. NUVIO procesa todo directamente en tu dispositivo.',
    faqTitle: 'Preguntas frecuentes',
    faqSubtitle: 'Todo lo que necesitas saber sobre nuestra arquitectura privada.',
    recentTools: 'Usado recientemente',
    favorites: 'Favoritos',
    noFavorites: 'Sin favoritos aún. ¡Marca una herramienta con estrella!',
    clearHistory: 'Borrar historial',
    searchPlaceholder: 'Buscar herramientas (ej. comprimir pdf, redimensionar)...',
    searchTools: 'Buscar herramientas (Cmd+K)',
    recommendedTools: 'Operaciones recomendadas para tu archivo',
    supportedFormats: 'Soporta PDF, JPG, PNG, WebP y más',
    processFiles: 'Procesar ahora',
    download: 'Descargar resultado',
    downloadZip: 'Descargar todo en ZIP',
    reset: 'Comenzar de nuevo',
    fileDetails: 'Información del archivo',
    originalSize: 'Tamaño original',
    outputSize: 'Tamaño final',
    savings: 'Ahorro',
    dimensions: 'Dimensiones',
    quality: 'Calidad de compresión',
    rotation: 'Rotación',
    pages: 'Páginas',
    installApp: 'Instalar aplicación',
    installIos: 'Instalar en iOS',
    offlineNotice: 'Modo sin conexión activo — Las herramientas locales funcionan sin internet.',
    language: 'Idioma',
    theme: 'Tema',
    lightMode: 'Claro',
    darkMode: 'Oscuro',
    systemMode: 'Sistema',
    proNotice: 'Diseñado para máxima velocidad y privacidad absoluta.',
    terms: 'Términos de uso',
    about: 'Acerca de NUVIO',
    contact: 'Contacto',
    blog: 'Guías y artículos',
    readyToStart: '¿Listo para optimizar tus archivos?',
    noUploadsRequired: 'Sin subidas. Sin registros. Sin esperas.',
    organize: 'Organizar',
    optimize: 'Optimizar',
    convert: 'Convertir',
    security: 'Seguridad',
    findTool: 'Buscar herramienta...',
    allToolsCategories: 'TODAS LAS HERRAMIENTAS',
    clientSidePrivacy: 'Privacidad 100% local',
    privacy: 'Privacidad',
    chooseFileBtn: 'Seleccionar archivos PDF',
    orDropHere: 'o arrastra PDFs e imágenes aquí',
    secureNotice: '100% Seguro y Privado — Procesado en tu navegador',
    freeUnlimited: '100% Gratis e Ilimitado',
    zeroServerUploads: 'Sin subidas a servidores',
    noRegistrationNeeded: 'Sin registro necesario',
    featuredPdfSuite: 'Suite PDF Destacada',
    pdfOrganizerTitle: 'Organizador Visual de Páginas PDF',
    pdfOrganizerDesc: 'Reordena, rota, elimina y extrae páginas PDF visualmente con arrastrar y soltar. Procesamiento 100% privado.',
    launchPdfOrganizer: 'Iniciar Organizador PDF',
    featuredImageSuite: 'Suite de Imágenes Destacada',
    imageSuiteTitle: 'Optimizador y Convertidor de Imágenes',
    imageSuiteDesc: 'Comprime fotos hasta un 80%, redimensiona, convierte entre JPG/PNG/WebP, recorta y aplica filtros al instante.',
    launchImageSuite: 'Iniciar Suite de Imágenes',
    allPdfImageUtilities: 'Todas las Utilidades de PDF e Imágenes',
    selectToolToProcess: 'Selecciona una herramienta para procesar tus archivos de forma segura.',
    openTool: 'Abrir Herramienta',
    backToHome: 'Volver al Inicio',
    saved: 'Guardado',
    favorite: 'Favorito',
    share: 'Compartir',
    copied: 'Copiado',
    clientSideEngine: 'Motor 100% en Navegador',
    zeroUploadsNoServer: 'Sin subidas • Sin almacenamiento en servidor',
    faqs: 'Preguntas Frecuentes',
    faqSub: 'Respuestas detalladas sobre el funcionamiento en navegador.',
    relatedTools: 'Herramientas Relacionadas',
    relatedSub: 'Continúa organizando o transformando tus documentos fácilmente.',
    viewAll: 'Ver Todo',
    flagshipUtility: 'HERRAMIENTA DESTACADA',
    choosePdfToCompress: 'Selecciona un PDF para comprimir',
    reducePdfDesc: 'Reduce el tamaño del PDF conservando la legibilidad.',
    choosePdfFile: 'Seleccionar Archivo PDF',
    selectedPdf: 'PDF Seleccionado',
    changeFile: 'Cambiar Archivo',
    selectCompressionProfile: 'Selecciona el nivel de compresión',
  },
  fr: {
    tagline: 'Vos fichiers. À votre façon.',
    heroTitle: 'Outils de fichiers puissants. Privés par conception.',
    heroSubtitle: 'Convertissez, compressez, organisez, éditez et optimisez vos fichiers directement dans votre navigateur sans téléversement vers des serveurs distants.',
    chooseFile: 'Choisir un fichier',
    exploreTools: 'Explorer tous les outils',
    dropFilesHere: 'Glissez vos fichiers ici pour commencer',
    dropSubtitle: 'ou cliquez pour parcourir. Prend en charge PDF, JPG, PNG, WebP',
    processingLocal: 'Traitement 100% local dans le navigateur',
    processingLocalDesc: 'Vos fichiers ne quittent jamais votre appareil. Tout est exécuté dans le moteur sécurisé de votre navigateur.',
    popularTools: 'Outils populaires',
    pdfTools: 'Boîte à outils PDF',
    imageTools: 'Outils d’image',
    allTools: 'Tous les outils',
    whyNuvio: 'Pourquoi NUVIO ?',
    howItWorks: 'Comment ça marche',
    privacyTitle: 'La confidentialité par conception',
    privacyDesc: 'Les outils classiques envoient vos documents vers des serveurs distants. NUVIO traite tout directement sur votre machine.',
    faqTitle: 'Foire aux questions',
    faqSubtitle: 'Tout ce que vous devez savoir sur notre architecture sécurisée.',
    recentTools: 'Récemment utilisés',
    favorites: 'Favoris',
    noFavorites: 'Aucun favori pour le moment. Cliquez sur l’étoile pour épingler un outil !',
    clearHistory: 'Effacer l’historique',
    searchPlaceholder: 'Rechercher un outil (ex: compresser pdf, redimensionner)...',
    searchTools: 'Recherche rapide (Cmd+K)',
    recommendedTools: 'Actions recommandées pour votre fichier',
    supportedFormats: 'Prend en charge PDF, JPG, PNG, WebP',
    processFiles: 'Traiter maintenant',
    download: 'Télécharger le résultat',
    downloadZip: 'Tout télécharger en ZIP',
    reset: 'Recommencer',
    fileDetails: 'Informations du fichier',
    originalSize: 'Taille originale',
    outputSize: 'Taille finale',
    savings: 'Espace économisé',
    dimensions: 'Dimensions',
    quality: 'Qualité de compression',
    rotation: 'Rotation',
    pages: 'Pages',
    installApp: 'Installer l’application',
    installIos: 'Installer sur iOS',
    offlineNotice: 'Mode hors ligne actif — Les utilitaires locaux fonctionnent sans connexion.',
    language: 'Langue',
    theme: 'Thème',
    lightMode: 'Clair',
    darkMode: 'Sombre',
    systemMode: 'Système',
    proNotice: 'Conçu pour une vitesse instantanée et une confidentialité totale.',
    terms: 'Conditions d’utilisation',
    about: 'À propos de NUVIO',
    contact: 'Contact',
    blog: 'Guides et articles',
    readyToStart: 'Prêt à optimiser vos fichiers en toute sécurité ?',
    noUploadsRequired: 'Aucun téléversement. Aucune inscription. Aucun délai.',
    organize: 'Organiser',
    optimize: 'Optimiser',
    convert: 'Convertir',
    security: 'Sécurité',
    findTool: 'Trouver un outil...',
    allToolsCategories: 'TOUS LES OUTILS ET CATÉGORIES',
    clientSidePrivacy: 'Confidentialité 100% locale',
    privacy: 'Confidentialité',
    chooseFileBtn: 'Sélectionner des fichiers PDF',
    orDropHere: 'ou glissez les PDF et images ici',
    secureNotice: '100% Sécurisé et Privé — Fichiers traités localement dans votre navigateur',
    freeUnlimited: '100% Gratuit et Illimité',
    zeroServerUploads: 'Aucun téléversement sur serveur',
    noRegistrationNeeded: 'Aucune inscription requise',
    featuredPdfSuite: 'Suite PDF En Vedette',
    pdfOrganizerTitle: 'Organiseur Visuel de Pages PDF',
    pdfOrganizerDesc: 'Réordonnez, pivotez, supprimez et extrayez des pages PDF visuellement par glisser-déposer. 100% privé.',
    launchPdfOrganizer: 'Lancer l’organiseur PDF',
    featuredImageSuite: 'Suite d’Images En Vedette',
    imageSuiteTitle: 'Optimiseur et Convertisseur d’Images',
    imageSuiteDesc: 'Compressez des photos jusqu’à 80%, redimensionnez, convertissez entre JPG/PNG/WebP et découpez en direct.',
    launchImageSuite: 'Lancer la suite d’images',
    allPdfImageUtilities: 'Tous les Utilitaires PDF et Images',
    selectToolToProcess: 'Sélectionnez un outil pour traiter vos fichiers en toute sécurité dans la mémoire de votre navigateur.',
    openTool: 'Ouvrir l’outil',
    backToHome: 'Retour à l’accueil',
    saved: 'Enregistré',
    favorite: 'Favori',
    share: 'Partager',
    copied: 'Copié',
    clientSideEngine: 'Moteur 100% Client',
    zeroUploadsNoServer: 'Aucun téléversement • Pas de stockage serveur',
    faqs: 'Foire Aux Questions',
    faqSub: 'Réponses détaillées sur le fonctionnement dans votre navigateur.',
    relatedTools: 'Outils Associés',
    relatedSub: 'Continuez à organiser ou transformer vos documents facilement.',
    viewAll: 'Voir Tout',
    flagshipUtility: 'UTILITAIRE PHARE',
    choosePdfToCompress: 'Choisissez un PDF à compresser',
    reducePdfDesc: 'Réduisez la taille du PDF en conservant la lisibilité.',
    choosePdfFile: 'Choisir un fichier PDF',
    selectedPdf: 'PDF Sélectionné',
    changeFile: 'Changer de fichier',
    selectCompressionProfile: 'Sélectionnez le niveau de compression',
  },
};
