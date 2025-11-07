# QR Studio - Project Structure

## File Tree

```
qr-studio/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI workflow
├── app/
│   ├── generator/
│   │   └── page.tsx               # Generator page route
│   ├── scanner/
│   │   └── page.tsx                # Scanner page route
│   ├── globals.css                 # Global styles with Apple theme
│   ├── layout.tsx                  # Root layout with ToastContainer
│   └── page.tsx                    # Home page with all components
├── components/
│   ├── GeneratorCard.tsx           # QR code generator component
│   ├── ScannerCard.tsx             # QR code scanner component
│   ├── HistoryPanel.tsx            # History display component
│   ├── StatsCard.tsx               # Statistics display component
│   └── ThemeToggle.tsx             # Dark/light theme toggle
├── lib/
│   ├── __tests__/
│   │   └── qr.test.ts              # Unit tests for QR utilities
│   ├── types.ts                    # TypeScript type definitions
│   ├── qr.ts                       # QR code generation/parsing utilities
│   ├── useCameraScanner.ts         # Camera scanner hook
│   └── useLocalStorage.ts          # LocalStorage persistence hooks
├── public/                         # Static assets (placeholder logo can be added)
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── .prettierrc                     # Prettier configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── README.md                       # Project documentation
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── vitest.config.ts               # Vitest test configuration
```

## Key Features Implemented

### ✅ QR Code Generator
- Multiple content types (text, URL, phone, email, vCard, WiFi, SMS)
- Customizable size, margin, error correction, colors
- PNG and SVG download
- Copy to clipboard
- Save to history

### ✅ QR Code Scanner
- Real-time camera scanning
- Image upload fallback
- Permission handling
- Content type detection
- Quick action buttons

### ✅ History & Statistics
- Persistent LocalStorage
- Statistics dashboard
- Quick actions (regenerate, copy, delete)
- Clear history with confirmation

### ✅ UI/UX
- Apple-inspired design
- Light/dark theme toggle
- Framer Motion animations
- Fully responsive
- Accessible (ARIA labels, keyboard support)

### ✅ Developer Experience
- TypeScript throughout
- ESLint + Prettier
- Vitest test setup
- GitHub Actions CI
- Comprehensive README

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development server
3. Open http://localhost:3000 in your browser
4. Test QR generation and scanning features

## Notes

- All data is stored in LocalStorage (no backend required)
- Camera requires HTTPS in production
- Logo overlay feature is implemented but requires a logo image in `/public`
- Geolocation is opt-in and stored locally only

