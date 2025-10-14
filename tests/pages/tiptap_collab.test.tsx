import React, { useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WebrtcProvider } from "y-webrtc";
import { useCollabResources } from "../../pages/tiptap";

function Harness({
  enabled,
  onUpdate,
}: {
  enabled: boolean;
  onUpdate: (state: { collabDoc: unknown; collabProvider: unknown }) => void;
}) {
  const state = useCollabResources(enabled);
  useEffect(() => {
    onUpdate(state);
  }, [state, onUpdate]);
  return null;
}

describe("useCollabResources", () => {
  it("creates and tears down collaboration provider", async () => {
    const reports: Array<{ collabDoc: unknown; collabProvider: unknown }> = [];
    const destroySpy = vi.spyOn(WebrtcProvider.prototype, "destroy");

    const { rerender } = render(
      <Harness
        enabled={false}
        onUpdate={(state) => reports.push(state)}
      />,
    );

    await waitFor(() => {
      expect(reports.at(-1)?.collabDoc ?? null).toBeNull();
    });

    rerender(
      <Harness
        enabled={true}
        onUpdate={(state) => reports.push(state)}
      />,
    );

    await waitFor(() => {
      expect(reports.at(-1)?.collabDoc).not.toBeNull();
    });

    destroySpy.mockClear();

    rerender(
      <Harness
        enabled={false}
        onUpdate={(state) => reports.push(state)}
      />,
    );

    await waitFor(() => {
      expect(destroySpy).toHaveBeenCalled();
      expect(reports.at(-1)?.collabDoc ?? null).toBeNull();
    });
  });
});
