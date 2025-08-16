import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({params}: Props) {
  const { slug } = await params;
  const tag = slug?.[0] || null;
  const res = await fetchNotes({ page: 1, perPage: 12, ...(tag && tag !== 'All' ? {tag} : {}) });

  return (
    <NotesClient initialNotes={res} initialTag={ tag} />
  );
}
