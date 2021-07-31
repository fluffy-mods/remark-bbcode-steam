import { expect } from "chai";
import gfm from "remark-gfm";
import markdown from "remark-parse";
import { unified } from "unified";

import { stringify } from "../dist/index.js";

describe("markdown to steam bbcode stringifier", () => {
    /**
     * @param {string} markdown
     * @returns {Promise<string>} parsed output
     */
    const parse = (md) => {
        const ast = unified().use(markdown).use(gfm).parse(md);
        return stringify(ast);
    };

    /**
     * @param {string} markdown
     * @param {string} expected
     * @returns {Promise<void>}
     */
    const parseAndCheck = (md, bb) => {
        expect(parse(md)).to.equal(bb);
    };

    it("should convert headings of levels 1-6", () => {
        for (let i = 1; i <= 6; i++) {
            let markdown = `${"#".repeat(i)} heading ${i}`;
            let steam = `[h${i}]heading ${i}[/h${i}]`;

            parseAndCheck(markdown, steam);
        }
    });

    it("should convert unordered lists", () => {
        const markdown = `
- item 1
- item 2
- item 3
`;
        const steam = `[list][*]item 1[*]item 2[*]item 3[/list]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert ordered lists", () => {
        const markdown = `
1. item 1
2. item 2
3. item 3
`;
        const steam = `[olist][*]item 1[*]item 2[*]item 3[/olist]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert nested lists", () => {
        const markdown = `
- item 1
    - item 1.1
    - item 1.2
- item 2
    1. item 2.1
    2. item 2.2
`;
        const steam = `[list][*]item 1[list][*]item 1.1[*]item 1.2[/list][*]item 2[olist][*]item 2.1[*]item 2.2[/olist][/list]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert links", () => {
        const markdown = `[example](http://example.com)`;
        const steam = `[url=http://example.com]example[/url]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert images", () => {
        const markdown = `![image](http://example.com/image.png)`;
        const steam = `[img]http://example.com/image.png[/img]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert image links", () => {
        const markdown = `[![image](http://example.com/image.png)](http://example.com)`;
        const steam = `[url=http://example.com][img]http://example.com/image.png[/img][/url]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert bold text", () => {
        const markdown = `**bold**`;
        const steam = `[b]bold[/b]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert italic text", () => {
        const markdown = `*italic*`;
        const steam = `[i]italic[/i]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert strikethrough text", () => {
        const markdown = `~~strikethrough~~`;
        const steam = `[strike]strikethrough[/strike]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert spoilers", () => {
        const markdown = `>! spoiler`;
        const steam = `[spoiler]spoiler[/spoiler]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert quotes", () => {
        const markdown = `> quote`;
        const steam = `[quote]quote[/quote]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert multi-line quotes", () => {
        const markdown = `> quote\n> quote\n> even more quote`;
        const steam = `[quote]quote\nquote\neven more quote[/quote]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert multi-line spoilers", () => {
        const markdown = `>! quote\n> quote\n> even more quote`;
        const steam = `[spoiler]quote\nquote\neven more quote[/spoiler]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert code blocks", () => {
        const markdown = "```\ncode\n```";
        const steam = `[code]code[/code]`;

        parseAndCheck(markdown, steam);
    });

    it("should convert inline code", () => {
        const markdown = "this is inline `code`, let's type around";
        const steam = `this is inline [b]code[/b], let's type around`;
        parseAndCheck(markdown, steam);
    });
});
