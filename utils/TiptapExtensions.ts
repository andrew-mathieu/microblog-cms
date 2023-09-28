import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Strike from '@tiptap/extension-strike';
import Italic from '@tiptap/extension-italic';
import HardBreak from '@tiptap/extension-hard-break';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';

const extensions = [
    Document,
    Paragraph,
    Heading,
    Text,
    Bold,
    Italic,
    Strike,
    HardBreak,
    CodeBlock,
    Link,
];

export default extensions;