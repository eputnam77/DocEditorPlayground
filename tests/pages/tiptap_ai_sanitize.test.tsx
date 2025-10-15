import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AiSuggestButton } from "../../pages/tiptap";

const originalFetch = global.fetch;
let fetchMock: ReturnType<typeof vi.fn>;

describe("AiSuggestButton", () => {
  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock as typeof global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("sanitizes suggestion content before insertion", async () => {
    const editor = {
      state: {
        selection: { from: 0, to: 0, empty: true },
        doc: {
          textContent: "hello",
          textBetween: vi.fn().mockReturnValue("hello"),
        },
      },
      commands: {
        setContent: vi.fn(),
        insertContentAt: vi.fn(),
      },
      chain: () => ({ focus: () => ({}) }),
    };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ suggestion: "<img src=\"x\" onerror=\"alert(1)\">" }),
    });

    await act(async () => {
      render(
        <AiSuggestButton editor={editor as any} aiSuggestEnabled={false} />,
      );
    });

    await act(async () => {
      fireEvent.click(
        screen.getByTitle("AI Suggest (rewrite selection)") as HTMLButtonElement,
      );
    });

    await waitFor(() => {
      expect(editor.commands.setContent).toHaveBeenCalled();
    });

    const inserted = editor.commands.setContent.mock.calls[0][0];
    expect(inserted).toContain("<img");
    expect(inserted).not.toContain("onerror");
  });

  it("avoids calling the API when no text is selected", async () => {
    const editor = {
      state: {
        selection: { from: 0, to: 0, empty: true },
        doc: {
          textContent: "   ",
          textBetween: vi.fn().mockReturnValue("   "),
        },
      },
      commands: {
        setContent: vi.fn(),
        insertContentAt: vi.fn(),
      },
      chain: () => ({ focus: () => ({}) }),
    };

    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<AiSuggestButton editor={editor as any} aiSuggestEnabled={false} />);

    await act(async () => {
      fireEvent.click(
        screen.getByTitle("AI Suggest (rewrite selection)") as HTMLButtonElement,
      );
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(/select some text/i, { selector: "div" }),
    ).toBeTruthy();
  });
});
