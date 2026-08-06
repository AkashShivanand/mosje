# UX4G adoption: points to confirm

| | |
|---|---|
| **Prepared by** | Akash Kumar, Designer |
| **For** | UX4G team |
| **Date** | 04 August 2026 |
| **Reply helpful by** | 18 August 2026 |
| **Working against** | UX4G Design System 3.0 (Figma kit) |

---

## About this document

We are moving the ministry's websites and portals onto UX4G 3.0. Our existing designs were already
built on UX4G 2.0, so this is an upgrade rather than a fresh start, and most of what we need is
already covered in your documentation.

This document lists the small number of points the documentation does not cover, along with the
decisions we have taken ourselves. We have kept it short on purpose.

Each question notes what we plan to assume if we do not hear back. That is only so the work keeps
moving and so there is a written record of our reasoning later. We would much rather have your
guidance, and we are happy to talk any of it through on the Thursday call.

---

## 1. Moving from 2.0 to 3.0

Our current library and designs follow UX4G 2.0. Component names and structures may have changed in
3.0, so we would rather check the mapping than assume the two line up.

| # | Question | Why it matters | If we do not hear back | Priority |
|---|---|---|---|---|
| Q1 | Is there a mapping or upgrade guide from 2.0 to 3.0? | Figma matches components by name when you replace a library. If names or structures changed between versions, replacing the library could unlink components across our files. We would rather know in advance. | We compare 2.0 and 3.0 ourselves, write the mapping, and rebuild only what does not match. | High |
| Q2 | We are working against 3.0. If a newer version arrives while we are mid-way, should we adopt it or finish first? | Adopting mid-way means revisiting completed work. | We finish against 3.0 and treat any later upgrade as separate work. | High |

---

## 2. Confirming we have done it right

| # | Question | Why it matters | If we do not hear back | Priority |
|---|---|---|---|---|
| Q3 | How will adoption be checked? | Several checks are possible and each asks for different work from us: someone reviewing the screens by eye, our own declaration, components tracing back to the published library, component names and structure matching, or an accessibility review. We would rather build for the right one. | We report on component and structure matching, and share our method with each weekly report. | High |
| Q4 | Who confirms that a design is compliant, and at what point? | It gives us a clear definition of finished, and a point at which a screen can be closed. | We record every submission and treat no response within two weeks as accepted. | High |
| Q5 | Is there a preferred format for recording a departure from the kit? | If one exists we would rather use yours than invent our own. | We use the register in section 5 and share it weekly. | Medium |

---

## 3. Brand alignment

This part fits together better than we first expected, so these are narrow questions rather than
concerns.

DBIM asks for one primary colour group built from a key colour and its variants, background and
surface colours drawn from a functional palette, and a set type scale. UX4G lets a department apply
its own colours through Theme Craft. So the two are compatible by design: UX4G provides the
components and the means to theme them, and DBIM tells us what to theme them to. On typography they
already agree, since both specify Noto Sans.

| # | Question | Why it matters | If we do not hear back | Priority |
|---|---|---|---|---|
| Q6 | DBIM sets some structural colour rules, for example that the footer uses the darkest shade of the key colour group, and that icons use either the key colour or white. Do these apply inside UX4G components, or does UX4G's own component styling take precedence? | These are the few places where the two could point in different directions. | We follow DBIM for the footer, icons and identity marks, and UX4G for everything else, and note it. | High |
| Q7 | DBIM defines a type scale and so does UX4G. Which one should we follow for body text, headings and tables? | Both specify Noto Sans, so this is only about sizes and spacing, but it affects every screen. | We follow UX4G's scale inside components and DBIM's for page-level content. | High |

---

## 4. Components UX4G does not yet cover

A good part of our work is for officials rather than citizens: dense data tables with sorting and
bulk selection, dashboards and charts, multi-step approval chains, maps, and monitoring screens.
UX4G 3.0 covers citizen service journeys well, and these sit outside that.

| # | Question | Why it matters | If we do not hear back | Priority |
|---|---|---|---|---|
| Q8 | Where 3.0 has no component, would you prefer we build it on UX4G's foundations, or wait? | We would rather build in a way you can reuse than solve it locally. | We build on UX4G's foundations, record each one, and offer them back. | High |
| Q9 | Is anyone already building these, or are they planned for a later release? | If the work exists or is coming, we would rather wait than duplicate it. | We assume none exists yet and build our own. | High |
| Q10 | If we do build them, how would you like them submitted? | The directive asks us to contribute back and we would like to do that properly. We would need to know the format, who reviews it, and roughly how long review takes. | We package them as a Figma file with written specifications and send them for review. | Medium |

---

## 5. Scope

| # | Question | Why it matters | If we do not hear back | Priority |
|---|---|---|---|---|
| Q11 | Does this apply to portals already built and live, or to new work only? | The directive asks for no other design system on new development, and also for a full move within three months. This answer affects the size of the job more than anything else here. | We upgrade existing portals alongside new work and report on both. | High |
| Q12 | Do designs already approved by stakeholders need approving again once re-themed? | Some screens have already been signed off, and re-theming changes how they look. | We re-theme without seeking approval again unless the layout or content changes. | Medium |

---

## 6. Decisions we have taken

These are recorded for transparency rather than approval. If any of them looks wrong, we would be
glad to hear so, and we will treat them as settled from 18 August.

| # | Decision | Reasoning |
|---|---|---|
| R1 | Duplicate the UX4G Community file, move it into our team project, and publish it as one library used across every portal. | This follows the published UX4G guidance, and one library keeps all our portals consistent. |
| R2 | Apply the ministry's key colour group through Theme Craft, leaving component structure, spacing and states untouched. | DBIM sets the colour group and Theme Craft is UX4G's own way of applying it. |
| R3 | Check the 2.0 to 3.0 component mapping before changing anything in the library, rather than replacing the library outright. | Component names may have changed between versions, and replacing a library matches by name. Checking first avoids unlinking work already done. |
| R4 | Keep our existing Material Symbols icons at the size UX4G specifies. | It is the current version of the icon set UX4G uses by default, so the visual language matches. |
| R5 | Where UX4G has no component, build one on its foundations rather than bringing one in from elsewhere. | Keeps everything traceable to UX4G and makes the work useful to others. |
| R6 | Only detach a component from the library when we write down the reason. | Keeps the file honest, and gives us a record if anyone asks later. |
| R7 | Treat new page layouts assembled from existing UX4G components as compliant without separate approval. | Otherwise every screen needs a sign-off, which would slow things down considerably. |
| R8 | Continue checking accessibility ourselves at page level. | Compliant components do not by themselves make a page accessible. Heading order, focus order and landmarks stay with us. |
| R9 | Keep a dated copy of the UX4G kit and guidance as they stood on the day we copied them. | So that a later question about why something looks a certain way can be answered against the guidance as it was at the time. |

---

## The three that would help most

If time is short, these three would unblock the most work: how adoption is checked (Q3), whether
there is a 2.0 to 3.0 mapping (Q1), and what to do where UX4G has no component (Q8).

Thank you for the guidance and the weekly sessions, both of which have been genuinely useful.
