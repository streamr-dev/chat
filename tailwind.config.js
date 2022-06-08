module.exports = {
    content: [],
    theme: {
        extend: {
            animation: {
                float: 'float 3s ease-in-out infinite',
            },
            fontFamily: {
                karelia: ['Karelia', 'sans-serif'],
                plex: ['IBM Plex Sans', 'sans-serif'],
            },
            fontSize: {
                h1: ['5rem', { lineHeight: 'normal', letterSpacing: '0' }],
                plug: ['0.75rem', { lineHeight: 'normal', letterSpacing: '0' }],
            },
            colors: {
                debug: 'rgba(255, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
