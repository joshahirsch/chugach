const FIELDS = ['id','title','proposed_status','source','reason','reviewer_decision'];

// Neutralize spreadsheet formulas in externally sourced text when CSV is opened.
function csvCell(value) {
  let text=String(value ?? '');
  if (/^[\s]*[=+\-@]/.test(text)) text=`'${text}`;
  return `"${text.replaceAll('"','""')}"`;
}

export function createReviewCsv(items, decisions) {
  const rows=[FIELDS,...items.map(item=>[item.id,item.title,item.status,item.source,item.reason,decisions[item.id] ?? 'pending'])];
  return rows.map(row=>row.map(csvCell).join(',')).join('\r\n');
}
