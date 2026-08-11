# Design ↔ code parity ledger

> **GENERATED** by `tools/design-parity/build-ledger.mjs`. Do not hand-edit — regenerate.
> Figma file `3FF5l0SMNIwdpZrKkeyPTm` (SAMAVESH Design System) ↔ `@mosje/design-system`.

## Summary

| Verdict | Count | Meaning |
|---|---:|---|
| `mapped` | 43 | A Figma component set with a confirmed code counterpart |
| `figma-only` | 30 | Designed, never built. Backlog item or retire from the library |
| `code-only` | 50 | Built, never designed. Figma backlog item |
| `deliberately-unmapped` (Figma) | 11 | Internal sub-parts and brand assets |
| `deliberately-unmapped` (code) | 8 | Demo tooling, providers, utilities |
| `broken-pairing` | 0 | Pairing names a code export that no longer exists — **fix immediately** |

**84** published component sets · **85** code components · **43** paired.

## Figma → code

| Figma component set | Page | Code | Verdict | Node |
|---|---|---|---|---|
| .AccessibilityIcons | Accessibility Bar and Widget | _Internal icon set, not a component_ | `deliberately-unmapped` | [2764:4238](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2764-4238) |
| AccessibilityBar | Accessibility Bar and Widget | `UX4GAccessibilityWidget` | `mapped` | [4516:1537](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4516-1537) |
| AccessibilityPanel / Item | Accessibility Bar and Widget | `UX4GAccessibilityWidget` | `mapped` | [2764:4423](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2764-4423) |
| AccessibilityWidget / FAB | Accessibility Bar and Widget | `UX4GAccessibilityWidget` | `mapped` | [5046:55544](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=5046-55544) |
| .AccordionLayoutBlocks | Accordion | _Internal layout scaffold_ | `deliberately-unmapped` | [193:6540](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=193-6540) |
| Accordion | Accordion | — | `figma-only` | [395:67692](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=395-67692) |
| Accordion / Item | Accordion | — | `figma-only` | [395:67819](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=395-67819) |
| .RightContent | Alerts/Toasts | _Internal sub-part of Alert_ | `deliberately-unmapped` | [220:7849](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=220-7849) |
| .ToastStatus | Alerts/Toasts | _Internal sub-part of Alert_ | `deliberately-unmapped` | [220:7769](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=220-7769) |
| Alert | Alerts/Toasts | `Alert` | `mapped` | [2272:12530](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2272-12530) |
| Avatar | Avatars | `Avatar` | `mapped` | [248:2268](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=248-2268) |
| Badge | Badges | `Badge` | `mapped` | [75:321](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=75-321) |
| Breadcrumb | Breadcrumbs | — | `figma-only` | [76:179](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=76-179) |
| Button | Buttons | `Button` | `mapped` | [609:283111](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=609-283111) |
| IconButton | Buttons | `Button` | `mapped` | [3:3497](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3-3497) |
| Link | Buttons | `Button` | `mapped` | [2723:1598](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2723-1598) |
| Card | Card | `Card` | `mapped` | [292:72630](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=292-72630) |
| Carousel/Dark-Controls | Carousel | — | `figma-only` | [2249:18519](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2249-18519) |
| Carousel/Light-Controls | Carousel | — | `figma-only` | [3045:949](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3045-949) |
| Loader | Carousel | — | `figma-only` | [3037:5097](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3037-5097) |
| Pause/Play Button | Carousel | — | `figma-only` | [3037:5078](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3037-5078) |
| Chart | Charts & Graphs | `LineChart` | `mapped` | [4643:64404](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4643-64404) |
| Checkbox | Checkbox | `Checkbox` | `mapped` | [15:664](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=15-664) |
| Chip | Chips | `Chip` | `mapped` | [123:28380](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=123-28380) |
| Chip / User | Chips | `Chip` | `mapped` | [123:28471](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=123-28471) |
| CloseButton | Close Button | — | `figma-only` | [303:9214](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=303-9214) |
| ColorPicker | Color Picker | — | `figma-only` | [404:71926](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=404-71926) |
| DatePicker | Date-Time Picker | — | `figma-only` | [169:65175](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=169-65175) |
| DatePicker / Trigger | Date-Time Picker | — | `figma-only` | [2101:26344](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2101-26344) |
| DateTimePicker | Date-Time Picker | — | `figma-only` | [169:70125](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=169-70125) |
| TimePicker / Item | Date-Time Picker | — | `figma-only` | [632:276223](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=632-276223) |
| TimePicker / Trigger | Date-Time Picker | — | `figma-only` | [2101:26352](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2101-26352) |
| Dropdown | Dropdown | `Select` | `mapped` | [485:136599](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=485-136599) |
| Dropdown / MenuItem | Dropdown | `Select` | `mapped` | [485:139372](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=485-139372) |
| EmptyState | Empty State | `EmptyState` | `mapped` | [452:97007](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=452-97007) |
| .FeedbackEmojis | Feedback Widget | _Internal sub-part of Feedback Widget_ | `deliberately-unmapped` | [3991:3654](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3991-3654) |
| FeedbackWidget / Button | Feedback Widget | — | `figma-only` | [3991:3480](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3991-3480) |
| Footer - Bottom Strip | Footer | _Footer sub-part_ | `deliberately-unmapped` | [2500:297936](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2500-297936) |
| Footer/Desktop | Footer | `Footer` | `mapped` | [2152:1738](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2152-1738) |
| Footer/Mobile | Footer | `Footer` | `mapped` | [2422:14532](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2422-14532) |
| Gov Dept. | Footer | _Footer sub-part_ | `deliberately-unmapped` | [2500:297855](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2500-297855) |
| Input Area | Inputs | `Textarea` | `mapped` | [87:4945](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=87-4945) |
| Input Field | Inputs | `Input` | `mapped` | [85:837](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=85-837) |
| Input Field — Label & Description | Inputs | `Label` | `mapped` | [2727:1578](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2727-1578) |
| Input-container | Inputs | — | `figma-only` | [2727:1565](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2727-1565) |
| List / Item | List | — | `figma-only` | [409:95050](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=409-95050) |
| Loader | Loader | `Loader` | `mapped` | [443:88127](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=443-88127) |
| Logo | Logos and Misc Icons | _Brand asset — inline SVG in code, not a component_ | `deliberately-unmapped` | [496:30912](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=496-30912) |
| IndiaMap | Map of India | `IndiaMap` | `mapped` | [6803:291103](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=6803-291103) |
| Modal | Modal | `Modal` | `mapped` | [136:916](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=136-916) |
| Modal / Backdrop | Modal | `Modal` | `mapped` | [136:956](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=136-956) |
| dropdown-item | Navbar | — | `figma-only` | [4299:1940](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4299-1940) |
| mega-menu-item | Navbar | — | `figma-only` | [4258:33604](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4258-33604) |
| nav-dropdown | Navbar | — | `figma-only` | [4300:1950](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4300-1950) |
| nav-item | Navbar | — | `figma-only` | [2065:292757](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2065-292757) |
| navbar/appbar | Navbar | `SiteHeader` | `mapped` | [4235:3169](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4235-3169) |
| navbar/logo | Navbar | _Brand asset — inline SVG in code, not a component_ | `deliberately-unmapped` | [4235:3652](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4235-3652) |
| navbar/mega-menu | Navbar | — | `figma-only` | [4268:914](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4268-914) |
| navbar/sitebar | Navbar | `SiteHeader` | `mapped` | [2476:296125](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2476-296125) |
| org-logo | Org Logos | _Brand asset — inline SVG in code, not a component_ | `deliberately-unmapped` | [4273:720](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4273-720) |
| .PaginationPage | Pagination | _Internal sub-part of Pagination_ | `deliberately-unmapped` | [522:216215](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=522-216215) |
| Pagination | Pagination | — | `figma-only` | [522:216228](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=522-216228) |
| popover | Popover | — | `figma-only` | [378:69007](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=378-69007) |
| ProgressBar | Progress Indicators | — | `figma-only` | [2104:1541](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2104-1541) |
| ProgressBar / Simple | Progress Indicators | — | `figma-only` | [2753:1946](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2753-1946) |
| ProgressCircle | Progress Indicators | — | `figma-only` | [2104:1826](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2104-1826) |
| Radio | Radio Buttons | `Radio` | `mapped` | [18:791](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=18-791) |
| RangeSlider | Range Slider | — | `figma-only` | [2179:66711](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2179-66711) |
| Search | Search | `Search` | `mapped` | [399:1808](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=399-1808) |
| sidebar/type-1 | Sidebar | `SidebarNav` | `mapped` | [4286:428](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4286-428) |
| sidebar/type-1/child-item | Sidebar | `SidebarNav` | `mapped` | [4286:361](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4286-361) |
| sidebar/type-1/main-item | Sidebar | `SidebarNav` | `mapped` | [4286:285](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4286-285) |
| Stepper / Horizontal | Stepper | `Stepper` | `mapped` | [2106:856](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2106-856) |
| Stepper / Step | Stepper | `Stepper` | `mapped` | [2741:1460](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2741-1460) |
| Stepper / Step Count | Stepper | — | `figma-only` | [2741:1403](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2741-1403) |
| Stepper / Style | Stepper | — | `figma-only` | [2741:1491](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2741-1491) |
| Stepper / Vertical | Stepper | `Stepper` | `mapped` | [2106:659](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2106-659) |
| Table | Tables | `DataTable` | `mapped` | [3836:4600](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3836-4600) |
| Table / Cell | Tables | `DataTable` | `mapped` | [3836:4624](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3836-4624) |
| Table / Row | Tables | `DataTable` | `mapped` | [3836:4647](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=3836-4647) |
| Tabs / Tab | Tabs | `Tabs` | `mapped` | [2316:353](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2316-353) |
| Tabs / Tab (Alt) | Tabs | `Tabs` | `mapped` | [2725:1217](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=2725-1217) |
| Toggle | Toggle | `Toggle` | `mapped` | [23:599](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=23-599) |
| Tooltip | Tooltip | `Tooltip` | `mapped` | [320:67518](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=320-67518) |

## Code → Figma (no design counterpart)

| Code component | Source | Verdict |
|---|---|---|
| `AadhaarInput` | `./components/forms/aadhaar-input` | `code-only` |
| `AccountMenu` | `./components/navigation/header` | `code-only` |
| `ApprovalTimeline` | `./components/data-display/approval-timeline` | `code-only` |
| `AppSwitcherPanel` | `./components/navigation/app-switcher-panel` | `deliberately-unmapped` — _Demo tooling — never product UI_ |
| `AreaChart` | `./components/data-display/charts` | `code-only` |
| `BarChart` | `./components/data-display/charts` | `code-only` |
| `BrandLockup` | `./components/navigation/header` | `code-only` |
| `CardBody` | `./components/data-display/card` | `code-only` |
| `CardFooter` | `./components/data-display/card` | `code-only` |
| `CardHeader` | `./components/data-display/card` | `code-only` |
| `CardSubtitle` | `./components/data-display/card` | `code-only` |
| `CardTitle` | `./components/data-display/card` | `code-only` |
| `ChartCard` | `./components/dashboard/chart-card` | `code-only` |
| `ChartTooltip` | `./components/data-display/charts` | `code-only` |
| `ColorModeProvider` | `./foundations/color-mode-provider` | `deliberately-unmapped` — _Non-visual provider_ |
| `ComboChart` | `./components/data-display/charts` | `code-only` |
| `DashboardGrid` | `./components/dashboard/dashboard-grid` | `code-only` |
| `DeclarationCheckbox` | `./components/forms/declaration-checkbox` | `code-only` |
| `DemoAccountsPanel` | `./demo` | `deliberately-unmapped` — _Demo tooling — never product UI_ |
| `DemoDock` | `./demo` | `deliberately-unmapped` — _Demo tooling — never product UI_ |
| `DemoFab` | `./demo` | `deliberately-unmapped` — _Demo tooling — never product UI_ |
| `DonutChart` | `./components/data-display/charts` | `code-only` |
| `FilterBar` | `./components/dashboard/filter-bar` | `code-only` |
| `FormCard` | `./components/forms/form-card` | `code-only` |
| `FormField` | `./components/forms/form-field` | `code-only` |
| `FormSection` | `./components/forms/form-section` | `code-only` |
| `FunnelChart` | `./components/data-display/charts` | `code-only` |
| `Gauge` | `./components/data-display/charts` | `code-only` |
| `GeoPhotoInput` | `./components/forms/geo-photo-input` | `code-only` |
| `Heatmap` | `./components/data-display/charts` | `code-only` |
| `Icon` | `./components/icon` | `deliberately-unmapped` — _Handled by the single icon mapping, not one per glyph_ |
| `KpiRow` | `./components/dashboard/kpi-row` | `code-only` |
| `Legend` | `./components/data-display/charts` | `code-only` |
| `Lightbox` | `./components/feedback/lightbox` | `code-only` |
| `LiveRegion` | `./components/a11y/live-region` | `deliberately-unmapped` — _Non-visual accessibility utility_ |
| `MediaGalleryInput` | `./components/forms/media-gallery-input` | `code-only` |
| `MediaUpload` | `./components/forms/media-upload` | `code-only` |
| `MetricCard` | `./components/data-display/metric-card` | `code-only` |
| `OtpInput` | `./components/forms/otp-input` | `code-only` |
| `PanInput` | `./components/forms/pan-input` | `code-only` |
| `PasswordInput` | `./components/forms/password-input` | `code-only` |
| `PieChart` | `./components/data-display/charts` | `code-only` |
| `PortalLoginShell` | `./components/auth/portal-login-shell` | `code-only` |
| `Progress` | `./components/data-display/charts` | `code-only` |
| `ReviewItem` | `./components/forms/wizard` | `code-only` |
| `ReviewSection` | `./components/forms/wizard` | `code-only` |
| `ScatterChart` | `./components/data-display/charts` | `code-only` |
| `SectionTitle` | `./components/layout/section` | `code-only` |
| `SegmentedControl` | `./components/dashboard/filter-bar` | `code-only` |
| `SideSheet` | `./components/feedback/side-sheet` | `code-only` |
| `Skeleton` | `./components/feedback/skeleton` | `code-only` |
| `SkeletonRow` | `./components/feedback/skeleton` | `code-only` |
| `SkeletonText` | `./components/feedback/skeleton` | `code-only` |
| `SlaProgressIndicator` | `./components/feedback/sla-progress-indicator` | `code-only` |
| `Sparkline` | `./components/data-display/charts` | `code-only` |
| `TabPanel` | `./components/navigation/tabs` | `code-only` |
| `ToastProvider` | `./components/feedback/toast` | `deliberately-unmapped` — _Non-visual provider_ |
| `Wizard` | `./components/forms/wizard` | `code-only` |

