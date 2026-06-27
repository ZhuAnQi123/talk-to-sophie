import { SourceItem } from "./types";

export function parseSourceHeader(sourceHeader?: string): SourceItem[] | undefined {
  if (!sourceHeader) return undefined;

  try {
    const rawSources = JSON.parse(sourceHeader);
    if (!Array.isArray(rawSources)) return undefined;

    const uniqueSources = new Set<string>();
    return rawSources.filter((item) => {
      if (!item?.source || uniqueSources.has(item.source)) return false;
      uniqueSources.add(item.source);
      return true;
    });
  } catch (error) {
    console.error("Failed to parse sources:", error);
    return undefined;
  }
}
