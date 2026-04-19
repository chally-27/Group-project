import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        green: {
          deep: '#1a4a2e',
          mid: '#2d7a4f',
          light: '#4caf7d',
          pale: '#e8f5ee',
        },
        gold: {
          DEFAULT: '#c8963e',
          light: '#f5e6cc',
        },
        risk: {
          high: '#c0392b',
          medium: '#e67e22',
          low: '#27ae60',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
