import { validateTemplate } from "./validation";

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

  return templates
    .filter(validateTemplate)
    .map((t) => {
      const rec = t as Record<string, unknown>;
      return { title: String(rec.title), body: String(rec.body) };
    });
}

