/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif']
      },
      colors: {
        ink: '#070A12',
        panel: '#101624',
        line: '#2B3447',
        orchid: '#833ab4',
        flame: '#fd1d1d',
        amber: '#fcb045'
      },
      boxShadow: {
        glow: '0 0 36px rgba(253, 29, 29, 0.18)'
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        spinSoft: {
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        reveal: 'reveal 420ms ease-out both',
        spinSoft: 'spinSoft 800ms linear infinite'
      }
    }
  },
  plugins: []
};
