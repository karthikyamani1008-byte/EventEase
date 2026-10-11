/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF7",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#8174D8",
          hover: "#6F61C9",
          light: "#F1EEFF",
          dark: "#584BA3",
        },
        accent: {
          blue: "#EAF2FF",
          blueDark: "#3B69B8",
        },
        main: "#24243A",
        muted: "#73758A",
        subtle: "#E9E7F2",
        status: {
          success: "#10B981",
          successLight: "#ECFDF5",
          warning: "#F59E0B",
          warningLight: "#FFFBEB",
          danger: "#EF4444",
          dangerLight: "#FEF2F2",
          info: "#3B82F6",
          infoLight: "#EFF6FF",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(36, 36, 58, 0.04), 0 1px 4px -1px rgba(36, 36, 58, 0.02)',
        'soft': '0 6px 20px -4px rgba(36, 36, 58, 0.06), 0 2px 6px -2px rgba(36, 36, 58, 0.03)',
        'soft-lg': '0 12px 32px -6px rgba(36, 36, 58, 0.08), 0 4px 12px -3px rgba(36, 36, 58, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
