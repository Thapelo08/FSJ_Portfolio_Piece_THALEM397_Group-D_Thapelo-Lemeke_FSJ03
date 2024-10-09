import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

export async function GET() {
  // if (req.method !== 'GET') {
  //   res.setHeader('Allow', ['GET']);
  //   return res.status(405).end(`Method ${req.method} Not Allowed`);
  // }

  try {
    const categoriesRef = doc(db, 'categories', 'allCategories');
    const snapshot = await getDoc(categoriesRef);

    // const categories = ;

    // console.log('categories', categories)

    // Sort categories alphabetically by name
    // categories.sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify(snapshot.data().categories), { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(JSON.stringify({ error: error.message}), {status: 500});
    // res.status(500).json({ message: 'Internal Server Error' });
  }
}
