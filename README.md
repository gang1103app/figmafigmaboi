# Energy-Saving Teen App

A modern, mobile-first landing page for an energy-saving app designed for teens. Built with React, Vite, and Tailwind CSS.

## Design Source

This project is based on the Figma design file: `Energy-Saving Teen App Prototype.make` (located in the repository root).

## Features

- ⚡ Modern React + Vite setup for fast development
- 🎨 Tailwind CSS for responsive, mobile-first design
- 📱 Fully responsive layout (mobile, tablet, desktop)
- ♿ Accessible semantic HTML
- 🚀 Optimized production build

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Navigation header with mobile menu
│   │   ├── Hero.jsx        # Hero section with CTA
│   │   ├── Features.jsx    # Features grid
│   │   └── Footer.jsx      # Footer with newsletter signup
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles + Tailwind
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.cjs     # Tailwind configuration
└── postcss.config.cjs      # PostCSS configuration
```

## Deploying to Render

This project is configured for easy deployment to [Render](https://render.com) as a static site.

### Step-by-Step Deployment Instructions

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up or log in
   - Connect your GitHub account if you haven't already

2. **Create a New Static Site**
   - Click "New +" in the Render dashboard
   - Select "Static Site"

3. **Connect Your Repository**
   - Select the `gang1103app/figmafigmaboi` repository
   - Grant Render access to the repository if prompted

4. **Configure Build Settings**
   - **Name**: Choose a name for your site (e.g., "energy-saving-teen-app")
   - **Branch**: `1.0` (or `main` after merging)
   - **Root Directory**: Leave blank (or use `.` for repo root)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

5. **Environment Variables** (Optional)
   - No environment variables are required for this static site
   - Add any future API keys or configuration here as needed

6. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your site
   - You'll receive a URL like `https://your-site-name.onrender.com`

### Automatic Deployments

Once configured, Render will automatically deploy:
- Every time you push to the configured branch (e.g., `1.0`)
- When a pull request is merged into the configured branch

### Custom Domain (Optional)

To use a custom domain:
1. Go to your site's "Settings" in Render
2. Scroll to "Custom Domain"
3. Add your domain and follow the DNS configuration instructions

## Technology Stack

- **React 18.3** - UI library
- **Vite 6.0** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic CSS vendor prefixing

## Future Enhancements

- Backend API integration
- User authentication and profiles
- Real-time energy tracking dashboard
- Social features and leaderboards
- Mobile app (React Native)

## License

This project is private and proprietary.

## Repository

- **Owner**: gang1103app
- **Repo**: figmafigmaboi
- **Branch**: 1.0