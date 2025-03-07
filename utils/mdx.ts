import { type PluggableList } from "unified";
import { nodeTypes } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkFlexibleCodeTitles from "remark-flexible-code-titles";
import remarkFlexibleContainers, {
  type FlexibleContainerOptions,
} from "remark-flexible-containers";
import remarkFlexibleParagraphs from "remark-flexible-paragraphs";
import remarkFlexibleToc, { type TocItem } from "remark-flexible-toc";
import remarkInsert from "remark-ins";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightCodeLines from "rehype-highlight-code-lines";
import rehypeSlug from "rehype-slug";
import rehypePreLanguage from "rehype-pre-language";
import recmaMdxEscapeMissingComponents from "recma-mdx-escape-missing-components";
import recmaMdxChangeProps from "recma-mdx-change-props";

import { toTitleCase } from ".";
import { html } from "./rehype-handlers";

const baseRemarkPlugins: PluggableList = [
  remarkGfm,
  remarkInsert,
  remarkFlexibleMarkers, // order of plugins matters
  remarkEmoji,
  remarkFlexibleParagraphs,
  [
    remarkFlexibleContainers,
    {
      title: () => null,
      containerTagName: "admonition",
      containerProperties: (type, title) => {
        return {
          ["data-type"]: type?.toLowerCase(),
          ["data-title"]: toTitleCase(title) ?? toTitleCase(type),
        };
      },
    } as FlexibleContainerOptions,
  ],
  remarkFlexibleCodeTitles,
];

export const remarkPlugins: PluggableList = [
  ...baseRemarkPlugins,
  remarkFlexibleToc,
];

// experimental, used in only "Test Basic" pages to get the Table of Contents differently
export function getRemarkPlugins(toc: TocItem[]): PluggableList {
  return [
    ...baseRemarkPlugins,
    [
      remarkFlexibleToc,
      {
        tocRef: toc, // the plugin "remark-flexible-toc" mutates the "toc" via "tocRef"
      },
    ],
  ];
}

export const rehypePlugins: PluggableList = [
  rehypeHighlight,
  [
    rehypeHighlightCodeLines,
    {
      showLineNumbers: true,
      lineContainerTagName: "div",
    },
  ],
  rehypeSlug,
  rehypePreLanguage,
  [rehypeRaw, { passThrough: nodeTypes }], // to allow HTML elements in "md" format, "passThrough" is for "mdx" works as well
];

export const recmaPlugins: PluggableList = [
  [
    recmaMdxEscapeMissingComponents,
    ["Bar", "Toc", "ComponentFromOuterProvider"],
  ],
  recmaMdxChangeProps,
];

export const remarkRehypeOptions = { handlers: { html } };
