import { Injectable } from "@nestjs/common";

@Injectable()
export class MarkdownService {

  generateTextPreview(markdown: string, maxChars = 500): string {
    if (!markdown) return '';

    // Limit to maxChars but avoid cutting inside code blocks, links, or images
    let sliceIndex = maxChars;

    // Prevent cutting inside inline code `code`
    const lastBacktick = markdown.lastIndexOf('`', sliceIndex);
    if (lastBacktick !== -1 && markdown.indexOf('`', lastBacktick + 1) > sliceIndex) {
      sliceIndex = lastBacktick; // cut before inline code
    }

    // Prevent cutting inside links [text](url)
    const lastOpenBracket = markdown.lastIndexOf('[', sliceIndex);
    const lastCloseBracket = markdown.lastIndexOf(']', sliceIndex);
    const lastParen = markdown.lastIndexOf('(', sliceIndex);
    const lastCloseParen = markdown.lastIndexOf(')', sliceIndex);
    if (
      lastOpenBracket > lastCloseBracket &&
      lastParen > lastCloseParen &&
      lastParen < sliceIndex
    ) {
      sliceIndex = lastOpenBracket; // cut before link
    }

    // Prevent cutting inside images ![alt](url)
    const lastImage = markdown.lastIndexOf('![', sliceIndex);
    const lastImageClose = markdown.lastIndexOf(')', sliceIndex);
    if (lastImage > lastImageClose && lastImage < sliceIndex) {
      sliceIndex = lastImage; // cut before image
    }

    // Take slice
    let preview = markdown.slice(0, sliceIndex);

    // Optional: add ellipsis if truncated
    if (sliceIndex < markdown.length) {
      preview += '\n\n...';
    }

    return preview;
  }
}
