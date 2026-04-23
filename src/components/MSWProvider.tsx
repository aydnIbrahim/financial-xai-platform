'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        const { worker } = await import('../mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      }
      setMswReady(true);
    };

    init();
  }, []);

  if (!mswReady) {
    return null; // Veya bir loading spinner
  }

  return <>{children}</>;
}
