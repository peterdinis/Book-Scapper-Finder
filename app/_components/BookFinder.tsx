"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schema, BookFormData } from "../_schemas/bookFinderSchema";
import { BookResultsTypes } from "../_types/bookTypes";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { fetcher } from "../_utils/fetcher";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const BookFinder: FC = () => {
  const [bookName, setBookName] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookFormData>({
    resolver: zodResolver(schema),
  });
  const { data: results, isLoading, error } = useSWR(bookName ? `/api/search?bookName=${encodeURIComponent(bookName)}` : null, fetcher);

  const handleBookSubmit = (data: BookFormData) => {
    setBookName(data.bookName);
    reset();
  };

  if (error) return <p className="text-red-500 font-bold text-xl">Failed to fetch results.</p>;
  if (isLoading) return <Loader2 className="animate-spin w-8 h-8" />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl prose prose-h1: font-bold mb-6">Book Finder</h1>
      <form onSubmit={handleSubmit(handleBookSubmit)} className="mb-6 w-full max-w-md">
        <Input
          type="text"
          {...register("bookName")}
          placeholder="Enter book name"
          className={`w-full p-3 border rounded-md mb-4 ${errors.bookName ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.bookName && <p className="text-red-500 mb-2">{errors.bookName.message}</p>}
        <Button
          type="submit"
          variant={"default"}
          className="w-full text-white py-3 rounded-md transition duration-300"
        >
          Search
        </Button>
      </form>
      <ul className="w-full max-w-md">
        {results && results.map((result: BookResultsTypes, index: number) => (
          <motion.li 
            key={index} 
            className="mb-2"
            initial={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="prose prose-h1:">{result.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={result.link}
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
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