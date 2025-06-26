
import React, { useState } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Menu, X } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'th' as Language, name: 'ไทย', flag: '🇹🇭' }
  ];

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-logistics-primary focus:ring-opacity-50"
        aria-label="언어 선택"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-300" />
        )}
        <span className="text-xl">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium text-gray-300 hidden sm:block">
          {currentLanguage?.name}
        </span>
      </button>

      {/* 언어 선택 메뉴 */}
      {isOpen && (
        <>
          {/* 오버레이 */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 메뉴 */}
          <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 min-w-[160px] overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3 ${
                  language === lang.code ? 'bg-logistics-primary/20 text-logistics-primary' : 'text-gray-300'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-logistics-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
