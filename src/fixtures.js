// Deliberately fictional references. None represent actual contract requirements.
const core = [
{id:"SYN-001",title:"Illustrative safety provision",status:"include",source:"Synthetic prime § A.1",reason:"Demo assumption: the example scope contains on-site work; a reviewer must confirm the applicable source and prescription."},
{id:"SYN-002",title:"Illustrative unrelated service provision",status:"exclude",source:"Synthetic prime § B.4",reason:"Demo assumption: this fictional provision addresses a separate service category. Verify before excluding any real clause."},
{id:"SYN-003",title:"Illustrative bonding review",status:"review",source:"No synthetic prime clause; reviewer research required",reason:"Demonstrates an additional-to-review item that might require independent regulatory and contract analysis."}
];
export const fixtures = {
construction:{name:"Synthetic facility renovation",items:core},
supplies:{name:"Synthetic supply delivery",items:[
{id:"SYN-004",title:"Illustrative delivery provision",status:"include",source:"Synthetic prime § C.2",reason:"Demo assumption: delivery terms are relevant to this fictional supply scope."},
{id:"SYN-005",title:"Illustrative construction-only provision",status:"exclude",source:"Synthetic prime § D.3",reason:"Demo assumption: no construction activities appear in this example scope."},
{id:"SYN-006",title:"Illustrative sourcing review",status:"review",source:"Additional reviewer research required",reason:"Demonstrates a possible supplemental clause requiring human verification."}
]}
};