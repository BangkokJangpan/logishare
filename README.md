# LogiShare - 공유물류 플랫폼

## 프로젝트 소개

LogiShare는 AI 기반 스마트 매칭을 통해 빈 차량과 화물을 효율적으로 연결하는 공유물류 플랫폼입니다.

## 주요 기능

- 🌍 **다국어 지원**: 한국어, 영어, 태국어
- 🚛 **운전자 대시보드**: 실시간 운행 관리, 화물 매칭
- 📦 **화주 대시보드**: 화물 등록, 기사 매칭, 배송 추적
- 👨‍💼 **관리자 대시보드**: 플랫폼 통계, 시스템 관리
- 🎨 **다크모드 UI**: 현대적이고 직관적인 사용자 인터페이스
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험

## 기술 스택

- **Frontend**: React, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS
- **State Management**: React Context API
- **Internationalization**: 커스텀 다국어 시스템

## 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/BangkokJangpan/logishare.git

# 2. 프로젝트 디렉토리 이동
cd logishare

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npm run dev

# 5. 빌드
npm run build
```

## 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── ui/             # shadcn/ui 컴포넌트
│   ├── DriverDashboard.tsx
│   ├── ShipperDashboard.tsx
│   └── LanguageSelector.tsx
├── contexts/           # React Context
│   └── LanguageContext.tsx
├── pages/              # 페이지 컴포넌트
│   ├── Index.tsx
│   ├── DriverPage.tsx
│   ├── ShipperPage.tsx
│   └── AdminPage.tsx
└── lib/                # 유틸리티
    └── utils.ts
```

## 배포

### Vercel (추천)
```bash
npm install -g vercel
npm run build
vercel
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
