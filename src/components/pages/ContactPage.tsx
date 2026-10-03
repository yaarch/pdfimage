import React, { useState } from 'react';
import { 
  Mail, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useTranslation } from '../../i18n/context';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

const SUPPORT_EMAIL = 'pdfimagestudio@gmail.com';

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate: _onNavigate }) => {
  const { language } = useTranslation();
  const isAr = language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    reason: 'support',
    toolName: '',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const getReasonLabel = (reasonKey: string) => {
    switch (reasonKey) {
      case 'bug':
        return isAr ? 'إبلاغ عن عطل فني' : 'Bug Report';
      case 'suggestion':
        return isAr ? 'اقتراح ميزة جديدة' : 'Feature Request';
      case 'general':
        return isAr ? 'استفسار عام' : 'General Inquiry';
      case 'support':
      default:
        return isAr ? 'دعم فني واستكشاف أخطاء' : 'Technical Support';
    }
  };

  const subject = `[${getReasonLabel(formData.reason)}] PDF Image Studio${formData.toolName ? ` - ${formData.toolName}` : ''}`;

  const emailBody = [
    formData.name ? `${isAr ? 'الاسم' : 'Name'}: ${formData.name}` : '',
    formData.toolName ? `${isAr ? 'الأداة المعنية' : 'Affected Tool'}: ${formData.toolName}` : '',
    `${isAr ? 'نوع الطلب' : 'Category'}: ${getReasonLabel(formData.reason)}`,
    '',
    `${isAr ? 'تفاصيل الرسالة' : 'Message Details'}:`,
    formData.message || (isAr ? '(يرجى كتابة استفسارك أو وصف المشكلة هنا)' : '(Please describe your inquiry or problem here)'),
    '',
    '---',
    'Sent via PDF Image Studio Contact Assistant'
  ].filter(line => line !== '').join('\n');

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(SUPPORT_EMAIL).catch(() => {});
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyDraft = () => {
    const fullText = `To: ${SUPPORT_EMAIL}\nSubject: ${subject}\n\n${emailBody}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const handleLaunchGmail = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(gmailWebUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'اتصل بنا والدعم الفني' : 'Contact Us & Technical Support'}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {isAr
            ? 'نحن هنا لمساعدتك. تواصل معنا مباشرة للإبلاغ عن مشكلة في أداة، أو لتقديم الاقتراحات والملاحظات.'
            : 'We are here to help. Reach out directly to report an issue, suggest new features, or send general feedback.'}
        </p>
      </div>

      {/* Warning Notice Box */}
      <div className="mb-10 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold">
            {isAr ? 'تنبيه أمني هام جداً:' : 'Important Privacy Notice:'}
          </p>
          <p>
            {isAr
              ? 'يرجى عدم إرسال أي مستندات سرية، أو كلمات مرور، أو معلومات مالية، أو سجلات طبية، أو أي معلومات شخصية حساسة أخرى عبر البريد الإلكتروني.'
              : 'Please do not send confidential documents, passwords, financial information, medical information, or other sensitive personal information through email.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Direct Support Channels */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              {isAr ? 'قنوات الدعم المباشر' : 'Direct Support Channels'}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-1" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      {isAr ? 'البريد الإلكتروني للدعم' : 'Support Email'}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white break-all font-mono select-all">
                      {SUPPORT_EMAIL}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleCopyEmail}
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isAr ? 'تم نسخ البريد!' : 'Email Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isAr ? 'نسخ عنوان البريد' : 'Copy Email'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                    {isAr ? 'الاستفسارات العامة:' : 'General Inquiries:'}
                  </span>
                  <p>{isAr ? 'نرحب بجميع ملاحظاتك واقتراحاتك حول جودة الخدمات وأفكار الأدوات الجديدة.' : 'Feedback, collaboration proposals, and general site questions are always welcome.'}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                    {isAr ? 'الإبلاغ عن الأعطال:' : 'Bug Reports:'}
                  </span>
                  <p>{isAr ? 'يرجى تحديد اسم الأداة المعنية، ونوع الملف والمتصفح، وتفاصيل الخطأ المعروض.' : 'Please mention the tool name, browser version, file type/size, and the exact error encountered.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Contact Assistant */}
        <div className="md:col-span-2">
          <form 
            onSubmit={handleLaunchGmail} 
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'مساعد رسائل الدعم' : 'Contact Assistant'}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {isAr 
                  ? 'املأ الحقول أدناه لفتح الرسالة مباشرة في Gmail ويب أو نسخ المسودة المنسقة وعنوان الدعم.'
                  : 'Fill out the fields below to open directly in Gmail Web, copy your formatted draft, or copy our support email.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الاسم (اختياري)' : 'Your Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isAr ? 'مثال: أحمد' : 'e.g. Alex'}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'سبب التواصل' : 'Reason for Contact'}
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors cursor-pointer"
                >
                  <option value="support" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{isAr ? 'الدعم الفني واستكشاف الأخطاء' : 'Technical Support'}</option>
                  <option value="bug" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{isAr ? 'الإبلاغ عن مشكلة في أداة' : 'Report a Tool Bug'}</option>
                  <option value="suggestion" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{isAr ? 'اقتراح ميزة أو أداة جديدة' : 'Feature Request / Suggestion'}</option>
                  <option value="general" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{isAr ? 'ملاحظات عامة واستفسارات' : 'General Feedback'}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'الأداة المعنية (اختياري)' : 'Affected Tool or Section (Optional)'}
              </label>
              <input
                type="text"
                value={formData.toolName}
                onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                placeholder={isAr ? 'مثال: دمج PDF، ضاغط الصور، أداة الاستخراج...' : 'e.g. PDF Merge, Image Compressor, Text to PDF...'}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'تفاصيل الرسالة' : 'Your Message'} <span className="text-indigo-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={isAr 
                  ? 'اكتب رسالتك، واذكر بيئة المتصفح أو تفاصيل الخطأ إن وجدت...' 
                  : 'Describe your request, issue encountered, or suggested enhancement...'}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-colors resize-y"
              />
            </div>

            {/* Three Permitted Action Options: 1. Open in Gmail (Web), 2. Copy Formatted Draft, 3. Copy Email */}
            <div className="space-y-2.5 pt-2">
              {/* Option 1: Open in Gmail (Web) */}
              <a
                href={gmailWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{isAr ? 'فتح في Gmail ويب' : 'Open in Gmail (Web)'}</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Option 2: Copy Formatted Draft */}
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isAr ? 'تم نسخ المسودة!' : 'Draft Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isAr ? 'نسخ المسودة المنسقة' : 'Copy Formatted Draft'}</span>
                    </>
                  )}
                </button>

                {/* Option 3: Copy Email */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isAr ? 'تم نسخ البريد!' : 'Email Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isAr ? 'نسخ عنوان البريد' : 'Copy Email'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Communication Notice */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal pt-2 border-t border-slate-100 dark:border-slate-800">
              {isAr
                ? 'التواصل المباشر: لا يستخدم PDF Image Studio نموذج اتصال من جانب الخادم. بدلاً من ذلك، يقوم مساعد التواصل بإعداد رسالة لمزود البريد الإلكتروني الخاص بك، حيث يمكنك مراجعتها وإرسالها عبر خدمة بريدك الخاصة.'
                : 'Direct Communication: PDF Image Studio does not use a server-side contact form. Instead, the Contact Assistant prepares a message for your email provider. You can review the message and send it through your own email service.'}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
