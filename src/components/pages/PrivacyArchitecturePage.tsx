import React from 'react';
import { ShieldCheck, Cpu, HardDrive, EyeOff, ServerOff, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n/context';

interface PrivacyArchitecturePageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyArchitecturePage: React.FC<PrivacyArchitecturePageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const isAr = language === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isAr ? 'وثيقة معمارية الخصوصية' : 'Technical Privacy Architecture'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'تصميم مخصص للخصوصية والشفافية' : 'Privacy-By-Design Technical Framework'}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'تعتمد الفلسفة الهندسية لـ PDF Image Studio على حماية بيانات المستخدم من خلال الحد من نقل البيانات إلى الخوادم السحابية قدر الإمكان. نحن نفضل معالجة مستنداتك محلياً داخل جهازك.'
            : 'PDF Image Studio’s engineering philosophy is simple: we protect user files by minimizing data transfer. Supported tools execute processes locally in your browser sandbox.'}
        </p>
      </div>

      {/* Grid of Key Technical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <Cpu className="w-8 h-8 text-indigo-500 mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            {isAr ? 'معالجة محلية داخل ذاكرة المتصفح' : 'Local Browser Execution'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'تستخدم أدواتنا لجانب العميل (client-side) واجهات برمجة تطبيقات متصفح الويب القياسية وJavaScript لمعالجة المستندات داخل الذاكرة المؤقتة لمتصفحك فقط. بمجرد إغلاق علامة التبويب، يتم تفريغ الذاكرة تلقائياً.'
              : 'Our client-side tools utilize standard web platform APIs and compiled WebAssembly runtimes inside your browser’s isolated memory. When you close the browser tab, the allocated memory is freed.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <ServerOff className="w-8 h-8 text-rose-500 mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            {isAr ? 'تقليل إرسال البيانات' : 'Minimized Data Transmission'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'بالنسبة للأدوات المحلية، لا توجد واجهات برمجية أو خوادم لتلقي ملفاتك وتخزينها. يتم فتح مستنداتك وتحليلها محلياً دون إرسال محتواها إلى السحابة.'
              : 'For our in-browser utilities, no remote server endpoints are used to receive or parse your file content. The documents are read and rendered completely on your local device.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <EyeOff className="w-8 h-8 text-amber-500 mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            {isAr ? 'لا نطلب بيانات الهوية أو التسجيل' : 'No Account & Registration Barriers'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'لا يفرض الموقع إنشاء حساب أو تسجيل دخول لاستخدام الأدوات الأساسية. نحن لا نطلب الأسماء، أو العناوين، أو كلمات المرور، أو تفاصيل بطاقات الائتمان.'
              : 'Our basic utilities do not mandate accounts, log-ins, or credential setups. We do not ask for names, email addresses, or financial data to run local tasks.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <HardDrive className="w-8 h-8 text-emerald-500 mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            {isAr ? 'إمكانية العمل بدون اتصال بالإنترنت' : 'Offline Capabilities'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'بفضل تقنية PWA، بمجرد تنزيل الأدوات المحلية وحفظها في ذاكرة التخزين المؤقت لمتصفحك، يمكنك فصل الإنترنت ومواصلة تحرير المستندات والصور بكفاءة تامة.'
              : 'Thanks to progressive web caching, once local tools are retrieved, they can operate entirely without an internet connection. You can disconnect and complete tasks smoothly.'}
          </p>
        </div>
      </div>

      {/* Structured Technical Explanation Block */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {isAr ? 'طريقة معالجة الملفات في PDF Image Studio' : 'How PDF Image Studio Processes Your Files'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {isAr
            ? 'تختلف طريقة معالجة الملفات بحسب الأداة المستخدمة. يرجى مراجعة تفاصيل ووصف كل أداة بشكل فردي لمعرفة آلية عملها بدقة. الأدوات المحلية مخصصة للعمل داخل متصفحك بشكل كامل، بينما قد تعتمد بعض الميزات الخارجية الاختيارية على معالجة آمنة ومحدودة.'
            : 'Processing behavior can vary by tool. Review the individual tool description for details. While our primary visual tools execute processes in your browser window, other optional features might utilize safe remote computing context.'}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {isAr
            ? 'يسعى هذا المشروع المستقل إلى توفير أدوات ويب نظيفة وسريعة تلائم احتياجاتك اليومية بكل شفافية وبدون مبالغة في الادعاءات الأمنية.'
            : 'As an independent project, we strive to deliver transparent web tools that suit your workflow without exaggerated claims.'}
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('/all-tools')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
          >
            {isAr ? 'عرض دليل جميع الأدوات' : 'Explore All Tools'}
          </button>
        </div>
      </div>
    </div>
  );
};
