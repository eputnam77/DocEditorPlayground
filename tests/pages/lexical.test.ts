import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LexicalPage from '../../pages/lexical';

describe('LexicalPage', () => {
  it('renders plugin manager', () => {
    render(<LexicalPage />);
    expect(screen.getByTestId('plugin-history')).toBeInTheDocument();
  });
});
