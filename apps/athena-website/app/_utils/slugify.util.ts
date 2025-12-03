
export function toSlug(str: string) {
  return encodeURIComponent(
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
  );
}
