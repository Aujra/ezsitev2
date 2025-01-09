'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOrder = async () => {
      try {
        const response = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: searchParams.session_id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process order');
        }

        // Clear cart and redirect
        router.push('/dashboard');
      } catch (err) {
        setError('Failed to process your order. Please contact support.');
      }
    };

    if (searchParams.session_id) {
      processOrder();
    }
  }, [searchParams.session_id, router]);

  if (error) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen">
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>Processing your order...</Typography>
    </Box>
  );
}
