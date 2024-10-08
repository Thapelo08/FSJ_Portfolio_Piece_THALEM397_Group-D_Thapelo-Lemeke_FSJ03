'use client';

import { useState, useEffect } from 'react'; 



export default function SearchBar({ currentSearch, onSearch }) {
  const [search, setSearch] = useState(currentSearch);
  

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        
        <form onSubmit={handleSearchSubmit} className="hidden sm:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="p-2 border rounded mr-2 "
          />
          <button type="submit" className="bg-gradient-to-r from-pink-500 to-red-700 text-white p-2 rounded">Search</button>
        </form>
      </div>
    </div>
  );
}
