import typescriptEslint from "typescript-eslint";

export default [
    {
        ignores: [
            "**/templates/**",   // 忽略所有名为 templates 的文件夹及其内部所有文件
            "**/node_modules/**",
            "**/dist/**",
            "**/*.min.js"
        ]
    },
    {
        files: ["**/*.ts"],
    },
    {
        plugins: {
            "@typescript-eslint": typescriptEslint.plugin,
        },

        languageOptions: {
            parser: typescriptEslint.parser,
            ecmaVersion: 2022,
            sourceType: "module",
        },

        rules: {
            "@typescript-eslint/naming-convention": ["warn", {
                selector: "import",
                format: ["camelCase", "PascalCase"],
            }],

            curly: "warn",
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            semi: "warn",
        },
    }
];