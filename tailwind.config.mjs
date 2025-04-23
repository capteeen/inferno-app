/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF5E5E",
        secondary: "#121212",
        accent: "#FFB800",
        success: "#00E676",
        warning: "#FFAB00",
        danger: "#FF1744",
        info: "#2979FF",
        background: "#000000",
        surface: "#1A1A1A",
        "surface-raised": "#232323",
        text: "#FFFFFF",
        "text-muted": "#B0B0B0",
        "text-light": "#707070",
        border: "rgba(255,255,255,0.1)",
      },
      boxShadow: {
        glow: '0 0 15px rgba(255, 94, 94, 0.5)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'scale': 'scale 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 94, 94, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 94, 94, 0.8)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents, theme }) {
      // Add custom component classes
      addComponents({
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.card': {
          backgroundColor: theme('colors.surface'),
          borderRadius: theme('borderRadius.xl'),
          border: `1px solid ${theme('colors.border')}`,
          padding: theme('spacing.6'),
        },
        '.card-glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.6'),
        },
        '.btn': {
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 250ms',
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary'),
          color: theme('colors.white'),
          '&:hover': {
            boxShadow: '0 0 15px rgba(255, 94, 94, 0.5)',
          },
        },
        '.btn-outline': {
          border: `1px solid ${theme('colors.primary')}`,
          color: theme('colors.primary'),
          '&:hover': {
            backgroundColor: theme('colors.primary'),
            color: theme('colors.white'),
          },
        },
        '.hover-glow': {
          '&:hover': {
            boxShadow: '0 0 15px rgba(255, 94, 94, 0.5)',
          },
        },
      });

      // Add custom utility classes
      addUtilities({
        '.shadow-glow': {
          boxShadow: '0 0 15px rgba(255, 94, 94, 0.5)',
        },
        '.animate-float': {
          animation: 'float 3s ease-in-out infinite',
        },
        '.stagger-1': {
          animationDelay: '0.1s',
        },
        '.stagger-2': {
          animationDelay: '0.2s',
        },
        '.stagger-3': {
          animationDelay: '0.3s',
        },
        '.stagger-4': {
          animationDelay: '0.4s',
        },
        '.stagger-5': {
          animationDelay: '0.5s',
        },
      });
    },
  ],
  // Add problematic classes to safelist to ensure they're generated
  safelist: [
    'glass',
    'card',
    'card-glass',
    'btn',
    'btn-primary',
    'btn-outline',
    'hover-glow',
    'shadow-glow',
    'animate-float',
    'animate-fade-in',
    'animate-slide-up',
    'animate-slide-down',
    'animate-slide-in-right',
    'animate-slide-in-left',
    'animate-scale',
    'animate-glow-pulse',
    'stagger-1',
    'stagger-2',
    'stagger-3',
    'stagger-4',
    'stagger-5',
  ],
} 