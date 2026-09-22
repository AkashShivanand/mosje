import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

/** Stands in for next/link: marks what it renders so the spec can see it was used. */
const RouterLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  function RouterLink({ children, ...props }, ref) {
    return (
      <a ref={ref} data-router="" {...props}>
        {children}
      </a>
    );
  },
);
const html = (el: React.ReactElement): string => renderToStaticMarkup(el);

describe("Button linkAs — routes exactly where navLinkRoutes says a nav item would", () => {
  it("an internal href routes through linkAs", () => {
    expect(html(<Button href="/portals" linkAs={RouterLink}>Go</Button>)).toContain("data-router");
  });
  it("without linkAs the link form is a plain anchor, as before", () => {
    expect(html(<Button href="/portals">Go</Button>)).not.toContain("data-router");
  });
  it("external, scheme, # and disabled hrefs never route", () => {
    for (const el of [
      <Button key="e" href="/x" external linkAs={RouterLink}>Go</Button>,
      <Button key="s" href="https://example.gov.in" linkAs={RouterLink}>Go</Button>,
      <Button key="h" href="#" linkAs={RouterLink}>Go</Button>,
      <Button key="d" href="/x" disabled linkAs={RouterLink}>Go</Button>,
    ]) expect(html(el)).not.toContain("data-router");
  });
  it("a download or a new-tab link stays the browser's", () => {
    expect(html(<Button href="/r.pdf" download linkAs={RouterLink}>Go</Button>)).not.toContain("data-router");
    expect(html(<Button href="/x" target="_blank" linkAs={RouterLink}>Go</Button>)).not.toContain("data-router");
  });
  it("with no href it is still a button", () => {
    expect(html(<Button linkAs={RouterLink}>Go</Button>)).toMatch(/^<button/);
  });
});
