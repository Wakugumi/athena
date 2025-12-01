"use client";
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface Props {
  content: string
}
export function MarkdownPreview(props: Props) {


  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
      {props.content.trim() || ""}
    </ReactMarkdown>
  )
}
