'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      try {
        // Decode JWT payload safely
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const payload = JSON.parse(jsonPayload);
        const now = Date.now() / 1000;

        if (payload.exp && payload.exp < now) {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.push('/store');
        } else {
          // Token valid - check role
          if (role === 'admin') {
            router.push('/backoffice/dashboard');
          } else {
            router.push('/store');
          }
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/store');
      }
    } else {
      // No token
      router.push('/store');
    }
  }, [router]);

  return <div />;
}
