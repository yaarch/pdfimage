import React from 'react';
import { ShieldCheck, Cpu, HardDrive, Zap, Star } from 'lucide-react';
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
            ? 'منصة أدوات ملفات تفاعلية مجانية وسهلة الاستخدام تركز على تلبية احتياجاتك مباشرة في متصفحك.'
            : 'A convenient, browser-based file editing platform engineered to simplify document and photo management.'}
        </p>
      </div>

      {/* Main Philosophy Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs leading-relaxed text-sm sm:text-base">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? 'ما هو مشروع PDF Image Studio؟' : 'What is PDF Image Studio?'}
          </h2>
          <p>
            {isAr
              ? 'PDF Image Studio هو عبارة عن مجموعة متكاملة من أدوات الويب لمعالجة مستندات الـ PDF والصور وتحسينها. تم بناء الموقع بهدف تقديم بدائل نظيفة وسريعة للأدوات السحابية التقليدية التي قد تفرض تكاليف اشتراك أو تتطلب عمليات رفع بطيئة ومعقدة.'
              : 'PDF Image Studio is a curated ecosystem of browser-based utilities designed to help users merge, split, compress, organize, and convert files. We created this platform to offer direct, lightweight alternatives to legacy cloud editors that require subscription commitments or cumbersome file transfers.'}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? 'لماذا تم إنشاء هذا الموقع؟' : 'Why We Built This Platform'}
          </h2>
          <p>
            {isAr
              ? 'في العادة، كان المستخدم يضطر لرفع فواتير حساسة أو صور خاصة إلى خوادم سحابية مجهولة لمجرد تدوير صفحة PDF أو ضغط حجم صورة. من هنا جاءت فكرة PDF Image Studio: استغلال قوة متصفحات الويب الحديثة والتقنيات المحلية للقيام بمعالجة الملفات محلياً من جهة العميل (client-side) في متصفحك مباشرة وبكل سرعة وخصوصية.'
              : 'Historically, performing basic document modifications—like combining pages or converting image dimensions—forced users to upload proprietary files to remote cloud queues. PDF Image Studio was engineered to leverage the high-performance local compilation capabilities of modern web browsers, executing supported file manipulations inside the secure sandbox of your browser runtime.'}
          </p>
        </div>

        {/* Categories of Tools & Independence statement */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? 'الأدوات والمميزات المستقلة' : 'Our Tool Categories & Independent Spirit'}
          </h2>
          <p>
            {isAr
              ? 'تغطي مجموعتنا أدوات شاملة لإدارة الـ PDF (مثل الدمج، التقسيم، الترتيب، الضغط، إضافة الأرقام والواترمارك) بالإضافة إلى أدوات الصور الذكية (مثل الضغط، تعديل المقاسات، تحويل الصيغ، إزالة الميتاداتا والقص).'
              : 'We provide separate suites for advanced PDF processing (organizing, rotating, merging, splitting, compressing, metadata editing) and image adjustments (optimizing, resizing, converting, removing EXIF metadata, cropping).'}
          </p>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <p className="font-bold mb-1">
              {isAr ? 'تنويه استقلالية هام:' : 'Independent Project Notice:'}
            </p>
            <p>
              {isAr
                ? 'PDF Image Studio هو مشروع مستقل بالكامل. نحن لا نتبع لشركة Adobe أو Google أو Microsoft أو Apple أو أي شركة تكنولوجية كبرى أخرى، وجميع العلامات التجارية وحقوق الملكية للـ PDF والصور تنتمي لأصحابها المعنيين.'
                : 'PDF Image Studio is an entirely independent software project. We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Adobe, Google, Microsoft, Apple, or any of their subsidiaries. All trademarks belong to their respective owners.'}
            </p>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">0s</span>
            <span className="text-xs text-slate-500 font-medium">
              {isAr ? 'وقت الانتظار للرفع' : 'Upload Wait Time'}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {isAr ? 'خصوصية بالتصميم' : 'Privacy-By-Design'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {isAr ? 'معالجة محلية بالمتصفح' : 'Local In-Browser Workspace'}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl font-extrabold text-sky-600 dark:text-sky-400">{TOOLS.length}+</span>
            <span className="text-xs text-slate-500 font-medium">
              {isAr ? 'أدوات ويب تفاعلية' : 'Interactive Web Tools'}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => onNavigate('/all-tools')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
          >
            {isAr ? 'عرض دليل جميع الأدوات' : 'Explore All Tools'}
          </button>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {isAr ? 'اتصل بنا للدعم' : 'Contact Support'}
          </button>
        </div>
      </div>
    </div>
  );
};
