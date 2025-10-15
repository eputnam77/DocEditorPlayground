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

type TemplateCandidate = Partial<TemplateMeta>;

const CLEAR_SENTINEL = "__clear__";

function isTemplateCandidate(value: unknown): value is TemplateCandidate {
  return Boolean(value) && typeof value === "object";
}

function isStringLike(value: unknown): value is string | String {
  return typeof value === "string" || value instanceof String;
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
      if (!isTemplateCandidate(tpl)) {
        if (tpl) {
          console.warn("TemplateLoader: ignoring invalid template", tpl);
        }
        return acc;
      }

      const rawFilename = tpl.filename;
      const rawLabel = tpl.label;

      if (!isStringLike(rawFilename) || !isStringLike(rawLabel)) {
        if (tpl) {
          console.warn("TemplateLoader: ignoring invalid template", tpl);
        }
        return acc;
      }

      const filename = String(rawFilename).trim();
      const label = String(rawLabel).trim();
      const key = filename.toLowerCase();
      if (!filename || !label || key === CLEAR_SENTINEL || seen.has(key)) {
        console.warn("TemplateLoader: ignoring invalid template", tpl);
        return acc;
      }

      seen.add(key);
      const normalized: TemplateMeta = { label, filename };
      acc.push(normalized);
    } catch {
      console.warn("TemplateLoader: ignoring invalid template", tpl);
    }
    return acc;
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "") return;

    try {
      if (val.toLowerCase() === CLEAR_SENTINEL) {
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
