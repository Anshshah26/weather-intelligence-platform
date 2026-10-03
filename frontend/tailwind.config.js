/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        meteor: {
          bg: '#101820',
          surface: '#18232D',
          surface2: '#24313C',
          surfaceHover: '#2A3A47',
          border: '#2B3945',
          borderLight: '#3A4A57',
          primary: '#2F80ED',
          secondary: '#56CCF2',
          success: '#27AE9B',
          warning: '#F2C94C',
          caution: '#F2994A',
          danger: '#EB5757',
          text: '#F4F7F9',
          muted: '#9AA8B2',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#2F80ED',
          600: '#1c6fdc',
          900: '#101820',
        }
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 8px 24px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}
