import {MemoizedReactMarkdown} from "@/components/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
//@ts-ignore
import remarkCollapse from "remark-collapse";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import {CodeBlock} from "@/components/ui/codeblock";
import CollapsibleSection from "@/components/collapsible-section";

export default function Believe({believe}: { believe: string }) {
    return (
        <CollapsibleSection title="5 Reasons to Believe" headerColor="concern-background"
                                        iconColor="#FF7878">
                        <>
                            <MemoizedReactMarkdown
                                className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                                remarkPlugins={[remarkGfm, remarkMath, [remarkCollapse, {test: 'Problem'}]]}
                                //@ts-ignore
                                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                components={{
                                    p({children}) {
                                        return <p className="mb-2 last:mb-0">{children}</p>
                                    },
                                    code({node, inline, className, children, ...props}) {
                                        if (children.length) {
                                            if (children[0] == '▍') {
                                                return (
                                                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                                                )
                                            }

                                            children[0] = (children[0] as string).replace('`▍`', '▍')
                                        }

                                        const match = /language-(\w+)/.exec(className || '')

                                        if (inline) {
                                            return (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }

                                        return (
                                            <CodeBlock
                                                key={Math.random()}
                                                language={(match && match[1]) || ''}
                                                value={String(children).replace(/\n$/, '')}
                                                {...props}
                                            />
                                        )
                                    }
                                }}
                            >
                                {believe}
                            </MemoizedReactMarkdown>
                        </>
                    </CollapsibleSection>
    )
}