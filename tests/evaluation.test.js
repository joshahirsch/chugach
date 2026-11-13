import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreDataset} from '../evaluation/score.js';
const truth={dataset:'T',cases:[{id:'c',expected:[{id:'a',label:'include',source:'A'},{id:'b',label:'exclude',source:'B'}]}]};
test('scores perfect reference agreement',()=>{const r=scoreDataset(truth,{dataset:'T',predictions:[{caseId:'c',items:truth.cases[0].expected}]});assert.equal(r.metrics.requiredRecall,1);assert.equal(r.metrics.sourceAndLabelAgreement,1);});
test('separates omissions and over-inclusion',()=>{const r=scoreDataset(truth,{dataset:'T',predictions:[{caseId:'c',items:[{id:'b',label:'include',source:'B'}]}]});assert.equal(r.metrics.missedRequired,1);assert.equal(r.metrics.falseInclusions,1);});
test('rejects malformed and duplicate input',()=>{assert.throws(()=>scoreDataset(truth,{dataset:'other',predictions:[]}));assert.throws(()=>scoreDataset(truth,{dataset:'T',predictions:[{caseId:'c',items:[{id:'x',label:'include',source:'X'},{id:'x',label:'include',source:'X'}]}]}));});
