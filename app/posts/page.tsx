'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PocketBase, { ListResult } from 'pocketbase';
const pocketbase = new PocketBase('http://127.0.0.1:8090');
import type * as pb from '@/types/pocketbase-types';

export default function Posts() {
  // const supabase = createClientComponentClient<Database>();
  const [posts, setPosts] = useState<pb.PostsResponse[] | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.info('Fetching data…');
        const data: pb.PostsResponse[] = await pocketbase
          .collection('posts')
          .getFullList();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(posts);

  return (
    <>
      <h1>Posts</h1>
      {!posts?.length ? (
        <>
          <h1>Loading…</h1>
        </>
      ) : (
        <ul className={'grid grid-cols-3 p-4 gap-4'}>
          {posts?.map((post) => (
            <li key={post.id}>
              <Link href={'/posts/[slug]'} as={`/posts/${post.slug}`}>
                <div className={'card'}>
                  <div className={'card-header'}>
                    <div className={'card-title'}>{post.title}</div>
                    <div className={'card-description'}>{post.description}</div>
                  </div>
                  <div className={'card-footer'}>
                    <p>
                      Publié le{' '}
                      {new Date(post.created).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
