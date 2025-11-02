# EcoTeen - Energy-Saving Teen App

A mobile-first web application designed to help teenagers track their energy usage, learn about sustainability, and reduce their carbon footprint through gamification and social competition.

## 🌱 About

This project is a Figma-to-website conversion implementing a landing page for the Energy-Saving Teen App. The design source is available in the repository as `Energy-Saving Teen App Prototype.make`.

## 🚀 Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **ESLint** - Code linting

## 📋 Features

- ⚡ Mobile-first responsive design
- 🎨 Modern UI with Tailwind CSS
- 📊 Energy tracking dashboard (coming soon)
- 🏆 Gamification and achievements (coming soon)
- 👥 Social features and competitions (coming soon)
- 📚 Educational content about sustainability

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gang1103app/figmafigmaboi.git
cd figmafigmaboi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## 🚀 Deployment on Render

This project is configured for deployment on [Render](https://render.com) as a Static Site.

### Step-by-Step Deployment Instructions

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up or log in
   - Connect your GitHub account if you haven't already

2. **Create a New Static Site**
   - From your Render Dashboard, click "New +" button
   - Select "Static Site"

3. **Connect Your Repository**
   - Choose "Connect a repository"
   - Find and select `gang1103app/figmafigmaboi`
   - Click "Connect"

4. **Configure Build Settings**
   - **Name**: Choose a name for your site (e.g., `ecoteenapp`)
   - **Branch**: Select `1.0` (or your deployment branch)
   - **Root Directory**: Leave empty (repo root)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

5. **Environment Variables** (Optional)
   - Add any environment variables if needed
   - For this initial version, no environment variables are required

6. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your site
   - You'll get a URL like `https://your-site-name.onrender.com`

### Automatic Deployments

Once configured, Render will automatically deploy your site when:
- You push to the connected branch
- A pull request is merged to the connected branch

### Custom Domain (Optional)

To use a custom domain:
1. Go to your site's Settings in Render
2. Click "Add Custom Domain"
3. Follow the instructions to configure DNS

## 📂 Project Structure

```
figmafigmaboi/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Header.jsx    # Navigation header
│   │   ├── Hero.jsx      # Hero section
│   │   ├── Features.jsx  # Features section
│   │   └── Footer.jsx    # Footer
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles & Tailwind
├── index.html            # HTML template
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.cjs   # Tailwind configuration
├── postcss.config.cjs    # PostCSS configuration
└── README.md            # This file
```

## 🎨 Design Source

The design for this project is based on the Figma prototype:
- **File**: `Energy-Saving Teen App Prototype.make` (in repo root)
- **Repository**: gang1103app/figmafigmaboi
- **Branch**: 1.0

## 🗺️ Roadmap

### Current Phase (v1.0) ✅
- [x] Project scaffolding with Vite + React
- [x] Tailwind CSS integration
- [x] Mobile-first landing page
- [x] Responsive header with navigation
- [x] Hero section with CTA
- [x] Features showcase
- [x] Footer with social links

### Phase 2 (Planned)
- [ ] Backend API integration
- [ ] User authentication (signup/login)
- [ ] User dashboard
- [ ] Energy tracking functionality
- [ ] Data visualization charts

### Phase 3 (Planned)
- [ ] Gamification system
- [ ] Social features (friends, leaderboards)
- [ ] Educational content library
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is an educational project. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is created for educational purposes.

## 👥 Team

- Repository: gang1103app/figmafigmaboi
- Branch: 1.0

---

Made with ❤️ for the planet 🌍
