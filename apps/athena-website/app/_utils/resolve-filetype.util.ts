import { ContentTypes } from "@athena/types";

export const extToMimeMap: Record<string, ContentTypes> = {
  jpg: ContentTypes.JPEG,
  jpeg: ContentTypes.JPEG,
  png: ContentTypes.PNG,
  webp: ContentTypes.WEBP,
  md: ContentTypes.MD,
  pdf: ContentTypes.PDF,
};



export function mimeFromExt(ext: string): ContentTypes | undefined {
  return extToMimeMap[ext.toLowerCase()];
}
export function mimeFromFilename(name: string): ContentTypes | undefined {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return mimeFromExt(ext);
}


