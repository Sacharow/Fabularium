/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom browns/fantasy colors
                'background': '#221D10',
                'light-background': '#2A2314',
                'gold': '#F4C753',
            }
        },
    },
    plugins: [],
}