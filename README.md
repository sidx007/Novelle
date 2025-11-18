# Novelle 📚

A cozy, nostalgic web app for book lovers — discover beautiful quotes, build your reading library, and immerse yourself in literature.

## ✨ Features

- **Curated Quote Feed** - Tumblr-inspired infinite-scroll grid of literary quotes
- **Personal Library** - Organize and browse your book collection
- **EPUB Reader** - Read books with customizable settings (font size, themes)
- **Theme Switching** - Light, Sepia, and Night modes for comfortable reading
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Responsive Design** - Beautiful on all devices

## 🎨 Design

Novelle features a warm, nostalgic aesthetic inspired by:
- Tumblr's cozy content discovery
- Notion's clean, organized layouts
- A vintage reading nook atmosphere

### Color Themes

- **Light** - Warm, paper-like backgrounds
- **Sepia** - Vintage book feel
- **Night** - Cozy evening reading mode

### Typography

- **Headings** - Playfair Display
- **Body** - Literata
- **UI Elements** - Inter
- **Accents** - Dancing Script

## 🛠️ Tech Stack

- **React** (with Vite)
- **TailwindCSS** - Utility-first styling
- **DaisyUI** - Component library
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons
- **epub.js** - EPUB reader functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd novelle
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📁 Project Structure

```
novelle/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── QuoteFeed.jsx
│   │   ├── QuoteCard.jsx
│   │   ├── Reader.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Library.jsx
│   │   └── ReaderPage.jsx
│   ├── styles/
│   │   ├── theme.css      # Theme variables & color schemes
│   │   └── globals.css    # Global styles & utilities
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Customizing Themes

All theme colors and typography are centralized in `src/styles/theme.css`. You can easily create new themes or modify existing ones:

```css
:root[data-theme="your-theme"] {
  --color-bg-primary: #your-color;
  --color-text-primary: #your-color;
  /* ... more variables */
}
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Real EPUB file support
- [ ] Social features (sharing quotes)
- [ ] Reading progress tracking
- [ ] Advanced search and filters
- [ ] Book recommendations
- [ ] Reading statistics

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 💖 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for book lovers everywhere
