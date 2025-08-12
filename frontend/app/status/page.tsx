'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { fetchCurrentStatus, updateStatus, clearError } from '../../store/slices/statusSlice';

interface StatusForm {
  status: string;
}

const statusOptions = [
  { value: 'available', label: 'Available', color: 'bg-green-500' },
  { value: 'busy', label: 'Busy', color: 'bg-red-500' },
  { value: 'away', label: 'Away', color: 'bg-yellow-500' },
  { value: 'offline', label: 'Offline', color: 'bg-gray-500' },
];

export default function StatusPage() {
  console.log('StatusPage component rendered');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { currentStatus, loading, error } = useSelector((state: RootState) => state.status as any);
  const hasRedirected = useRef(false);
  
  console.log('Auth state:', { isAuthenticated, user });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StatusForm>();

  useEffect(() => {
    console.log('StatusPage useEffect triggered - isAuthenticated:', isAuthenticated, 'hasRedirected:', hasRedirected.current);
    
    if (!isAuthenticated && !hasRedirected.current) {
      console.log('Redirecting to login');
      hasRedirected.current = true;
      router.push('/login');
      return;
    }
    
    if (isAuthenticated) {
      console.log('Fetching current status');
      dispatch(fetchCurrentStatus());
    }
  }, [isAuthenticated]); // Remove router and dispatch from dependencies

  useEffect(() => {
    if (currentStatus) {
      setValue('status', currentStatus.status);
    }
  }, [currentStatus, setValue]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  const onSubmit = async (data: StatusForm) => {
    await dispatch(updateStatus(data.status));
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.label || 'Unknown';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Update Your Status
                </h2>
                <p className="text-sm text-gray-600">
                  Welcome, {user?.name || user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>

            {currentStatus && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Current Status</h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus.status)}`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {getStatusLabel(currentStatus.status)}
                  </span>
                  {currentStatus.message && (
                    <span className="text-sm text-gray-600">- {currentStatus.message}</span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>



              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
