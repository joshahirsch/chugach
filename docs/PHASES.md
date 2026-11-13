# Phased proof-of-concept plan

## Phase 0 — Discovery and safety gate (current)
- Confirm the single-purpose workflow with Jonathan.
- Obtain only public or synthetic prime clauses, scope, and expert-reviewed output examples.
- Agree on a review rubric: mandatory inclusion recall, false inclusion rate, source traceability, override handling.
- Decide whether any later nonpublic/CUI processing is permissible; **no CUI in this demo**.

**Exit:** sample pack and measurable evaluation criteria approved.

## Phase 1 — Interaction scaffold (current)
- Scenario selector, three decision categories, source/reason display.
- Human accept/override workflow and downloadable review CSV.
- Synthetic fixtures only, no model/API calls or real contract analysis.

**Exit:** stakeholders can click through a realistic review concept.

## Phase 2 — Controlled document and rule experiments
- First slice: browser-only plain-text intake detects FAR/DFARS-like references with line provenance; no applicability judgment.
- Second slice: browser-only PDF/DOCX text extraction with size/page limits; no upload or application persistence.
- Add client-side file ingestion for permitted public/synthetic PDFs and DOCX.
- Parse clause inventory and preserve page/section provenance.
- Establish a versioned regulatory reference corpus and explicit applicability rules.
- Keep uncertain or unproven conclusions in the additional-review queue.

**Exit:** repeatable extraction tests on a bounded sample corpus.

## Phase 3 — AI-assisted comparison and validation
- Add a secured adapter for a specifically approved model and hosting environment.
- Compare candidate clauses against expert-reviewed answer sets.
- Report false negatives and false positives separately; retain full citation evidence.
- Fail closed: missing source, ambiguous applicability, or unsupported context -> human review.

**Exit:** measured results and documented limitations, not a blanket accuracy claim.

## Phase 4 — Jonathan demonstration and decision
- Walk through public/synthetic scenario, excluded-clause rationale, overrides, export.
- Present evaluation metrics, unresolved failure modes, and next-stage investment.
- Scope production security, CUI requirements, contract controls, and ownership separately.

**Exit:** go/no-go decision for a formal MVP.

## Explicit exclusions
No real contract conclusions, no confidential uploads, no client tenant, no Maximo/Power BI integration, no legal sign-off automation, no CUI processing, no automated subcontract execution.
