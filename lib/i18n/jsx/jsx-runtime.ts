// JSX runtime for the whole site (jsxImportSource in tsconfig.json). On a translated page it swaps
// text and internal links as elements are created, so pages stay written in plain English.
// On English pages, and in the browser, it does nothing. Client components can't translate,
// so they receive translated text as props.
import { Fragment, jsx as reactJsx, jsxs as reactJsxs } from "react/jsx-runtime";
import { localizeProps } from "../core";

export { Fragment };
export type { JSX } from "react/jsx-runtime";

export const jsx: typeof reactJsx = (type, props, key) => reactJsx(type, localizeProps(type, props), key);
export const jsxs: typeof reactJsxs = (type, props, key) => reactJsxs(type, localizeProps(type, props), key);
