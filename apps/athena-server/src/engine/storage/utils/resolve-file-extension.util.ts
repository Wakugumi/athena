import { ContentTypes } from "@athena/types";

export function resolveFileExtension(contentType?: ContentTypes, filename?: string) {


  if (contentType) {

    switch (contentType) {
      case ContentTypes.JPEG:
        return 'jpeg'

      case ContentTypes.PNG:
        return 'png'

      case ContentTypes.WEBP:
        return 'webp'
    }


  }

  if (filename) {
    return filename.split('.')[-1]
  }

  return "txt"
}
