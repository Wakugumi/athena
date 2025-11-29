import { Injectable } from "@nestjs/common";

@Injectable()
export class MarkdownService {

  generateTextPreview(markdown: string, maxChars = 500): string {
    if (!markdown) return '';

    let sliceIndex = maxChars;

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
