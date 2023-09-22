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
import type * as pb from '@/types/pocketbase-types';

const pocketbase = new PocketBase('http://127.0.0.1:8090');

type ErrorType = {
  status: number;
  message: string;
};

export default function NewArticle() {
  const [isPublic, setPublic] = useState(true);
  const [fileURL, setFileURL] = useState<string>('');
  const [content, setContent] = useState<string | JSONContent | undefined>();
  const [error, setError] = useState<ErrorType | null>(null);
  /* 
  TODO: Update uploadFile with Amazon S3
  TODO: Add AlertComponent
  */

  const uploadFile = async (e: any) => {
    console.log('You should think about updating this function :)');
    /* const { data } = await supabase.storage
      .from('posts')
      .upload(e?.target?.files[0].name, e.target.files[0]);
    setFileURL(data?.path as string); */
  };

  (async () => {
    const adm = await pocketbase.authStore.isAdmin;
  })();

  const handleNewPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const data = await pocketbase.collection('posts').create({
        title: formData.get('title') as string,
        content: content,
        description: formData.get('description') as string,
        public: isPublic,
        slug: Slugify(formData.get('title') as string),
      });
    } catch (err: any) {
      if (err.status === 400) {
        const firstDataEntryKey = Object.keys(err.response.data)[0];
        const errorMessage = err.response.message;
        const nestedErrorMessage = err.response.data[firstDataEntryKey].message;
        const resultString = `"${firstDataEntryKey}": ${nestedErrorMessage}`;
        setError(err);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleNewPost}
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
              <input type="text" placeholder={'Title'} name="title" />
            </div>
            <div className="label w-full">
              <input
                type="text"
                placeholder={'Description courte'}
                name="description"
              />
            </div>
          </div>

          <div className="label">
            <label htmlFor="public">Public</label>
            <input
              type="checkbox"
              name="public"
              defaultChecked={true}
              checked={isPublic}
              onChange={(e) => setPublic(e.currentTarget.checked)}
            />
          </div>
          <button type="submit" className={'absolute bottom-4 right-4'}>
            Publier
          </button>
        </div>
        <div className="label h-screen overflow-y-scroll">
          <Tiptap content={content} state={(e) => setContent(e)} />
          {/* <Input type="text" placeholder={'Content'} name="content" /> */}
        </div>
      </form>
    </>
  );
}
