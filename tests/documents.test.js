import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDocument, MAX_DOCUMENT_BYTES} from '../src/documents.js';
test('permits bounded PDF and DOCX inputs',()=>{
  assert.equal(validateDocument({name:'public.PDF',size:500,type:'application/pdf'}),'.pdf');
  assert.equal(validateDocument({name:'example.docx',size:500,type:''}),'.docx');
});
test('rejects unsupported, mismatched, empty, or oversized inputs',()=>{
  for(const file of [{name:'a.txt',size:100},{name:'a.pdf',size:0},{name:'a.docx',size:MAX_DOCUMENT_BYTES+1},{name:'a.pdf',size:50,type:'image/png'}])assert.throws(()=>validateDocument(file));
});
