import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function IndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/welcome');
  }, [router]);
  return null;
}