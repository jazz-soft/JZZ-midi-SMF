import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        ignores: ["**/.instrumented/*"]
    },
    {
        files: ["javascript/*.js", "test/*.js"],
        languageOptions: {
            ecmaVersion: 2015,
            globals: {
                ...globals.browser,
                ...globals.node,
                define: "readonly",
                JZZ: "readonly"
            }
        },
        rules: {
            "no-prototype-builtins": "off",
            "no-unused-vars": ["error", { caughtErrors: "none"}]
        }
    },
    {
        files: ["test/*.js"],
        languageOptions: {
            globals: {
                describe: "readonly",
                it: "readonly",
                before: "readonly",
                after: "readonly"
            }
        }
    }
];