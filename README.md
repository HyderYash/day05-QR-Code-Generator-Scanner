# QR Studio 🍏

A beautiful, premium QR code generator and scanner built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS. Features an Apple-inspired design with smooth animations and a polished user experience. Part of the #100Days100Projects challenge.

![QR Studio](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 QR Code Generator
- **Multiple Content Types**: Generate QR codes from text, URLs, phone numbers, emails, vCards, WiFi credentials, and SMS
- **Customization Options**:
  - Adjustable size (100-1000px)
  - Custom margins
  - Color customization (foreground & background)
  - High-quality output
- **Export Options**:
  - Download as PNG (high-resolution)
  - Download as SVG (vector format)
  - Copy QR code image to clipboard
- **Smart Features**:
  - Auto-detection of content type
  - Live preview with real-time updates
  - Save to history for quick access
  - Regenerate from history

### 📷 QR Code Scanner
- **Real-time Camera Scanning**: Use your device camera to scan QR codes instantly
- **Image Upload Fallback**: Upload images containing QR codes if camera is unavailable
- **Smart Content Detection**: Automatically identifies content type (URL, phone, email, etc.)
- **Quick Actions**:
  - Open URLs directly
  - Call phone numbers
  - Send emails
  - Copy content to clipboard
- **Permission Handling**: Graceful camera permission requests with clear user guidance
- **History Tracking**: Save all scanned QR codes to history

### 📊 History & Statistics
- **Persistent Storage**: All data stored locally in browser (LocalStorage)
- **Statistics Dashboard**:
  - Total QR codes generated
  - Total QR codes scanned
  - Most common content type
- **History Management**:
  - View all generated and scanned QR codes
  - Quick actions: regenerate, copy, delete
  - Clear entire history with confirmation
  - Timestamp tracking

### 🎨 Design & UX
- **Apple-Inspired Design**: Clean, minimal interface with premium aesthetics
- **Dark Mode**: Beautiful dark theme with smooth transitions
- **Animations**: Subtle Framer Motion animations throughout
- **Responsive**: Fully optimized for mobile, tablet, and desktop
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support
- **Glassmorphism**: Modern glassmorphic effects on cards and surfaces

### 🔒 Privacy & Security
- **100% Client-Side**: All processing happens in your browser
- **No Network Calls**: Zero data transmission to external servers
- **LocalStorage Only**: All data stays on your device
- **No Tracking**: No analytics, no cookies, no tracking scripts
- **HTTPS Ready**: Secure camera access support

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! 🎉

## 📜 Available Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start development server on port 3000 |
| `npm run build`   | Create optimized production build     |
| `npm run start`   | Start production server               |
| `npm run lint`    | Run ESLint to check code quality      |
| `npm run format`  | Format code with Prettier             |
| `npm run test`    | Run tests with Vitest                 |
| `npm run test:ui` | Run tests with Vitest UI              |

## 📱 Camera Permissions

### Desktop Browsers

**Chrome/Edge:**
- Click "Allow" when the browser prompts for camera access
- If blocked, click the camera icon in the address bar and allow

**Firefox:**
- Click "Allow" in the permission prompt
- Or go to Preferences > Privacy & Security > Permissions > Camera

**Safari:**
- Go to Safari > Settings > Websites > Camera
- Find your site and set to "Allow"

### Mobile Devices

**iOS (Safari):**
- Settings > Safari > Camera > Allow
- Or allow when prompted in Safari

**Android (Chrome):**
- Chrome > Settings > Site Settings > Camera > Allow
- Or allow when prompted

### Troubleshooting

- **Camera not working?** Use the image upload option instead
- **Permission denied?** Check browser settings and allow camera access
- **HTTPS required:** Camera access requires HTTPS in production (localhost works for development)
- **No camera found?** The app will automatically show the upload option

## 🏗️ Project Structure

```
qr-studio/
├── app/
│   ├── generator/          # Generator page route
│   │   └── page.tsx
│   ├── scanner/           # Scanner page route
│   │   └── page.tsx
│   ├── globals.css        # Global styles & theme
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/
│   ├── GeneratorCard.tsx  # QR generator component
│   ├── ScannerCard.tsx    # QR scanner component
│   ├── HistoryPanel.tsx   # History display component
│   ├── StatsCard.tsx      # Statistics component
│   └── ThemeToggle.tsx    # Dark/light theme toggle
├── lib/
│   ├── __tests__/         # Unit tests
│   │   └── qr.test.ts
│   ├── types.ts           # TypeScript type definitions
│   ├── qr.ts              # QR code utilities (generate/parse)
│   ├── useLocalStorage.ts # LocalStorage hooks
│   └── useCameraScanner.ts # Camera scanner hook
├── public/                # Static assets
├── types/                 # Type declarations
│   └── jsqr.d.ts
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions CI
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🛠️ Tech Stack

### Core
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### QR Code
- **qrcode** - QR code generation
- **html5-qrcode** - Camera-based QR scanning
- **jsqr** - Image-based QR code decoding

### Utilities
- **react-toastify** - Toast notifications
- **Vitest** - Testing framework

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js
4. Deploy with one click!

**Vercel automatically:**
- Detects Next.js framework
- Sets up build and start commands
- Configures environment variables
- Provides HTTPS (required for camera)

### Other Platforms

The app can be deployed to any platform supporting Next.js:

- **Netlify** - Similar to Vercel, great Next.js support
- **AWS Amplify** - AWS hosting solution
- **Railway** - Simple deployment platform
- **Render** - Modern cloud platform

**Build Configuration:**
- Build Command: `npm run build`
- Start Command: `npm run start`
- Node Version: 18.x or higher

## 🎯 Usage Examples

### Generate a QR Code

1. Enter your content (text, URL, phone, email, etc.)
2. Choose content type (auto-detected)
3. Customize appearance (optional)
4. Download as PNG/SVG or copy to clipboard

### Scan a QR Code

1. Click "Start Camera Scanner"
2. Allow camera permissions
3. Point camera at QR code
4. Content is automatically detected and displayed
5. Use quick action buttons (Open, Call, Email, Copy)

### Upload QR Code Image

1. Click "Choose Image"
2. Select an image file containing a QR code
3. QR code is decoded automatically
4. View and interact with the content

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

## 📝 Code Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **GitHub Actions** - Automated CI/CD

Format code:

```bash
npm run format
```

Lint code:

```bash
npm run lint
```

## 🌐 Browser Support

| Browser        | Version | Status            |
| -------------- | ------- | ----------------- |
| Chrome         | Latest  | ✅ Fully supported |
| Edge           | Latest  | ✅ Fully supported |
| Firefox        | Latest  | ✅ Fully supported |
| Safari         | Latest  | ✅ Fully supported |
| iOS Safari     | Latest  | ✅ Fully supported |
| Chrome Android | Latest  | ✅ Fully supported |

## 🤝 Contributing

This is a personal project for #100Days100Projects, but:

- **Suggestions** are welcome!
- **Bug reports** are appreciated
- **Feedback** helps improve the project

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own projects.

## 👤 Author

**Yash Sharma** 🍏

- Part of the #100Days100Projects challenge
- Built with ❤️ using Next.js and TypeScript

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Framer Motion** for smooth animations
- **html5-qrcode** for robust QR scanning
- **qrcode** library for QR generation

---

<div align="center">

**Made with ❤️ by Yash Sharma**

🍏 #100Days100Projects

[⭐ Star this repo](https://github.com/yourusername/qr-studio) | [🐛 Report Bug](https://github.com/yourusername/qr-studio/issues) | [💡 Request Feature](https://github.com/yourusername/qr-studio/issues)

</div>
