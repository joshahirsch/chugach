export const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
const TYPES = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

export function validateDocument(file) {
  if (!file || typeof file.name !== 'string') throw new Error('Choose a PDF or DOCX file.');
  const extension = Object.keys(TYPES).find(ext => file.name.toLowerCase().endsWith(ext));
  if (!extension) throw new Error('Only PDF and DOCX files are supported.');
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_DOCUMENT_BYTES) {
    throw new Error('The document must be between 1 byte and 8 MiB.');
  }
  if (file.type && file.type !== TYPES[extension] && file.type !== 'application/octet-stream') {
    throw new Error('File extension and MIME type disagree.');
  }
  return extension;
}

export async function readPermittedDocument(file) {
  const extension = validateDocument(file);
  const arrayBuffer = await file.arrayBuffer();
  if (extension === '.docx') {
    const mammoth = await import('mammoth/mammoth.browser.js');
    const result = await mammoth.extractRawText({arrayBuffer});
    return {text: result.value, provenance: 'DOCX paragraphs; page numbers unavailable', warnings: result.messages.map(m => m.message)};
  }
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({data: new Uint8Array(arrayBuffer)}).promise;
  try {
    if (doc.numPages > 100) throw new Error('PDF exceeds the 100-page prototype limit.');
    const pages = [];
    for (let number = 1; number <= doc.numPages; number++) {
      const page = await doc.getPage(number);
      const content = await page.getTextContent();
      pages.push({page: number, text: content.items.map(item => item.str ?? '').join(' ')});
    }
    return {text: pages.map(p => `[PDF PAGE ${p.page}]\n${p.text}`).join('\n'), provenance: 'Extracted PDF text with page markers', warnings: []};
  } finally {await doc.destroy();}
}
