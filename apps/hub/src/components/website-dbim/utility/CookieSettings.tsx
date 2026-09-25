import type { ReactNode } from "react";
import Link from "next/link";
import { dbimHref } from "@/lib/website-dbim/nav";
import { DBIM_STORED } from "@/lib/website-dbim/utility";
import { DbimConsentWithdraw } from "./ConsentWithdraw";

/**
 * A read-only switch in the reference's "Off ● On" form. Nothing on this page can be
 * switched: every item the website keeps is needed for a choice the reader made, and
 * nothing optional is set. So each switch shows its state and is disabled, which is
 * what the reference does for its essential cookies.
 */
function LockedSwitch({ on, label }: { on: boolean; label: string }) {
  return (
    <div className="db-u-switch" data-on={on || undefined}>
      <span aria-hidden="true">Off</span>
      <input type="checkbox" role="switch" checked={on} disabled readOnly aria-label={label} className="db-u-switch__input" />
      <span aria-hidden="true">On</span>
    </div>
  );
}

function SettingBox({ title, children, on, switchLabel }: { title: string; children: ReactNode; on: boolean; switchLabel: string }) {
  return (
    <li className="db-u-setting">
      <p className="db-u-setting__label">{title}</p>
      <div className="db-u-setting__row">
        <div className="db-u-setting__text">{children}</div>
        <LockedSwitch on={on} label={switchLabel} />
      </div>
    </li>
  );
}

/** The reference's Cookie Setting layout, carrying the estate's Cookie Policy (app/website/cookies). */
export function DbimCookieSettings() {
  return (
    <div className="db-u-cookies">
      <p className="db-u-cookies__intro">
        A cookie is a small file a website asks your browser to keep. This website keeps only what it needs to remember
        the choices you make on it. Nothing it keeps identifies you, and none of it is used for advertising or for
        tracking your visits.
      </p>

      <div className="db-u-cookies__groups">
        <section aria-labelledby="essential-cookies">
          <h2 id="essential-cookies" className="db-u-cookies__h2">
            Essential Cookies
          </h2>
          <ul className="db-u-cookies__list">
            {DBIM_STORED.map((s) => (
              <SettingBox key={s.name} title={s.name} on switchLabel={`${s.name}: always on`}>
                <p>{s.purpose}</p>
                <p>
                  ({s.where}; kept: {s.kept.charAt(0).toLowerCase() + s.kept.slice(1)})
                </p>
              </SettingBox>
            ))}
          </ul>
        </section>

        <section aria-labelledby="optional-cookies">
          <h2 id="optional-cookies" className="db-u-cookies__h2">
            Optional Cookies
          </h2>
          <ul className="db-u-cookies__list">
            <SettingBox title="Analytics, Advertising and Social-Media Cookies" on={false} switchLabel="Analytics, advertising and social-media cookies: not set">
              <p>
                This website sets no analytics, advertising or social-media cookie, so there are no optional cookies to turn
                off.
              </p>
            </SettingBox>
          </ul>
        </section>
      </div>

      <DbimConsentWithdraw />

      <section aria-labelledby="other-websites" className="db-u-cookies__more">
        <h2 id="other-websites" className="db-u-cookies__h2">
          Cookies Set by Other Websites
        </h2>
        <p>
          Pages on this website link to documents and services hosted by other Government of India departments and by
          their content delivery networks. Those websites set their own cookies under their own policies, over which the
          Department has no control.
        </p>
      </section>
      <section aria-labelledby="managing" className="db-u-cookies__more">
        <h2 id="managing" className="db-u-cookies__h2">
          Managing Cookies
        </h2>
        <p>
          You can block or delete cookies and stored website data in your browser settings. If you do, the choices you
          have made on this website will be forgotten.
        </p>
        <p>
          How the Department handles information collected through this website is set out in the{" "}
          <Link href={dbimHref("/policies/privacy-policy")}>Privacy Policy</Link>.
        </p>
      </section>
    </div>
  );
}
