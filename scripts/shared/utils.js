// Colors for console.log messages
module.exports.COLORS = {
    yellow: '\x1b[33m%s\x1b[0m'
};

/**
 * Convert Windows backslash paths to slash paths.
 * @param {string} path
 */
module.exports.converToSlash = path => {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path);

    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }

    return path.replace(/\\/g, '/');
};
