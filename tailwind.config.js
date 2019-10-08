const postcss = require('postcss');

module.exports = {
    theme: {
        extend: {}
    },
    variants: {
        backgroundColor: ['responsive', 'hover', 'focus', 'prefers-dark', 'prefers-dark-hover', 'prefers-dark-focus'],
        borderColor: ['responsive', 'hover', 'focus', 'prefers-dark', 'prefers-dark-hover', 'prefers-dark-focus'],
        textColor: ['responsive', 'hover', 'focus', 'prefers-dark', 'prefers-dark-hover', 'prefers-dark-focus']
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
