import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: '#d8f3dc',
          100: '#b7e4c7',
          200: '#95d5b2',
          300: '#74c69d',
          400: '#52b788',
          500: '#2d6a4f',
          600: '#1b4332',
          700: '#132a1f',
          800: '#0e2018',
          900: '#0a170f',
        },
        accent: {
          cyan: '#66d9ef',
          gold: '#f6c453',
          rose: '#ff6b6b',
          violet: '#7c6ef6',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(103, 232, 249, 0.15), 0 18px 45px rgba(17, 24, 39, 0.42)',
      },
      backgroundImage: {
        'pitch-gradient': 'radial-gradient(circle at 20% 20%, rgba(34,197,94,0.07), transparent 30%), linear-gradient(180deg, #0a1d13 0%, #0f2d1d 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
