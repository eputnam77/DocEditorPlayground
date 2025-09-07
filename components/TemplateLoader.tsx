import React from "react";

export interface TemplateMeta {
  label: string;
  filename: string;
}

export interface TemplateLoaderProps {
  templates: TemplateMeta[];
  disabled?: boolean;
  onLoad(filename: string): Promise<void> | void;
  onClear(): void;
  /**
   * Optional error handler invoked when onLoad throws.
   * Allows pages to surface user friendly error messages.
   */
  onError?(err: unknown): void;
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
  onError,
}: TemplateLoaderProps) {
  if (!Array.isArray(templates)) {
    console.warn("TemplateLoader: expected `templates` prop to be an array.");
    return null;
  }

  if (typeof onLoad !== "function" || typeof onClear !== "function") {
    console.warn(
      "TemplateLoader: `onLoad` and `onClear` callbacks are required.",
    );
    return null;
  }
  // Normalise input templates by trimming whitespace and dropping duplicates.
  // Previously templates with blank labels/filenames or extra whitespace would
  // slip through and even create duplicate entries in the dropdown. This could
  // leave the select stuck on the placeholder value or show the same template
  // multiple times. We now trim values and ensure they are non-empty.
  const seen = new Set<string>();
  const validTemplates = templates.reduce<TemplateMeta[]>((acc, tpl) => {
    try {
      if (!tpl || typeof tpl !== "object") {
        if (tpl) {
          console.warn("TemplateLoader: ignoring invalid template", tpl);
        }
        return acc;
      }

      const rec = tpl as Record<string, unknown>;
      const rawFilename = rec.filename;
      const rawLabel = rec.label;
      if (typeof rawFilename !== "string" || typeof rawLabel !== "string") {
        console.warn("TemplateLoader: ignoring invalid template", tpl);
        return acc;
      }

      const filename = rawFilename.trim();
      const label = rawLabel.trim();
      const key = filename.toLowerCase();
      if (!filename || !label || seen.has(key)) {
        console.warn("TemplateLoader: ignoring invalid template", tpl);
        return acc;
      }

      seen.add(key);
      acc.push({ label, filename });
    } catch {
      console.warn("TemplateLoader: ignoring invalid template", tpl);
    }
    return acc;
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "") return;

    try {
      if (val === "__clear__") {
        onClear();
      } else {
        await onLoad(val);
      }
    } catch (err) {
      console.error("TemplateLoader failed", err);
      onError?.(err);
    } finally {
      // Reset the select so the same option can be chosen again if desired
      // (previously the select would remain on "Clear" and block re-selection)
      e.target.value = "";
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
      {validTemplates.map((tpl) => (
        <option key={tpl.filename} value={tpl.filename}>
          {tpl.label}
        </option>
      ))}
      <option value="__clear__">Clear</option>
    </select>
  );
}
