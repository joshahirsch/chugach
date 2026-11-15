import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
export function validateCatalog(catalog) {
  if(!catalog||typeof catalog.catalogVersion!=='string'||!Array.isArray(catalog.sources)||catalog.sources.length===0)throw new Error('Invalid reference catalog');
  const ids=new Set();
  for(const source of catalog.sources){
    if(!source||!source.id||!source.title||!source.system||!source.role||source.reviewStatus!=='unreviewed')throw new Error('Incomplete or improperly classified source');
    if(ids.has(source.id))throw new Error(`Duplicate reference ${source.id}`);
    ids.add(source.id);
    const url=new URL(source.url);
    if(url.protocol!=='https:'||url.hostname!=='www.acquisition.gov')throw new Error(`Unapproved source host: ${source.id}`);
  }
  return {count:catalog.sources.length,ids:[...ids]};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
  try{console.log(JSON.stringify(validateCatalog(JSON.parse(readFileSync(process.argv[2]??'references/catalog.json','utf8'))),null,2));}
  catch(e){console.error(e.message);process.exitCode=1;}
}
