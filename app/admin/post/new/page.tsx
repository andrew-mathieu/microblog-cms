'use client';
import { FormEvent, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import Slugify from '@/slugify';
import * as z from 'zod';
import PocketBase from 'pocketbase';
import Tiptap from '@/components/Tiptap';
import type { JSONContent } from '@tiptap/react';
import Extensions from '@/utils/TiptapExtensions';
import type * as pb from '@/types/pocketbase-types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { generateHTML } from '@tiptap/html';
import { customAlphabet } from 'nanoid';
const pocketbase = new PocketBase('http://127.0.0.1:8090');

type ErrorType = {
  status: number;
  message: string;
};

export default function NewArticle() {
  const router = useRouter();
  const [content, setContent] = useState<string | JSONContent | undefined>();
  const [posts, setPosts] = useState<pb.PostsResponse[]>();
  const nanoid = customAlphabet('1234567890', 16);

  const checkIfAdmin = async () => {
    const adm = await pocketbase.authStore.isAdmin;
    if (!adm) {
      router.push('/posts');
    }
  };

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
          .map((post) => {
            console.log('Post content:', post?.content);
            return {
              ...post,
              content: generateHTML(post?.content as JSONContent, Extensions),
            };
          });
        setPosts(sortedPosts);
      } else {
        console.log('No data');
        // You can set a state here to indicate no data, and handle it in your UI
        // For example:
        // setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error, for example:
      // setPosts([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    checkIfAdmin();
  }, []);

  const handleNewPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const data = await pocketbase.collection('posts').create({
        uid: nanoid(),
        content: content,
      });
      await fetchData();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const data = await pocketbase.collection('posts').delete(id);
      await fetchData();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleNewPost}>
        <div className="h-[50vh] border-b border-zinc-900 relative">
          <Tiptap content={content} state={(e) => setContent(e)} />
          <Button
            value={"Publier sur l'internet"}
            type="submit"
            className={
              'absolute bottom-4 right-4 text-zinc-700 bg-zinc-900 px-8 py-4 rounded-lg cursor-pointer hover:bg-zinc-800 hover:text-zinc-100 font-medium transition-colors'
            }
          />
        </div>
      </form>
      <div className={'p-8'}>
        <ul className="flex flex-col gap-8">
          {posts?.map((post) => (
            <li key={post.id}>
              <Card
                id={post.id}
                content={post.content as string}
                date={post.created}
                delete={true}
                deleteFn={() => {
                  handleDeletePost(post.id);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
