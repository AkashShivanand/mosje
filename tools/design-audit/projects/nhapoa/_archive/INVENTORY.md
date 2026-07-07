# NHAPOA — QC Capture Inventory (Phase A · confirm before capture)

**Purpose:** the complete checklist of every live screen / journey / state to capture, so nothing is
missed. Confirm or edit this, then we capture role-by-role.

**Legend**
- **Mode:** `H` = headless auto-capture (static lists/dashboards) · `A` = assisted browser (you log
  in; I navigate, fill forms with dummy data, trigger states). Hybrid = both.
- **Design frame:** `Y` = a Figma frame exists to pair against · `—` = undesigned (audit vs the
  visual language only).
- **Login:** admin roles need you to log in once in the assisted browser (also avoids the rate-limit).

---

## 0. Admin access (assisted login — do once at the start of each admin role)
| Screen | States to capture | Mode | Design |
|---|---|---|---|
| Admin Login (`/login`) | default · filled · invalid-credentials error · loading | A | — |
| Forgot Password | default · submitted / confirmation | A | — |
| OTP / verify (if shown) | default · entered · error | A | — |

## 1. Citizen (public — no login)
| Screen (route) | States / steps to capture | Mode | Design |
|---|---|---|---|
| Home / Dashboard (`/`) | default | H | Y |
| **Register Grievance** (`/register-grievance`) — 5-step wizard | Step 1 Grievance Registration (empty · FIR/Relief/Charge-Sheet radios · "registered FIR?" Yes→FIR panel · role select Informer/Victim/NGO · OTP send/verify · validation error) · Step 2 Informer Details · Step 3 Victim Details · Step 4 Grievance Details · Step 5 Review & Submit · Submit **success** | A | Y (step 1 only; steps 2–5 undesigned) |
| **Register Rescue** (`/register-rescue`) — quick form | empty · filled (Name, Mobile+OTP, Location, Problem) · OTP · success | A | — |
| **Track Status** (`/track-status`) | empty · not-found · found → status timeline result | A | Y |
| Help & FAQs (`/help-faqs`) | default · an accordion item expanded | H | Y |

## 2. District Officer (login: ba.districtofficer)
| Screen (route) | States / steps | Mode | Design |
|---|---|---|---|
| Dashboard (`/district-officer/dashboard`) | default | H | Y |
| My Cases (`/district-officer/cases`) | list default · filters applied · empty · **Case detail** view · case action (assign / move to investigation / raise clarification) modal | H + A | Y (list) |
| Clarifications (`/district-officer/clarifications`) | list · raise-clarification modal · response state | H + A | Y |
| Investigation (`/district-officer/investigation`) | list · investigation detail / evidence upload | H + A | Y |
| Reports (`/district-officer/reports`) | default · filter / generate | H | Y |
| SLA (`/district-officer/sla`) | default | H | Y |
| Notifications (`/district-officer/notifications`) | list (read / unread) · detail | H | Y |

## 3. SHO — Station House Officer (login: westdeopur_ps1 · shared admin shell)
| Screen | States / steps | Mode | Design |
|---|---|---|---|
| Dashboard · Cases · Investigation · Reports · SLA · Notifications | same set as District Officer (SHO uses the same admin shell) | H + A | reuse DO frames (no SHO-specific frames) |

## 4. State Authority (login: ba.stateauthority)
| Screen (route) | States / steps | Mode | Design |
|---|---|---|---|
| Dashboard (`/state-authority/dashboard`) | default | H | Y |
| Pending Approvals (`/state-authority/pending-approvals`) | list · filter tabs · **Approve** modal · **Reject / Send-back** modal | H + A | Y |
| Approved Cases (`/state-authority/approved-cases`) | list · empty | H | Y |
| Sent Back (`/state-authority/sent-back`) | list · empty | H | Y |
| All Cases (`/state-authority/all-cases`) | list · filters | H | — |
| Reports (`/state-authority/reports`) | default | H | Y |
| SLA (`/state-authority/sla`) | default | H | Y |
| Notifications (`/state-authority/notifications`) | list · detail | H | Y |

## 5. Finance Officer (login: ba.financeofficer)
| Screen (route) | States / steps | Mode | Design |
|---|---|---|---|
| Dashboard (`/finance-officer/dashboard`) | default | H | Y |
| Queue (`/finance-officer/queue`) | list · **disbursement / approve** modal · confirm success | H + A | Y |
| Transactions (`/finance-officer/transactions`) | list · transaction detail | H + A | Y |
| Utilisation (`/finance-officer/utilisation`) | charts default | H | — |
| Notifications (`/finance-officer/notifications`) | list · detail | H | Y |

## 6. Central Authority (login: ba.centralauthority)
| Screen (route) | States / steps | Mode | Design |
|---|---|---|---|
| Dashboard (`/central-authority/dashboard`) | default | H | — |
| Fund Allocation (`/central-authority/fund-allocation`) | list · **allocation form / modal** · success | H + A | Y |
| Grievances (`/central-authority/grievances`) | list · filters | H | — |
| State Comparison (`/central-authority/state-comparison`) | charts | H | — |
| Scheme Performance (`/central-authority/scheme-performance`) | charts | H | — |
| Reports (`/central-authority/reports`) | default | H | — |
| Notifications (`/central-authority/notifications`) | list · detail | H | Y |

## 7. System Admin (login: nhapoa_sysadmin)
| Screen (route) | States / steps | Mode | Design |
|---|---|---|---|
| Dashboard (`/admin/dashboard`) | default | H | — |
| Grievance Monitoring (`/admin/grievances`) | list · filters · row detail | H + A | Y |
| SLA Monitor (`/admin/sla-monitor`) | default | H | — |
| Officer Performance (`/admin/officer-performance`) | default | H | — |
| Analytics (`/admin/analytics`) | charts | H | — |
| Geographic (`/admin/geographic`) | map view | H | — |
| Reports / Export (`/admin/reports`) | default · export | H | Y |
| User Management (`/admin/users`) | list · **create-user** modal · **edit-user** modal | H + A | Y |
| Role Management (`/admin/roles`) | list · **role editor / permissions** modal | H + A | Y |
| Grievance Categories (`/admin/categories`) | list · **add / edit category** modal | H + A | — |
| Notifications (`/admin/notifications`) | list · detail | H | Y |

---

### Totals (approx.)
- **7 roles** (incl. SHO) + public Citizen + admin auth.
- **~48 base screens** across all roles.
- **~30 additional states/steps** (wizard steps, modals, empty/error/success) captured via the
  assisted browser.
- **~29 designed frames** to pair against; the rest are undesigned (build-only) → audited vs the
  visual language and routed to Design Suggestions.

### Open questions for you
1. **Multi-step forms:** OK to fill with obvious dummy data (e.g. "Test Victim", mobile 9800000000)?
   Any fields I should NOT submit on UAT (e.g. avoid actually triggering an SMS/OTP or a real
   disbursement)?
2. **Destructive actions** (approve / reject / disburse / delete user): capture the **modal only**
   and cancel — i.e. don't actually commit changes on UAT? (my default)
3. Anything here to **add or drop** before we start capturing Citizen (role 1)?
