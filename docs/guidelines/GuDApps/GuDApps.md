# Guidelines for Development of e-Governance Applications (GuDApps)

> National Informatics Centre (NIC), Ministry of Electronics and Information Technology (MeitY), Government of India, New Delhi.

> **Note on this file:** This is a plain-language summary of the official GuDApps PDF, written to sit alongside our DBIM 3.0, GIGW 3.0 and UX4G source documents. It captures the document's identity, objectives, main guideline areas and key facts. The full original text and figures live in `GuDApps.pdf` in this folder. Wording of specific facts (identifier structures, version numbers, ISBN) is taken directly from the source. Source references are written as "Source: GuDApps PDF (NIC-GDL-DA-1.1)".

---

## Contents

- [1. What this document is](#1-what-this-document-is)
- [2. How GuDApps relates to GIGW](#2-how-gudapps-relates-to-gigw)
- [3. Objectives (the three stated goals)](#3-objectives-the-three-stated-goals)
- [4. Scope (the main guideline areas)](#4-scope-the-main-guideline-areas)
- [5. Data Quality (Chapter 2)](#5-data-quality-chapter-2)
- [6. Authentication (Chapter 3)](#6-authentication-chapter-3)
- [7. Forms (Chapter 4)](#7-forms-chapter-4)
- [8. Reports (Chapter 5)](#8-reports-chapter-5)
- [9. Application Development Frameworks (Chapter 6)](#9-application-development-frameworks-chapter-6)
- [10. Compliance Matrix and Case Study (Appendices)](#10-compliance-matrix-and-case-study-appendices)
- [11. How this fits the Unified Guidelines](#11-how-this-fits-the-unified-guidelines)

---

## 1. What this document is

GuDApps is a NIC guideline that tells government teams how to build good-quality e-Governance **applications**. It is plain best-practice guidance for the people who design and code government software.

| Item | Value |
| --- | --- |
| Full title | Guidelines for Development of e-Governance Applications (GuDApps) |
| Document number | NIC-GDL-DA-1.1 |
| Publisher | National Informatics Centre (NIC), Ministry of Electronics & Information Technology (MeitY), New Delhi |
| Version | 1.1 (version 1.0 was dated 2 May 2017) |
| Date of this version | 29 August 2017 |
| ISBN | 978-81-909457-1-4 |
| Approximate length | About 172 pages |
| Mandatory? | No. The document says plainly: "such guidelines are not mandatory." They are a set of recommended practices. |

**Who wrote it (Source: GuDApps PDF, NIC-GDL-DA-1.1):**

- Prepared by NIC scientists: Smt. Alka Mishra, Sh. Joydeep Shome, Sh. Pawan Kumar Joshi, Smt. Rachna Srivastava, Sh. Rajender Sethi, Smt. Rama Hariharan (all Scientist F), and Dr. Rajesh Kumar Mishra (Scientist E).
- Reviewed by: Sh. Girish Kumar Gaur (Scientist G) and Dr. (Smt.) Savita Dawar (Scientist F).
- Approved by: Smt. Neeta Verma, Director General, NIC.

In its own words, the document "provides guidelines for building quality e-Governance applications" covering "data quality parameters, user interface, report design, authentication and software frameworks," and expects that using them "will lead to better data quality and faster delivery of robust e-Governance applications."

---

## 2. How GuDApps relates to GIGW

GuDApps **complements GIGW** — it does not replace it. The two cover different things:

- **GIGW** ("Guidelines for Government Websites") covers government **websites and apps** — their quality, accessibility, security and lifecycle.
- **GuDApps** fills a gap GIGW does not address: the standardisation of **application architecture, user interface, validations and data architecture**.

The document states the reason directly: "For web sites/web applications, the GIGW are put in place. But there are no guidelines/best practices available for standardization of application architecture, User Interface, validations and data architecture. This has resulted in applications which are not reusable and interoperable." GuDApps was written to close that gap. (Source: GuDApps PDF, NIC-GDL-DA-1.1, §1.1 Purpose.)

A Technical Advisory Group was set up to develop enterprise software quickly by re-using what already exists, "without compromising the quality and reinventing the wheel." GuDApps is meant to act as a guiding document for major ICT projects so the effort stays integrated, coordinated and standards-based.

---

## 3. Objectives (the three stated goals)

GuDApps states three goals:

1. **Ensure development of quality software solutions.**
2. **Build enterprise software quickly by re-using existing resources** rather than reinventing the wheel.
3. **Streamline software processes for e-Governance applications with consistent interfaces** — so development is more predictable and system interactions are better.

(Source: GuDApps objectives, as published on guidelines.india.gov.in and reflected in the PDF's Introduction.)

---

## 4. Scope (the main guideline areas)

The guideline focuses on the components of "assured quality" for e-Governance applications. Its scope covers four broad areas (Source: GuDApps PDF, §1.2 Scope):

- **Data Quality** — data dictionary, validation/verification, availability and presentation; grouping and referential integrity; identifiers; reference/code directories.
- **Authentication** — authentication levels, types, implementation and best practices.
- **Forms and Reports design** — design principles, form structure, reporting frameworks, validation/verification, document upload and storage, security, and so on.
- **Application Development Framework** — design patterns, components, parameters, and Java and PHP frameworks.

These map to the document's main chapters: 1. Introduction, 2. Data Quality, 3. Authentication, 4. Forms, 5. Reports, 6. Application Development Frameworks, followed by Appendices A–I.

---

## 5. Data Quality (Chapter 2)

Why it matters: the document calls data "a critical asset of the government" that increasingly drives policy decisions and benefit transfers, so the quality of data captured by applications must be assured.

### Data Element

A data element (also called a data item or field) is "the smallest piece of data that has meaning, which need not be broken further" (for example, a student name or enrolment number). The guideline says you must take care of these attributes throughout the software lifecycle (requirement gathering, database design, user interface, implementation). Attributes covered include:

- **Data Identification** — element name, aliases, description, data source, whether the value is base or derived, and privacy/security.
- **Data Size** — data type and data length.
- **Data Domain** — acceptable values, default values, and whether the field is mandatory or optional.
- **Validations** and **Verification**.
- **Data Availability**.
- **User Interface for input** — generic interface guidance, input using a list of values, input using search, the field caption, and the output format.
- **Metadata Standards**.

Naming convention for common data elements: **Snake Case** (lower case with words joined by single underscores), with no abbreviations. For example, `aadhaar_number` should be used — not `adhar_no`, `aadhar_no`, `aadhaar_no`, `aadhar_number`, etc.

### Record Element

Covers **record identification** and **record-level validation** (checks that apply across a whole record, not just one field).

### Data Functions

Covers **table identification** (table name and the primary key for a table) and **referential integrity** (keeping linked tables consistent).

### Identifiers

The guideline gives criteria for defining a new identifier and then describes common Indian identifiers. Key structures, as stated in the PDF:

| Identifier | Structure (as stated in GuDApps) |
| --- | --- |
| **Aadhaar** | A 12-digit random number issued by UIDAI to residents of India. All 12 characters are digits; the first eleven are a random number and the last is a check digit calculated using the Verhoeff algorithm. |
| **PAN (Permanent Account Number)** | A 10-character alphanumeric identifier issued by the Income Tax Department (example form: ABNPA0061H). First five characters are letters, next four are numerals, last is a letter. The 4th character indicates the type of holder; the 5th is the first character of the surname (personal) or entity name. The last character is an alphabetic check digit. It has built-in business meaning, which is noted as a drawback. |
| **DISE Code** (District Information System for Education) | An 11-character code (AABBCCDDDEE): first two characters are the State code, first four the district code, then block, village and school codes. It carries built-in business meaning and has no check digit. |
| **LIN (Labour Identification Number)** | A 10-digit random number issued by the Ministry of Labour & Employment (structure V-9999-9999-C). All digits; the first is reserved for versioning (9 reserved for foreign entities), the next eight are random, and the 10th is a check digit based on the Verhoeff algorithm. |
| **IFSC (Indian Financial System Code)** | An 11-character alphanumeric code identifying a bank branch. First four characters (alphabetic) are the bank name; the 5th is 0 (zero), reserved for future use; the last six identify the branch. |

The chapter also points to **Guidelines for Common Data Elements**, whose detailed specifications appear in the appendices.

### Document storage (cross-reference)

Detailed guidance on storing uploaded documents appears in the Forms chapter (see Section 7 below) — Relational DB vs File System vs NoSQL — and is part of the overall data-quality story.

---

## 6. Authentication (Chapter 3)

### Authentication levels

- **Single-factor authentication** — one factor (for example, a password). The document notes this offers limited protection from misuse.
- **Two-factor authentication (2FA)** — two factors.
- **Multi-factor authentication** — more than two factors.

### Authentication types

- **HTTP Basic Authentication**
- **Form Based Authentication**
- **Digital Certificates (SSL and TLS)** — certificate-based
- **One Time Password (OTP)**
- **Biometric Authentication**

### Implementation of authentication

The guideline describes how to implement each approach:

- HTTP Basic / Form Based authentication.
- Authentication **using a Database**.
- Authentication **using LDAP**.
- **Certificate-based** authentication.
- **One Time Password** based authentication, including a custom application-generated OTP, **Aadhaar-based OTP**, and **Time-based OTP (TOTP)**.
- **Biometric-based** authentication (including Aadhaar-based biometric).

For Aadhaar-based OTP, the guideline notes that authentication is provided by UIDAI, the Aadhaar number should be mandatory in the user profile, the Aadhaar field should be exactly 12 digits, the mobile number should be registered with Aadhaar, and seeding/updating of the Aadhaar number should be done only via the OTP service.

### Sign-up and login lifecycle

The chapter covers the full account lifecycle:

- **Ways to sign up** — using an application-specific user-id/password (online, offline, or bulk sign-up), using an official user-id/password (for example, NIC email), or using a social-networking user-id/password. Online sign-up includes email confirmation and setting the user-id/password by confirming the mobile number.
- **Recalling credentials** — separate flows for users with email/mobile (forgot user-id, forgot password) and users without email/mobile (reset by a nodal officer).
- **Ways to log in.**
- **Changing or deactivating credentials** — change password, request email de-activation, request mobile de-activation, deactivate user-id.

### Additional best practices

The chapter lists best practices including: stop automatic user creation, use CAPTCHA, **context-based authentication**, additional image-based profile verification, secure forgot-password flows (reset link, temporary password), profile/transactional passwords, security questions (it warns against easily-guessed questions like mother's maiden name), new-account activation links, **account locking**, and an **account audit policy**.

---

## 7. Forms (Chapter 4)

### User-centric approach

Forms should be designed around the user. The guideline frames a form as a **relationship** and a **conversation**, and gives guidance on appearance and on structuring the form (for example, ask only for what you really need, and ask questions in a natural order — the name before the date of birth, not after).

### Form elements

- **Labels** and **input fields** — text boxes, radio buttons, check boxes, dropdown lists and combo boxes, list boxes.
- **Actions** — Save, Submit and Continue are "Primary Actions" that help achieve the form's main objective; actions that run counter to that objective should be played down.
- **Help text** — both form-level instructions and inline instructions.

### Form validations

- **Validation methods** — server-side validation and client-side validation.
- **Validation types** and **validation feedback** (telling the user clearly what went wrong).

### Document upload, storage and management

This is a substantial part of the chapter:

- **Document upload** — typical use-case scenarios; functional and operational issues; advisories on image-file upload; restrictions on document type and extension; restrictions on file size, and file resizing.
- **Security vulnerabilities** — typical forms of malicious attack via file upload (overwriting files, hidden malicious code, web-shells, XSS/client-side attacks, Denial of Service by huge files, files executable by URL), the consequences (system takeover, denial of service, phishing pages, data theft), and how to defend (use a white-list of allowed file types; reject script/program files such as .php, .jsp, .asp; disallow special characters and more than one dot in file names; validate against evasion tricks like `evilimage.php.jpg`; check that MIME-type matches the extension; render images to confirm authenticity).
- **Storage options** — Relational DB vs File System vs NoSQL DB, with their trade-offs.
- **Document management.**

The chapter also provides a checklist that can be used to validate a designed form.

---

## 8. Reports (Chapter 5)

The document calls reports "the soul of any information system" — they let managers and decision-makers evaluate processes and make informed decisions. Key points:

- **Analyse user scenarios and know your user** — different audiences (field officers, senior management, the general public) need different things. Report categories include MIS / Monitoring / Performance and Exceptional reports.
- **Query filter** — set the report up via a query-filter page where the user tailors parameters; provide self-explanatory labels, sensible defaults, and a Help button describing parameters, columns and calculations.
- **Report layout** — a report header (title, logos, help link, download options such as Excel/CSV/XML/Word/PDF, email-share, print), a page header (generation date, search, the chosen query parameters), and a report body (a clearly labelled table and/or charts; avoid acronyms or explain them in the footer).
- **Emphasise important information**, and **format and paginate** the report.
- **Make the report distributable** — by email, print or web.
- **Design a database specifically for reports** — covers transactional vs reporting databases, when to build a separate reporting database, its advantages, and best practices for building one.
- **Reporting frameworks** — frameworks can pull data from multiple sources (CSV, Excel, different RDBMS, web services); output in HTML, XML, CSV, JSON, PDF; add charts and interactivity; present data in cross-tabs; design multi-page and drill-down reports; and localise text into state-specific languages using resource bundles.

---

## 9. Application Development Frameworks (Chapter 6)

A framework is "a set of common and prefabricated software building blocks" that developers extend or customise, so they "do not have to start from scratch each time." Using one lets teams focus on the application's unique needs instead of infrastructure "plumbing," for faster, more robust delivery.

### Framework design patterns

- **Inversion of Control** — the overall flow of control is dictated by the framework, not the caller.
- **Extensibility** — users extend the framework, usually by selective overriding or adding specialised code.
- **Non-modifiable framework code** — users may extend the framework but should not modify its own code.

### Components and parameters

- **Packages/Wrappers** — repackage functions to simplify use, keep interfaces consistent, and enhance core functionality.
- **Architecture** and **Design Pattern** — including **Model-View-Controller (MVC)** and the distinction between **push-based and pull-based** frameworks.
- **Methodology.**

### Named frameworks

| Platform | Frameworks named in GuDApps |
| --- | --- |
| **Java** | Apache Struts, Spring, JSF |
| **PHP** | Laravel, Symfony, CodeIgniter, CakePHP, Slim |

The PHP section gives a summary table comparing each framework's pros, cons and required PHP version (for example, Laravel and Symfony are noted as requiring PHP 5.5.9; Slim is described as a micro-framework good for RESTful APIs).

---

## 10. Compliance Matrix and Case Study (Appendices)

GuDApps ships with its **own** compliance tools, which are separate from GIGW's Annexure II conformity matrix:

- **Appendix G — Compliance Matrix.** A checklist that identifies the clauses containing guideline requirements to address during application development. A project can be scored against it; each section is treated as a recommendation, with responses such as Yes / No / Partial and a "reason if no" column.
- **Appendix H — Case Study for Compliance Matrix on Data Quality.** A worked example that applies the matrix to a real project and arrives at a compliance percentage. In the worked example, the project is assessed as **78.29% compliant** with the Data Quality guidelines.
- **Appendix I — References** (references for data elements).

The other appendices supply reference data: A. Office Orders; B. Code Directories; C. Common Data Elements; D. Person-Specific Data Elements; E. Geo-Reference Data Elements; F. Labour & Employment Data Elements.

**Important:** This Compliance Matrix is GuDApps' own. It is distinct from the GIGW 3.0 Annexure II conformity matrix and from the STQC CQW certification process. GuDApps compliance is self-assessed and is not mandatory.

---

## 11. How this fits the Unified Guidelines

GuDApps is the **fourth official source** in this project, alongside DBIM 3.0, GIGW 3.0 and the UX4G Handbook. Where GIGW and DBIM concentrate on websites, brand identity and accessibility, GuDApps adds the application-side concerns — data quality, authentication, forms, reports and development frameworks.

GuDApps content is reflected in the unified guidelines chapter **`11-mobile-apps`**, where the application-development guidance sits next to the website-focused material from the other three sources.

---

*Source document: `GuDApps.pdf` in this folder. Citations above are written as "Source: GuDApps PDF (NIC-GDL-DA-1.1)". This summary does not invent any value not present in the source; figures and detailed appendix tables remain in the PDF.*
