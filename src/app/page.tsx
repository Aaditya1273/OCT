'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LandingPage from '../components/LandingPage';

export default function Home() {
  const account = useCurrentAccount();
  const router = useRouter();

  useEffect(() => {
    if (account?.address) {
      router.push('/game');
    }
  }, [account, router]);

  return <LandingPage />;
}
