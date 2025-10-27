# Flow Local Website

A premium, mobile-first website showcasing Flow Local's AI communication service for local businesses.

## 🎨 Features

- **Animated Logo Intro** - SVG path drawing animation with glow effect
- **Depth Scroll Effect** - Zoom-through experience using GSAP ScrollTrigger
- **Persistent Demo CTAs** - Always-accessible demo panel (side on desktop, bottom on mobile)
- **Mobile-First Design** - Touch-optimized, fully responsive
- **Smooth Animations** - Premium feel using anime.js and GSAP
- **Clean Aesthetic** - Minimal design with generous whitespace, inspired by shepherd.js

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the site.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🛠 Tech Stack

- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - Lightweight, no framework overhead
- **Tailwind CSS** - Utility-first styling
- **anime.js** - Logo and micro-animations
- **GSAP + ScrollTrigger** - Depth scroll effect
- **PostCSS + Autoprefixer** - CSS processing

## 📁 Project Structure

```
/
├── index.html              # Main HTML file
├── src/
│   ├── main.js            # JavaScript entry point
│   └── style.css          # Tailwind + custom styles
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## 🎯 Key Interactions

### Intro Sequence (3-5 seconds)
1. Logo draws itself using stroke animation
2. Glow/pulse effect on completion
3. Logo scales down and fades
4. Header slides in

### Depth Scroll Effect
- Each section zooms through layers as you scroll
- Smooth physics-based transitions
- Optimized for mobile touch
- Powered by GSAP ScrollTrigger

### Demo Panel
- **Desktop**: Slides in from right side
- **Mobile**: Slides in from bottom
- Toggle button to show/hide
- Four demo options: WhatsApp, Messenger, Instagram, Voice

## 🎨 Customization

### Colors
Edit `src/style.css` and `tailwind.config.js` to change the accent color (currently indigo `#6366f1`).

### Logo
Replace the SVG path in `index.html`:
- Intro logo: `#intro-logo` → `#logo-path`
- Header logo: `#header-logo`

Current placeholder is a simple rounded shape. Provide your actual logo SVG.

### Content
Edit text in `index.html` sections:
- `.section-hero` - Main headline
- `.section-cost` - Statistics and pain points
- `.section-solution` - Feature grid
- `.section-demo` - Final CTA and testimonial

### Demo Links
Update `href` attributes on demo buttons to point to actual WhatsApp, Messenger, Instagram, and voice call links.

Example WhatsApp link:
```html
<a href="https://wa.me/1234567890?text=Hi%20Flow%20Local" class="demo-button">
```

## 📱 Mobile Optimizations

- Touch-optimized scroll
- Demo panel position adapts (side → bottom)
- Responsive typography with `clamp()`
- Grid layouts collapse on mobile
- Performance optimizations for smooth 60fps

## ⚡ Performance

- Code splitting for animation libraries
- Lazy loading support for images
- Respects `prefers-reduced-motion`
- Optimized scroll listeners with `requestAnimationFrame`
- Terser minification in production

## 🎭 Animation Timeline

```
0s    → Logo starts drawing
2s    → Logo drawing complete
2-3s  → Glow/pulse effect
3s    → Logo scales down
3.5s  → Fade to main content
4s    → Header visible + Demo panel slides in
4s+   → Depth scroll effects active
```

## 🐛 Known Issues / TODO

- [ ] Replace placeholder logo SVG with actual Flow Local logo
- [ ] Connect demo buttons to real messaging platform links
- [ ] Add Google Analytics or tracking (if needed)
- [ ] Add favicon
- [ ] Consider adding a simple footer
- [ ] Add loading states for demo buttons

## 📄 License

Proprietary - Flow Local

## 🤝 Support

For questions or issues, contact the Flow Local team.
