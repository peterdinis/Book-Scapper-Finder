"use client";

import { FC, Key, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schema, BookFormData } from "./bookFinderSchema";
import { BookResultsTypes } from "../_types/bookTypes";

const BookFinder: FC = () => {
  const [results, setResults] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookFormData>({
    resolver: zodResolver(schema),
  });

  const handleBookSubmit = async (data: BookFormData) => {
    const res = await fetch(
      `/api/search?bookName=${encodeURIComponent(data.bookName)}`
    );
    if (!res.ok) {
      console.error("Failed to fetch");
      return;
    }
    const dataResults = await res.json();
    setResults(dataResults);
    reset();
  };

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
        {results.map((result: BookResultsTypes, index: Key) => (
          <li key={index} className="bg-white p-4 mb-2 shadow-md rounded-md">
            <a
              href={result.link}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookFinder;