import type { Config } from 'tailwindcss'

import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        // app config
        'app-background-primary': 'var(--c-background-primary)',
        'app-background-secondary': 'var(--c-background-secondary)',
        'app-primary': 'var(--c-primary)',
        'app-primary-hover': 'var(--c-primary-hover)',
        'app-primary2': 'var(--c-primary2)',
        'app-primary-hover2': 'var(--c-primary-hover2)',
        'app-primary-surface': 'var(--c-primary-surface)',
        'app-primary-light': 'var(--c-primaryLight)',
        'app-secondary': 'var(--c-secondary)',
        'app-secondary-hover': 'var(--c-secondary-hover)',
        'app-danger': 'var(--c-danger)',
        'app-danger-medium': 'var(--c-orange)',
        'app-danger-surface': 'var(--c-danger-surface)',
        'app-danger-dark': 'var(--c-danger-dark)',
        'app-success': 'var(--c-success)',
        'app-warning': 'var(--c-warning)',
        'app-orange': 'var(--c-orange)',
        'app-info': 'var(--c-info)',
        'app-warning-rgb': 'rgba(var(--c-warning-rgb),<alpha-value>)',
        'app-body': 'var(--c-body)',
        'app-placeholder': 'var(--c-placeholder)',
        'app-placeholder2': 'var(--c-placeholder-2)',
        'app-home-primary-border': 'var(--c-lightGrey)',
        'app-gradient-site-from': 'var(--gr-site-from)',
        'app-gradient-site-to': 'var(--gr-site-to)',
        'app-content-surface': 'var(--bgc-content)',
        'app-dark2': 'var(--c-darkGrey)',
        'app-grey': 'var(--c-grey)',
        'app-neutral100': 'var(--neutral100)',
        'app-neutral200': 'var(--neutral200)',
        'app-neutral300': 'var(--neutral300)',
        'app-neutral400': 'var(--neutral400)',
        'app-neutral500': 'var(--neutral500)',
        'app-neutral600': 'var(--neutral600)',
        'app-neutral700': 'var(--neutral700)',
        'app-neutral800': 'var(--neutral800)',
        'app-neutral900': 'var(--neutral900)',
        'app-secondary-main': 'var(--c-secondaryMain)',
        'app-grey150': 'var(--c-grey150)',
        'app-skeleton': 'var(--c-skeleton)',
        'app-tertiary': 'var(--c-tertiary)',
        'app-black200': 'var(--c-black200)',
        'app-white100': 'var(--white100)',
        'app-white500': 'var(--white500)',
        'app-red700': 'var(--red700)',
        'app-red400': 'var(--red400)',
        'app-accentOrange': 'var(--c-accentOrange)',
        'app-accentYellow': 'var(--c-accentYellow)',
        'app-accentRed': 'var(--c-accentRed)',
        'app-accentGreen': 'var(--c-accentGreen)',
        'app-pending': 'var(--c-pending)',
        'app-gradientOrange': 'var(--c-gradientSecondary)',
        'app-text-color': 'var(--c-text-color)',
        'app-text-header-table': 'var(--c-text-header-table)',
        'app-divider-color': 'var(--c-divider-color)',
        'app-bg-button': 'var(--c-bg-button)',
        'app-bg-button-hover': 'var(--c-bg-button-hover)',
        'app-bg-primary-button': 'var(--c-primary-button)',
        'app-bg-progress-bar': 'var(--c-progress-bar)',
        'app-bg-container-progress': 'var(--c-container-progress)',
        'app-bg-progress-disabled': 'var(--c-progress-disabled)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      screens: {
        '2xs': '390px',
        xs: '420px',
        xxl: '1440px',
        '3xl': '2000px'
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }: any) => {
      addUtilities(
        {
          '.scrollbar-hide': {
            /* IE and Edge */
            '-ms-overflow-style': 'none',

            /* Firefox */
            'scrollbar-width': 'none',

            /* Safari and Chrome */
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },

          '.scrollbar-default': {
            /* IE and Edge */
            '-ms-overflow-style': 'auto',

            /* Firefox */
            'scrollbar-width': 'auto',

            /* Safari and Chrome */
            '&::-webkit-scrollbar': {
              display: 'block'
            }
          }
        },
        ['responsive']
      )
    }),
    require('tailwindcss-animate')
  ]
}
export default config
