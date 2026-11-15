# Prototype decision model

This design isolates a future verified clause reference corpus from an evaluation engine. The initial rules in `src/rules.synthetic.js` are **fictional** and should never be used for contract drafting.

## Rule contract

- Stable rule ID, human-readable title, explicit version
- Source label and rationale (future version must include verified text, publication date, and citation)
- One or more applicability conditions based on normalized subcontract context
- Explicit proposed action when *all* conditions match
- Condition-by-condition evidence retained in output
- `verified: false` until independently reviewed

## Safety behavior

- Missing or conflicting context becomes **review**, never a silent include or exclude.
- A condition mismatch becomes **review**, not an inferred exclusion.
- An exclusion requires an explicit exclusion rule with fully matched conditions.
- A fictional rule match is not a legal determination; a human must review the source and applicability.
- Rules cannot infer missing prime-contract clauses or current regulations. That requires a separately approved, versioned reference source.

## Production prerequisites

Obtain public/current official FAR, DFARS, and applicable agency supplements; map clause prescriptions and subcontract paragraphs; record effective dates and conflicts; and prepare blinded expert-reviewed Chugach reference cases in an approved private environment. Do not store CUI in this public repository.
