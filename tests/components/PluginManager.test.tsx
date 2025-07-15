import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PluginManager, { PluginItem } from '../../components/PluginManager';

const plugins: PluginItem[] = [
  { name: 'A' },
  { name: 'B' },
];

describe('PluginManager', () => {
  it('calls onChange when toggling a plugin', () => {
    const handle = vi.fn();
    render(<PluginManager plugins={plugins} enabled={['A']} onChange={handle} />);
    const checkbox = screen.getByLabelText('B') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(handle).toHaveBeenCalledWith(['A', 'B']);
  });
});
