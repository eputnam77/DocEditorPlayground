import { validateTemplate } from "./validation.js";

export interface Template {
  title: string;
  body: string;
}

/**
 * Filter and normalise an array of templates.
 *
 * The function validates each template using `validateTemplate` and returns
 * only those that pass validation. Invalid items are ignored. A TypeError is
 * thrown if the input is not an array.
 */
export function integrateTemplates(templates: unknown[]): Template[] {
  if (!Array.isArray(templates)) {
    throw new TypeError("templates must be an array");
  }

  const result: Template[] = [];
  for (const tpl of templates) {
    try {
      if (typeof tpl !== "object" || tpl === null) {
        continue;
      }
      const rec = tpl as Record<string, unknown>;
      const title = rec.title;
      const body = rec.body;
      // Validate using the already-read values so getters are not invoked twice
      if (validateTemplate({ title, body })) {
        result.push({ title: String(title), body: String(body) });
      }
    } catch {
      // Ignore entries where property access throws
    }
  }
  return result;
}

