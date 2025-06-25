/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', 
        'bg-black': '#0B1120', 
        'bg-gray': '#1F2937',
        'bg-white': '#F3F4F6',
        'text-gray': '#A3A8B0', 
        'blue-light': '#162032', // darker than previous #1E293B
      }
    },
  },
  plugins: [],
}

