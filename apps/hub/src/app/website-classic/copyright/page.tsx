import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Copyright Policy — Department of Social Justice & Empowerment",
  description:
    "Copyright Policy for the material published on the official website of the Department of Social Justice & Empowerment (DoSJE), Government of India.",
};

export default function CopyrightPage() {
  return (
    <ContentPage
      title="Copyright Policy"
      breadcrumb={[{ label: "Policies" }, { label: "Copyright Policy" }]}
      description="Terms governing the reproduction and use of material published on this website of the Department of Social Justice & Empowerment."
      lastUpdated="06 Jun 2026"
    >
      <p>
        Material featured on this website of the Department of Social Justice &amp; Empowerment (DoSJE),
        Government of India, may be reproduced free of charge in any format or media without requiring
        specific permission. This is subject to the material being reproduced accurately and not being used
        in a derogatory manner or in a misleading context.
      </p>

      <h2>Conditions of Reproduction</h2>
      <p>
        Where the material is being published or issued to others, the source must be prominently
        acknowledged. The permission to reproduce material does not extend to any material on this website
        that is identified as being the copyright of a third party. Authorisation to reproduce such material
        must be obtained from the copyright holders concerned.
      </p>
      <ul>
        <li>
          The material must be reproduced accurately and must not be used in a derogatory manner or within a
          false or misleading context.
        </li>
        <li>
          Wherever the material is being reproduced, the Department of Social Justice &amp; Empowerment,
          Government of India, must be identified and acknowledged as the source of the material.
        </li>
        <li>
          The right to reproduce the material does not transfer ownership of the copyright in the material to
          the user.
        </li>
      </ul>

      <h2>Exceptions</h2>
      <p>
        This permission for free reproduction does not extend to:
      </p>
      <ul>
        <li>
          The National Emblem, the official emblems, logos and crests of the Department, its associated
          organisations, and the Government of India;
        </li>
        <li>Any logos, emblems or insignia that are protected under the State Emblem of India (Prohibition
          of Improper Use) Act, 2005, or any other applicable law;</li>
        <li>Material that is explicitly identified as being the copyright of a third party.</li>
      </ul>
      <p>
        Use of the National Emblem and official logos is governed by the relevant statutes and may not be
        reproduced without prior written authorisation.
      </p>

      <h2>Trademarks</h2>
      <p>
        The names, images and logos identifying the Department of Social Justice &amp; Empowerment or third
        parties and their products and services are subject to copyright, design rights and trademarks of
        the Department and / or the third parties. Nothing contained in these terms shall be construed as
        conferring any licence or right to use any trademark, patent, design or copyright of the Department
        or any other third party.
      </p>
    </ContentPage>
  );
}
