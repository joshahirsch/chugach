import test from 'node:test';
import assert from 'node:assert/strict';
import {createReviewCsv} from '../src/export.js';

test('CSV export includes reviewer decisions and escapes quotes and commas',()=>{
  const csv=createReviewCsv([{id:'S-1',title:'Example, "term"',status:'review',source:'Fictional',reason:'Requires inspection'}],{'S-1':'override'});
  assert.match(csv,/"Example, ""term"""/);
  assert.match(csv,/"override"/);
  assert.equal(csv.split('\r\n').length,2);
});
test('CSV export neutralizes spreadsheet formula prefixes',()=>{
  const csv=createReviewCsv([{id:'S-2',title:'=1+1',status:'review',source:' @SUM(1)',reason:'-test'}],{});
  assert.ok(csv.includes('"\'=1+1"'));
  assert.ok(csv.includes('"\' @SUM(1)"'));
  assert.ok(csv.includes('"\'-test"'));
  assert.ok(csv.includes('"pending"'));
});
