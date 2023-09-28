'use client';

import Card from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import PocketBase, { ListResult } from 'pocketbase';
import type * as pb from '@/types/pocketbase-types';
import type { JSONContent } from '@tiptap/react';
import { generateHTML } from '@tiptap/html';
import Extensions from '@/utils/TiptapExtensions';
const pocketbase = new PocketBase('http://127.0.0.1:8090');

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<pb.PostsResponse>();

  const fetchData = async () => {
    try {
      const data: pb.PostsResponse[] = await pocketbase
        .collection('posts')
        .getFullList();

      if (data && data.length > 0) {
        const { id } = params;
        const post = data.find((post) => post.uid === id);

        console.log('Post:', post);

        if (post) {
          setPost({
            ...post,
            content: generateHTML(post?.content as JSONContent, Extensions),
          });
        } else {
          console.log('No post found');
        }

        /* const id = data.map((post, index) => {
          console.log('Post content:', post?.content);
          return {
            content: generateHTML(post?.content as JSONContent, Extensions),
          };
        }); */
      } else {
        console.log('No data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*
   * TODO: Add a better ID number (not a string)
   * TODO: Make the content centered
   * TODO: Add a back button
   * TODO: Add a copy link button
   */

  return (
    <div className="container my-8">
      {!post ? (
        <>
          <h1>Loading…</h1>
        </>
      ) : (
        <Card content={post.content as string} date={post.created} />
      )}
    </div>
  );
}
