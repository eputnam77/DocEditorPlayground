import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SlatePage from '../../pages/slate';

describe('SlatePage', () => {
  it('renders plugin manager', () => {
    render(<SlatePage />);
    expect(screen.getByTestId('plugin-history')).toBeInTheDocument();
  });
});
