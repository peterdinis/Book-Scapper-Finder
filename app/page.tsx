"use client"

import { useState } from 'react';

const Homepage = () => {
  const [bookName, setBookName] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/search?bookName=${encodeURIComponent(bookName)}`);
    if (!res.ok) {
      console.error('Failed to fetch');
      return;
    }
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">Book Finder</h1>
      <form onSubmit={handleSubmit} className="mb-6 w-full max-w-md">
        <input
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder="Enter book name"
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Search
        </button>
      </form>
      <ul className="w-full max-w-md">
        {results.map((result: any, index) => (
          <li key={index} className="bg-white p-4 mb-2 shadow-md rounded-md">
            <a href={result.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Homepage;