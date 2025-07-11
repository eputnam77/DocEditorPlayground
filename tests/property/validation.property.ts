import fc from 'fast-check';
import { validateDocument } from '../../utils/validation';
import { describe, it } from 'vitest';

// Property: validateDocument should return a boolean for any input and not throw

describe('validateDocument (property)', () => {
  it('returns a boolean for arbitrary documents', () => {
    fc.assert(
      fc.property(fc.anything(), (doc) => {
        const result = validateDocument(doc);
        return typeof result === 'boolean';
      })
    );
  });
});
