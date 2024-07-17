'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { schema, BookFormData } from '../_schemas/bookFinderSchema';
import { BookResultsTypes } from '../_types/bookTypes';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';
import { fetcher } from '../_utils/fetcher';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const BookFinder: FC = () => {
    const [bookName, setBookName] = useState<string>('');
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<BookFormData>({
        resolver: zodResolver(schema),
    });
    const {
        data: results,
        isLoading,
        error,
    } = useSWR(
        bookName
            ? `/api/search?bookName=${encodeURIComponent(bookName)}`
            : null,
        fetcher,
    );

    const handleBookSubmit = (data: BookFormData) => {
        setBookName(data.bookName);
        reset();
    };

    if (error)
        return (
            <p className='text-xl font-bold text-red-500'>
                Failed to fetch results.
            </p>
        );
    if (isLoading) return <Loader2 className='h-8 w-8 animate-spin' />;

    return (
        <div className='flex min-h-screen flex-col items-center bg-gray-100 py-10'>
            <h1 className='prose-h1: prose mb-6 text-3xl font-bold'>
                Book Finder
            </h1>
            <form
                onSubmit={handleSubmit(handleBookSubmit)}
                className='mb-6 w-full max-w-md'
            >
                <Input
                    type='text'
                    {...register('bookName')}
                    placeholder='Enter book name'
                    className={`mb-4 w-full rounded-md border p-3 ${errors.bookName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.bookName && (
                    <p className='mb-2 text-red-500'>
                        {errors.bookName.message}
                    </p>
                )}
                <Button
                    type='submit'
                    variant={'default'}
                    className='w-full rounded-md py-3 text-white transition duration-300'
                >
                    Search
                </Button>
            </form>
            <ul className='w-full max-w-md'>
                {results &&
                    results.map((result: BookResultsTypes, index: number) => (
                        <motion.li
                            key={index}
                            className='mb-2'
                            initial={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className='prose-h1: prose'>
                                        {result.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Link
                                        href={result.link}
                                        className='text-blue-500'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        View Book
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.li>
                    ))}
            </ul>
        </div>
    );
};

export default BookFinder;
