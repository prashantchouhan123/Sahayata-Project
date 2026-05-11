/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f8f4f0',       // Background cream color from images
          blue: '#1e3a8a',     // Header/button blue
          green: '#22c55e',    // Success dot
          yellow: '#f59e0b',   // Processing dot
          pink: '#f87171',     // "Get OTP" red/pinkish color
          border: '#e5e7eb',   // Clean borders
          text: '#1f2937',     // Main text
          darkblue: '#111827', // The dark box on the mic screen
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'large': '1.5rem',     // Rounded corners like image cards
      }
    },
  },
  plugins: [],
}