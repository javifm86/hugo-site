// https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
const colors = require('tailwindcss/colors');
module.exports = {
    darkMode: 'media',
    purge: {
        content: ['./content/**/*.md', './layouts/**/*.html', './static/**/*.js', './static/**/*.svg', 'config.toml'],
        options: {
            safelist: ['chroma', /chroma$/],
            defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
        }
    },
    theme: {
        extend: {
            colors: {
                gray: colors.blueGray
            },
            spacing: {
                '1/2': '50%',
                '1/3': '33.333333%',
                '2/3': '66.666667%',
                '1/4': '25%',
                '2/4': '50%',
                '3/4': '75%',
                '1/5': '20%',
                '2/5': '40%',
                '3/5': '60%',
                '4/5': '80%',
                '1/6': '16.666667%',
                '2/6': '33.333333%',
                '3/6': '50%',
                '4/6': '66.666667%',
                '5/6': '83.333333%',
                '1/12': '8.333333%',
                '2/12': '16.666667%',
                '3/12': '25%',
                '4/12': '33.333333%',
                '5/12': '41.666667%',
                '6/12': '50%',
                '7/12': '58.333333%',
                '8/12': '66.666667%',
                '9/12': '75%',
                '10/12': '83.333333%',
                '11/12': '91.666667%'
            },
            gridTemplateColumns: {
                'auto-fit-min-290': 'repeat(auto-fit, minmax(290px, 1fr))'
            }
        }
    },
    variants: {
        extend: {
            borderStyle: ['dark']
        }
    },
    plugins: []
};
