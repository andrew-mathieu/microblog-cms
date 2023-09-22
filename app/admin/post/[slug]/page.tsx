'use client';
import { FormEvent, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/database.types';
import Slugify from '@/slugify';
import * as z from 'zod';
import Tiptap from '@/components/Tiptap';
import type { JSONContent } from '@tiptap/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PocketBase from 'pocketbase';
import type * as pb from '@/types/pocketbase-types';

console.clear();

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters' }),
  content: z
    .string()
    .min(5, { message: 'Content must be at least 5 characters' }),
  public: z.boolean(),
});

const pocketbase = new PocketBase('http://127.0.0.1:8090');

export default function NewArticle({ params }: { params: { slug: string } }) {
  const [isConnected, setIsConnected] = useState();

  const [isPublic, setPublic] = useState(true);
  const [fileURL, setFileURL] = useState<string>('');
  const [post, setPost] = useState<pb.PostsResponse | null>();
  const [content, setContent] = useState<JSONContent | string | undefined>();

  (async () => {
    /* const {
      data,
      data: { user },
    } = await supabase.auth.getUser(); */
    const adm = await pocketbase.authStore.isAdmin;
  })();

  const uploadFile = async (e: any) => {
    console.log('You should think about updating this function :)');
    /* const { data } = await supabase.storage
      .from('posts')
      .upload(e?.target?.files[0].name, e.target.files[0]);
    setFileURL(data?.path as string); */
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id: pb.PostsResponse = await pocketbase.collection('posts').get;
        const data: pb.PostsResponse = await pocketbase
          .collection('posts')
          .getOne(params.slug);

        setPost(data);
        setContent(data.content as JSONContent);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.slug]); // Include params.slug as a dependency
  const handleUpdatePost = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      if (post) {
        console.log(post.id);
        (await pocketbase.collection('posts').update(post.id, {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          public: isPublic,
          image: fileURL,
          slug: params.slug,
        })) as pb.PostsResponse;
        /* await supabase
          .from('posts')
          .update({
            id: post.id,
            content: content as JSONContent,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            public: isPublic,
            image: fileURL,
            slug: params.slug,
          })
          .eq('id', post.id)
          .select(); */
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleUpdatePost}
        className={'grid grid-cols-2 min-h-screen'}
      >
        <div className={'flex flex-col gap-4 p-4 relative'}>
          <div className="label">
            <input
              type="file"
              placeholder={'Image'}
              name="image"
              onChange={(e) => uploadFile(e)}
            />
          </div>
          <div className={'flex gap-4'}>
            <div className="label w-full">
              <input
                type="text"
                placeholder={'Title'}
                name="title"
                defaultValue={post?.title}
              />
            </div>
            <div className="label w-full">
              <input
                type="text"
                placeholder={'Description courte'}
                name="description"
                defaultValue={post?.description}
              />
            </div>
          </div>

          <div className="label">
            <label htmlFor="public">Public</label>
            <input
              type="checkbox"
              name="public"
              defaultChecked={post?.public as boolean}
              onChange={(e) => setPublic(e.currentTarget.checked)}
              checked={isPublic}
            />
          </div>
          <button type="submit" className={'absolute bottom-4 right-4'}>
            Mettre à jour
          </button>
        </div>
        <div className="label h-screen overflow-y-scroll">
          {post ? (
            <>
              {JSON.stringify(content)}
              <Tiptap
                content={content || ''}
                state={(e) => setContent(e)}
                isEditable={true}
                existingContent={post ? (post.content as JSONContent) : ''}
              />
            </>
          ) : (
            <h1>No content available.</h1>
          )}
        </div>
      </form>
    </>
  );
}
