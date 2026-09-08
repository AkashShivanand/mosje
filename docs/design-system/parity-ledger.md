# Design ↔ code parity ledger

> **GENERATED** by `tools/design-parity/build-ledger.mjs`. Do not hand-edit — regenerate.
> Figma file `3FF5l0SMNIwdpZrKkeyPTm` (SAMAVESH Design System) ↔ `@mosje/design-system`.

## Summary

| Verdict | Count | Meaning |
|---|---:|---|
| `mapped` | 108 | A Figma component set with a confirmed code counterpart |
| `figma-only` | 31 | Designed, never built. Backlog item or retire from the library |
| `code-only` | 123 | Built, never designed. Figma backlog item |
| `deliberately-unmapped` (Figma) | 14 | Internal sub-parts and brand assets |
| `deliberately-unmapped` (code) | 7 | Demo tooling, providers, utilities |
| `broken-pairing` | 0 | Pairing names a code export that no longer exists — **fix immediately** |

**153** published component sets · **227** code components · **108** paired.

## Figma → code

| Figma component set | Page | Code | Verdict | Node |
|---|---|---|---|---|
| AccessibilityBar | Accessibility Bar | `AccessibilityBar` | `mapped` | [55065:33766](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55065-33766) |
| .AccordionLayoutBlocks | Accordion | _Internal layout scaffold_ | `deliberately-unmapped` | [193:6540](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=193-6540) |
| Accordion | Accordion | `Accordion` | `mapped` | [395:67692](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=395-67692) |
| Accordion / Item | Accordion | `AccordionItem` | `mapped` | [395:67819](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=395-67819) |
| Action Banner | Action Banner | `ActionBanner` | `mapped` | [57837:796](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57837-796) |
| .RightContent | Alerts/Toasts | _Internal sub-part of Alert_ | `deliberately-unmapped` | [220:7849](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=220-7849) |
| .ToastStatus | Alerts/Toasts | _Internal sub-part of Alert_ | `deliberately-unmapped` | [220:7769](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=220-7769) |
| Alert | Alerts/Toasts | `Alert` | `mapped` | [2272:12530](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2272-12530) |
| Avatar | Avatars | `Avatar` | `mapped` | [248:2268](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=248-2268) |
| Back to Top | Back to Top | `BackToTop` | `mapped` | [57608:745](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57608-745) |
| Badge | Badges | `Badge` | `mapped` | [75:321](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=75-321) |
| Biometric Capture | Biometric Capture | `BiometricCapture` | `mapped` | [57530:873](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57530-873) |
| BotCheck | Bot Check | `BotCheck` | `mapped` | [56824:1294](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56824-1294) |
| Logo | Brand | _Brand asset — inline SVG in code, not a component_ | `deliberately-unmapped` | [496:30912](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=496-30912) |
| org-logo | Brand | _Brand asset — inline SVG in code, not a component_ | `deliberately-unmapped` | [4273:720](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4273-720) |
| Breadcrumb | Breadcrumbs | `Breadcrumb` | `mapped` | [76:179](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=76-179) |
| Bulk Actions Bar | Bulk Actions Bar | `BulkActionsBar` | `mapped` | [57609:759](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57609-759) |
| Button | Button | `Button` | `mapped` | [609:283111](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=609-283111) |
| ButtonGroup | Button Group | `ButtonGroup` | `mapped` | [56793:1214](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56793-1214) |
| Card | Card | `Card` | `mapped` | [292:72630](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=292-72630) |
| ⛔ Carousel/Dark-Controls (deprecated) | Carousel | — | `figma-only` | [2249:18519](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2249-18519) |
| ⛔ Carousel/Light-Controls (deprecated) | Carousel | — | `figma-only` | [3045:949](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3045-949) |
| ⛔ Loader (deprecated) | Carousel | — | `figma-only` | [3037:5097](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3037-5097) |
| ⛔ Pause/Play Button (deprecated) | Carousel | — | `figma-only` | [3037:5078](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3037-5078) |
| Carousel / Controls | Carousel | `Carousel` | `mapped` | [57548:1159](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57548-1159) |
| Chart | Charts & Graphs | `LineChart` | `mapped` | [57417:15992](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57417-15992) |
| Chart Card | Charts & Graphs | `ChartCard` | `mapped` | [57418:15985](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57418-15985) |
| Legend | Charts & Graphs | `Legend` | `mapped` | [57420:16040](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57420-16040) |
| Metric Card | Charts & Graphs | `MetricCard` | `mapped` | [57414:15871](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57414-15871) |
| Ranked Bar Row | Charts & Graphs | — | `figma-only` | [57420:15960](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57420-15960) |
| Chatbot | Chatbot | `Chatbot` | `mapped` | [55826:37003](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55826-37003) |
| Chatbot Mascot | Chatbot | `ChatbotMascot` | `mapped` | [55826:698](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55826-698) |
| Checkbox | Checkbox | `Checkbox` | `mapped` | [15:664](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=15-664) |
| Checkbox Group | Checkbox | `CheckboxGroup` | `mapped` | [57040:770](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57040-770) |
| Chip | Chips | `Chip` | `mapped` | [123:28380](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=123-28380) |
| Chip / User | Chips | `Chip` | `mapped` | [123:28471](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=123-28471) |
| ColorPicker | Color Picker | — | `figma-only` | [404:71926](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=404-71926) |
| Cookie Consent | Cookie Consent | `CookieConsent` | `mapped` | [57622:778](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57622-778) |
| Date Range Picker | Date Range Picker | `DateRangePicker` | `mapped` | [57613:797](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57613-797) |
| ⛔ TimePicker / Item (deprecated) | Date-Time Picker | — | `figma-only` | [632:276223](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=632-276223) |
| ⛔ TimePicker / Trigger (deprecated) | Date-Time Picker | — | `figma-only` | [2101:26352](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2101-26352) |
| DatePicker | Date-Time Picker | `DatePicker` | `mapped` | [169:65175](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=169-65175) |
| DatePicker / Trigger | Date-Time Picker | _Internal sub-part of Date Picker — the field that opens it_ | `deliberately-unmapped` | [2101:26344](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2101-26344) |
| DateTimePicker | Date-Time Picker | — | `figma-only` | [169:70125](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=169-70125) |
| Time Picker | Date-Time Picker | `TimePicker` | `mapped` | [57547:2631](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57547-2631) |
| Description List / Row | Description List | `DescriptionList` | `mapped` | [57520:769](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57520-769) |
| Divider | Divider | `Divider` | `mapped` | [55061:700](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55061-700) |
| EmptyState | Empty State | `EmptyState` | `mapped` | [452:97007](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=452-97007) |
| Event List / Row | Event List | `EventList` | `mapped` | [57600:48770](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57600-48770) |
| ⛔ .FeedbackEmojis (deprecated) | Feedback Widget | — | `figma-only` | [3991:3654](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3991-3654) |
| ⛔ FeedbackWidget / Button (deprecated) | Feedback Widget | — | `figma-only` | [3991:3480](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3991-3480) |
| Feedback Widget | Feedback Widget | `FeedbackWidget` | `mapped` | [57539:1051](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57539-1051) |
| Figure | Figure | `Figure` | `mapped` | [57524:850](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57524-850) |
| File List / Row | File List | `FileList` | `mapped` | [57611:775](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57611-775) |
| Footer - Bottom Strip | Footer | _Footer sub-part_ | `deliberately-unmapped` | [2500:297936](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2500-297936) |
| Site Footer | Footer | — | `figma-only` | [57800:1922](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57800-1922) |
| IconButton | Icon Button | `IconButton` | `mapped` | [3:3497](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3-3497) |
| Icon | Iconography | `Icon` | `mapped` | [55030:701](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55030-701) |
| Inline Edit | Inline Edit | `InlineEdit` | `mapped` | [57599:770](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57599-770) |
| Input Area | Input Area | `Textarea` | `mapped` | [87:4945](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=87-4945) |
| Character Count | Input Field | `CharacterCount` | `mapped` | [56792:50500](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56792-50500) |
| Input Field | Input Field | `Input` | `mapped` | [85:837](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=85-837) |
| PasswordStrengthMeter | Input Field | `PasswordStrengthMeter` | `mapped` | [55432:795](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55432-795) |
| Required Fields Legend | Input Field | `RequiredFieldsLegend` | `mapped` | [56792:50506](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56792-50506) |
| Language Switcher | Language Switcher | `LanguageSwitcher` | `mapped` | [57596:752](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57596-752) |
| Link | Link | `Link` | `mapped` | [2723:1598](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2723-1598) |
| ⛔ List / Item (deprecated) | List | — | `figma-only` | [409:95050](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=409-95050) |
| List Row | List | `ListRow` | `mapped` | [57542:3311](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57542-3311) |
| Loader | Loader | `Loader` | `mapped` | [443:88127](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=443-88127) |
| IndiaMap | Map of India | `IndiaMap` | `mapped` | [6803:291103](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=6803-291103) |
| ⛔ Dropdown (deprecated) | Menu | — | `figma-only` | [485:136599](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=485-136599) |
| ⛔ Dropdown / MenuItem (deprecated) | Menu | — | `figma-only` | [485:139372](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=485-139372) |
| Menu / Item | Menu | `Menu` | `mapped` | [57541:4628](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57541-4628) |
| Modal | Modal | `Modal` | `mapped` | [136:916](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=136-916) |
| Modal / Backdrop | Modal | `Modal` | `mapped` | [136:956](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=136-956) |
| Navbar/AccountMenu | Navbar | `AccountMenu` | `mapped` | [56046:4113](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56046-4113) |
| Navbar/AccountMenuItem | Navbar | `AccountMenu` | `mapped` | [56040:4083](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56040-4083) |
| Navbar/BrandLockup | Navbar | `BrandLockup` | `mapped` | [4235:3652](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4235-3652) |
| Navbar/Compact | Navbar | `SiteHeader` | `mapped` | [56058:4139](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56058-4139) |
| Navbar/DropdownItem | Navbar | `DropdownItem` | `mapped` | [4299:1940](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4299-1940) |
| Navbar/MegaMenu | Navbar | `MegaMenu` | `mapped` | [4268:914](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4268-914) |
| Navbar/MegaMenuItem | Navbar | `MegaMenuItem` | `mapped` | [4258:33604](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4258-33604) |
| Navbar/MenuToggle | Navbar | `MenuToggle` | `mapped` | [55783:4565](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55783-4565) |
| Navbar/NavDropdown | Navbar | `NavDropdown` | `mapped` | [4300:1950](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4300-1950) |
| Navbar/NavItem | Navbar | `NavItemLink` | `mapped` | [2065:292757](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2065-292757) |
| Navbar/NavSheet | Navbar | `NavSheet` | `mapped` | [55327:3503](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55327-3503) |
| Navbar/Portal | Navbar | `SiteHeader` | `mapped` | [4235:3169](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4235-3169) |
| Navbar/SheetToggle | Navbar | `SheetToggle` | `mapped` | [57295:59399](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57295-59399) |
| Navbar/Website | Navbar | `SiteHeader` | `mapped` | [2476:296125](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2476-296125) |
| Number Input | Number Input | `NumberInput` | `mapped` | [57605:770](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57605-770) |
| OTP Input | OTP Input | `OtpInput` | `mapped` | [55427:34365](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55427-34365) |
| OTP Input / Box | OTP Input | _Internal sub-part of OTP Input — one digit box_ | `deliberately-unmapped` | [55427:704](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55427-704) |
| Page Header | Page Header | — | `figma-only` | [57817:52731](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57817-52731) |
| Page Header / Hero Media | Page Header | — | `figma-only` | [57811:2382](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57811-2382) |
| .PaginationPage | Pagination | _Internal sub-part of Pagination_ | `deliberately-unmapped` | [522:216215](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=522-216215) |
| Pagination | Pagination | `Pagination` | `mapped` | [522:216228](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=522-216228) |
| ⛔ popover (deprecated) | Popover | — | `figma-only` | [378:69007](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=378-69007) |
| Popover | Popover | `Popover` | `mapped` | [57538:857](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57538-857) |
| Portal Card | Portal Card | `PortalCard` | `mapped` | [56486:832](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56486-832) |
| Auth / AccountPrompt | Portal Login Template | `AccountPrompt` | `mapped` | [55438:739](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55438-739) |
| Auth / CredentialRecovery | Portal Login Template | _Internal sub-part of Portal Login Template — the recovery steps_ | `deliberately-unmapped` | [56640:4103](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56640-4103) |
| Auth / LoginHero | Portal Login Template | — | `figma-only` | [57465:46812](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57465-46812) |
| Auth / MaskedContactRow | Portal Login Template | `MaskedContactRow` | `mapped` | [55437:718](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55437-718) |
| Auth / PortalLoginShell | Portal Login Template | `PortalLoginShell` | `mapped` | [55450:1134](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55450-1134) |
| Auth / RecoveryFormCard | Portal Login Template | _Internal sub-part of Portal Login Template — the recovery card_ | `deliberately-unmapped` | [56640:4104](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56640-4104) |
| Auth / ResendTimer | Portal Login Template | `ResendTimer` | `mapped` | [55437:707](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55437-707) |
| Auth / SigningIntoBar | Portal Login Template | `SigningIntoBar` | `mapped` | [57464:12739](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57464-12739) |
| Auth / SSOButton | Portal Login Template | `SSOButton` | `mapped` | [55438:727](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55438-727) |
| PortalLoginTemplate | Portal Login Template | `PortalLoginTemplate` | `mapped` | [55397:1364](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55397-1364) |
| ProgressBar | Progress Indicators | — | `figma-only` | [2104:1541](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2104-1541) |
| ProgressBar / Simple | Progress Indicators | — | `figma-only` | [2753:1946](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2753-1946) |
| ProgressCircle | Progress Indicators | — | `figma-only` | [2104:1826](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2104-1826) |
| Radio | Radio | `Radio` | `mapped` | [18:791](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=18-791) |
| Radio Group | Radio | `RadioGroup` | `mapped` | [57035:929](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57035-929) |
| SAMAVESH Banner | SAMAVESH Banner | `SamaveshBanner` | `mapped` | [56479:42386](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56479-42386) |
| Schedule Grid | Schedule Grid | `ScheduleGrid` | `mapped` | [57618:798](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57618-798) |
| Search | Search | `Search` | `mapped` | [399:1808](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=399-1808) |
| Select | Select | `Select` | `mapped` | [55430:34472](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55430-34472) |
| Select / Filter | Select | `FilterSelect` | `mapped` | [56916:772](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56916-772) |
| Selection Card | Selection Card | `Radio` | `mapped` | [55530:2932](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55530-2932) |
| SideSheet | Side Sheet | `SideSheet` | `mapped` | [55435:813](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55435-813) |
| Sidebar | Sidebar | `SidebarNav` | `mapped` | [4286:428](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4286-428) |
| Sidebar/CollapseControl | Sidebar | — | `figma-only` | [57137:1199](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57137-1199) |
| Sidebar/GroupLabel | Sidebar | — | `figma-only` | [57137:1189](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57137-1189) |
| Sidebar/Item · Level 1 | Sidebar | — | `figma-only` | [4286:285](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4286-285) |
| Sidebar/Item · Level 2 | Sidebar | — | `figma-only` | [4286:361](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4286-361) |
| Sidebar/Item · Level 3 | Sidebar | — | `figma-only` | [57129:1097](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57129-1097) |
| Sidebar/PortalIdentity | Sidebar | — | `figma-only` | [57262:1829](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57262-1829) |
| Signature Pad | Signature Pad | `SignaturePad` | `mapped` | [57621:772](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57621-772) |
| ⛔ RangeSlider (deprecated) | Slider | — | `figma-only` | [2179:66711](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2179-66711) |
| Range Slider | Slider | `RangeSlider` | `mapped` | [57547:48771](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57547-48771) |
| Slider | Slider | `Slider` | `mapped` | [57547:48756](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57547-48756) |
| Split Button | Split Button | `SplitButton` | `mapped` | [57606:762](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57606-762) |
| Stepper / Node | Stepper | — | `figma-only` | [57547:48731](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57547-48731) |
| Stepper / Row | Stepper | `Stepper` | `mapped` | [57551:49844](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57551-49844) |
| Stepper / Stage | Stepper | — | `figma-only` | [57549:49381](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57549-49381) |
| Table | Tables | `DataTable` | `mapped` | [3836:4600](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3836-4600) |
| Table / Cell | Tables | `DataTable` | `mapped` | [3836:4624](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3836-4624) |
| Table / Row | Tables | `DataTable` | `mapped` | [3836:4647](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3836-4647) |
| [Deprecated] Tabs / Tab (Alt) | Tabs | `Tabs` | `mapped` | [2725:1217](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2725-1217) |
| Tabs | Tabs | `Tabs` | `mapped` | [55489:870](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55489-870) |
| Tabs / More | Tabs | `Tabs` | `mapped` | [55514:848](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55514-848) |
| Tabs / Tab | Tabs | `Tabs` | `mapped` | [2316:353](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2316-353) |
| Ticker | Ticker | `Ticker` | `mapped` | [56159:903](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56159-903) |
| Ticker / Action | Ticker | _Internal sub-part of Ticker — its interaction states_ | `deliberately-unmapped` | [56155:37470](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56155-37470) |
| Ticker / Control | Ticker | _Internal sub-part of Ticker — its interaction states_ | `deliberately-unmapped` | [56155:1797](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56155-1797) |
| Ticker / Row | Ticker | _Internal sub-part of Ticker — the message, in BOTH shapes_ | `deliberately-unmapped` | [56167:900](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56167-900) |
| Time Slot / Slot | Time Slot | `TimeSlot` | `mapped` | [57526:770](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57526-770) |
| Toggle | Toggle | `Toggle` | `mapped` | [23:599](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=23-599) |
| Tooltip | Tooltip | `Tooltip` | `mapped` | [320:67518](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=320-67518) |
| Transfer List | Transfer List | `TransferList` | `mapped` | [57616:830](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57616-830) |
| Tree / Node | Tree | `Tree` | `mapped` | [57614:783](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57614-783) |
| Video Tile | Video Tile | `VideoTile` | `mapped` | [57620:779](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=57620-779) |

## Code → Figma (no design counterpart)

| Code component | Source | Verdict |
|---|---|---|
| `AadhaarInput` | `./components/forms/aadhaar-input` | `code-only` |
| `ApprovalTimeline` | `./components/data-display/approval-timeline` | `code-only` |
| `AppShell` | `./components/layout/app-shell` | `code-only` |
| `AppSwitcherPanel` | `./components/navigation/app-switcher-panel` | `deliberately-unmapped` — _Demo tooling — never product UI_ |
| `AreaChart` | `./components/data-display/charts` | `code-only` |
| `AuthDivider` | `./components/auth/auth-parts` | `code-only` |
| `AuthFormCard` | `./components/auth/auth-form-card` | `code-only` |
| `AuthHelpLine` | `./components/auth/auth-parts` | `code-only` |
| `AuthResult` | `./components/auth/auth-result` | `code-only` |
| `AuthScreen` | `./components/templates/auth-screen` | `code-only` |
| `Band` | `./components/layout/band` | `code-only` |
| `BarChart` | `./components/data-display/charts` | `code-only` |
| `BrandGlyph` | `./components/utilities/brand-glyph` | `code-only` |
| `BulletChart` | `./components/data-display/charts` | `code-only` |
| `CaptchaField` | `./components/forms/captcha-field` | `code-only` |
| `CardBody` | `./components/data-display/card` | `code-only` |
| `CardFooter` | `./components/data-display/card` | `code-only` |
| `CardHeader` | `./components/data-display/card` | `code-only` |
| `CardSkeleton` | `./components/dashboard/card-skeleton` | `code-only` |
| `CardState` | `./components/dashboard/card-state` | `code-only` |
| `CardSubtitle` | `./components/data-display/card` | `code-only` |
| `CardTitle` | `./components/data-display/card` | `code-only` |
| `CatalogueScreen` | `./components/templates/catalogue-screen` | `code-only` |
| `ChartExport` | `./components/dashboard/chart-export` | `code-only` |
| `ChartTooltip` | `./components/data-display/charts` | `code-only` |
| `ChecklistScreen` | `./components/templates/checklist-screen` | `code-only` |
| `ChooserScreen` | `./components/templates/chooser-screen` | `code-only` |
| `ColorModeProvider` | `./foundations/color-mode-provider` | `deliberately-unmapped` — _Non-visual provider_ |
| `Combobox` | `./components/forms/combobox` | `code-only` |
| `ComboChart` | `./components/data-display/charts` | `code-only` |
| `CommentThread` | `./components/data-display/comment-thread` | `code-only` |
| `ConfirmationScreen` | `./components/templates/confirmation-screen` | `code-only` |
| `ConsentLine` | `./components/auth/auth-parts` | `code-only` |
| `Container` | `./components/layout/container` | `code-only` |
| `ContentNav` | `./components/navigation/content-nav` | `code-only` |
| `DarpanFields` | `./components/auth/credential-fields` | `code-only` |
| `DashboardGrid` | `./components/dashboard/dashboard-grid` | `code-only` |
| `DecisionScreen` | `./components/templates/decision-screen` | `code-only` |
| `DeclarationCheckbox` | `./components/forms/declaration-checkbox` | `code-only` |
| `DemoAccountsPanel` | `./demo` | `deliberately-unmapped` — _Demo tooling — never product UI_ |
| `DemoDock` | `./demo` | `deliberately-unmapped` — _Demo tooling — never product UI_ |
| `DemoFab` | `./demo` | `deliberately-unmapped` — _Demo tooling — never product UI_ |
| `DocumentLibrary` | `./components/data-display/document-library` | `code-only` |
| `DonutChart` | `./components/data-display/charts` | `code-only` |
| `ErrorSummary` | `./components/forms/error-summary` | `code-only` |
| `ErrorView` | `./components/feedback/error-view` | `code-only` |
| `FactStrip` | `./components/data-display/fact-strip` | `code-only` |
| `FieldHelp` | `./components/forms/field-parts` | `code-only` |
| `FieldHelpToggle` | `./components/forms/field-parts` | `code-only` |
| `FieldHint` | `./components/forms/field-parts` | `code-only` |
| `FieldLabel` | `./components/forms/field-parts` | `code-only` |
| `FieldMessage` | `./components/forms/field-parts` | `code-only` |
| `FieldPolicyProvider` | `./components/forms/field-policy` | `code-only` |
| `FilterBar` | `./components/dashboard/filter-bar` | `code-only` |
| `FlaskIcon` | `./demo` | `code-only` |
| `Footer` | `./components/navigation/footer` | `code-only` |
| `FormCard` | `./components/forms/form-card` | `code-only` |
| `FormField` | `./components/forms/form-field` | `code-only` |
| `FormScreen` | `./components/templates/form-screen` | `code-only` |
| `FormSection` | `./components/forms/form-section` | `code-only` |
| `FunnelChart` | `./components/data-display/charts` | `code-only` |
| `GalleryScreen` | `./components/templates/gallery-screen` | `code-only` |
| `Gauge` | `./components/data-display/charts` | `code-only` |
| `GeoPhotoInput` | `./components/forms/geo-photo-input` | `code-only` |
| `Grid` | `./components/layout/grid` | `code-only` |
| `GridItem` | `./components/layout/grid` | `code-only` |
| `Heading` | `./components/layout/text` | `code-only` |
| `Heatmap` | `./components/data-display/charts` | `code-only` |
| `IdentifierFields` | `./components/auth/credential-fields` | `code-only` |
| `Illustration` | `./components/brand/illustration` | `code-only` |
| `InboxScreen` | `./components/templates/inbox-screen` | `code-only` |
| `IndiaBubbleMap` | `./components/data-display/charts` | `code-only` |
| `IndiaPointMap` | `./components/data-display/charts` | `code-only` |
| `InlineBar` | `./components/data-display/charts` | `code-only` |
| `KpiRow` | `./components/dashboard/kpi-row` | `code-only` |
| `Label` | `./components/forms/label` | `code-only` |
| `Lightbox` | `./components/feedback/lightbox` | `code-only` |
| `ListGroup` | `./components/data-display/list-group` | `code-only` |
| `LiveRegion` | `./components/utilities/live-region` | `deliberately-unmapped` — _Non-visual accessibility utility_ |
| `MediaGalleryInput` | `./components/forms/media-gallery-input` | `code-only` |
| `MediaUpload` | `./components/forms/media-upload` | `code-only` |
| `NewPasswordFields` | `./components/auth/credential-fields` | `code-only` |
| `NotificationCentre` | `./components/data-display/notification-centre` | `code-only` |
| `OrgLogo` | `./components/brand/org-logo` | `code-only` |
| `OtpRequestFields` | `./components/auth/credential-fields` | `code-only` |
| `OtpVerifyFields` | `./components/auth/credential-fields` | `code-only` |
| `OverviewScreen` | `./components/templates/overview-screen` | `code-only` |
| `PageHeader` | `./components/layout/page-header` | `code-only` |
| `PanInput` | `./components/forms/pan-input` | `code-only` |
| `PasswordFields` | `./components/auth/credential-fields` | `code-only` |
| `PasswordInput` | `./components/forms/password-input` | `code-only` |
| `PieChart` | `./components/data-display/charts` | `code-only` |
| `PinFields` | `./components/auth/credential-fields` | `code-only` |
| `PortalList` | `./components/auth/portal-list` | `code-only` |
| `PortalPage` | `./components/templates/portal-page` | `code-only` |
| `ProfileCard` | `./components/data-display/profile-card` | `code-only` |
| `Progress` | `./components/data-display/charts` | `code-only` |
| `ProvenanceLine` | `./components/dashboard/provenance` | `code-only` |
| `RankedBarList` | `./components/data-display/charts` | `code-only` |
| `RecordScreen` | `./components/templates/record-screen` | `code-only` |
| `ReportScreen` | `./components/templates/report-screen` | `code-only` |
| `ReviewItem` | `./components/forms/wizard` | `code-only` |
| `ReviewScreen` | `./components/templates/review-screen` | `code-only` |
| `ReviewSection` | `./components/forms/wizard` | `code-only` |
| `ScatterChart` | `./components/data-display/charts` | `code-only` |
| `ScreenBody` | `./components/templates/screen-body` | `code-only` |
| `SearchScreen` | `./components/templates/search-screen` | `code-only` |
| `SectionTitle` | `./components/layout/section` | `code-only` |
| `SegmentedControl` | `./components/dashboard/filter-bar` | `code-only` |
| `SettingsScreen` | `./components/templates/settings-screen` | `code-only` |
| `SiteFooter` | `./components/navigation/site-footer` | `code-only` |
| `SiteLayout` | `./components/layout/site-layout` | `code-only` |
| `SitePageHeader` | `./components/layout/site-page-header` | `code-only` |
| `Skeleton` | `./components/feedback/skeleton` | `code-only` |
| `SkeletonRow` | `./components/feedback/skeleton` | `code-only` |
| `SkeletonText` | `./components/feedback/skeleton` | `code-only` |
| `SlaProgressIndicator` | `./components/feedback/sla-progress-indicator` | `code-only` |
| `SmallMultiples` | `./components/data-display/charts` | `code-only` |
| `Sparkline` | `./components/data-display/charts` | `code-only` |
| `StatusScreen` | `./components/templates/status-screen` | `code-only` |
| `TabPanel` | `./components/navigation/tabs` | `code-only` |
| `Text` | `./components/layout/text` | `code-only` |
| `ToastProvider` | `./components/feedback/toast` | `deliberately-unmapped` — _Non-visual provider_ |
| `UX4GAccessibilityWidget` | `./components/utilities/ux4g-accessibility-widget` | `code-only` |
| `VerticalTimeline` | `./components/data-display/vertical-timeline` | `code-only` |
| `VerticalTimelineItem` | `./components/data-display/vertical-timeline` | `code-only` |
| `VisitorCounter` | `./components/data-display/visitor-counter` | `code-only` |
| `Wizard` | `./components/forms/wizard` | `code-only` |
| `WizardScreen` | `./components/templates/wizard-screen` | `code-only` |
| `WorklistScreen` | `./components/templates/worklist-screen` | `code-only` |

