import { Injectable } from "@nestjs/common";

@Injectable()
export class MarkdownService {

  generateTextPreview(markdown: string, maxChars = 500): string {
    if (!markdown) return '';

    let sliceIndex = maxChars;

    // ---- Avoid cutting base64 images ![alt](data:image/...) ----
    {
      const open = markdown.lastIndexOf('![', sliceIndex);
      if (open !== -1) {
        const urlStart = markdown.indexOf('(', open);
        const urlEnd = markdown.indexOf(')', urlStart);
        const isBase64 =
          urlStart !== -1 &&
          urlStart < sliceIndex &&
          markdown.slice(urlStart + 1, urlStart + 13) === 'data:image/';

        // if slice falls inside the base64 block, move sliceIndex to open
        if (isBase64 && (urlEnd === -1 || urlEnd > sliceIndex)) {
          sliceIndex = open;
        }
      }
    }

    // ---- Avoid cutting inside image syntax ![alt](url) ----
    {
      const open = markdown.lastIndexOf('![', sliceIndex);
      if (open !== -1) {
        const close = markdown.indexOf(')', open);
        if (close !== -1 && close > sliceIndex) {
          sliceIndex = open; // cut before whole ![...](...)
        }
      }
    }

    // ---- Avoid cutting inline code `code` ----
    {
      const open = markdown.lastIndexOf('`', sliceIndex);
      if (open !== -1) {
        const close = markdown.indexOf('`', open + 1);
        if (close !== -1 && close > sliceIndex) {
          sliceIndex = open;
        }
      }
    }

    // ---- Avoid cutting links [text](url) ----
    {
      const open = markdown.lastIndexOf('[', sliceIndex);
      if (open !== -1) {
        const mid = markdown.indexOf(']', open + 1);
        const close = markdown.indexOf(')', mid + 1);
        if (
          mid !== -1 &&
          close !== -1 &&
          mid > open &&
          close > sliceIndex
        ) {
          sliceIndex = open; // cut before entire link
        }
      }
    }

    let preview = markdown.slice(0, sliceIndex);

    if (sliceIndex < markdown.length) preview += '\n\n...';

    return preview;
  }
}
