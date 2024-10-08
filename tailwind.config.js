/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'custom-blue': '#0074FC',
      },
      keyframes: {
        'toast-message-bottom-right': {
          '0%': { transform: 'translate(0, 6rem)', opacity: '1' },
          '10%, 90%': { transform: 'translate(0)', opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'toast-message-bottom-right': 'toast-message-bottom-right 5s linear 1',
      },
    },
  },
  plugins: [],
};
