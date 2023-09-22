'use client';
import { cookies } from 'next/headers';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import PocketBase from 'pocketbase';
import Link from 'next/link';

const pocketbase = new PocketBase('http://localhost:8090');

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const supabase = createClientComponentClient<Database>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* (async () => {
    const {
      data,
      data: { user },
    } = await supabase.auth.getUser();
    if (!data) {
      setIsLoading(true);
    }
    if (user) {
      setIsLoggedIn(true);
    }
  })();

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.refresh();
  };

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      setIsLoggedIn(false);
    }
  };

  const retrieveSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log(data);
  }; */

  (async () => {
    const data = await pocketbase.authStore.model;
    if (data) {
      setIsLoggedIn(true);
    }
  })();

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await pocketbase.admins.authWithPassword(email, password);
    setIsLoggedIn(true);
    // await pocketbase.admins.authWithPassword(email, password);
  };

  const retrieveSession = async () => {
    const data = pocketbase.authStore.token;
    console.log(data);
  };

  const handleLogOut = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = pocketbase.authStore.clear();
    setIsLoggedIn(false);
    console.log(data);
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : isLoggedIn ? (
        <div className={'flex gap-4 w-[512px] p-4'}>
          <button onClick={retrieveSession}>Retrieve session</button>
          <button type="submit" onClick={handleLogOut}>
            Log out
          </button>
          <Link href={'/admin/post/new'}>
            <button>Create new post</button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSignIn} className={'flex gap-4 w-[512px] p-4'}>
          <input
            type="text"
            name="email"
            onChange={(e) => {
              e.preventDefault();
              setEmail(e.target.value);
            }}
            value={email}
            placeholder={'Email'}
          />
          <input
            type="password"
            name="password"
            onChange={(e) => {
              e.preventDefault();
              setPassword(e.target.value);
            }}
            value={password}
            placeholder={'Password'}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </>
  );
}
