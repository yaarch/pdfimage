import React from 'react';
import { useTranslation } from '../../i18n/context';

interface PrivacyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate: _onNavigate }) => {
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
            ? 'مرحباً بك في PDF Image Studio. نحن نلتزم بحماية خصوصيتك وضمان الشفافية الكاملة بشأن معالجة البيانات واستخدام الخدمات التقنية. توضح سياسة الخصوصية هذه أنواع المعلومات التي قد يتم التعامل معها، والخدمات التقنية المعتمدة أو المخطط لها، والمعايير المطبقة عند استخدامك لموقعنا.'
            : 'Welcome to PDF Image Studio. We are committed to protecting your privacy and ensuring transparent disclosure regarding data processing and third-party services. This Privacy Policy explains the types of information that may be processed, our active and planned integrations, and the standards applied when you use our website.'}
        </p>

        {/* 1. Document & File Processing */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '1. معالجة المستندات والملفات' : '1. Document & File Processing'}
          </h2>
          <p>
            {isAr
              ? 'تم تصميم الأدوات المدعومة لتنفيذ معالجة الملفات محلياً داخل متصفح الويب الخاص بك. بالنسبة لهذه الأدوات، تتم معالجة ملفات PDF والصور المدعومة داخل جلسة المتصفح بدلاً من رفعها إلى خوادمنا. قد تختلف سلوكيات المعالجة والقيود الفنية بحسب الأداة وصيغة الملف ومدى تعقيده. يرجى مراجعة صفحة كل أداة بشكل فردي للتعرف على طريقة المعالجة والقيود الخاصة بها.'
              : 'Supported tools are designed to perform file processing locally within your web browser. For these tools, supported PDF and image files are processed within your browser session rather than uploaded to our servers. Processing behavior and technical limitations may vary by tool, file format, and file complexity. Please review each individual tool\'s page for its specific processing method and limitations.'}
          </p>
        </div>

        {/* 2. Technical Information & Web Analytics */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '2. المعلومات التقنية والتحليلات (Google Analytics)' : '2. Technical Information & Analytics (Google Analytics)'}
          </h2>
          <p>
            {isAr
              ? 'عند تصفحك للموقع، تسجل خوادم شبكة توصيل المحتوى (CDN) تلقائياً بعض السجلات التقنية القياسية مثل عنوان بروتوكول الإنترنت (IP)، ونوع المتصفح ونظام التشغيل، وعناوين الصفحات المطلوبة، وتوقيت الطلب. تُستخدم هذه البيانات التقنية لضمان استقرار الشبكة وموثوقيتها وتوجيه حركة المرور بشكل آمن.'
              : 'When you visit our site, Content Delivery Network (CDN) edge servers automatically record standard server log information, such as IP addresses, browser and device user-agents, requested URLs, and timestamps. This technical data is processed strictly for security, reliability, and network routing.'}
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
            <span className="font-bold text-slate-900 dark:text-white block">
              {isAr ? 'حالة خدمة التحليلات (Google Analytics):' : 'Google Analytics Status & Implementation:'}
            </span>
            <p>
              {isAr
                ? 'يخطط PDF Image Studio لاستخدام Google Analytics لقياس حركة المرور وأنماط استخدام الموقع. في الإصدار الإنتاجي الحالي، لا تزال شيفرة تتبع Google Analytics غير نشطة ولا تقوم بتسجيل أي بيانات. وعند تفعيلها، قد تقوم Google Analytics بمعالجة معلومات مثل مشاهدات الصفحات والتفاعلات ومعلومات الجهاز والمتصفح وبيانات القياس ذات الصلة، وفقاً لإعدادات Analytics المحددة وسياسات Google المعمول بها.'
                : 'PDF Image Studio plans to use Google Analytics to measure website traffic and usage patterns. In the current production release, Google Analytics tracking is not active or recording data. When implemented, Google Analytics may process information such as page views, interactions, device and browser information, and related measurement data, subject to the configured Analytics settings and Google\'s applicable policies.'}
            </p>
          </div>
        </div>

        {/* 3. Cookies & Local Browser Storage */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '3. ملفات تعريف الارتباط والتخزين المحلي للمتصفح' : '3. Cookies & Local Browser Storage'}
          </h2>
          <p>
            {isAr
              ? 'يستخدم موقعنا تقنية التخزين المحلي للمتصفح (Local Storage) لحفظ تفضيلاتك من جانب العميل: مظهر العرض المفضل (داكن/فاتح)، واللغة المفضلة، والأدوات المستخدمة مؤخراً، وقائمة المفضلة للأدوات. تظل هذه البيانات محفوظة حصرياً في مساحة تخزين متصفحك ولا يتم إرسالها إلى خوادمنا.'
              : 'Our website uses browser Local Storage to remember your client-side preferences: light/dark theme preference, language selection, recently used tools, and favorite tool shortcuts. This information resides solely in your browser storage and is not transmitted to our servers.'}
          </p>
          <p>
            {isAr
              ? 'لا ينشئ PDF Image Studio ملفات تعريف ارتباط خاصة به (first-party cookies) لتشغيل الأدوات الأساسية. ومع ذلك، قد تستخدم خدمات الطرف الثالث المستخدمة على الموقع ملفات تعريف الارتباط أو تقنيات مماثلة عندما تكون تلك الخدمات نشطة. على سبيل المثال، قد تستخدم خدمات Google الإعلانية ملفات تعريف الارتباط أو تقنيات مماثلة لأغراض الإعلانات والقياس والوظائف ذات الصلة.'
              : 'PDF Image Studio does not create first-party cookies for core tool operations. Third-party services used on the site may use cookies or similar technologies when those services are active. For example, Google advertising services may use cookies or similar technologies for advertising, measurement, and related functions.'}
          </p>
        </div>

        {/* 4. Advertising & Google AdSense */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '4. الإعلانات وشبكة Google AdSense' : '4. Advertising & Google AdSense'}
          </h2>
          <p>
            {isAr
              ? 'تم تضمين شيفرة الناشر وعلامات التحقق لحساب Google AdSense في الشيفرة الإنتاجية للموقع. يخضع الموقع حالياً لمرحلة الإعداد والمراجعة الأولية، ولا يتم في الوقت الراهن عرض أو بث إعلانات تجارية نشطة للزوار.'
              : 'Google AdSense publisher code and account verification tags are present in the website\'s production code. The site is currently in the setup and review stage, and active advertisements are not currently being served to visitors.'}
          </p>
          <p>
            {isAr
              ? 'وعند تفعيل عرض الإعلانات، قد تضع أطراف ثالثة، بما في ذلك Google وشركاؤها الإعلانيون عند الاقتضاء، ملفات تعريف الارتباط وتقرأها، أو تستخدم معرفات الأجهزة أو التقنيات المماثلة على متصفحك لعرض الإعلانات وقياس فعاليتها ومكافحة الاحتيال بناءً على الزيارات السابقة لهذا الموقع أو المواقع الأخرى.'
              : 'When advertising becomes active, third parties, including Google and its advertising partners where applicable, may place and read cookies, use device identifiers, or use similar technologies in your browser to serve advertisements, prevent ad fraud, and measure ad performance in connection with visits to this and other websites.'}
          </p>
          <p>
            {isAr
              ? 'بالنسبة للزوار في المناطق التي تخضع لمتطلبات موافقة تنظيمية محددة (مثل المنطقة الاقتصادية الأوروبية والمملكة المتحدة وسويسرا)، سيتم تطبيق آليات إدارة الموافقة المطلوبة عبر منصة إدارة موافقة (CMP) معتمدة من Google بشكل منفصل قبل عرض الإعلانات في تلك المناطق.'
              : 'For visitors in jurisdictions requiring explicit consent mechanisms (such as the European Economic Area, the United Kingdom, and Switzerland), any required consent management framework will be handled via a Google-certified consent management solution prior to serving ads in those regions.'}
          </p>
          <p>
            {isAr
              ? 'يمكنك الاطلاع على كيفية استخدام Google للمعلومات الصادرة عن المواقع والتطبيقات التي تستخدم خدماتها من خلال زيارة صفحة خصوصية إعلانات Google الرسمية: '
              : 'You can learn how Google manages data in its advertising products by reviewing Google\'s official Advertising Privacy policy at: '}
            <a 
              href="https://policies.google.com/technologies/ads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              policies.google.com/technologies/ads
            </a>
            {isAr 
              ? '، كما يمكنك إدارة تفضيلات تخصيص الإعلانات عبر مركز إدارة الإعلانات في Google (My Ad Center) على: ' 
              : ', and manage your advertising personalization preferences via Google\'s My Ad Center at: '}
            <a 
              href="https://adssettings.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              adssettings.google.com
            </a>.
          </p>
        </div>

        {/* 5. Google Search Console & Search Visibility */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '5. أدوات مشرفي المواقع (Google Search Console)' : '5. Search Visibility & Google Search Console'}
          </h2>
          <p>
            {isAr
              ? 'يستخدم موقعنا بيانات التحقق الخاصة بخدمة Google Search Console لأغراض إدارة الموقع. تُستخدم Search Console من قِبل مسؤولي الموقع لمتابعة فهرسة الصفحات، ومراجعة أداء البحث، وفهم إحصاءات استعلامات البحث المجمعة ومرات الظهور والنقرات، وتحديد مشكلات الزحف أو الرؤية الفنية في محرك بحث Google.'
              : 'Our website uses Google Search Console verification metadata for site administration purposes. Search Console is used by site administrators to monitor search indexing, review search performance, understand aggregated search queries, impressions, and clicks, and identify crawling or technical visibility issues in Google Search.'}
          </p>
        </div>

        {/* 6. Third-Party Services & External Links */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '6. خدمات الطرف الثالث والروابط الخارجية' : '6. Third-Party Services & External Links'}
          </h2>
          <p>
            {isAr
              ? 'قد يحتوي موقعنا على روابط لمواقع أو خدمات خارجية (مثل روابط إنشاء رسائل Gmail للتواصل أو مراجع التوثيق الخارجية). نحن لا نتحكم في ممارسات الخصوصية الخاصة بهذه المواقع والخدمات الخارجية، ونوصيك بمراجعة سياسات الخصوصية المطبقة لديها.'
              : 'Our site may include links to external services (such as Gmail compose links or external reference documentation). We do not control and are not responsible for the privacy practices of external third-party sites, and we encourage you to review their respective privacy policies.'}
          </p>
        </div>

        {/* 7. Data Retention & User Rights */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '7. الاحتفاظ بالبيانات وحقوق المستخدم' : '7. Data Retention & User Rights'}
          </h2>
          <p>
            {isAr
              ? 'بالنسبة للأدوات المدعومة التي تعالج الملفات محلياً داخل متصفحك، فإننا لا نطلب تسجيل حسابات ولا نقوم برفع مستنداتك أو تخزينها أو الاحتفاظ بها على خوادمنا. يمكنك إزالة تفضيلات الموقع المخزنة محلياً عن طريق مسح بيانات الموقع أو التخزين المحلي (Local Storage) من خلال إعدادات المتصفح الخاص بك.'
              : 'For supported tools that process files locally within your browser, we do not require account registration and do not upload, store, or retain your documents on our servers. You can remove locally stored site preferences by clearing the site\'s stored data or Local Storage through your browser settings.'}
          </p>
        </div>

        {/* 8. Policy Updates & Contact */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '8. تحديثات السياسة والتواصل معنا' : '8. Policy Updates & Contact'}
          </h2>
          <p>
            {isAr
              ? 'قد نقوم بتحديث سياسة الخصوصية هذه دورياً لمواكبة أي تعديلات في الخدمات المعتمدة أو اللوائح التنظيمية. يتم نشر أي تعديل على هذه الصفحة مع تحديث تاريخ المراجعة في الأعلى.'
              : 'We may update this Privacy Policy periodically to reflect service updates or regulatory developments. Any revisions will be published on this page with an updated modification date at the top.'}
          </p>
          <p>
            {isAr
              ? 'إذا كانت لديك أي استفسارات أو أسئلة بخصوص سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني الرسمي للدعم: '
              : 'If you have any questions regarding this Privacy Policy, please contact us at our official support email: '}
            <span className="font-semibold text-slate-900 dark:text-white font-mono select-all">
              pdfimagestudio@gmail.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
