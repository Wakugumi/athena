export function getPublicBlobUrl(key: string) {
  return `${process.env.NEXT_PUBLIC_STORAGE_URL}${key}`
}
