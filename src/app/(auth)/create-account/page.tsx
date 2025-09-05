'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAccountPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new signup page
    router.replace('/signup');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner" />
        <p className="mt-4 text-gray-600">Redirecting to signup...</p>
      </div>
    </div>
  );
}