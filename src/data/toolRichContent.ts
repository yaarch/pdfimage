import { LanguageCode } from '../types';

export interface StepItem {
  stepNumber: number;
  title: string;
  description: string;
}

export interface OptionInfoItem {
  label: string;
  value: string;
  description?: string;
}

export interface ToolRichContent {
  toolId: string;
  howToUseTitle: string;
  overviewTitle: string;
  overviewText: string;
  steps: StepItem[];
  optionsTitle: string;
  optionsList: OptionInfoItem[];
  tipsTitle: string;
  tips: string[];
}

export const toolRichContentMap: Record<string, Record<LanguageCode, ToolRichContent>> = {
  // 1. PDF ORGANIZER
  'pdf-organizer': {
    en: {
      toolId: 'pdf-organizer',
      howToUseTitle: 'How to Organize PDF Pages Online',
      overviewTitle: 'About Visual PDF Page Organizer',
      overviewText: 'Reorder, rotate, delete, or extract specific pages from any PDF file with an intuitive visual drag-and-drop workspace. Processing happens entirely within your browser for instant performance and absolute privacy.',
      steps: [
        { stepNumber: 1, title: 'Select or Drag PDF', description: 'Choose any PDF file from your device. The tool renders high-resolution page thumbnails instantly in your browser.' },
        { stepNumber: 2, title: 'Reorder, Rotate & Delete', description: 'Drag pages into your desired order, rotate misplaced pages 90° or 180°, or delete unneeded pages with one click.' },
        { stepNumber: 3, title: 'Apply Page Numbers (Optional)', description: 'Optionally add clean sequential page numbers and select custom rotation settings for exported pages.' },
        { stepNumber: 4, title: 'Export & Download', description: 'Click Export PDF to compile your reorganized document and save it directly to your device.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Input', value: 'PDF (.pdf documents)' },
        { label: 'Page Actions', value: 'Drag reorder, 90°/180°/270° rotation, single & batch deletion' },
        { label: 'Output Format', value: 'Clean, standardized PDF document' },
        { label: 'Execution Sandbox', value: '100% Client-Side Memory Processing (Zero Server Uploads)' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Use the Select All control to rotate or remove multiple pages simultaneously.',
        'Page thumbnails render locally in vector crispness without compressing or degrading original PDF text quality.',
        'You can undo rotations or re-add removed pages before triggering the final export.'
      ]
    },
    ar: {
      toolId: 'pdf-organizer',
      howToUseTitle: 'كيفية إعادة ترتيب وتنظيم صفحات PDF أونلاين',
      overviewTitle: 'عن أداة تنظيم صفحات PDF المرئية',
      overviewText: 'قم بإعادة ترتيب، تدوير، حذف، أو استخراج صفحات معينة من ملف PDF باستخدام بيئة عمل بصرية تفاعلية بالسحب والإفلات. تتم العملية بالكامل داخل ذاكرة متصفحك لضمان السرعة الفائقة والخصوصية المطلقة.',
      steps: [
        { stepNumber: 1, title: 'اختر أو اسحب ملف PDF', description: 'حدد المستند من جهازك، وستظهر مصغرات جميع الصفحات بدقة عالية فوراً داخل متصفحك.' },
        { stepNumber: 2, title: 'رتب ودوّر واحذف الصفحات', description: 'اسحب الصفحات لتغيير ترتيبها، دوّر الصفحات المقلوبة بمقدار 90° أو 180°، أو احذف الصفحات غير المرغوبة بضغطة واحدة.' },
        { stepNumber: 3, title: 'إضافة أرقام الصفحات (اختياري)', description: 'يمكنك خيار إضافة ترقيم تسلسلي أنيق للمستند وضبط اتجاهات الصفحات.' },
        { stepNumber: 4, title: 'تصدير وتحميل الملف النهائي', description: 'اضغط على تصدير PDF لتجميع المستند المنظم وتحميله مباشرة على جهازك.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'الملفات المدعومة', value: 'مستندات PDF (.pdf)' },
        { label: 'الإجراءات المتاحة', value: 'إعادة الترتيب بالسحب، التدوير 90°/180°/270°، الحذف الفردي والجماعي' },
        { label: 'صيغة المخرجات', value: 'ملف PDF قياسي ومنظم' },
        { label: 'الأمان والمعالجة', value: 'معالجة محلية 100% داخل المتصفح (بدون رفع للخوادم)' },
      ],
      tipsTitle: 'نصائح وإرشادات لاحتراف تنظيم ملفات PDF',
      tips: [
        'استخدم خيار تحديد الكل لتدوير أو حذف صفحات متعددة دفعة واحدة.',
        'تتم معاينة مصغرات الصفحات محلياً دون أي ضغط أو تقليل لجودة النصوص والخطوط الأصلية.',
        'يمكنك التراجع عن التدوير أو إعادة ترتيب الصفحات بحرية قبل الضغط على زر التصدير النهائي.'
      ]
    },
    fr: {
      toolId: 'pdf-organizer',
      howToUseTitle: 'Comment organiser les pages PDF en ligne',
      overviewTitle: 'À propos de l’Organiseur visuel de pages PDF',
      overviewText: 'Réorganisez, pivotez, supprimez ou extrayez des pages spécifiques de n’importe quel fichier PDF grâce à un espace de travail visuel glisser-déposer. Le traitement s’effectue entièrement dans votre navigateur.',
      steps: [
        { stepNumber: 1, title: 'Sélectionner ou glisser le PDF', description: 'Choisissez un fichier PDF depuis votre appareil pour afficher instantanément les miniatures de pages.' },
        { stepNumber: 2, title: 'Réordonner, pivoter & supprimer', description: 'Faites glisser les pages dans l’ordre souhaité, pivotez à 90° ou 180°, ou supprimez les pages inutiles.' },
        { stepNumber: 3, title: 'Numérotation des pages (Optionnel)', description: 'Ajoutez une numérotation séquentielle propre et ajustez l’orientation si nécessaire.' },
        { stepNumber: 4, title: 'Exporter & Télécharger', description: 'Cliquez sur Exporter le PDF pour compiler votre document réorganisé et l’enregistrer.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Format d’entrée', value: 'Documents PDF (.pdf)' },
        { label: 'Actions disponibles', value: 'Glisser-déposer, rotation 90°/180°/270°, suppression unique & groupée' },
        { label: 'Format de sortie', value: 'Document PDF standardisé' },
        { label: 'Sécurité', value: 'Traitement 100% local dans le navigateur (Zéro téléversement)' },
      ],
      tipsTitle: 'Conseils pratiques & Meilleures pratiques',
      tips: [
        'Utilisez la sélection multiple pour pivoter ou supprimer plusieurs pages simultanément.',
        'Les aperçus de pages sont générés localement sans dégrader la qualité des textes vectoriels.',
        'Vous pouvez modifier l’ordre des pages autant de fois que nécessaire avant le téléchargement final.'
      ]
    },
    es: {
      toolId: 'pdf-organizer',
      howToUseTitle: 'Cómo organizar páginas de PDF en línea',
      overviewTitle: 'Sobre el Organizador Visual de Páginas PDF',
      overviewText: 'Reordena, rota, elimina o extrae páginas específicas de cualquier archivo PDF mediante un panel visual de arrastrar y soltar. El procesamiento se ejecuta por completo en tu navegador.',
      steps: [
        { stepNumber: 1, title: 'Seleccionar o arrastrar PDF', description: 'Elige un archivo PDF de tu dispositivo para generar miniaturas de alta resolución al instante.' },
        { stepNumber: 2, title: 'Reordenar, rotar y eliminar', description: 'Arrastra páginas para cambiar su orden, rota páginas desalineadas 90° o 180° y elimina las no deseadas.' },
        { stepNumber: 3, title: 'Numeración de páginas (Opcional)', description: 'Agrega números de página secuenciales si lo deseas antes de exportar.' },
        { stepNumber: 4, title: 'Exportar y descargar', description: 'Haz clic en Exportar PDF para generar tu archivo organizado y guardarlo en tu equipo.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Entrada soportada', value: 'Documentos PDF (.pdf)' },
        { label: 'Acciones de página', value: 'Arrastrar para reordenar, rotación 90°/180°/270°, borrado individual y masivo' },
        { label: 'Formato de salida', value: 'PDF estandarizado y limpio' },
        { label: 'Privacidad', value: 'Procesamiento 100% en el cliente (Sin subidas a servidores)' },
      ],
      tipsTitle: 'Consejos y buenas prácticas',
      tips: [
        'Selecciona varias páginas a la vez para aplicar rotaciones o eliminaciones en bloque.',
        'La vista previa local conserva la resolución original sin comprimir texto ni gráficos.',
        'Puedes reajustar la secuencia cuantas veces quieras antes de descargar el resultado.'
      ]
    },
    de: {
      toolId: 'pdf-organizer',
      howToUseTitle: 'So organisieren Sie PDF-Seiten online',
      overviewTitle: 'Über den visuellen PDF-Seitenorganizer',
      overviewText: 'Ordnen, drehen, löschen oder extrahieren Sie bestimmte Seiten jeder PDF-Datei mit einem intuitiven visuellen Drag-and-Drop-Arbeitsbereich. Die Verarbeitung erfolgt vollständig in Ihrem Browser.',
      steps: [
        { stepNumber: 1, title: 'PDF auswählen oder ablegen', description: 'Wählen Sie eine PDF-Datei aus. Die Vorschaubilder werden sofort lokal in Ihrem Browser gerendert.' },
        { stepNumber: 2, title: 'Neu anordnen, drehen & löschen', description: 'Ziehen Sie Seiten an die gewünschte Position, drehen Sie falsch ausgerichtete Seiten um 90°/180° oder löschen Sie unerwünschte Seiten.' },
        { stepNumber: 3, title: 'Seitenzahlen hinzufügen (Optional)', description: 'Fügen Sie optional eine saubere fortlaufende Seitennummerierung hinzu.' },
        { stepNumber: 4, title: 'Exportieren & Herunterladen', description: 'Klicken Sie auf PDF exportieren, um Ihr organisiertes Dokument herunterzuladen.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Eingabe', value: 'PDF-Dokumente (.pdf)' },
        { label: 'Seitenaktionen', value: 'Drag-and-Drop, Drehung 90°/180°/270°, Einzel- & Stapellöschung' },
        { label: 'Ausgabeformat', value: 'Standardisiertes PDF-Dokument' },
        { label: 'Datenschutz', value: '100% lokale Browserverarbeitung (Keine Server-Uploads)' },
      ],
      tipsTitle: 'Tipps & Empfehlungen',
      tips: [
        'Verwenden Sie die Mehrfachauswahl, um mehrere Seiten gleichzeitig zu drehen oder zu löschen.',
        'Die Seitenvorschau behält die ursprüngliche Vektor- und Textqualität ohne Komprimierung bei.',
        'Sie können Änderungen vor dem finalen Export jederzeit anpassen.'
      ]
    }
  },

  // 2. MERGE PDF
  'merge-pdf': {
    en: {
      toolId: 'merge-pdf',
      howToUseTitle: 'How to Use Merge PDF',
      overviewTitle: 'About Merge PDF',
      overviewText: 'Combine multiple PDF files into one clean document directly in your browser. All merging is performed locally using high-speed client-side PDF engines without uploading your files to any remote servers.',
      steps: [
        { stepNumber: 1, title: 'Add Multiple PDF Files', description: 'Select or drag two or more PDF files from your device into the upload area.' },
        { stepNumber: 2, title: 'Reorder the Files', description: 'Drag and drop files or click the move buttons to arrange your PDFs into your exact desired order.' },
        { stepNumber: 3, title: 'Merge Into One PDF', description: 'Click the Merge PDF button to combine all pages into a single document in browser memory.' },
        { stepNumber: 4, title: 'Download Merged PDF', description: 'Save your combined PDF document directly to your device with a single click.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Input', value: 'PDF (.pdf files)' },
        { label: 'Sequence Control', value: 'Drag-and-drop & position arrow controls' },
        { label: 'Output Document', value: 'Single consolidated PDF file' },
        { label: 'Execution Sandbox', value: '100% Client-Side Memory Processing' },
        { label: 'Processing Limit', value: 'Unlimited PDF count (bounded by device RAM)' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Verify the file sequence in the list before clicking merge to ensure a logical document layout.',
        'When combining large PDF files with hundreds of pages, allow a few seconds for in-memory page assembly.',
        'Original text layers, embedded fonts, and page dimensions are preserved 100% without re-compression or quality loss.'
      ]
    },
    ar: {
      toolId: 'merge-pdf',
      howToUseTitle: 'كيفية استخدام أداة دمج ملفات PDF',
      overviewTitle: 'عن أداة دمج ملفات PDF',
      overviewText: 'اجمع ملفات PDF متعددة في مستند واحد منظم مباشرة داخل متصفحك. تتم عملية الدمج بأكملها محلياً دون رفع ملفاتك إلى أي خوادم خارجية.',
      steps: [
        { stepNumber: 1, title: 'إضافة ملفات PDF متعددة', description: 'اختر أو اسحب ملفين أو أكثر من ملفات PDF من جهازك إلى منطقة العمل.' },
        { stepNumber: 2, title: 'إعادة ترتيب الملفات', description: 'اسحب الملفات أو استخدم أزرار التقديم والتأخير لترتيب مستنداتك بالتسلسل المطلوب.' },
        { stepNumber: 3, title: 'دمج الملفات في PDF واحد', description: 'اضغط على زر دمج PDF لتجميع كافة الصفحات في مستند واحد داخل ذاكرة المتصفح.' },
        { stepNumber: 4, title: 'تحميل ملف الـ PDF المدمج', description: 'احفظ مستند الـ PDF المدمج النهائي مباشرة على جهازك بضغطة واحدة.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'الملفات المدعومة', value: 'مستندات PDF (.pdf)' },
        { label: 'التحكم بالترتيب', value: 'السحب والإفلات وأزرار التقديم/التأخير' },
        { label: 'المخرجات', value: 'مستند PDF واحد مدمج' },
        { label: 'بيئة المعالجة', value: 'معالجة محلية 100% في ذاكرة المتصفح' },
        { label: 'سعة المعالجة', value: 'عدد غير محدود من الملفات (حسب ذاكرة الجهاز)' },
      ],
      tipsTitle: 'نصائح وإرشادات لدمج المحتوى',
      tips: [
        'تأكد من ترتيب الملفات في القائمة قبل الضغط على زر الدمج لضمان تسلسل المستند النهائي.',
        'عند دمج ملفات PDF ضخمة تحتوي على مئات الصفحات، انتظر بضع ثوانٍ لإتمام التجميع داخل الذاكرة.',
        'تتم المحافظة على النصوص والخطوط وأبعاد الصفحات الأصلية بنسبة 100% دون أي تقليل للجودة.'
      ]
    },
    fr: {
      toolId: 'merge-pdf',
      howToUseTitle: 'Comment utiliser la Fusion PDF',
      overviewTitle: 'À propos de la Fusion PDF',
      overviewText: 'Assemblez plusieurs fichiers PDF en un seul document structuré directement dans votre navigateur. La fusion est réalisée 100% localement sans téléversement.',
      steps: [
        { stepNumber: 1, title: 'Ajouter plusieurs fichiers PDF', description: 'Sélectionnez ou glissez deux ou plusieurs fichiers PDF dans la zone de dépôt.' },
        { stepNumber: 2, title: 'Réordonner les fichiers', description: 'Faites glisser les fichiers ou utilisez les boutons monter/descendre pour définir l’ordre exact.' },
        { stepNumber: 3, title: 'Fusionner en un seul PDF', description: 'Cliquez sur le bouton Fusionner PDF pour assembler toutes les pages dans un document unique.' },
        { stepNumber: 4, title: 'Télécharger le PDF fusionné', description: 'Enregistrez votre document PDF combiné directement sur votre appareil.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Format d’entrée', value: 'Fichiers PDF (.pdf)' },
        { label: 'Contrôle de l’ordre', value: 'Glisser-déposer & flèches de positionnement' },
        { label: 'Document de sortie', value: 'Fichier PDF unique consolidé' },
        { label: 'Sécurité', value: 'Traitement 100% en mémoire locale dans le navigateur' },
        { label: 'Capacité', value: 'Nombre de PDF illimité (selon la mémoire RAM)' },
      ],
      tipsTitle: 'Conseils pratiques pour la fusion',
      tips: [
        'Vérifiez l’ordre des fichiers dans la liste avant de lancer la fusion pour garantir une séquence logique.',
        'Pour les fichiers PDF volumineux contenant des centaines de pages, patientez quelques secondes pendant l’assemblage.',
        'La couche texte d’origine, les polices intégrées et les dimensions des pages sont préservées à 100% sans perte de qualité.'
      ]
    },
    es: {
      toolId: 'merge-pdf',
      howToUseTitle: 'Cómo usar Unir PDF',
      overviewTitle: 'Sobre Unir PDF',
      overviewText: 'Combina varios archivos PDF en un solo documento organizado directamente en tu navegador. Todo el proceso es 100% local sin subidas a servidores.',
      steps: [
        { stepNumber: 1, title: 'Añadir múltiples archivos PDF', description: 'Selecciona o arrastra dos o más archivos PDF a la zona de carga.' },
        { stepNumber: 2, title: 'Reordenar los archivos', description: 'Arrastra los archivos o usa los botones de posición para ajustarlos al orden deseado.' },
        { stepNumber: 3, title: 'Unir en un solo PDF', description: 'Haz clic en el botón Unir PDF para combinar todas las páginas en un único archivo.' },
        { stepNumber: 4, title: 'Descargar PDF unido', description: 'Guarda tu archivo PDF combinado directamente en tu dispositivo.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Entrada soportada', value: 'Archivos PDF (.pdf)' },
        { label: 'Control de orden', value: 'Arrastrar y soltar & botones de posición' },
        { label: 'Documento resultante', value: 'Archivo PDF consolidado único' },
        { label: 'Entorno de ejecución', value: 'Procesamiento 100% local en memoria' },
        { label: 'Límite de proceso', value: 'Cantidad ilimitada de PDF (según la memoria RAM)' },
      ],
      tipsTitle: 'Consejos y buenas prácticas de unión',
      tips: [
        'Verifica la secuencia de archivos en la lista antes de unir para asegurar una lectura fluida del documento final.',
        'Al combinar archivos PDF grandes con cientos de páginas, espera unos segundos mientras el navegador ensambla el documento.',
        'Se conservan al 100% el texto original, las fuentes incrustadas y las dimensiones de página sin pérdida de calidad.'
      ]
    },
    de: {
      toolId: 'merge-pdf',
      howToUseTitle: 'So nutzen Sie PDF zusammenfügen',
      overviewTitle: 'Über PDF zusammenfügen',
      overviewText: 'Fügen Sie mehrere PDF-Dateien direkt in Ihrem Browser zu einem einzigen Dokument zusammen. Das Zusammenfügen läuft zu 100% lokal ohne Server-Uploads.',
      steps: [
        { stepNumber: 1, title: 'Mehrere PDF-Dateien hinzufügen', description: 'Wählen Sie zwei oder mehr PDF-Dateien aus oder ziehen Sie sie per Drag & Drop hinein.' },
        { stepNumber: 2, title: 'Dateien neu anordnen', description: 'Ordnen Sie die Dateien per Drag & Drop oder mit den Pfeiltasten in der gewünschten Reihenfolge an.' },
        { stepNumber: 3, title: 'Zu einer PDF zusammenfügen', description: 'Klicken Sie auf PDF zusammenfügen, um alle Seiten in einem Dokument zu vereinen.' },
        { stepNumber: 4, title: 'Zusammengefügte PDF herunterladen', description: 'Speichern Sie Ihr zusammengefügtes PDF-Dokument direkt auf Ihrem Gerät.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Eingabe', value: 'PDF-Dateien (.pdf)' },
        { label: 'Reihenfolgesteuerung', value: 'Drag-and-Drop & Positionspfeile' },
        { label: 'Ausgabedokument', value: 'Einzelne konsolidierte PDF-Datei' },
        { label: 'Ausführungsumgebung', value: '100% lokale Speicherverarbeitung' },
        { label: 'Verarbeitungslimit', value: 'Unbegrenzte PDF-Anzahl (beschränkt durch Arbeitsspeicher)' },
      ],
      tipsTitle: 'Tipps & Empfehlungen zum Zusammenfügen',
      tips: [
        'Überprüfen Sie die Dateireihenfolge in der Liste vor dem Zusammenfügen für eine korrekte Dokumentenfolge.',
        'Geben Sie dem Browser bei sehr großen PDF-Dateien mit hunderten Seiten einige Sekunden Zeit für den Zusammenbau.',
        'Ursprüngliche Texte, eingebettete Schriftarten und Seitengrößen bleiben zu 100% ohne Qualitätsverlust erhalten.'
      ]
    }
  },

  // 3. SPLIT PDF
  'split-pdf': {
    en: {
      toolId: 'split-pdf',
      howToUseTitle: 'How to Use Split PDF',
      overviewTitle: 'About Split PDF',
      overviewText: 'Extract individual pages or custom page ranges from any PDF document. Split every single page into separate documents or specify custom page ranges (e.g., 1-3, 5, 8-10) with instant client-side execution.',
      steps: [
        { stepNumber: 1, title: 'Select a PDF File', description: 'Choose or drag a PDF document into the splitting workspace.' },
        { stepNumber: 2, title: 'Choose Extraction Mode', description: 'Enter specific page ranges (e.g., 1-4, 7, 9-12) or select split-every-page mode.' },
        { stepNumber: 3, title: 'Process the PDF', description: 'Click Split PDF to generate your extracted documents in browser memory.' },
        { stepNumber: 4, title: 'Download PDFs or ZIP', description: 'Download extracted PDF files individually or package them all into a single ZIP archive.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Input', value: 'PDF (.pdf documents)' },
        { label: 'Splitting Modes', value: 'Custom page ranges (e.g. 1-3, 5) & split-every-page' },
        { label: 'Output Packaging', value: 'Individual PDF downloads & ZIP archive' },
        { label: 'Execution Sandbox', value: '100% Client-Side Memory Processing' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Use commas to separate single pages and hyphens for page ranges (e.g. 1-3, 5, 8-10).',
        'Downloading the combined ZIP archive saves time when extracting dozens of pages simultaneously.',
        'Original text vector quality and font embeddings are preserved in every extracted file.'
      ]
    },
    ar: {
      toolId: 'split-pdf',
      howToUseTitle: 'كيفية استخدام أداة تقسيم ملفات PDF',
      overviewTitle: 'عن أداة تقسيم ملفات PDF',
      overviewText: 'استخرج صفحات منفصلة أو نطاقات صفحات مخصصة من أي مستند PDF. قم بتقسيم كل صفحة إلى مستند مستقل أو حدد نطاقات صفحات معينة (مثل 1-3، 5، 8-10) بنقرة واحدة داخل متصفحك.',
      steps: [
        { stepNumber: 1, title: 'اختر ملف PDF', description: 'اختر أو اسحب مستند الـ PDF إلى منطقة التقسيم.' },
        { stepNumber: 2, title: 'حدد طريقة الاستخراج', description: 'أدخل نطاقات الصفحات المطلوبة (مثل 1-4، 7، 9-12) أو اختر وضع استخراج كل صفحة بمفردها.' },
        { stepNumber: 3, title: 'بدء تقسيم المستند', description: 'اضغط على زر تقسيم PDF لإنشاء المستندات المستخرجة داخل ذاكرة المتصفح.' },
        { stepNumber: 4, title: 'تحميل الملفات أو أرشيف ZIP', description: 'حمل الملفات المستخرجة بشكل فردي أو اجمعها كاملة في ملف ZIP مضغوط واحد.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'الملفات المدعومة', value: 'مستندات PDF (.pdf)' },
        { label: 'أنماط التقسيم', value: 'نطاقات مخصصة (مثل 1-3، 5) واستخراج جميع الصفحات' },
        { label: 'خيارات التنزيل', value: 'تحميل فردي وأرشيف ZIP مضغوط' },
        { label: 'بيئة المعالجة', value: 'معالجة محلية 100% داخل المتصفح' },
      ],
      tipsTitle: 'نصائح وإرشادات لتقسيم المستندات',
      tips: [
        'استخدم الفواصل بين الصفحات المفردة والشرطة للنطاقات المتصلة (مثل 1-3، 5، 8-10).',
        'يوفر خيار تحميل أرشيف ZIP الوقت عند استخراج عشرات الصفحات في وقت واحد.',
        'تظل جودة النصوص والخطوط الأصلية محفوظة بالكامل في كل ملف مستخرج.'
      ]
    },
    fr: {
      toolId: 'split-pdf',
      howToUseTitle: 'Comment utiliser le Découpage PDF',
      overviewTitle: 'À propos du Découpage PDF',
      overviewText: 'Extrayez des pages individuelles ou des plages de pages personnalisées de n’importe quel fichier PDF. Découpez chaque page en document séparé ou spécifiez des plages exactes.',
      steps: [
        { stepNumber: 1, title: 'Sélectionner un fichier PDF', description: 'Choisissez ou glissez votre document PDF dans l’espace de découpage.' },
        { stepNumber: 2, title: 'Choisir le mode d’extraction', description: 'Saisissez les plages de pages (ex. 1-4, 7, 9-12) ou choisissez le mode une page par fichier.' },
        { stepNumber: 3, title: 'Traiter le PDF', description: 'Cliquez sur Découper le PDF pour générer vos fichiers dans la mémoire du navigateur.' },
        { stepNumber: 4, title: 'Télécharger les PDF ou l’archive ZIP', description: 'Téléchargez les fichiers séparément ou regroupez-les dans une archive ZIP.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Format d’entrée', value: 'Documents PDF (.pdf)' },
        { label: 'Modes de découpage', value: 'Plages personnalisées (ex. 1-3, 5) & page par page' },
        { label: 'Formats de sortie', value: 'Téléchargements individuels & archive ZIP' },
        { label: 'Sécurité', value: 'Traitement 100% local en mémoire' },
      ],
      tipsTitle: 'Conseils pratiques pour le découpage',
      tips: [
        'Utilisez des virgules pour les pages séparées et des tirets pour les plages (ex. 1-3, 5, 8-10).',
        'Le téléchargement de l’archive ZIP permet de gagner du temps lors de l’extraction de nombreuses pages.',
        'La qualité vectorielle du texte et les polices sont conservées dans chaque fichier extrait.'
      ]
    },
    es: {
      toolId: 'split-pdf',
      howToUseTitle: 'Cómo usar Dividir PDF',
      overviewTitle: 'Sobre Dividir PDF',
      overviewText: 'Extrae páginas individuales o rangos de páginas personalizados de cualquier archivo PDF. Divide cada página en documentos separados o especifica rangos exactos.',
      steps: [
        { stepNumber: 1, title: 'Seleccionar un archivo PDF', description: 'Selecciona o arrastra tu documento PDF a la zona de división.' },
        { stepNumber: 2, title: 'Elegir el modo de extracción', description: 'Introduce rangos de páginas (ej. 1-4, 7, 9-12) o elige dividir todas las páginas.' },
        { stepNumber: 3, title: 'Procesar el PDF', description: 'Haz clic en Dividir PDF para generar los documentos extraídos en la memoria del navegador.' },
        { stepNumber: 4, title: 'Descargar los PDF o archivo ZIP', description: 'Descarga los archivos por separado o empaquetados en un archivo ZIP.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Entrada soportada', value: 'Documentos PDF (.pdf)' },
        { label: 'Modos de división', value: 'Rangos personalizados (ej. 1-3, 5) y extracción página a página' },
        { label: 'Opciones de descarga', value: 'Archivos individuales y archivo ZIP' },
        { label: 'Ejecución', value: 'Procesamiento 100% local en memoria' },
      ],
      tipsTitle: 'Consejos y buenas prácticas de división',
      tips: [
        'Usa comas para páginas sueltas y guiones para rangos de páginas (ej. 1-3, 5, 8-10).',
        'Descargar el archivo ZIP ahorra tiempo cuando extraes decenas de páginas a la vez.',
        'La calidad de texto vectorizado y las fuentes integradas se mantienen al 100% en cada archivo.'
      ]
    },
    de: {
      toolId: 'split-pdf',
      howToUseTitle: 'So nutzen Sie PDF teilen',
      overviewTitle: 'Über PDF teilen',
      overviewText: 'Extrahieren Sie einzelne Seiten oder benutzerdefinierte Seitenbereiche aus jedem PDF-Dokument. Teilen Sie jede Seite in ein separates Dokument auf oder definieren Sie exakte Bereiche.',
      steps: [
        { stepNumber: 1, title: 'PDF-Datei auswählen', description: 'Wählen Sie ein PDF-Dokument aus oder ziehen Sie es per Drag & Drop hinein.' },
        { stepNumber: 2, title: 'Extraktionsmodus wählen', description: 'Geben Sie Seitenbereiche ein (z. B. 1-4, 7, 9-12) oder wählen Sie Einzelseiten-Aufteilung.' },
        { stepNumber: 3, title: 'PDF verarbeiten', description: 'Klicken Sie auf PDF teilen, um die extrahierten Dokumente im Arbeitsspeicher zu erzeugen.' },
        { stepNumber: 4, title: 'PDFs oder ZIP herunterladen', description: 'Laden Sie die Dateien einzeln herunter oder fasen Sie alle in einem ZIP-Archiv zusammen.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Eingabe', value: 'PDF-Dokumente (.pdf)' },
        { label: 'Teilungsmodi', value: 'Benutzerdefinierte Bereiche (z. B. 1-3, 5) & Einzelseiten-Export' },
        { label: 'Ausgabeoptionen', value: 'Einzeldownloads & ZIP-Archiv' },
        { label: 'Datenschutz', value: '100% lokale Speicherverarbeitung' },
      ],
      tipsTitle: 'Tipps & Empfehlungen zum Teilen',
      tips: [
        'Nutzen Sie Kommas für einzelne Seiten und Bindestriche für Bereiche (z. B. 1-3, 5, 8-10).',
        'Der ZIP-Download spart Zeit, wenn Sie Dutzende von Seiten gleichzeitig extrahieren.',
        'Die Vektor-Textqualität und eingebettete Schriftarten bleiben in allen Teildateien erhalten.'
      ]
    }
  },

  // 4. COMPRESS PDF
  'compress-pdf': {
    en: {
      toolId: 'compress-pdf',
      howToUseTitle: 'How to Use Compress PDF',
      overviewTitle: 'About Compress PDF',
      overviewText: 'Reduce PDF file size significantly while retaining document readability and clear layout. Choose preset compression levels (Extreme, Recommended, Less Compression) to optimize your PDF for email attachments and web publishing.',
      steps: [
        { stepNumber: 1, title: 'Select a PDF Document', description: 'Choose or drag a PDF file that needs size reduction into the compressor.' },
        { stepNumber: 2, title: 'Select Compression Level', description: 'Choose between Recommended (balanced quality/size), Less Compression, or Extreme compression.' },
        { stepNumber: 3, title: 'Compress PDF', description: 'Click Compress PDF to perform local client-side stream optimization.' },
        { stepNumber: 4, title: 'Download Compressed PDF', description: 'View saved file percentage savings and download your optimized PDF file.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Input', value: 'PDF (.pdf documents)' },
        { label: 'Compression Presets', value: 'Recommended (Balanced), Extreme, Less Compression' },
        { label: 'Savings Metrics', value: 'Real-time original vs. compressed byte reduction display' },
        { label: 'Processing Model', value: '100% Client-Side In-Memory Stream Optimization' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Use Recommended Compression for the ideal balance between crisp typography and compact file size.',
        'PDFs containing scanned images benefit most from compression size savings.',
        'Original text structure and vector annotations remain searchable and readable after compression.'
      ]
    },
    ar: {
      toolId: 'compress-pdf',
      howToUseTitle: 'كيفية استخدام أداة ضغط ملفات PDF',
      overviewTitle: 'عن أداة ضغط ملفات PDF',
      overviewText: 'قم بتقليل حجم ملف PDF بشكل كبير مع الحفاظ على وضوح المستند وتنسيقه. اختر من بين مستويات الضغط المجهزة (الموصى به، ضغط عالي، أو ضغط خفيف) لتجهيز الملف للمرفقات والمشاركة.',
      steps: [
        { stepNumber: 1, title: 'اختر مستند PDF', description: 'حدد أو اسحب ملف الـ PDF المراد ضغطه إلى منطقة المعالجة.' },
        { stepNumber: 2, title: 'اختر مستوى الضغط', description: 'حدد الخيار الموصى به (توازن ممتاز بين الجودة والحجم) أو الضغط الشديد.' },
        { stepNumber: 3, title: 'ضغط مستند PDF', description: 'اضغط على زر ضغط PDF لبدء معالجة وتقليل حجم الملف داخل المتصفح.' },
        { stepNumber: 4, title: 'تحميل الملف المضغوط', description: 'استعرض نسبة توفير الحجم وحمّل ملف الـ PDF المحسّن فوراً.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'الملفات المدعومة', value: 'مستندات PDF (.pdf)' },
        { label: 'مستويات الضغط', value: 'الموصى به (متوازن)، ضغط شديد، ضغط خفيف' },
        { label: 'مؤشر التوفير', value: 'عرض فوري لنسبة تقليل الحجم بالبايت' },
        { label: 'بيئة المعالجة', value: 'تحسين ومعالجة محلية 100% داخل المتصفح' },
      ],
      tipsTitle: 'نصائح وإرشادات لضغط الملفات',
      tips: [
        'يعطي خيار "الموصى به" أفضل توازن بين وضوح النصوص وصغر حجم المستند.',
        'تستفيد المستندات التي تحتوي على صور ممسوحة ضوئياً بشكل أكبر من خفض الحجم.',
        'تظل النصوص والطبقات الشعاعية قابلة للبحث والقراءة بعد عملية الضغط.'
      ]
    },
    fr: {
      toolId: 'compress-pdf',
      howToUseTitle: 'Comment utiliser la Compression PDF',
      overviewTitle: 'À propos de la Compression PDF',
      overviewText: 'Réduisez la taille de vos fichiers PDF tout en conservant une excellente lisibilité. Choisissez parmi nos niveaux de compression prédéfinis pour optimiser vos envois par e-mail.',
      steps: [
        { stepNumber: 1, title: 'Sélectionner un document PDF', description: 'Choisissez ou glissez le fichier PDF à compresser dans l’espace de travail.' },
        { stepNumber: 2, title: 'Choisir le niveau de compression', description: 'Sélectionnez Recommandé (équilibre qualité/taille), Compression forte ou Compression légère.' },
        { stepNumber: 3, title: 'Compresser le PDF', description: 'Cliquez sur Compresser le PDF pour exécuter l’optimisation locale.' },
        { stepNumber: 4, title: 'Télécharger le PDF compressé', description: 'Consultez le pourcentage d’espace économisé et téléchargez votre fichier optimisé.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Format d’entrée', value: 'Documents PDF (.pdf)' },
        { label: 'Niveaux de compression', value: 'Recommandé (Équilibré), Extrême, Légère' },
        { label: 'Calcul des gains', value: 'Affichage en temps réel de la réduction en octets' },
        { label: 'Sécurité', value: 'Optimisation 100% locale en mémoire' },
      ],
      tipsTitle: 'Conseils pratiques pour la compression',
      tips: [
        'Le mode Recommandé offre le meilleur compromis entre netteté du texte et taille réduite.',
        'Les PDF contenant des images numérisées bénéficient des réductions de taille les plus importantes.',
        'Les textes vectoriels restent parfaitement lisibles et sélectionnables après compression.'
      ]
    },
    es: {
      toolId: 'compress-pdf',
      howToUseTitle: 'Cómo usar Comprimir PDF',
      overviewTitle: 'Sobre Comprimir PDF',
      overviewText: 'Reduce el tamaño de tus archivos PDF de forma considerable manteniendo la claridad del documento. Elige niveles de compresión predefinidos para optimizar tus archivos.',
      steps: [
        { stepNumber: 1, title: 'Seleccionar un documento PDF', description: 'Elige o arrastra el archivo PDF que deseas comprimir.' },
        { stepNumber: 2, title: 'Seleccionar nivel de compresión', description: 'Elige entre Recomendado (equilibrio calidad/tamaño), Compresión extrema o Compresión baja.' },
        { stepNumber: 3, title: 'Comprimir PDF', description: 'Haz clic en Comprimir PDF para procesar la optimización en tu navegador.' },
        { stepNumber: 4, title: 'Descargar PDF comprimido', description: 'Revisa el porcentaje de ahorro de espacio y descarga el archivo optimizado.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Entrada soportada', value: 'Documentos PDF (.pdf)' },
        { label: 'Ajustes de compresión', value: 'Recomendada (Equilibrada), Extrema, Baja' },
        { label: 'Métrica de ahorro', value: 'Visualización en tiempo real de la reducción de bytes' },
        { label: 'Procesamiento', value: 'Optimización 100% local en memoria' },
      ],
      tipsTitle: 'Consejos y buenas prácticas de compresión',
      tips: [
        'Usa la Compresión Recomendada para mantener la nitidez del texto con un tamaño ligero.',
        'Los PDF con imágenes escaneadas obtienen los mayores porcentajes de reducción.',
        'La estructura de texto y vectores sigue siendo seleccionable tras la compresión.'
      ]
    },
    de: {
      toolId: 'compress-pdf',
      howToUseTitle: 'So nutzen Sie PDF komprimieren',
      overviewTitle: 'Über PDF komprimieren',
      overviewText: 'Verringern Sie die PDF-Dateigröße erheblich bei hervorragender Lesbarkeit. Wählen Sie vordefinierte Komprimierungsstufen für den optimalen E-Mail-Versand.',
      steps: [
        { stepNumber: 1, title: 'PDF-Dokument auswählen', description: 'Wählen Sie die zu komprimierende PDF-Datei aus oder ziehen Sie sie hinein.' },
        { stepNumber: 2, title: 'Komprimierungsstufe wählen', description: 'Wählen Sie Empfohlen (Ausgewogen), Starke Komprimierung oder Leichte Komprimierung.' },
        { stepNumber: 3, title: 'PDF komprimieren', description: 'Klicken Sie auf PDF komprimieren für die lokale Optimierung im Browser.' },
        { stepNumber: 4, title: 'Komprimierte PDF herunterladen', description: 'Sehen Sie die prozentuale Ersparnis und laden Sie die optimierte Datei herunter.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Eingabe', value: 'PDF-Dokumente (.pdf)' },
        { label: 'Komprimierungsstufen', value: 'Empfohlen (Ausgewogen), Extrem, Leicht' },
        { label: 'Ersparnisanzeige', value: 'Echtzeitanzeige der reduzierten Dateigröße in Bytes' },
        { label: 'Datenschutz', value: '100% lokale Optimierung im Arbeitsspeicher' },
      ],
      tipsTitle: 'Tipps & Empfehlungen zur Komprimierung',
      tips: [
        'Empfohlen bietet die ideale Balance zwischen scharfer Typografie und kleiner Dateigröße.',
        'PDFs mit gescannten Bildern erreichen die höchsten Einsparungsraten.',
        'Textstrukturen und Vektoren bleiben nach der Komprimierung durchsuchbar.'
      ]
    }
  },

  // 5. IMAGES TO PDF
  'images-to-pdf': {
    en: {
      toolId: 'images-to-pdf',
      howToUseTitle: 'How to Use Images to PDF',
      overviewTitle: 'About Images to PDF Converter',
      overviewText: 'Convert multiple photo formats (JPG, PNG, WebP, GIF, BMP) into a clean, unified PDF document. Customize page orientation, paper sizes (A4, Letter, Auto), and page margin spacing before compiling.',
      steps: [
        { stepNumber: 1, title: 'Add Image Files', description: 'Select or drag multiple image files (JPG, PNG, WebP, BMP) into the converter.' },
        { stepNumber: 2, title: 'Arrange Image Sequence', description: 'Drag image thumbnails to reorder pages into your desired final document order.' },
        { stepNumber: 3, title: 'Configure PDF Page Options', description: 'Choose paper size (A4, Letter, Auto), orientation (Portrait/Landscape), and page margin.' },
        { stepNumber: 4, title: 'Create & Download PDF', description: 'Click Convert to PDF to generate your compiled document and save it to your device.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Image Inputs', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'Page Layout Customization', value: 'A4, Letter, Fit to Image (Auto), Portrait/Landscape' },
        { label: 'Margin Options', value: 'No Margin, Small Margin, Big Margin' },
        { label: 'Execution Sandbox', value: '100% Client-Side Canvas Assembly' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Use "Fit to Image (Auto)" paper size to match each page size exactly to its source image dimensions.',
        'High-resolution source photos result in crisp printable PDF documents.',
        'Drag images to adjust sequence before generating the PDF file.'
      ]
    },
    ar: {
      toolId: 'images-to-pdf',
      howToUseTitle: 'كيفية تحويل الصور إلى ملف PDF',
      overviewTitle: 'عن أداة تحويل الصور إلى PDF',
      overviewText: 'قم بتحويل صيغ الصور المختلفة (JPG, PNG, WebP, GIF, BMP) إلى مستند PDF واحد أنيق. خصص اتجاه الصفحات، أحجام الورق (A4, Letter, أوتوماتيكي)، والهوامش قبل الإنشاء.',
      steps: [
        { stepNumber: 1, title: 'إضافة ملفات الصور', description: 'حدد أو اسحب صورك (JPG, PNG, WebP, BMP) إلى منطقة التحويل.' },
        { stepNumber: 2, title: 'ترتيب تسلسل الصور', description: 'اسحب مصغرات الصور لإعادة ترتيب الصفحات حسب التسلسل المطلوب.' },
        { stepNumber: 3, title: 'ضبط خيارات صفحات الـ PDF', description: 'حدد حجم الورق (A4، Letter، أو أوتوماتيكي) واتجاه الصفحة والهوامش.' },
        { stepNumber: 4, title: 'إنشاء وتحميل ملف PDF', description: 'اضغط على تحويل إلى PDF لتجميع الصور وتحميل المستند النهائي على جهازك.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'صيغ الصور المدعومة', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'تخصيص تخطيط الصفحات', value: 'A4, Letter, ملاءمة حجم الصورة (أوتوماتيكي)، أفقياً/عمودياً' },
        { label: 'إعدادات الهوامش', value: 'بدون هامش، هامش صغير، هامش كبير' },
        { label: 'بيئة المعالجة', value: 'تجميع ومعالجة محلية 100% داخل المتصفح' },
      ],
      tipsTitle: 'نصائح وإرشادات لتحويل الصور',
      tips: [
        'اختر "ملاءمة حجم الصورة (أوتوماتيكي)" لجعل أبعاد كل صفحة تطابق أبعاد الصورة تماماً.',
        'تنتج الصور عالية الدقة مستندات PDF فائقة الجودة وقابلة للطباعة.',
        'يمكنك سحب وإعادة ترتيب الصور بحرية قبل الضغط على زر الإنشاء النهائي.'
      ]
    },
    fr: {
      toolId: 'images-to-pdf',
      howToUseTitle: 'Comment convertir des Images en PDF',
      overviewTitle: 'À propos du Convertisseur Images en PDF',
      overviewText: 'Convertissez plusieurs formats d’images (JPG, PNG, WebP, GIF, BMP) en un document PDF unique. Personnalisez l’orientation, le format de papier (A4, Letter, Auto) et les marges.',
      steps: [
        { stepNumber: 1, title: 'Ajouter des fichiers images', description: 'Sélectionnez ou glissez vos images (JPG, PNG, WebP, BMP) dans le convertisseur.' },
        { stepNumber: 2, title: 'Organiser l’ordre des images', description: 'Faites glisser les miniatures pour réordonner les pages selon vos besoins.' },
        { stepNumber: 3, title: 'Configurer les options PDF', description: 'Choisissez le format de papier (A4, Letter, Auto), l’orientation et les marges.' },
        { stepNumber: 4, title: 'Créer et télécharger le PDF', description: 'Cliquez sur Convertir en PDF pour générer votre document et l’enregistrer.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Formats d’images pris en charge', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'Personnalisation de page', value: 'A4, Letter, Adapter à l’image (Auto), Portrait/Paysage' },
        { label: 'Gestion des marges', value: 'Sans marge, Petite marge, Grande marge' },
        { label: 'Sécurité', value: 'Assemblage 100% local dans le navigateur' },
      ],
      tipsTitle: 'Conseils pratiques pour la conversion',
      tips: [
        'Utilisez le format "Adapter à l’image (Auto)" pour ajuster la taille de chaque page à l’image source.',
        'Les photos haute résolution produisent des PDF d’une qualité d’impression optimale.',
        'Réordonnez facilement vos images par glisser-déposer avant la génération du PDF.'
      ]
    },
    es: {
      toolId: 'images-to-pdf',
      howToUseTitle: 'Cómo convertir Imágenes a PDF',
      overviewTitle: 'Sobre el Convertidor de Imágenes a PDF',
      overviewText: 'Convierte múltiples formatos de imagen (JPG, PNG, WebP, GIF, BMP) en un único documento PDF. Personaliza orientación de página, tamaño de papel (A4, Carta, Auto) y márgenes.',
      steps: [
        { stepNumber: 1, title: 'Añadir archivos de imagen', description: 'Selecciona o arrastra tus imágenes (JPG, PNG, WebP, BMP) al convertidor.' },
        { stepNumber: 2, title: 'Organizar la secuencia', description: 'Arrastra las miniaturas de imagen para ordenar las páginas antes de compilar.' },
        { stepNumber: 3, title: 'Configurar opciones de PDF', description: 'Elige tamaño de papel (A4, Carta, Auto), orientación y márgenes de página.' },
        { stepNumber: 4, title: 'Crear y descargar PDF', description: 'Haz clic en Convertir a PDF para compilar tu documento y guardarlo.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Formatos de imagen soportados', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'Diseño de página', value: 'A4, Carta, Ajustar a imagen (Auto), Vertical/Horizontal' },
        { label: 'Opciones de margen', value: 'Sin margen, Margen pequeño, Margen grande' },
        { label: 'Ejecución', value: 'Procesamiento 100% local en navegador' },
      ],
      tipsTitle: 'Consejos y buenas prácticas',
      tips: [
        'Usa "Ajustar a imagen (Auto)" para mantener las proporciones exactas de cada foto.',
        'Las imágenes de alta resolución garantizan documentos PDF listos para impresión profesional.',
        'Reordena tus fotos arrastrándolas antes de pulsar el botón de conversión.'
      ]
    },
    de: {
      toolId: 'images-to-pdf',
      howToUseTitle: 'So konvertieren Sie Bilder in PDF',
      overviewTitle: 'Über den Bilder-in-PDF-Konverter',
      overviewText: 'Wandeln Sie mehrere Bildformate (JPG, PNG, WebP, GIF, BMP) in ein sauberes PDF-Dokument um. Passen Sie Ausrichtung, Papierformate (A4, Letter, Auto) und Ränder an.',
      steps: [
        { stepNumber: 1, title: 'Bilddateien hinzufügen', description: 'Wählen Sie Ihre Bilder (JPG, PNG, WebP, BMP) aus oder ziehen Sie sie hinein.' },
        { stepNumber: 2, title: 'Reihenfolge festlegen', description: 'Ordnen Sie die Bild-Vorschaubilder per Drag & Drop in der gewünschten Folge.' },
        { stepNumber: 3, title: 'PDF-Optionen konfigurieren', description: 'Wählen Sie Papierformat (A4, Letter, Auto), Ausrichtung und Seitenränder.' },
        { stepNumber: 4, title: 'PDF erstellen & herunterladen', description: 'Klicken Sie auf In PDF umwandeln, um Ihr Dokument herunterzuladen.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Bildformate', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'Seiten-Layout', value: 'A4, Letter, An Bild anpassen (Auto), Hoch-/Querformat' },
        { label: 'Randeinstellungen', value: 'Kein Rand, Kleiner Rand, Großer Rand' },
        { label: 'Datenschutz', value: '100% lokale Umwandlung im Browser' },
      ],
      tipsTitle: 'Tipps & Empfehlungen',
      tips: [
        'Verwenden Sie "An Bild anpassen (Auto)", um jede Seite exakt auf die Bildmaße abzustimmen.',
        'Hochauflösende Fotos sorgen für gestochen scharfe Druckergebnisse im PDF.',
        'Sortieren Sie Ihre Bilder einfach per Drag & Drop vor dem Erstellen der PDF-Datei.'
      ]
    }
  },

  // 6. PDF TO IMAGES
  'pdf-to-images': {
    en: {
      toolId: 'pdf-to-images',
      howToUseTitle: 'How to Use PDF to Images',
      overviewTitle: 'About PDF to Images Converter',
      overviewText: 'Extract every PDF page into sharp JPG or PNG images. Adjust rendering DPI resolution (1.5x, 2x, 3x) for high-definition image exports with optional ZIP packaging.',
      steps: [
        { stepNumber: 1, title: 'Select a PDF File', description: 'Choose or drag a PDF document into the extraction workspace.' },
        { stepNumber: 2, title: 'Choose Output Format & DPI', description: 'Select JPG or PNG format and choose rendering resolution scale (1.5x, 2x Retina, 3x High-DPI).' },
        { stepNumber: 3, title: 'Render PDF Pages', description: 'Click Convert PDF to Images to render pages directly on browser HTML5 Canvas.' },
        { stepNumber: 4, title: 'Download Images or ZIP', description: 'Save extracted page images individually or download all pages in a single ZIP file.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Input', value: 'PDF (.pdf documents)' },
        { label: 'Output Image Formats', value: 'JPG (Compressed) & PNG (Lossless Alpha)' },
        { label: 'Rendering DPI Options', value: '1.5x (108dpi), 2.0x (144dpi), 3.0x (216dpi HD)' },
        { label: 'Packaging', value: 'Individual page downloads & single ZIP archive' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Select PNG for crisp text rendering and transparent graphics; choose JPG for smaller image file sizes.',
        'Use 2x or 3x DPI scale when converting PDFs intended for high-resolution displays or print.',
        'Downloading the ZIP file extracts all document pages cleanly in one operation.'
      ]
    },
    ar: {
      toolId: 'pdf-to-images',
      howToUseTitle: 'كيفية استخدام أداة تحويل PDF إلى صور',
      overviewTitle: 'عن أداة تحويل الـ PDF إلى صور',
      overviewText: 'استخرج كل صفحة من صفحات الـ PDF إلى صور عالية الدقة بصيغة JPG أو PNG. اضبط بدقة مقياس العرض (1.5x, 2x, 3x) مع إمكانية التجميع في ملف ZIP.',
      steps: [
        { stepNumber: 1, title: 'اختر ملف PDF', description: 'حدد أو اسحب مستند الـ PDF إلى بيئة العمل.' },
        { stepNumber: 2, title: 'حدد صيغة الصور ودقة الـ DPI', description: 'اختر بين صيغة JPG أو PNG وحدد مقياس الدقة (1.5x أو 2x لشاشات ريتنا أو 3x عالية الدقة).' },
        { stepNumber: 3, title: 'معالجة وعرض الصفحات', description: 'اضغط على تحويل PDF إلى صور لرسم الصفحات على لوحة Canvas داخل المتصفح.' },
        { stepNumber: 4, title: 'تحميل الصور أو ملف ZIP', description: 'احفظ صور الصفحات بشكل فردي أو قم بتنزيل جميع الصفحات في ملف ZIP مضغوط واحد.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'الملفات المدعومة', value: 'مستندات PDF (.pdf)' },
        { label: 'صيغ الصور المخرجة', value: 'JPG (مضغوطة) و PNG (بدون إطار شفاف)' },
        { label: 'دقة العرض (DPI)', value: '1.5x (108dpi), 2.0x (144dpi), 3.0x (216dpi HD)' },
        { label: 'خيارات التحميل', value: 'تحميل فردي للصفحات وأرشيف ZIP شامل' },
      ],
      tipsTitle: 'نصائح وإرشادات لاستخراج الصور',
      tips: [
        'اختر صيغة PNG للحصول على أقصى وضوح للنصوص، واختر JPG للحصول على أحجام صور أصغر.',
        'استخدم مقياس 2x أو 3x عند تحويل مستندات مخصصة للشاشات عالية الدقة أو الطباعة.',
        'يتيح تحميل ملف الـ ZIP تنزيل كافة صفحات المستند دفعة واحدة وبسرعة فائقة.'
      ]
    },
    fr: {
      toolId: 'pdf-to-images',
      howToUseTitle: 'Comment convertir un PDF en Images',
      overviewTitle: 'À propos du Convertisseur PDF en Images',
      overviewText: 'Extrayez chaque page PDF sous forme d’images JPG ou PNG nettes. Ajustez la résolution de rendu DPI (1.5x, 2x, 3x) avec option de téléchargement ZIP.',
      steps: [
        { stepNumber: 1, title: 'Sélectionner un fichier PDF', description: 'Choisissez ou glissez votre document PDF dans l’espace de conversion.' },
        { stepNumber: 2, title: 'Choisir le format et le DPI', description: 'Sélectionnez le format JPG ou PNG et l’échelle de résolution (1.5x, 2x Retina, 3x HD).' },
        { stepNumber: 3, title: 'Rendre les pages PDF', description: 'Cliquez sur Convertir PDF en Images pour afficher les pages sur Canvas HTML5.' },
        { stepNumber: 4, title: 'Télécharger les images ou le ZIP', description: 'Enregistrez les images individuellement ou téléchargez l’ensemble dans une archive ZIP.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Format d’entrée', value: 'Documents PDF (.pdf)' },
        { label: 'Formats d’images de sortie', value: 'JPG (Compressé) & PNG (Haute fidélité)' },
        { label: 'Échelles de rendu DPI', value: '1.5x (108dpi), 2.0x (144dpi), 3.0x (216dpi HD)' },
        { label: 'Conditionnement', value: 'Téléchargements individuels & archive ZIP' },
      ],
      tipsTitle: 'Conseils pratiques pour la conversion',
      tips: [
        'Choisissez le format PNG pour une netteté maximale des textes et le format JPG pour des fichiers plus légers.',
        'Utilisez l’échelle 2x ou 3x pour les présentations ou l’impression haute définition.',
        'Le téléchargement ZIP regroupe toutes les pages du document en une seule opération.'
      ]
    },
    es: {
      toolId: 'pdf-to-images',
      howToUseTitle: 'Cómo convertir PDF a Imágenes',
      overviewTitle: 'Sobre el Convertidor de PDF a Imágenes',
      overviewText: 'Extrae cada página de un PDF como imagen JPG o PNG de alta resolución. Ajusta la escala DPI (1.5x, 2x, 3x) y descarga imágenes sueltas o en archivo ZIP.',
      steps: [
        { stepNumber: 1, title: 'Seleccionar un archivo PDF', description: 'Elige o arrastra tu documento PDF a la zona de extracción.' },
        { stepNumber: 2, title: 'Elegir formato y DPI', description: 'Selecciona formato JPG o PNG y ajusta la escala de resolución (1.5x, 2x Retina, 3x HD).' },
        { stepNumber: 3, title: 'Renderizar páginas del PDF', description: 'Haz clic en Convertir PDF a Imágenes para procesar las páginas en Canvas HTML5.' },
        { stepNumber: 4, title: 'Descargar imágenes o ZIP', description: 'Guarda las imágenes individualmente o descarga todas en un archivo ZIP.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Entrada soportada', value: 'Documentos PDF (.pdf)' },
        { label: 'Formatos de salida', value: 'JPG (Comprimido) y PNG (Sin pérdida de calidad)' },
        { label: 'Resolución DPI', value: '1.5x (108dpi), 2.0x (144dpi), 3.0x (216dpi HD)' },
        { label: 'Descargas', value: 'Imágenes sueltas y archivo ZIP comprimido' },
      ],
      tipsTitle: 'Consejos y buenas prácticas',
      tips: [
        'Elige PNG para obtener máxima nitidez en textos e ilustraciones; usa JPG para reducir el tamaño.',
        'Utiliza las escalas 2x o 3x cuando necesites imprimir o mostrar en pantallas Retina.',
        'El archivo ZIP empaqueta automáticamente todas las páginas del PDF convertido.'
      ]
    },
    de: {
      toolId: 'pdf-to-images',
      howToUseTitle: 'So konvertieren Sie PDF in Bilder',
      overviewTitle: 'Über den PDF-in-Bilder-Konverter',
      overviewText: 'Extrahieren Sie jede PDF-Seite als scharfes JPG- oder PNG-Bild. Passen Sie die DPI-Auflösung (1.5x, 2x, 3x) an und laden Sie Bilder einzeln oder als ZIP herunter.',
      steps: [
        { stepNumber: 1, title: 'PDF-Datei auswählen', description: 'Wählen Sie ein PDF-Dokument aus oder ziehen Sie es per Drag & Drop hinein.' },
        { stepNumber: 2, title: 'Ausgabeformat & DPI wählen', description: 'Wählen Sie JPG oder PNG und die Skalierung (1.5x, 2x Retina, 3x HD).' },
        { stepNumber: 3, title: 'PDF-Seiten rendern', description: 'Klicken Sie auf PDF in Bilder umwandeln für das Rendern auf HTML5-Canvas.' },
        { stepNumber: 4, title: 'Bilder oder ZIP herunterladen', description: 'Speichern Sie Bilder einzeln oder laden Sie alle Seiten im ZIP-Archiv herunter.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Eingabe', value: 'PDF-Dokumente (.pdf)' },
        { label: 'Ausgabe-Bildformate', value: 'JPG (Komprimiert) & PNG (Verlustfrei)' },
        { label: 'DPI-Auflösungen', value: '1.5x (108dpi), 2.0x (144dpi), 3.0x (216dpi HD)' },
        { label: 'Download-Verpackung', value: 'Einzelseiten-Downloads & komplettes ZIP-Archiv' },
      ],
      tipsTitle: 'Tipps & Empfehlungen',
      tips: [
        'Wählen Sie PNG für höchste Textschärfe und JPG für kleinere Dateigrößen.',
        'Verwenden Sie 2x oder 3x DPI für hochauflösende Displays oder Druckausgaben.',
        'Der ZIP-Download lädt alle konvertierten Dokumentenseiten auf einmal herunter.'
      ]
    }
  },

  // 7. IMAGE COMPRESSOR
  'image-compressor': {
    en: {
      toolId: 'image-compressor',
      howToUseTitle: 'How to Use Image Compressor',
      overviewTitle: 'About Image Compressor',
      overviewText: 'Reduce image file size (JPG, PNG, WebP, GIF) with custom quality control sliders. Compress single images or batch process multiple photos in browser memory with ZIP packaging.',
      steps: [
        { stepNumber: 1, title: 'Add Image Files', description: 'Select or drag one or multiple image files (JPG, PNG, WebP) into the compressor.' },
        { stepNumber: 2, title: 'Adjust Quality Slider', description: 'Use the quality percentage slider or choose target compression settings.' },
        { stepNumber: 3, title: 'Compress Images', description: 'Click Compress Images to re-encode canvas image streams in browser memory.' },
        { stepNumber: 4, title: 'Download Images or ZIP', description: 'Check byte savings calculation and save optimized images individually or in a ZIP archive.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Formats', value: 'JPG, JPEG, PNG, WebP, GIF' },
        { label: 'Quality Controls', value: '0% - 100% Granular compression quality slider' },
        { label: 'Output Format Option', value: 'Keep original format or convert to WebP/JPG' },
        { label: 'Batch & Packaging', value: 'Multi-image processing & ZIP archive packaging' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Setting quality between 75% and 85% delivers major file size reduction with zero visible visual loss.',
        'Converting PNG photos to WebP format yields maximum compression efficiency for web use.',
        'Original image pixel dimensions are preserved unless custom resizing is applied.'
      ]
    },
    ar: {
      toolId: 'image-compressor',
      howToUseTitle: 'كيفية استخدام أداة ضغط الصور',
      overviewTitle: 'عن أداة ضغط الصور',
      overviewText: 'قم بتقليل حجم ملفات الصور (JPG, PNG, WebP, GIF) باستخدام شريط التحكم بدقة الجودة. اضغط صورة واحدة أو دفعة صور كاملة محلياً مع خيار التنزيل في ملف ZIP.',
      steps: [
        { stepNumber: 1, title: 'إضافة ملفات الصور', description: 'حدد أو اسحب صورة واحدة أو صوراً متعددة (JPG, PNG, WebP) إلى منطقة الضغط.' },
        { stepNumber: 2, title: 'ضبط شريط الجودة', description: 'تحكم في نسبة الجودة من 0% إلى 100% للوصول إلى الحجم المطلوب.' },
        { stepNumber: 3, title: 'بدء ضغط الصور', description: 'اضغط على زر ضغط الصور لإعادة تشفير الصور داخل ذاكرة المتصفح.' },
        { stepNumber: 4, title: 'تحميل الصور أو أرشيف ZIP', description: 'استعرض نسبة التوفير بالبايت واحفظ الصور بشكل فردي أو في ملف ZIP مضغوط.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'الصيغ المدعومة', value: 'JPG, JPEG, PNG, WebP, GIF' },
        { label: 'التحكم بالجودة', value: 'شريط تحكم دقيق من 0% إلى 100%' },
        { label: 'خيارات التنسيق', value: 'الاحتفاظ بالصيغة الأصلية أو التحويل إلى WebP/JPG' },
        { label: 'المعالجة الجماعية', value: 'معالجة صور متعددة وتجميعها في ملف ZIP' },
      ],
      tipsTitle: 'نصائح وإرشادات لضغط الصور',
      tips: [
        'يعطي اختيار الجودة بين 75% و 85% أقصى توفير في الحجم بدون أي فرق ملحوظ للعين.',
        'يوفر تحويل صور PNG الثقيلة إلى صيغة WebP أعلى كفاءة ضغط لمواقع الويب.',
        'يتم الاحتفاظ بأبعاد الصور الأصلية بالبكسل كما هي دون تغيير.'
      ]
    },
    fr: {
      toolId: 'image-compressor',
      howToUseTitle: 'Comment utiliser le Compresseur d’Images',
      overviewTitle: 'À propos du Compresseur d’Images',
      overviewText: 'Réduisez le poids de vos images (JPG, PNG, WebP, GIF) avec un curseur de qualité sur mesure. Compressez des photos uniques ou des lots avec option d’archive ZIP.',
      steps: [
        { stepNumber: 1, title: 'Ajouter des fichiers images', description: 'Sélectionnez ou glissez une ou plusieurs images (JPG, PNG, WebP) dans le compresseur.' },
        { stepNumber: 2, title: 'Régler le curseur de qualité', description: 'Ajustez le pourcentage de qualité selon vos besoins d’optimisation.' },
        { stepNumber: 3, title: 'Compresser les images', description: 'Cliquez sur Compresser les Images pour ré-encoder les flux dans le navigateur.' },
        { stepNumber: 4, title: 'Télécharger les images ou le ZIP', description: 'Consultez les gains de poids et téléchargez les images séparément ou en archive ZIP.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Formats pris en charge', value: 'JPG, JPEG, PNG, WebP, GIF' },
        { label: 'Contrôle de qualité', value: 'Curseur granulaire de 0% à 100%' },
        { label: 'Conversion de format', value: 'Conserver le format d’origine ou convertir en WebP/JPG' },
        { label: 'Traitement par lot', value: 'Optimisation multiple & conditionnement en archive ZIP' },
      ],
      tipsTitle: 'Conseils pratiques pour la compression',
      tips: [
        'Un niveau de qualité situé entre 75% et 85% offre le meilleur compromis poids/visuel.',
        'La conversion des images PNG en WebP permet un gain de poids considérable.',
        'Les dimensions en pixels sont conservées à l’identique sauf redimensionnement explicite.'
      ]
    },
    es: {
      toolId: 'image-compressor',
      howToUseTitle: 'Cómo usar Comprimir Imagen',
      overviewTitle: 'Sobre Comprimir Imagen',
      overviewText: 'Reduce el peso de tus imágenes (JPG, PNG, WebP, GIF) con un deslizador de calidad personalizado. Comprime imágenes individuales o lotes enteros con descarga ZIP.',
      steps: [
        { stepNumber: 1, title: 'Añadir archivos de imagen', description: 'Selecciona o arrastra una o varias imágenes (JPG, PNG, WebP) al compresor.' },
        { stepNumber: 2, title: 'Ajustar el deslizador de calidad', description: 'Ajusta el porcentaje de calidad para calibrar el tamaño final del archivo.' },
        { stepNumber: 3, title: 'Comprimir imágenes', description: 'Haz clic en Comprimir Imágenes para procesar la codificación en la memoria del navegador.' },
        { stepNumber: 4, title: 'Descargar imágenes o ZIP', description: 'Comprueba el porcentaje de ahorro y descarga las fotos individualmente o en archivo ZIP.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Formatos soportados', value: 'JPG, JPEG, PNG, WebP, GIF' },
        { label: 'Control de calidad', value: 'Deslizador de precisión de 0% a 100%' },
        { label: 'Formato de salida', value: 'Mantener formato original o convertir a WebP/JPG' },
        { label: 'Procesamiento en lote', value: 'Compresión múltiple y empaquetado en archivo ZIP' },
      ],
      tipsTitle: 'Consejos y buenas prácticas',
      tips: [
        'Ajustar la calidad entre 75% y 85% logra reducir el peso de forma drástica sin pérdida visual.',
        'Convertir imágenes PNG a formato WebP maximiza la velocidad de carga en sitios web.',
        'Las dimensiones en píxeles se mantienen intactas durante la compresión.'
      ]
    },
    de: {
      toolId: 'image-compressor',
      howToUseTitle: 'So nutzen Sie Bild komprimieren',
      overviewTitle: 'Über Bild komprimieren',
      overviewText: 'Verringern Sie die Dateigröße Ihrer Bilder (JPG, PNG, WebP, GIF) mit einem präzisen Qualitätsregler. Komprimieren Sie einzelne Fotos oder ganze Stapel im Browser.',
      steps: [
        { stepNumber: 1, title: 'Bilddateien hinzufügen', description: 'Wählen Sie ein oder mehrere Bilder (JPG, PNG, WebP) aus oder ziehen Sie sie hinein.' },
        { stepNumber: 2, title: 'Qualitätsregler einstellen', description: 'Stellen Sie den Prozentwert der Komprimierung für das gewünschte Ergebnis ein.' },
        { stepNumber: 3, title: 'Bilder komprimieren', description: 'Klicken Sie auf Bilder komprimieren für die Ausführung im Browser-Arbeitsspeicher.' },
        { stepNumber: 4, title: 'Bilder oder ZIP herunterladen', description: 'Prüfen Sie die Ersparnis und laden Sie Bilder einzeln oder als ZIP-Archiv herunter.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Formate', value: 'JPG, JPEG, PNG, WebP, GIF' },
        { label: 'Qualitätssteuerung', value: 'Präzisionsregler von 0% bis 100%' },
        { label: 'Formatausgabe', value: 'Originalformat beibehalten oder in WebP/JPG umwandeln' },
        { label: 'Stapelverarbeitung', value: 'Mehrfachkomprimierung & ZIP-Archiv-Downloads' },
      ],
      tipsTitle: 'Tipps & Empfehlungen',
      tips: [
        'Ein Qualitätswert zwischen 75% und 85% bringt massive Einsparungen ohne sichtbaren Verlust.',
        'Die Umwandlung von PNG-Dateien in das WebP-Format bringt die höchsten Komprimierungsraten.',
        'Die Pixelabmessungen bleiben beim Komprimieren vollständig unverändert.'
      ]
    }
  },

  // 8. IMAGE RESIZER
  'image-resizer': {
    en: {
      toolId: 'image-resizer',
      howToUseTitle: 'How to Use Image Resizer',
      overviewTitle: 'About Image Resizer',
      overviewText: 'Resize image dimensions in pixels or percentage. Maintain original aspect ratio or set custom Width and Height with high-quality bicubic canvas resampling.',
      steps: [
        { stepNumber: 1, title: 'Select an Image File', description: 'Choose or drag an image (JPG, PNG, WebP) into the resizer workspace.' },
        { stepNumber: 2, title: 'Set Width & Height', description: 'Enter exact pixel dimensions or choose a percentage scale (e.g., 50%, 75%).' },
        { stepNumber: 3, title: 'Toggle Aspect Ratio Lock', description: 'Keep aspect ratio locked to prevent distortion, or unlock to stretch to custom dimensions.' },
        { stepNumber: 4, title: 'Resize & Download', description: 'Click Resize Image to resample the canvas and save your resized image file.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Inputs', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'Dimension Modes', value: 'Exact pixel dimensions (px) & Percentage scale (%)' },
        { label: 'Aspect Ratio Control', value: 'Proportional lock toggle & unconstrained stretching' },
        { label: 'Resampling Engine', value: 'High-precision HTML5 Canvas Bicubic Smoothing' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Keep the aspect ratio lock enabled to preserve correct photo proportions.',
        'Scaling down images reduces overall file size and speeds up website loading times.',
        'Enter percentage values (e.g. 50%) for quick proportional downsizing.'
      ]
    },
    ar: {
      toolId: 'image-resizer',
      howToUseTitle: 'كيفية استخدام أداة تغيير حجم الصور',
      overviewTitle: 'عن أداة تغيير أبعاد الصور',
      overviewText: 'قم بتغيير أبعاد الصورة بالبكسل أو بالنسبة المئوية. حافظ على تناسق الأبعاد الأصلي أو حدد العرض والارتفاع المخصصين بدقة عالية داخل متصفحك.',
      steps: [
        { stepNumber: 1, title: 'اختر ملف صورة', description: 'حدد أو اسحب الصورة (JPG, PNG, WebP) إلى بيئة تغيير الأبعاد.' },
        { stepNumber: 2, title: 'حدد العرض والارتفاع', description: 'أدخل الأبعاد بالبكسل أو اختر نسبة مئوية للتكبير/التصغير (مثل 50% أو 75%).' },
        { stepNumber: 3, title: 'قفل تناسب الأبعاد', description: 'حافظ على قفل تناسب الأبعاد لمنع تشوه الصورة، أو فك القفل للتمديد الحر.' },
        { stepNumber: 4, title: 'تغيير الحجم والتحميل', description: 'اضغط على تغيير حجم الصورة لإعادة رسمها بالدقة الجديدة وتحميل الملف.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'الصيغ المدعومة', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'أنماط القياس', value: 'أبعاد دقيقة بالبكسل (px) ونسبة مئوية (%)' },
        { label: 'التحكم بالتناسب', value: 'قفل التناسب التلقائي وتمديد حر للأبعاد' },
        { label: 'محرك إعادة الرسم', value: 'تنعييم عالي الدقة عبر لوحة Canvas داخل المتصفح' },
      ],
      tipsTitle: 'نصائح وإرشادات لتغيير أبعاد الصور',
      tips: [
        'اترك خيار قفل تناسب الأبعاد مفعلاً للحفاظ على المظهر الطبيعي للصورة دون تشويه.',
        'يساعد تصغير أبعاد الصور الكبيرة على تسريع تحميل صفحات الويب وتقليل الحجم.',
        'استخدم النسبة المئوية (مثل 50%) لتصغير الصور بسرعة مع الحفاظ التام على التناسب.'
      ]
    },
    fr: {
      toolId: 'image-resizer',
      howToUseTitle: 'Comment utiliser le Redimensionneur d’Images',
      overviewTitle: 'À propos du Redimensionneur d’Images',
      overviewText: 'Redimensionnez les dimensions de vos images en pixels ou en pourcentage. Conservez le ratio d’aspect d’origine ou définissez des dimensions personnalisées.',
      steps: [
        { stepNumber: 1, title: 'Sélectionner un fichier image', description: 'Choisissez ou glissez une image (JPG, PNG, WebP) dans l’espace de redimensionnement.' },
        { stepNumber: 2, title: 'Définir Largeur & Hauteur', description: 'Saisissez les dimensions en pixels ou choisissez un pourcentage (ex. 50%, 75%).' },
        { stepNumber: 3, title: 'Verrouiller le ratio d’aspect', description: 'Conservez le ratio verrouillé pour éviter les déformations ou déverrouillez-le.' },
        { stepNumber: 4, title: 'Redimensionner & Télécharger', description: 'Cliquez sur Redimensionner l’Image pour ré-échantillonner et enregistrer.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Formats pris en charge', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'Modes de dimension', value: 'Pixels exacts (px) & Échelle en pourcentage (%)' },
        { label: 'Contrôle du ratio', value: 'Verrouillage proportionnel & étirement libre' },
        { label: 'Moteur de ré-échantillonnage', value: 'Lissage Canvas HTML5 haute précision' },
      ],
      tipsTitle: 'Conseils pratiques pour le redimensionnement',
      tips: [
        'Gardez le verrouillage du ratio d’aspect activé pour préserver les proportions d’origine.',
        'Redimensionner les grandes photos réduit le poids et accélère le chargement sur le Web.',
        'Utilisez des pourcentages (ex. 50%) pour un redimensionnement proportionnel rapide.'
      ]
    },
    es: {
      toolId: 'image-resizer',
      howToUseTitle: 'Cómo usar Redimensionar Imagen',
      overviewTitle: 'Sobre Redimensionar Imagen',
      overviewText: 'Redimensiona las dimensiones de tus fotos en píxeles o porcentaje. Mantén la relación de aspecto original o establece ancho y alto personalizados.',
      steps: [
        { stepNumber: 1, title: 'Seleccionar un archivo de imagen', description: 'Elige o arrastra una imagen (JPG, PNG, WebP) a la zona de redimensionado.' },
        { stepNumber: 2, title: 'Ajustar Ancho y Alto', description: 'Introduce píxeles exactos o selecciona una escala porcentual (ej. 50%, 75%).' },
        { stepNumber: 3, title: 'Ajustar bloqueo de proporción', description: 'Mantén el bloqueo para evitar distorsionar la foto o desbloquéalo para estirar.' },
        { stepNumber: 4, title: 'Redimensionar y descargar', description: 'Haz clic en Redimensionar Imagen para procesar el archivo ajustado.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Formatos soportados', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'Modos de medida', value: 'Píxeles exactos (px) y escala en porcentaje (%)' },
        { label: 'Control de aspecto', value: 'Bloqueo proporcional y ajuste libre' },
        { label: 'Motor de procesamiento', value: 'Re-muestreo suavizado en Canvas HTML5' },
      ],
      tipsTitle: 'Consejos y buenas prácticas',
      tips: [
        'Mantén activado el bloqueo de proporción para evitar que la imagen se deforme.',
        'Reducir dimensiones en píxeles es la forma más rápida de aligerar fotos pesadas.',
        'Usa valores porcentuales (ej. 50%) para reducir imágenes de forma rápida y exacta.'
      ]
    },
    de: {
      toolId: 'image-resizer',
      howToUseTitle: 'So nutzen Sie Bildgröße ändern',
      overviewTitle: 'Über Bildgröße ändern',
      overviewText: 'Ändern Sie Bildabmessungen in Pixeln oder Prozent. Behalten Sie das ursprüngliche Seitenverhältnis bei oder legen Sie benutzerdefinierte Werte fest.',
      steps: [
        { stepNumber: 1, title: 'Bilddatei auswählen', description: 'Wählen Sie ein Bild (JPG, PNG, WebP) aus oder ziehen Sie es hinein.' },
        { stepNumber: 2, title: 'Breite & Höhe festlegen', description: 'Geben Sie Pixelmaße ein oder wählen Sie eine prozentuale Skalierung (z. B. 50%).' },
        { stepNumber: 3, title: 'Seitenverhältnis sperren', description: 'Aktivieren Sie die Sperre für korrekte Proportionen oder deaktivieren Sie sie.' },
        { stepNumber: 4, title: 'Größe ändern & herunterladen', description: 'Klicken Sie auf Bildgröße ändern und speichern Sie die Ausgabedatei.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Eingabe', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
        { label: 'Dimensionierungsmodi', value: 'Exakte Pixelmaße (px) & Prozentuale Skalierung (%)' },
        { label: 'Verhältnissteuerung', value: 'Proportionale Sperre & freie Streckung' },
        { label: 'Neu-Abtastungs-Engine', value: 'Hochpräzises HTML5-Canvas-Glättungsverfahren' },
      ],
      tipsTitle: 'Tipps & Empfehlungen',
      tips: [
        'Lassen Sie die Verhältnissperre aktiv, um Verzerrungen des Motivs zu vermeiden.',
        'Das Verkleinern von Pixelmaßen senkt die Dateigröße drastisch für schnellere Ladezeiten.',
        'Verwenden Sie Prozentwerte (z. B. 50%) für eine schnelle proportionale Verkleinerung.'
      ]
    }
  },

  // 9. IMAGE CONVERTER
  'image-converter': {
    en: {
      toolId: 'image-converter',
      howToUseTitle: 'How to Use Image Converter',
      overviewTitle: 'About Image Converter',
      overviewText: 'Convert image files seamlessly between popular formats including JPG, PNG, WebP, GIF, and BMP. Batch convert multiple files at once in your browser with ZIP archive packaging.',
      steps: [
        { stepNumber: 1, title: 'Add Image Files', description: 'Select or drag one or multiple image files into the format converter.' },
        { stepNumber: 2, title: 'Choose Target Format', description: 'Select desired output format (JPG, PNG, WebP, GIF, or BMP).' },
        { stepNumber: 3, title: 'Convert Images', description: 'Click Convert Format to re-encode image canvas data locally in your browser.' },
        { stepNumber: 4, title: 'Download Converted Images', description: 'Download converted files individually or save all converted images in a ZIP file.' },
      ],
      optionsTitle: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Supported Inputs', value: 'JPG, PNG, WebP, GIF, BMP, HEIC, TIFF' },
        { label: 'Target Output Formats', value: 'JPG (Compressed), PNG (Alpha), WebP (Modern), GIF, BMP' },
        { label: 'Batch Processing', value: 'Multi-file conversion & ZIP archive packaging' },
        { label: 'Execution Sandbox', value: '100% Client-Side In-Memory Canvas Encoding' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Convert transparency-heavy PNG logos to WebP format for compact size while preserving alpha background.',
        'Convert photos to JPG format for maximum compatibility across older applications.',
        'Batch converting multiple images to WebP optimizes image assets for web publishing.'
      ]
    },
    ar: {
      toolId: 'image-converter',
      howToUseTitle: 'كيفية استخدام أداة تحويل صيغ الصور',
      overviewTitle: 'عن أداة تحويل صيغ الصور',
      overviewText: 'قم بتحويل صيغ الصور بسلاسة بين أشهر الصيغ مثل JPG, PNG, WebP, GIF, BMP. حوّل عدة صور دفعة واحدة داخل متصفحك مع خيار التنزيل في ملف ZIP.',
      steps: [
        { stepNumber: 1, title: 'إضافة ملفات الصور', description: 'حدد أو اسحب صورة واحدة أو صوراً متعددة إلى محول الصيغ.' },
        { stepNumber: 2, title: 'اختيار الصيغة المستهدفة', description: 'حدد الصيغة المطلوبة للتصدير (JPG, PNG, WebP, GIF, BMP).' },
        { stepNumber: 3, title: 'بدء تحويل الصيغة', description: 'اضغط على زر تحويل الصيغة لإعادة تشفير الصور محلياً داخل المتصفح.' },
        { stepNumber: 4, title: 'تحميل الصور المحولة', description: 'احفظ الصور المحولة بشكل فردي أو قم بتنزيل جميع الصور في ملف ZIP مضغوط.' },
      ],
      optionsTitle: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'الصيغ المدعومة', value: 'JPG, PNG, WebP, GIF, BMP, HEIC, TIFF' },
        { label: 'صيغ التصدير المتاحة', value: 'JPG (مضغوطة), PNG (خلفية شفافة), WebP (حديثة), GIF, BMP' },
        { label: 'المعالجة الجماعية', value: 'تحويل صور متعددة وتجميعها في ملف ZIP' },
        { label: 'بيئة المعالجة', value: 'إعادة تشفير محلية 100% داخل المتصفح' },
      ],
      tipsTitle: 'نصائح وإرشادات لتحويل الصيغ',
      tips: [
        'حوّل الشعارات ذات الخلفية الشفافة من PNG إلى WebP للحصول على حجم صغير مع بقاء الشفافية.',
        'حوّل الصور الفوتوغرافية إلى صيغة JPG لضمان أعلى توافق مع التطبيقات القديمة.',
        'يتيح التحويل الجماعي إلى WebP تجهيز صور موقعك الإلكتروني دفعة واحدة.'
      ]
    },
    fr: {
      toolId: 'image-converter',
      howToUseTitle: 'Comment utiliser le Convertisseur d’Images',
      overviewTitle: 'À propos du Convertisseur d’Images',
      overviewText: 'Convertissez vos fichiers images entre les formats les plus populaires (JPG, PNG, WebP, GIF, BMP). Convertissez par lots avec téléchargement ZIP.',
      steps: [
        { stepNumber: 1, title: 'Ajouter des fichiers images', description: 'Sélectionnez ou glissez une ou plusieurs images dans le convertisseur.' },
        { stepNumber: 2, title: 'Choisir le format cible', description: 'Sélectionnez le format de sortie souhaité (JPG, PNG, WebP, GIF, BMP).' },
        { stepNumber: 3, title: 'Convertir les images', description: 'Cliquez sur Convertir le Format pour ré-encoder les images localement.' },
        { stepNumber: 4, title: 'Télécharger les images', description: 'Enregistrez les fichiers convertis individuellement ou sous forme d’archive ZIP.' },
      ],
      optionsTitle: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Formats d’entrée pris en charge', value: 'JPG, PNG, WebP, GIF, BMP, HEIC, TIFF' },
        { label: 'Formats de sortie cibles', value: 'JPG (Compressé), PNG (Alpha), WebP (Web), GIF, BMP' },
        { label: 'Traitement par lot', value: 'Conversion multiple & conditionnement en ZIP' },
        { label: 'Sécurité', value: 'Encodage 100% local en mémoire Canvas' },
      ],
      tipsTitle: 'Conseils pratiques pour la conversion',
      tips: [
        'Convertissez les logos PNG transparents au format WebP pour réduire leur poids.',
        'Privilégiez le format JPG pour une compatibilité universelle sur tous les systèmes.',
        'La conversion groupée vers WebP est idéale pour l’optimisation de sites Web.'
      ]
    },
    es: {
      toolId: 'image-converter',
      howToUseTitle: 'Cómo usar Convertidor de Imágenes',
      overviewTitle: 'Sobre el Convertidor de Imágenes',
      overviewText: 'Convierte archivos de imagen fácilmente entre formatos populares como JPG, PNG, WebP, GIF y BMP. Convierte lotes completos de fotos con descarga ZIP.',
      steps: [
        { stepNumber: 1, title: 'Añadir archivos de imagen', description: 'Selecciona o arrastra una o varias imágenes al convertidor de formato.' },
        { stepNumber: 2, title: 'Elegir formato de salida', description: 'Selecciona el formato deseado (JPG, PNG, WebP, GIF o BMP).' },
        { stepNumber: 3, title: 'Convertir imágenes', description: 'Haz clic en Convertir Formato para procesar la codificación en el navegador.' },
        { stepNumber: 4, title: 'Descargar imágenes convertidas', description: 'Guarda las fotos por separado o empaquetadas en un archivo ZIP.' },
      ],
      optionsTitle: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Formatos de entrada', value: 'JPG, PNG, WebP, GIF, BMP, HEIC, TIFF' },
        { label: 'Formatos de salida', value: 'JPG (Comprimido), PNG (Transparencia), WebP (Web), GIF, BMP' },
        { label: 'Procesamiento en lote', value: 'Conversión múltiple y descarga en archivo ZIP' },
        { label: 'Ejecución', value: 'Codificación 100% local en memoria' },
      ],
      tipsTitle: 'Consejos y buenas prácticas',
      tips: [
        'Convierte logos PNG transparentes a WebP para reducir espacio conservando el fondo transparente.',
        'Usa JPG cuando necesites enviar fotos a dispositivos o sistemas antiguos.',
        'La conversión en lote a formato WebP ayuda a optimizar rápidamente recursos web.'
      ]
    },
    de: {
      toolId: 'image-converter',
      howToUseTitle: 'So nutzen Sie Bild-Konverter',
      overviewTitle: 'Über den Bild-Konverter',
      overviewText: 'Konvertieren Sie Bilddateien nahtlos zwischen Formaten wie JPG, PNG, WebP, GIF und BMP. Stapelkonvertierung im Browser mit ZIP-Archiv-Downloads.',
      steps: [
        { stepNumber: 1, title: 'Bilddateien hinzufügen', description: 'Wählen Sie ein oder mehrere Bilder aus oder ziehen Sie sie hinein.' },
        { stepNumber: 2, title: 'Zielformat wählen', description: 'Wählen Sie das gewünschte Ausgabeformat (JPG, PNG, WebP, GIF, BMP).' },
        { stepNumber: 3, title: 'Bilder konvertieren', description: 'Klicken Sie auf Format konvertieren für das Neu-Encodieren im Browser.' },
        { stepNumber: 4, title: 'Konvertierte Bilder herunterladen', description: 'Speichern Sie Bilder einzeln oder laden Sie alle im ZIP-Archiv herunter.' },
      ],
      optionsTitle: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Unterstützte Eingabe', value: 'JPG, PNG, WebP, GIF, BMP, HEIC, TIFF' },
        { label: 'Ziel-Ausgabeformate', value: 'JPG (Komprimiert), PNG (Alpha), WebP (Modern), GIF, BMP' },
        { label: 'Stapelverarbeitung', value: 'Mehrfachkonvertierung & ZIP-Archiv-Verpackung' },
        { label: 'Datenschutz', value: '100% lokale Encodierung im Arbeitsspeicher' },
      ],
      tipsTitle: 'Tipps & Empfehlungen',
      tips: [
        'Wandeln Sie PNG-Logos in WebP um, um Speicherplatz bei transparenter Grafik zu sparen.',
        'Wählen Sie JPG für maximale Kompatibilität mit allen älteren Programmen.',
        'Die Stapelkonvertierung nach WebP optimiert Ihre Bilder perfekt für Webseiten.'
      ]
    }
  }
};

// Helper function to get rich content with guaranteed fallback
export function getToolRichContent(toolId: string, lang: LanguageCode): ToolRichContent {
  const toolEntry = toolRichContentMap[toolId];
  if (toolEntry && toolEntry[lang]) {
    return toolEntry[lang];
  }
  if (toolEntry && toolEntry.en) {
    return toolEntry.en;
  }

  // Fallback for tools without custom entries
  return createToolSpecificFallback(toolId, lang);
}

function createToolSpecificFallback(toolId: string, lang: LanguageCode): ToolRichContent {
  const cleanTitle = toolId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const titleMap: Record<LanguageCode, { how: string; about: string; steps: StepItem[]; options: string; optionsList: OptionInfoItem[]; tipsTitle: string; tips: string[] }> = {
    en: {
      how: `How to Use ${cleanTitle}`,
      about: `About ${cleanTitle}`,
      steps: [
        { stepNumber: 1, title: 'Select File', description: `Choose or drag your ${cleanTitle.toLowerCase()} file into the tool.` },
        { stepNumber: 2, title: 'Adjust Settings', description: 'Configure tool options and output parameters as desired.' },
        { stepNumber: 3, title: 'Process File', description: 'Execute the high-speed local processing directly in your browser.' },
        { stepNumber: 4, title: 'Download Result', description: 'Save your processed file directly to your device.' },
      ],
      options: 'Technical Specifications & Features',
      optionsList: [
        { label: 'Tool Category', value: cleanTitle },
        { label: 'Execution Sandbox', value: '100% Client-Side In-Memory Engine' },
        { label: 'Security Guarantee', value: 'Zero Server Storage / Zero Uploads' },
      ],
      tipsTitle: 'Pro Tips & Best Practices',
      tips: [
        'Processing runs entirely in browser memory for instant results.',
        'Original formatting and vector quality are preserved during execution.',
        'No registration or file uploads required.'
      ]
    },
    ar: {
      how: `كيفية استخدام أداة ${cleanTitle}`,
      about: `عن أداة ${cleanTitle}`,
      steps: [
        { stepNumber: 1, title: 'اختيار الملف', description: 'اختر أو اسحب ملفاتك مباشرة إلى بيئة العمل.' },
        { stepNumber: 2, title: 'ضبط الإعدادات', description: 'حدد الخيارات والمعايير المطلوبة لمعالجة الملف.' },
        { stepNumber: 3, title: 'تنفيذ المعالجة', description: 'نفذ المعالجة السريعة محلياً داخل ذاكرة متصفحك.' },
        { stepNumber: 4, title: 'تحميل النتيجة', description: 'احفظ الملف النهائي الناتج مباشرة على جهازك.' },
      ],
      options: 'المواصفات التقنية والخصائص',
      optionsList: [
        { label: 'فئة الأداة', value: cleanTitle },
        { label: 'بيئة المعالجة', value: 'معالجة محلية 100% في ذاكرة المتصفح' },
        { label: 'ضمان الأمان', value: 'بدون رفع أو تخزين على خوادم خارجية' },
      ],
      tipsTitle: 'نصائح وإرشادات المعالجة',
      tips: [
        'تتم كافة العمليات داخل المتصفح للوصول لأعلى سرعة وأمان.',
        'يتم الحفاظ على جودة المستندات والخطوط بدون تقليل.',
        'الأداة مجانية بالكامل ولا تتطلب أي تسجيل حساب.'
      ]
    },
    fr: {
      how: `Comment utiliser ${cleanTitle}`,
      about: `À propos de ${cleanTitle}`,
      steps: [
        { stepNumber: 1, title: 'Sélectionner le fichier', description: 'Choisissez ou glissez votre fichier dans l’espace de traitement.' },
        { stepNumber: 2, title: 'Ajuster les réglages', description: 'Configurez les options et paramètres de sortie souhaités.' },
        { stepNumber: 3, title: 'Exécuter le traitement', description: 'Lancez le traitement local rapide dans votre navigateur.' },
        { stepNumber: 4, title: 'Télécharger le résultat', description: 'Enregistrez votre fichier généré directement sur votre appareil.' },
      ],
      options: 'Spécifications techniques & Caractéristiques',
      optionsList: [
        { label: 'Catégorie d’outil', value: cleanTitle },
        { label: 'Environnement', value: 'Moteur 100% local en mémoire navigateur' },
        { label: 'Garantie sécurité', value: 'Zéro stockage serveur / Zéro téléversement' },
      ],
      tipsTitle: 'Conseils pratiques & Meilleures pratiques',
      tips: [
        'Le traitement s’exécute intégralement en mémoire locale.',
        'La qualité originale des vecteurs et polices est préservée.',
        'Aucune création de compte ni téléversement requis.'
      ]
    },
    es: {
      how: `Cómo usar ${cleanTitle}`,
      about: `Sobre ${cleanTitle}`,
      steps: [
        { stepNumber: 1, title: 'Seleccionar archivo', description: 'Elige o arrastra tu archivo a la zona de trabajo.' },
        { stepNumber: 2, title: 'Ajustar parámetros', description: 'Configura las opciones de la herramienta según tus preferencias.' },
        { stepNumber: 3, title: 'Procesar archivo', description: 'Ejecuta el procesamiento veloz en la memoria del navegador.' },
        { stepNumber: 4, title: 'Descargar resultado', description: 'Guarda tu archivo resultante directamente en tu dispositivo.' },
      ],
      options: 'Especificaciones técnicas y características',
      optionsList: [
        { label: 'Categoría de herramienta', value: cleanTitle },
        { label: 'Entorno de ejecución', value: 'Motor 100% local en memoria de navegador' },
        { label: 'Garantía de privacidad', value: 'Sin almacenamiento en servidores externos' },
      ],
      tipsTitle: 'Consejos y buenas prácticas',
      tips: [
        'El procesamiento se realiza localmente para máxima velocidad.',
        'Se conservan la calidad y los formatos originales.',
        'Uso totalmente libre sin registros ni límites.'
      ]
    },
    de: {
      how: `So nutzen Sie ${cleanTitle}`,
      about: `Über ${cleanTitle}`,
      steps: [
        { stepNumber: 1, title: 'Datei auswählen', description: 'Wählen Sie Ihre Datei aus oder ziehen Sie sie hinein.' },
        { stepNumber: 2, title: 'Einstellungen anpassen', description: 'Konfigurieren Sie die Optionen für das gewünschte Ergebnis.' },
        { stepNumber: 3, title: 'Datei verarbeiten', description: 'Starten Sie die schnelle Ausführung im Browser-Arbeitsspeicher.' },
        { stepNumber: 4, title: 'Ergebnis herunterladen', description: 'Speichern Sie Ihre verarbeitete Datei direkt auf Ihrem Gerät.' },
      ],
      options: 'Technische Spezifikationen & Funktionen',
      optionsList: [
        { label: 'Werkzeug-Kategorie', value: cleanTitle },
        { label: 'Ausführungsumgebung', value: '100% lokale Browser-Engine im Speicher' },
        { label: 'Datenschutzgarantie', value: 'Kein Server-Speicher / Kein Upload' },
      ],
      tipsTitle: 'Tipps & Empfehlungen',
      tips: [
        'Die Verarbeitung läuft für sofortige Ergebnisse komplett im Browser.',
        'Qualität und Formatierungen bleiben unverändert erhalten.',
        'Kostenlos ohne Registrierung oder Uploads nutzbar.'
      ]
    }
  };

  const t = titleMap[lang] || titleMap.en;

  return {
    toolId,
    howToUseTitle: t.how,
    overviewTitle: t.about,
    overviewText: `${cleanTitle} provides secure, browser-native processing with zero server uploads and instant execution.`,
    steps: t.steps,
    optionsTitle: t.options,
    optionsList: t.optionsList,
    tipsTitle: t.tipsTitle,
    tips: t.tips,
  };
}
