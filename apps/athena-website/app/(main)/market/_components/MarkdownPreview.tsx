"use client";
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import ShadowRoot from 'react-shadow'
interface Props {
  content: string;
  className?: string
}
export function MarkdownPreview(props: Props) {


  return (

    <ShadowRoot.div className={props.className}>
      <style>
        {`
        .paper {
          color: #000;
          background: #faf9f7;
          background-image:
            url("/paper_texture.jpg");
          background-size: cover;
          padding: 2rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(0,0,0,0.08);
          font-family: system-ui, sans-serif;
          line-height: 1.6;
        }

        .paper h1, .paper h2, .paper h3, .paper h4 {
          margin-top: 1.4em;
          margin-bottom: 0.4em;
          font-weight: 700;
        }

        .paper p, .paper li {
          margin: 0.6em 0;
        }

        .paper ul, .paper ol {
          padding-left: 1.2em;
        }

        .paper code {
          background: rgba(0,0,0,0.06);
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 90%;
        }

        .paper pre {
          background: rgba(0,0,0,0.07);
          padding: 12px;
          border-radius: 8px;
          overflow: auto;
        }
        `}
      </style>

      <div className="paper">
        <ReactMarkdown remarkPlugins={[remarkGfm]} >
          {props.content || ""}
        </ReactMarkdown >
      </div>
    </ShadowRoot.div>

  )
}
