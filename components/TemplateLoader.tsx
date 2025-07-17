import React from 'react';

export interface TemplateMeta {
  label: string;
  filename: string;
}

export interface TemplateLoaderProps {
  templates: TemplateMeta[];
  disabled?: boolean;
  onLoad(filename: string): Promise<void> | void;
  onClear(): void;
}

/**
 * TemplateLoader provides a dropdown for loading example templates into
 * an editor. It delegates the actual loading logic to the parent component.
 */
export default function TemplateLoader({
  templates,
  disabled,
  onLoad,
  onClear,
}: TemplateLoaderProps) {
  if (!Array.isArray(templates)) {
    console.warn(
      "TemplateLoader: expected `templates` prop to be an array."
    );
    return null;
  }

  if (typeof onLoad !== "function" || typeof onClear !== "function") {
    console.warn(
      "TemplateLoader: `onLoad` and `onClear` callbacks are required."
    );
    return null;
  }
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '') return;
    if (val === '__clear__') {
      onClear();
      return;
    }
    try {
      await onLoad(val);
    } catch (err) {
      console.error('TemplateLoader failed', err);
    } finally {
      // Reset the select so the same template can be chosen again if desired
      e.target.value = '';
    }
  };

  return (
    <select
      className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200"
      title="Load Template"
      aria-label="Templates"
      disabled={disabled}
      onChange={handleChange}
      defaultValue=""
    >
      <option value="" disabled>
        Templates
      </option>
      {templates.map((tpl) => (
        <option key={tpl.filename} value={tpl.filename}>
          {tpl.label}
        </option>
      ))}
      <option value="__clear__">Clear</option>
    </select>
  );
}
