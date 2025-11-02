# EcoTeen - Energy-Saving Teen App

A modern, mobile-first landing page for an energy-saving teen app. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

- 📱 Mobile-first responsive design
- ⚡ Lightning-fast performance with Vite
- 🎨 Beautiful UI with Tailwind CSS
- ♿ Accessible semantic HTML
- 🔥 Interactive components with React

## 🛠️ Tech Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.10
- **Styling:** Tailwind CSS 3.4.14
- **Package Manager:** npm

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/gang1103app/figmafigmaboi.git
cd figmafigmaboi
```

2. Install dependencies:
```bash
npm install
```

## 💻 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Create a production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 👀 Preview

Preview the production build locally:

```bash
npm run preview
```

## 🌐 Deployment to Render

### Step-by-Step Instructions

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up or log in

2. **Connect GitHub Repository**
   - From the Render dashboard, click "New +"
   - Select "Static Site"
   - Connect your GitHub account if not already connected
   - Search for and select the `gang1103app/figmafigmaboi` repository

3. **Configure Build Settings**
   - **Name:** Choose a name for your site (e.g., `ecotteen-app`)
   - **Branch:** Select `1.0` (or `main` after merge)
   - **Root Directory:** Leave empty (repo root)
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables** (Optional)
   - If you need any environment variables, add them in the "Environment" section
   - For this static site, no environment variables are required initially

5. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your site
   - You'll get a URL like `https://your-app-name.onrender.com`

### Automatic Deployments

- Render automatically deploys your site when you push to the connected branch
- After merging PR #1 (this PR) to main, Render will auto-deploy on every push to main
- You can also trigger manual deploys from the Render dashboard

### Custom Domain (Optional)

1. Go to your site's settings in Render
2. Navigate to "Custom Domains"
3. Add your domain and follow the DNS configuration instructions

## 📁 Project Structure

```
figmafigmaboi/
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Navigation header with mobile menu
│   │   ├── Hero.jsx          # Hero section with CTA
│   │   ├── Features.jsx      # Features showcase
│   │   └── Footer.jsx        # Footer with links and social
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles with Tailwind
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.cjs       # Tailwind configuration
├── postcss.config.cjs        # PostCSS configuration
└── package.json              # Dependencies and scripts
```

## 🎨 Design Source

This implementation is based on the Figma prototype:
- **File:** `Energy-Saving Teen App Prototype.make` (located in repo root)
- **Repository:** gang1103app/figmafigmaboi
- **Branch:** 1.0

## 🔜 Next Steps

- [ ] Add authentication system
- [ ] Implement backend API
- [ ] Add user dashboard
- [ ] Integrate energy tracking features
- [ ] Add social challenge system
- [ ] Implement rewards mechanism

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.