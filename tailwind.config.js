const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7FF', // Lighter, more airy blue
          100: '#E0F0FF',
          200: '#BAE0FF',
          300: '#91CAFF',
          400: '#56A7F5', // Base color (unchanged)
          500: '#2E90FA',
          600: '#1570DA',
          700: '#0F56AF',
          800: '#0B4289',
          900: '#083069',
          950: '#051D42',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          50: '#F8FAFF', // Softer, more subtle blue
          100: '#EEF4FF',
          200: '#E0EAFF',
          300: '#C7D7FE',
          400: '#A4BCFD',
          500: '#8098F9',
          600: '#6172F3',
          700: '#444CE7',
          800: '#3538CD',
          900: '#2D31A6',
          950: '#1C1F60',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          50: '#F5F8FF', // Warmer blue tones
          100: '#EBF0FF',
          200: '#D9E2FF',
          300: '#B9CAFF',
          400: '#8EA4FF',
          500: '#6B7CFF',
          600: '#4B50FF',
          700: '#3A3FF5',
          800: '#2D31D6',
          900: '#1E1FA6',
          950: '#121263',
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          50: '#ECFDF5', // Fresh, natural green
          100: '#D2F9E4',
          200: '#A8F2CE',
          300: '#6FE4B2',
          400: '#36CF8C',
          500: '#12B76A',
          600: '#059454',
          700: '#067647',
          800: '#085D3A',
          900: '#074D31',
          950: '#053321',
        },
        warning: {
          50: '#FFF8ED', // Warmer, less harsh orange
          100: '#FFEAD5',
          200: '#FFDDB3',
          300: '#FFC88A',
          400: '#FFB461',
          500: '#F99A3D',
          600: '#E07D22',
          700: '#BC6012',
          800: '#984A0C',
          900: '#7A3B0B',
          950: '#4A2105',
        },
        error: {
          50: '#FEF3F2', // Softer, less aggressive red
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A',
          950: '#55160C',
        },
        // Keep existing CSS variable based colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      // Rest of configuration remains unchanged
      borderRadius: {
        '4xl': '2rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        display: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        128: '32rem',
        144: '36rem',
      },
      boxShadow: {
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
        'soft-md':
          '0 4px 7px -1px rgba(0, 0, 0, 0.11), 0 2px 4px -1px rgba(0, 0, 0, 0.07)',
        'soft-sm': '0 2px 4px -1px rgba(0, 0, 0, 0.07)',
        'soft-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      transitionDuration: {
        400: '400ms',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
      screens: {
        xs: '475px',
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
