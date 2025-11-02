/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette based on Energy-Saving Teen App Prototype.make
        // Primary green represents energy/eco-friendly theme
        primary: {
          DEFAULT: '#10B981', // Emerald green for main CTAs and branding
          dark: '#059669',    // Darker shade for hover states
        },
        // Secondary blue for complementary UI elements
        secondary: {
          DEFAULT: '#3B82F6', // Bright blue for secondary actions
          dark: '#2563EB',    // Darker shade for hover states
        },
      },
    },
  },
  plugins: [],
}
