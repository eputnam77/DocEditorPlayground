import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CkeditorPage from '../../pages/ckeditor';

describe('CkeditorPage', () => {
  it('renders plugin manager', () => {
    render(<CkeditorPage />);
    expect(screen.getByTestId('plugin-alignment')).toBeInTheDocument();
  });
});
