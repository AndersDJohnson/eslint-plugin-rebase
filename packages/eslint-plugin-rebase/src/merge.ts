import { uniq } from "lodash";
import { Entries, RebaseManifest } from "./types";

export const mergeInto = (
  merging: RebaseManifest,
  merged: RebaseManifest = {}
): RebaseManifest => {
  if (merging.ignores) {
    const mergedIgnores: Entries = { ...merged.ignores };

    for (const [existingFilepath, existingRules] of Object.entries(
      merging.ignores
    )) {
      mergedIgnores[existingFilepath] = mergedIgnores[existingFilepath] ?? {};

      for (const [existingRule, existingLines] of Object.entries(
        existingRules
      )) {
        mergedIgnores[existingFilepath][existingRule] =
          mergedIgnores[existingFilepath][existingRule] ?? [];

        mergedIgnores[existingFilepath][existingRule] = uniq([
          ...mergedIgnores[existingFilepath][existingRule],
          ...existingLines,
        ]);
      }
    }

    merged.ignores = mergedIgnores;
  }

  if (merging.warnings) {
    const mergedWarnings: Entries = { ...merged.warnings };

    for (const [existingFilepath, existingRules] of Object.entries(
      merging.warnings
    )) {
      mergedWarnings[existingFilepath] = mergedWarnings[existingFilepath] ?? {};

      for (const [existingRule, existingLines] of Object.entries(
        existingRules
      )) {
        mergedWarnings[existingFilepath][existingRule] =
          mergedWarnings[existingFilepath][existingRule] ?? [];

        mergedWarnings[existingFilepath][existingRule] = uniq([
          ...mergedWarnings[existingFilepath][existingRule],
          ...existingLines,
        ]);
      }
    }

    merged.warnings = mergedWarnings;
  }

  return merged;
};
