module.exports = {
    "env": {
        "node": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        'airbnb-base',
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "max-len": 0,
        "import/no-cycle": 0,
        "linebreak-style": 0,
        "class-methods-use-this": 0,
        "import/no-import-module-exports": 0,
        "no-console": "off",
        "semi": [2, "always"]
    },
}
