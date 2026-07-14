/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#7096AF',
          yellow: '#F1C543',
          pink: '#CC2B7A',
          blue: '#9AD0EE',
        },
        background: '#EEEEEE',
      },
    },
  },
  plugins: [],
};
