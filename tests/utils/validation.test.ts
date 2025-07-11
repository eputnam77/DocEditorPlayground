import { describe, it, expect } from 'vitest';
import { validateDocument } from '../../utils/validation';

describe('validateDocument', () => {
  it('returns true for objects with content string', () => {
    expect(validateDocument({ content: 'a' })).toBe(true);
  });

  it('returns false otherwise', () => {
    expect(validateDocument({})).toBe(false);
    expect(validateDocument(null)).toBe(false);
  });
});
