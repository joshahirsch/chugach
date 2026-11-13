import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const labels=new Set(['include','exclude','review']);
const fraction=(n,d)=>d?Number((n/d).toFixed(4)):null;
function check(items,context){
  if(!Array.isArray(items))throw new Error(`Missing items in ${context}`);
  const ids=new Set();
  for(const x of items){if(!x||typeof x.id!=='string'||!x.id.trim()||!labels.has(x.label)||typeof x.source!=='string'||ids.has(x.id))throw new Error(`Invalid or duplicate item in ${context}`);ids.add(x.id);}
}
export function scoreDataset(truth,output){
  if(truth.dataset!==output.dataset)throw new Error('Dataset mismatch');
  if(!Array.isArray(truth.cases)||!Array.isArray(output.predictions))throw new Error('Cases and predictions required');
  const expectedIds=new Set(truth.cases.map(c=>c.id));
  if(expectedIds.size!==truth.cases.length)throw new Error('Duplicate case in reference');
  const predictions=new Map();
  for(const p of output.predictions){if(!expectedIds.has(p.caseId)||predictions.has(p.caseId))throw new Error('Unknown or duplicate prediction case');predictions.set(p.caseId,p);}
  const t={expectedInclude:0,correctInclude:0,proposedInclude:0,falseInclude:0,missedInclude:0,expectedExclude:0,correctExclude:0,expectedReview:0,correctReview:0,correctSourceAndLabel:0,expectedItems:0,unexpectedIds:0};
  const cases=[];
  for(const c of truth.cases){
    check(c.expected,c.id);const rows=predictions.get(c.id)?.items??[];check(rows,c.id);const proposed=new Map(rows.map(x=>[x.id,x]));const expected=new Map(c.expected.map(x=>[x.id,x]));const missed=[];
    for(const x of c.expected){const p=proposed.get(x.id);t.expectedItems++;if(x.label==='include'){t.expectedInclude++;if(p?.label==='include')t.correctInclude++;else{t.missedInclude++;missed.push(x.id);}}if(x.label==='exclude'){t.expectedExclude++;if(p?.label==='exclude')t.correctExclude++;}if(x.label==='review'){t.expectedReview++;if(p?.label==='review')t.correctReview++;}if(p?.label===x.label&&p.source.trim()&&p.source.trim()===x.source.trim())t.correctSourceAndLabel++;}
    for(const p of rows){if(p.label==='include'){t.proposedInclude++;if(expected.get(p.id)?.label!=='include')t.falseInclude++;}if(!expected.has(p.id))t.unexpectedIds++;}
    cases.push({id:c.id,missedRequired:missed});
  }
  return {dataset:truth.dataset,totals:t,metrics:{requiredRecall:fraction(t.correctInclude,t.expectedInclude),includePrecision:fraction(t.correctInclude,t.proposedInclude),missedRequired:t.missedInclude,falseInclusions:t.falseInclude,excludeAccuracy:fraction(t.correctExclude,t.expectedExclude),reviewAccuracy:fraction(t.correctReview,t.expectedReview),sourceAndLabelAgreement:fraction(t.correctSourceAndLabel,t.expectedItems)},cases};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
  const [truthPath,predictionPath]=process.argv.slice(2);
  if(!truthPath||!predictionPath){console.error('Usage: npm run evaluate -- truth.json predictions.json');process.exit(2);}
  try{const result=scoreDataset(JSON.parse(readFileSync(truthPath,'utf8')),JSON.parse(readFileSync(predictionPath,'utf8')));console.log(JSON.stringify(result,null,2));if(result.totals.missedInclude||result.totals.falseInclude||result.totals.unexpectedIds)process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=2;}
}
