'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import css from './NotesPage.module.css'
import { fetchNotes, FetchNotesResponse } from '@/lib/api'
import { useState } from 'react'
import SearchBox from '@/components/SearchBox/SearchBox'
import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import Modal from '@/components/Modal/Modal'
import NoteForm from '@/components/NoteForm/NoteForm'
import { useDebounce } from 'use-debounce'
import 'modern-normalize/modern-normalize.css';

type Props = {
  initialNotes: FetchNotesResponse;
  initialTag?: string | null;
}

function NotesClient({initialNotes,  initialTag}: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['notes', page, debouncedSearch, initialTag],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch, ...(initialTag && initialTag !== 'All' ? { tag: initialTag } : {}), }),
    placeholderData: keepPreviousData,
    initialData: page === 1 && debouncedSearch === '' ? initialNotes : undefined, 

  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePage = ( newPage: number ) => {
    setPage(newPage);
  }

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={handleSearch} />
          
            {data && data.totalPages > 1 && (
              <Pagination
                pageCount={data.totalPages}
                onPageChange={handlePage}
                currentPage={page - 1}
              />
            )}

          <button onClick={openModal} className={css.button}>Create note +</button>
        </header>
        
        {data && data.notes && data.notes.length > 0 ? (
          <>
            <NoteList notes={data.notes} />
          </>
        ) : (
          !isLoading && <div className={css.noNotes}>No notes found</div>  
        )}
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )}
        </div>
    </>
  )
}

export default NotesClient;