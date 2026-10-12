import { Fragment } from "react";

/** Replaces `{name}` placeholders in a translated sentence with React elements (links, bold text…). */
export function rich(template: string, parts: Record<string, React.ReactNode>) {
  return template.split(/(\{\w+\})/g).map((seg, i) => {
    const key = seg.match(/^\{(\w+)\}$/)?.[1];
    return <Fragment key={i}>{key && key in parts ? parts[key] : seg}</Fragment>;
  });
}
