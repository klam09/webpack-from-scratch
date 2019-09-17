module.exports = function babelConfig(api) {
    api.cache(true);

    const presets = [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '2.6.9',
                // "debug": true
            },
        ],
    ];
    const babelrcRoots = [
        '.',
        'node_module/swiper',
        'node_module/dom7',
        'node_module/ssr-window',
    ];

    return {
        presets,
        babelrcRoots,
    };
};
