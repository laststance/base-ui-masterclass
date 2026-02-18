import { compileMDX } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import type { LessonFrontmatter } from "@base-ui-masterclass/content";
import { mdxComponents } from "@/components/mdx";

/**
 * Compiles raw MDX string into React elements with typed frontmatter.
 * Uses @shikijs/rehype for server-side syntax highlighting (zero client JS).
 *
 * @param source - Raw MDX content string (without YAML frontmatter)
 * @returns Object with `content` (React element tree)
 *
 * @example
 * const { content } = await compileLessonMDX(rawMdx);
 * // content is a renderable React element
 */
export async function compileLessonMDX(source: string) {
  return compileMDX<LessonFrontmatter>({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              theme: "github-dark",
            },
          ],
        ],
      },
    },
  });
}
