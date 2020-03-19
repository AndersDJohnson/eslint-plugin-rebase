import { uniq } from 'lodash';
import { Ignores, RebaseManifest } from "./types";

export const mergeInto = (merging: RebaseManifest, merged: RebaseManifest = {}): RebaseManifest => {
    const mergedIgnores: Ignores = { ...merged.ignores };

    if (merging.ignores) {
      for (const [existingFilepath, existingRules] of Object.entries(merging.ignores)) {
        mergedIgnores[existingFilepath] = mergedIgnores[existingFilepath] ?? {};

        for (const [existingRule, existingLines] of Object.entries(existingRules)) {
          mergedIgnores[existingFilepath][existingRule] = mergedIgnores[existingFilepath][existingRule] ?? [];

          mergedIgnores[existingFilepath][existingRule] = uniq([...mergedIgnores[existingFilepath][existingRule], ...existingLines]);
        }
      }
    }

    merged.ignores = mergedIgnores;

    return merged;
};
