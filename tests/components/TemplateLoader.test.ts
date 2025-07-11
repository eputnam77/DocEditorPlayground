import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TemplateLoader from '../../components/TemplateLoader';

describe('TemplateLoader', () => {
  it('calls onLoad with selected template', () => {
    const handler = vi.fn();
    render(<TemplateLoader onLoad={handler} />);
    fireEvent.click(screen.getByTestId('template-load-btn'));
    expect(handler).toHaveBeenCalled();
  });
});
