const { runImagemin } = require('./shared/imagemin');
const { converToSlash } = require('./shared/utils');

const watch = require('node-watch');
const { join, parse, normalize } = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

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

const processImage = async (dir, inputDir, outputDir) => {
    console.log(`Beginning image compression for ${dir}`);
    /**
     * imagemin needs paths with forward slashes. converToSlash is needed
     * on Windows environment.
     *
     * Remove INPUT_DIR in OUTPUT_DIR for just getting the part of folder wanted.
     * If not replaced, the output would be: static/img/static-src/img/**
     */
    const destiny = converToSlash(join(outputDir, dir)).replace(inputDir, '');
    const source = `${converToSlash(dir)}/*.{jpg,png,svg,gif}`;

    const files = await runImagemin(source, destiny);
    console.log(`Image compression finished`);
};

const deleteImage = (imgPath, inputDir, outputDir) => {
    const urlDestiny = converToSlash(join(outputDir, imgPath)).replace(inputDir, '');
    const url = normalize(urlDestiny);
    let isDirectory;

    try {
        isDirectory = fs.lstatSync(url).isDirectory();
    } catch {
        isDirectory = false;
    }

    if (isDirectory) {
        rimraf(url, () => {
            console.log(`Deleted ${url}`);
        });
    } else {
        fs.unlink(url, err => {
            if (err && err.code === 'ENOENT') {
                // File doens't exist
                console.log(`File not found: ${url}`);
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.log(`Error occurred while trying to remove file: ${url}`);
            } else {
                console.log(`File deleted: ${imgPath}`);
            }
        });
    }
};

DIRS.forEach(dir => {
    console.log(`Watching for image files to be optimized on ${dir.input} folder`);
    watch(dir.input, { recursive: true }, (evt, name) => {
        if (evt === 'update') {
            processImage(parse(name).dir, dir.input, dir.output);
        }
        // remove
        else {
            deleteImage(name, dir.input, dir.output);
        }
    });
});
