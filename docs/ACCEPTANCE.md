# Prototype acceptance checklist

- [ ] A reviewer can load each synthetic scenario without network access.
- [ ] Included, excluded, and additional-review candidates all display a rationale and source label.
- [ ] Reviewer decisions can be marked as accepted or overridden.
- [ ] CSV includes every candidate and human decision, regardless of active filter.
- [ ] No external model/API endpoint or storage of user-entered text is introduced.
- [ ] All UI surfaces display the synthetic-only / not-for-contract-use warning.
- [ ] Public repo contains no real Chugach documents, credentials, CUI, export-controlled data, or internal architecture.
- [ ] Demo is explicitly described as an interaction concept, not validated clause analysis.
- [ ] Plain-text intake identifies unverified reference candidates with correct line numbers and no network requests.

## Validation plan for later phases
Create a blinded comparison against independently prepared Chugach clause sets. Report omission rate, over-inclusion rate, exact citation accuracy, reviewer disagreement, and time to complete. Do not make a 98% accuracy claim without a defined denominator, sample design, and repeatable test results.
