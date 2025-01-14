/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            maxHeight: {
                'table-custom-height': 'calc(100vh - 100px)',
                'layout-content-height': 'calc(100vh - 70px)',
            },
            colors: {
                textBlack: '#1E1E1E',
                textDanger: '#ED1B24',
            },

            boxShadow: {
                'btn-shadow': '0px 1px 2px rgba(16, 24, 40, 0.05)',
                'sidebar': '0px 0px 48px rgba(25, 39, 89, 0.06)',
            }
        },
    },
    plugins: [],
}

