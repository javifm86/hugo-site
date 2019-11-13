const imagemin = require('imagemin');

// Lossy Plugins
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGiflossy = require('imagemin-giflossy');
const imageminWebp = require('imagemin-webp');
const imageminSvgo = require('imagemin-svgo');

// Lossyless Plugin
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminGifsicle = require('imagemin-gifsicle');

module.exports.runImagemin = (source, destiny) => {
    return imagemin([source], {
        destination: destiny,
        plugins: [
            imageminMozjpeg({
                progressive: true,
                quality: 90
            }),
            imageminPngquant({
                quality: [0.6, 0.8]
            }),
            imageminGifsicle(),
            imageminSvgo({
                plugins: [{ removeViewBox: false, removeUnknownsAndDefaults: false }]
            })
        ]
    });
};
