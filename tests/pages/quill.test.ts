import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import QuillPage from '../../pages/quill';

describe('QuillPage', () => {
  it('renders plugin manager', () => {
    render(<QuillPage />);
    expect(screen.getByTestId('plugin-toolbar')).toBeInTheDocument();
  });
});
