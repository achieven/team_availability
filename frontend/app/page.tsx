'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { initializeApp } from '../store/slices/initializeSlice';
import { setAuthenticated, user, getProfile } from '../store/slices/authSlice';

export default function RootPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.isInitialized);

  useEffect(() => {
    const initProfile = async () => {
              try {
          dispatch(getProfile()).unwrap();
        } catch (error) {
          console.error('Profile loading failed:', error);
        }
    }
    initProfile()
  }, []);


  useEffect(() => {
    if (user) {
      router.push('/status');
    }
  }, [user]);

 
  const performInitialization = async () => {
    console.log('performInitialization called');
    try {
      await dispatch(initializeApp()).unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Initialization failed:', error);
      // Handle error but don't redirect
    }
  };

  // Show loading state while initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Initializing...</h2>
          <p className="text-gray-600 mt-2">Setting up your application</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initialization Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show success state after initialization
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl mx-auto p-6">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">App Initialized</h2>
        <p className="text-gray-600 mb-6">Your application is ready to use</p>
        
        {/* Display Users and Teams Data */}
        
        <div className="space-y-3">
          <button 
            onClick={() => performInitialization()} 
            className="block w-full bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
          >
            Initialize app
          </button>
        </div>
      </div>
    </div>
  );
}
