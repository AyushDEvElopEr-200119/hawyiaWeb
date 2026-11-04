// Development build of ./jsx-runtime.ts.
import { Fragment, jsxDEV as reactJsxDEV } from "react/jsx-dev-runtime";
import { localizeProps } from "../core";

export { Fragment };
export type { JSX } from "react/jsx-dev-runtime";

export const jsxDEV: typeof reactJsxDEV = (type, props, ...rest) => reactJsxDEV(type, localizeProps(type, props), ...rest);
