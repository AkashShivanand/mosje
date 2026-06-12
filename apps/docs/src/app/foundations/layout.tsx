import * as React from "react";

// The visual chrome (sidebar, header, TOC) is provided by DocsLayout in the
// root layout. This sub-layout simply scopes the /foundations segment and
// passes children through untouched.
export default function FoundationsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
