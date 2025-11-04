import { validateTemplate } from "./validation.js";

export interface Template {
  title: string;
  body: string;
}

const INVISIBLE_TEMPLATE_CHARS = /[\u200B-\u200D\u2060-\u206F\uFEFF]/g;

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
      // Reject non-objects, null, and arrays before touching any fields
      if (
        typeof tpl !== "object" ||
        tpl === null ||
        Array.isArray(tpl) ||
        !Object.prototype.hasOwnProperty.call(tpl, "title") ||
        !Object.prototype.hasOwnProperty.call(tpl, "body")
      ) {
        continue;
      }

      const rec = tpl as Record<string, unknown>;
      const title = rec.title;
      const body = rec.body;
      // Validate using the already-read values so getters are not invoked twice
      if (validateTemplate({ title, body })) {
        const normalizedTitle = String(title)
          .replace(INVISIBLE_TEMPLATE_CHARS, "")
          .trim();
        const normalizedBody = String(body)
          .replace(INVISIBLE_TEMPLATE_CHARS, "")
          .trim();
        result.push({
          title: normalizedTitle,
          body: normalizedBody,
        });
      }
    } catch {
      // Ignore entries where property access throws
    }
  }
  return result;
}

