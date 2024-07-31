/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)'],
                mono: ['var(--font-geist-mono)']
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                standard: {
                    DEFAULT: '#242424',
                },
                loadStart: {
                    DEFAULT: '#CCCCCC'
                },
                loadNext: {
                    DEFAULT: '#CCCCCC'
                },
                loadMiddle: {
                    DEFAULT: '#666666'
                },
                loadEnd: {
                    DEFAULT: '#333333'
                },
                concern: {
                    DEFAULT: '#FF7878',
                    background: "#FFEFEF"
                },
                objections: {
                    DEFAULT: '#FFCC2F',
                    background: "#FFF9E6"
                },
                howTo: {
                    DEFAULT: '#8BDDE4',
                    background: "#F2FEFF"
                },

            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: {height: 0},
                    to: {height: 'var(--radix-accordion-content-height)'}
                },
                'accordion-up': {
                    from: {height: 'var(--radix-accordion-content-height)'},
                    to: {height: 0}
                },
                'slide-from-left': {
                    '0%': {
                        transform: 'translateX(-100%)'
                    },
                    '100%': {
                        transform: 'translateX(0)'
                    }
                },
                'slide-to-left': {
                    '0%': {
                        transform: 'translateX(0)'
                    },
                    '100%': {
                        transform: 'translateX(-100%)'
                    }
                },
                pulse: {
                    '0%, 100%': {opacity: 1},
                    '50%': {opacity: 0.5},
                },
                shiftRight: {
                    '0%': {transform: 'translateX(-100%)'},
                    '20%, 80%': {transform: 'translateX(0%)'},
                    '100%': {transform: 'translateX(100%)'},
                },
            },
            animation: {
                'slide-from-left':
                    'slide-from-left 0.3s cubic-bezier(0.82, 0.085, 0.395, 0.895)',
                'slide-to-left':
                    'slide-to-left 0.25s cubic-bezier(0.82, 0.085, 0.395, 0.895)',
                'accordion-down': 'accordion-down 0.5s ease-out',
                'accordion-up': 'accordion-up 0.5s ease-out',
                'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shift-right': 'shiftRight 5s linear infinite',


            }
        }
    },
    plugins: [
        require('tailwindcss-animate'),
        require('@tailwindcss/typography'),
        require("tailwindcss-animate"),
        require('tailwindcss-text-border')
    ]
}
