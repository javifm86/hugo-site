const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const { lstatSync, readdirSync } = require('fs');
const { join, normalize } = require('path');

var process = require('process');
process.chdir('../');

const OUTPUT_DIR = 'buildimages/img';
const INPUT_DIR = 'static-src/img';

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
    readdirSync(source)
        .map(name => join(source, name))
        .filter(isDirectory);
const getDirectoriesRecursive = source => [
    source,
    ...getDirectories(source)
        .map(getDirectoriesRecursive)
        .reduce((a, b) => a.concat(b), [])
];

const converToUnixUrl = path => {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }

    return path.replace(/\\/g, '/');
};

try {
    console.log('Beginning image compression...');

    (async () => {
        let imageDirs = getDirectoriesRecursive(INPUT_DIR);

        /**
         * Loop through all subfolders, and recursively run imagemin,
         * outputting to the same subfolders inside OUTPUT_DIR folder
         */

        for (let i in imageDirs) {
            const dir = imageDirs[i];
            let destiny = converToUnixUrl(join(OUTPUT_DIR, dir)).replace(INPUT_DIR, '');
            console.log(dir);
            console.log(normalize(destiny));
            await imagemin([`${converToUnixUrl(dir)}/*.{jpg,png,svg,gif}`], {
                destination: normalize(destiny),
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    }),
                    imageminGifsicle(),
                    imageminSvgo({
                        plugins: [{ removeViewBox: false }]
                    })
                ]
            });
            console.log(`...${(((+i + 1) / imageDirs.length) * 100).toFixed(0)}%`);
        }

        console.log('Finished compressing all images!');
    })();
} catch (e) {
    console.log(e);
}
