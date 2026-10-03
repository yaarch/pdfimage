import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  FileText, 
  Calendar, 
  Info, 
  Lightbulb, 
  AlertTriangle, 
  Search, 
  Wrench,
  Check,
  Share2
} from 'lucide-react';
import { useTranslation } from '../../i18n/context';
import { BLOG_ARTICLES, getArticleBySlug, getRelatedArticles, BlogArticle } from '../../data/blogArticles';

interface BlogPageProps {
  onNavigate: (route: string) => void;
  initialSlug?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, initialSlug }) => {
  const { language } = useTranslation();
  const isAr = language === 'ar';

  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync initialSlug when prop updates
  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  const activeArticle = useMemo(() => {
    if (!selectedSlug) return null;
    return getArticleBySlug(selectedSlug) || null;
  }, [selectedSlug]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    BLOG_ARTICLES.forEach((a) => set.add(a.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((art) => {
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesSearch = 
        searchQuery.trim() === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectArticle = (slug: string) => {
    setSelectedSlug(slug);
    onNavigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToIndex = () => {
    setSelectedSlug(null);
    onNavigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // ==========================================
  // ARTICLE VIEW
  // ==========================================
  if (activeArticle) {
    const related = getRelatedArticles(activeArticle.slug);

    return (
      <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-700 dark:text-slate-300">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
          <button 
            onClick={handleBackToIndex} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition cursor-pointer"
          >
            {isAr ? 'قاعدة المعرفة' : 'Knowledge Base'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {activeArticle.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          <span className="text-slate-400 dark:text-slate-500 truncate max-w-[200px] sm:max-w-md">
            {activeArticle.title}
          </span>
        </nav>

        {/* Article Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              {activeArticle.category}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeArticle.readTime}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeArticle.lastUpdated}</span>
            </span>
          </div>

          <button
            onClick={handleShareLink}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition text-xs cursor-pointer"
            title="Share article URL"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">{isAr ? 'تم نسخ الرابط!' : 'Link Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? 'مشاركة' : 'Share'}</span>
              </>
            )}
          </button>
        </div>

        {/* Article Header */}
        <header className="py-6 space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {activeArticle.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            {activeArticle.introduction}
          </p>
        </header>

        {/* Structured Editorial Sections */}
        <article className="space-y-8 text-sm sm:text-base leading-relaxed">
          {activeArticle.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              {section.heading && (
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-2 border-t border-slate-100 dark:border-slate-850">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-700 dark:text-slate-300">
                  {p}
                </p>
              ))}

              {/* Lists */}
              {section.list && (
                <ul className="list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {section.list.map((item, lIdx) => (
                    <li key={lIdx}>{item}</li>
                  ))}
                </ul>
              )}

              {/* Tables */}
              {section.table && (
                <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <table className="w-full text-left rtl:text-right text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="py-3 px-4 font-bold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-3 px-4 text-slate-700 dark:text-slate-300 align-top">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Callouts */}
              {section.callout && (
                <div className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3 my-4 ${
                  section.callout.type === 'tip'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                    : section.callout.type === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                    : 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300'
                }`}>
                  {section.callout.type === 'tip' && <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />}
                  {section.callout.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
                  {section.callout.type === 'info' && <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />}
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {section.callout.text}
                  </p>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* Genuine FAQ Section */}
        {activeArticle.faqs && activeArticle.faqs.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'الأسئلة الشائعة حول هذا الموضوع' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-3">
              {activeArticle.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contextual PDF Image Studio Tool Links */}
        {activeArticle.relatedToolRoutes && activeArticle.relatedToolRoutes.length > 0 && (
          <div className="mt-10 p-6 rounded-3xl bg-linear-to-br from-indigo-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-950/60 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Wrench className="w-4 h-4" />
              <span>{isAr ? 'أدوات مساعدة ذات صلة' : 'Related Browser Utilities'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeArticle.relatedToolRoutes.map((tool, tIdx) => (
                <div 
                  key={tIdx} 
                  className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-3 hover:border-indigo-400 transition shadow-2xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate(tool.route)}
                    className="self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <span>{isAr ? 'فتح الأداة' : `Open ${tool.name}`}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'مقالات وأدلة ذات صلة' : 'Related Editorial Guides'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => handleSelectArticle(rel.slug)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 flex flex-col justify-between transition cursor-pointer shadow-2xs group"
                >
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block mb-1.5">
                      {rel.category}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>{rel.readTime}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center gap-1">
                      {isAr ? 'قراءة' : 'Read'} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back and Catalog Actions */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handleBackToIndex}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {isAr ? '← العودة لجميع المقالات' : '← Back to Knowledge Base'}
          </button>
          <button
            onClick={() => onNavigate('/all-tools')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            {isAr ? 'استكشاف جميع الأدوات' : 'Explore All Tools'}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // INDEX VIEW
  // ==========================================
  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-slate-700 dark:text-slate-300">
      {/* Knowledge Base Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isAr ? 'الأدلة والمعارف الفنية' : 'Guides & Editorial Insights'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'قاعدة معارف PDF Image Studio' : 'PDF Image Studio Knowledge Base'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'مقالات ودراسات فنية أصلية تتناول أسرار معالجة مستندات الـ PDF، وضغط الصور، وإدارة الميتاداتا، وفهم بيئات المعالجة الحديثة.'
            : 'Original technical guides and practical articles covering document formatting, raster compression mechanics, metadata privacy, and browser runtime execution.'}
        </p>
      </div>

      {/* 1. Search Field Container in normal document flow */}
      <div className="w-full max-w-xl mx-auto mb-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث في المقالات...' : 'Search articles...'}
            className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-2xs"
          />
        </div>
      </div>

      {/* 2. Category / Filter Navigation with clear vertical separation and distinct buttons */}
      <div className="w-full mb-10">
        <div 
          role="navigation"
          aria-label={isAr ? 'تصنيفات المقالات' : 'Article categories'}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer select-none inline-flex items-center justify-center border shadow-2xs ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
              }`}
            >
              {cat === 'All' ? (isAr ? 'جميع الأدلة' : 'All Topics') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            {isAr ? 'لم يتم العثور على مقالات مطابقة' : 'No articles match your search or filter'}
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            {isAr ? 'إعادة ضبط التصفية' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.slug}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleSelectArticle(art.slug)}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {art.readTime}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2 leading-snug">
                  {art.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>{isAr ? 'اقرأ الدليل' : 'Read Article'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
