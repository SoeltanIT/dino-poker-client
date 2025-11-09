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
      fontFamily: {
        notoSansKR: ['var(--font-noto-sans-kr)']
      },
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
        app: {
          background: {
            primary: 'var(--c-background-primary)',
            secondary: 'var(--c-background-secondary)'
          },
          primary: {
            DEFAULT: 'var(--c-primary)',
            hover: 'var(--c-primary-hover)',
            hover2: 'var(--c-primary-hover2)',
            surface: 'var(--c-primary-surface)',
            light: 'var(--c-primaryLight)'
          },
          primary2: 'var(--c-primary2)',
          secondary: {
            DEFAULT: 'var(--c-secondary)',
            hover: 'var(--c-secondary-hover)',
            main: 'var(--c-secondaryMain)'
          },
          danger: {
            DEFAULT: 'var(--c-danger)',
            medium: 'var(--c-danger-medium)',
            surface: 'var(--c-danger-surface)',
            dark: 'var(--c-danger-dark)'
          },
          success: 'var(--c-success)',
          warning: {
            DEFAULT: 'var(--c-warning)',
            rgb: 'rgba(var(--c-warning-rgb),<alpha-value>)'
          },
          orange: 'var(--c-orange)',
          info: 'var(--c-info)',
          body: 'var(--c-body)',
          placeholder: 'var(--c-placeholder)',
          placeholder2: 'var(--c-placeholder-2)',
          'home-primary-border': 'var(--c-lightGrey)',
          'gradient-site-from': 'var(--gr-site-from)',
          'gradient-site-to': 'var(--gr-site-to)',
          'content-surface': 'var(--bgc-content)',
          dark2: 'var(--c-darkGrey)',
          grey: 'var(--c-grey)',
          neutral100: 'var(--neutral100)',
          neutral200: 'var(--neutral200)',
          neutral300: 'var(--neutral300)',
          neutral400: 'var(--neutral400)',
          neutral500: 'var(--neutral500)',
          neutral600: 'var(--neutral600)',
          neutral700: 'var(--neutral700)',
          neutral800: 'var(--neutral800)',
          neutral900: 'var(--neutral900)',

          primary100: 'var(--c-primary100)',
          primary200: 'var(--c-primary200)',
          primary300: 'var(--c-primary300)',
          primary400: 'var(--c-primary400)',

          borderPrimary: 'var(--c-borderPrimary)',

          grey150: 'var(--c-grey150)',
          skeleton: 'var(--c-skeleton)',
          tertiary: 'var(--c-tertiary)',
          black200: 'var(--c-black200)',
          white100: 'var(--white100)',
          white500: 'var(--white500)',
          red700: 'var(--red700)',
          red400: 'var(--red400)',
          accentOrange: 'var(--c-accentOrange)',
          accentYellow: 'var(--c-accentYellow)',
          accentRed: 'var(--c-accentRed)',
          accentGreen: 'var(--c-accentGreen)',
          pending: 'var(--c-pending)',
          gradientOrange: 'var(--c-gradientSecondary)',
          text: {
            color: 'var(--c-text-color)',
            header: {
              table: 'var(--c-text-header-table)'
            },
            chips: 'var(--c-text-chips)',
            main: 'var(--c-text-main)'
          },
          divider: {
            color: 'var(--c-divider-color)'
          },

          bg: {
            button: {
              DEFAULT: 'var(--c-bg-button)',
              hover: 'var(--c-bg-button-hover)'
            },
            primary: {
              button: 'var(--c-primary-button)'
            },
            progress: {
              bar: 'var(--c-progress-bar)',
              disabled: 'var(--c-progress-disabled)'
            },
            container: {
              progress: 'var(--c-container-progress)'
            },
            chips: 'var(--c-bg-chips)'
          },
          grey12op: 'var(--ds-grey-12op)',
          border: {
            chips: 'var(--c-border-chips)'
          },

          table: {
            text: {
              body: 'var(--table-text-body)',
              header: 'var(--table-text-header)'
            },
            bg: {
              body: 'var(--table-bg-body)',
              header: 'var(--table-bg-header)'
            },
            border: {
              body: 'var(--table-border-body)'
            },
            hover: {
              bg: 'var(--table-hover-bg)'
            }
          }
        }
      },
      backgroundImage: {
        'play-button': 'var(--ds-gradient-play-button)',
        'game-card-overlay': 'var(--ds-gradient-game-card-overlay)'
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
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--c-text-color)',
            '--tw-prose-headings': 'var(--c-text-color)',
            '--tw-prose-lead': 'var(--c-text-color)',
            '--tw-prose-links': 'var(--c-text-color)',
            '--tw-prose-bold': 'var(--c-text-color)',
            '--tw-prose-counters': 'var(--c-text-color)',
            '--tw-prose-bullets': 'var(--c-text-color)',
            '--tw-prose-hr': 'var(--c-text-color)',
            '--tw-prose-quotes': 'var(--c-text-color)',
            '--tw-prose-quote-borders': 'var(--c-text-color)',
            '--tw-prose-captions': 'var(--c-text-color)',
            '--tw-prose-code': 'var(--c-text-color)',
            '--tw-prose-pre-code': 'var(--c-text-color)',
            '--tw-prose-pre-bg': 'var(--c-background-secondary)',
            '--tw-prose-th-borders': 'var(--c-text-color)',
            '--tw-prose-td-borders': 'var(--c-text-color)',
            '--tw-prose-invert-body': 'var(--c-text-color)',
            '--tw-prose-invert-headings': 'var(--c-text-color)',
            '--tw-prose-invert-lead': 'var(--c-text-color)',
            '--tw-prose-invert-links': 'var(--c-text-color)',
            '--tw-prose-invert-bold': 'var(--c-text-color)',
            '--tw-prose-invert-counters': 'var(--c-text-color)',
            '--tw-prose-invert-bullets': 'var(--c-text-color)',
            '--tw-prose-invert-hr': 'var(--c-text-color)',
            '--tw-prose-invert-quotes': 'var(--c-text-color)',
            '--tw-prose-invert-quote-borders': 'var(--c-text-color)',
            '--tw-prose-invert-captions': 'var(--c-text-color)',
            '--tw-prose-invert-code': 'var(--c-text-color)',
            '--tw-prose-invert-pre-code': 'var(--c-text-color)',
            '--tw-prose-invert-pre-bg': 'var(--c-background-secondary)',
            '--tw-prose-invert-th-borders': 'var(--c-text-color)',
            '--tw-prose-invert-td-borders': 'var(--c-text-color)'
          }
        }
      })
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
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ]
}
export default config
