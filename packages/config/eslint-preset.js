const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*/infrastructure/*"],
              message: "Only infrastructure/ may import infrastructure/ internals of another module.",
            },
          ],
        },
      ],
    },
  },
  {
    // *.module.ts is the composition root: it's the one place allowed to
    // wire a feature's own infrastructure into its DI container.
    files: ["**/*.module.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  prettier,
];
