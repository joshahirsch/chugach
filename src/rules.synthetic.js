// Fictional rules. Never treat these as legal prescriptions.
export const syntheticRules = [
  {id:'SYN-RULE-01',title:'Illustrative facility safety term',source:'Fictional prime A.1',rationale:'Fictional site-work condition matches the example scope.',onMatch:'include',conditions:[{field:'scope',anyOf:['construction']}]},
  {id:'SYN-RULE-02',title:'Illustrative unrelated service carve-out',source:'Fictional prime B.4',rationale:'Fictional carve-out conditions match; human review still required before contract use.',onMatch:'exclude',conditions:[{field:'scope',anyOf:['construction']},{field:'subcontractType',anyOf:['fixed-price']}]},
  {id:'SYN-RULE-03',title:'Illustrative place-specific research item',source:'Fictional research prompt',rationale:'Requires independent research; never an automatic clause insertion.',onMatch:'review',conditions:[{field:'location',anyOf:['guam']},{field:'scope',anyOf:['construction']}]}
];
