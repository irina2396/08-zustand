
import { fetchNoteById } from '@/lib/api';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';


interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteDetails({ params }: Props) {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  )
}
