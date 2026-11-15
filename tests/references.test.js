import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateCatalog} from '../references/validate.js';
const catalog=JSON.parse(readFileSync(new URL('../references/catalog.json',import.meta.url),'utf8'));
test('official reference seed has unique source identifiers',()=>{assert.equal(validateCatalog(catalog).count,8);});
test('untrusted source domains fail validation',()=>{const copy=structuredClone(catalog);copy.sources[0].url='https://example.org/';assert.throws(()=>validateCatalog(copy));});
test('registry cannot silently declare a source reviewed',()=>{const copy=structuredClone(catalog);copy.sources[0].reviewStatus='approved';assert.throws(()=>validateCatalog(copy));});
