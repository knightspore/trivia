/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
  theme: {
      extend: {
          fontFamily: {
              'sans': ['Space Mono', 'sans-serif'],
              'mono': ['Space Mono', 'monospace']
          }
      },
  },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
}

