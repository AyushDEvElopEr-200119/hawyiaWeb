import { ViewTransition } from "react";

/**
 * A template remounts on every navigation, so its <ViewTransition> enters and exits with
 * each page: the old page recedes, the new one rises in (see "page transitions" in globals.css).
 * The first load has no transition; browsers without View Transitions simply swap pages.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
