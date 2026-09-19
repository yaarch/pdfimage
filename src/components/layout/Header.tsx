import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Globe,
  Sun,
  Moon,
  Laptop,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  FileText,
  Layers,
  Scissors,
  Minimize2,
  Lock,
  RotateCw,
  Stamp,
  Hash,
  FileCheck2,
  ShieldAlert,
  Image,
  Palette,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../i18n/context';
import { useTheme } from '../../hooks/useTheme';
import { LanguageCode, ThemeMode } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { extractLanguageAndPath, formatLocalizedRoute } from '../../i18n/urlUtils';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
}) => {
  const { t, language, setLanguage, dir } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [convertMenuOpen, setConvertMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [imageMenuOpen, setImageMenuOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const convertMenuRef = useRef<HTMLDivElement>(null);
  const imageMenuRef = useRef<HTMLDivElement>(null);

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ar', label: 'العربية', flag: 'عربي' },
    { code: 'es', label: 'Español', flag: 'ES' },
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'de', label: 'Deutsch', flag: 'DE' },
  ];

  const handleNavClick = (pureRoute: string) => {
    const targetRoute = formatLocalizedRoute(pureRoute, language, language !== 'en');
    onNavigate(targetRoute);
    setMobileMenuOpen(false);
    setConvertMenuOpen(false);
    setMegaMenuOpen(false);
    setImageMenuOpen(false);
  };

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    setLangMenuOpen(false);
    const { purePath } = extractLanguageAndPath(currentRoute);
    const targetRoute = formatLocalizedRoute(purePath, newLang, newLang !== 'en');
    onNavigate(targetRoute);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
      if (convertMenuRef.current && !convertMenuRef.current.contains(event.target as Node)) {
        setConvertMenuOpen(false);
      }
      if (imageMenuRef.current && !imageMenuRef.current.contains(event.target as Node)) {
        setImageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Primary Navigation */}
        <div className="flex items-center gap-6">
          {/* Brand Logo - PDF Image Studio */}
          <button
            id="nav-logo"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 group focus:outline-none rounded-xl p-1 -m-1"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/15 group-hover:scale-105 transition-transform relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-indigo-600/30 to-sky-500/30 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-0.5">
                <FileText className="w-5 h-5 text-rose-500 stroke-[2.5]" />
                <Image className="w-4 h-4 text-sky-400 stroke-[2.5] -ml-2.5 mt-1" />
              </div>
            </div>
            <div className="flex flex-col text-left rtl:text-right">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  PDF Image
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-rose-500 to-sky-500 text-white shadow-xs uppercase tracking-wide">
                  STUDIO
                </span>
              </div>
              <span className="text-[9px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase mt-0.5">
                Private Browser Tools
              </span>
            </div>
          </button>

          {/* Desktop Nav Links - Requested Categories & Actions */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wide">
            {/* 1. Find a tool... */}
            <button
              onClick={onOpenSearch}
              className="px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.findTool}</span>
            </button>

            {/* 2. All Tools */}
            <button
              onClick={() => handleNavClick('/all-tools')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentRoute === '/all-tools' && !currentRoute.includes('cat=')
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.allTools}
            </button>

            {/* 3. PDF Tools */}
            <button
              onClick={() => handleNavClick('/all-tools?cat=pdf')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentRoute.includes('cat=pdf')
                  ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.pdfTools}
            </button>

            {/* 4. Image Tools */}
            <button
              onClick={() => handleNavClick('/all-tools?cat=image')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentRoute.includes('cat=image')
                  ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.imageTools}
            </button>

            {/* 5. Organize */}
            <button
              onClick={() => handleNavClick('/all-tools?cat=organize')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentRoute.includes('cat=organize')
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.organize}
            </button>

            {/* 6. Optimize */}
            <button
              onClick={() => handleNavClick('/all-tools?cat=compress')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentRoute.includes('cat=compress')
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.optimize}
            </button>

            {/* 7. Convert */}
            <button
              onClick={() => handleNavClick('/all-tools?cat=convert')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentRoute.includes('cat=convert')
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.convert}
            </button>

            {/* 8. Sec */}
            <button
              onClick={() => handleNavClick('/all-tools?cat=security')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentRoute.includes('cat=security')
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.security}
            </button>
          </nav>
        </div>

        {/* Right Actions (Search, Language, Theme, Mobile Toggle) */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            id="btn-quick-search"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl transition shadow-2xs"
            title="Search all tools (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span className="hidden sm:inline">{t.searchTools}</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-language-menu"
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setThemeMenuOpen(false);
              }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
              title={t.language}
            >
              <Globe className="w-4 h-4" />
            </button>

            {langMenuOpen && (
              <div
                className={`absolute ${
                  dir === 'rtl' ? 'left-0' : 'right-0'
                } mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95`}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                      language === l.code
                        ? 'font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/40'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-theme-menu"
              onClick={() => {
                setThemeMenuOpen(!themeMenuOpen);
                setLangMenuOpen(false);
              }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
              title={t.theme}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Laptop className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {themeMenuOpen && (
              <div
                className={`absolute ${
                  dir === 'rtl' ? 'left-0' : 'right-0'
                } mt-2 w-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95`}
              >
                {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setTheme(mode);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                      theme === mode
                        ? 'font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/40'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {mode === 'light' && <Sun className="w-3.5 h-3.5" />}
                    {mode === 'dark' && <Moon className="w-3.5 h-3.5" />}
                    {mode === 'system' && <Laptop className="w-3.5 h-3.5" />}
                    <span className="capitalize">{mode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('/merge-pdf')}
            className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-red-500" />
            <span>Merge PDF</span>
          </button>
          <button
            onClick={() => handleNavClick('/split-pdf')}
            className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Scissors className="w-4 h-4 text-orange-500" />
            <span>Split PDF</span>
          </button>
          <button
            onClick={() => handleNavClick('/compress-pdf')}
            className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Minimize2 className="w-4 h-4 text-emerald-500" />
            <span>Compress PDF</span>
          </button>
           <button
            onClick={() => handleNavClick('/all-tools')}
            className="w-full text-left px-3 py-2 rounded-xl font-bold text-red-600 bg-red-50 dark:bg-red-950/50 flex items-center justify-between"
          >
            <span>{t.allToolsCategories}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={() => handleNavClick('/about')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.about}
          </button>
          <button
            onClick={() => handleNavClick('/privacy')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.privacy}
          </button>
          <button
            onClick={() => handleNavClick('/blog')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.blog}
          </button>
          <button
            onClick={() => handleNavClick('/terms')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.terms}
          </button>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> {t.clientSidePrivacy}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

