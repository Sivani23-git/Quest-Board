export const NOCTURNE_VARIANTS = ["midnight", "dawn", "dusk", "eclipse"] as const;
export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];

export const NOCTURNE_TITLES: Record<NocturneVariant, string> = {
  midnight: "Nocturne — Midnight",
  dawn: "Nocturne — Dawn",
  dusk: "Nocturne — Dusk",
  eclipse: "Nocturne — Eclipse",
};

export function buildNocturneDocument(variant: string) {
  return undefined;
}
