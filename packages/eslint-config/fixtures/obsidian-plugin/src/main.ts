export const settings = { enabled: true };

// Genuinely unused, to prove the base rules still apply through the obsidian
// entry point. Its counterpart below is exempt via the underscore prefix.
const unusedValue = 1;
const _intentionallyUnused = 2;

export function describe(): string {
  return `enabled: ${settings.enabled}`;
}
