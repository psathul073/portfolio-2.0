# Athul's Portfolio 2.0 🚀

A modern, high-performance portfolio website built with Next.js 16+, featuring stunning 3D animations, smooth interactions, excellent performance scores, and an AI-powered personal assistant.

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Live-success) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue) ![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-purple)
![AI Assistant](https://img.shields.io/badge/AI-Powered-orange)

## ✨ Features

- 🎨 **Modern Design** - Clean, professional interface.
- ⚡ **Blazing Fast** - 95+ Lighthouse performance score
- 📱 **Fully Responsive** - Optimized for all devices
- 🎭 **3D Animations** - Smooth WebGL animations and transitions
- 🚀 **Next.js 16+** - Latest App Router and React Server Components
- 🧠 **AI Personal Assistant** - Interactive AI helper to learn about my skills and projects
- 💫 **Smooth Animations** - Framer Motion powered interactions
- 🎯 **SEO Optimized** - Perfect meta tags and Open Graph support
- 📧 **Contact Form** - Functional contact with form validation

## 🧠 AI Personal Assistant
**The portfolio includes an intelligent AI assistant that helps visitors:**
- Learn about my background and skills
- Get my project details
- Understand my technical expertise
- Get answers to common questions about me

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js & React Three Fiber
- **Fonts**: Geist Sans & Fira Code

### Performance & SEO
- **Image Optimization**: Next.js Image component
- **SEO**: Next.js Metadata API
- **Performance**: Optimized bundle splitting
- **Accessibility**: WCAG compliant

## 🚀 Performance Metrics

| Metric | Score |
|--------|-------|
| **Lighthouse Performance** | 95+ |
| **First Contentful Paint** | 0.2s |
| **Largest Contentful Paint** | 1.5s |
| **Cumulative Layout Shift** | 0 |
| **Speed Index** | 0.4s |

## 📦 Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── api/               # API Routes
│   ├── projects/          # Projects showcase
│   ├── contact/           # Contact form
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components (Navbar, Cards, etc.)
│   ├── sections/         # Page sections
│   └── animations/       # Animation components
├── public/               # Static assets
│   ├── models/           # 3D models
│   ├── images/           # Project images
│   └── og-image.jpg      # Social media preview
├── lib/                  # Utility functions
└── types/                # TypeScript definitions
```

## 🎯 Key Components

### `ProjectCard`
- Animated project cards
- Technology stack badges
- Live demo and repository links
- Optimized image loading

### `Navbar`
- Responsive navigation

### `3D Avatar`
- Interactive WebGL avatar
- Performance-optimized animations
- Responsive 3D model loading

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/psathul073/portfolio-2.0.git
   cd portfolio-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Adding New Projects
Edit the projects data file and add your project details:

```typescript
{
  id: 1,
  title: "Project Name",
  description: "Project description",
  usedTec: ["React", "Next.js", "TypeScript"],
  picture: "/images/project.jpg",
  liveURL: "https://demo.com",
  demoURL: "https://github.com/user/repo"
}
```

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors in `globals.css`
- Customize animations in component files

### 3D Models
- Add GLB/GLTF models to `/public/models/`
- Import and use with React Three Fiber components

## 📱 Responsive Design

| Breakpoint | Device | Features |
|------------|--------|----------|
| < 768px | Mobile | Stacked layout, optimized animations |
| 768px - 1024px | Tablet | 2-column grid, reduced animations |
| > 1024px | Desktop | Full layout, all animations enabled |

## 🔧 Performance Optimizations

- **Image Optimization**: WebP format, lazy loading
- **Code Splitting**: Dynamic imports for heavy components
- **Animation Optimization**: Reduced motion on mobile
- **Bundle Optimization**: Tree shaking and minification
- **Font Optimization**: Subset fonts and preloading

## 🌐 SEO & Social Media

- **Open Graph** tags for social sharing
- **Structured Data** for search engines
- **Sitemap** generation
- **Robots.txt** configuration

## 📧 Contact Integration

The contact form includes:
- Form validation with error handling
- Email service integration
- Success/error states
- Spam protection

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag dist folder to Netlify
```

### Other Platforms
The portfolio is optimized for deployment on:
- Vercel
- Netlify
- AWS Amplify
- Railway
- Digital Ocean App Platform

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome! Please feel free to fork the project and submit pull requests.

## 📞 Contact

- **Portfolio**: [https://portfolio-2-0-five-zeta.vercel.app](https://portfolio-2-0-five-zeta.vercel.app)
- **Email**: psathul073@gmail.com
- **LinkedIn**: [Athul](https://www.linkedin.com/in/athul-fullstack)
- **GitHub**: [@athul](https://github.com/psathul073)


---

**Built with ❤️ using Next.js and modern web technologies**

---


⭐ **Star this repo if you found it helpful!**
