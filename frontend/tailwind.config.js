/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        'bg-black': '#0F172A',
        'bg-gray': '#1F2937',
        'bg-white': '#F3F4F6',
      }
    },
  },
  plugins: [],
}

