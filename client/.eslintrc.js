module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
    },
    globals: {
        Feature: true,
        Scenario: true,
        Before: true,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    // read FAQ: https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-telling-me-the-file-must-be-included-in-at-least-one-of-the-projects-provided
    extends: [
        'eslint:recommended', // included into airbnb-typescript
        'plugin:react/recommended', // included into airbnb-typescript
        'plugin:import/recommended',
        'plugin:jest/recommended',
        'airbnb-base',
        'prettier',
    ],
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
        'import/extensions': [".js", ".jsx", ".ts", ".tsx"],
        'import/parsers': {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        'import/resolver': {
            typescript: {},
        },
    },
    
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            arrowFunctions: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-hooks', 'jest', '@typescript-eslint', 'import', 'prettier'],
    rules: {
        indent: [
            2,
            4,
            {
                SwitchCase: 1,
            },
        ],
        'max-len': [1, 170],
        'object-curly-spacing': 0,
        quotes: 0,
        'comma-dangle': ['error', 'always-multiline'],
        'object-curly-newline': 0,
        'import/prefer-default-export': 0,
        "no-plusplus": 0,
        "no-return-assign": 0,
        "spaced-comment": 0,
        "no-unused-vars": 1,
        "valid-jsdoc": 0,
        // 'no-use-before-define': 0,
        // '@typescript-eslint/no-use-before-define': ["error"],
        "import/extensions": 0,
        "react/prop-types": 0,
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/no-unused-expressions': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
            },
            parserOptions: {
                project: ['./tsconfig.json'], // Specify it only for TypeScript files
                tsconfigRootDir: './',
                ecmaFeatures: {
                    jsx: true,
                    arrowFunctions: true,
                },
                ecmaVersion: 12,
                sourceType: 'module',
            },
            extends: [
                'plugin:import/recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:jest/recommended',
                'airbnb-typescript',
                'prettier',
            ],
        },
    ],
};
