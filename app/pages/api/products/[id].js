
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from  'next/navigation';
import { fetchProductById } from '../../api';

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

  const { id } = req.query;

  if (!id) {
    return res.status(200).json({ message: 'Product ID is required' });
  }

  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    // if (!productSnap.exists()) {
    //   return res.status(404).json({ message: 'Product not found' });
    // }

    // const product = {
    //   id: productSnap.id,
    //   ...productSnap.data()
    // };
    const product = await fetchProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default function ProductDetails({ product }) {
  const router = useRouter();
  const { id } = router.query;

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Details for {product.name}</h1>
      <p>ID: {id}</p>
      <p>Description: {product.description}</p>
      <p>Price: {product.price}</p>
      {/* Add other product details */}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await fetch(`/api/products/${id}`);
    const product = await res.json();

    return {
      props: { product }, // will be passed to the page component as props
    };
  } catch (error) {
    return {
      notFound: true, // if product not found, return 404 page
    };
  }
}