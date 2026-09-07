import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Auth Screen — Design System",
  description:
    "Credentials, before there is a session. An alias of Portal Login Template under the name the decision table uses.",
};

/**
 * One row, and it is the only one that is this module's to make.
 *
 * The criteria a sign-in screen must meet belong to `PortalLoginTemplate` and
 * are listed, with their evidence, on its own page. Restating them here would
 * be a second copy of a compliance claim with nothing behind it — and the two
 * copies would drift. What IS true here, and checkable, is that this export
 * adds nothing that could break them.
 */
const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "This export introduces no markup, so it can neither add nor weaken an accessible name, role or value. Everything a reader meets is Portal Login Template's, and is documented there.",
    status: "verified",
    evidence:
      "components/templates/auth-screen.ts is a re-export statement — no JSX, no wrapper element, no props of its own. AuthScreen and PortalLoginTemplate are the same function.",
  },
];

export default function AuthScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Auth Screen"
      status="Beta"
      summary="Credentials, before there is a session. This is Portal Login Template under the name the decision table uses — an alias, not a wrapper: no second component, no extra render layer, no props of its own."
      figma={{ node: "screenTemplates" }}
      specimen={
        <Callout type="info" title="The specimen lives on the Portal Login Template page">
          There is nothing to render here that is not rendered there. This page exists so that a
          reader following the decision table from &ldquo;credentials, before there is a
          session&rdquo; lands somewhere rather than on a name the barrel does not export.
        </Callout>
      }
      propsFrom="PortalLoginTemplateProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Any portal sign-in, for any role.",
          "A portal picker, where one login serves several organisations.",
        ],
        avoid: [
          "Anything after a session exists — that is Portal Page and one of the other seventeen templates.",
          "A standalone credential card inside another page — that is Auth Form Card.",
        ],
      }}
      related={[
        {
          label: "Portal Login Template",
          href: "/design-system/components/auth/portal-login-template",
          reason: "the component this names",
        },
        {
          label: "Portal Page",
          href: "/design-system/components/templates/portal-page",
          reason: "the chrome for everything after sign-in",
        },
        {
          label: "Auth Form Card",
          href: "/design-system/components/auth/auth-form-card",
          reason: "the credential card on its own",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-alias">
          <h2 id="cdp-alias" className="cdp__h2">Why an Alias Rather Than Nothing</h2>
          <p>
            The catalogue promises eighteen templates named for the data they show. A reader
            looking up &ldquo;credentials, before there is a session&rdquo; should find the thing
            that table names in the barrel. An entry that says &ldquo;actually, import something
            else&rdquo; is how a closed set stops being one.
          </p>
          <p>
            It is a re-export, so <code>AuthScreen</code> and <code>PortalLoginTemplate</code> are
            the same function. Either name works; the template name is the one the decision table
            hands you.
          </p>
          <Callout type="info" title="This is the one archetype the handoff got right">
            Eighteen drawn screens, one geometry, four real library organisms instanced 58 times
            rather than redrawn. It was the only part of the file that needed no correction.
          </Callout>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { AuthScreen } from "@mosje/design-system";

export default function Login() {
  return (
    <AuthScreen
      config={E_ANUDAAN_LOGIN}
      roleId={searchParams.get("role") ?? undefined}
      onRoleChange={(id) => router.replace(\`?role=\${id}\`)}
      onSubmit={signIn}
      loading={isSigningIn}
      error={error}
    />
  );
}`}</CodeBlock>
          <p>
            Every prop, variant and behaviour is documented on the{" "}
            <a href="/design-system/components/auth/portal-login-template">
              Portal Login Template
            </a>{" "}
            page. This one adds nothing.
          </p>
        </section>
      }
    />
  );
}
