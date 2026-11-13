# Evaluation harness

Run `npm run evaluate -- evaluation/cases.synthetic.json evaluation/predictions.example.json`.

The example should report perfect agreement because the predictions copy the fictional reference labels. **This is a software sanity check, not proof of contractual or regulatory accuracy.**

## Metrics

- `requiredRecall`: proportion of reference include items also proposed as include. Missing ones are high-priority errors.
- `includePrecision`: proportion of proposed include items that reference data labels include. Over-inclusion is separately counted.
- `excludeAccuracy` and `reviewAccuracy`: agreement for those classifications.
- `sourceAndLabelAgreement`: exact matching on both classification and citation string. It does not prove the citation is legally valid.

Missing predictions count as misses. Unexpected IDs are counted separately. A future approved evaluation set should be independently prepared by Chugach procurement experts, versioned privately, and assessed with blind cases. No CUI or client documents belong in this public repository.
