'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useCart } from '@/context/CartContext';

interface SuccessClientProps {
  sessionId: string;
}

export default function SuccessClient({ sessionId }: SuccessClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { refreshCart } = useCart();

  useEffect(() => {
    const processOrder = async () => {
      try {
        const response = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to process order');
        }

        await refreshCart(); // Refresh cart before navigation
        router.push('/dashboard');
      } catch (error) {
        setError('Failed to process your order. Please contact support.');
        console.error('Order processing error:', error);
      }
    };

    if (sessionId) {
      processOrder();
    }
  }, [sessionId, router, refreshCart]);

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
