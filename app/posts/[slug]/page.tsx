'use client';
import { useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { generateHTML } from '@tiptap/html';
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
import type { JSONContent } from '@tiptap/react';

export default function Page({ params }: { params: { slug: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [posts, setPosts] = useState<
    Database['public']['Tables']['posts']['Row'][] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', params.slug);

        if (error) {
          throw error;
        }

        setPosts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.slug]); // Include params.slug as a dependency

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
  let content = null;

  if (posts && posts.length > 0) {
    content = generateHTML(posts[0].content as JSONContent, extensions);
  }

  return (
    <div>
      {posts ? (
        content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <h1>No content available.</h1>
        )
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
