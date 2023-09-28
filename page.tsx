'use client';
import { useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { generateHTML } from '@tiptap/html';
import Extensions from '@/utils/TipTapExtensions';
import type { JSONContent } from '@tiptap/react';
import PocketBase from 'pocketbase';
import * as pb from '@/types/pocketbase-types';

const pocketbase = new PocketBase('http://127.0.0.1:8090');

export default function Page({ params }: { params: { slug: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [post, setPost] = useState<pb.PostsResponse | null>(null);

  const fetchData = async () => {
    try {
      console.info('Fetching data…');
      const posts: pb.PostsResponse[] = await pocketbase
        .collection('posts')
        .getFullList();

      const id: pb.PostsResponse | undefined = posts.find(
        (post) => post.slug === params.slug
      );

      const data: pb.PostsResponse = await pocketbase
        .collection('posts')
        .getOne(id?.id as pb.PostsResponse['id']);
      setPost(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.slug]); // Include params.slug as a dependency

  let content = null;

  if (post?.content) {
    content = generateHTML(post.content as JSONContent, Extensions);
  }

  return (
    <div>
      {post ? (
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
