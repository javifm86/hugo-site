const { lstatSync, readdirSync } = require('fs');
const { join, normalize } = require('path');

const { runImagemin } = require('./shared/imagemin');
const { converToSlash, COLORS } = require('./shared/utils');

// Source directory for images to be optimized
const INPUT_DIR = 'static-src/img';

// Destiny for compressed images
const OUTPUT_DIR = 'static/img';

/**
 * Return true if source is a directory.
 * @param {string} source Directory.
 */
const isDirectory = source => lstatSync(source).isDirectory();

/**
 * Get directories for a given directory.
 * @param {string} source Directory.
 */
const getDirectories = source =>
    readdirSync(source)
        .map(name => join(source, name))
        .filter(isDirectory);

/**
 * Recursive function that get list of all directories and subdirectories for
 * a given directory.
 * @param {string} source Root directory.
 */
const getDirectoriesRecursive = source => [
    normalize(source),
    ...getDirectories(source)
        .map(getDirectoriesRecursive)
        .reduce((a, b) => a.concat(b), [])
];

console.log(COLORS.yellow, 'Beginning image compression.');

(async () => {
    const imageDirs = getDirectoriesRecursive(INPUT_DIR);
    let imagesOptimized = 0;

    /**
     * Loop through all subfolders, and recursively run imagemin,
     * outputting to the same subfolders inside OUTPUT_DIR folder.
     */
    for (let i in imageDirs) {
        const dir = imageDirs[i];

        /**
         * imagemin needs paths with forward slashes. converToSlash is needed
         * on Windows environment.
         *
         * Remove INPUT_DIR in OUTPUT_DIR for just getting the part of folder wanted.
         * If not replaced, the output would be: static/img/static-src/img/**
         */
        const destiny = converToSlash(join(OUTPUT_DIR, dir)).replace(INPUT_DIR, '');
        const source = `${converToSlash(dir)}/*.{jpg,png,svg,gif}`;

        const files = await runImagemin(source, destiny);
        console.log(files);
        imagesOptimized += files.length;
    }

    console.log(COLORS.yellow, `Image compression finished. Total images compressed: ${imagesOptimized}`);
})();
