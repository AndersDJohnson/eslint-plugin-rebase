import { mergeInto } from "../merge";

describe("merge", () => {
  describe("mergeInto", () => {
    it("should work", () => {
      const merging = {
        ignores: {
          fileA: {
            ruleA: ["line1"],
          },
          fileB: {
            ruleB: ["line1"],
          },
        },
      };

      const existing = {
        ignores: {
          fileA: {
            ruleA: ["line2"],
            ruleB: ["line3"],
          },
          fileC: {
            ruleC: ["line4"],
          },
        },
      };

      expect(mergeInto(merging, existing)).toEqual({
        ignores: {
          fileA: {
            ruleA: ["line2", "line1"],
            ruleB: ["line3"],
          },
          fileB: {
            ruleB: ["line1"],
          },
          fileC: {
            ruleC: ["line4"],
          },
        },
      });
    });
  });
});
