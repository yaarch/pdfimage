import React from 'react';
import { useTranslation } from '../../i18n/context';
import { TOOLS } from '../../data/tools';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const isAr = language === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in text-slate-700 dark:text-slate-300">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'عن PDF Image Studio' : 'About PDF Image Studio'}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
          {isAr
            ? 'منصة أدوات ملفات تفاعلية وسهلة الاستخدام تركز على تلبية احتياجاتك مباشرة في متصفحك.'
            : 'A convenient, browser-based file utility platform engineered to simplify document and photo management.'}
        </p>
      </div>

      {/* Main Philosophy Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs leading-relaxed text-sm sm:text-base">
        {/* Section 1: What is PDF Image Studio */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? 'ما هو مشروع PDF Image Studio؟' : 'What is PDF Image Studio?'}
          </h2>
          <p>
            {isAr
              ? 'PDF Image Studio هو عبارة عن مجموعة من أدوات الويب لمعالجة مستندات الـ PDF والصور. تم بناء الموقع لتوفير أدوات سهلة ومباشرة عبر المتصفح لمهام PDF والصور اليومية الشائعة مثل الدمج والتقسيم والضغط والتحويل.'
              : 'PDF Image Studio is a collection of browser-based utilities designed to help users merge, split, compress, organize, and convert files. We created this platform to provide accessible, browser-based utilities for common everyday PDF and image tasks.'}
          </p>
        </div>

        {/* Section 2: Why We Built This Platform */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? 'لماذا تم إنشاء هذا الموقع؟' : 'Why We Built This Platform'}
          </h2>
          <p>
            {isAr
              ? 'في العادة، كان إجراء التعديلات الأساسية على المستندات—مثل دمج الصفحات أو تعديل مقاسات الصور—يتطلب رفع الملفات إلى خوادم بعيدة أو تثبيت برامج إضافية. تم تطوير PDF Image Studio للاستفادة من معايير الويب الحديثة، لتنفيذ معالجة الملفات المدعومة مباشرة داخل بيئة المتصفح.'
              : 'Historically, performing basic document modifications—like combining pages or converting image dimensions—often required remote server uploads or installing standalone software. PDF Image Studio was developed to leverage modern web standards, executing supported file manipulations directly within the browser environment.'}
          </p>
        </div>

        {/* Section 3: Tool Categories & Processing Methods */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? 'أقسام الأدوات وطرق المعالجة' : 'Tool Categories & Processing Methods'}
          </h2>
          <p>
            {isAr
              ? 'تشمل مجموعتنا أدوات لإدارة الـ PDF (مثل الدمج، التقسيم، إعادة الترتيب، الضغط، ترقيم الصفحات، وإضافة العلامات المائية) بالإضافة إلى أدوات الصور (مثل الضغط، تحويل الصيغ، تغيير الحجم، القص، فحص بيانات EXIF، وتحليل الألوان).'
              : 'Our collection includes utilities for PDF management (such as merging, splitting, reordering, compressing, page numbering, and watermark management) as well as image utilities (such as compression, format conversion, resizing, cropping, EXIF data inspection, and color analysis).'}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isAr
              ? 'تعمل الأدوات المحلية المدعومة باستخدام تقنيات المتصفح الحديثة لمعالجة بيانات المستندات والصور داخل جلسة العمل الخاصة بك. ونظراً لأن هياكل الملفات وصيغها المختلفة تتطلب متطلبات معالجة متباينة، فإن لكل أداة إرشادات وحدود فنية خاصة بها. نوصي المستخدمين بمراجعة الإرشادات والمواصفات الموضحة في صفحة كل أداة لمعرفة طريقة معالجتها والصيغ المتوافقة معها.'
              : 'Supported local tools operate using standard browser capabilities to process document and image data directly within your session. Because different file structures and formats have varied processing requirements, individual tools have specific file size guidelines and technical limitations. We encourage users to check each tool\'s individual description and instructions for its specific processing method.'}
          </p>

          {/* Independent Project Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <p className="font-bold mb-1">
              {isAr ? 'تنويه استقلالية هام:' : 'Independent Project Notice:'}
            </p>
            <p>
              {isAr
                ? 'PDF Image Studio هو مشروع برمجي مستقل. الموقع ليس تابعاً أو مرتبطاً أو مصرحاً به أو مدعوماً من أو متصلاً بشكل رسمي بشركات Adobe أو Google أو Microsoft أو Apple أو أي من الشركات التابعة لها. جميع العلامات التجارية وحقوق الملكية تنتمي لأصحابها المعنيين.'
                : 'PDF Image Studio is an independent software project. It is not affiliated with, associated with, authorized by, endorsed by, or officially connected with Adobe, Google, Microsoft, Apple, or any of their subsidiaries. All trademarks belong to their respective owners.'}
            </p>
          </div>
        </div>

        {/* 3 Metrics / Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {isAr ? 'معالجة عبر المتصفح' : 'Browser-Based Processing'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
              {isAr ? 'الأدوات المدعومة تعالج الملفات مباشرة داخل متصفحك.' : 'Supported tools process files directly in your browser.'}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {isAr ? 'معالجة محلية بالمتصفح' : 'Local In-Browser Processing'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
              {isAr ? 'الأدوات المحلية المدعومة مصممة لمعالجة الملفات مباشرة داخل المتصفح.' : 'Supported local tools are designed to process files directly within your browser.'}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-base sm:text-lg font-bold text-sky-600 dark:text-sky-400">
              {TOOLS.length} {isAr ? 'أداة ويب تفاعلية' : 'Interactive Web Tools'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
              {isAr ? 'أدوات PDF وصور لمختلف مهام الملفات الشائعة.' : 'PDF and image utilities for common file tasks.'}
            </span>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => onNavigate('/all-tools')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
          >
            {isAr ? 'عرض دليل جميع الأدوات' : 'Explore All Tools'}
          </button>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {isAr ? 'اتصل بنا للدعم' : 'Contact Support'}
          </button>
        </div>
      </div>
    </div>
  );
};
