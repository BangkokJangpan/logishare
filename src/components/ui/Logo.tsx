import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

// SVG 아이콘 인라인 (이미지 참고)
const TruckLogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="10" fill="#2242A4" />
    <path d="M8 21V11.5C8 10.1193 9.11929 9 10.5 9H17.5C18.8807 9 20 10.1193 20 11.5V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 15H24L25.5 17.5V21H20V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="11.5" cy="22.5" r="1.5" fill="white"/>
    <circle cx="22.5" cy="22.5" r="1.5" fill="white"/>
  </svg>
);

const Logo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2 select-none" aria-label={t('common.logo')}>
      <span className="inline-block">
        <TruckLogoIcon />
      </span>
      <span className="text-2xl font-bold text-white drop-shadow-sm hidden sm:inline" style={{letterSpacing: '0.01em'}}>
        LogiShare
      </span>
    </div>
  );
};

export default Logo; 