'use client';

import SuccessClient from './SuccessClient';

interface PageProps {
  searchParams: Promise<{ session_id: string }>;
}

export default async function SuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  return <SuccessClient sessionId={params.session_id} />;
}
