// components/Navbar.js
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { signOutUser } from '../../firebase';

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      // Redirect or update UI
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-red-700 text-white container mx-auto px-4 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="text-white font-bold text-xl cursor-pointer"  >
                Stylish Store
              </a>
            </div>
          </div>
          <div className="flex items-center">
            {loading ? (
              <span className="text-gray-300">Loading...</span>
            ) : user ? (
              <div className="flex items-center">
                <span className="text-gray-300 mr-4">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <Link href="/signin">
                  <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                    Sign In
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                    Sign Up
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}