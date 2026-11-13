import test from 'node:test';
import assert from 'node:assert/strict';
import {extractReferences} from '../src/extract.js';
test('finds candidate identifiers with line provenance', () => {
  const result=extractReferences('Heading\nFAR 52.222-26 sample\nDFARS 252.204-7012 example');
  assert.deepEqual(result.map(({identifier,line})=>({identifier,line})),[{identifier:'52.222-26',line:2},{identifier:'252.204-7012',line:3}]);
  assert.ok(result.every(x=>x.status==='unverified'));
});
test('deduplicates within a line, preserving separate lines',()=>{
  assert.equal(extractReferences('52.222-26 and 52.222-26\n52.222-26').length,2);
});
test('does not invent references and enforces input limits',()=>{
  assert.deepEqual(extractReferences('No identifiers here'),[]);
  assert.throws(()=>extractReferences('abc',{maxCharacters:2}),RangeError);
});
