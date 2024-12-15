import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  {
    env: {
      browser: true,
      es6: true,
      jest: true,
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2018,
      sourceType: "module",
      project: "./tsconfig.eslint.json",
    },
  },
  ...compat.extends(
    "airbnb-typescript",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
    "next/typescript"
  ),
  {
    plugins: {
      react: require("eslint-plugin-react"),
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      jest: require("eslint-plugin-jest"),
      import: require("eslint-plugin-import"),
    },
    parser: "@typescript-eslint/parser",
    rules: {
      "import/extensions": "off",
    },
  },
];

export default eslintConfig;