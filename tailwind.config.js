const postcss = require('postcss');

module.exports = {
    theme: {
        extend: {
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
            }
        }
    },
    variants: {
        backgroundColor: ['responsive', 'hover', 'focus', 'prefers-dark', 'prefers-dark-hover', 'prefers-dark-focus'],
        borderColor: ['responsive', 'hover', 'focus', 'prefers-dark', 'prefers-dark-hover', 'prefers-dark-focus'],
        textColor: ['responsive', 'hover', 'focus', 'prefers-dark', 'prefers-dark-hover', 'prefers-dark-focus'],
        boxShadow: ['responsive', 'hover', 'focus', 'group-hover']
    },
    plugins: [
        function({ addVariant, e }) {
            addVariant('prefers-dark', ({ container, separator }) => {
                const variant = '';
                return getSelector({ container, separator, variant });
            });

            addVariant('prefers-dark-hover', ({ container, separator }) => {
                const variant = 'hover';
                return getSelector({ container, separator, variant });
            });

            addVariant('prefers-dark-focus', ({ container, separator }) => {
                const variant = 'focus';
                return getSelector({ container, separator, variant });
            });

            addVariant('prefers-dark-active', ({ container, separator }) => {
                const variant = 'active';
                return getSelector({ container, separator, variant });
            });

            function getSelector({ container, separator, variant }) {
                const supportsRule = postcss.atRule({ name: 'media', params: '(prefers-color-scheme: dark)' });
                supportsRule.append(container.nodes);
                container.append(supportsRule);
                supportsRule.walkRules(rule => {
                    switch (variant) {
                        case 'focus':
                            rule.selector = `.${e(`prefers-dark:focus${separator}${rule.selector.slice(1)}`)}:focus`;
                            break;
                        case 'hover':
                            rule.selector = `.${e(`prefers-dark:hover${separator}${rule.selector.slice(1)}`)}:hover`;
                            break;
                        case 'active':
                            rule.selector = `.${e(`prefers-dark:active${separator}${rule.selector.slice(1)}`)}:active`;
                            break;
                        default:
                            rule.selector = `.${e(`prefers-dark${separator}${rule.selector.slice(1)}`)}`;
                            break;
                    }
                });
            }
        }
    ]
};
