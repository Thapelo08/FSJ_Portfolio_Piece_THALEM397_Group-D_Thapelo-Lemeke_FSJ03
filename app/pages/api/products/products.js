// pages/api/products.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import Fuse from 'fuse.js';

// Your Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { page = '1', limit = '10', lastVisible, search, category, sort = 'createdAt_desc' } = req.query;
  const pageSize = parseInt(limit, 10);
  const pageNumber = parseInt(page, 10);

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

    // Apply pagination
    if (lastVisible) {
      const lastVisibleValue = sortField === 'price' ? parseFloat(lastVisible) : lastVisible;
      const lastVisibleDoc = await getDocs(query(productsRef, where(sortField, '==', lastVisibleValue), limit(1)));
      if (!lastVisibleDoc.empty) {
        q = query(q, startAfter(lastVisibleDoc.docs[0]));
      }
    }

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

    // Apply search if provided
    let totalProducts = products.length;
    if (search) {
      const fuse = new Fuse(products, {
        keys: ['title', 'description'],
        threshold: 0.3,
      });
      products = fuse.search(search).map(result => result.item);
      totalProducts = products.length; // Update total count after search
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