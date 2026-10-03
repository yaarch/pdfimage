import React from 'react';
import { useTranslation } from '../../i18n/context';

interface TermsPageProps {
  onNavigate: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const isAr = language === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 leading-relaxed text-sm sm:text-base text-slate-700 dark:text-slate-300">
      {/* Header */}
      <div className="text-center mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'شروط الخدمة والاستخدام' : 'Terms of Service'}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          {isAr ? 'آخر تحديث: 3 أكتوبر 2026' : 'Last Updated: October 3, 2026'}
        </p>
      </div>

      <div className="space-y-6">
        <p>
          {isAr
            ? 'مرحباً بك في موقع PDF Image Studio. يُرجى قراءة شروط الخدمة هذه بعناية قبل استخدام موقعنا أو أدواتنا المتاحة عبر الويب. يمثل استخدامك لهذا الموقع موافقتك الكاملة على الالتزام بهذه الشروط.'
            : 'Welcome to PDF Image Studio. Please review these Terms of Service thoroughly before utilizing our platform or in-browser utilities. Your continued use of the website signifies your acceptance of these terms.'}
        </p>

        {/* 1. Use of the Platform */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '1. شروط استخدام المنصة' : '1. Terms of Platform Usage'}
          </h2>
          <p>
            {isAr
              ? 'يُسمح لك باستخدام موقعنا وأدواتنا فقط لأغراض قانونية وبما يتوافق مع القوانين واللوائح المعمول بها. يُمنع استخدام المنصة لإلحاق الضرر بالموقع أو محاولة قرصنته أو التدخل في كفاءته الفنية أو التسبب في تعطيل خدماته بأي شكل من الأشكال.'
              : 'You are permitted to use our website and tools for lawful purposes only and in accordance with applicable laws. You agree not to attempt to compromise system integrity, deploy malicious payloads, bypass browser-based sandboxes, or disrupt service availability.'}
          </p>
        </div>

        {/* 2. User Content & Ownership */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '2. ملكية محتوى المستخدم والملفات' : '2. User Content & File Ownership'}
          </h2>
          <p>
            {isAr
              ? 'أنت تحتفظ بملكية جميع الحقوق لملفاتك ومستنداتك وصورك التي تقوم بفتحها أو معالجتها عبر أدوات الموقع. PDF Image Studio لا يدعي أي حقوق ملكية فكرية على ملفاتك الشخصية. كما أننا لا نقوم بنسخ أو مشاركة مستنداتك نظراً لعملية المعالجة المحلية داخل متصفحك.'
              : 'You retain full ownership, intellectual property rights, and copyright over all documents, files, and images you open or process using our platform. PDF Image Studio claims no ownership over your inputs. Since the supported tools run client-side, we never upload or duplicate your document data.'}
          </p>
        </div>

        {/* 3. Output Accuracy & Validation */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '3. دقة النتائج والمخرجات ومسؤولية المستخدم' : '3. Output Accuracy & User Backup Responsibility'}
          </h2>
          <p>
            {isAr
              ? 'بينما نسعى جاهدين لضمان دقة عمل أدوات الويب لضغط أو تنظيم أو تحويل ملفات الـ PDF والصور، فإن النتائج والمخرجات يتم توفيرها "كما هي" دون أي ضمانات صريحة أو ضمنية بالدقة الكاملة أو ملاءمتها لغرض معين.'
              : 'While we strive to optimize our in-browser compilation, compression, and conversion utilities, all processing outputs are provided "as-is" without explicit or implied warranties regarding structural precision or formatting suitability.'}
          </p>
          <p>
            {isAr
              ? 'يتحمل المستخدم وحده كامل المسؤولية عن فحص المستندات والملفات الناتجة قبل استخدامها في سياق مهني أو شخصي، كما يقع على عاتق المستخدم واجب الاحتفاظ بنسخ احتياطية أصلية لملفاته قبل المعالجة لتجنب فقدان البيانات أو تلفها.'
              : 'You assume absolute responsibility for verifying the accuracy of output files before relying on them. You must retain original copies of your files prior to processing to prevent data corruption or loss.'}
          </p>
        </div>

        {/* 4. Service Availability & Changes */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '4. توفر الخدمة والتعديلات' : '4. Service Availability & Modifications'}
          </h2>
          <p>
            {isAr
              ? 'موقع PDF Image Studio هو مشروع مستقل ومجاني بالكامل. نحن نحتفظ بالحق في تعديل أو تعليق أو إيقاف أي جزء من الموقع أو الأدوات في أي وقت دون إشعار مسبق. نحن غير مسؤولين عن أي أضرار قد تنتج عن عدم توفر الخدمة مؤقتاً.'
              : 'PDF Image Studio is an independent, free-to-use project. We reserve the right to alter, pause, or terminate tools, sections, or site access at any time without notice. We are not liable for any operational downtime or temporary tool unavailability.'}
          </p>
        </div>

        {/* 5. Disclaimer of Warranties */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '5. إخلاء المسؤولية القانونية' : '5. Disclaimer of Warranties'}
          </h2>
          <p>
            {isAr
              ? 'يتم تقديم هذا الموقع وجميع خدماته وأدواته ومحتوياته بدون أي ضمانات من أي نوع، سواء كانت صريحة أو ضمنية. نحن نبرئ مسؤوليتنا القانونية بالكامل إلى أقصى حد يسمح به القانون عن أي خسائر أو أضرار مباشرة أو غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام الموقع أو أدوات المعالجة.'
              : 'This website and all associated tools, services, and articles are provided without warranties of any kind, express or implied. To the fullest extent permitted by law, we disclaim all liability for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use our tools.'}
          </p>
        </div>

        {/* 6. External Resources */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '6. الروابط الخارجية وإعلانات الطرف الثالث' : '6. External Links & Third-Party Advertisements'}
          </h2>
          <p>
            {isAr
              ? 'قد يعرض الموقع روابط لصفحات ومواقع خارجية أو إعلانات تابعة لأطراف ثالثة (مثل إعلانات Google AdSense). نحن لا نتحكم في محتويات هذه المواقع والخدمات الخارجية ولا نتحمل أي مسؤولية قانونية عن عروضها أو دقتها أو ممارساتها.'
              : 'We may display links to external resources or host advertisements from third-party networks (e.g. Google AdSense). We do not control or endorse the content of external pages and are not liable for their practices.'}
          </p>
        </div>

        {/* 7. Contact Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '7. شروط إضافية وقنوات التواصل' : '7. Additional Terms & Contact Details'}
          </h2>
          <p>
            {isAr
              ? 'نحتفظ بالحق في تحديث شروط الخدمة هذه في أي وقت. إن استمرارك في استخدام الموقع بعد إجراء أي تعديلات يمثل موافقتك على الشروط المحدثة.'
              : 'We reserve the right to revise these Terms of Service. Your continued use of the platform following any modifications represents your agreement to the updated terms.'}
          </p>
          <p>
            {isAr
              ? 'إذا كان لديك أي سؤال أو استفسار حول شروط الخدمة هذه، يرجى الاتصال بنا عبر البريد الإلكتروني المخصص: '
              : 'If you have any questions regarding these terms, please contact us at our designated support email: '}
            <a href="mailto:pdfimagestudio@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              pdfimagestudio@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
