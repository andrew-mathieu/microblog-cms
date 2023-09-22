'use client';
import { cookies } from 'next/headers';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import PocketBase from 'pocketbase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const pocketbase = new PocketBase('http://localhost:8090');

export default function Home() {
  return (
    <>
      <h1>Hello world</h1>
    </>
  );
}
