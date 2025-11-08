# QR Studio 🍏

> Premium QR Code Generator & Scanner — Day 5 of #100Days100Projects

A beautiful, fast, and feature-rich QR code generator built with Next.js 14, featuring an Apple-inspired design. Generate QR codes for URLs, WiFi networks, vCards, SMS, emails, and more. Fully optimized for performance, SEO, and PWA support.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?style=for-the-badge&logo=tailwind-css)
![PWA](https://img.shields.io/badge/PWA-Enabled-4285F4?style=for-the-badge&logo=pwa)

## ✨ Features

### 🎨 QR Code Generation
- **Multiple Content Types**
  - Plain text
  - URLs (with automatic protocol detection)
  - Phone numbers (tel: links)
  - Email addresses (mailto: links)
  - SMS messages (with optional body)
  - WiFi networks (WPA/WEP/nopass)
  - vCard contacts (full contact information)

- **Advanced Customization**
  - Custom size (100px - 2000px)
  - Adjustable margin
  - Error correction levels (L, M, Q, H)
  - Custom foreground and background colors
  - Hex color picker with presets
  - Quick theme presets (Classic, Apple Blue, Dark Mode, etc.)
  - QR code version selection (1-40 or Auto)
  - Multiple output formats (PNG, SVG, JPEG)

- **User Experience**
  - Live preview
  - One-click download
  - Copy QR code to clipboard
  - Manual generation (button-based)
  - Organized advanced options with clear hierarchy

### 📱 Progressive Web App (PWA)
- ✅ Fully installable on mobile and desktop
- ✅ Offline support with service worker
- ✅ App shortcuts for quick actions
- ✅ Standalone display mode
- ✅ Custom app icons for all platforms
- ✅ Theme color integration

### 🚀 Performance
- ⚡ **100/100 PageSpeed Score**
- ⚡ Optimized font loading with `display: swap`
- ⚡ Image optimization (AVIF/WebP support)
- ⚡ Code splitting and lazy loading
- ⚡ SWC minification
- ⚡ CSS optimization
- ⚡ Aggressive caching for static assets
- ⚡ Compressed responses

### 🔍 SEO Optimized
- ✅ Comprehensive meta tags
- ✅ Open Graph and Twitter Card support
- ✅ Structured data (JSON-LD)
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Semantic HTML
- ✅ Dynamic OpenGraph image generation

### 🎯 Design
- Apple-inspired UI/UX
- Dark mode support
- Smooth animations with Framer Motion
- Responsive design (mobile-first)
- Accessible (ARIA labels, keyboard navigation)
- Polished color pickers and controls

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **QR Generation:** [qrcode](https://www.npmjs.com/package/qrcode)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/qr-studio.git
   cd qr-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add:
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variable `NEXT_PUBLIC_SITE_URL`
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests with Vitest

## 🎨 Customization

### Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --bg-light: #F5F5F7;
  --text-light: #1C1C1E;
  --accent-light: #007AFF;
  /* ... */
}
```

### QR Code Options

Default options can be modified in `components/GeneratorCard.tsx`:

```typescript
const [options, setOptions] = useState<QRGeneratorOptions>({
  size: 256,
  margin: 4,
  errorCorrectionLevel: 'M',
  // ...
})
```

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the website
2. Click the install icon in the address bar
3. Click "Install"

### Mobile (iOS)
1. Open the website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Mobile (Android)
1. Open the website in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install App"

## 🔒 Security

The app includes several security headers:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy for camera/microphone/geolocation

## 📊 Performance Metrics

- **Lighthouse Score:** 100/100
- **First Contentful Paint:** < 1s
- **Largest Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2s
- **Cumulative Layout Shift:** 0

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is part of the #100Days100Projects challenge. Feel free to use this code for learning purposes.

## 👤 Author

**Yash Sharma**

- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yashsharma](https://twitter.com/yashsharma)
- Project: [#100Days100Projects](https://github.com/yourusername/100Days100Projects)

## 🙏 Acknowledgments

- Built with ❤️ using Next.js
- Inspired by Apple's design language
- Icons by [Lucide](https://lucide.dev/)
- QR Code generation by [qrcode](https://www.npmjs.com/package/qrcode)

## 📈 Roadmap

- [ ] QR code batch generation
- [ ] QR code history with cloud sync
- [ ] Custom logo overlay
- [ ] QR code analytics
- [ ] API for programmatic generation

---

**Made with ❤️ by Yash Sharma — Day 5 of #100Days100Projects 🍏**
