# How a Grant Becomes Money: e-Anudaan and PFMS, Explained

**Source:** NeGD, *Integration of PFMS with the e-Anudaan Portal*, v1.0, 8 Sep 2026 (42 pages). Page numbers in brackets point to it.
**Checked against:** the prototype and the Figma handoff file on 1 Oct 2026. What is covered and what is not:
[`2026-10-01-e-anudaan-pfms-brd-verification.md`](./2026-10-01-e-anudaan-pfms-brd-verification.md).
**Written for:** a reader who has never heard of PFMS. Every term is explained the first time it appears.

> **In the prototype, PFMS is imitated.** Every bill, voucher and bank reference you see there is made up by the
> prototype itself. In the real system, NeGD's server will talk to PFMS. A screen that says "Paid" in the
> prototype shows a design, not a payment.

---

## The BRD on One Page

**What the BRD is.** A BRD (Business Requirements Document) lists what a system must do, before anyone builds it. This one was written by NeGD (the National e-Governance Division, which builds the portal) on 8 September 2026 [p. 4].

**The two systems.** e-Anudaan is the Ministry of Social Justice's portal for grants to NGOs (non-governmental organisations, such as charities that run de-addiction centres). PFMS (the Public Financial Management System) is the Government of India's system that actually releases money [p. 33].

**The problem today.** An NGO applies on e-Anudaan, and officers approve a grant there. After the approval, the papers leave the portal. Staff type the details into PFMS again by hand, which is slow and invites mistakes. e-Anudaan then loses sight of the money. Nobody can follow a grant from approval to bank in one place [pp. 5–6].

**What changes.** After the approval, two officers prepare and check a "payment advice" inside e-Anudaan. A payment advice is the official instruction to pay. e-Anudaan sends it to PFMS in one electronic message. It then keeps asking PFMS how the payment is doing, and tells the NGO when the money arrives [p. 6].

**Who is involved** [p. 11]:
- the **NGO**, which receives the grant;
- the **Programme Division**, where a **Maker** prepares the advice and a **Checker** approves it;
- the **Bureau** (the Ministry's scheme division), which keeps the PFMS settings right;
- **PFMS**, with its **DDO**, its **PAO** and the **bank**, which pay the money.

**One grant, from approval to bank** [pp. 24–25]:
1. The NGO applies and gives its bank details and PFMS payee code.
2. Officers review the application, as they do today.
3. The Under Secretary issues the sanction (the formal approval of the amount).
4. The Maker prepares the payment advice.
5. The Checker checks it and signs it digitally.
6. e-Anudaan sends it to PFMS in one message.
7. The DDO prepares the bill.
8. The PAO passes the bill.
9. The bank transfers the money and creates a UTR (the bank's reference number for the transfer).
10. e-Anudaan learns of the UTR and tells the NGO.

**The rules that matter most** [pp. 21–22, 31]:
- **Maker ≠ Checker.** The person who prepares a payment cannot approve it. (The BRD lists this as an assumption, not a rule.)
- **One bill, one message.** Each bill goes to PFMS in exactly one message, never in parts.
- **The sanction is final.** The Maker and Checker cannot change the amount or the sanction number.
- **The NGO hears only about real money.** It is told only when the bank confirms the credit.
- **A cancelled payment stays cancelled.** A fresh sanction must be started instead.
- **No bank details, no payment.** A file without confirmed bank details and payee code cannot go forward.

**Out of scope** [pp. 9–10]:
- cheque payments;
- every bill type other than the grant bill;
- any check of the bank account with PFMS before sanction;
- PFMS's own set-up;
- any change to the review chain.

**Still undecided** [p. 30]:
- the real account codes (the Bureau decides);
- PFMS scheme codes for SHRESTHA Mode 1 and SMILE (PFMS decides);
- PFMS registration and a test environment (PFMS provides);
- who holds the signing tokens (the Ministry decides);
- how SHRESTHA pays (the Ministry decides).

Twelve further questions are listed in [`2026-09-29-e-anudaan-pfms.md`](./2026-09-29-e-anudaan-pfms.md) §4.

---

## The NGO — Giving Its Details and Being Told

**What the NGO wants.** The NGO wants its grant in its bank account, without chasing anyone. It also wants to know when the money has arrived.

**Step 1: Give the bank details on the application.** On the application form, the NGO fills in its bank, account number, IFSC and branch. IFSC (Indian Financial System Code) is the 11-character code that names a bank branch. A new account number must be typed twice. If the two do not match, the form says so. Figma: *NGO / Apply for a Grant / Bank Account Details — Account Numbers Do Not Match*.

**Step 2: Give the PFMS payee code.** The form asks whether the account is registered on PFMS. If it is, the NGO types its PFMS payee code. This code is PFMS's own number for the NGO, like a roll number. The NGO then ticks a box to confirm the code is correct [p. 12]. Figma: *NGO / Apply for a Grant / Bank Account Details — PFMS Payee Code*.

**What can go wrong.** The NGO may not have the payee code yet. Then the officers cannot prepare a payment, and the file waits. The NGO sees a notice on *Project Bank Accounts*: "A Sanctioned Grant Is Waiting for Your PFMS Payee Code". It can add the code there. The code must be two letters and ten digits in the prototype. If it is not, the page says: "Enter the PFMS payee code as it appears on your PFMS registration: two letters and ten digits." Figma: *NGO / Project Bank Accounts / PFMS Payee Code Needed*.

A second problem is an incomplete bank section. Then the officer cannot issue the sanction at all. The prototype refuses with: "A sanction cannot be issued until the NGO supplies them." This refusal is built but not yet drawn in Figma.

**Step 3: Wait, and watch the application page.** Once the grant is sanctioned, the NGO's *Application Details* page shows a short payment status. It reads "Sanctioned" while the Ministry prepares the payment. It reads "Payment in Process" while PFMS and the bank work. Figma: *NGO / Application Details / Payment in Process*. Whether the NGO should see this before the credit is still open (question 7 in the record).

**Step 4: Be told when the money arrives.** The NGO is told only when the bank confirms the credit with a UTR [p. 17]. It is never told about steps in between. The notice gives three facts: the sanction order number, the amount credited and the UTR. Figma: *NGO / Notifications / Grant Credited* and *NGO / Application Details / Grant Credited*.

**What happens next.** Nothing more is needed from the NGO for this instalment. The Under Secretary can now open the next instalment for the NGO to claim.

---

## The Maker — Preparing the Payment Advice

**What the Maker wants.** The Maker is an officer in the Programme Division. The Maker wants to turn a final sanction into a correct payment instruction, quickly. A correct instruction means PFMS accepts it the first time.

**Step 1: Open the queue.** The Maker signs in and sees *Payment Advices*. It has five tabs: New, Returned by Checker, Not Accepted by PFMS, Drafts and On Hold. Files are listed oldest sanction first [p. 14]. Figma: *Officer / Payment Advices / New* and its four sibling tabs.

**Step 2: Sanction Header.** The Maker opens a file. The top of the screen is already filled in from the sanction order: number, date, amount, financial year and the IFD concurrence. IFD (Integrated Finance Division) concurrence is finance's agreement to the spending. The Maker cannot change any of this. The Maker chooses two things: the DDO and the PD code. The DDO (Drawing and Disbursing Officer) is the PFMS officer who will draw the bill. The PD code is the Programme Division's number at PFMS. The bill number appears as soon as a DDO is chosen. Fixed values, such as "528 — e-Payment", are shown and marked "Set by System". Figma: *Step 1 of 5 — Sanction Header*.

**Step 3: Heads of Account.** A head of account says which budget line pays. PFMS needs it as four codes: Function Head (13 digits), Object Head (2 digits), Category, and Grant Number (3 digits). A running total shows whether the amounts add up to the sanction. Figma: *Step 2 of 5 — Heads of Account*.

**Step 4: Beneficiary Payment.** The NGO's payee code, account and IFSC are shown, read-only. The Maker enters the gross amount, any deductions, and payee remarks of up to 25 characters. Figma: *Step 3 of 5 — Beneficiary Payment*.

**Step 5: Supporting Documents.** The Maker uploads the claim and the sanction order, and sometimes the bill and the PAO's pass order. The portal computes a SHA-256 fingerprint of each file. A fingerprint is a short code that changes if even one letter of the file changes. PFMS receives the fingerprint and a single-use link, never the file itself. Figma: *Step 4 of 5 — Supporting Documents*.

**Step 6: Submit.** The Maker reviews everything and presses *Submit for Authorisation*. A Claim Reference Number is taken from a pool PFMS issued in advance. The advice is then locked. Figma: *Step 5 of 5 — Review and Submit*, then *Payment Advice / With the Checker*.

**What can go wrong.** A missing choice is named beside its field, for example "Choose the DDO." Amounts that do not add up show "The amounts against the heads of account must add up to the sanction amount." Out-of-date master data stops submission: "Ask the Bureau to refresh it before submitting." Figma: *Step 1 of 5 — Errors*, *Heads Do Not Add Up*, *Not Ready to Submit*.

**What happens next.** The Checker acts. If the Checker returns it, the reason appears at the top of the advice. If PFMS refuses it, it comes back under *Not Accepted by PFMS*, in plain words. Figma: *Returned by the Checker*, *Not Accepted by PFMS*.

---

## The Checker — The Second Pair of Eyes

**What the Checker wants.** The Checker is a different officer in the Programme Division. The Checker wants to be sure the advice matches the sanction before any money moves. Two people are used so that no single officer can both write and approve a payment.

**Step 1: Open the queue.** The Checker sees *Authorisation Queue*, with two tabs: Awaiting Authorisation and Authorised by You. Figma: *Officer / Authorisation Queue / Awaiting Authorisation*.

**Step 2: Compare.** The screen *Approve and Sign* shows the sanction order on one side. The other side shows exactly what will be sent to PFMS. A line at the top says either "Agrees with the Sanction Order" or "Does Not Agree with the Sanction Order". Nothing on this screen can be edited [p. 16]. Figma: *Officer / Authorise Payment Advice / Approve and Sign*.

**Step 3: Decide.** The Checker chooses one of two answers.
- **Return to Maker.** The Checker must write a reason. The Maker reads it beside the advice. The sanction itself is not reopened. Figma: *Return to Maker — Reason Missing* shows what happens if the reason is left blank.
- **Approve and Sign.** The Checker plugs in their DSC and types its PIN. A DSC (Digital Signature Certificate) is the officer's electronic signature, kept on a USB token. The portal never sees or stores the PIN. Figma: *Approve and Sign (Dialog)*, then *Signing (Dialog)*.

**Step 4: Send.** On signing, e-Anudaan sends the advice to PFMS in one message. The dialog then shows one of three results.
- *Received by PFMS* — accepted.
- *PFMS Did Not Accept the Advice* — refused, with the reason in plain words. Nothing was created at PFMS. The advice goes back to the Maker.
- *Signed — Waiting to Resend* — PFMS could not be reached. e-Anudaan will send it again on its own.

**What can go wrong before signing.** Each problem has its own message and Figma dialog.
- No token plugged in: "Insert your DSC token, then try again." (*No DSC Token Found*)
- Signing program not running: "Start it, then try again." (*Signing Utility Not Running*)
- Certificate out of date: "Renew it with the certifying authority before signing." (*Certificate Has Expired*)
- The Checker prepared this advice themselves: "A payment advice must be authorised by an officer other than the one who prepared it." (*You Prepared This Advice*)
- The officer is not this DDO's designated Checker. The prototype refuses, but this message is not yet drawn.

**What happens next.** PFMS takes over. The Checker can follow the case on *Payment Status*.

---

## The Bureau — Keeping PFMS Set Up

**What the Bureau wants.** The Bureau (the Ministry's scheme division) wants every payment advice to start from correct settings. If a code is wrong, PFMS refuses the whole bill [p. 30].

**The front page.** *PFMS Set-Up* shows five counts at a glance. They are legacy files needing bank details, schemes without a PFMS code, and the age of the master data. Then come Claim Reference Numbers left, and Checker certificates needing renewal. Below them, a table says whether each scheme is ready. Figma: *Officer / PFMS Set-Up / Overview*.

**Its six regular jobs:**
1. **Heads of Account.** Record each scheme's PFMS scheme code and its allowed four-part codes. SMILE shows "Scheme Code Awaited" because PFMS has not given it one. SHRESTHA Mode 2 shows "Decision Awaited" because the Ministry has not chosen how it pays. Figma: *Heads of Account*.
2. **DDO and Division Codes.** Choose which DDOs pay each scheme, and see which are active for electronic bills. Figma: *DDO and Division Codes*.
3. **Master Data.** These are PFMS's own lists of offices and codes. NeGD's server is meant to refresh them on a schedule. The Bureau can also press *Refresh Master Data*. Data older than a day stops submissions. Figma: *Master Data*, *Master Data — Out of Date*.
4. **Claim References.** Draw a fresh batch of numbers from PFMS when a pool runs low. Figma: *Claim References*.
5. **Error Messages.** Reword the plain-language message for a PFMS error code. Figma: *Error Messages*, *Edit Message (Dialog)*.
6. **Maker and Checker.** For each DDO, name the Maker and the Checker, and record the Checker's certificate serial and expiry date. The Under Secretary can do this too. Figma: *Maker and Checker*, *Edit Maker and Checker (Dialog)*.

**Legacy files.** Some files were sanctioned before this system and have no bank details. The Bureau enters them under *Legacy Files*. The account number is typed twice, and only its last four digits are kept. The Bureau ticks that it checked the details against the file. The same page lists advices whose head of account must be updated ("Heads to Retrofit"). Figma: *Officer / Legacy Files / Bank Details Needed*, *Enter Bank Details (Dialog)*, *Heads to Retrofit*.

**What can go wrong.** Two officers cannot be both Maker and Checker for one DDO: "The Maker and the Checker must be different officers." A scheme code must be numeric: "Enter the numeric PFMS scheme code PFMS allotted, for example 3817."

**What the BRD has not decided.** The real codes. Until the Bureau finalises them, every code in the prototype is a stand-in [p. 30]. SHRESTHA Mode 1 is not in the prototype at all, and no screen yet adds a new scheme.

---

## PFMS, the DDO, the PAO and the Bank — Outside e-Anudaan

**What they do.** These four work outside e-Anudaan. e-Anudaan can only ask them for news [pp. 23–24].

- **PFMS** receives the payment advice. It is the government's payment system, run by the Controller General of Accounts.
- **The DDO** (Drawing and Disbursing Officer) receives the sanction inside PFMS. The DDO prepares the grant bill and signs it digitally. The bill type is RPR-34, the Grants-in-Aid bill. RPR stands for the Receipt and Payment Rules.
- **The PAO** (Pay and Accounts Office) checks the bill. Several people there pass it in turn. Then the PAO sends the payment to the bank.
- **The bank** transfers the money to the NGO's account. It records the transfer in its daily "scroll", its settlement list. It creates a UTR (Unique Transaction Reference) as proof.

**How e-Anudaan follows them.** e-Anudaan's server asks PFMS for the latest status at regular times [p. 17]. PFMS uses over 25 status codes, such as `PendingDSCBatchFileGenerationSign1`. e-Anudaan never shows these codes. It turns them into nine plain stages, in this order:
1. Awaiting Payment Advice
2. Advice in Preparation
3. Awaiting Authorisation
4. Received by PFMS
5. Bill with DDO
6. Being Passed at PAO
7. Payment in Process
8. Paid
9. Closed

A payment can also step off this path. These are the exception states:
- **Returned by Checker** — back with the Maker.
- **Not Accepted by PFMS** — PFMS refused it; back with the Maker.
- **Waiting to Resend** — PFMS could not be reached; e-Anudaan will retry.
- **Returned by PFMS** — sent back inside PFMS.
- **Returned and Cancelled** — final; a fresh sanction is needed.
- **Financial Year Expired** — final; the year closed before payment.

Figma shows them on *Officer / Payment Status / …* (for example *Bill with DDO*, *Paid*, *Returned and Cancelled*). Two of the six exceptions are not drawn: Returned by PFMS and Financial Year Expired.

**What can go wrong.**
- **PFMS rejects the data.** The Maker sees the reason and fixes it.
- **PFMS is down.** The case waits and is resent; the rest of the portal keeps working.
- **The bill comes back cancelled.** The case shows the reason and *View Return Order*. A cancelled sanction cannot be revived; a fresh one must start [p. 21]. Who starts it is not yet decided (question 3).
- **The bank fails the credit.** The BRD does not say what happens next.

**What happens next.** When every payee has a UTR, the stage becomes Paid and the NGO is told. PFMS closes the sanction some days later.

---

## Officers Reading Reports — The Six Dashboards

**What they want.** Senior officers, such as the Joint Secretary, want to know where every grant's payment stands. They also want to know what is stuck, and whether PFMS's figures match the Ministry's. Payment Reports has six tabs [p. 32]. Every tab can be narrowed to one scheme. Each card is marked as illustrative in the prototype.

1. **Sanction Pipeline.** How many files sit at each of the nine stages, and how many are off the usual path or on hold. Clicking a tile filters the list below. Figma: *Officer / Payment Reports / Sanction Pipeline*.
2. **Ageing.** Every advice still in progress, DDO by DDO, with the days since it last moved. The officer sets a threshold; the prototype starts at 15 days. Older cases are flagged "Over 15 days". Figma: *Ageing*.
3. **Disbursement Reconciliation.** For each paid case, the sanctioned amount, the credited amount and the UTR. These are checked against PFMS's release feed (the Ministry Release and Transfer Entry data). Each row reads "Matched", "Amount Differs", "UTR Differs" or "Not in Release Feed". *Pull Release Feed* fetches the latest. Charts show credits by scheme and by DDO. Figma: *Disbursement Reconciliation*.
4. **Failure Trend.** How often PFMS refused advices, by month and by kind of error. A rising bar points to a data problem worth fixing at the source. Figma: *Failure Trend*.
5. **Claim Reference Pool.** For each PD code and year: numbers drawn from PFMS, numbers used, numbers left. Drawn always equals used plus left. Figma: *Claim Reference Pool*.
6. **Turnaround.** Days from sanction to the bank's confirmation, per scheme: the average, and the longest case. Figma: *Turnaround*.

**What can go wrong.** A report with nothing to show says so plainly. For example: "Every payment advice in progress has moved within 15 days."

**What happens next.** A flagged case is opened from its row, and its *Payment Status* page shows who holds it now.
