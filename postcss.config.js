const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./content/**/*.md', './layouts/**/*.html'],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        purgecss
        // purgecss, require('cssnano')
        // ...(process.env.NODE_ENV === 'production' ? [purgecss, require('cssnano')] : [])
    ]
};
