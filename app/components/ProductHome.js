"use client";
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthProvider } from '../components/AuthProvider';
import Navbar from '../components/Navbar'
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';
import FilterSort from './FilterSort';


async function getServerSideProducts(searchParams) {
  const { search, category, order, page } = searchParams;
  const limit = 20;
  const skip = (page - 1) * limit;
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    skip: skip.toString(),
    ...(search && { search }),
    ...(category && { category }),
    ...(order && { order }),
  });

  const res = await fetch(`https://next-ecommerce-api.vercel.app/api/products?${queryParams}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default function ProductHome() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const totalPages = 10; 

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || '',
    sortOrder: searchParams.get('sortOrder') || '',
    page: currentPage,
  });

  // Fetch products and categories whenever filters or page changes
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoading(true);
      try {

        const { search, category, sortBy, sortOrder, page } = filters;
        const limit = 20;
        const skip = (page - 1) * limit;
        const queryParams = new URLSearchParams({
          limit: limit.toString(),
          skip: skip.toString(),
          ...(search && { search }),
          ...(category && { category }),
          ...(sortBy && { sortBy }),
          ...(sortOrder && { sortOrder }),
        });

        const productResponse = await fetch(`https://next-ecommerce-api.vercel.app/products?${queryParams}`);
        
        if (!productResponse.ok) {
          throw new Error(`HTTP error! Status: ${productResponse.status}`);
        }

        const productData = await productResponse.json();
        setProducts(productData);

        // Fetch categories
        const categoryRes = await fetch('http://localhost:3000/api/categories');
        if (!categoryRes.ok) {
          throw new Error(`HTTP error! Status: ${categoryRes.status}`);
        }
        const categoryData = await categoryRes.json();
        setCategories(categoryData.map(cat => cat.name));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, [filters, currentPage]);

  // Function to update filters and URL parameters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    updateURL(newFilters);
  };

  const updateURL = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`/?${newParams.toString()}`, undefined, { shallow: true });
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateFilters({ page });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ search: '', category: '', sortBy: '', sortOrder: '', page: 1 });
    router.push('/', undefined, { shallow: true });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthProvider>
      <Navbar />
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900 transition-colors duration-300">
        <HeroSection />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Explore Our Products</h2>
          <Suspense fallback={<div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>}>
            <SearchBar initialSearch={filters.search} onSearch={(search) => updateFilters({ search })} />
            <FilterSort
              categories={categories}
              initialCategory={filters.category}
              initialSortBy={filters.sortBy}
              initialSortOrder={filters.sortOrder}
              onFilter={(category) => updateFilters({ category })}
              onSort={(sortBy, sortOrder) => updateFilters({ sortBy, sortOrder })}
            />
            <button
              onClick={resetFilters}
              className="bg-gradient-to-r from-pink-500 to-red-700 text-white px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 mt-4"
            >
              Reset Filters
            </button>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <>
                <ProductGrid products={products} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  loading={loading}
                  products={products}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </Suspense>
        </div>
      </div>
    </AuthProvider>
  );
  
}
