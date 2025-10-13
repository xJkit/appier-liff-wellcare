/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '375px',
      // => @media (min-width: 375px) { ... }

      md: '420px',
      // => @media (min-width: 420px) { ... }
    },
    extend: {
      fontFamily: {
        number: ['"Oepn Sans"', 'system-ui'],
        tc: ['"Noto Sans TC"', 'system-ui'],
      },
      boxShadow: {
        'theme-btn': '0px 3px 10px rgba(0, 0, 0, 0.12)',
      },
      colors: {
        // Custom colors below
        theme: {
          DEFAULT: '#0FB85A',
          credit: '#009944', // 生日禮金
          shadow: 'rgba(15, 184, 90, .3)',
        },
        semantic: {
          red: '#FB4078',
        },
        content: {
          low: '#969696',
          med: '#646464',
          high: '#2B2B2B',
          tertiary: '#7E7E7E',
          serial: 'rgb(121, 121, 121, 1)',
          terms_title: 'rgba(47, 47, 47, 1)',
        },
        border: {
          general: '#D0D0D0',
          voucher: '#E0E0E0',
          divider: 'rgba(240, 240, 240, 1)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
