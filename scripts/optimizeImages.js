const { lstatSync, readdirSync } = require('fs');
const { join, normalize } = require('path');

const { runImagemin } = require('./shared/imagemin');
const { converToSlash } = require('./shared/utils');

// Source and destiny directory for images to be optimized
const DIRS = [
    {
        input: 'static-src/img',
        output: 'static/img'
    },
    {
        input: 'static-src/svg',
        output: 'static/svg'
    }
];

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

console.log('Beginning image compression.');

(async () => {
    let imagesOptimized = 0;

    for (const dir of DIRS) {
        const inputDir = dir.input;
        const outputDir = dir.output;

        const imageDirs = getDirectoriesRecursive(inputDir);

        /**
         * Loop through all subfolders, and recursively run imagemin,
         * outputting to the same subfolders inside outputDir folder.
         */
        for (let i in imageDirs) {
            const dir = imageDirs[i];

            /**
             * imagemin needs paths with forward slashes. converToSlash is needed
             * on Windows environment.
             *
             * Remove inputDir in outputDir for just getting the part of folder wanted.
             * If not replaced, the output would be: static/img/static-src/img/**
             */
            const destiny = converToSlash(join(outputDir, dir)).replace(inputDir, '');
            const source = `${converToSlash(dir)}/*.{jpg,png,svg,gif}`;
            const files = await runImagemin(source, destiny);
            imagesOptimized += files.length;
        }
    }

    console.log(`Image compression finished. Total images compressed: ${imagesOptimized}`);
})();
