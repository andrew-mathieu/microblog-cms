'use client';

import '../app/globals.css';
import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import * as RxIcon from 'react-icons/rx';
import * as LuIcon from 'react-icons/lu';

import Link from '@tiptap/extension-link';

type Props = {
  state: (e: JSONContent) => void;
  content: string | JSONContent | undefined;
  isEditable?: boolean;
  existingContent?: JSONContent | string | undefined;
};

export default function Tiptap(props: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: `Imagine there's no heaven,\nIt's easy if you try,\nNo hell below us,\nAbove us, only sky.\n— John Lennon`,
      }),
      Link.extend({
        inclusive: false,
      }),
    ],
    autofocus: 'end',
    content: props.isEditable ? props.existingContent : props.content,
    editorProps: {
      attributes: {
        class:
          'h-[50vh] max-w-none prose dark:prose-invert prose-sm sm:prose-base lg:prose-md xl:prose-xl focus:outline-none overflow-y-scroll no-scrollbar',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      props.state(json);
    },
  });
  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 50 }}
          className="bubble dark:bg-zinc-700 rounded-xl"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              return editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={
              editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
            }
          >
            <LuIcon.LuHeading1 />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              return editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={
              editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
            }
          >
            <LuIcon.LuHeading2 />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              return editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={
              editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
            }
          >
            <LuIcon.LuHeading3 />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              return editor.chain().focus().toggleBold().run();
            }}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <RxIcon.RxFontBold />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              return editor.chain().focus().toggleItalic().run();
            }}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <RxIcon.RxFontItalic />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              return editor.chain().focus().toggleStrike().run();
            }}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            <RxIcon.RxStrikethrough />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              return editor.chain().focus().toggleBulletList().run();
            }}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <RxIcon.RxListBullet />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              return editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({
                  href: editor.getAttributes('link').href,
                  target: '_blank',
                })
                .run();
            }}
            className={editor.isActive('link') ? 'is-active' : ''}
          >
            <RxIcon.RxLink1 />
          </button>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </>
  );
}
