import {fixtures} from "./fixtures.js";
import {extractReferences} from "./extract.js";
import {readPermittedDocument} from "./documents.js";
import {evaluateRules} from "./decision-engine.js";
import {syntheticRules} from "./rules.synthetic.js";
import {createReviewCsv} from "./export.js";
let items=[];let filter="all";let decisions={};
const $=(id)=>document.getElementById(id);
const safe=(s)=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function counts(){for(const state of ["include","exclude","review"])$(state==="include"?"included-count":state==="exclude"?"excluded-count":"review-count").textContent=items.filter(x=>x.status===state).length;$("decided-count").textContent=Object.values(decisions).filter(x=>x!=="pending").length;}
function render(){counts();const visible=items.filter(x=>filter==="all"||x.status===filter);$("results").innerHTML=visible.length?visible.map(x=>`<article class="item"><div class="item-head"><div><h3>${safe(x.id)} · ${safe(x.title)}</h3><div class="meta">Source: ${safe(x.source)}</div></div><span class="tag ${x.status}">${x.status==="review"?"Additional review":x.status==="include"?"Include candidate":"Exclude candidate"}</span></div><p class="reason">${safe(x.reason)}</p><div class="reviewer"><label for="decision-${safe(x.id)}">Human determination</label><select id="decision-${safe(x.id)}" data-decision="${safe(x.id)}"><option value="pending" ${decisions[x.id]==="pending"?"selected":""}>Pending review</option><option value="accept" ${decisions[x.id]==="accept"?"selected":""}>${x.status==='review'?'Acknowledge review required':'Accept proposed classification'}</option><option value="override" ${decisions[x.id]==="override"?"selected":""}>Override / investigate</option></select></div></article>`).join(""):'<div class="empty">No entries in this filter. Run a scenario or switch filters.</div>';document.querySelectorAll("[data-decision]").forEach(el=>el.addEventListener("change",e=>{decisions[e.target.dataset.decision]=e.target.value;counts();}));}
$("run").addEventListener("click",()=>{const choice=$("scope").value;items=fixtures[choice].items.map(x=>({...x}));decisions=Object.fromEntries(items.map(x=>[x.id,"pending"]));$("scenario-note").textContent=`${fixtures[choice].name} · ${$("prime").value || "No reference"} · ${$("location").value || "Location not specified"} · synthetic data only`;$("export").disabled=false;render();});
$("run-rules").addEventListener("click",()=>{
  const rawLocation=$("location").value.trim().toLowerCase();
  // Only a precisely recognized demonstration value is mapped. Others remain unknown.
  const location=rawLocation==='guam'||rawLocation==='guam (example only)'?'guam':undefined;
  items=evaluateRules(syntheticRules,{scope:$("scope").value,subcontractType:$("demo-type").value,location});
  decisions=Object.fromEntries(items.map(x=>[x.id,'pending']));
  $("scenario-note").textContent='Fictional rules experiment. All classifications unverified; source labels are invented.';
  $("export").disabled=false;render();
});
document.querySelectorAll("[data-filter]").forEach(el=>el.addEventListener("click",()=>{filter=el.dataset.filter;document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===el));render();}));
$("export").addEventListener("click",()=>{const csv=createReviewCsv(items,decisions);const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="synthetic-flowdown-review.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
render();
$("document-file").addEventListener("change",async e=>{
  const file=e.target.files?.[0];
  if(!file)return;
  $("document-status").textContent="Extracting locally. Please wait...";
  try{
    const result=await readPermittedDocument(file);
    if(result.text.length>50000)throw new Error("Extracted text exceeds the 50,000-character intake limit. Use a smaller public sample.");
    $("clause-text").value=result.text;
    $("document-status").textContent=`Loaded ${file.name}: ${result.provenance}. ${result.warnings.length} parser warning(s). Review extracted text before analysis.`;
  }catch(error){$("document-status").textContent=`Import failed: ${error.message}`;}
  finally{e.target.value="";}
});
$("extract").addEventListener("click",()=>{
  const target=$("extracted");
  try {
    const found=extractReferences($("clause-text").value);
    $("extract-summary").textContent=`${found.length} unverified reference occurrence(s) detected. No applicability determination.`;
    target.innerHTML=found.length?found.map(x=>`<article class="item"><h3>${safe(x.identifier)} · Line ${x.line}</h3><p class="reason">${safe(x.excerpt)}</p><span class="tag review">Unverified candidate</span></article>`).join(""):'<p class="empty">No matching FAR/DFARS-style references found. This does not establish that the text contains no applicable clauses.</p>';
  } catch(error) {$("extract-summary").textContent=error.message;target.replaceChildren();}
});
