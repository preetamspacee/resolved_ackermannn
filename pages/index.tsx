import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard welcome page
    router.push('http://localhost:3001/welcome');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-700">
          Redirecting to Welcome Page...
        </h1>
        <p className="text-gray-500 mt-2">Taking you to the admin dashboard</p>
      </div>
    </div>
  );
}