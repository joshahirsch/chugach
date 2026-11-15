import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateRule,evaluateRules} from '../src/decision-engine.js';
import {syntheticRules} from '../src/rules.synthetic.js';
const context={scope:'construction',location:'guam',subcontractType:'fixed-price'};
test('evaluates fully matched fictional rule with traceable conditions',()=>{
  const result=evaluateRule(syntheticRules[0],context);
  assert.equal(result.status,'include');assert.equal(result.verified,false);assert.equal(result.evidence[0].result,'match');assert.ok(result.source);
});
test('matching explicit exclusion rule is distinguishable from unverified absence',()=>{
  assert.equal(evaluateRule(syntheticRules[1],context).status,'exclude');
  assert.equal(evaluateRule(syntheticRules[1],{scope:'supplies',subcontractType:'fixed-price'}).status,'review');
});
test('missing and partial context always become review',()=>{
  assert.equal(evaluateRule(syntheticRules[0],{}).status,'review');
  assert.equal(evaluateRule(syntheticRules[2],{scope:'construction'}).status,'review');
});
test('research-only rule remains in human review even when fictional conditions match',()=>{
  const result=evaluateRule(syntheticRules[2],context);
  assert.equal(result.status,'review');
  assert.match(result.reason,/independent research/);
});
test('invalid rule shapes and duplicate ids fail explicitly',()=>{
  assert.throws(()=>evaluateRule({id:'x',title:'X',source:'S',rationale:'R',onMatch:'include',conditions:[{field:'unknown',anyOf:['a']}]},{}));
  assert.throws(()=>evaluateRules([syntheticRules[0],syntheticRules[0]],context));
});
