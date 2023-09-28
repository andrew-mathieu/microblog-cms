'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PocketBase, { ListResult } from 'pocketbase';
import type * as pb from '@/types/pocketbase-types';
import type { JSONContent } from '@tiptap/react';
import Card from '@/components/ui/Card';
import { generateHTML } from '@tiptap/html';
import Extensions from '@/utils/TiptapExtensions';
const pocketbase = new PocketBase('http://127.0.0.1:8090');

export default function Posts() {
  const [posts, setPosts] = useState<pb.PostsResponse[] | null>();

  const fetchData = async () => {
    try {
      const data: pb.PostsResponse[] = await pocketbase
        .collection('posts')
        .getFullList();

      if (data && data.length > 0) {
        const sortedPosts = data
          .map((post) => ({
            ...post,
            createdTimestamp: new Date(post.created).getTime(),
          }))
          .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
          .map((post, index) => {
            console.log('Post content:', post?.content);
            return {
              key: index,
              ...post,
              content: generateHTML(post?.content as JSONContent, Extensions),
            };
          });
        setPosts(sortedPosts);
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

  return (
    <div className="container my-8">
      {!posts?.length ? (
        <>
          <h1>Loading…</h1>
        </>
      ) : (
        <ul className={'flex flex-col gap-8'}>
          {posts?.map((post, index) => (
            <li key={parseInt(post.id)}>
              <Card
                content={post.content as string}
                date={post.created}
                uid={post.uid}
                shareable={true}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
