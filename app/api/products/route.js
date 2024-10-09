
import { getApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';


// Initialize Firebase
const app = getApp();
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { page = '1', limit = '20', lastVisible, search, category, sort = 'createdAt_desc' } = req.query;
  const pageSize = parseInt(limit, 20);
  const pageNumber = parseInt(page, 20);

  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef);

    // Apply category filter
    if (category) {
      q = query(q, where('categoryId', '==', category));
    }

    // Apply sorting
    const [sortField, sortDirection] = sort.split('_');
    q = query(q, orderBy(sortField, sortDirection));

    

    // Fetch one extra product to determine if there are more results
    q = query(q, limit(pageSize + 1));

    // Fetch products
    const snapshot = await getDocs(q);
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Determine if there are more results
    const hasMore = products.length > pageSize;
    if (hasMore) {
      products.pop(); // Remove the extra product
    }

    

    // Get the last visible value for the next query
    const lastVisibleProduct = products[products.length - 1];
    const lastVisibleValue = lastVisibleProduct ? lastVisibleProduct[sortField] : null;

    res.status(200).json({
      products,
      lastVisible: lastVisibleValue,
      hasMore,
      totalProducts,
      currentPage: pageNumber
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}