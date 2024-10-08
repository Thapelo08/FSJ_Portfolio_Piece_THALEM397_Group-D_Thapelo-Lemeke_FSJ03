/**
 * Filter component for filtering and sorting products.
 * 
 * @param {Object} props - The properties object.
 * @param {Array<string>} props.categories - The list of categories to filter by.
 * @param {string} props.currentCategory - The currently selected category.
 * @param {string} props.currentSortBy - The current sorting criteria.
 * @param {string} props.currentSortOrder - The current sorting order.
 * @param {Function} props.onFilter - Callback function to handle filtering by category.
 * @param {Function} props.onSort - Callback function to handle sorting.
 * 
 * @returns {JSX.Element} The rendered Filter component.
 */
export default function FilterSort({
    categories,
    currentCategory,
    currentSortBy,
    currentSortOrder,
    onFilter,
    onSort
  }) {
    // Handle category filter change
    const handleFilter = (e) => {
      const selectedCategory = e.target.value;
      onFilter(selectedCategory);
    };
  
    // Handle sorting change
    const handleSort = (e) => {
      const [sortBy, sortOrder] = e.target.value.split('-');
      onSort(sortBy, sortOrder);
    };
  
    return (
      <div className="flex flex-wrap items-center gap-4 py-6 px-6 bg-pink-50 dark:bg-gray-900 text-amber-800 font-serif shadow-md rounded-lg">
        
        {/* Category Filter Dropdown */}
        <select
          value={currentCategory}
          onChange={handleFilter}
          className="w-full sm:w-auto p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Categories</option>
          {categories && categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
  
        {/* Sorting Dropdown */}
        <select
          value={`${currentSortBy}-${currentSortOrder}`}
          onChange={handleSort}
          className="w-full sm:w-auto p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A-Z</option>
          <option value="title-desc">Title: Z-A</option>
        </select>
      </div>
    );
  }
  