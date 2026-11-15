/**
 * Illustrative rule evaluator. Its rules and citations are synthetic.
 * Unknown inputs never become automatic exclusions or inclusions.
 */
const STATES = new Set(['include', 'exclude', 'review']);
const CONDITIONS = new Set(['scope', 'location', 'subcontractType']);

export function validateRule(rule) {
  if (!rule || typeof rule.id !== 'string' || !rule.id.trim() || typeof rule.title !== 'string' || !rule.title.trim()) throw new Error('Rule requires id and title');
  if (typeof rule.source !== 'string' || !rule.source.trim() || typeof rule.rationale !== 'string' || !rule.rationale.trim()) throw new Error(`Rule ${rule.id} lacks source or rationale`);
  if (!STATES.has(rule.onMatch) || rule.onMatch === 'review') throw new Error(`Rule ${rule.id} requires include/exclude onMatch`);
  if (!Array.isArray(rule.conditions) || !rule.conditions.length) throw new Error(`Rule ${rule.id} needs conditions`);
  for (const condition of rule.conditions) {
    if (!CONDITIONS.has(condition.field) || !Array.isArray(condition.anyOf) || !condition.anyOf.length || condition.anyOf.some(v => typeof v !== 'string' || !v.trim())) throw new Error(`Malformed condition in ${rule.id}`);
  }
  return rule;
}

export function evaluateRule(rule, context = {}) {
  validateRule(rule);
  const evidence = [];
  let mismatch = false;
  let unknown = false;
  for (const {field,anyOf} of rule.conditions) {
    const value = context[field];
    if (typeof value !== 'string' || !value.trim()) {unknown=true;evidence.push({field,result:'unknown',detail:'Required context missing'});continue;}
    const matched = anyOf.some(v => v.toLowerCase() === value.trim().toLowerCase());
    if (!matched) mismatch=true;
    evidence.push({field,result:matched?'match':'mismatch',detail:value.trim()});
  }
  // A mismatch does not justify exclusion unless an explicit exclusion rule matches.
  const status = !unknown && !mismatch ? rule.onMatch : 'review';
  return {id:rule.id,title:rule.title,status,source:rule.source,reason:status==='review'?'Applicability unresolved. A reviewer must assess unmet or missing conditions.':rule.rationale,evidence,ruleVersion:rule.version ?? 'synthetic-v1',verified:false};
}

export function evaluateRules(rules, context) {
  if (!Array.isArray(rules)) throw new Error('Rules must be an array');
  const seen=new Set();
  return rules.map(rule => {if(seen.has(rule.id))throw new Error(`Duplicate rule ${rule.id}`);seen.add(rule.id);return evaluateRule(rule,context);});
}
