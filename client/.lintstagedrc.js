module.exports = {
    "src/**/*.{ts,tsx,js,jsx}": [
        "eslint --quiet --color",
    ],

    "*.less": [
        "stylelint --syntax less --fix",
        "prettier --write",
    ],
};
