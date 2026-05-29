import { describe, it, expect } from "vitest";
import { rank, DEFAULT_INPUTS } from "@/lib/scoring";
import { ARCHITECTURES } from "@/data/architectures";

describe("rank", () => {
  it("returns every architecture, sorted high → low", () => {
    const results = rank(DEFAULT_INPUTS);
    expect(results).toHaveLength(ARCHITECTURES.length);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("produces scores in the 0–100 range", () => {
    const results = rank(DEFAULT_INPUTS);
    for (const r of results) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });
});
