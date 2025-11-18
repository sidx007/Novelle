# 🚀 Quick Start Guide - Novelle

## Your App is Running! 

**Local URL:** http://localhost:5173/

---

## 🎨 First Things to Try

### 1. **Test the Theme Toggle**
- Click the icon in the top-right navbar (sun → coffee → moon)
- Watch the entire app smoothly transition between:
  - ☀️ Light (warm paper tones)
  - ☕ Sepia (vintage book feel)
  - 🌙 Night (cozy dark mode)

### 2. **Explore the Pages**
- **Home** (`/`) - Hero section + quote feed
- **Library** (`/library`) - Browse book collection
- **Reader** (`/reader`) - Click any book to read

### 3. **Test Interactions**
- Hover over quote cards (they lift up!)
- Try the search bar in Library
- Adjust font size in the Reader
- Use the page navigation slider

---

## 📝 How to Customize

### Change Theme Colors
Edit `src/styles/theme.css`:
```css
:root[data-theme="light"] {
  --color-bg-primary: #faf8f5;  /* Change this! */
  --color-accent-primary: #c9a57b;  /* And this! */
}
```

### Add Mock Data
1. **Quotes**: `src/components/QuoteFeed.jsx` (line 13)
2. **Books**: `src/pages/Library.jsx` (line 5)

Just add more objects to these arrays!

### Create a New Page
1. Create file in `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/your-page" element={<YourPage />} />
   ```
3. Add link in `src/components/Navbar.jsx`

### Create a New Component
- Copy template from `COMPONENT_TEMPLATE.jsx`
- Follow the design system comments
- Use CSS variables for colors
- Add Framer Motion for animations

---

## 🛠️ Common Tasks

### Install More Dependencies
```bash
cd /Users/kristy/se/novelle
npm install package-name
```

### Build for Production
```bash
npm run build
```
Output will be in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

---

## 🎯 Design System Rules

1. **Never hardcode colors** - use `var(--color-name)`
2. **Use font classes**:
   - `font-playfair` for headings
   - `font-literata` for body text
   - `font-inter` for UI elements
   - `font-dancing` for script accents

3. **Utility classes**:
   - `.glass` - glassy card effect
   - `.card-hover` - hover animations
   - `.btn-primary` / `.btn-secondary` - buttons

4. **Motion patterns**:
   - `whileHover={{ y: -4 }}` - lift effect
   - `whileTap={{ scale: 0.95 }}` - press effect

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Dependencies Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### CSS Not Loading
Make sure `src/App.jsx` imports:
```jsx
import './styles/theme.css';
import './styles/globals.css';
```

---

## 📚 Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/icons/
- **React Router**: https://reactrouter.com/
- **DaisyUI**: https://daisyui.com/

---

## ✨ What's Next?

### Immediate Enhancements
1. Add your own book data and images
2. Customize color themes to your preference
3. Add more pages (About, Contact, etc.)
4. Integrate with a book API

### Advanced Features
1. User authentication (Firebase/Supabase)
2. Database for user libraries
3. Real EPUB file uploads
4. Social sharing features
5. Reading progress tracking

---

**Enjoy building Novelle! 📚✨**

*Need help? Check PROJECT_SUMMARY.md for detailed documentation.*
