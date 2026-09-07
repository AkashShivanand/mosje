import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Auth Screen — Design System",
  description:
    "Credentials, before there is a session. An alias of Portal Login Template under the name the decision table uses.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.8 Accessible Authentication (Minimum)",
    level: "AA",
    description:
      "Every credential field permits paste and autofill, so a password manager can complete the sign-in without a cognitive function test.",
    status: "partial",
    evidence:
      "Inherited from Portal Login Template and its credential fields. Verified there, not re-verified here — this page documents an alias and adds no markup of its own.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description: "Role tabs, credential fields and the footer links are the login template's own structure.",
    status: "partial",
    evidence: "Inherited. See the Portal Login Template page for the checked criteria and their evidence.",
  },
];

export default function AuthScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Auth Screen"
      status="Beta"
      summary="Credentials, before there is a session. This is Portal Login Template under the name the decision table uses — an alias, not a wrapper: no second component, no extra render layer, no props of its own."
      figma={{
        absent:
          "The auth geometry is the one clean set in the handoff — hero 922 / form column 518 at x=922 / card 390 with 64px gutters on desktop, and 375 / card 343 / 16px gutters on mobile, consistent across all 18 drawn screens. It already matched the built component, so nothing was rebuilt.",
      }}
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
