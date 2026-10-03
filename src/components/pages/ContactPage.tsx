import React, { useState } from 'react';
import { Mail, HelpCircle, AlertTriangle, MessageSquare, ShieldAlert, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/context';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'support',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isAr = language === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'اتصل بنا والدعم الفني' : 'Contact Us & Technical Support'}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {isAr
            ? 'نحن هنا لمساعدتك. تواصل معنا للإبلاغ عن مشكلة في أداة، أو لتقديم الاقتراحات والملاحظات.'
            : 'We are here to help. Reach out to report an issue, suggest new features, or send general feedback.'}
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
        {/* Left column: Contact Info & Support Categories */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              {isAr ? 'قنوات الدعم المباشر' : 'Direct Support Channels'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-1" />
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    {isAr ? 'الدعم عبر البريد الإلكتروني' : 'Support Email'}
                  </span>
                  <a href="mailto:pdfimagestudio@gmail.com" className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    pdfimagestudio@gmail.com
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  {isAr 
                    ? 'الاستفسارات العامة: نرحب بجميع ملاحظاتك واقتراحاتك حول جودة الخدمات.' 
                    : 'General Inquiries: We welcome your feedback and structural proposals.'}
                </p>
                <p>
                  {isAr 
                    ? 'الإبلاغ عن الأعطال: يرجى تحديد اسم الأداة المعنية، ونوع الملف المستخدم، والرسالة المعروضة.' 
                    : 'Bug Reports: Please specify the tool name, browser environment, and step-by-step trigger.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Contact Form */}
        <div className="md:col-span-2">
          {submitted ? (
            <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'تم إرسال رسالتك بنجاح' : 'Message Sent Successfully'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isAr
                  ? 'شكراً لتواصلك معنا. نحن نقدر ملاحظاتك وسنقوم بالرد على استفسارك في أقرب وقت ممكن.'
                  : 'Thank you for reaching out. We appreciate your input and will get back to you if a response is required.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
              >
                {isAr ? 'إرسال رسالة أخرى' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'الاسم بالكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'سبب التواصل' : 'Reason for Contact'}
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="support">{isAr ? 'الدعم الفني واستكشاف الأخطاء' : 'Technical Support'}</option>
                  <option value="bug">{isAr ? 'الإبلاغ عن مشكلة في أداة' : 'Report a Tool Bug'}</option>
                  <option value="suggestion">{isAr ? 'اقتراح ميزة أو أداة جديدة' : 'Feature Request / Suggestion'}</option>
                  <option value="general">{isAr ? 'ملاحظات عامة واستفسارات' : 'General Feedback'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الرسالة' : 'Your Message'}
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isAr ? 'اكتب رسالتك أو تفاصيل المشكلة هنا...' : 'Describe your request, including any browser details or tool specifics...'}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/10"
              >
                {isAr ? 'إرسال الرسالة والطلب' : 'Send Secure Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
