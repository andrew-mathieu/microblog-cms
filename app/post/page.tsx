'use client';
import { useRouter } from 'next/navigation';

export default function Posts() {
  const router = useRouter();
  router.push('/');
  return <>Redirecting…</>;
}
