/** Conservative line-oriented candidate finder. Not an applicability engine. */
export function extractReferences(input, options = {}) {
  const maxCharacters = options.maxCharacters ?? 50000;
  if (typeof input !== 'string') throw new TypeError('Expected plain text');
  if (input.length > maxCharacters) throw new RangeError('Text exceeds intake limit');
  const matches = [];
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const regex = /\b(?:FAR\s*|DFARS\s*)?(?:52|252)\.\d{3}-\d{1,4}\b/gi;
  for (let index = 0; index < lines.length; index++) {
    const found = new Set();
    for (const match of lines[index].matchAll(regex)) {
      const identifier = match[0].replace(/^(FAR|DFARS)\s*/i, '').toUpperCase();
      if (found.has(identifier)) continue;
      found.add(identifier);
      matches.push({identifier, line: index + 1, excerpt: lines[index].trim().slice(0, 240), status: 'unverified'});
    }
  }
  return matches;
}
