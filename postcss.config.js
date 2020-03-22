const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./content/**/*.md', './layouts/**/*.html', './static/**/*.js'],
    whitelist: ['chroma'],
    whitelistPatternsChildren: [/chroma$/],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

module.exports = {
    plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
        ...(process.env.NODE_ENV === 'production' ? [purgecss, require('cssnano')] : [])
    ]
};
