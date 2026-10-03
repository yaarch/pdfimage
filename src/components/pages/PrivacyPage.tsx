import React from 'react';
import { useTranslation } from '../../i18n/context';

interface PrivacyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const isAr = language === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 leading-relaxed text-sm sm:text-base text-slate-700 dark:text-slate-300">
      {/* Header */}
      <div className="text-center mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          {isAr ? 'آخر تحديث: 3 أكتوبر 2026' : 'Last Updated: October 3, 2026'}
        </p>
      </div>

      <div className="space-y-6">
        <p>
          {isAr
            ? 'مرحباً بك في PDF Image Studio. نحن نلتزم بحماية خصوصيتك وضمان شفافية معالجة البيانات الخاصة بك. توضح سياسة الخصوصية هذه أنواع المعلومات التي قد نجمعها، وكيفية استخدامها، والتدابير المتخذة لحمايتها عند استخدامك لموقعنا.'
            : 'Welcome to PDF Image Studio. We are committed to protecting your privacy and ensuring transparency regarding data processing. This Privacy Policy details the types of information we may collect, how we use it, and the security measures in place when you use our platform.'}
        </p>

        {/* 1. Document & File Processing */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '1. معالجة المستندات والملفات' : '1. Document & File Processing'}
          </h2>
          <p>
            {isAr
              ? 'تعتمد غالبية الأدوات المتاحة على موقعنا على معالجة البيانات محلياً داخل متصفحك (client-side processing). هذا يعني أن ملفاتك وصورك يتم فتحها وتحليلها مباشرة داخل جهازك المعزول ولا يتم رفعها أو تخزينها على خوادمنا السحابية.'
              : 'The majority of tools on our platform perform client-side file processing inside your web browser sandbox. This means your files and images are opened and edited locally on your workstation and are not uploaded to or stored on our cloud servers.'}
          </p>
          <p>
            {isAr
              ? 'قد تختلف طريقة معالجة الملفات بحسب كل أداة. نوصي بمراجعة الوصف الخاص بكل أداة لمعرفة طريقة معالجة الملفات بالتفصيل.'
              : 'Processing behavior can vary by tool. Review the individual tool description for specific details on how files are managed.'}
          </p>
        </div>

        {/* 2. Technical Information & Analytics */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '2. المعلومات التقنية والتحليلات' : '2. Technical Information & Analytics'}
          </h2>
          <p>
            {isAr
              ? 'عند زيارتك للموقع، قد تقوم خوادم شبكة توصيل المحتوى (CDN) الخاصة بنا تلقائياً بتسجيل بعض المعلومات التقنية الأساسية مثل عنوان البروتوكول (IP Address)، ونوع متصفح الويب، ونظام التشغيل، والصفحات التي قمت بزيارتها، والوقت المستغرق. نستخدم هذه البيانات التقنية لضمان تشغيل الموقع بكفاءة واستقرار وحمايته من الهجمات الخبيثة.'
              : 'When you visit our site, our Content Delivery Network (CDN) servers automatically collect basic technical logs, such as IP addresses, browser types, operating systems, referring URLs, and timestamps. This technical data is processed to ensure stable platform operation, mitigate security threats, and maintain service performance.'}
          </p>
          <p>
            {isAr
              ? 'إذا كنا نستخدم خدمات تحليلية خارجية (مثل Google Analytics)، فإن هذه الخدمات قد تجمع معلومات إحصائية مجهولة المصدر لغرض تحسين تجربة تصفح المستخدم وأداء الموقع الفني.'
              : 'If third-party analytics services (such as Google Analytics) are active, they may collect anonymous, aggregated statistics regarding traffic flow to help us analyze usability, system reliability, and tool interface adoption.'}
          </p>
        </div>

        {/* 3. Cookies & Local Storage */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '3. ملفات تعريف الارتباط والتخزين المحلي' : '3. Cookies & Local Storage'}
          </h2>
          <p>
            {isAr
              ? 'يستخدم الموقع تقنيات التخزين المحلي للمتصفح (Local Storage / Session Storage) لحفظ بعض تفضيلات المستخدم محلياً مثل وضع السجل (Recently Used) والأدوات المفضلة لديك أو إعدادات المظهر المظلم والفاتح. لا يتم إرسال هذه البيانات المخزنة محلياً لخوادمنا.'
              : 'We use browser Local Storage and Session Storage to store your client-side preferences, such as light/dark mode triggers, recently used tools, and custom bookmarks. This storage remains entirely local on your browser workspace and is not transmitted to us.'}
          </p>
          <p>
            {isAr
              ? 'قد نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح وتخصيص المحتوى ولأغراض عرض الإعلانات المخصصة عبر شبكات الإعلانات التابعة لجهات خارجية.'
              : 'We may also utilize persistent cookies to optimize search configurations and deliver localized language preferences, or to support advertisement delivery networks.'}
          </p>
        </div>

        {/* 4. Advertising & Google AdSense */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '4. الإعلانات وشبكة Google AdSense' : '4. Advertising & Google AdSense'}
          </h2>
          <p>
            {isAr
              ? 'قد يعرض موقعنا إعلانات تجارية يتم توفيرها وإدارتها بواسطة جهات خارجية مثل Google AdSense. تستخدم هذه الشركات ملفات تعريف الارتباط لتحديد اهتماماتك وعرض الإعلانات المخصصة لك بناءً على زيارتك لموقعنا ومواقع الويب الأخرى على الإنترنت.'
              : 'We partner with third-party advertising networks, such as Google AdSense, to display non-intrusive advertisements on our pages. These networks utilize cookies to serve personalized ads based on your browser history, patterns, and visits to other websites.'}
          </p>
          <p>
            {isAr
              ? 'ملف تعريف الارتباط DART من Google: تستخدم Google ملف تعريف الارتباط DART لخدمة الإعلانات للمستخدمين بناءً على زيارتهم لموقعنا والمواقع الأخرى. يمكنك اختيار تعطيل استخدام ملفات تعريف الارتباط المخصصة عن طريق زيارة سياسة خصوصية الإعلانات والمحتوى الخاصة بـ Google.'
              : 'Google DoubleClick DART Cookie: Google’s use of DART cookies enables it to serve ads based on your specific visits across the web. You can opt-out of these customized advertising cookies by visiting the Google Ad and Content Network Privacy Policy.'}
          </p>
        </div>

        {/* 5. Third-Party Services */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '5. خدمات الطرف الثالث وروابط الخارجية' : '5. Third-Party Services & Links'}
          </h2>
          <p>
            {isAr
              ? 'قد يحتوي موقعنا على روابط لمواقع خارجية لا نتحكم بها. نحن غير مسؤولين عن ممارسات الخصوصية أو شروط الاستخدام لتلك المواقع الخارجية، وننصحك دائماً بقراءة سياسة الخصوصية الخاصة بأي موقع ويب تقوم بزيارته.'
              : 'Our platform may display dynamic links pointing to third-party web pages. We are not responsible for the privacy methodologies, content safety, or terms of service of those external resources, and we strongly encourage you to evaluate their policies.'}
          </p>
        </div>

        {/* 6. Data Retention & User Rights */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '6. الاحتفاظ بالبيانات وحقوق المستخدمين' : '6. Data Retention & User Rights'}
          </h2>
          <p>
            {isAr
              ? 'نظراً لأننا لا نحتفظ بملفاتك على أي خادم سحابي ولا نطلب منك إنشاء حساب، فإننا لا نمتلك مستنداتك الشخصية. يمكنك في أي وقت مسح تفضيلاتك وسجل تصفح الأدوات المخزن في متصفحك من خلال خيارات الإعدادات أو مسح التخزين المؤقت للمتصفح.'
              : 'Since we do not archive your document files on any cloud database and do not prompt user account creation, we do not store your private documents. You may clean your browser preference storage at any moment by clearing your web browser cache.'}
          </p>
        </div>

        {/* 7. Updates & Contact */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '7. تحديثات السياسة والتواصل معنا' : '7. Policy Updates & Contact'}
          </h2>
          <p>
            {isAr
              ? 'نحتفظ بالحق في تعديل سياسة الخصوصية هذه في أي وقت. سيتم نشر التغييرات على هذه الصفحة مع تحديث تاريخ التعديل في الأعلى.'
              : 'We reserve the right to revise this Privacy Policy. Any modifications will be posted directly to this page with an updated modification date at the top.'}
          </p>
          <p>
            {isAr
              ? 'إذا كانت لديك أي استفسارات أو أسئلة بخصوص سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني المخصص للدعم: '
              : 'If you have any questions regarding this Privacy Policy, please contact us at our support email address: '}
            <a href="mailto:pdfimagestudio@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              pdfimagestudio@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
