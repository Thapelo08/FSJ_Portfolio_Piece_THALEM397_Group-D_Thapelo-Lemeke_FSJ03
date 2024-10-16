// export default function productPage() {
//   return (
//     <h1>ProductPage</h1>
//   )
// }



import { notFound } from 'next/navigation';
import { ProductDetail } from '../../components/ProductDetails' 
import { fetchProductById } from '@/app/api';



/**
 * ProductPage component to display the product details.
 * 
 * @param {Object} props - The props object.
 * @param {Object} props.params - The route parameters.
 * @returns {JSX.Element} The rendered ProductDetail component.
 */
export default async function ProductPage({ params }) {
   const product = await fetchProductData(params.id);

  return <ProductDetail product={product} />;
}






/**
 * 
 * 
 * @param {Object} params - The route parameters.
 * @returns {Object} The metadata for the product page.
 */
export async function generateMetadata({ params }) {
  const product = await fetchProductById(params.id);
  

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.title} | Stylish Store`,
    description: product.description,
  };
}

/**
 * Fetch product data by ID.
 * 
 * @param {string} id - The ID of the product.
 * @returns {Promise<Object>} The product data.
 */
async function fetchProductData(id) {
   const product = await fetchProductById(id);
  if (!product) notFound();
  return product;
}


