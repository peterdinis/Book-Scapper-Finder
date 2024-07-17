"use client";

import {Ghost} from "lucide-react"
import { FC, useState } from "react";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; 

// Define your schema using Zod
const schema = z.object({
  bookName: z.string().min(1, { message: "Book name is required" }),
});

type FormValues = {
  bookName: string;
};

const BookFinder: FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [results, setResults] = useState<{ title: string; link: string }[]>([]); // State for results

  const onSubmit = async (data: FormValues) => {
    const res = await fetch(`/api/search?bookName=${encodeURIComponent(data.bookName)}`);
    
    if (!res.ok) {
      console.error("Failed to fetch");
      return;
    }
    
    const resultsData = await res.json();
    setResults(resultsData); // Set the results in state
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">Book Finder</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 w-full max-w-md">
        <FormField name="bookName" control={control}>
          {({ field }) => (
            <FormControl>
              <FormLabel>Book Name</FormLabel>
              <Input
                {...field}
                placeholder="Enter book name"
                className={`w-full p-3 border border-gray-300 rounded-md mb-4 ${errors.bookName ? 'border-red-500' : ''}`}
              />
              {errors.bookName && (
                <FormMessage>{errors.bookName.message}</FormMessage>
              )}
            </FormControl>
          )}
        </FormField>
        <Button
          type="submit"
          variant={"default"}
          className="w-full text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Search
        </Button>
      </Form>
      {results.length > 0 && ( // Check if there are results to display
        <ul className="w-full max-w-md mt-4">
          {results.map((result, index) => (
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
      )}
      {results.length === 0 && <p className="text-gray-500 mt-4"><Ghost className="animate-bounce w-7 h-7" />No results found.</p>}
    </div>
  );
};

export default BookFinder;