import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CodexPage from '../../pages/codex';

describe('CodexPage', () => {
  it('renders plugin manager', () => {
    render(<CodexPage />);
    expect(screen.getByTestId('plugin-header')).toBeInTheDocument();
  });
});
