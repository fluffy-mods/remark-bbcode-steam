import gfm from "remark-gfm";
import remark from "remark-parse";
import { Plugin, unified } from "unified";

import type { Content, Root } from "mdast";
const plugin: Plugin = function remarkBbcodeSteam() {
    Object.assign(this, { Compiler: stringify });
};

export default plugin;

export function stringify(node: Content | Root): string {
    switch (node.type) {
        case "root":
            return all(node.children, "\n\n");
        case "paragraph":
            return all(node.children);
        case "heading":
            return `[h${node.depth}]${all(node.children)}[/h${node.depth}]`;
        case "text":
            return node.value;
        case "list":
            const type = node.ordered ? "olist" : "list";
            return `[${type}]${all(node.children)}[/${type}]`;
        case "listItem":
            return `[*]${all(node.children)}`;
        case "link":
            return `[url=${node.url}]${all(node.children)}[/url]`;
        case "image":
            return `[img]${node.url}[/img]`;
        case "strong":
            return `[b]${all(node.children)}[/b]`;
        case "emphasis":
            return `[i]${all(node.children)}[/i]`;
        case "blockquote":
            const children = all(node.children);
            if (children.startsWith("! ")) {
                return `[spoiler]${children.substr(2)}[/spoiler]`;
            }
            return `[quote]${all(node.children)}[/quote]`;
        case "delete":
            return `[strike]${all(node.children)}[/strike]`;
        case "inlineCode":
            return `[b]${node.value}[/b]`;
        case "code":
            return `[code]${node.value}[/code]`;
        default:
            console.warn(`Unhandled node type: ${node.type}`);
            if ("value" in node) {
                return node.value;
            } else if ("children" in node) {
                return all(node.children);
            }
            return "";
    }
}

function all(children: Content[], sep: string = ""): string {
    return children.map(stringify).join(sep);
}

export function convert(md: string): string {
    const ast = unified().use(remark).use(gfm).use(plugin).parse(md);
    return stringify(ast as Root);
}
