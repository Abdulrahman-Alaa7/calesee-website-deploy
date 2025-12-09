export function truncateForSeo(
  value: string | undefined | null,
  maxLength: number
): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const sliced = trimmed.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");

  const safeCut = lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced;

  return safeCut + "…";
}

export function normalizeKeywords(
  raw: string[] | string | null | undefined,
  limit = 10
): string[] | undefined {
  if (!raw) return undefined;

  let arr: string[] = [];

  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === "string") {
    arr = raw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }

  const unique = Array.from(new Set(arr));

  if (unique.length === 0) return undefined;

  return unique.slice(0, limit);
}
